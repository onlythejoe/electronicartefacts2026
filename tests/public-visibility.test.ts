import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildGraphViews } from "../src/graph/build-views.js";
import { routeForEntity } from "../src/config/routes.js";
import { renderLocalGraph } from "../src/templates/components/local-graph.js";
import { renderEditorialPanels } from "../src/templates/components/editorial-panels.js";
import { renderRelationshipGroups } from "../src/templates/components/relationship-groups.js";
import { renderProjectPage } from "../src/templates/project-page.js";
import { renderPublicationPage } from "../src/templates/publication-page.js";
import type { Entity, FrameworkEntity, ProjectEntity, PublicationEntity } from "../src/schema/entities.js";
import type { RelationStatement } from "../src/schema/relation.js";

const routeIndex = (entities: Entity[]) =>
  Object.fromEntries(buildRoutes(entities).map((route) => [route.id, route.route]));

const localizedView = (entities: Entity[], locale: Entity["locale"]) => {
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const routeById = routeIndex(entities);

  for (const entity of entities) {
    if (entity.locale !== locale || !entity.translationOf) continue;
    byId.set(entity.translationOf, entity);
    byId.set(entity.id, entity);
    routeById[entity.translationOf] = routeForEntity(entity);
    routeById[entity.id] = routeForEntity(entity);
  }

  return { byId, routeById };
};

const loadFixture = async () => {
  const entities = await loadContent(path.resolve("."));
  return {
    entities,
    byId: new Map(entities.map((entity) => [entity.id, entity])),
    routeById: routeIndex(entities),
  };
};

test("relationship rendering excludes internal relation statements", async () => {
  const { entities, byId, routeById } = await loadFixture();
  const program = byId.get("ea:program:vaste")!;
  const organization = byId.get("ea:organization:electronic-artefacts")!;
  const internalRelation: RelationStatement = {
    id: "ear:vaste-internal-maintenance-note",
    subject: program.id,
    predicate: "maintainedBy",
    object: organization.id,
    statement: "Internal-only maintenance detail should not render on a public page.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "internal",
  };

  const html = renderRelationshipGroups(program, [internalRelation], byId, routeById);

  assert.equal(html, "");
  assert.doesNotMatch(html, /Internal-only maintenance detail/);
  assert.equal(routeIndex(entities)[program.id], "/programs/vaste/");
});

test("graph views do not keep dangling public edges to non-public entities", async () => {
  const { byId } = await loadFixture();
  const focus = byId.get("ea:concept:graph-runtime")!;
  const archivedConcept: Entity = {
    ...focus,
    id: "ea:concept:hidden-archive",
    slug: { canonical: "hidden-archive" },
    title: "Hidden Archive Concept",
    visibility: "archive",
    publicationClass: "supporting",
  } as Entity;
  const relationToArchive: RelationStatement = {
    id: "ear:graph-runtime-hidden-archive",
    subject: focus.id,
    predicate: "defines",
    object: archivedConcept.id,
    statement: "Archive-only graph detail should not appear as a dangling public edge.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "public",
  };

  const view = buildGraphViews([focus], [relationToArchive], buildRoutes([focus]))[0];

  assert.deepEqual(view.nodes.map((node) => node.id), [focus.id]);
  assert.equal(view.edges.length, 0);
});

test("project pages hide non-public references and internal relations", async () => {
  const { entities, byId, routeById } = await loadFixture();
  const project = byId.get("ea:project:vestiges") as ProjectEntity;
  const hiddenConcept: Entity = {
    ...byId.get("ea:concept:graph-runtime")!,
    id: "ea:concept:hidden-project-reference",
    slug: { canonical: "hidden-project-reference" },
    title: "Hidden Project Reference",
    visibility: "archive",
    publicationClass: "supporting",
  } as Entity;
  const scopedById = new Map([...byId, [hiddenConcept.id, hiddenConcept]]);
  const scopedRouteById = {
    ...routeById,
    ...routeIndex([hiddenConcept]),
  };
  const projectWithHiddenRefs: ProjectEntity = {
    ...project,
    outputs: [{ id: hiddenConcept.id }],
    evidence: [{ id: hiddenConcept.id }],
  };
  const internalRelation: RelationStatement = {
    id: "ear:vestiges-internal-delivery-note",
    subject: project.id,
    predicate: "poweredBy",
    object: "ea:program:vaste",
    statement: "Internal-only delivery detail should not render on a public project page.",
    confidence: "observed",
    createdAt: "2026-06-22",
    visibility: "internal",
  };

  const html = renderProjectPage(projectWithHiddenRefs, [internalRelation], scopedById, scopedRouteById);

  assert.doesNotMatch(html, /Hidden Project Reference/);
  assert.doesNotMatch(html, /Internal-only delivery detail/);
  assert.equal(routeIndex(entities)[project.id], "/projects/v6/");
});

test("editorial and publication renderers hide non-public typed references", async () => {
  const { byId, routeById } = await loadFixture();
  const hiddenConcept: Entity = {
    ...byId.get("ea:concept:graph-runtime")!,
    id: "ea:concept:hidden-editorial-reference",
    slug: { canonical: "hidden-editorial-reference" },
    title: "Hidden Editorial Reference",
    visibility: "archive",
    publicationClass: "supporting",
  } as Entity;
  const scopedById = new Map([...byId, [hiddenConcept.id, hiddenConcept]]);
  const scopedRouteById = { ...routeById, ...routeIndex([hiddenConcept]) };
  const framework = byId.get("ea:framework:electronic-artefacts-lightweight-template") as FrameworkEntity;
  const publication = byId.get("ea:publication:knowledge-graphs-for-cultural-infrastructure") as PublicationEntity;

  const editorial = renderEditorialPanels({
    ...framework,
    components: [{ id: hiddenConcept.id }],
  }, scopedById, scopedRouteById);
  const article = renderPublicationPage({
    ...publication,
    subjects: [{ id: hiddenConcept.id }],
    evidence: [{ id: hiddenConcept.id }],
  }, [], scopedById, scopedRouteById);

  assert.doesNotMatch(editorial, /Hidden Editorial Reference/);
  assert.doesNotMatch(article, /Hidden Editorial Reference/);
  assert.doesNotMatch(article, /hidden-editorial-reference/);
});

test("translated pages inherit canonical public relations with localized routes", async () => {
  const { entities } = await loadFixture();
  const relations = await loadRelations(path.resolve("."));
  const frenchGraphRuntime = entities.find((entity) => entity.id === "ea:concept:graph-runtime-fr")!;
  const { byId, routeById } = localizedView(entities, "fr");

  const relationships = renderRelationshipGroups(frenchGraphRuntime, relations, byId, routeById);
  const graph = renderLocalGraph(frenchGraphRuntime, relations, byId);

  assert.match(relationships, /RELATIONS DOCUMENTÉES/);
  assert.match(relationships, /href="\/fr\//);
  assert.doesNotMatch(relationships, /href="#"/);
  assert.match(graph, /7 liens publics relient/);
  assert.match(graph, /data-graph-src="\/graph\/neighborhoods\/fr\/concept\/graph-runtime\.json"/);
});
