import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { createServer } from "vite";

const root = process.cwd();
const dist = path.join(root, "dist");
const vite = await createServer({
  mode: "production",
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: "custom",
  logLevel: "error",
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setMeta(html, attribute, key, value) {
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(value)}" />`;
  const matcher = new RegExp(`<meta(?=[^>]*\\b${attribute}="${escapeRegex(key)}")[^>]*>`);
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function setCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  const matcher = /<link\s+rel="canonical"[^>]*>/;
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function withRouteMetadata(template, route, siteUrl, imageUrl, imageAlt) {
  const canonical = route.path === "/" ? `${siteUrl}/` : `${siteUrl}${route.path}/`;
  let html = template.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`);
  html = setMeta(html, "name", "description", route.description);
  html = setMeta(html, "property", "og:title", route.title);
  html = setMeta(html, "property", "og:description", route.description);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "property", "og:image", imageUrl);
  html = setMeta(html, "property", "og:image:alt", imageAlt);
  html = setMeta(html, "property", "og:type", "website");
  html = setMeta(html, "name", "twitter:card", "summary_large_image");
  html = setMeta(html, "name", "twitter:title", route.title);
  html = setMeta(html, "name", "twitter:description", route.description);
  html = setMeta(html, "name", "twitter:image", imageUrl);
  html = setMeta(html, "name", "twitter:image:alt", imageAlt);
  return setCanonical(html, canonical);
}

try {
  const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
  const manifest = JSON.parse(await fs.readFile(path.join(dist, ".vite", "manifest.json"), "utf8"));
  const { publicRoutes, SITE_ORIGIN, SOCIAL_IMAGE_URL, SOCIAL_IMAGE_ALT, canonicalUrl } =
    await vite.ssrLoadModule("/src/seo/pageMetadata.ts");
  const { default: PageMetadata } = await vite.ssrLoadModule("/src/components/PageMetadata.tsx");
  const { TooltipProvider } = await vite.ssrLoadModule("/src/components/ui/tooltip.tsx");
  const { Toaster } = await vite.ssrLoadModule("/src/components/ui/toaster.tsx");
  const { Toaster: SonnerToaster } = await vite.ssrLoadModule("/src/components/ui/sonner.tsx");

  for (const route of publicRoutes) {
    const { default: Page } = await vite.ssrLoadModule(route.modulePath);
    const queryClient = new QueryClient();
    const pageHtml = renderToString(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(
            React.Fragment,
            null,
            React.createElement(Toaster),
            React.createElement(SonnerToaster),
            React.createElement(
              StaticRouter,
              { location: route.path },
              React.createElement(
                React.Fragment,
                null,
                React.createElement(PageMetadata),
                React.createElement(
                  React.Suspense,
                  {
                    fallback: React.createElement(
                      "div",
                      { className: "min-h-screen flex items-center justify-center bg-background" },
                      React.createElement("div", { className: "animate-pulse text-primary text-lg" }, "Loading..."),
                    ),
                  },
                  React.createElement(Page),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    const rootMarkup = `<div id="root" data-prerendered="true">${pageHtml}</div>`;
    let html = template.replace(/<div id="root"\s*><\/div>/, rootMarkup);
    if (!html.includes('data-prerendered="true"')) {
      throw new Error(`Could not locate the root element in the Vite output for ${route.path}`);
    }

    html = html.replace(/\/src\/assets\/([^"'\s)<>]+)/g, (sourceUrl, assetPath) => {
      const asset = manifest[`src/assets/${assetPath}`];
      if (!asset?.file) {
        throw new Error(`Could not map SSR asset ${sourceUrl} to a production file`);
      }
      return `/${asset.file}`;
    });
    html = withRouteMetadata(html, route, SITE_ORIGIN, SOCIAL_IMAGE_URL, SOCIAL_IMAGE_ALT);

    const routeDirectory = route.path === "/"
      ? dist
      : path.join(dist, ...route.path.split("/").filter(Boolean));
    await fs.mkdir(routeDirectory, { recursive: true });
    const outputPath = path.join(routeDirectory, "index.html");
    await fs.writeFile(outputPath, html);
    console.log(`Prerendered ${route.path} -> ${path.relative(root, outputPath)} (${pageHtml.length.toLocaleString()} HTML chars)`);
  }

  const sitemapUrls = publicRoutes
    .map((route) => `  <url><loc>${canonicalUrl(route.path)}</loc></url>`)
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
  await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);
  await fs.rm(path.join(dist, ".vite"), { recursive: true, force: true });
  console.log(`Generated sitemap.xml with ${publicRoutes.length} canonical routes`);
} finally {
  await vite.close();
}
