import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { loadRelations } from "../src/build/load-relations.js";
import { withDerivedRelations } from "../src/build/derive-relations.js";
import { validateGraph } from "../src/build/validate-graph.js";
import { buildRoutes } from "../src/build/build-routes.js";
import { buildCatalog, isPublicEntity } from "../src/build/build-catalog.js";
import { buildI18nAlternates } from "../src/build/build-i18n-alternates.js";
import { loadPreviousPublicEntities, removeStaleGeneratedOutputs } from "../src/build/reconcile-generated-output.js";
import { routeToFile, writeJson, writeText } from "../src/build/write-output.js";
import { metadataFor } from "../src/seo/metadata.js";
import { buildAgentManifest, buildLlmsFullTxt, buildLlmsTxt } from "../src/seo/agent-index.js";
import { buildKnowledgeGraphCatalogJsonLd } from "../src/seo/knowledge-catalog.js";
import { buildOpenSearchDescription } from "../src/seo/opensearch.js";
import { buildSitemap } from "../src/seo/sitemaps.js";
import { buildHumansTxt, buildSecurityTxt } from "../src/seo/trust-files.js";
import { jsonLdFor, organizationNode, websiteNode } from "../src/semantic/jsonld.js";
import { identifierPath, routeForEntity } from "../src/config/routes.js";
import { defaultLocale, localeConfig } from "../src/config/i18n.js";
import { renderLayout } from "../src/templates/layout.js";
import { renderEntityPage } from "../src/templates/entity-page.js";
import { renderIdentifierPage } from "../src/templates/identifier-page.js";
import { renderPublicationPage } from "../src/templates/publication-page.js";
import { escapeHtml } from "../src/templates/html.js";
import { buildSearchDocuments } from "../src/search/documents.js";
import { buildSearchIndex } from "../src/search/build-index.js";
import { buildGraphViews } from "../src/graph/build-views.js";
import { graphNeighborhoodRoute } from "../src/graph/paths.js";
import type { Entity, PublicationEntity } from "../src/schema/entities.js";
import type { Locale } from "../src/schema/entity.js";

const rootDir = path.resolve(".");
const origin = "https://electronicartefacts.com";
const previousPublicEntities = await loadPreviousPublicEntities(rootDir);
const entities = await loadContent(rootDir);
const relations = withDerivedRelations(entities, await loadRelations(rootDir));
validateGraph(entities, relations);
const routes = buildRoutes(entities);
const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
const byId = new Map(entities.map((entity) => [entity.id, entity]));
const publicEntities = entities.filter(isPublicEntity);
const publicDefaultLocaleEntities = publicEntities.filter((entity) => entity.locale === defaultLocale);
const publicIds = new Set(publicEntities.map((entity) => entity.id));
const publicRoutes = routes.filter((route) => publicIds.has(route.id));
const i18nAlternates = buildI18nAlternates(publicEntities);
const localizedViews = new Map<string, { byId: Map<string, Entity>; routeById: Record<string, string> }>();

const localizedViewFor = (locale: string) => {
  const cached = localizedViews.get(locale);
  if (cached) return cached;

  const viewById = new Map(byId);
  const viewRouteById = { ...routeById };

  for (const candidate of publicEntities) {
    if (candidate.locale !== locale || !candidate.translationOf) continue;
    viewById.set(candidate.translationOf, candidate);
    viewById.set(candidate.id, candidate);
    viewRouteById[candidate.translationOf] = routeForEntity(candidate);
    viewRouteById[candidate.id] = routeForEntity(candidate);
  }

  const view = { byId: viewById, routeById: viewRouteById };
  localizedViews.set(locale, view);
  return view;
};

const rootifyPartials = (html: string): string =>
  html
    .replaceAll('href="./', 'href="/')
    .replaceAll('src="./', 'src="/');

const header = rootifyPartials(await readFile(path.join(rootDir, "assets/partials/header.html"), "utf8"));
const footer = rootifyPartials(await readFile(path.join(rootDir, "assets/partials/footer.html"), "utf8"));

