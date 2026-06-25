import { site } from "../config/site.js";
import type { Entity } from "../schema/entities.js";
import { routeForEntity } from "../config/routes.js";
import { isIndexableEntity } from "../build/build-catalog.js";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

interface SitemapUrl {
  route: string;
  lastmod?: string;
  image?: string;
}

const entityImage = (entity: Entity): string | undefined => {
  const image = entity.media?.find((item) => item.type === "image");
  return image ? `${site.origin}${image.src}` : undefined;
};

const urlMarkup = ({ route, lastmod, image }: SitemapUrl): string => {
  const imageMarkup = image ? `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>` : "";
  return `  <url><loc>${escapeXml(`${site.origin}${route}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${imageMarkup}</url>`;
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
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(urlMarkup).join("\n")}
</urlset>
`;
};
