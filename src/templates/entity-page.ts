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

export const renderEntityPage = (
  entity: Entity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => `
  <section class="zone-card">${renderBreadcrumbs(entity)}</section>
  ${renderEntityHeader(entity)}
  <article class="zone-card hero publication-body">${entity.bodyHtml}</article>
  <section class="detail-grid">
    ${renderEntityMetadata(entity)}
    ${renderCitationPanel(entity, `${site.origin}${routeForEntity(entity)}`)}
  </section>
  ${renderRelationshipGroups(entity, relations, byId, routeById)}
  <section class="zone-card hero">${renderLocalGraph(entity, relations)}</section>
`;