for (const entity of publicEntities) {
  const route = routeForEntity(entity);
  const routeAlternates = i18nAlternates[route];
  const { byId: localById, routeById: localRouteById } = localizedViewFor(entity.locale);
  const metadata = {
    ...metadataFor(entity),
    ...(routeAlternates
      ? {
          alternates: [
            ...Object.entries(routeAlternates).map(([hreflang, href]) => ({
              hreflang,
              href: `https://electronicartefacts.com${href}`,
            })),
            ...(routeAlternates.en
              ? [{ hreflang: "x-default", href: `https://electronicartefacts.com${routeAlternates.en}` }]
              : []),
          ],
        }
      : {}),
  };
  const body = entity.type === "publication"
    ? renderPublicationPage(entity as PublicationEntity, relations, localById, localRouteById)
    : renderEntityPage(entity, relations, localById, localRouteById);
  const html = renderLayout({
    metadata,
    body,
    header,
    footer,
    jsonLd: jsonLdFor(entity),
    pageClass: entity.type,
    entryId: entity.slug.canonical,
  });
  await writeText(routeToFile(rootDir, routeForEntity(entity)), html);

  const identifier = routes.find((route) => route.id === entity.id)!;
  const identifierDir = path.join(rootDir, identifier.identifier.replace(/^\/|\/$/g, ""));
  const jsonLd = jsonLdFor(entity);
  await writeJson(path.join(identifierDir, "index.jsonld"), jsonLd);
  await writeJson(path.join(identifierDir, "index.json"), entity);
  await writeText(path.join(identifierDir, "index.html"), renderIdentifierPage({
    entity,
    metadata,
    route: routeForEntity(entity),
  }));
}

type HubLocale = Locale;

interface HubCopy {
  platformEyebrow: string;
  searchButton: string;
  summaryLabel: string;
  summaryValue: string;
  graphIndexEyebrow: string;
  graphIndexTitle: string;
  graphIndexCopy: string;
  graphIndexLabel: string;
  loadMoreLabel: string;
  overviewLabel: string;
  openPage: string;
  recordSingular: string;
  recordPlural: string;
  typeRailLabel: string;
  knowledgeIndexLabel: string;
  conceptsLabel: string;
  emptyMeta: string;
  emptyTitle: string;
  emptyCopy: string;
  typeLabels: Partial<Record<Entity["type"], string>>;
  typeDescriptions: Partial<Record<Entity["type"], string>>;
}

const hubCopy: Record<HubLocale, HubCopy> = {
  en: {
    platformEyebrow: "KNOWLEDGE PLATFORM",
    searchButton: "Search graph",
    summaryLabel: "Addressable knowledge",
    summaryValue: "connected records",
    graphIndexEyebrow: "GRAPH INDEX",
    graphIndexTitle: "Browse the connected records.",
    graphIndexCopy: "Every entry keeps its type, status, context and route into the wider knowledge system.",
    graphIndexLabel: "Graph index",
    loadMoreLabel: "Show more",
    overviewLabel: "Knowledge graph overview",
    openPage: "Open page",
    recordSingular: "record",
    recordPlural: "records",
    typeRailLabel: "Knowledge record types",
    knowledgeIndexLabel: "Knowledge index",
    conceptsLabel: "Concepts",
    emptyMeta: "empty index",
    emptyTitle: "No public pages yet.",
    emptyCopy: "This hub is ready to receive public pages.",
    typeLabels: {
      concept: "concept",
      method: "method",
      framework: "framework",
      technology: "technology",
      researchField: "research field",
      researchQuestion: "research question",
      publication: "publication",
      project: "project",
      program: "program",
      collection: "collection",
    },
    typeDescriptions: {
      concept: "Definitions and durable terms",
      publication: "Research notes and articles",
      researchField: "Active research territories",
      researchQuestion: "Active research questions",
      technology: "Protocols, tools and standards",
      method: "Repeatable studio procedures",
      framework: "Operational models",
      project: "Public and client work",
      program: "Runtimes and systems",
      collection: "Curated neighborhoods",
    },
  },
  fr: {
    platformEyebrow: "PLATEFORME DE CONNAISSANCE",
    searchButton: "Rechercher le graphe",
    summaryLabel: "Connaissances adressables",
    summaryValue: "enregistrements connectés",
    graphIndexEyebrow: "INDEX DU GRAPHE",
    graphIndexTitle: "Parcourez les enregistrements connectés.",
    graphIndexCopy: "Chaque entrée conserve son type, son état, son contexte et sa route dans le système de connaissance élargi.",
    graphIndexLabel: "Index du graphe",
    loadMoreLabel: "Voir plus",
    overviewLabel: "Aperçu du graphe de connaissance",
    openPage: "Ouvrir la page",
    recordSingular: "enregistrement",
    recordPlural: "enregistrements",
    typeRailLabel: "Types d’enregistrements de connaissance",
    knowledgeIndexLabel: "Index des connaissances",
    conceptsLabel: "Concepts",
    emptyMeta: "index vide",
    emptyTitle: "Aucune page publique pour le moment.",
    emptyCopy: "Ce hub est prêt à accueillir des pages publiques.",
    typeLabels: {
      concept: "concept",
      method: "méthode",
      framework: "cadre",
      technology: "technologie",
      researchField: "domaine de recherche",
      researchQuestion: "question de recherche",
      publication: "publication",
      project: "projet",
      program: "programme",
      collection: "collection",
    },
    typeDescriptions: {
      concept: "Définitions et termes durables",
      publication: "Notes de recherche et articles",
      researchField: "Territoires de recherche actifs",
      researchQuestion: "Questions de recherche actives",
      technology: "Protocoles, outils et standards",
      method: "Procédures de studio répétables",
      framework: "Modèles opérationnels",
      project: "Travaux publics et clients",
      program: "Moteurs et systèmes",
      collection: "Ensembles éditoriaux",
    },
  },
};

