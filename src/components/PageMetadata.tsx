import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  canonicalUrl,
  normalizeRoutePath,
  publicRoutes,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_URL,
} from "@/seo/pageMetadata";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string | null) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!url) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
}

const PageMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const routePath = normalizeRoutePath(pathname);
    const page = publicRoutes.find((item) => item.path === routePath);

    if (!page) {
      document.title = "Page not found | Global Hearts Community";
      upsertMeta("name", "robots", "noindex,follow");
      setCanonical(null);
      return;
    }

    const canonical = canonicalUrl(page.path);
    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", SOCIAL_IMAGE_URL);
    upsertMeta("property", "og:image:alt", SOCIAL_IMAGE_ALT);
    upsertMeta("property", "og:type", "website");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", SOCIAL_IMAGE_URL);
    upsertMeta("name", "twitter:image:alt", SOCIAL_IMAGE_ALT);
    document.head.querySelector('meta[name="robots"]')?.remove();
    setCanonical(canonical);
  }, [pathname]);

  return null;
};

export default PageMetadata;
