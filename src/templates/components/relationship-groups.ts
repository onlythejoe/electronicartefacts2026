import { predicateDefinitions } from "../../schema/predicates.js";
import type { Entity } from "../../schema/entities.js";
import type { RelationStatement } from "../../schema/relation.js";
import { connectedEntityIdForRelation, publicEntityIds, publicRelationsForEntity } from "../../semantic/visibility.js";
import { escapeHtml } from "../html.js";

const frenchRelationLabels: Record<string, string> = {
  "Defines": "Définit",
  "Refines": "Affîne",
  "Contrasts with": "Contraste avec",
  "Influenced by": "Influencé par",
  "Tests": "Met à l’épreuve",
  "Supports claim": "Étaye l’affirmation",
  "Contradicts claim": "Contredit l’affirmation",
  "Cites": "Cite",
  "Applies concept": "Applique le concept",
  "Applied by": "Appliqué par",
  "Uses method": "Utilise la méthode",
  "Used by": "Utilisé par",
  "Implements framework": "Implémente le framework",
  "Implemented by": "Implémenté par",
  "Uses technology": "Utilise la technologie",
  "Implements": "Implémente",
  "Demonstrated by": "Démontré par",
  "Created by": "Créé par",
  "Contributed by": "Avec la contribution de",
  "Produced by": "Produit par",
  "Published by": "Publié par",
  "Commissioned by": "Commandé par",
  "Maintained by": "Maintenu par",
  "Funded by": "Financé par",
  "Has part": "Comprend",
  "Part of": "Fait partie de",
  "Member of collection": "Membre de la collection",
  "Documents": "Documente",
  "Documented by": "Documenté par",
  "Subject of": "Sujet de",
  "Depends on": "Dépend de",
  "Powered by": "Fondé sur",
  "Integrates with": "S’intègre à",
  "Supersedes": "Remplace",
  "Version of": "Version de",
  "Forked from": "Dérivé de",
  "Evidenced by": "Étayé par",
  "Derived from": "Issu de",
  "Uses dataset": "Utilise le jeu de données",
  "Generated artefact": "Génère l’artefact",
  "Has source": "A pour source",
  "Preceded by": "Précédé par",
  "Followed by": "Suivi par",
  "Occurred during": "Survenu pendant",
  "Resulted in": "A produit",
};

const frenchGroupLabels: Record<string, string> = {
  knowledge: "connaissance",
  implementation: "implémentation",
  production: "production",
  structure: "structure",
  evidence: "preuves",
  history: "historique",
};

const relationLabelForEntity = (entity: Entity, relation: RelationStatement): string => {
  const definition = predicateDefinitions[relation.predicate];
  const entityIds = new Set([entity.id, entity.translationOf].filter(Boolean));
  const label = entityIds.has(relation.object) && definition.inverseLabel
    ? definition.inverseLabel
    : definition.label;
  return entity.locale === "fr" ? frenchRelationLabels[label] || label : label;
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
  const condensed = entity.id === "ea:program:vaste" || entity.translationOf === "ea:program:vaste";
  const renderRelation = (relation: RelationStatement): string => {
    const connectedId = connectedEntityIdForRelation(entity, relation);
    const connectedEntity = byId.get(connectedId);
    return `
                  <div class="panel panel--soft">
                    <p class="card__meta">${escapeHtml(relationLabelForEntity(entity, relation))}</p>
                    <h3 class="card__title"><a href="${escapeHtml(routeById[connectedId] || "#")}">${escapeHtml(connectedEntity?.title || connectedId)}</a></h3>
                    ${entity.locale === "fr" ? "" : `<p class="card__copy">${escapeHtml(relation.statement)}</p>`}
                  </div>`;
  };
  return `
    <section class="zone-card hero">
      <div class="section-head">
        <p class="eyebrow">${entity.locale === "fr" ? "RELATIONS DOCUMENTÉES" : "DOCUMENTED RELATIONSHIPS"}</p>
        <h2>${entity.locale === "fr" ? "Travaux et idées associés." : "Connected work and ideas."}</h2>
        <p class="lede">${entity.locale === "fr" ? "Chaque lien précise la nature de la relation entre deux entrées." : "Each link names the relationship between two entries and why it matters."}</p>
      </div>
      <div class="card-grid card-grid--two">
        ${[...groups.entries()].map(([group, items]) => `
          <article class="panel">
            <p class="card__meta">${escapeHtml(entity.locale === "fr" ? frenchGroupLabels[group] || group : group)}</p>
            <div class="stack">
              ${items.slice(0, condensed ? 6 : items.length).map(renderRelation).join("")}${condensed && items.length > 6 ? `
                <details class="relationship-overflow">
                  <summary>${entity.locale === "fr" ? `Voir ${items.length - 6} relations supplémentaires` : `Show ${items.length - 6} more relationships`}</summary>
                  <div class="stack">${items.slice(6).map(renderRelation).join("")}</div>
                </details>` : ""}
            </div>
          </article>`).join("")}
      </div>
    </section>`;
};
