import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const rootDir = path.resolve(".");
const staticFrenchPages = [
  "index.html", "work.html", "projects.html", "about.html", "contact.html",
  "programs.html", "research.html", "archive.html", "mentions-legales.html",
  "confidentialite.html", "search.html", "project.html", "project-rl.html",
  "program.html", "entity.html", "artefact.html", "collection.html", "artist.html",
  "channel.html", "services.html", "communication.html", "agence-communication.html",
  "development.html", "agence-developpement.html", "palimpsests.html", "vaste.html",
];

const englishFiles = await fg("content/**/*.md", {
  cwd: rootDir,
  ignore: ["content/fr/**", "content/relations/**"],
  absolute: true,
});
const frenchFiles = await fg("content/fr/**/*.md", { cwd: rootDir, absolute: true });

const field = (source, name) => source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1]?.trim();
const wordCount = (source) =>
  (source
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) || []).length;

const englishRecords = [];
for (const file of englishFiles) {
  const source = await readFile(file, "utf8");
  englishRecords.push({ id: field(source, "id"), words: wordCount(source) });
}

const frenchRecords = [];
for (const file of frenchFiles) {
  const source = await readFile(file, "utf8");
  frenchRecords.push({
    id: field(source, "id"),
    translationOf: field(source, "translationOf"),
    words: wordCount(source),
  });
}

const englishById = new Map(englishRecords.map((record) => [record.id, record]));
const translatedSourceWords = frenchRecords.reduce(
  (total, record) => total + (englishById.get(record.translationOf)?.words || 0),
  0,
);
const totalSourceWords = englishRecords.reduce((total, record) => total + record.words, 0);
const generatedStaticPages = [];
for (const file of staticFrenchPages) {
  try {
    await readFile(path.join(rootDir, "fr", file), "utf8");
    generatedStaticPages.push(file);
  } catch {
    // Missing pages remain visible in the report.
  }
}

const percent = (value, total) => total ? Number(((value / total) * 100).toFixed(2)) : 0;
const report = {
  staticPages: {
    total: staticFrenchPages.length,
    generated: generatedStaticPages.length,
    routeCoveragePercent: percent(generatedStaticPages.length, staticFrenchPages.length),
    fullyReviewed: ["mentions-legales.html", "confidentialite.html"],
  },
  canonicalEntities: {
    english: englishRecords.length,
    french: frenchRecords.length,
    coveragePercent: percent(frenchRecords.length, englishRecords.length),
  },
  editorialWords: {
    englishSourceWords: totalSourceWords,
    sourceWordsCoveredByFrenchRecords: translatedSourceWords,
    coveragePercent: percent(translatedSourceWords, totalSourceWords),
  },
  translatedEntityIds: frenchRecords.map((record) => record.translationOf).filter(Boolean).sort(),
};

await writeFile(
  path.join(rootDir, "generated/i18n-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
process.stdout.write(
  `French coverage: ${report.canonicalEntities.french}/${report.canonicalEntities.english} canonical entities, `
  + `${report.staticPages.generated}/${report.staticPages.total} static routes, `
  + `${report.editorialWords.coveragePercent}% of structured editorial source words.\n`,
);
