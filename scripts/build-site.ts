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
const publicIds = new Set(publicEntities.map((entity) => entity.id));
const publicRoutes = routes.filter((route) => publicIds.has(route.id));

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

const typeLabel = (type: string): string => type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
const typeSlug = (type: string): string => type.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const entitySummary = (entity: Entity): string => entity.definition || entity.description || entity.abstract;
const hubTags = (entity: Entity, limit: number): string[] =>
  [entity.status, entity.maturity, ...(entity.tags || [])]
    .filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index)
    .slice(0, limit);

const hubCard = (entity: Entity, index: number, options: { lead?: boolean } = {}) => {
  const route = routeForEntity(entity);
  const label = typeLabel(entity.type);
  const tags = hubTags(entity, options.lead ? 5 : 3);
  return `
    <article class="panel generated-hub-card generated-hub-card--${escapeHtml(typeSlug(entity.type))}${options.lead ? " generated-hub-card--lead" : ""}" data-hub-card-type="${escapeHtml(entity.type)}">
      <a class="project-card__overlay-link generated-hub-card__overlay" href="${route}" aria-label="Open ${escapeHtml(entity.title)}"></a>
      <div class="generated-hub-card__top">
        <span class="generated-hub-card__number">${String(index + 1).padStart(2, "0")}</span>
        <p class="card__meta">${escapeHtml(label)}</p>
      </div>
      <h2 class="card__title"><a href="${route}">${escapeHtml(entity.title)}</a></h2>
      <p class="card__copy">${escapeHtml(entitySummary(entity))}</p>
      ${tags.length ? `<div class="tag-cluster tag-cluster--compact generated-hub-card__tags">${tags.map((tag) => `<span class="chip taxonomy-pill">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="link-row"><a class="tag" href="${route}">Open record</a></div>
    </article>`;
};

const hubCards = (items: Entity[]) => {
  if (!items.length) {
    return `<div class="generated-hub-layout"><article class="panel generated-hub-card generated-hub-card--lead"><p class="card__meta">empty index</p><h2 class="card__title">No public records yet.</h2><p class="card__copy">This hub is ready to receive public graph records.</p></article></div>`;
  }

  const lead = items[0]!;
  const secondary = items.slice(1);
  const groups = Object.entries(items.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {}));

  return `
    <div class="generated-hub-layout">
      ${hubCard(lead, 0, { lead: true })}
      <div class="generated-hub-stack">
        <div class="generated-hub-stack__head">
          <p class="card__meta">Graph index</p>
          <strong>${items.length} ${items.length === 1 ? "record" : "records"}</strong>
        </div>
        <nav class="generated-hub-rail" aria-label="Knowledge record types">
          ${groups
            .map(
              ([type, count]) => `
                <a class="generated-hub-rail__item" href="${routeForEntity(items.find((entity) => entity.type === type) || lead)}">
                  <span>${String(count).padStart(2, "0")}</span>
                  <strong>${escapeHtml(typeLabel(type))}</strong>
                </a>`,
            )
            .join("")}
        </nav>
        <div class="generated-hub-grid">
          ${(secondary.length ? secondary : items).map((entity, index) => hubCard(entity, secondary.length ? index + 1 : index)).join("")}
        </div>
      </div>
    </div>`;
};

const writeHub = async (route: string, title: string, description: string, items: Entity[]) => {
  const groups = Object.entries(items.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {}));
  const metrics = groups
    .slice(0, 4)
    .map(([type, count]) => {
      const label = type.replace(/([A-Z])/g, " $1").toLowerCase();
      return `<span><strong>${count}</strong><em>${escapeHtml(label)}</em></span>`;
    })
    .join("");
  const secondaryAction = route === "/knowledge/" ? "/knowledge/concepts/" : "/knowledge/";
  const secondaryLabel = route === "/knowledge/" ? "Concepts" : "Knowledge index";
  const sceneNodes = groups
    .slice(0, 4)
    .map(([type], index) => {
      const entity = items.find((candidate) => candidate.type === type);
      const href = entity ? routeForEntity(entity) : route;
      return `<a class="knowledge-graph-stage__node knowledge-graph-stage__node--${index + 1}" href="${href}" data-depth="${(0.7 + index * 0.27).toFixed(2)}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(typeLabel(type))}</strong></a>`;
    })
    .join("");
  const body = `
    <section class="zone-card hero generated-hub-hero generated-hub-hero--${escapeHtml(typeSlug(title))} intent-hero intent-hero--knowledge">
      <div class="intent-hero__grid generated-hub-hero__intro">
        <div class="section-head intent-hero__copy">
          <p class="eyebrow">KNOWLEDGE PLATFORM</p>
          <h1 class="display-title">${escapeHtml(title)}</h1>
          <p class="lede">${escapeHtml(description)}</p>
          <div class="button-row button-row--compact generated-hub-hero__actions">
            <a class="button button--primary" href="/search/">Search graph</a>
            <a class="button button--secondary" href="${secondaryAction}">${secondaryLabel}</a>
          </div>
        </div>
        <div class="intent-hero__stage knowledge-graph-stage" data-intent-stage aria-label="Knowledge graph overview">
          <div class="intent-hero__stage-label"><span>Addressable knowledge</span><strong>${items.length} connected records</strong></div>
          <svg class="knowledge-graph-stage__lines" viewBox="0 0 600 440" aria-hidden="true">
            <path d="M300 220 L112 116 M300 220 L478 102 M300 220 L108 334 M300 220 L492 326" />
            <circle cx="300" cy="220" r="116" />
          </svg>
          <div class="knowledge-graph-stage__core" data-depth="1.3"><span>EA</span><strong>${escapeHtml(title)}</strong></div>
          ${sceneNodes}
          <div class="intent-hero__stats generated-hub-hero__metrics" aria-label="Knowledge inventory" data-depth="1.65">${metrics}</div>
        </div>
      </div>
    </section>
    <section class="zone-card hero generated-hub-index">
      <div class="section-head"><p class="eyebrow">GRAPH INDEX</p><h2>Browse the connected records.</h2><p class="lede">Every entry keeps its type, status, context and route into the wider knowledge system.</p></div>
${hubCards(items).trimStart()}
    </section>`;
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
const catalog = buildCatalog(entities, relations, routes);
await writeJson(path.join(rootDir, "graph/entities.json"), catalog.entities);
await writeJson(path.join(rootDir, "graph/relations.json"), catalog.relations);
for (const view of graphViews) {
  const entity = byId.get(view.focus)!;
  const type = entity.type === "researchField" ? "research-field" : entity.type;
  await writeJson(path.join(rootDir, `graph/neighborhoods/${type}/${entity.slug.canonical}.json`), view);
}

await writeJson(path.join(rootDir, "generated/public/catalog.json"), catalog);
await writeJson(path.join(rootDir, "generated/manifest/routes.json"), publicRoutes);
await writeJson(path.join(rootDir, "generated/manifest/entities.json"), publicEntities);
await writeJson(path.join(rootDir, "generated/manifest/relations.json"), catalog.relations);
await writeJson(path.join(rootDir, "generated/manifest/build.json"), {
  schemaVersion: "1.0.0",
  builtAt: new Date().toISOString(),
  entities: publicEntities.length,
  relations: catalog.relations.length,
});
await writeText(path.join(rootDir, "sitemap.xml"), buildSitemap(entities));

process.stdout.write(`Generated ${publicEntities.length} canonical entity pages, ${routes.length} identifier routes, search data and graph neighborhoods.\n`);
