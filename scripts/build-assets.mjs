import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import { PurgeCSS } from "purgecss";
import fg from "fast-glob";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const cssSources = [
  "assets/css/tokens.css",
  "assets/css/base.css",
  "assets/css/layout.css",
  "assets/css/typography.css",
  "assets/css/components.css",
  "assets/css/cards.css",
  "assets/css/style.css",
];

const legacyDataSources = [
  "src/legacy-data/taxonomies.js",
  "src/legacy-data/entities.js",
  "src/legacy-data/relations.js",
  "src/legacy-data/timelines.js",
  "src/legacy-data/activity.js",
  "src/legacy-data/collections.js",
];

const jsSources = [
  "src/legacy-data/search-index.js",
  "assets/js/catalog.js",
  "assets/js/core/utils.js",
  "assets/js/core/includes.js",
  "assets/js/core/i18n.js",
  "assets/js/core/ui.js",
  "assets/js/core/view.js",
  "assets/js/core/surface.js",
  "assets/js/core/behaviors.js",
  "assets/js/core/context-menu.js",
  "assets/js/main.js",
];

const flowSource = "assets/js/core/flow.js";
const editorialSources = [
  "assets/js/core/context-menu.js",
  "assets/js/core/editorial.js",
];
const projectSources = [
  "assets/js/core/context-menu.js",
  "assets/js/core/behaviors.js",
  "assets/js/core/project.js",
];
const graphSources = [
  "assets/js/core/graph-page.js",
  "assets/js/core/context-menu.js",
  "assets/js/core/editorial.js",
];
const searchSources = [
  "assets/js/core/search-page.js",
  "assets/js/core/context-menu.js",
  "assets/js/core/editorial.js",
];

const buildTranslationsFor = async (patterns) => {
  const source = await readFile(path.join(rootDir, "assets/js/core/i18n.js"), "utf8");
  const marker = "  const french = ";
  const start = source.indexOf(marker);
  const end = source.indexOf("\n\n  const normalizeWhitespace", start);
  if (start < 0 || end < 0) throw new Error("Unable to extract the French runtime dictionary");
  const dictionarySource = source.slice(start, end);
  const dictionary = vm.runInNewContext(`(() => {${dictionarySource}; return french;})()`);
  const files = await fg(patterns, { cwd: rootDir, absolute: true });
  const corpus = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  return Object.fromEntries(Object.entries(dictionary).filter(([english]) => corpus.includes(english)));
};

const buildPublicData = async () => {
  const context = vm.createContext({ window: {} });
  let collectionRuntime = "";
  for (const source of legacyDataSources) {
    const content = await readFile(path.join(rootDir, source), "utf8");
    vm.runInContext(content, context, { filename: source });
    if (source.endsWith("collections.js")) {
      const runtimeStart = content.indexOf("const resolvedCollectionCache");
      if (runtimeStart >= 0) collectionRuntime = content.slice(runtimeStart).trim();
    }
  }

  const entities = context.window.EA_ENTITIES || {};
  const collections = context.window.EA_COLLECTIONS || [];
  const isPublic = (item) => !["internal", "restricted"].includes(item?.visibility);
  const publicEntities = Object.fromEntries(
    Object.entries(entities).map(([key, items]) => [key, Array.isArray(items) ? items.filter(isPublic) : items]),
  );
  const publicCollections = collections.filter(isPublic);
  const allSourceEntities = [...Object.values(entities).filter(Array.isArray).flat(), ...collections];
  const privateIds = new Set(allSourceEntities.filter((item) => !isPublic(item)).map((item) => item.id).filter(Boolean));

  const removePrivateReferences = (value) => {
    if (Array.isArray(value)) {
      return value
        .filter((item) => typeof item !== "string" || !privateIds.has(item))
        .map(removePrivateReferences);
    }
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, removePrivateReferences(item)]));
  };

  const relations = context.window.EA_RELATIONS || {};
  const publicRelations = {
    ...relations,
    graph: (relations.graph || []).filter((edge) => !privateIds.has(edge.from) && !privateIds.has(edge.to)),
  };
  const publicTimelines = (context.window.EA_TIMELINES || []).filter((item) => !privateIds.has(item.entityId));
  const publicActivity = (context.window.EA_ACTIVITY || []).filter((item) => !privateIds.has(item.entityId));

  const assignments = [
    ["EA_TAXONOMIES", context.window.EA_TAXONOMIES || {}],
    ["EA_ENTITIES", removePrivateReferences(publicEntities)],
    ["EA_RELATIONS", removePrivateReferences(publicRelations)],
    ["EA_TIMELINES", removePrivateReferences(publicTimelines)],
    ["EA_ACTIVITY", removePrivateReferences(publicActivity)],
    ["EA_COLLECTIONS", removePrivateReferences(publicCollections)],
  ];

  return {
    assignments: assignments
      .map(([name, value]) => `window.${name} = ${JSON.stringify(value, null, 2)};`)
      .join("\n\n"),
    collectionRuntime,
  };
};

