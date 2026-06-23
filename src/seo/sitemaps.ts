import { site } from "../config/site.js";
import type { Entity } from "../schema/entities.js";
import { routeForEntity } from "../config/routes.js";
import { isIndexableEntity } from "../build/build-catalog.js";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const buildSitemap = (entities: Entity[]): string => {
  const staticRoutes = ["/", "/about.html", "/archive.html", "/contact.html", "/projects.html", "/programs.html", "/research.html", "/work.html", "/knowledge/", "/knowledge/concepts/", "/publications/"];
  const urls: Array<{ route: string; lastmod?: string }> = [
    ...staticRoutes.map((route) => ({ route })),
    ...entities.filter(isIndexableEntity).map((entity) => ({
      route: routeForEntity(entity),
      lastmod: entity.version.modifiedAt,
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ route, lastmod }) => `  <url><loc>${escapeXml(`${site.origin}${route}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
};
