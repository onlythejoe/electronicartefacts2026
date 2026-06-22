import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildGraphViews } from "../src/graph/build-views.js";

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
