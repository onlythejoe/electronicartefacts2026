import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { withDerivedRelations } from "../src/build/derive-relations.js";

test("projects publication subjects and collection members into the public graph", async () => {
  const rootDir = path.resolve(".");
  const entities = await loadContent(rootDir);
  const relations = withDerivedRelations(entities, await loadRelations(rootDir));

  assert.ok(relations.some((relation) =>
    relation.subject === "ea:publication:ai-agents-vs-ai-workflows"
    && relation.predicate === "documents"
    && relation.object === "ea:concept:large-language-model"));

  assert.ok(relations.some((relation) =>
    relation.subject === "ea:technology:activitypub"
    && relation.predicate === "memberOfCollection"
    && relation.object === "ea:collection:knowledge-hub-second-wave"));
});

test("does not duplicate authored editorial triples", async () => {
  const rootDir = path.resolve(".");
  const entities = await loadContent(rootDir);
  const relations = withDerivedRelations(entities, await loadRelations(rootDir));
  const keys = relations.map((relation) => `${relation.subject}|${relation.predicate}|${relation.object}`);
  assert.equal(new Set(keys).size, keys.length);
});
