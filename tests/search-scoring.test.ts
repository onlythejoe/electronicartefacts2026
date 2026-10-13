import assert from "node:assert/strict";
import test from "node:test";
import { loadContent } from "../src/build/load-content.js";
import { buildSearchDocuments } from "../src/search/documents.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { normalizeSearchText, scoreSearchDocument, findSearchMatches } from "../src/search/scoring.js";

test("search folding handles accents, decomposed characters, ligatures and apostrophes", () => {
  assert.equal(normalizeSearchText("PRÉSERVATION"), "preservation");
  assert.equal(normalizeSearchText("me\u0301moire"), "memoire");
  assert.equal(normalizeSearchText("L’Œil de Meg"), "l'oeil de meg");
});

test("canonical search returns only the requested locale from the bilingual corpus", async () => {
  const entities = await loadContent(process.cwd());
  const documents = buildSearchDocuments(entities, [], buildRoutes(entities));
  for (const locale of ["en", "fr"] as const) {
    const matches = findSearchMatches(documents, "VASTE", locale);
    assert.ok(matches.length > 0);
    assert.ok(matches.every((document) => document.locale === locale));
    assert.equal(new Set(matches.map((document) => document.route)).size, matches.length);
  }
});

test("unaccented and accented queries score the same actual French records", async () => {
  const entities = await loadContent(process.cwd());
  const documents = buildSearchDocuments(entities, [], buildRoutes(entities));
  const record = documents.find((document) => document.title === "Préservation numérique");
  assert.ok(record);
  assert.ok(scoreSearchDocument(record, "preservation numerique") > 0);
  assert.equal(scoreSearchDocument(record, "préservation numérique"), scoreSearchDocument(record, "preservation numerique"));
  assert.deepEqual(findSearchMatches(documents, "  ", "fr"), []);
});
