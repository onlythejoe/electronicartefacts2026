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
  return headings.reduce((html, [pattern, replacement]) => html.replace(pattern, replacement), entity.bodyHtml);
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
): string => entity.type === "project" ? renderProjectPage(entity, relations, byId, routeById) : `
  <section class="zone-card entity-breadcrumb-card">${renderBreadcrumbs(entity)}</section>
  ${renderEntityHeader(entity)}${renderVasteOverview(entity)}${renderProgramComputationField(entity)}
  ${renderEditorialPanels(entity, byId, routeById)}
  <article class="zone-card hero publication-body${isVasteProgram(entity) ? " publication-body--vaste" : ""}">${renderEntityBody(entity)}</article>
  ${renderRelationshipGroups(entity, relations, byId, routeById)}
  ${renderRecordDetails(entity, `
    <section class="detail-grid">
      ${renderEntityMetadata(entity)}
      ${renderCitationPanel(entity, `${site.origin}${routeForEntity(entity)}`)}
    </section>
    <section class="record-details__graph">${renderLocalGraph(entity, relations, byId)}</section>
  `)}
`;
