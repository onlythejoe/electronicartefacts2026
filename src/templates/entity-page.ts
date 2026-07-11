import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import { renderBreadcrumbs } from "./components/breadcrumbs.js";
import { renderCitationPanel } from "./components/citation-panel.js";
import { renderEditorialPanels } from "./components/editorial-panels.js";
import { renderEntityHeader } from "./components/entity-header.js";
import { renderEntityMetadata } from "./components/entity-metadata.js";
import { renderLocalGraph } from "./components/local-graph.js";
import { renderRelationshipGroups } from "./components/relationship-groups.js";
import { renderRecordDetails } from "./components/record-details.js";
import { renderProjectPage } from "./project-page.js";
import { escapeHtml } from "./html.js";

const isVasteProgram = (entity: Entity): boolean =>
  entity.id === "ea:program:vaste" || entity.translationOf === "ea:program:vaste";

const renderVasteRuntimeStack = (french: boolean): string => {
  const layers = french
    ? [
        ["Interface", "Apps et hosts", "Surfaces remplaçables"],
        ["Orchestration", "Platform · Operations", "System patterns"],
        ["Domaines", "Extensions · Capabilities", "Sens des produits"],
        ["Gouvernance", "System layer", "Exécution gouvernée"],
        ["Primitives", "Vertex · Tie · Action", "Surface · Environment"],
        ["Fondation", "Kernel", "Mécanique déterministe"],
      ]
    : [
        ["Interface", "Apps and hosts", "Replaceable surfaces"],
        ["Orchestration", "Platform · Operations", "System patterns"],
        ["Domains", "Extensions · Capabilities", "Product meaning"],
        ["Governance", "System layer", "Governed execution"],
        ["Primitives", "Vertex · Tie · Action", "Surface · Environment"],
        ["Foundation", "Kernel", "Deterministic mechanics"],
      ];
  return `<figure class="vaste-runtime-stack" aria-label="${french ? "Les six niveaux de l’architecture VASTE" : "The six levels of the VASTE architecture"}">
    <figcaption>${french ? "De la surface remplaçable au kernel déterministe" : "From replaceable surfaces to the deterministic kernel"}</figcaption>
    <div class="vaste-runtime-stack__flow">
      ${layers.map(([eyebrow, title, detail], index) => `<div class="vaste-runtime-stack__layer">
        <em>${String(index + 1).padStart(2, "0")}</em>
        <span><small>${eyebrow}</small><strong>${title}</strong><span>${detail}</span></span>
      </div>`).join("")}
    </div>
  </figure>`;
};

const renderVasteGenesisFlow = (french: boolean): string => {
  const steps = french
    ? ["VASTE boote Electronic Artefacts", "EA gouverne ses opérations", "EA gouverne le développement de VASTE", "Un System candidat est construit et exporté", "Structure et autorité sont revalidées", "Le Founding Actor approuve le handover"]
    : ["VASTE boots Electronic Artefacts", "EA governs its operations", "EA governs VASTE development", "A candidate System is built and exported", "Structure and authority are revalidated", "The Founding Actor approves handover"];
  return `<ol class="vaste-genesis-flow" aria-label="${french ? "Boucle Electronic Artefacts Genesis" : "Electronic Artefacts Genesis loop"}">
    ${steps.map((step, index) => `<li><em>${String(index + 1).padStart(2, "0")}</em><span>${step}</span></li>`).join("")}
  </ol>`;
};

