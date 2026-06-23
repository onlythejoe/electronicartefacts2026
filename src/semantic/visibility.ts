import type { Entity } from "../schema/entities.js";
import type { EntityId, EntityRef } from "../schema/entity.js";
import type { RelationStatement } from "../schema/relation.js";

export const isPublicEntity = (entity: Entity | undefined): entity is Entity =>
  entity !== undefined && entity.visibility === "public" && entity.publicationClass !== "internal";

export const isIndexableEntity = (entity: Entity): boolean =>
  isPublicEntity(entity) &&
  ["canonical", "published"].includes(entity.publicationClass) &&
  Boolean(entity.version.publishedAt);

export const publicEntityIds = (entities: Iterable<Entity>): Set<EntityId> =>
  new Set([...entities].filter(isPublicEntity).map((entity) => entity.id));

export const relationTouchesEntity = (relation: RelationStatement, entityId: EntityId): boolean =>
  relation.subject === entityId || relation.object === entityId;

export const isPublicRelation = (relation: RelationStatement, publicIds: Set<EntityId>): boolean =>
  relation.visibility === "public" && publicIds.has(relation.subject) && publicIds.has(relation.object);

export const publicRelationsForEntity = (
  entity: Entity,
  relations: RelationStatement[],
  publicIds: Set<EntityId>,
): RelationStatement[] =>
  relations.filter((relation) => relationTouchesEntity(relation, entity.id) && isPublicRelation(relation, publicIds));

export const publicRefs = <T extends EntityRef>(refs: T[], byId: Map<string, Entity>): T[] =>
  refs.filter((ref) => isPublicEntity(byId.get(ref.id)));
