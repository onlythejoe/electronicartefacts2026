import { defaultLocale } from "../config/i18n.js";
import type { Entity } from "../schema/entities.js";

export const graphTypeSegment = (entity: Entity): string =>
  entity.type === "researchField"
    ? "research-field"
    : entity.type === "researchQuestion"
      ? "research-question"
      : entity.type;

export const graphNeighborhoodRoute = (entity: Entity): string => {
  const localeSegment = entity.locale === defaultLocale ? "" : `/${entity.locale}`;
  return `/graph/neighborhoods${localeSegment}/${graphTypeSegment(entity)}/${entity.slug.canonical}.json`;
};