const renderVasteOverview = (entity: Entity): string => {
  if (!isVasteProgram(entity)) return "";
  const french = entity.locale === "fr";
  const primitives = ["Vertex", "Tie", "Action", "Surface", "Environment"];
  const anchors = french
    ? [
        ["definition", "Définition"],
        ["runtime-model", "Modèle runtime"],
        ["governed-execution", "Exécution"],
        ["portability", "Portabilité .vast"],
        ["assisted-boot", "Assisted Boot"],
        ["evidence", "Preuves"],
        ["limits", "Limites"],
      ]
    : [
        ["definition", "Definition"],
        ["runtime-model", "Runtime model"],
        ["governed-execution", "Execution"],
        ["portability", ".vast portability"],
        ["assisted-boot", "Assisted Boot"],
        ["evidence", "Evidence"],
        ["limits", "Limits"],
      ];
  return `
    <section class="zone-card hero vaste-console" aria-labelledby="vaste-console-title">
      <div class="vaste-console__head">
        <div class="section-head">
          <p class="eyebrow">${french ? "ÉTAT DU RUNTIME" : "RUNTIME STATE"}</p>
          <h2 id="vaste-console-title">${french ? "Ce qui fonctionne. Ce qui reste expérimental." : "What works. What remains experimental."}</h2>
          <p class="lede">${french
            ? "Une lecture rapide du périmètre réel de VASTE avant d’entrer dans l’architecture et ses preuves."
            : "A fast reading of VASTE’s actual scope before entering the architecture and its evidence."}</p>
        </div>
        <div class="button-row button-row--compact vaste-console__actions">
          <a class="button button--primary" href="${french ? "/fr/archive/artefacts/vaste-validation-record/" : "/archive/artefacts/vaste-validation-record/"}">${french ? "Ouvrir le registre de preuves" : "Open validation record"}</a>
          <a class="button button--secondary" href="https://www.vaste.space/" target="_blank" rel="noreferrer">${french ? "Voir le briefing interactif ↗" : "View interactive briefing ↗"}</a>
        </div>
      </div>
      <div class="vaste-console__signals" aria-label="${french ? "État synthétique de VASTE" : "VASTE status summary"}">
        <article><span>${french ? "IMPLÉMENTÉ" : "IMPLEMENTED"}</span><strong>${french ? "Runtime actif et couvert par des tests" : "Active, test-backed runtime"}</strong><p>${french ? "Primitives, exécution, extensions, replay et Assisted Boot." : "Primitives, execution, extensions, replay and Assisted Boot."}</p></article>
        <article><span>${french ? "PORTABLE" : "PORTABLE"}</span><strong><code>vast/1</code> ${french ? "en round-trip" : "round-trip"}</strong><p>${french ? "Export, import, scellement et rebinding d’un System." : "System export, import, sealing and rebinding."}</p></article>
        <article><span>${french ? "NON STABLE" : "NOT STABLE"}</span><strong>${french ? "Pas encore un SDK public" : "Not yet a public SDK"}</strong><p>${french ? "Isolation tierce, confiance portable et handover restent incomplets." : "Third-party isolation, portable trust and handover remain incomplete."}</p></article>
      </div>
      <div class="vaste-console__primitives" aria-label="${french ? "Les cinq primitives de VASTE" : "The five VASTE primitives"}">
        ${primitives.map((primitive, index) => `<span><em>0${index + 1}</em><strong>${primitive}</strong></span>`).join("")}
      </div>
      <nav class="vaste-console__nav" aria-label="${french ? "Parcourir le dossier VASTE" : "Browse the VASTE dossier"}">
        ${anchors.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
      </nav>
    </section>`;
};