const hubMetadata = (
  title: string,
  description: string,
  route: string,
  locale: HubLocale,
  alternates?: Array<{ hreflang: string; href: string }>,
) => ({
  title: `${title} | Electronic Artefacts`,
  description,
  canonicalUrl: `${origin}${route}`,
  language: locale,
  locale: localeConfig(locale).ogLocale,
  alternates: alternates || [
    { hreflang: locale, href: `${origin}${route}` },
    { hreflang: "x-default", href: `${origin}${route}` },
  ],
  robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  image: `${origin}/assets/media/projects/electronic-artefacts/electronic-artefacts-search.jpg`,
  imageAlt: "Electronic Artefacts knowledge platform",
  ogType: "website" as const,
  keywords: ["Electronic Artefacts", title, "knowledge graph", "creative technology", "research"],
  modifiedAt: "2026-06-24",
});

const typeLabel = (type: string, locale: HubLocale = defaultLocale): string =>
  hubCopy[locale].typeLabels[type as Entity["type"]] || type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
const typeSlug = (type: string): string => type.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const entitySummary = (entity: Entity): string => entity.definition || entity.description || entity.abstract;
const hubTags = (entity: Entity, limit: number): string[] =>
  [entity.status, entity.maturity, ...(entity.tags || [])]
    .filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index)
    .slice(0, limit);

