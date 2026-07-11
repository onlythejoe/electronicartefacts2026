import path from "node:path";
import { loadContent } from "../src/build/load-content.js";

const entities = await loadContent(path.resolve("."));
const byId = new Map(entities.map((entity) => [entity.id, entity]));
const issues: string[] = [];

const publicEnglish = entities.filter((entity) =>
  entity.locale === "en"
  && entity.visibility === "public"
  && entity.publicationClass !== "internal"
  && !entity.translationOf);

for (const entity of publicEnglish) {
  const translations = entities.filter((candidate) => candidate.translationOf === entity.id);
  if (!translations.some((candidate) => candidate.locale === "fr")) {
    issues.push(`${entity.id} has no French translation`);
  }
}

const invariantFields = [
  "type",
  "visibility",
  "publicationClass",
  "status",
  "maturity",
  "confidence",
  "publisher",
] as const;

for (const translation of entities.filter((entity) => entity.translationOf)) {
  const source = byId.get(translation.translationOf!);
  if (!source) continue;
  for (const field of invariantFields) {
    if (translation[field] !== source[field]) {
      issues.push(`${translation.id} does not match ${source.id} for ${field}`);
    }
  }
}

for (const locale of ["en", "fr"] as const) {
  for (const field of ["tags", "disciplines"] as const) {
    const spellings = new Map<string, Set<string>>();
    for (const entity of entities.filter((candidate) => candidate.locale === locale)) {
      for (const value of entity[field] || []) {
        const key = value.toLocaleLowerCase(locale);
        const variants = spellings.get(key) || new Set<string>();
        variants.add(value);
        spellings.set(key, variants);
      }
    }
    for (const variants of spellings.values()) {
      if (variants.size > 1) {
        issues.push(`${locale} ${field} has inconsistent casing: ${[...variants].join(" / ")}`);
      }
    }
  }
}

for (const entity of entities) {
  const headings = entity.headings.map((heading) => heading.trim().toLocaleLowerCase(entity.locale));
  const duplicateHeadings = headings.filter((heading, index) => headings.indexOf(heading) !== index);
  if (duplicateHeadings.length) {
    issues.push(`${entity.id} repeats headings: ${[...new Set(duplicateHeadings)].join(", ")}`);
  }
  if (!entity.bodyHtml.trim()) issues.push(`${entity.id} has an empty editorial body`);
}

const summary = {
  entities: entities.length,
  englishSources: entities.filter((entity) => entity.locale === "en").length,
  frenchTranslations: entities.filter((entity) => entity.locale === "fr").length,
  publicEnglishSources: publicEnglish.length,
  issues: issues.length,
};

if (issues.length) {
  process.stderr.write(`${JSON.stringify({ summary, issues }, null, 2)}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${JSON.stringify({ summary, issues: [] }, null, 2)}\n`);
}
