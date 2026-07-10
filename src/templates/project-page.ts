import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import { predicateDefinitions } from "../schema/predicates.js";
import type { Entity, ProjectEntity } from "../schema/entities.js";
import type { EntityRef, MediaRef } from "../schema/entity.js";
import type { RelationStatement } from "../schema/relation.js";
import {
  connectedEntityIdForRelation,
  publicEntityIds,
  publicRefs,
  publicRelationsForEntity,
} from "../semantic/visibility.js";
import { renderCitationPanel } from "./components/citation-panel.js";
import { renderEntityMetadata } from "./components/entity-metadata.js";
import { renderRecordDetails } from "./components/record-details.js";
import { renderRelationshipGroups } from "./components/relationship-groups.js";
import { escapeHtml } from "./html.js";

const ui = (project: ProjectEntity, english: string, french: string): string =>
  project.locale === "fr" ? french : english;

const labelFrom = (value: string): string =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const upperLabel = (value: string): string => labelFrom(value).toUpperCase();

const compactId = (id: string): string => id.split(":").at(-1) || id;

const designSignalPattern =
  /\b(art direction|brand|branding|charte|cover|design|identity|logo|mark|mood|moodboard|monogram|palette|picto|signage|symbol|ui|visual|wordmark)\b/i;
const identitySignalPattern = /\b(brand|branding|cover|identity|logo|mark|monogram|picto|symbol|wordmark)\b/i;
const interfaceSignalPattern = /\b(admin|app|dashboard|flow|interface|landing|mobile|navigation|page|portfolio|screen|site|ui|ux)\b/i;
const atmosphereSignalPattern = /\b(atmosphere|forest|hero|image|mood|moodboard|room|signage|suite|texture|visual)\b/i;

const colorMap: Record<string, string> = {
  amber: "#d89f4f",
  black: "#050505",
  blue: "#2563eb",
  cream: "#eadccf",
  gold: "#d8b86a",
  gray: "#8d8f95",
  grey: "#8d8f95",
  green: "#4f7d5d",
  ink: "#111115",
  ivory: "#f2eadf",
  navy: "#13213a",
  "navy blue": "#13213a",
  orange: "#d97738",
  red: "#b94a48",
  slate: "#334155",
  white: "#f7f4ef",
};

const fallbackSwatches = ["#f2eadf", "#161616", "#7dd3fc", "#4f7d5d", "#d8b86a", "#8d8f95"];

const connectedRelationsFor = (
  project: ProjectEntity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
): RelationStatement[] => publicRelationsForEntity(project, relations, publicEntityIds(byId.values()));

const firstVisualMedia = (project: ProjectEntity): MediaRef | null =>
  project.media?.find((media) => media.type === "image") ||
  project.media?.find((media) => media.type === "video") ||
  project.media?.[0] ||
  null;

const renderChips = (items: string[] = [], className = "tag-cluster tag-cluster--compact"): string =>
  items.length
    ? `<div class="${className}">${items.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div>`
    : "";

const uniqueStrings = (items: string[]): string[] => [...new Set(items.filter(Boolean))];

const uniqueRefs = (refs: EntityRef[]): EntityRef[] =>
  [...new Map(refs.map((ref) => [ref.id, ref])).values()];

const mediaDescriptor = (media: MediaRef): string =>
  [media.id, media.src, media.alt, media.caption].filter(Boolean).join(" ");

const projectDescriptor = (project: ProjectEntity): string =>
  [
    project.title,
    project.subtitle,
    project.abstract,
    project.description,
    project.category,
    ...(project.tags || []),
    ...(project.disciplines || []),
    ...(project.visualLanguage || []),
    ...(project.textures || []),
    ...(project.symbols || []),
  ]
    .filter(Boolean)
    .join(" ");

const visualAssetGroup = (media: MediaRef): "identity" | "interface" | "atmosphere" | "reference" => {
  const text = mediaDescriptor(media);
  if (identitySignalPattern.test(text)) return "identity";
  if (interfaceSignalPattern.test(text)) return "interface";
  if (atmosphereSignalPattern.test(text)) return "atmosphere";
  return "reference";
};

const mediaHasVisualSignal = (media: MediaRef): boolean => {
  const text = mediaDescriptor(media);
  return designSignalPattern.test(text) || identitySignalPattern.test(text) || interfaceSignalPattern.test(text) || atmosphereSignalPattern.test(text);
};

