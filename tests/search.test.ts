import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildSearchDocuments } from "../src/search/documents.js";
import type { Entity } from "../src/schema/entities.js";
import type { RelationStatement } from "../src/schema/relation.js";

test("search documents contain required pilot terms", async () => {
  const entities = await loadContent(path.resolve("."));
  const documents = buildSearchDocuments(entities, await loadRelations(path.resolve(".")), buildRoutes(entities));
  assert.ok(documents.every((document) => ["en", "fr"].includes(document.locale)));
  assert.ok(documents.some((document) => document.locale === "fr" && document.title === "V6"));
  const corpus = JSON.stringify(documents).toLowerCase();
  for (const term of ["graph runtime", "vaste", "v6", "runtime theory"]) {
    assert.ok(corpus.includes(term), `missing ${term}`);
  }
});

test("search documents exclude internal relations and non-public endpoints", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const program = entities.find((entity) => entity.id === "ea:program:vaste")!;
  const organization = entities.find((entity) => entity.id === "ea:organization:electronic-artefacts")!;
  const hiddenConcept: Entity = {
    ...entities.find((entity) => entity.id === "ea:concept:graph-runtime")!,
    id: "ea:concept:hidden-search-reference",
    slug: { canonical: "hidden-search-reference" },
    title: "Hidden Search Reference",
    visibility: "archive",
    publicationClass: "supporting",
  } as Entity;
  const hiddenRelation: RelationStatement = {
    id: "ear:vaste-hidden-search-reference",
    subject: program.id,
    predicate: "appliesConcept",
    object: hiddenConcept.id,
    statement: "Hidden search relation detail should not appear in public search documents.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "public",
  };
  const internalRelation: RelationStatement = {
    id: "ear:vaste-internal-search-note",
    subject: program.id,
    predicate: "maintainedBy",
    object: organization.id,
    statement: "Internal search relation detail should not appear in public search documents.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "internal",
  };

  const documents = buildSearchDocuments(
    [...entities, hiddenConcept],
    [...relations, hiddenRelation, internalRelation],
    buildRoutes([...entities, hiddenConcept]),
  );
  const corpus = JSON.stringify(documents);

  assert.doesNotMatch(corpus, /Hidden Search Reference/);
  assert.doesNotMatch(corpus, /Hidden search relation detail/);
  assert.doesNotMatch(corpus, /Internal search relation detail/);
  assert.doesNotMatch(corpus, /ea:concept:hidden-search-reference/);
});
