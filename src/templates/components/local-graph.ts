import type { Entity } from "../../schema/entities.js";
import type { RelationStatement } from "../../schema/relation.js";
import { publicEntityIds, publicRelationsForEntity } from "../../semantic/visibility.js";
import { escapeHtml } from "../html.js";

export const renderLocalGraph = (entity: Entity, relations: RelationStatement[], byId: Map<string, Entity>): string => {
  const count = publicRelationsForEntity(entity, relations, publicEntityIds(byId.values())).length;
  const type = entity.type === "researchField" ? "research-field" : entity.type;
  return `
    <section class="panel knowledge-panel" data-local-graph data-graph-src="/graph/neighborhoods/${escapeHtml(type)}/${escapeHtml(entity.slug.canonical)}.json">
      <div class="section-head">
        <p class="card__meta">Related context</p>
        <h2 class="card__title">${escapeHtml(String(count))} useful ${count === 1 ? "link" : "links"}</h2>
        <p class="card__copy">Use these connections to move from this page toward nearby projects, concepts and references.</p>
      </div>
    </section>`;
};
