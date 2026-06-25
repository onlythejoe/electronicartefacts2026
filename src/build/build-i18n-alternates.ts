import { localizedRoute } from "../config/i18n.js";
import { routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";
import type { Locale } from "../schema/entity.js";

export type I18nAlternates = Record<string, Partial<Record<Locale, string>>>;

const staticRoutes = [
  "/",
  "/about.html",
  "/archive.html",
  "/contact.html",
  "/projects.html",
  "/programs.html",
  "/research.html",
  "/work.html",
  "/knowledge/",
  "/knowledge/concepts/",
  "/knowledge/methods/",
  "/knowledge/frameworks/",
  "/knowledge/technologies/",
  "/archive/collections/",
  "/publications/",
];

const translationGroupKey = (entity: Entity): string =>
  entity.translationKey || entity.translationOf || entity.id;

const addAlias = (alternates: I18nAlternates, route: string, locales: Partial<Record<Locale, string>>): void => {
  alternates[route] = { ...(alternates[route] || {}), ...locales };
};

export const buildI18nAlternates = (entities: Entity[]): I18nAlternates => {
  const alternates: I18nAlternates = {};

  for (const route of staticRoutes) {
    addAlias(alternates, route, { en: localizedRoute(route, "en") });
    if (route === "/") addAlias(alternates, "/index.html", { en: "/" });
  }

  const groups = new Map<string, Entity[]>();
  for (const entity of entities) {
    const key = translationGroupKey(entity);
    groups.set(key, [...(groups.get(key) || []), entity]);
  }

  for (const entitiesInGroup of groups.values()) {
    const locales = Object.fromEntries(
      entitiesInGroup.map((entity) => [entity.locale, routeForEntity(entity)]),
    ) as Partial<Record<Locale, string>>;

    for (const route of Object.values(locales)) {
      if (route) addAlias(alternates, route, locales);
    }
  }

  return Object.fromEntries(Object.entries(alternates).sort(([left], [right]) => left.localeCompare(right)));
};
