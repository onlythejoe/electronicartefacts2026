import type { Entity } from "../../schema/entities.js";
import type { RelationStatement } from "../../schema/relation.js";
import { escapeHtml } from "../html.js";

export const renderLocalGraph = (entity: Entity, relations: RelationStatement[]): string => {
  const count = relations.filter((relation) => relation.subject === entity.id || relation.object === entity.id).length;
  const type = entity.type === "researchField" ? "research-field" : entity.type;
  return `
    <section class="panel knowledge-panel" data-local-graph data-graph-src="/graph/neighborhoods/${escapeHtml(type)}/${escapeHtml(entity.slug.canonical)}.json">
      <div class="section-head">
        <p class="card__meta">Local graph</p>
        <h2 class="card__title">${escapeHtml(String(count))} typed connections</h2>
        <p class="card__copy">The accessible relationship list above contains the complete local graph. Interactive rendering is loaded progressively.</p>
      </div>
    </section>`;
};