const hubCard = (entity: Entity, index: number, locale: HubLocale, options: { lead?: boolean } = {}) => {
  const route = routeForEntity(entity);
  const label = typeLabel(entity.type, locale);
  const copy = hubCopy[locale];
  const tags = hubTags(entity, options.lead ? 5 : 3);
  return `
    <article class="panel generated-hub-card generated-hub-card--${escapeHtml(typeSlug(entity.type))}${options.lead ? " generated-hub-card--lead" : ""}" data-hub-card-type="${escapeHtml(entity.type)}">
      <a class="project-card__overlay-link generated-hub-card__overlay" href="${route}" aria-label="${escapeHtml(copy.openPage)} ${escapeHtml(entity.title)}"></a>
      <div class="generated-hub-card__top">
        <span class="generated-hub-card__number">${String(index + 1).padStart(2, "0")}</span>
        <p class="card__meta">${escapeHtml(label)}</p>
      </div>
      <h2 class="card__title"><a href="${route}">${escapeHtml(entity.title)}</a></h2>
      <p class="card__copy">${escapeHtml(entitySummary(entity))}</p>
      ${tags.length ? `<div class="tag-cluster tag-cluster--compact generated-hub-card__tags">${tags.map((tag) => `<span class="chip taxonomy-pill">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="link-row"><a class="tag" href="${route}">${escapeHtml(copy.openPage)}</a></div>
    </article>`;
};

const hubCards = (items: Entity[], locale: HubLocale) => {
  const copy = hubCopy[locale];
  if (!items.length) {
    return `<div class="generated-hub-layout"><article class="panel generated-hub-card generated-hub-card--lead"><p class="card__meta">${escapeHtml(copy.emptyMeta)}</p><h2 class="card__title">${escapeHtml(copy.emptyTitle)}</h2><p class="card__copy">${escapeHtml(copy.emptyCopy)}</p></article></div>`;
  }

  const groups = Object.entries(items.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {}));

  return `
    <div class="generated-hub-stack generated-hub-stack--full" data-progressive-grid data-initial-count="12" data-load-step="12">
        <div class="generated-hub-stack__head">
          <p class="card__meta">${escapeHtml(copy.graphIndexLabel)}</p>
          <strong>${items.length} ${items.length === 1 ? escapeHtml(copy.recordSingular) : escapeHtml(copy.recordPlural)}</strong>
        </div>
        <nav class="generated-hub-rail" aria-label="${escapeHtml(copy.typeRailLabel)}">
          ${groups
            .map(
              ([type, count]) => `
                <a class="generated-hub-rail__item" href="${routeForEntity(items.find((entity) => entity.type === type) || items[0]!)}">
                  <span>${String(count).padStart(2, "0")}</span>
                  <strong>${escapeHtml(typeLabel(type, locale))}</strong>
                </a>`,
            )
            .join("")}
        </nav>
        <div class="generated-hub-grid">
          ${items.map((entity, index) => `<div data-progressive-grid-item>${hubCard(entity, index, locale)}</div>`).join("")}
        </div>
        <button class="button button--secondary generated-hub-load-more" type="button" data-progressive-grid-more>${escapeHtml(copy.loadMoreLabel)}</button>
    </div>`;
};

const writeHub = async (route: string, title: string, description: string, items: Entity[], locale: HubLocale) => {
  const copy = hubCopy[locale];
  const groups = Object.entries(items.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {}));
  const knowledgeRoot = locale === "fr" ? "/fr/knowledge/" : "/knowledge/";
  const secondaryAction = route === knowledgeRoot ? `${knowledgeRoot}concepts/` : knowledgeRoot;
  const secondaryLabel = route === knowledgeRoot ? copy.conceptsLabel : copy.knowledgeIndexLabel;
  const routeAlternates = i18nAlternates[route];
  const alternates = routeAlternates
    ? [
        ...Object.entries(routeAlternates).map(([hreflang, href]) => ({ hreflang, href: `${origin}${href}` })),
        ...(routeAlternates.en ? [{ hreflang: "x-default", href: `${origin}${routeAlternates.en}` }] : []),
      ]
    : undefined;
  const typeOverview = groups
    .slice(0, 6)
    .map(([type, count], index) => {
      const entity = items.find((candidate) => candidate.type === type);
      const href = entity ? routeForEntity(entity) : route;
      const label = typeLabel(type, locale);
      const description = copy.typeDescriptions[type as Entity["type"]] || "Connected public records";
      return `
        <a class="knowledge-map-card knowledge-map-card--${escapeHtml(typeSlug(type))}" href="${href}">
          <span class="knowledge-map-card__index">${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(label)}</strong>
          <em>${count} ${count === 1 ? escapeHtml(copy.recordSingular) : escapeHtml(copy.recordPlural)}</em>
          <small>${escapeHtml(description)}</small>
        </a>`;
    })
    .join("");
  const body = `
    <section class="zone-card hero generated-hub-hero generated-hub-hero--${escapeHtml(typeSlug(title))} intent-hero intent-hero--knowledge">
      <div class="intent-hero__grid generated-hub-hero__intro">
        <div class="section-head intent-hero__copy">
          <p class="eyebrow">${escapeHtml(copy.platformEyebrow)}</p>
          <h1 class="display-title">${escapeHtml(title)}</h1>
          <p class="lede">${escapeHtml(description)}</p>
          <div class="button-row button-row--compact generated-hub-hero__actions">
            <a class="button button--primary" href="${locale === "fr" ? "/fr/search.html" : "/search/"}">${escapeHtml(copy.searchButton)}</a>
            <a class="button button--secondary" href="${secondaryAction}">${escapeHtml(secondaryLabel)}</a>
          </div>
        </div>
        <div class="intent-hero__stage knowledge-map-panel" data-intent-stage aria-label="${escapeHtml(copy.overviewLabel)}">
          <div class="knowledge-map-panel__network" aria-hidden="true">
            <span class="knowledge-map-panel__network-node knowledge-map-panel__network-node--a"></span>
            <span class="knowledge-map-panel__network-node knowledge-map-panel__network-node--b"></span>
            <span class="knowledge-map-panel__network-node knowledge-map-panel__network-node--c"></span>
            <span class="knowledge-map-panel__network-node knowledge-map-panel__network-node--d"></span>
            <span class="knowledge-map-panel__network-node knowledge-map-panel__network-node--e"></span>
            <span class="knowledge-map-panel__network-node knowledge-map-panel__network-node--f"></span>
          </div>
          <div class="knowledge-map-panel__summary" data-depth="1.05">
            <p class="card__meta">${escapeHtml(copy.summaryLabel)}</p>
            <strong>${items.length}</strong>
            <span>${escapeHtml(copy.summaryValue)}</span>
          </div>
          <nav class="knowledge-map-panel__types" aria-label="${escapeHtml(copy.typeRailLabel)}">
            ${typeOverview}
          </nav>
        </div>
      </div>
    </section>
    <section class="zone-card hero generated-hub-index">
      <div class="section-head"><p class="eyebrow">${escapeHtml(copy.graphIndexEyebrow)}</p><h2>${escapeHtml(copy.graphIndexTitle)}</h2><p class="lede">${escapeHtml(copy.graphIndexCopy)}</p></div>
${hubCards(items, locale).trimStart()}
    </section>`;
  const url = `https://electronicartefacts.com${route}`;
  const itemListId = `${url}#itemlist`;
  const breadcrumbId = `${url}#breadcrumb`;
  const localeRoot = locale === "fr" ? "/fr/" : "/";
  const relativeSegments = route.slice(localeRoot.length).split("/").filter(Boolean);
  const breadcrumbLabels: Record<string, Record<HubLocale, string>> = {
    archive: { en: "Archive", fr: "Archives" },
    knowledge: { en: "Knowledge", fr: "Connaissances" },
    publications: { en: "Publications", fr: "Publications" },
  };
  let breadcrumbRoute = localeRoot;
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: locale === "fr" ? "Accueil" : "Home", item: `${origin}${localeRoot}` },
    ...relativeSegments.map((segment, index) => {
      breadcrumbRoute += `${segment}/`;
      return {
        "@type": "ListItem",
        position: index + 2,
        name: index === relativeSegments.length - 1 ? title : breadcrumbLabels[segment]?.[locale] || segment,
        item: `${origin}${breadcrumbRoute}`,
      };
    }),
  ];
  const hubJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { "@id": "https://electronicartefacts.com/#website" },
        publisher: { "@id": "https://electronicartefacts.com/id/organization/electronic-artefacts/" },
        mainEntity: { "@id": itemListId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        name: `${title} records`,
        numberOfItems: items.length,
        itemListElement: items.slice(0, 100).map((entity, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entity.title,
          url: `https://electronicartefacts.com${routeForEntity(entity)}`,
          item: { "@id": `https://electronicartefacts.com${identifierPath(entity)}` },
        })),
      },
      organizationNode,
      websiteNode,
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumbItems,
      },
    ],
  };
  await writeText(routeToFile(rootDir, route), renderLayout({
    metadata: hubMetadata(title, description, route, locale, alternates),
    body,
    header,
    footer,
    jsonLd: hubJsonLd,
    pageClass: "generated-hub",
  }));
};

