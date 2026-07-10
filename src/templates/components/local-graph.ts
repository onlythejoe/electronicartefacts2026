import type { Entity } from "../../schema/entities.js";
import type { RelationStatement } from "../../schema/relation.js";
import { publicEntityIds, publicRelationsForEntity } from "../../semantic/visibility.js";
import { graphNeighborhoodRoute } from "../../graph/paths.js";
import { escapeHtml } from "../html.js";

export const renderLocalGraph = (entity: Entity, relations: RelationStatement[], byId: Map<string, Entity>): string => {
  const count = publicRelationsForEntity(entity, relations, publicEntityIds(byId.values())).length;
  const french = entity.locale === "fr";
  return `
    <section class="panel knowledge-panel" data-local-graph data-graph-src="${escapeHtml(graphNeighborhoodRoute(entity))}">
      <div class="section-head">
        <p class="card__meta">${french ? "Contexte associé" : "Related context"}</p>
        <h2 class="card__title">${french ? "Relations de proximité" : "Nearby relationships"}</h2>
        <p class="card__copy">${french ? `${count} ${count === 1 ? "lien public relie" : "liens publics relient"} cette page à des projets, concepts et références proches.` : `${count} public ${count === 1 ? "link connects" : "links connect"} this page to nearby projects, concepts and references.`}</p>
      </div>
    </section>`;
};
