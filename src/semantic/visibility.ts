import type { Entity } from "../schema/entities.js";
import type { EntityId, EntityRef } from "../schema/entity.js";
import type { RelationStatement } from "../schema/relation.js";

export const isPublicEntity = (entity: Entity | undefined): entity is Entity =>
  entity !== undefined && entity.visibility === "public" && entity.publicationClass !== "internal";

export const isIndexableEntity = (entity: Entity): boolean =>
  isPublicEntity(entity) &&
  ["canonical", "published"].includes(entity.publicationClass) &&
  Boolean(entity.version.publishedAt);

export const relationEndpointIdsForEntity = (entity: Entity): Set<EntityId> =>
  new Set([entity.id, entity.translationOf].filter((id): id is EntityId => Boolean(id)));

export const publicEntityIds = (entities: Iterable<Entity>): Set<EntityId> => {
  const ids = new Set<EntityId>();
  for (const entity of entities) {
    if (!isPublicEntity(entity)) continue;
    for (const id of relationEndpointIdsForEntity(entity)) ids.add(id);
  }
  return ids;
};

export const relationTouchesEntity = (relation: RelationStatement, entityId: EntityId): boolean =>
  relation.subject === entityId || relation.object === entityId;

export const relationTouchesEntityView = (relation: RelationStatement, entity: Entity): boolean => {
  const endpointIds = relationEndpointIdsForEntity(entity);
  return endpointIds.has(relation.subject) || endpointIds.has(relation.object);
};

export const isPublicRelation = (relation: RelationStatement, publicIds: Set<EntityId>): boolean =>
  relation.visibility === "public" && publicIds.has(relation.subject) && publicIds.has(relation.object);

export const publicRelationsForEntity = (
  entity: Entity,
  relations: RelationStatement[],
  publicIds: Set<EntityId>,
): RelationStatement[] =>
  relations.filter((relation) => relationTouchesEntityView(relation, entity) && isPublicRelation(relation, publicIds));

export const connectedEntityIdForRelation = (entity: Entity, relation: RelationStatement): EntityId => {
  const endpointIds = relationEndpointIdsForEntity(entity);
  const subjectMatches = endpointIds.has(relation.subject);
  const objectMatches = endpointIds.has(relation.object);

  if (subjectMatches && !objectMatches) return relation.object;
  if (objectMatches && !subjectMatches) return relation.subject;
  return relation.subject === entity.id ? relation.object : relation.subject;
};

export const publicRefs = <T extends EntityRef>(refs: T[], byId: Map<string, Entity>): T[] =>
  refs.filter((ref) => isPublicEntity(byId.get(ref.id)));
