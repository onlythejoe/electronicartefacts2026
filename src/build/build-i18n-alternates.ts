import { localizedRoute } from "../config/i18n.js";
import { routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";
import type { Locale } from "../schema/entity.js";

export type I18nAlternates = Record<string, Partial<Record<Locale, string>>>;

const staticRoutes = ([
  { route: "/", french: "/fr/" },
  { route: "/about.html", french: "/fr/about.html" },
  "/archive.html",
  { route: "/contact.html", french: "/fr/contact.html" },
  { route: "/projects.html", french: "/fr/projects.html" },
  "/programs.html",
  "/research.html",
  { route: "/work.html", french: "/fr/work.html" },
  "/knowledge/",
  "/knowledge/concepts/",
  "/knowledge/methods/",
  "/knowledge/frameworks/",
  "/knowledge/technologies/",
  "/archive/collections/",
  "/publications/",
] as Array<string | { route: string; french?: string }>)
  .map((item) => typeof item === "string" ? { route: item } : item);

const translationGroupKey = (entity: Entity): string =>
  entity.translationKey || entity.translationOf || entity.id;

const addAlias = (alternates: I18nAlternates, route: string, locales: Partial<Record<Locale, string>>): void => {
  alternates[route] = { ...(alternates[route] || {}), ...locales };
};

export const buildI18nAlternates = (entities: Entity[]): I18nAlternates => {
  const alternates: I18nAlternates = {};

  for (const { route, french } of staticRoutes) {
    const locales = { en: localizedRoute(route, "en"), ...(french ? { fr: french } : {}) };
    addAlias(alternates, route, locales);
    if (french) addAlias(alternates, french, locales);
    if (route === "/") addAlias(alternates, "/index.html", locales);
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
