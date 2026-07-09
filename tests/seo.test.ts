import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { buildAgentManifest, buildLlmsTxt } from "../src/seo/agent-index.js";
import { buildKnowledgeGraphCatalogJsonLd } from "../src/seo/knowledge-catalog.js";
import { metadataFor } from "../src/seo/metadata.js";
import { buildOpenSearchDescription } from "../src/seo/opensearch.js";
import { buildSitemap } from "../src/seo/sitemaps.js";
import { buildSecurityTxt } from "../src/seo/trust-files.js";
import { jsonLdFor } from "../src/semantic/jsonld.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { renderEditorialPanels } from "../src/templates/components/editorial-panels.js";
import { renderIdentifierPage } from "../src/templates/identifier-page.js";

test("generates canonical metadata and JSON-LD", async () => {
  const entities = await loadContent(path.resolve("."));
  for (const entity of entities) {
    const metadata = metadataFor(entity);
    assert.ok(metadata.canonicalUrl.startsWith("https://electronicartefacts.com/"));
    assert.equal(metadata.language, entity.locale);
    assert.ok(metadata.alternates?.some((alternate) => alternate.hreflang === entity.locale));
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
  const website = graph.find((node) => node["@type"] === "WebSite");
  const organization = graph.find((node) => node["@type"] === "Organization");
  assert.ok(website);
  assert.ok(organization);
  assert.deepEqual(website.alternateName, ["electronicArtefacts", "electronicartefacts.com"]);
  assert.equal(website.potentialAction, undefined);
  assert.ok(Array.isArray(organization.sameAs));
  assert.deepEqual(organization.alternateName, ["electronicArtefacts", "electronicartefacts.com"]);
  assert.equal((organization.logo as Record<string, unknown>).width, 1024);

  const primary = graph.find((node) => node["@id"] === "https://electronicartefacts.com/id/publication/knowledge-graphs-for-cultural-infrastructure/");
  assert.ok(primary);
  assert.ok(primary.wordCount);
  assert.ok(Array.isArray(primary.author));
  assert.ok(Array.isArray(primary.about));
  assert.ok(Array.isArray(primary.citation));

  const webpage = graph.find((node) => node["@id"] === "https://electronicartefacts.com/publications/knowledge-graphs-for-cultural-infrastructure/#webpage");
  assert.ok(webpage);
  assert.deepEqual(webpage.breadcrumb, { "@id": "https://electronicartefacts.com/publications/knowledge-graphs-for-cultural-infrastructure/#breadcrumb" });
  assert.ok(graph.some((node) => node["@id"] === "https://electronicartefacts.com/publications/knowledge-graphs-for-cultural-infrastructure/#breadcrumb"));
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
  assert.match(html, /Sources/);
});

test("sitemap excludes noindex generated search route", async () => {
  const entities = await loadContent(path.resolve("."));
  const sitemap = buildSitemap(entities);

  assert.doesNotMatch(sitemap, /https:\/\/electronicartefacts\.com\/search\//);
  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(sitemap, /<xhtml:link rel="alternate" hreflang="en" href="https:\/\/electronicartefacts\.com\/" \/>/);
  assert.match(sitemap, /<xhtml:link rel="alternate" hreflang="fr" href="https:\/\/electronicartefacts\.com\/fr\/" \/>/);
  assert.match(sitemap, /<loc>https:\/\/electronicartefacts\.com\/fr\/<\/loc>/);
  assert.match(sitemap, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.match(sitemap, /<loc>https:\/\/electronicartefacts\.com\/<\/loc>.*<lastmod>2026-07-09<\/lastmod>/);
  assert.match(sitemap, /<image:loc>https:\/\/electronicartefacts\.com\/assets\/media\/projects\/electronic-artefacts\/electronic-artefacts-search\.jpg<\/image:loc>/);
});

test("agent indexes expose canonical retrieval resources", async () => {
  const entities = await loadContent(path.resolve("."));
  const llms = buildLlmsTxt(entities);
  const manifest = buildAgentManifest(entities);

  assert.match(llms, /# Electronic Artefacts/);
  assert.match(llms, /https:\/\/electronicartefacts\.com\/agent-manifest\.json/);
  assert.match(llms, /https:\/\/electronicartefacts\.com\/graph\/catalog\.jsonld/);
  assert.match(llms, /https:\/\/electronicartefacts\.com\/search\/\?q=knowledge%20graph/);
  assert.equal(manifest.retrievalPolicy.searchEndpoint, "https://electronicartefacts.com/search/?q={search_term_string}");
  assert.equal(manifest.retrievalPolicy.knowledgeGraphCatalog, "https://electronicartefacts.com/graph/catalog.jsonld");
  assert.ok(manifest.records.some((record) => record.id === "ea:concept:ai-agent"));
  assert.ok(manifest.records.every((record) => record.url.startsWith("https://electronicartefacts.com/")));
});

test("machine contracts expose graph catalog, search and trust endpoints", async () => {
  const root = path.resolve(".");
  const entities = await loadContent(root);
  const relations = await loadRelations(root);
  const catalog = buildKnowledgeGraphCatalogJsonLd(entities, relations);
  const graph = catalog["@graph"] as Array<Record<string, unknown>>;
  const openSearch = buildOpenSearchDescription();
  const securityTxt = buildSecurityTxt();

  assert.ok(graph.some((node) => node["@type"] === "DataCatalog"));
  assert.ok(graph.some((node) => node["@type"] === "Dataset"));
  assert.ok(graph.some((node) => node["@id"] === "https://electronicartefacts.com/graph/catalog.jsonld#records"));
  assert.match(openSearch, /application\/opensearchdescription\+xml|OpenSearchDescription/);
  assert.match(openSearch, /https:\/\/electronicartefacts\.com\/search\/\?q=\{searchTerms\}/);
  assert.match(securityTxt, /Contact: mailto:electronic\.artefacts@gmail\.com/);
  assert.match(securityTxt, /Canonical: https:\/\/electronicartefacts\.com\/\.well-known\/security\.txt/);
});

test("identifier routes expose noindex canonical metadata and JSON-LD fallback", async () => {
  const entities = await loadContent(path.resolve("."));
  const entity = entities.find((candidate) => candidate.id === "ea:concept:graph-runtime");
  assert.ok(entity);

  const metadata = metadataFor(entity);
  const html = renderIdentifierPage({
    entity,
    metadata,
    route: "/knowledge/concepts/graph-runtime/",
  });

  assert.match(html, /<meta name="description" content="Persistent identifier route for Graph Runtime/);
  assert.match(html, /<meta name="robots" content="noindex,follow" \/>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/electronicartefacts\.com\/knowledge\/concepts\/graph-runtime\/" \/>/);
  assert.match(html, /<link rel="alternate" type="application\/ld\+json" href=".\/index.jsonld" \/>/);
  assert.match(html, /<meta http-equiv="refresh" content="0; url=\/knowledge\/concepts\/graph-runtime\/" \/>/);
});
