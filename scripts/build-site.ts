import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { validateGraph } from "../src/build/validate-graph.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildCatalog, isPublicEntity } from "../src/build/build-catalog.js";
import { routeToFile, writeJson, writeText } from "../src/build/write-output.js";
import { metadataFor } from "../src/seo/metadata.js";
import { buildSitemap } from "../src/seo/sitemaps.js";
import { jsonLdFor } from "../src/semantic/jsonld.js";
import { routeForEntity } from "../src/config/routes.js";
import { renderLayout } from "../src/templates/layout.js";
import { renderEntityPage } from "../src/templates/entity-page.js";
import { renderPublicationPage } from "../src/templates/publication-page.js";
import { escapeHtml } from "../src/templates/html.js";
import { buildSearchDocuments } from "../src/search/documents.js";
import { buildSearchIndex } from "../src/search/build-index.js";
import { buildGraphViews } from "../src/graph/build-views.js";
import type { Entity, PublicationEntity } from "../src/schema/entities.js";

const rootDir = path.resolve(".");
const entities = await loadContent(rootDir);
const relations = await loadRelations(rootDir);
validateGraph(entities, relations);
const routes = buildRoutes(entities);
const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
const byId = new Map(entities.map((entity) => [entity.id, entity]));
const publicEntities = entities.filter(isPublicEntity);

const rootifyPartials = (html: string): string =>
  html
    .replaceAll('href="./', 'href="/')
    .replaceAll('src="./', 'src="/');

const header = rootifyPartials(await readFile(path.join(rootDir, "assets/partials/header.html"), "utf8"));
const footer = rootifyPartials(await readFile(path.join(rootDir, "assets/partials/footer.html"), "utf8"));

for (const entity of publicEntities) {
  const metadata = metadataFor(entity);
  const body = entity.type === "publication"
    ? renderPublicationPage(entity as PublicationEntity, relations, byId, routeById)
    : renderEntityPage(entity, relations, byId, routeById);
  const html = renderLayout({
    metadata,
    body,
    header,
    footer,
    jsonLd: jsonLdFor(entity),
    pageClass: entity.type,
  });
  await writeText(routeToFile(rootDir, routeForEntity(entity)), html);

  const identifier = routes.find((route) => route.id === entity.id)!;
  const identifierDir = path.join(rootDir, identifier.identifier.replace(/^\/|\/$/g, ""));
  const jsonLd = jsonLdFor(entity);
  await writeJson(path.join(identifierDir, "index.jsonld"), jsonLd);
  await writeJson(path.join(identifierDir, "index.json"), entity);
  await writeText(path.join(identifierDir, "index.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${metadata.canonicalUrl}"><link rel="alternate" type="application/ld+json" href="./index.jsonld"><title>${escapeHtml(entity.title)} identifier</title><script>location.replace(${JSON.stringify(routeForEntity(entity))})</script></head><body><p><a href="${routeForEntity(entity)}">Open ${escapeHtml(entity.title)}</a></p></body></html>`);
}

const hubMetadata = (title: string, description: string, route: string) => ({
  title: `${title} | Electronic Artefacts`,
  description,
  canonicalUrl: `https://electronicartefacts.com${route}`,
  robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  image: "https://electronicartefacts.com/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg",
  imageAlt: "Electronic Artefacts knowledge platform",
});

const hubCards = (items: Entity[]) => `<div class="card-grid card-grid--two">${items.map((entity) => `
  <article class="panel">
    <p class="card__meta">${escapeHtml(entity.type)}</p>
    <h2 class="card__title"><a href="${routeForEntity(entity)}">${escapeHtml(entity.title)}</a></h2>
    <p class="card__copy">${escapeHtml(entity.definition || entity.abstract)}</p>
    <div class="link-row"><a class="tag" href="${routeForEntity(entity)}">Open record</a></div>
  </article>`).join("")}</div>`;

const writeHub = async (route: string, title: string, description: string, items: Entity[]) => {
  const body = `<section class="zone-card hero"><div class="section-head"><p class="eyebrow">KNOWLEDGE PLATFORM</p><h1 class="display-title">${escapeHtml(title)}</h1><p class="lede">${escapeHtml(description)}</p></div>${hubCards(items)}</section>`;
  await writeText(routeToFile(rootDir, route), renderLayout({
    metadata: hubMetadata(title, description, route),
    body,
    header,
    footer,
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: title, url: `https://electronicartefacts.com${route}` },
    pageClass: "generated-hub",
  }));
};

