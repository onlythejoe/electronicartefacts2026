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
  const staticRoutes: SitemapUrl[] = [
    { route: "/", image: `${site.origin}${site.socialImage}` },
    { route: "/about.html" },
    { route: "/archive.html" },
    { route: "/contact.html" },
    { route: "/projects.html" },
    { route: "/programs.html" },
    { route: "/research.html" },
    { route: "/work.html" },
    { route: "/knowledge/" },
    { route: "/knowledge/concepts/" },
    { route: "/knowledge/methods/" },
    { route: "/knowledge/frameworks/" },
    { route: "/knowledge/technologies/" },
    { route: "/archive/collections/" },
    { route: "/publications/" },
  ];
  const urls: SitemapUrl[] = [
    ...staticRoutes.map((item) => ({ ...item, lastmod: site.updatedAt })),
    ...entities.filter(isIndexableEntity).map((entity) => ({
      route: routeForEntity(entity),
      lastmod: entity.version.modifiedAt,
      image: entityImage(entity),
      alternates: [
        { hreflang: entity.locale, href: `${site.origin}${routeForEntity(entity)}` },
        ...(entity.locale === defaultLocale ? [{ hreflang: "x-default", href: `${site.origin}${routeForEntity(entity)}` }] : []),
      ],
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