const designMediaFor = (project: ProjectEntity): MediaRef[] => {
  const gallery = (project.media || []).filter((media) => media.type === "image" || media.type === "video");
  const matching = gallery.filter(mediaHasVisualSignal);
  if (matching.length) return matching;
  return designSignalPattern.test(projectDescriptor(project)) ? gallery : [];
};

const projectHasArtDirection = (project: ProjectEntity): boolean =>
  Boolean(project.visualLanguage?.length || project.textures?.length || project.symbols?.length || designMediaFor(project).length);

const colorForToken = (token: string, index: number): string => {
  const key = token.toLowerCase().trim();
  return colorMap[key] || fallbackSwatches[index % fallbackSwatches.length];
};

const projectVisualTokens = (project: ProjectEntity): string[] => {
  if (project.visualLanguage?.length) return uniqueStrings(project.visualLanguage).slice(0, 6);
  const cues = uniqueStrings([
    ...(project.disciplines || []).filter((item) => designSignalPattern.test(item)),
    ...(project.tags || []).filter((item) => designSignalPattern.test(item)),
  ]);
  return cues.slice(0, 6);
};

const projectMoodCues = (project: ProjectEntity): string[] =>
  uniqueStrings([
    ...(project.textures || []),
    ...(project.symbols || []),
    ...(project.disciplines || []),
    ...(project.tags || []),
  ]).slice(0, 10);

const compactTechnicalSignal = (value: string): string => {
  const normalized = value.replace(/\s+/g, " ").trim();
  const directSignals: Array<[RegExp, string]> = [
    [/addressable nodes?|represented as/i, "Addressable nodes"],
    [/relationship|relations/i, "Explicit relations"],
    [/runtime/i, "Runtime foundation"],
    [/identity/i, "Identity model"],
    [/context/i, "Context engine"],
    [/public/i, "Public surface"],
    [/graph/i, "Graph model"],
    [/permission|access/i, "Permissions"],
    [/workflow|collabor/i, "Workflow layer"],
  ];
  const signal = directSignals.find(([pattern]) => pattern.test(normalized));
  if (signal) return signal[1];
  const words = normalized.split(" ").filter(Boolean);
  return words.slice(0, 4).join(" ").replace(/[.,;:]$/, "");
};

const renderMetric = (label: string, value: string, note?: string, tone = "neutral"): string => `
  <span class="metric-pill metric-pill--${escapeHtml(tone)}">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
    ${note ? `<em>${escapeHtml(note)}</em>` : ""}
  </span>`;

const renderProjectBreadcrumb = (project: ProjectEntity): string => `
  <nav class="project-dossier-breadcrumbs" aria-label="Breadcrumb">
    <a href="${project.locale === "fr" ? "/fr/" : "/"}">${ui(project, "Home", "Accueil")}</a>
    <span aria-hidden="true">/</span>
    <a href="${project.locale === "fr" ? "/fr/projects.html" : "/projects.html"}">${ui(project, "Projects", "Projets")}</a>
    <span aria-hidden="true">/</span>
    <span aria-current="page">${escapeHtml(project.title)}</span>
  </nav>`;

const renderMediaElement = (media: MediaRef, className: string, loading: "eager" | "lazy" = "eager"): string => {
  if (media.type === "video") {
    return `<video class="${escapeHtml(className)}" src="${escapeHtml(media.src)}" controls muted playsinline preload="metadata"></video>`;
  }
  if (media.type === "image") {
    return `<img class="${escapeHtml(className)}" src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || "")}" loading="${loading}" decoding="async" />`;
  }
  return `<a class="button button--secondary" href="${escapeHtml(media.src)}">${escapeHtml(media.caption || media.id)}</a>`;
};

const renderHeroVisual = (project: ProjectEntity): string => {
  const media = firstVisualMedia(project);
  const categoryLabel = project.slug.canonical === "vestiges" ? "Living knowledge platform" : project.category;
  if (!media) {
    return `
      <figure class="detail-hero__visual project-dossier-hero__visual project-dossier-hero__visual--empty">
        <div class="project-dossier-mark" aria-hidden="true">
          <span>${escapeHtml(project.title.slice(0, 2).toUpperCase())}</span>
        </div>
        <figcaption>
          <span>${escapeHtml(project.status)}</span>
          <strong>${escapeHtml(categoryLabel)}</strong>
        </figcaption>
      </figure>`;
  }

  return `
    <figure class="detail-hero__visual project-dossier-hero__visual">
      ${renderMediaElement(media, "project-immersive__image")}
      <figcaption>
        <span>${escapeHtml(media.caption || project.status)}</span>
        <strong>${escapeHtml(categoryLabel)}</strong>
      </figcaption>
    </figure>`;
};

