import { site } from "../config/site.js";
import type { Entity } from "../schema/entities.js";
import { routeForEntity } from "../config/routes.js";
import { defaultLocale } from "../config/i18n.js";
import { isIndexableEntity } from "../build/build-catalog.js";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

interface SitemapUrl {
  route: string;
  lastmod?: string;
  image?: string;
  alternates?: Array<{ hreflang: string; href: string }>;
}

const entityImage = (entity: Entity): string | undefined => {
  const image = entity.media?.find((item) => item.type === "image");
  return image ? `${site.origin}${image.src}` : undefined;
};

const urlMarkup = ({ route, lastmod, image, alternates }: SitemapUrl): string => {
  const imageMarkup = image ? `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>` : "";
  const absolute = `${site.origin}${route}`;
  const alternateMarkup = (alternates || [{ hreflang: defaultLocale, href: absolute }, { hreflang: "x-default", href: absolute }])
    .map((alternate) => `<xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`)
    .join("");
  return `  <url><loc>${escapeXml(absolute)}</loc>${alternateMarkup}${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${imageMarkup}</url>`;
};

export const buildSitemap = (entities: Entity[]): string => {
  const bilingual = (english: string, french: string) => [
    { hreflang: "en", href: `${site.origin}${english}` },
    { hreflang: "fr", href: `${site.origin}${french}` },
    { hreflang: "x-default", href: `${site.origin}${english}` },
  ];
  const staticRoutes: SitemapUrl[] = [
    { route: "/", image: `${site.origin}${site.socialImage}`, alternates: bilingual("/", "/fr/") },
    { route: "/fr/", image: `${site.origin}${site.socialImage}`, alternates: bilingual("/", "/fr/") },
    { route: "/about.html", alternates: bilingual("/about.html", "/fr/about.html") },
    { route: "/fr/about.html", alternates: bilingual("/about.html", "/fr/about.html") },
    { route: "/archive.html", alternates: bilingual("/archive.html", "/fr/archive.html") },
    { route: "/fr/archive.html", alternates: bilingual("/archive.html", "/fr/archive.html") },
    { route: "/contact.html", alternates: bilingual("/contact.html", "/fr/contact.html") },
    { route: "/fr/contact.html", alternates: bilingual("/contact.html", "/fr/contact.html") },
    { route: "/projects.html", alternates: bilingual("/projects.html", "/fr/projects.html") },
    { route: "/fr/projects.html", alternates: bilingual("/projects.html", "/fr/projects.html") },
    { route: "/programs.html", alternates: bilingual("/programs.html", "/fr/programs.html") },
    { route: "/fr/programs.html", alternates: bilingual("/programs.html", "/fr/programs.html") },
    { route: "/research.html", alternates: bilingual("/research.html", "/fr/research.html") },
    { route: "/fr/research.html", alternates: bilingual("/research.html", "/fr/research.html") },
    { route: "/graph.html", alternates: bilingual("/graph.html", "/fr/graph.html") },
    { route: "/fr/graph.html", alternates: bilingual("/graph.html", "/fr/graph.html") },
    { route: "/research/questions/", alternates: bilingual("/research/questions/", "/fr/research/questions/") },
    { route: "/fr/research/questions/", alternates: bilingual("/research/questions/", "/fr/research/questions/") },
    { route: "/work.html", alternates: bilingual("/work.html", "/fr/work.html") },
    { route: "/fr/work.html", alternates: bilingual("/work.html", "/fr/work.html") },
    { route: "/knowledge/", alternates: bilingual("/knowledge/", "/fr/knowledge/") },
    { route: "/fr/knowledge/", alternates: bilingual("/knowledge/", "/fr/knowledge/") },
    { route: "/knowledge/concepts/", alternates: bilingual("/knowledge/concepts/", "/fr/knowledge/concepts/") },
    { route: "/fr/knowledge/concepts/", alternates: bilingual("/knowledge/concepts/", "/fr/knowledge/concepts/") },
    { route: "/knowledge/methods/", alternates: bilingual("/knowledge/methods/", "/fr/knowledge/methods/") },
    { route: "/fr/knowledge/methods/", alternates: bilingual("/knowledge/methods/", "/fr/knowledge/methods/") },
    { route: "/knowledge/frameworks/", alternates: bilingual("/knowledge/frameworks/", "/fr/knowledge/frameworks/") },
    { route: "/fr/knowledge/frameworks/", alternates: bilingual("/knowledge/frameworks/", "/fr/knowledge/frameworks/") },
    { route: "/knowledge/technologies/", alternates: bilingual("/knowledge/technologies/", "/fr/knowledge/technologies/") },
    { route: "/fr/knowledge/technologies/", alternates: bilingual("/knowledge/technologies/", "/fr/knowledge/technologies/") },
    { route: "/archive/collections/" },
    { route: "/publications/", alternates: bilingual("/publications/", "/fr/publications/") },
    { route: "/fr/publications/", alternates: bilingual("/publications/", "/fr/publications/") },
    { route: "/mentions-legales.html", alternates: bilingual("/mentions-legales.html", "/fr/mentions-legales.html") },
    { route: "/fr/mentions-legales.html", alternates: bilingual("/mentions-legales.html", "/fr/mentions-legales.html") },
    { route: "/confidentialite.html", alternates: bilingual("/confidentialite.html", "/fr/confidentialite.html") },
    { route: "/fr/confidentialite.html", alternates: bilingual("/confidentialite.html", "/fr/confidentialite.html") },
  ];
  const translationGroups = new Map<string, Entity[]>();
  for (const entity of entities) {
    const key = entity.translationKey || entity.translationOf || entity.id;
    translationGroups.set(key, [...(translationGroups.get(key) || []), entity]);
  }
  const entityAlternates = (entity: Entity) => {
    const key = entity.translationKey || entity.translationOf || entity.id;
    const group = translationGroups.get(key) || [entity];
    const alternates: Array<{ hreflang: string; href: string }> = group.map((item) => ({
      hreflang: item.locale,
      href: `${site.origin}${routeForEntity(item)}`,
    }));
    const english = group.find((item) => item.locale === defaultLocale);
    if (english) alternates.push({ hreflang: "x-default", href: `${site.origin}${routeForEntity(english)}` });
    return alternates;
  };
  const urls: SitemapUrl[] = [
    ...staticRoutes.map((item) => ({ ...item, lastmod: site.updatedAt })),
    ...entities.filter(isIndexableEntity).map((entity) => ({
      route: routeForEntity(entity),
      lastmod: entity.version.modifiedAt,
      image: entityImage(entity),
      alternates: entityAlternates(entity),
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(urlMarkup).join("\n")}
</urlset>
`;
};
