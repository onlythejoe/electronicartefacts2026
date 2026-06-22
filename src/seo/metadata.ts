import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import { isIndexableEntity } from "../build/build-catalog.js";
import type { Entity } from "../schema/entities.js";

export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  image: string;
  imageAlt: string;
}

const trimDescription = (value: string): string => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= 160 ? text : `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
};

export const metadataFor = (entity: Entity): PageMetadata => {
  const image = entity.media?.find((item) => item.type === "image");
  return {
    title: `${entity.title} | ${site.name}`,
    description: trimDescription(entity.description || entity.abstract),
    canonicalUrl: `${site.origin}${routeForEntity(entity)}`,
    robots: isIndexableEntity(entity)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow",
    image: image ? `${site.origin}${image.src}` : `${site.origin}${site.socialImage}`,
    imageAlt: image?.alt || entity.title,
  };
};
