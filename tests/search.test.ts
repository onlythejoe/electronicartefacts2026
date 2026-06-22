import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildSearchDocuments } from "../src/search/documents.js";

test("search documents contain required pilot terms", async () => {
  const entities = await loadContent(path.resolve("."));
  const documents = buildSearchDocuments(entities, await loadRelations(path.resolve(".")), buildRoutes(entities));
  const corpus = JSON.stringify(documents).toLowerCase();
  for (const term of ["graph runtime", "vaste", "vestiges", "runtime theory"]) {
    assert.ok(corpus.includes(term), `missing ${term}`);
  }
});