const renderVasteGraphDemo = (entity: Entity): string => {
  if (!isVasteProgram(entity)) return "";
  const french = entity.locale === "fr";
  return `
    <link rel="stylesheet" href="/assets/css/vaste-demo.css?v=1" />
    <section class="zone-card hero vaste-demo" data-vaste-demo data-locale="${french ? "fr" : "en"}" aria-labelledby="vaste-demo-title">
      <div class="vaste-demo__intro">
        <div class="section-head">
          <p class="eyebrow">${french ? "SURFACE INTERACTIVE" : "INTERACTIVE SURFACE"}</p>
          <h2 id="vaste-demo-title">${french ? "Manipuler un système VASTE." : "Manipulate a VASTE system."}</h2>
          <p class="lede">${french
            ? "Explorez trois projections simplifiées du runtime. Déplacez les Vertex, inspectez leur rôle et composez vos propres relations."
            : "Explore three simplified runtime projections. Move Vertices, inspect their roles and compose your own relationships."}</p>
        </div>
        <div class="vaste-demo__legend" aria-label="${french ? "Légende" : "Legend"}">
          <span><i data-tone="vertex"></i>Vertex</span>
          <span><i data-tone="action"></i>Action</span>
          <span><i data-tone="surface"></i>Surface</span>
          <span><i data-tone="environment"></i>Environment</span>
        </div>
      </div>

      <div class="vaste-demo__window">
        <div class="vaste-demo__chrome" aria-hidden="true">
          <span class="vaste-demo__traffic"><i></i><i></i><i></i></span>
          <span>VASTE / GRAPH SURFACE</span>
          <span class="vaste-demo__chrome-state" data-demo-chrome-state>${french ? "SYSTÈME ACTIF" : "SYSTEM ACTIVE"}</span>
        </div>

        <div class="vaste-demo__scenes" role="tablist" aria-label="${french ? "Choisir une projection" : "Choose a projection"}">
          <button class="vaste-demo__scene is-active" type="button" role="tab" aria-selected="true" data-demo-scene="runtime">${french ? "Runtime" : "Runtime"}</button>
          <button class="vaste-demo__scene" type="button" role="tab" aria-selected="false" data-demo-scene="portable">${french ? "Portabilité .vast" : ".vast portability"}</button>
          <button class="vaste-demo__scene" type="button" role="tab" aria-selected="false" data-demo-scene="boot">Assisted Boot</button>
        </div>

        <div class="vaste-demo__workspace">
          <div class="vaste-demo__canvas-shell" data-demo-canvas-shell>
            <canvas class="vaste-demo__canvas" data-demo-canvas></canvas>
            <div class="vaste-demo__canvas-label" aria-hidden="true"><span data-demo-scene-label>RUNTIME / SYSTEM:EA</span><i data-demo-frame>0000</i></div>
            <p class="vaste-demo__hint" data-demo-hint>${french ? "Glissez un noyau dans une membrane pour l’imbriquer" : "Drag a nucleus into a membrane to nest it"}</p>
          </div>

          <aside class="vaste-demo__inspector" aria-label="${french ? "Inspecteur de Vertex" : "Vertex inspector"}">
            <p class="vaste-demo__inspector-kicker" data-demo-selection-type>System</p>
            <h3 data-demo-selection-title>Electronic Artefacts</h3>
            <p data-demo-selection-copy>${french ? "Partition racine et clôture structurelle de cette projection." : "Root partition and structural closure of this projection."}</p>
            <dl>
              <div><dt>ID</dt><dd data-demo-selection-id>system:ea</dd></div>
              <div><dt>${french ? "ÉTAT" : "STATE"}</dt><dd data-demo-selection-state>${french ? "OBSERVABLE" : "OBSERVABLE"}</dd></div>
              <div><dt>${french ? "LIENS" : "TIES"}</dt><dd data-demo-selection-links>5</dd></div>
              <div><dt>${french ? "PARENT" : "PARENT"}</dt><dd data-demo-selection-parent>—</dd></div>
              <div><dt>${french ? "CONTENU" : "CHILDREN"}</dt><dd data-demo-selection-children>2</dd></div>
            </dl>
            <p class="vaste-demo__inspector-note">${french
              ? "Cette démo est une projection pédagogique locale, pas une instance du runtime ni une preuve d’exécution."
              : "This demo is a local explanatory projection, not a runtime instance or execution evidence."}</p>
          </aside>
        </div>

        <div class="vaste-demo__toolbar" aria-label="${french ? "Actions sur le graphe" : "Graph actions"}">
          <button type="button" data-demo-action="add"><span aria-hidden="true">＋</span>${french ? "Ajouter un Vertex" : "Add Vertex"}</button>
          <button type="button" data-demo-action="link"><span aria-hidden="true">⌁</span><span data-demo-link-label>${french ? "Relier" : "Connect"}</span></button>
          <button type="button" data-demo-action="detach"><span aria-hidden="true">↗</span>${french ? "Détacher" : "Detach"}</button>
          <button type="button" data-demo-action="links" aria-pressed="true"><span aria-hidden="true">⌘</span><span data-demo-links-label>${french ? "Liens visibles" : "Ties visible"}</span></button>
          <button type="button" data-demo-action="reset"><span aria-hidden="true">↺</span>${french ? "Réinitialiser" : "Reset"}</button>
          <span class="vaste-demo__live" data-demo-live aria-live="polite"></span>
        </div>
      </div>
      <script type="module" src="/assets/js/vaste-demo.js?v=1"></script>
    </section>`;
};