const minify = async (source, loader) => (await transform(source, {
  legalComments: "none",
  loader,
  minify: true,
  target: "es2020",
})).code;

const bundle = async (sources, destination, banner, loader) => {
  const chunks = [banner];
  for (const source of sources) {
    const absolutePath = path.join(rootDir, source);
    const content = await readFile(absolutePath, "utf8");
    chunks.push(`/* ==== ${source} ==== */\n${content.trimEnd()}`);
  }

  const targetPath = path.join(rootDir, destination);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, await minify(`${chunks.join("\n\n")}\n`, loader));
};

await bundle(cssSources, "assets/css/app.css", "/* Generated by scripts/build-assets.mjs. Edit the source CSS files instead. */", "css");
await bundle(
  ["assets/js/core/analytics-config.js", "assets/js/core/analytics.js"],
  "assets/js/analytics.js",
  "/* Generated consent and analytics runtime. */",
  "js",
);
const publishedCssPath = path.join(rootDir, "assets/css/app.css");
const unscopedCss = await readFile(publishedCssPath, "utf8");
const [purgedCss] = await new PurgeCSS().purge({
  content: [
    "*.html", "fr/**/*.html", "projects/**/*.html", "programs/**/*.html", "knowledge/**/*.html",
    "publications/**/*.html", "research/**/*.html", "archive/**/*.html", "organizations/**/*.html",
    "src/templates/**/*.ts", "assets/js/catalog.js", "assets/js/main.js", "assets/js/core/*.js",
  ].map((pattern) => path.join(rootDir, pattern)),
  css: [publishedCssPath],
  blocklist: [
    /home-project-hologram/, /home-project-logo/, /home-card-resized/,
    /home-intent-stage__hint/, /home-intent-stage__frame--vaste/, /home-intent-stage__frame--innerside/,
    /intent-hero--home/, /research-atlas/, /selected-works/,
    /innerside-/,
  ],
  safelist: { greedy: [/\.(?:is|has|was|no)-/, /\.is-safari/, /active-view-transition/] },
});
await writeFile(publishedCssPath, await minify(purgedCss.css, "css"));
const [homeCss] = await new PurgeCSS().purge({
  content: [
    ...["index.html", "fr/index.html", "assets/partials/header.html", "assets/partials/footer.html", flowSource]
      .map((file) => path.join(rootDir, file)),
    {
      raw: '<article class="home-project-hologram is-hero-selected is-home-card-resized is-home-card-resizing"></article>',
      extension: "html",
    },
  ],
  css: [{ raw: unscopedCss }],
  safelist: {
    greedy: [
      /\.(?:is|has|was|no)-/, /\.is-safari/, /active-view-transition/,
      /ambient-field/, /scroll-progress/, /command-/, /ux-dock/,
      /image-lightbox/, /quick-view/, /toast/, /language-switcher/, /site-context-menu/,
      /consent-banner/, /flow-progress/, /reveal-/, /card-link/, /card-media-plate/,
      /graph-surface/, /home-intent-stage/, /home-card-resized/, /intent-hero/, /latests-/,
      /metric-pill/, /metric-rail/, /pill-cloud/, /program-card/,
      /project-butterfly/, /project-card/, /project-meg-badge/,
      /research-atlas/, /selected-works/, /signature-banner/,
      /status-badge/, /taxonomy-pill/, /vast-banner/, /vast-engine/,
      /data-media-state/, /data-spotlight/,
    ],
  },
});
await writeFile(path.join(rootDir, "assets/css/home.css"), await minify(homeCss.css, "css"));
const [projectCss] = await new PurgeCSS().purge({
  content: [
    "projects/**/*.html", "fr/projects/**/*.html", "assets/partials/header.html", "assets/partials/footer.html",
    flowSource, "assets/js/core/project.js", "assets/js/core/context-menu.js",
  ]
    .map((pattern) => path.join(rootDir, pattern)),
  css: [{ raw: unscopedCss }],
  safelist: {
    greedy: [
      /\.(?:is|has|was|no)-/, /\.is-safari/, /active-view-transition/,
      /ambient-field/, /scroll-progress/, /command-/, /ux-dock/,
      /image-lightbox/, /quick-view/, /toast/, /language-switcher/, /site-context-menu/,
      /consent-banner/, /flow-progress/, /reveal-/, /card-link/,
      /innerside-/,
      /data-media-state/, /data-spotlight/,
    ],
  },
});
await writeFile(path.join(rootDir, "assets/css/project.css"), await minify(projectCss.css, "css"));
await bundle([flowSource], "assets/js/flow.js", "/* Generated critical navigation and loading runtime. */", "js");
const editorialTranslations = await buildTranslationsFor([
  "fr/archive/**/*.html", "fr/knowledge/**/*.html", "fr/publications/**/*.html", "fr/research/**/*.html",
  "fr/organizations/**/*.html", "fr/programs/**/*.html",
]);
await bundle(
  editorialSources,
  "assets/js/editorial.js",
  `/* Generated route-scoped editorial runtime. */\nwindow.EA_EDITORIAL_TRANSLATIONS=${JSON.stringify(editorialTranslations)};`,
  "js",
);
const projectTranslations = await buildTranslationsFor([
  "fr/projects/**/*.html", "assets/js/core/behaviors.js",
]);
await bundle(
  projectSources,
  "assets/js/project.js",
  `/* Generated route-scoped project runtime. */
window.EA_PROJECT_TRANSLATIONS=${JSON.stringify(projectTranslations)};
window.EA_UTILS=Object.freeze({
  esc:(value)=>String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),
  slugify:(value)=>String(value??"").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
});
window.EA_I18N=Object.freeze({
  locale:document.documentElement.lang==="fr"||location.pathname.startsWith("/fr/")?"fr":"en",
  translateText:(value)=>window.EA_PROJECT_TRANSLATIONS[value]||value
});`,
  "js",
);
const [editorialCss] = await new PurgeCSS().purge({
  content: [
    "archive/**/*.html", "knowledge/**/*.html", "publications/**/*.html", "research/**/*.html",
    "organizations/**/*.html", "programs/**/*.html", "search/index.html",
    "fr/archive/**/*.html", "fr/knowledge/**/*.html", "fr/publications/**/*.html", "fr/research/**/*.html",
    "fr/organizations/**/*.html", "fr/programs/**/*.html",
    "assets/partials/header.html", "assets/partials/footer.html", flowSource, "assets/js/core/editorial.js",
  ].map((pattern) => path.join(rootDir, pattern)),
  css: [publishedCssPath],
  safelist: {
    greedy: [
      /\.(?:is|has|was|no)-/, /\.is-safari/, /active-view-transition/,
      /ambient-field/, /scroll-progress/, /command-palette/, /ux-dock/,
      /image-lightbox/, /quick-view/, /toast/, /language-switcher/,
    ],
  },
});
await writeFile(path.join(rootDir, "assets/css/editorial.css"), await minify(editorialCss.css, "css"));
const publicData = await buildPublicData();
let generatedCatalog = null;
try {
  generatedCatalog = JSON.parse(await readFile(path.join(rootDir, "generated/public/catalog.json"), "utf8"));
} catch {
  generatedCatalog = null;
}
const runtimeEntityKeys = [
  "id", "legacyId", "translationOf", "locale", "kind", "type", "title", "subtitle", "summary",
  "status", "maturity", "confidence", "visibility", "publicationClass", "category", "tags", "discipline", "route",
  "identifier", "temporality", "homepage", "priority", "started", "abstract",
];
const researchAtlasEntityKeys = [
  ...runtimeEntityKeys,
  "updated", "observation", "hypothesis", "currentUnderstanding",
  "relatedProjects", "relatedSoftware", "relatedArticles", "relatedConcepts", "relatedTechnologies",
  "relatedRepositories", "timeline",
];
const compactEntity = (entity, keys = runtimeEntityKeys) => Object.fromEntries(
  keys.filter((key) => entity[key] !== undefined).map((key) => [key, entity[key]]),
);
const fullRuntimeCatalog = generatedCatalog ? {
  schemaVersion: generatedCatalog.schemaVersion,
  entities: (generatedCatalog.entities || []).map((entity) => compactEntity(entity)),
  relations: (generatedCatalog.relations || []).map(({ id, subject, predicate, object }) => ({ id, subject, predicate, object })),
  routes: generatedCatalog.routes || {},
} : null;
const graphRuntimeCatalog = generatedCatalog ? {
  entities: (generatedCatalog.entities || []).map((entity) => compactEntity(entity, [
    "id", "translationOf", "locale", "type", "title", "summary", "visibility", "route",
  ])),
  relations: (generatedCatalog.relations || []).map(({ subject, object }) => ({ subject, object })),
} : { entities: [], relations: [] };
const searchRuntimeCatalog = generatedCatalog ? {
  entities: (generatedCatalog.entities || []).map((entity) => compactEntity(entity, [
    "id", "translationOf", "locale", "type", "title", "subtitle", "summary", "abstract",
    "status", "tags", "discipline", "category", "visibility", "route",
  ])),
} : { entities: [] };
const researchAtlasQuestions = (generatedCatalog?.entities || [])
  .filter((entity) => entity.type === "researchQuestion")
  .map((entity) => compactEntity(entity, researchAtlasEntityKeys));
