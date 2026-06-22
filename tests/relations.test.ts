import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { validateGraph } from "../src/build/validate-graph.js";
import { relationSchema } from "../src/schema/validation.js";
import type { RelationStatement } from "../src/schema/relation.js";

test("validates normalized pilot relations", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  assert.doesNotThrow(() => validateGraph(entities, relations));
});

test("rejects invalid relation predicates", () => {
  const result = relationSchema.safeParse({
    id: "ear:invalid",
    subject: "ea:program:vaste",
    predicate: "relatedTo",
    object: "ea:project:vestiges",
    statement: "This invalid predicate must not pass relation validation.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "public",
  });
  assert.equal(result.success, false);
});

test("rejects unknown entity references", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const invalid: RelationStatement = {
    ...relations[0],
    id: "ear:unknown-reference",
    object: "ea:concept:missing",
  };
  assert.throws(() => validateGraph(entities, [...relations, invalid]), /unknown object/);
});