const publicFrenchEntities = publicEntities.filter((entity) => entity.locale === "fr");

await writeHub("/knowledge/", "Knowledge", "Canonical concepts, methods, frameworks, technologies, research fields, research questions and publications in the Electronic Artefacts graph.", publicDefaultLocaleEntities.filter((entity) => ["concept", "method", "framework", "technology", "researchField", "researchQuestion", "publication"].includes(entity.type)), "en");
await writeHub("/knowledge/concepts/", "Concepts", "Canonical definitions maintained by Electronic Artefacts and connected to implementations and evidence.", publicDefaultLocaleEntities.filter((entity) => entity.type === "concept"), "en");
await writeHub("/knowledge/methods/", "Methods", "Repeatable procedures used by Electronic Artefacts for research, production, preservation and system design.", publicDefaultLocaleEntities.filter((entity) => entity.type === "method"), "en");
await writeHub("/knowledge/frameworks/", "Frameworks", "Structured conceptual and operational models maintained inside the Electronic Artefacts knowledge graph.", publicDefaultLocaleEntities.filter((entity) => entity.type === "framework"), "en");
await writeHub("/knowledge/technologies/", "Technologies", "Languages, protocols, formats, platforms and technical approaches referenced by the Electronic Artefacts knowledge system.", publicDefaultLocaleEntities.filter((entity) => entity.type === "technology"), "en");
await writeHub("/research/questions/", "Research Questions", "Active research questions maintained by Electronic Artefacts and connected to software, projects, concepts and evidence.", publicDefaultLocaleEntities.filter((entity) => entity.type === "researchQuestion"), "en");
await writeHub("/publications/", "Publications", "Research notes and authored records published by Electronic Artefacts.", publicDefaultLocaleEntities.filter((entity) => entity.type === "publication"), "en");
await writeHub("/archive/collections/", "Collections", "Curated neighborhoods that group Electronic Artefacts records by editorial thesis, provenance and research use.", publicDefaultLocaleEntities.filter((entity) => entity.type === "collection"), "en");

