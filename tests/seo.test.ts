import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { metadataFor } from "../src/seo/metadata.js";
import { buildSitemap } from "../src/seo/sitemaps.js";
import { jsonLdFor } from "../src/semantic/jsonld.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { renderEditorialPanels } from "../src/templates/components/editorial-panels.js";

test("generates canonical metadata and JSON-LD", async () => {
  const entities = await loadContent(path.resolve("."));
  for (const entity of entities) {
    const metadata = metadataFor(entity);
    assert.ok(metadata.canonicalUrl.startsWith("https://electronicartefacts.com/"));
    assert.match(metadata.robots, /^index,follow/);
    const jsonLd = jsonLdFor(entity);
    assert.equal(jsonLd["@context"], "https://schema.org");
    assert.ok(jsonLd["@graph"].length >= 2);
  }
});

test("metadata stays descriptive enough for editorial SEO", async () => {
  const entities = await loadContent(path.resolve("."));
  for (const entity of entities) {
    const metadata = metadataFor(entity);

    assert.ok(metadata.title.length <= 68, `${entity.id} title is too long`);
    assert.ok(metadata.description.length >= 90, `${entity.id} description is too short`);
    assert.ok(metadata.description.length <= 160, `${entity.id} description is too long`);
    assert.ok(metadata.keywords.length > 0, `${entity.id} should expose keywords`);
    assert.equal(metadata.modifiedAt, entity.version.modifiedAt);
  }
});

test("JSON-LD exposes site, publisher and article evidence", async () => {
  const entities = await loadContent(path.resolve("."));
  const publication = entities.find((entity) => entity.id === "ea:publication:knowledge-graphs-for-cultural-infrastructure");
  assert.ok(publication);

  const graph = jsonLdFor(publication)["@graph"] as Array<Record<string, unknown>>;
  assert.ok(graph.some((node) => node["@type"] === "WebSite"));
  assert.ok(graph.some((node) => node["@type"] === "Organization"));

  const primary = graph.find((node) => node["@id"] === "https://electronicartefacts.com/id/publication/knowledge-graphs-for-cultural-infrastructure/");
  assert.ok(primary);
  assert.ok(primary.wordCount);
  assert.ok(Array.isArray(primary.author));
  assert.ok(Array.isArray(primary.about));
  assert.ok(Array.isArray(primary.citation));
});

test("editorial panels expose structured fields on thin reference records", async () => {
  const entities = await loadContent(path.resolve("."));
  const routes = buildRoutes(entities);
  const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const technology = entities.find((entity) => entity.id === "ea:technology:webgl");
  assert.ok(technology);

  const html = renderEditorialPanels(technology, byId, routeById);
  assert.match(html, /Technology role/);
  assert.match(html, /WebGL supports procedural graphics/);
  assert.match(html, /Official URL/);
  assert.match(html, /Source trail/);
});

test("sitemap excludes noindex generated search route", async () => {
  const entities = await loadContent(path.resolve("."));
  const sitemap = buildSitemap(entities);

  assert.doesNotMatch(sitemap, /https:\/\/electronicartefacts\.com\/search\//);
});
