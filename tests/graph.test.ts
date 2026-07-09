import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildGraphViews } from "../src/graph/build-views.js";
import { graphNeighborhoodRoute } from "../src/graph/paths.js";

test("generates connected local neighborhoods", async () => {
  const entities = await loadContent(path.resolve("."));
  const views = buildGraphViews(entities, await loadRelations(path.resolve(".")), buildRoutes(entities));
  for (const id of ["ea:concept:graph-runtime", "ea:program:vaste", "ea:project:vestiges"]) {
    const view = views.find((item) => item.focus === id);
    assert.ok(view);
    assert.ok(view.edges.length > 0);
    assert.ok(view.nodes.length > 1);
  }
});

test("scopes graph neighborhood files by locale when translated slugs collide", async () => {
  const entities = await loadContent(path.resolve("."));
  const publicEntities = entities.filter((entity) => entity.visibility === "public" && entity.publicationClass !== "internal");
  const outputRoutes = publicEntities.map(graphNeighborhoodRoute);
  const graphRuntime = entities.find((entity) => entity.id === "ea:concept:graph-runtime")!;
  const frenchGraphRuntime = entities.find((entity) => entity.id === "ea:concept:graph-runtime-fr")!;

  assert.equal(graphNeighborhoodRoute(graphRuntime), "/graph/neighborhoods/concept/graph-runtime.json");
  assert.equal(graphNeighborhoodRoute(frenchGraphRuntime), "/graph/neighborhoods/fr/concept/graph-runtime.json");
  assert.equal(new Set(outputRoutes).size, outputRoutes.length);
});

test("localized graph views inherit canonical relations with localized endpoints", async () => {
  const entities = await loadContent(path.resolve("."));
  const relations = await loadRelations(path.resolve("."));
  const routes = buildRoutes(entities);
  const views = buildGraphViews(entities, relations, routes);
  const englishView = views.find((item) => item.focus === "ea:concept:graph-runtime")!;
  const frenchView = views.find((item) => item.focus === "ea:concept:graph-runtime-fr")!;

  assert.equal(frenchView.edges.length, englishView.edges.length);
  assert.ok(frenchView.edges.length > 0);
  assert.ok(frenchView.nodes.some((node) => node.id === "ea:concept:graph-runtime-fr"));
  assert.ok(frenchView.edges.some((edge) =>
    edge.source === "ea:concept:graph-runtime-fr" || edge.target === "ea:concept:graph-runtime-fr"));
  assert.ok(frenchView.nodes.every((node) => node.route.startsWith("/fr/")));
});