await writeHub("/fr/knowledge/", "Connaissances", "Concepts, méthodes, cadres, technologies, domaines de recherche, questions de recherche et publications canoniques du graphe Electronic Artefacts.", publicFrenchEntities.filter((entity) => ["concept", "method", "framework", "technology", "researchField", "researchQuestion", "publication"].includes(entity.type)), "fr");
await writeHub("/fr/knowledge/concepts/", "Concepts", "Définitions canoniques maintenues par Electronic Artefacts et reliées aux implémentations et aux preuves.", publicFrenchEntities.filter((entity) => entity.type === "concept"), "fr");
await writeHub("/fr/knowledge/methods/", "Méthodes", "Procédures reproductibles utilisées par Electronic Artefacts pour la recherche, la production, la préservation et la conception de systèmes.", publicFrenchEntities.filter((entity) => entity.type === "method"), "fr");
await writeHub("/fr/knowledge/frameworks/", "Cadres", "Modèles conceptuels et opérationnels structurés maintenus dans le graphe de connaissance Electronic Artefacts.", publicFrenchEntities.filter((entity) => entity.type === "framework"), "fr");
await writeHub("/fr/knowledge/technologies/", "Technologies", "Langages, protocoles, formats, plateformes et approches techniques référencés dans le système de connaissance Electronic Artefacts.", publicFrenchEntities.filter((entity) => entity.type === "technology"), "fr");
await writeHub("/fr/research/questions/", "Questions de recherche", "Questions de recherche actives maintenues par Electronic Artefacts et reliées aux logiciels, projets, concepts et preuves.", publicFrenchEntities.filter((entity) => entity.type === "researchQuestion"), "fr");
await writeHub("/fr/publications/", "Publications", "Notes de recherche et enregistrements éditoriaux publiés par Electronic Artefacts.", publicFrenchEntities.filter((entity) => entity.type === "publication"), "fr");

