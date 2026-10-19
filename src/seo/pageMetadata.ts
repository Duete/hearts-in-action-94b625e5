export const SITE_ORIGIN = "https://www.globalheartscommunity.org";
export const SOCIAL_IMAGE_PATH = "/images/about-water-well-1440.webp";
export const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`;
export const SOCIAL_IMAGE_ALT = "Children and community members celebrate a Global Hearts Community water well in Mbale, Uganda.";

export const publicRoutes = [
  {
    path: "/",
    modulePath: "/src/pages/HomePage.tsx",
    title: "Global Hearts Community | Charity in Mbale, Uganda",
    description: "Global Hearts Community is a registered Ugandan charity in Mbale supporting communities through education, food assistance, health outreach, and more.",
  },
  {
    path: "/about",
    modulePath: "/src/pages/AboutPage.tsx",
    title: "About Global Hearts Community | Mbale, Uganda",
    description: "Learn about Global Hearts Community, a registered charity in Mbale, Uganda—our mission, community-led programs, values, and reported impact.",
  },
  {
    path: "/impact",
    modulePath: "/src/pages/ImpactPage.tsx",
    title: "Our Impact | Global Hearts Community",
    description: "Explore reported education, food assistance, health, and mobility milestones from Global Hearts Community's work in Mbale and nearby communities.",
  },
  {
    path: "/get-involved",
    modulePath: "/src/pages/GetInvolvedPage.tsx",
    title: "Get Involved | Global Hearts Community",
    description: "Volunteer, partner, or support community-led programs with Global Hearts Community in Mbale, Uganda. Find a way to get involved.",
  },
  {
    path: "/donate",
    modulePath: "/src/pages/DonatePage.tsx",
    title: "Donate | Global Hearts Community",
    description: "Support Global Hearts Community's food, education, health, and community programs in Mbale, Uganda. Choose a way to contribute.",
  },
  {
    path: "/contact",
    modulePath: "/src/pages/ContactPage.tsx",
    title: "Contact | Global Hearts Community",
    description: "Contact Global Hearts Community in Mbale, Uganda by email or WhatsApp, or open the map for directions to our location.",
  },
  {
    path: "/appeals",
    modulePath: "/src/pages/AppealsPage.tsx",
    title: "Community Appeals | Global Hearts Community",
    description: "Learn about Global Hearts Community appeals supporting food assistance and other community programs in Uganda.",
  },
  {
    path: "/gallery",
    modulePath: "/src/pages/GalleryPage.tsx",
    title: "Program Gallery | Global Hearts Community",
    description: "View photos from Global Hearts Community programs, including food distributions, water access, education, and community support in Uganda.",
  },
  {
    path: "/news",
    modulePath: "/src/pages/NewsPage.tsx",
    title: "News & Stories | Global Hearts Community",
    description: "Read field updates and community stories from Global Hearts Community in Mbale, Uganda, including food support, education, and disability inclusion.",
  },
] as const;

export function normalizeRoutePath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

export function canonicalUrl(pathname: string): string {
  const path = normalizeRoutePath(pathname);
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}/`;
}
