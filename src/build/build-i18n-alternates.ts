import { localizedRoute } from "../config/i18n.js";
import { routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";
import type { Locale } from "../schema/entity.js";

export type I18nAlternates = Record<string, Partial<Record<Locale, string>>>;

const staticRoutes = ([
  { route: "/", french: "/fr/" },
  { route: "/about.html", french: "/fr/about.html" },
  { route: "/archive.html", french: "/fr/archive.html" },
  { route: "/contact.html", french: "/fr/contact.html" },
  { route: "/projects.html", french: "/fr/projects.html" },
  { route: "/programs.html", french: "/fr/programs.html" },
  { route: "/research.html", french: "/fr/research.html" },
  { route: "/work.html", french: "/fr/work.html" },
  { route: "/mentions-legales.html", french: "/fr/mentions-legales.html" },
  { route: "/confidentialite.html", french: "/fr/confidentialite.html" },
  { route: "/search.html", french: "/fr/search.html" },
  { route: "/project.html", french: "/fr/project.html" },
  { route: "/project-rl.html", french: "/fr/project-rl.html" },
  { route: "/program.html", french: "/fr/program.html" },
  { route: "/entity.html", french: "/fr/entity.html" },
  { route: "/artefact.html", french: "/fr/artefact.html" },
  { route: "/collection.html", french: "/fr/collection.html" },
  { route: "/artist.html", french: "/fr/artist.html" },
  { route: "/channel.html", french: "/fr/channel.html" },
  { route: "/services.html", french: "/fr/services.html" },
  { route: "/communication.html", french: "/fr/communication.html" },
  { route: "/agence-communication.html", french: "/fr/agence-communication.html" },
  { route: "/development.html", french: "/fr/development.html" },
  { route: "/agence-developpement.html", french: "/fr/agence-developpement.html" },
  { route: "/palimpsests.html", french: "/fr/palimpsests.html" },
  { route: "/vaste.html", french: "/fr/vaste.html" },
  { route: "/knowledge/", french: "/fr/knowledge/" },
  { route: "/knowledge/concepts/", french: "/fr/knowledge/concepts/" },
  { route: "/knowledge/methods/", french: "/fr/knowledge/methods/" },
  { route: "/knowledge/frameworks/", french: "/fr/knowledge/frameworks/" },
  { route: "/knowledge/technologies/", french: "/fr/knowledge/technologies/" },
  "/archive/collections/",
  { route: "/publications/", french: "/fr/publications/" },
  { route: "/search/", french: "/fr/search.html" },
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
