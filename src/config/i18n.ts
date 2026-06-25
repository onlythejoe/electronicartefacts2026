import type { Locale } from "../schema/entity.js";

export interface LocaleConfig {
  code: Locale;
  label: string;
  htmlLang: string;
  ogLocale: string;
  pathPrefix: string;
}

export const defaultLocale: Locale = "en";

export const locales: Record<Locale, LocaleConfig> = {
  en: {
    code: "en",
    label: "English",
    htmlLang: "en",
    ogLocale: "en_US",
    pathPrefix: "",
  },
  fr: {
    code: "fr",
    label: "Français",
    htmlLang: "fr",
    ogLocale: "fr_FR",
    pathPrefix: "/fr",
  },
};

export const supportedLocales = Object.keys(locales) as Locale[];

export const localeConfig = (locale: Locale = defaultLocale): LocaleConfig => locales[locale];

const normalizeRoute = (route: string): string => {
  if (!route.startsWith("/")) return `/${route}`;
  return route;
};

export const localizedRoute = (route: string, locale: Locale = defaultLocale): string => {
  const normalized = normalizeRoute(route);
  const prefix = localeConfig(locale).pathPrefix;
  if (!prefix) return normalized;
  if (normalized === "/") return `${prefix}/`;
  return `${prefix}${normalized}`;
};

export const routeLocale = (locale: Locale | undefined): Locale => locale || defaultLocale;
