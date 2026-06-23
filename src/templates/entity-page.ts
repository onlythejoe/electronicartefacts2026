import { site } from "../config/site.js";
import { routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import { renderBreadcrumbs } from "./components/breadcrumbs.js";
import { renderCitationPanel } from "./components/citation-panel.js";
import { renderEntityHeader } from "./components/entity-header.js";
import { renderEntityMetadata } from "./components/entity-metadata.js";
import { renderLocalGraph } from "./components/local-graph.js";
import { renderRelationshipGroups } from "./components/relationship-groups.js";
import { renderProjectPage } from "./project-page.js";
import { escapeHtml } from "./html.js";

const renderProgramComputationField = (entity: Entity): string => entity.type === "program" ? `
  <section class="zone-card hero program-runtime-field">
    <div class="program-runtime-field__grid">
      <div class="section-head">
        <p class="eyebrow">RUNTIME SIGNAL</p>
        <h2>${escapeHtml(entity.title)} as an information system.</h2>
        <p class="lede">A live view of transfer, execution and synchronization across the program’s graph-shaped architecture.</p>
        <div class="pill-cloud">
          <span class="tag">Data flow</span>
          <span class="tag">Context</span>
          <span class="tag">Execution</span>
        </div>
      </div>
      <figure class="program-commercial-hero__media computation-field computation-field--detail" data-computation-field data-computation-variant="detail">
        <canvas class="computation-field__canvas" aria-hidden="true"></canvas>
        <div class="computation-field__hud" aria-hidden="true">
          <span>EA.RUNTIME / ${escapeHtml(entity.title.toUpperCase())}</span>
          <span data-computation-rate>128.4 GB/s</span>
        </div>
        <div class="computation-field__events" data-computation-events aria-hidden="true"></div>
        <figcaption>
          <span>Runtime signal</span>
          <strong>Information propagates through context, identity and execution layers.</strong>
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
  <article class="zone-card hero publication-body">${entity.bodyHtml}</article>
  <section class="detail-grid">
    ${renderEntityMetadata(entity)}
    ${renderCitationPanel(entity, `${site.origin}${routeForEntity(entity)}`)}
  </section>
  ${renderRelationshipGroups(entity, relations, byId, routeById)}
  <section class="zone-card hero">${renderLocalGraph(entity, relations, byId)}</section>
`;
