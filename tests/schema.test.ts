import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";

test("loads the six typed pilot entities", async () => {
  const entities = await loadContent(path.resolve("."));
  assert.equal(entities.length, 6);
  assert.ok(entities.some((entity) => entity.id === "ea:concept:graph-runtime"));
  assert.ok(entities.every((entity) => entity.bodyHtml.includes("<h2>")));
});
