import type { SearchDocument } from "./documents.js";
import type { Locale } from "../schema/entity.js";

export const normalizeSearchText = (value: unknown): string => String(value ?? "")
  .toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "")
  .replaceAll("œ", "oe").replaceAll("æ", "ae").replace(/[’‘]/g, "'");

export const scoreSearchDocument = (document: SearchDocument, query: string): number => {
  const phrase = normalizeSearchText(query).trim();
  if (!phrase) return 0;
  const fields: Array<[unknown, number]> = [
    [document.title, 12], [(document.alternateNames || []).join(" "), 9],
    [document.definition, 8], [(document.questions || []).join(" "), 7],
    [(document.headings || []).join(" "), 5], [document.abstract, 4],
    [(document.tags || []).join(" "), 3], [(document.relationLabels || []).join(" "), 2],
    [document.body, 1],
  ];
  return fields.reduce((score, [value, boost]) => {
    const text = normalizeSearchText(value);
    return text.includes(phrase) ? score + boost * (text === phrase ? 1.5 : 1) : score;
  }, 0);
};

export const findSearchMatches = (documents: SearchDocument[], query: string, locale: Locale): SearchDocument[] => documents
  .filter((document) => document.locale === locale)
  .map((document) => ({ document, score: scoreSearchDocument(document, query) }))
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title, locale))
  .slice(0, 30)
  .map((item) => item.document);
