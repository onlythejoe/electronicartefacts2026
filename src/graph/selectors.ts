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

const localizedEndpointIndex = (entities: Entity[], locale: Entity["locale"]): Map<EntityId, Entity> => {
  const byEndpoint = new Map<EntityId, Entity>();
  const prefer = (endpointId: EntityId, entity: Entity) => {
    const current = byEndpoint.get(endpointId);
    if (!current || (current.locale !== locale && entity.locale === locale)) {
      byEndpoint.set(endpointId, entity);
    }
  };

  for (const entity of entities) {
    prefer(entity.id, entity);
    if (entity.translationOf) prefer(entity.translationOf, entity);
  }

  return byEndpoint;
};

export const localNeighborhood = (
  focus: Entity,
  entities: Entity[],
  relations: RelationStatement[],
  routes: RouteRecord[],
): GraphView => {
  const publicIds = publicEntityIds(entities);
  const connected = publicRelationsForEntity(focus, relations, publicIds);
  const localizedByEndpoint = localizedEndpointIndex(entities, focus.locale);
  const nodesById = new Map<EntityId, Entity>();
  const addNode = (endpointId: EntityId) => {
    const entity = localizedByEndpoint.get(endpointId);
    if (entity) nodesById.set(entity.id, entity);
  };

  addNode(focus.id);
  if (focus.translationOf) addNode(focus.translationOf);
  connected.forEach((relation) => {
    addNode(relation.subject);
    addNode(relation.object);
  });
  const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
  const localizedEndpointId = (endpointId: EntityId): EntityId =>
    localizedByEndpoint.get(endpointId)?.id || endpointId;
  return {
    id: `local:${focus.id}`,
    kind: "local",
    focus: focus.id,
    nodes: [...nodesById.values()].map((entity) => ({
      id: entity.id,
      type: entity.type,
      title: entity.title,
      route: routeById[entity.id],
      status: entity.status,
      confidence: entity.confidence,
    })),
    edges: connected.map((relation) => ({
      id: relation.id,
      source: localizedEndpointId(relation.subject),
      target: localizedEndpointId(relation.object),
      predicate: relation.predicate,
      label: predicateDefinitions[relation.predicate].label,
      statement: relation.statement,
      confidence: relation.confidence,
    })),
  };
};