await writeHub("/knowledge/", "Knowledge", "Canonical concepts, research fields, programs and applied projects in the Electronic Artefacts graph.", publicEntities.filter((entity) => ["concept", "researchField", "program", "project"].includes(entity.type)));
await writeHub("/knowledge/concepts/", "Concepts", "Canonical definitions maintained by Electronic Artefacts and connected to implementations and evidence.", publicEntities.filter((entity) => entity.type === "concept"));
await writeHub("/publications/", "Publications", "Research notes and authored records published by Electronic Artefacts.", publicEntities.filter((entity) => entity.type === "publication"));

const searchDocuments = buildSearchDocuments(publicEntities, relations, routes);
await writeJson(path.join(rootDir, "search/documents.json"), searchDocuments);
await writeJson(path.join(rootDir, "search/index.json"), buildSearchIndex(searchDocuments));
const searchBody = `<section class="zone-card hero"><div class="section-head"><p class="eyebrow">KNOWLEDGE SEARCH</p><h1 class="display-title">Search the public graph.</h1><p class="lede">Find concepts, research fields, programs, projects, publications and organizations.</p></div><label class="card__meta" for="generated-search">Query</label><input id="generated-search" class="search-input" type="search" data-generated-search-input placeholder="Graph Runtime, VASTE, Vestiges…"></section><section class="zone-card hero"><div class="stack" data-generated-search-results></div></section><script type="module" src="/assets/js/search/client.js"></script>`;
await writeText(routeToFile(rootDir, "/search/"), renderLayout({
  metadata: { ...hubMetadata("Search", "Search the public Electronic Artefacts knowledge graph.", "/search/"), robots: "noindex,follow" },
  body: searchBody,
  header,
  footer,
  jsonLd: { "@context": "https://schema.org", "@type": "SearchResultsPage", name: "Electronic Artefacts Search" },
  pageClass: "search-generated",
}));

const graphViews = buildGraphViews(publicEntities, relations, routes);
await writeJson(path.join(rootDir, "graph/entities.json"), buildCatalog(entities, relations, routes).entities);
await writeJson(path.join(rootDir, "graph/relations.json"), relations.filter((relation) => relation.visibility === "public"));
for (const view of graphViews) {
  const entity = byId.get(view.focus)!;
  const type = entity.type === "researchField" ? "research-field" : entity.type;
  await writeJson(path.join(rootDir, `graph/neighborhoods/${type}/${entity.slug.canonical}.json`), view);
}

const catalog = buildCatalog(entities, relations, routes);
await writeJson(path.join(rootDir, "generated/public/catalog.json"), catalog);
await writeJson(path.join(rootDir, "generated/manifest/routes.json"), routes);
await writeJson(path.join(rootDir, "generated/manifest/entities.json"), publicEntities);
await writeJson(path.join(rootDir, "generated/manifest/relations.json"), relations.filter((relation) => relation.visibility === "public"));
await writeJson(path.join(rootDir, "generated/manifest/build.json"), {
  schemaVersion: "1.0.0",
  builtAt: new Date().toISOString(),
  entities: publicEntities.length,
  relations: relations.filter((relation) => relation.visibility === "public").length,
});
await writeText(path.join(rootDir, "sitemap.xml"), buildSitemap(entities));

process.stdout.write(`Generated ${publicEntities.length} canonical entity pages, ${routes.length} identifier routes, search data and graph neighborhoods.\n`);