const searchDocuments = buildSearchDocuments(publicEntities, relations, routes);
await writeJson(path.join(rootDir, "search/documents.json"), searchDocuments);
await writeJson(path.join(rootDir, "search/index.json"), buildSearchIndex(searchDocuments));
const searchBody = `<section class="zone-card hero"><div class="section-head"><p class="eyebrow">KNOWLEDGE SEARCH</p><h1 class="display-title">Search the public graph.</h1><p class="lede">Find concepts, research fields, programs, projects, publications and organizations.</p></div><label class="card__meta" for="generated-search">Query</label><input id="generated-search" class="search-input" type="search" data-generated-search-input placeholder="Graph Runtime, VASTE, Vestiges…"></section><section class="zone-card hero"><div class="stack" data-generated-search-results></div></section><script type="module" src="/assets/js/search/client.js"></script>`;
const searchAlternates = i18nAlternates["/search/"];
await writeText(routeToFile(rootDir, "/search/"), renderLayout({
  metadata: { ...hubMetadata("Search", "Search the public Electronic Artefacts knowledge graph across concepts, projects, programs, publications and research fields.", "/search/", defaultLocale, searchAlternates ? [
    ...Object.entries(searchAlternates).map(([hreflang, href]) => ({ hreflang, href: `${origin}${href}` })),
    ...(searchAlternates.en ? [{ hreflang: "x-default", href: `${origin}${searchAlternates.en}` }] : []),
  ] : undefined), robots: "noindex,follow" },
  body: searchBody,
  header,
  footer,
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SearchResultsPage",
        "@id": "https://electronicartefacts.com/search/#webpage",
        url: "https://electronicartefacts.com/search/",
        name: "Electronic Artefacts Search",
        description: "Search the public Electronic Artefacts knowledge graph across concepts, projects, programs, publications and research fields.",
        inLanguage: defaultLocale,
        isPartOf: { "@id": "https://electronicartefacts.com/#website" },
        publisher: { "@id": "https://electronicartefacts.com/id/organization/electronic-artefacts/" },
      },
      organizationNode,
      websiteNode,
    ],
  },
  pageClass: "search-generated",
}));

const graphViews = buildGraphViews(publicEntities, relations, routes);
const catalog = buildCatalog(entities, relations, routes);
await writeJson(path.join(rootDir, "graph/entities.json"), catalog.entities);
await writeJson(path.join(rootDir, "graph/relations.json"), catalog.relations);
await writeJson(path.join(rootDir, "graph/catalog.jsonld"), buildKnowledgeGraphCatalogJsonLd(entities, relations));
for (const view of graphViews) {
  const entity = byId.get(view.focus)!;
  await writeJson(path.join(rootDir, graphNeighborhoodRoute(entity).replace(/^\//, "")), view);
}

await writeJson(path.join(rootDir, "generated/public/catalog.json"), catalog);
await writeJson(path.join(rootDir, "generated/i18n-alternates.json"), i18nAlternates);
await writeJson(path.join(rootDir, "generated/manifest/routes.json"), publicRoutes);
await writeJson(path.join(rootDir, "generated/manifest/entities.json"), publicEntities);
await writeJson(path.join(rootDir, "generated/manifest/relations.json"), catalog.relations);
await writeJson(path.join(rootDir, "generated/manifest/build.json"), {
  schemaVersion: "1.0.0",
  entities: publicEntities.length,
  relations: catalog.relations.length,
});
await writeText(path.join(rootDir, "sitemap.xml"), buildSitemap(entities));
await writeText(path.join(rootDir, "opensearch.xml"), buildOpenSearchDescription());
await writeText(path.join(rootDir, "llms.txt"), buildLlmsTxt(entities));
await writeText(path.join(rootDir, "llms-full.txt"), buildLlmsFullTxt(entities));
await writeJson(path.join(rootDir, "agent-manifest.json"), buildAgentManifest(entities));
await writeText(path.join(rootDir, "humans.txt"), buildHumansTxt());
const securityTxt = buildSecurityTxt();
await writeText(path.join(rootDir, "security.txt"), securityTxt);
await writeText(path.join(rootDir, ".well-known/security.txt"), securityTxt);
const removedOutputs = await removeStaleGeneratedOutputs(rootDir, previousPublicEntities, publicEntities);

process.stdout.write(`Generated ${publicEntities.length} canonical entity pages, ${routes.length} identifier routes, search data and graph neighborhoods; removed ${removedOutputs.length} stale generated files.\n`);
