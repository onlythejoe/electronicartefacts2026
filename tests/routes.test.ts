import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { buildRoutes } from "../src/build/build-routes.js";

test("builds required canonical and identifier routes", async () => {
  const routes = buildRoutes(await loadContent(path.resolve(".")));
  const byId = Object.fromEntries(routes.map((route) => [route.id, route]));
  assert.equal(byId["ea:concept:graph-runtime"].route, "/knowledge/concepts/graph-runtime/");
  assert.equal(byId["ea:researchField:runtime-theory"].identifier, "/id/research-field/runtime-theory/");
  assert.equal(byId["ea:program:vaste"].route, "/programs/vaste/");
  assert.equal(byId["ea:project:vestiges"].route, "/projects/vestiges/");
});
