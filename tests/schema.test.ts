import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";

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
