import type { Entity, PublicationEntity } from "../schema/entities.js";
import type { Locale } from "../schema/entity.js";
import type { EntityType } from "../schema/entity.js";
import { localizedRoute, routeLocale } from "./i18n.js";

export const routeByType: Record<EntityType, (slug: string) => string> = {
  concept: (slug) => `/knowledge/concepts/${slug}/`,
  method: (slug) => `/knowledge/methods/${slug}/`,
  framework: (slug) => `/knowledge/frameworks/${slug}/`,
  technology: (slug) => `/knowledge/technologies/${slug}/`,
  researchField: (slug) => `/research/fields/${slug}/`,
  researchQuestion: (slug) => `/research/questions/${slug}/`,
  publication: (slug) => `/publications/${slug}/`,
  project: (slug) => `/projects/${slug}/`,
  program: (slug) => `/programs/${slug}/`,
  collection: (slug) => `/archive/collections/${slug}/`,
  artefact: (slug) => `/archive/artefacts/${slug}/`,
  timeline: (slug) => `/archive/timelines/${slug}/`,
  artist: (slug) => `/artists/${slug}/`,
  organization: (slug) => `/organizations/${slug}/`,
  tool: (slug) => `/tools/${slug}/`,
  dataset: (slug) => `/datasets/${slug}/`,
  event: (slug) => `/events/${slug}/`,
};

export const hubRoutes = {
  home: "/",
  knowledge: "/knowledge/",
  concepts: "/knowledge/concepts/",
  research: "/research/",
  researchQuestions: "/research/questions/",
  publications: "/publications/",
  projects: "/projects/",
  programs: "/programs/",
  archive: "/archive/",
  search: "/search/",
} as const;

export const unlocalizedRouteForEntity = (entity: Entity): string => {
  if (entity.type === "publication" && (entity as PublicationEntity).format === "researchNote") {
    return routeByType.publication(entity.slug.canonical);
  }
  return routeByType[entity.type](entity.slug.canonical);
};

export const routeForEntity = (entity: Entity, locale: Locale = routeLocale(entity.locale)): string =>
  localizedRoute(unlocalizedRouteForEntity(entity), locale);

export const identifierPath = (entity: Entity): string => {
  const type = entity.type === "researchField"
    ? "research-field"
    : entity.type === "researchQuestion"
      ? "research-question"
      : entity.type;
  return localizedRoute(`/id/${type}/${entity.slug.canonical}/`, routeLocale(entity.locale));
};
