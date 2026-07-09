import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { validateGraph } from "../src/build/validate-graph.js";
import { relationSchema } from "../src/schema/validation.js";
import type { Entity } from "../src/schema/entities.js";
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

test("rejects invalid relation dates", () => {
  const impossible = relationSchema.safeParse({
    id: "ear:invalid-date",
    subject: "ea:program:vaste",
    predicate: "appliesConcept",
    object: "ea:concept:graph-runtime",
    statement: "This relation date must be a real calendar day.",
    confidence: "observed",
    createdAt: "2026-02-31",
    visibility: "public",
  });
  assert.equal(impossible.success, false);

  const invertedRange = relationSchema.safeParse({
    id: "ear:invalid-date-range",
    subject: "ea:program:vaste",
    predicate: "appliesConcept",
    object: "ea:concept:graph-runtime",
    statement: "This relation date range must not run backwards.",
    confidence: "observed",
    createdAt: "2026-06-22",
    validFrom: "2026-06-23",
    validTo: "2026-06-22",
    visibility: "public",
  });
  assert.equal(invertedRange.success, false);
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

test("rejects entity IDs that disagree with their declared type", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const concept = entities.find((entity) => entity.id === "ea:concept:graph-runtime")!;
  const invalid: Entity = {
    ...concept,
    id: "ea:project:graph-runtime-as-project",
    slug: { canonical: "graph-runtime-as-project" },
  } as Entity;

  assert.throws(
    () => validateGraph([...entities, invalid], relations),
    /ID type project does not match entity type concept/,
  );
});

test("rejects duplicate generated routes and identifiers", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const concept = entities.find((entity) => entity.id === "ea:concept:graph-runtime")!;
  const duplicateRoute: Entity = {
    ...concept,
    id: "ea:concept:graph-runtime-route-copy",
  } as Entity;

  assert.throws(
    () => validateGraph([...entities, duplicateRoute], relations),
    /Duplicate entity route \/knowledge\/concepts\/graph-runtime\//,
  );
});

test("rejects multiple translations for the same source locale", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const source = entities.find((entity) => entity.id === "ea:concept:graph-runtime")!;
  const duplicateFrenchTranslation: Entity = {
    ...source,
    id: "ea:concept:graph-runtime-copy-fr",
    locale: "fr",
    translationOf: source.id,
    slug: { canonical: "graph-runtime-copy" },
  } as Entity;

  assert.throws(
    () => validateGraph([...entities, duplicateFrenchTranslation], relations),
    /ea:concept:graph-runtime has multiple fr translations/,
  );
});

test("rejects public relations to non-public entities", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const hiddenConcept: Entity = {
    ...entities.find((entity) => entity.id === "ea:concept:graph-runtime")!,
    id: "ea:concept:hidden-public-relation-target",
    slug: { canonical: "hidden-public-relation-target" },
    title: "Hidden Public Relation Target",
    visibility: "archive",
    publicationClass: "supporting",
  } as Entity;
  const leakingRelation: RelationStatement = {
    id: "ear:vaste-hidden-public-relation-target",
    subject: "ea:program:vaste",
    predicate: "appliesConcept",
    object: hiddenConcept.id,
    statement: "Public relation to a non-public entity should be rejected during graph validation.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "public",
  };

  assert.throws(() => validateGraph([...entities, hiddenConcept], [...relations, leakingRelation]), /leaks a non-public entity/);
});