const researchAtlasReferenceKeys = [
  "relatedProjects", "relatedSoftware", "relatedArticles", "relatedConcepts", "relatedTechnologies",
];
const researchAtlasReferenceIds = new Set(
  researchAtlasQuestions
    .flatMap((question) => researchAtlasReferenceKeys.flatMap((key) => question[key] || []))
    .map((reference) => typeof reference === "string" ? reference : reference?.id)
    .filter(Boolean),
);
const runtimeCatalog = fullRuntimeCatalog ? {
  ...fullRuntimeCatalog,
  entities: (generatedCatalog.entities || [])
    .filter((entity) =>
      entity.type === "researchQuestion"
      || entity.type === "project"
      || researchAtlasReferenceIds.has(entity.id)
      || researchAtlasReferenceIds.has(entity.legacyId)
      || researchAtlasReferenceIds.has(entity.translationOf))
    .map((entity) => compactEntity(
      entity,
      entity.type === "researchQuestion" ? researchAtlasEntityKeys : runtimeEntityKeys,
    )),
  relations: [],
} : null;
const jsBanner = "/* Generated by scripts/build-assets.mjs. Edit the source JS files instead. */";
const embeddedIncludes = Object.fromEntries(
  await Promise.all(
    ["header", "footer"].map(async (key) => [
      key,
      (await readFile(path.join(rootDir, `assets/partials/${key}.html`), "utf8")).trim(),
    ]),
  ),
);
const runtimeChunks = [];
for (const source of jsSources) {
  const content = await readFile(path.join(rootDir, source), "utf8");
  runtimeChunks.push(`/* ==== ${source} ==== */\n${content.trimEnd()}`);
}
const writeRuntime = async (destination, catalog) => {
  const chunks = [
    jsBanner,
    "/* Public data: internal and restricted records are excluded at build time. */",
    publicData.assignments,
    publicData.collectionRuntime,
    catalog ? `window.EA_PUBLIC_CATALOG = ${JSON.stringify(catalog)};` : "",
    `window.EA_EMBEDDED_INCLUDES = ${JSON.stringify(embeddedIncludes)};`,
    ...runtimeChunks,
  ];
  await writeFile(path.join(rootDir, destination), await minify(`${chunks.join("\n\n")}\n`, "js"));
};

