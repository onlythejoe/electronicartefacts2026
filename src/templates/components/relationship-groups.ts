import { predicateDefinitions } from "../../schema/predicates.js";
import type { Entity } from "../../schema/entities.js";
import type { RelationStatement } from "../../schema/relation.js";
import { escapeHtml } from "../html.js";

export const renderRelationshipGroups = (
  entity: Entity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => {
  const connected = relations.filter((relation) => relation.subject === entity.id || relation.object === entity.id);
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
        <h2>How this entity connects.</h2>
        <p class="lede">Each connection has an explicit predicate and a human-readable statement.</p>
      </div>
      <div class="card-grid card-grid--two">
        ${[...groups.entries()].map(([group, items]) => `
          <article class="panel">
            <p class="card__meta">${escapeHtml(group)}</p>
            <div class="stack">
              ${items.map((relation) => {
                const outbound = relation.subject === entity.id;
                const connectedId = outbound ? relation.object : relation.subject;
                const connectedEntity = byId.get(connectedId);
                return `
                  <div class="panel panel--soft">
                    <p class="card__meta">${escapeHtml(predicateDefinitions[relation.predicate].label)}</p>
                    <h3 class="card__title"><a href="${escapeHtml(routeById[connectedId] || "#")}">${escapeHtml(connectedEntity?.title || connectedId)}</a></h3>
                    <p class="card__copy">${escapeHtml(relation.statement)}</p>
                  </div>`;
              }).join("")}
            </div>
          </article>`).join("")}
      </div>
    </section>`;
};