const refDetails = (ref: EntityRef, byId: Map<string, Entity>, routeById: Record<string, string>) => {
  const entity = byId.get(ref.id);
  return {
    id: ref.id,
    title: ref.label || entity?.title || compactId(ref.id),
    type: entity?.type || "record",
    copy: entity?.definition || entity?.abstract || ref.id,
    route: routeById[ref.id] || "#",
  };
};

const renderRefCards = (
  title: string,
  eyebrow: string,
  refs: EntityRef[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  if (!refs.length) return "";
  return `
    <section class="project-reference-group">
      <div class="section-head">
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div class="card-grid card-grid--two">
        ${refs.map((ref) => {
          const item = refDetails(ref, byId, routeById);
          return `
            <article class="panel project-reference-card">
              <p class="card__meta">${escapeHtml(upperLabel(item.type))}</p>
              <h3 class="card__title"><a href="${escapeHtml(item.route)}">${escapeHtml(item.title)}</a></h3>
              <p class="card__copy">${escapeHtml(item.copy)}</p>
              <div class="link-row"><a class="tag" href="${escapeHtml(item.route)}">Open page</a></div>
            </article>`;
        }).join("")}
      </div>
    </section>`;
};

const renderProjectTabs = (
  project: ProjectEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const isVestiges = project.slug.canonical === "vestiges";
  const evidenceCards = publicRefs(project.evidence, byId).map((ref) => refDetails(ref, byId, routeById));
  const tabs = [
    {
      id: "brief",
      label: "Brief",
      eyebrow: "PROJECT BRIEF",
      title: "The problem this project addresses.",
      body: `<p class="lede">${escapeHtml(project.brief)}</p>`,
    },
    {
      id: "context",
      label: "Context",
      eyebrow: "OPERATING CONTEXT",
      title: "Why this system needs to exist.",
      body: `<p class="lede">${escapeHtml(project.context)}</p>`,
    },
    {
      id: "approach",
      label: "Approach",
      eyebrow: "SYSTEM APPROACH",
      title: "How the work is structured.",
      body: `
        <ol class="project-process" data-project-process>
          ${project.approach.map((step, index) => `
            <li class="project-process__item${index === 0 ? " is-active" : ""}" data-project-step>
              <button class="project-process__marker" type="button" aria-label="Focus approach step ${index + 1}">
                ${String(index + 1).padStart(2, "0")}
              </button>
              <p>${escapeHtml(step)}</p>
            </li>`).join("")}
        </ol>`,
    },
    {
      id: "proof",
      label: "Proof",
      eyebrow: "PUBLIC EVIDENCE",
      title: evidenceCards.length ? "Current evidence supporting the project." : "Evidence is attached when public.",
      body: evidenceCards.length
        ? `<div class="project-proof-list">${evidenceCards.map((item) => `
            <article class="panel panel--soft">
              <p class="card__meta">${escapeHtml(upperLabel(item.type))}</p>
              <h3 class="card__title"><a href="${escapeHtml(item.route)}">${escapeHtml(item.title)}</a></h3>
              <p class="card__copy">${escapeHtml(item.copy)}</p>
            </article>`).join("")}</div>`
        : `<p class="lede">Public evidence will appear here when references are attached to this project.</p>`,
    },
  ];

  return `
    <section class="zone-card hero project-command" id="project-brief" data-project-tabs>
      <div class="project-command__top">
        <div class="section-head">
          <p class="eyebrow">PROJECT READING</p>
          <h2>${isVestiges ? "Read Vestiges from thesis to evidence." : "A concise guide to the project dossier."}</h2>
          <p class="lede">${isVestiges ? "Move from the cultural problem to the contribution model and current public evidence." : "Move between strategic framing, context, implementation logic and evidence without losing the surrounding page."}</p>
        </div>
        <div class="project-command__nav" role="tablist" aria-label="Project dossier sections">
          ${tabs.map((tab, index) => `
            <button
              class="project-command__tab${index === 0 ? " is-active" : ""}"
              id="project-tab-${escapeHtml(tab.id)}"
              type="button"
              role="tab"
              aria-selected="${index === 0 ? "true" : "false"}"
              aria-controls="project-panel-${escapeHtml(tab.id)}"
              data-project-tab
            >${escapeHtml(tab.label)}</button>`).join("")}
        </div>
      </div>
      <div class="project-command__panels">
        ${tabs.map((tab, index) => `
          <section
            class="project-command__panel${index === 0 ? " is-active" : ""}"
            id="project-panel-${escapeHtml(tab.id)}"
            role="tabpanel"
            aria-labelledby="project-tab-${escapeHtml(tab.id)}"
            data-project-panel
          >
            <p class="card__meta">${escapeHtml(tab.eyebrow)}</p>
            <h3 class="card__title">${escapeHtml(tab.title)}</h3>
            ${tab.body}
          </section>`).join("")}
      </div>
    </section>`;
};

const renderProjectSystem = (project: ProjectEntity): string => {
  const hasConstraints = Boolean(project.constraints?.length);
  const hasOutcomes = Boolean(project.outcomes?.length);
  const isVestiges = project.slug.canonical === "vestiges";

  return `
    <section class="zone-card hero project-intelligence" id="project-system">
      <div class="section-head">
        <p class="eyebrow">PROJECT FRAME</p>
        <h2>${isVestiges ? "Knowledge, trust and activation in one operating model." : "Brief, context and operating frame in one place."}</h2>
        <p class="lede">${isVestiges ? "Vestiges treats living know-how as shared infrastructure: attributable, reviewable and reusable across public and professional contexts." : "This section gathers the brief, constraints, outcomes and public evidence into one readable project frame."}</p>
      </div>
      <div class="project-intelligence__grid">
        <article class="panel project-intelligence__card project-intelligence__card--lead">
          <p class="card__meta">Brief</p>
          <h3 class="card__title">${escapeHtml(project.brief)}</h3>
        </article>
        <article class="panel project-intelligence__card project-intelligence__card--context">
          <p class="card__meta">Context</p>
          <p class="card__copy">${escapeHtml(project.context)}</p>
        </article>
        ${hasConstraints ? `
          <article class="panel project-intelligence__card">
            <p class="card__meta">Constraints</p>
            <ul class="project-list">
              ${project.constraints?.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>` : ""}
        ${hasOutcomes ? `
          <article class="panel project-intelligence__card">
            <p class="card__meta">Outcomes</p>
            <ul class="project-list">
              ${project.outcomes?.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>` : ""}
        <article class="panel project-intelligence__card project-intelligence__card--state">
          <p class="card__meta">${ui(project, "Current state", "État actuel")}</p>
          <dl class="project-snapshot">
            <div><dt>${ui(project, "Status", "État")}</dt><dd>${escapeHtml(project.status)}</dd></div>
            <div><dt>${ui(project, "Maturity", "Maturité")}</dt><dd>${escapeHtml(project.maturity)}</dd></div>
            <div><dt>${ui(project, "Updated", "Mis à jour")}</dt><dd>${escapeHtml(project.version.modifiedAt)}</dd></div>
          </dl>
        </article>
      </div>
    </section>`;
};

const renderProjectMedia = (project: ProjectEntity): string => {
  const gallery = (project.media || []).filter((media) => media.src);
  if (gallery.length <= 1) return "";
  return `
    <section class="zone-card hero project-media-section" id="project-media">
      <div class="section-head">
        <p class="eyebrow">MEDIA EVIDENCE</p>
        <h2>Visual and documentary material.</h2>
        <p class="lede">Screenshots, marks, recordings and documents appear here when they help show how the project works.</p>
      </div>
      <div class="project-immersive__rail project-immersive__rail--wide">
        ${gallery.map((media) => `
          <figure class="project-immersive__frame project-immersive__frame--rail">
            ${renderMediaElement(media, "project-immersive__image")}
            ${media.caption ? `<figcaption>${escapeHtml(media.caption)}</figcaption>` : ""}
          </figure>`).join("")}
      </div>
    </section>`;
};

const relationDisplay = (
  relation: RelationStatement,
  project: ProjectEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
) => {
  const connectedId = connectedEntityIdForRelation(project, relation);
  const connectedEntity = byId.get(connectedId);
  const predicate = predicateDefinitions[relation.predicate];
  return {
    id: connectedId,
    label: predicate.label,
    group: predicate.group,
    title: connectedEntity?.title || compactId(connectedId),
    type: connectedEntity?.type || "record",
    statement: project.locale === "fr"
      ? `Relation documentée avec ${connectedEntity?.title || compactId(connectedId)}.`
      : relation.statement,
    route: routeById[connectedId] || "#",
  };
};

const renderProjectMoodboard = (project: ProjectEntity): string => {
  if (!projectHasArtDirection(project)) return "";
  const isVestiges = project.slug.canonical === "vestiges";
  const assets = designMediaFor(project);
  const logoAssets = assets.filter((media) => visualAssetGroup(media) === "identity");
  const leadAssets = assets.length ? assets.slice(0, 8) : project.media?.slice(0, 4) || [];
  const groups = uniqueStrings(leadAssets.map((media) => visualAssetGroup(media)));
  const visualTokens = projectVisualTokens(project);
  const cueTokens = projectMoodCues(project);

  return `
    <section class="zone-card hero project-moodboard" id="project-moodboard" data-project-moodboard>
      <div class="project-moodboard__intro">
        <div class="section-head">
          <p class="eyebrow">ART DIRECTION</p>
          <h2>${isVestiges ? "A restrained identity for living knowledge." : "Moodboard, marks and visual system."}</h2>
          <p class="lede">${isVestiges ? "White space, black structure and archival restraint keep the identity quiet enough for many cultures, practices and sources to coexist." : "Identity, mood and visual-language material are gathered here when they help explain the project direction."}</p>
        </div>
        ${groups.length > 1 ? `
          <div class="project-moodboard__filters" aria-label="Moodboard asset filters">
            <button class="project-command__tab is-active" type="button" aria-pressed="true" data-project-mood-filter="all">All</button>
            ${groups.map((group) => `
              <button class="project-command__tab" type="button" aria-pressed="false" data-project-mood-filter="${escapeHtml(group)}">${escapeHtml(labelFrom(group))}</button>`).join("")}
          </div>` : ""}
      </div>
      <div class="project-moodboard__layout">
        <article class="panel project-moodboard__identity">
          <p class="card__meta">Identity kit</p>
          <h3 class="card__title">${escapeHtml(logoAssets.length ? ui(project, "Project marks", "Signes du projet") : ui(project, "Visual identity", "Identité visuelle"))}</h3>
          <p class="card__copy">${escapeHtml(logoAssets[0]?.caption || project.subtitle || project.abstract)}</p>
          ${logoAssets.length ? `
            <div class="project-moodboard__logo-rail">
              ${logoAssets.slice(0, 3).map((media) => `
                <figure>
                  ${renderMediaElement(media, "project-moodboard__logo", "lazy")}
                </figure>`).join("")}
            </div>` : renderChips(visualTokens, "tag-cluster tag-cluster--compact")}
        </article>
        <div class="project-moodboard__canvas">
          ${leadAssets.map((media, index) => {
            const group = visualAssetGroup(media);
            return `
              <figure
                class="project-moodboard__asset project-moodboard__asset--${index % 5}"
                data-project-mood-asset
                data-mood-kind="${escapeHtml(group)}"
              >
                ${renderMediaElement(media, "project-moodboard__media", "lazy")}
                ${media.caption ? `<figcaption>${escapeHtml(media.caption)}</figcaption>` : ""}
              </figure>`;
          }).join("")}
        </div>
        <aside class="panel project-moodboard__system">
          <p class="card__meta">Graphic charter</p>
          <div class="project-moodboard__swatches" aria-label="Visual language">
            ${(visualTokens.length ? visualTokens : ["Identity", "Interface", "Material"]).map((token, index) => `
              <span class="project-moodboard__swatch">
                <i style="--swatch: ${escapeHtml(colorForToken(token, index))}" aria-hidden="true"></i>
                <strong>${escapeHtml(token)}</strong>
              </span>`).join("")}
          </div>
          ${cueTokens.length ? `
            <div class="project-moodboard__cues">
              <p class="card__meta">Cues</p>
              ${renderChips(cueTokens, "tag-cluster tag-cluster--compact")}
            </div>` : ""}
        </aside>
      </div>
    </section>`;
};

const renderProjectDevelopment = (
  project: ProjectEntity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const isVestiges = project.slug.canonical === "vestiges";
  const implementation = connectedRelationsFor(project, relations, byId)
    .filter((relation) => predicateDefinitions[relation.predicate]?.group === "implementation")
    .map((relation) => relationDisplay(relation, project, byId, routeById));
  const devFocus = uniqueStrings([
    ...(project.developmentFocus || []),
    ...implementation.map((item) => item.title),
    ...project.approach.slice(0, 4).map(compactTechnicalSignal),
  ]).slice(0, 8);

  return `
    <section class="zone-card hero project-discipline project-discipline--dev" id="project-dev">
      <div class="section-head">
        <p class="eyebrow">DEVELOPMENT</p>
        <h2>${isVestiges ? "A technical foundation for cultural transmission." : "Architecture, implementation logic and delivery surface."}</h2>
        <p class="lede">${isVestiges ? "Stable identities, provenance and contextual permissions turn cultural material into a usable and governable system." : "The technical read combines approach steps, implementation choices, current constraints and delivery state."}</p>
      </div>
      <div class="project-discipline__grid">
        <article class="panel project-discipline__card project-discipline__card--lead">
          <p class="card__meta">Build thesis</p>
          <h3 class="card__title">${escapeHtml(project.approach[0] || project.brief)}</h3>
          ${project.approach.length > 1 ? `
            <ol class="project-process project-process--compact" data-project-process>
              ${project.approach.slice(1, 5).map((step, index) => `
                <li class="project-process__item${index === 0 ? " is-active" : ""}" data-project-step>
                  <button class="project-process__marker" type="button" aria-label="Focus development step ${index + 1}">
                    ${String(index + 1).padStart(2, "0")}
                  </button>
                  <p>${escapeHtml(step)}</p>
                </li>`).join("")}
            </ol>` : ""}
        </article>
        <article class="panel project-discipline__card">
          <p class="card__meta">${ui(project, "Technical foundations", "Fondations techniques")}</p>
          <h3 class="card__title">${ui(project, "Connected references", "Références reliées")}</h3>
          <p class="card__copy">${escapeHtml(implementation.length ? ui(project, "Public technologies, frameworks and dependencies connected to the project.", "Technologies, frameworks et dépendances publiques reliés au projet.") : ui(project, "No public implementation dependency is listed yet.", "Aucune dépendance d’implémentation publique n’est encore renseignée."))}</p>
          ${implementation.length ? `
            <div class="project-discipline__links">
              ${implementation.slice(0, 5).map((item) => `<a class="tag" href="${escapeHtml(item.route)}">${escapeHtml(item.title)}</a>`).join("")}
            </div>` : ""}
        </article>
        <article class="panel project-discipline__card">
          <p class="card__meta">${ui(project, "Constraints", "Contraintes")}</p>
          <h3 class="card__title">${escapeHtml(project.constraints?.length ? ui(project, "Documented constraints", "Contraintes documentées") : labelFrom(project.status))}</h3>
          ${project.constraints?.length ? `
            <ul class="project-list">
              ${project.constraints.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>` : `<p class="card__copy">Technical constraints appear here when they are useful to the public dossier.</p>`}
        </article>
        <article class="panel project-discipline__card project-discipline__card--stack">
          <p class="card__meta">${ui(project, "Technical focus", "Axes techniques")}</p>
          <h3 class="card__title">${escapeHtml(devFocus.length ? ui(project, "Current implementation", "Implémentation actuelle") : project.category)}</h3>
          ${renderChips(devFocus, "tag-cluster tag-cluster--compact")}
        </article>
      </div>
    </section>`;
};

const renderProjectMarketing = (
  project: ProjectEntity,
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const isVestiges = project.slug.canonical === "vestiges";
  const audience = uniqueRefs(publicRefs([...project.stakeholders, ...project.credits], byId))
    .map((ref) => refDetails(ref, byId, routeById))
    .slice(0, 6);
  const proofSignals = uniqueStrings([
    ...(project.outcomes || []),
    ...publicRefs(project.evidence, byId).map((ref) => ref.label || refDetails(ref, byId, routeById).title),
  ]).slice(0, 6);
  const marketingFocus = uniqueStrings([
    ...(project.marketingFocus || []),
    project.category,
    ...(project.tags || []).filter((tag) => tag.toLowerCase() !== "internal"),
  ]).slice(0, 8);

  return `
    <section class="zone-card hero project-discipline project-discipline--marketing" id="project-marketing">
      <div class="section-head">
        <p class="eyebrow">MARKETING</p>
        <h2>${isVestiges ? "From public knowledge to professional utility." : "Positioning, audience and proof."}</h2>
        <p class="lede">${isVestiges ? "The offer begins with trustworthy discovery, then extends into contribution, learning, collaboration and specialist services." : "This view turns the project into a public-facing offer: who it speaks to, what it promises and what can already be shown."}</p>
      </div>
      <div class="project-marketing__grid">
        <article class="panel project-marketing__statement">
          <p class="card__meta">Positioning</p>
          <h3 class="card__title">${escapeHtml(project.brief)}</h3>
          <p class="card__copy">${escapeHtml(project.context)}</p>
        </article>
        <article class="panel project-discipline__card">
          <p class="card__meta">${ui(project, "Participants", "Participants")}</p>
          <h3 class="card__title">${escapeHtml(audience.length ? ui(project, "Named organizations and people", "Organisations et personnes nommées") : ui(project, "Participants to define", "Participants à définir"))}</h3>
          ${audience.length ? `
            <div class="project-discipline__links">
              ${audience.map((item) => `<a class="tag" href="${escapeHtml(item.route)}">${escapeHtml(item.title)}</a>`).join("")}
            </div>` : `<p class="card__copy">Audience groups appear here when they are useful to explain the project.</p>`}
        </article>
        <article class="panel project-discipline__card">
          <p class="card__meta">${ui(project, "Evidence", "Preuves")}</p>
          <h3 class="card__title">${escapeHtml(proofSignals.length ? ui(project, "Documented outcomes", "Résultats documentés") : ui(project, "Evidence pending", "Preuves à venir"))}</h3>
          ${proofSignals.length ? `<ul class="project-list">${proofSignals.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p class="card__copy">Outcomes, evidence and media will populate this block.</p>`}
        </article>
        <article class="panel project-discipline__card">
          <p class="card__meta">Messaging fields</p>
          <h3 class="card__title">${escapeHtml(project.subtitle || labelFrom(project.category))}</h3>
          ${renderChips(marketingFocus, "tag-cluster tag-cluster--compact")}
        </article>
      </div>
    </section>`;
};

const renderProjectGraph = (
  project: ProjectEntity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const connected = connectedRelationsFor(project, relations, byId);
  if (!connected.length) return "";
  const nodes = connected.map((relation) => relationDisplay(relation, project, byId, routeById));
  const first = nodes[0];
  const radiusX = 36;
  const radiusY = 32;

  return `
    <section class="zone-card hero project-graph" id="project-graph" data-project-graph>
      <div class="project-graph__intro">
        <div class="section-head">
          <p class="eyebrow">${ui(project, "RELATED CONTEXT", "CONTEXTE ASSOCIÉ")}</p>
          <h2>${escapeHtml(ui(project, `Useful links around ${project.title}.`, `Liens utiles autour de ${project.title}.`))}</h2>
          <p class="lede">${ui(project, "Move from the project toward related people, systems, concepts and evidence.", "Passez du projet aux personnes, systèmes, concepts et preuves qui lui sont reliés.")}</p>
        </div>
        <article class="panel panel--soft project-graph__detail" data-project-graph-detail>
          <p class="card__meta" data-project-graph-label>${escapeHtml(first.label)}</p>
          <h3 class="card__title"><a href="${escapeHtml(first.route)}" data-project-graph-title>${escapeHtml(first.title)}</a></h3>
          <p class="card__copy" data-project-graph-statement>${escapeHtml(first.statement)}</p>
        </article>
      </div>
      <div class="project-graph__stage">
        <svg class="project-graph__lines" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          ${nodes.map((node, index) => {
            const angle = (-90 + (360 / nodes.length) * index) * (Math.PI / 180);
            const x = 50 + Math.cos(angle) * radiusX;
            const y = 50 + Math.sin(angle) * radiusY;
            return `<line x1="50" y1="50" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" />`;
          }).join("")}
        </svg>
        <div class="project-graph__center">
          <span>${ui(project, "PROJECT", "PROJET")}</span>
          <strong>${escapeHtml(project.title)}</strong>
        </div>
        ${nodes.map((node, index) => {
          const angle = (-90 + (360 / nodes.length) * index) * (Math.PI / 180);
          const x = 50 + Math.cos(angle) * radiusX;
          const y = 50 + Math.sin(angle) * radiusY;
          return `
            <button
              class="project-graph__node${index === 0 ? " is-active" : ""}"
              type="button"
              style="--node-x: ${x.toFixed(2)}%; --node-y: ${y.toFixed(2)}%;"
              data-project-graph-node
              data-relation-label="${escapeHtml(node.label)}"
              data-relation-title="${escapeHtml(node.title)}"
              data-relation-statement="${escapeHtml(node.statement)}"
              data-relation-href="${escapeHtml(node.route)}"
            >
              <span>${escapeHtml(upperLabel(node.group))}</span>
              <strong>${escapeHtml(node.title)}</strong>
            </button>`;
        }).join("")}
      </div>
    </section>`;
};

export const renderProjectPage = (
  project: ProjectEntity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const isVestiges = project.slug.canonical === "vestiges";
  const connected = connectedRelationsFor(project, relations, byId);
  const tags = uniqueStrings([...(project.disciplines || []), ...(project.tags || [])]);
  const mediaCount = project.media?.length || 0;
  const hasGraph = connected.length > 0;
  const hasArtDirection = projectHasArtDirection(project);
  const outputRefs = uniqueRefs(publicRefs(project.outputs.filter((ref) => ref.id !== project.id), byId));
  const productionRefs = uniqueRefs(publicRefs([...project.stakeholders, ...project.credits], byId));
  const heroNav = [
    { label: "Brief", href: "#project-brief" },
    { label: "System", href: "#project-system" },
    ...(hasArtDirection ? [{ label: "DA", href: "#project-moodboard" }] : []),
    { label: "Dev", href: "#project-dev" },
    { label: "Marketing", href: "#project-marketing" },
    ...(mediaCount > 1 ? [{ label: "Media", href: "#project-media" }] : []),
    ...(hasGraph ? [{ label: "Graph", href: "#project-graph" }] : []),
    { label: "Thesis", href: "#project-thesis" },
  ];

  return `
    <section class="zone-card hero detail-hero detail-hero--with-media project-dossier-hero" id="project-overview" data-entry-id="${escapeHtml(project.slug.canonical)}">
      <div class="section-head detail-hero__content">
        ${renderProjectBreadcrumb(project)}
        <p class="eyebrow">${ui(project, "PROJECT DOSSIER", "DOSSIER PROJET")}</p>
        <h1 class="display-title">${escapeHtml(project.title)}</h1>
        ${project.subtitle ? `<p class="card__meta">${escapeHtml(project.subtitle)}</p>` : ""}
        <p class="lede">${escapeHtml(project.abstract)}</p>
        <div class="button-row button-row--compact">
          <a class="button button--primary" href="#project-brief">${ui(project, "Read the brief", "Lire le brief")}</a>
          <a class="button button--secondary" href="${hasGraph ? "#project-graph" : "#project-thesis"}">${hasGraph ? ui(project, "See related context", "Voir le contexte associé") : ui(project, "Read thesis", "Lire la thèse")}</a>
          ${(project.socialLinks || []).map((link) => `<a class="button button--secondary" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
        </div>
        <div class="metric-rail">
          ${renderMetric(ui(project, "Status", "État"), labelFrom(project.status), project.maturity, "surface")}
          ${renderMetric(ui(project, "Category", "Catégorie"), isVestiges ? ui(project, "Flagship platform", "Plateforme phare") : labelFrom(project.category), undefined, "research")}
        </div>
        ${renderChips(tags.slice(0, 10))}
        <nav class="project-dossier-nav" aria-label="Project sections">
          ${heroNav.map((item) => `<a class="tag" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
        </nav>
      </div>
      ${renderHeroVisual(project)}
    </section>
    ${renderProjectSystem(project)}
    ${renderProjectMoodboard(project)}
    ${renderProjectDevelopment(project, relations, byId, routeById)}
    ${renderProjectMarketing(project, byId, routeById)}
    ${renderProjectTabs(project, byId, routeById)}
    <section class="zone-card hero project-output-section">
      ${renderRefCards("Addressable outputs.", "OUTPUTS", outputRefs, byId, routeById)}
      ${renderRefCards("Stakeholders and credits.", "PRODUCTION", productionRefs, byId, routeById)}
    </section>
    ${renderProjectMedia(project)}
    ${renderProjectGraph(project, relations, byId, routeById)}
    <article class="zone-card hero publication-body project-dossier-body" id="project-thesis">
      <div class="section-head">
        <p class="eyebrow">PROJECT THESIS</p>
        <h2>${isVestiges ? "Vestiges as living knowledge infrastructure." : "Detailed reading notes."}</h2>
      </div>
      ${project.bodyHtml}
    </article>
    ${renderRelationshipGroups(project, relations, byId, routeById)}
    ${renderRecordDetails(project, `
      <section class="detail-grid">
        ${renderEntityMetadata(project)}
        ${renderCitationPanel(project, `${site.origin}${routeForEntity(project)}`)}
      </section>
    `)}
  `;
};
