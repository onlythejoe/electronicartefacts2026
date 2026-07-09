import { predicateDefinitions } from "../../schema/predicates.js";
import type { Entity } from "../../schema/entities.js";
import type { RelationStatement } from "../../schema/relation.js";
import { connectedEntityIdForRelation, publicEntityIds, publicRelationsForEntity } from "../../semantic/visibility.js";
import { escapeHtml } from "../html.js";

const relationLabelForEntity = (entity: Entity, relation: RelationStatement): string => {
  const definition = predicateDefinitions[relation.predicate];
  const entityIds = new Set([entity.id, entity.translationOf].filter(Boolean));
  return entityIds.has(relation.object) && definition.inverseLabel
    ? definition.inverseLabel
    : definition.label;
};

export const renderRelationshipGroups = (
  entity: Entity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const connected = publicRelationsForEntity(entity, relations, publicEntityIds(byId.values()));
  if (!connected.length) return "";
  const groups = new Map<string, RelationStatement[]>();
  for (const relation of connected) {
    const group = predicateDefinitions[relation.predicate].group;
    groups.set(group, [...(groups.get(group) || []), relation]);
  }
  return `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">TYPED RELATIONSHIPS</p>
        <h2>Connected work and ideas.</h2>
        <p class="lede">Each relation names what connects the two entries and why that connection matters.</p>
      </div>
      <div class="card-grid card-grid--two">
        ${[...groups.entries()].map(([group, items]) => `
          <article class="panel">
            <p class="card__meta">${escapeHtml(group)}</p>
            <div class="stack">
              ${items.map((relation) => {
                const connectedId = connectedEntityIdForRelation(entity, relation);
                const connectedEntity = byId.get(connectedId);
                return `
                  <div class="panel panel--soft">
                    <p class="card__meta">${escapeHtml(relationLabelForEntity(entity, relation))}</p>
                    <h3 class="card__title"><a href="${escapeHtml(routeById[connectedId] || "#")}">${escapeHtml(connectedEntity?.title || connectedId)}</a></h3>
                    <p class="card__copy">${escapeHtml(relation.statement)}</p>
                  </div>`;
              }).join("")}
            </div>
          </article>`).join("")}
      </div>
    </section>`;
};
