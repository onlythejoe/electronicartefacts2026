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
  ${renderEntityHeader(entity)}${renderProgramComputationField(entity)}
  ${renderEditorialPanels(entity, byId, routeById)}
  <article class="zone-card hero publication-body">${entity.bodyHtml}</article>
  ${renderRelationshipGroups(entity, relations, byId, routeById)}
  ${renderRecordDetails(entity, `
    <section class="detail-grid">
      ${renderEntityMetadata(entity)}
      ${renderCitationPanel(entity, `${site.origin}${routeForEntity(entity)}`)}
    </section>
    <section class="record-details__graph">${renderLocalGraph(entity, relations, byId)}</section>
  `)}
`;
