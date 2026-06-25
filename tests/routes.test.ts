import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildI18nAlternates } from "../src/build/build-i18n-alternates.js";
import { routeForEntity } from "../src/config/routes.js";
import { validateGraph } from "../src/build/validate-graph.js";
import type { Entity } from "../src/schema/entities.js";

test("builds required canonical and identifier routes", async () => {
  const routes = buildRoutes(await loadContent(path.resolve(".")));
  const byId = Object.fromEntries(routes.map((route) => [route.id, route]));
  assert.equal(byId["ea:concept:graph-runtime"].route, "/knowledge/concepts/graph-runtime/");
  assert.equal(byId["ea:researchField:runtime-theory"].identifier, "/id/research-field/runtime-theory/");
  assert.equal(byId["ea:program:vaste"].route, "/programs/vaste/");
  assert.equal(byId["ea:project:vestiges"].route, "/projects/vestiges/");
});

test("localizes non-default entity routes without changing English routes", async () => {
  const entities = await loadContent(path.resolve("."));
  const vestiges = entities.find((entity) => entity.id === "ea:project:vestiges")!;
  const frenchVestiges = {
    ...vestiges,
    locale: "fr",
    slug: { canonical: "vestiges" },
  } as Entity;

  assert.equal(routeForEntity(vestiges), "/projects/vestiges/");
  assert.equal(routeForEntity(frenchVestiges), "/fr/projects/vestiges/");
});

test("allows the same slug in another locale when the entity id is distinct", async () => {
  const entities = await loadContent(path.resolve("."));
  const vestiges = entities.find((entity) => entity.id === "ea:project:vestiges")!;
  const frenchVestiges = {
    ...vestiges,
    id: "ea:project:vestiges-fr",
    locale: "fr",
    translationOf: vestiges.id,
    slug: { canonical: vestiges.slug.canonical },
  } as Entity;

  assert.doesNotThrow(() => validateGraph([...entities, frenchVestiges], []));
});

test("builds route alternates for translated entity groups", async () => {
  const entities = await loadContent(path.resolve("."));
  const vestiges = entities.find((entity) => entity.id === "ea:project:vestiges")!;
  const frenchVestiges = {
    ...vestiges,
    id: "ea:project:vestiges-fr",
    locale: "fr",
    translationOf: vestiges.id,
    slug: { canonical: vestiges.slug.canonical },
  } as Entity;

  const alternates = buildI18nAlternates([...entities, frenchVestiges]);
  assert.deepEqual(alternates["/projects/vestiges/"], {
    en: "/projects/vestiges/",
    fr: "/fr/projects/vestiges/",
  });
  assert.deepEqual(alternates["/fr/projects/vestiges/"], {
    en: "/projects/vestiges/",
    fr: "/fr/projects/vestiges/",
  });
});