const renderEntityBody = (entity: Entity): string => {
  if (!isVasteProgram(entity)) return entity.bodyHtml;
  const headings: Array<[RegExp, string]> = entity.locale === "fr"
    ? [
        [/<h2>Définition<\/h2>/, '<h2 id="definition">Définition</h2>'],
        [/<h2>Modèle runtime<\/h2>/, '<h2 id="runtime-model">Modèle runtime</h2>'],
        [/<h2>Exécution gouvernée<\/h2>/, '<h2 id="governed-execution">Exécution gouvernée</h2>'],
        [/<h2>Portabilité <code>\.vast<\/code><\/h2>/, '<h2 id="portability">Portabilité <code>.vast</code></h2>'],
        [/<h2>VAB — Assisted Boot<\/h2>/, '<h2 id="assisted-boot">VAB — Assisted Boot</h2>'],
        [/<h2>Registre de preuves<\/h2>/, '<h2 id="evidence">Registre de preuves</h2>'],
        [/<h2>Limites<\/h2>/, '<h2 id="limits">Limites</h2>'],
      ]
    : [
        [/<h2>Definition<\/h2>/, '<h2 id="definition">Definition</h2>'],
        [/<h2>Runtime model<\/h2>/, '<h2 id="runtime-model">Runtime model</h2>'],
        [/<h2>Governed execution<\/h2>/, '<h2 id="governed-execution">Governed execution</h2>'],
        [/<h2><code>\.vast<\/code> portability<\/h2>/, '<h2 id="portability"><code>.vast</code> portability</h2>'],
        [/<h2>VAB — Assisted Boot<\/h2>/, '<h2 id="assisted-boot">VAB — Assisted Boot</h2>'],
        [/<h2>Validation record<\/h2>/, '<h2 id="evidence">Validation record</h2>'],
        [/<h2>Limits<\/h2>/, '<h2 id="limits">Limits</h2>'],
      ];
  const french = entity.locale === "fr";
  const withAnchors = headings.reduce((html, [pattern, replacement]) => html.replace(pattern, replacement), entity.bodyHtml);
  const withVisualFlows = withAnchors
    .replace(/<pre><code class="language-text">(?:Apps et hosts remplaçables|Apps and replaceable hosts)[\s\S]*?Mécanique déterministe du kernel\n<\/code><\/pre>|<pre><code class="language-text">Apps and replaceable hosts[\s\S]*?Deterministic kernel mechanics\n<\/code><\/pre>/, renderVasteRuntimeStack(french))
    .replace(/<pre><code class="language-text">(?:VASTE boote Electronic Artefacts|VASTE boots Electronic Artefacts)[\s\S]*?<\/code><\/pre>/, renderVasteGenesisFlow(french));
  return withVisualFlows
    .split(/(?=<h2(?:\s|>))/)
    .filter(Boolean)
    .map((section) => `<section class="vaste-dossier-section">${section}</section>`)
    .join("");
};

const renderProgramComputationField = (entity: Entity): string => entity.type === "program" ? `
  <section class="zone-card hero program-runtime-field">
    <div class="program-runtime-field__grid">
      <div class="section-head">
        <p class="eyebrow">${entity.locale === "fr" ? "MODÈLE D’ARCHITECTURE" : "ARCHITECTURE MODEL"}</p>
        <h2>${escapeHtml(entity.title)}${entity.locale === "fr" ? " comme système d’information." : " as an information system."}</h2>
        <p class="lede">${entity.locale === "fr" ? "Une visualisation navigateur des relations entre identité, contexte et exécution. Elle illustre l’architecture ; elle ne mesure pas un débit réel." : "A browser visualization of the relationships between identity, context and execution. It illustrates the architecture; it does not measure live throughput."}</p>
        <div class="pill-cloud">
          <span class="tag">Data flow</span>
          <span class="tag">Context</span>
          <span class="tag">Execution</span>
        </div>
      </div>
      <figure class="program-commercial-hero__media computation-field computation-field--detail" data-computation-field data-computation-variant="detail">
        <canvas class="computation-field__canvas" aria-hidden="true"></canvas>
        <div class="computation-field__hud" aria-hidden="true">
          <span>EA.MODEL / ${escapeHtml(entity.title.toUpperCase())}</span>
          <span>${entity.locale === "fr" ? "CONTEXTE / IDENTITÉ / EXÉCUTION" : "CONTEXT / IDENTITY / EXECUTION"}</span>
        </div>
        <div class="computation-field__events" data-computation-events aria-hidden="true"></div>
        <figcaption>
          <span>${entity.locale === "fr" ? "Étude d’architecture" : "Architecture study"}</span>
          <strong>${entity.locale === "fr" ? "Identité, contexte et exécution sont représentés comme des couches reliées." : "Identity, context and execution are represented as connected layers."}</strong>
        </figcaption>
      </figure>
    </div>
  </section>
` : "";

export const renderEntityPage = (
  entity: Entity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  if (entity.type === "project") return renderProjectPage(entity, relations, byId, routeById);
  const body = `<article class="zone-card hero publication-body${isVasteProgram(entity) ? " publication-body--vaste" : ""}">${renderEntityBody(entity)}</article>`;
  const editorialPanels = renderEditorialPanels(entity, byId, routeById);
  const editorialFlow = isVasteProgram(entity) ? `${body}\n  ${editorialPanels}` : `${editorialPanels}\n  ${body}`;
  return `
  <section class="zone-card entity-breadcrumb-card">${renderBreadcrumbs(entity)}</section>
  ${renderEntityHeader(entity)}${renderVasteOverview(entity)}${renderVasteGraphDemo(entity)}${renderProgramComputationField(entity)}
  ${editorialFlow}
  ${renderRelationshipGroups(entity, relations, byId, routeById)}
  ${renderRecordDetails(entity, `
    <section class="detail-grid">
      ${renderEntityMetadata(entity)}
      ${renderCitationPanel(entity, `${site.origin}${routeForEntity(entity)}`)}
    </section>
    <section class="record-details__graph">${renderLocalGraph(entity, relations, byId)}</section>
  `)}
`;
};
