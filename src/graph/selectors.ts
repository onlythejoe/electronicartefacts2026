import { predicateDefinitions } from "../schema/predicates.js";
import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import type { EntityId } from "../schema/entity.js";
import type { RouteRecord } from "../build/build-routes.js";
import { publicEntityIds, publicRelationsForEntity } from "../semantic/visibility.js";

export interface GraphNode {
  id: EntityId;
  type: Entity["type"];
  title: string;
  route: string;
  status: Entity["status"];
  confidence: Entity["confidence"];
}

export interface GraphEdge {
  id: string;
  source: EntityId;
  target: EntityId;
  predicate: RelationStatement["predicate"];
  label: string;
  statement: string;
  confidence: RelationStatement["confidence"];
}

export interface GraphView {
  id: string;
  kind: "local";
  focus: EntityId;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const localNeighborhood = (
  focus: Entity,
  entities: Entity[],
  relations: RelationStatement[],
  routes: RouteRecord[],
): GraphView => {
  const publicIds = publicEntityIds(entities);
  const connected = publicRelationsForEntity(focus, relations, publicIds);
  const ids = new Set<EntityId>([focus.id]);
  connected.forEach((relation) => {
    ids.add(relation.subject);
    ids.add(relation.object);
  });
  const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
  return {
    id: `local:${focus.id}`,
    kind: "local",
    focus: focus.id,
    nodes: entities.filter((entity) => ids.has(entity.id)).map((entity) => ({
      id: entity.id,
      type: entity.type,
      title: entity.title,
      route: routeById[entity.id],
      status: entity.status,
      confidence: entity.confidence,
    })),
    edges: connected.map((relation) => ({
      id: relation.id,
      source: relation.subject,
      target: relation.object,
      predicate: relation.predicate,
      label: predicateDefinitions[relation.predicate].label,
      statement: relation.statement,
      confidence: relation.confidence,
    })),
  };
};
