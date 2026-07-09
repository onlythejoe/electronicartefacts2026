import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { entityFrontmatterSchema } from "../src/schema/validation.js";

test("loads the typed pilot entities", async () => {
  const entities = await loadContent(path.resolve("."));
  assert.ok(entities.length >= 6);
  for (const id of [
    "ea:concept:graph-runtime",
    "ea:organization:electronic-artefacts",
    "ea:program:vaste",
    "ea:project:vestiges",
    "ea:publication:foundational-lineage-001",
    "ea:researchField:runtime-theory",
  ]) {
    assert.ok(entities.some((entity) => entity.id === id), `missing ${id}`);
  }
  assert.ok(entities.every((entity) => /<h2(?:\s[^>]*)?>/.test(entity.bodyHtml)));
});

test("rejects invalid calendar dates and version chronology", async () => {
  const entities = await loadContent(path.resolve("."));
  const concept = entities.find((entity) => entity.id === "ea:concept:graph-runtime");
  assert.ok(concept);

  assert.equal(entityFrontmatterSchema.safeParse({
    ...concept,
    version: {
      ...concept.version,
      createdAt: "2026-02-31",
    },
  }).success, false);

  assert.equal(entityFrontmatterSchema.safeParse({
    ...concept,
    version: {
      ...concept.version,
      createdAt: "2026-07-09",
      modifiedAt: "2026-07-08",
    },
  }).success, false);
});