await writeRuntime("assets/js/app.js", runtimeCatalog);

const explorerTranslations = await buildTranslationsFor([
  "fr/graph.html", "fr/search.html", "assets/js/core/graph-page.js", "assets/js/core/search-page.js",
]);
await Promise.all([
  bundle(
    graphSources,
    "assets/js/graph.js",
    `/* Generated route-scoped knowledge graph runtime. */
window.EA_EDITORIAL_TRANSLATIONS=${JSON.stringify(explorerTranslations)};
window.EA_GRAPH_CATALOG=${JSON.stringify(graphRuntimeCatalog)};`,
    "js",
  ),
  bundle(
    searchSources,
    "assets/js/search.js",
    `/* Generated route-scoped legacy search runtime. */
window.EA_EDITORIAL_TRANSLATIONS=${JSON.stringify(explorerTranslations)};
window.EA_SEARCH_CATALOG=${JSON.stringify(searchRuntimeCatalog)};`,
    "js",
  ),
]);

const explorerSafelist = {
  greedy: [
    /\.(?:is|has|was|no)-/, /\.is-safari/, /active-view-transition/,
    /ambient-field/, /scroll-progress/, /command-/, /ux-dock/, /toast/,
    /language-switcher/, /site-context-menu/, /consent-banner/, /flow-progress/,
    /reveal-/, /card-link/, /global-graph/, /catalog-/,
  ],
};
const buildExplorerCss = async (page, runtime, destination) => {
  const [result] = await new PurgeCSS().purge({
    content: [
      `${page}.html`, `fr/${page}.html`, "assets/partials/header.html", "assets/partials/footer.html",
      flowSource, runtime, "assets/js/core/editorial.js", "assets/js/core/context-menu.js",
    ].map((file) => path.join(rootDir, file)),
    css: [publishedCssPath],
    safelist: explorerSafelist,
  });
  await writeFile(path.join(rootDir, destination), await minify(result.css, "css"));
};
await Promise.all([
  buildExplorerCss("graph", "assets/js/core/graph-page.js", "assets/css/graph.css"),
  buildExplorerCss("search", "assets/js/core/search-page.js", "assets/css/search.css"),
]);

process.stdout.write("Built minified CSS and route-scoped JavaScript bundles\n");
