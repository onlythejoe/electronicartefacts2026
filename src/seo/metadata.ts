import { site } from "../config/site.js";
import { identifierPath, routeForEntity } from "../config/routes.js";
import { isIndexableEntity } from "../build/build-catalog.js";
import type { Entity } from "../schema/entities.js";

export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLdUrl?: string;
  robots: string;
  image: string;
  imageAlt: string;
  ogType: "article" | "profile" | "website";
  keywords: string[];
  publishedAt?: string;
  modifiedAt: string;
}

const trimDescription = (value: string): string => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= 160 ? text : `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
};

const trimTitle = (value: string): string => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= 68 ? text : `${text.slice(0, 65).replace(/\s+\S*$/, "")}…`;
};

const typeLabel = (entity: Entity): string =>
  entity.type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

const titleFor = (entity: Entity): string => {
  const branded = `${entity.title} | ${site.name}`;
  if (branded.length <= 68) return branded;
  if (entity.title.length <= 68) return entity.title;
  return trimTitle(entity.title);
};

const descriptionFor = (entity: Entity): string => {
  const candidates = [
    entity.description,
    entity.definition,
    entity.abstract,
    entity.subtitle ? `${entity.title}: ${entity.subtitle}. ${entity.abstract}` : undefined,
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.replace(/\s+/g, " ").trim())
    .sort((a, b) => {
      const aScore = a.length >= 90 ? 1 : 0;
      const bScore = b.length >= 90 ? 1 : 0;
      return bScore - aScore || b.length - a.length;
    });

  const primary = candidates[0] || `${entity.title} is a ${typeLabel(entity)} record in the Electronic Artefacts knowledge graph.`;
  const contextual = primary.length >= 90
    ? primary
    : `${primary} This ${typeLabel(entity)} record is maintained by Electronic Artefacts with canonical metadata, dates and graph context.`;
  return trimDescription(contextual);
};

const ogTypeFor = (entity: Entity): PageMetadata["ogType"] => {
  if (entity.type === "artist") return "profile";
  return "article";
};

const keywordsFor = (entity: Entity): string[] =>
  [
    entity.title,
    ...(entity.alternateNames || []),
    typeLabel(entity),
    ...(entity.tags || []),
    ...(entity.disciplines || []),
  ]
    .map((value) => value.trim())
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .slice(0, 14);

export const metadataFor = (entity: Entity): PageMetadata => {
  const image = entity.media?.find((item) => item.type === "image");
  return {
    title: titleFor(entity),
    description: descriptionFor(entity),
    canonicalUrl: `${site.origin}${routeForEntity(entity)}`,
    jsonLdUrl: `${site.origin}${identifierPath(entity)}index.jsonld`,
    robots: isIndexableEntity(entity)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow",
    image: image ? `${site.origin}${image.src}` : `${site.origin}${site.socialImage}`,
    imageAlt: image?.alt || entity.title,
    ogType: ogTypeFor(entity),
    keywords: keywordsFor(entity),
    publishedAt: entity.version.publishedAt,
    modifiedAt: entity.version.modifiedAt,
  };
};
