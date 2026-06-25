import { predicateDefinitions } from "../schema/predicates.js";
import type { Entity } from "../schema/entities.js";
import type { EntityId } from "../schema/entity.js";
import type { RelationStatement } from "../schema/relation.js";
import { isPublicEntity } from "../semantic/visibility.js";

const collectEntityRefs = (entity: Entity): EntityId[] => {
  const refs: EntityId[] = [entity.publisher, ...entity.authors.map((item) => item.id)];
  if (entity.contributors) refs.push(...entity.contributors.map((item) => item.id));
  if (entity.type === "project") {
    refs.push(
      ...entity.stakeholders.map((item) => item.id),
      ...entity.outputs.map((item) => item.id),
      ...entity.evidence.map((item) => item.id),
      ...entity.credits.map((item) => item.id),
    );
  }
  if (entity.type === "framework") refs.push(...entity.components.map((item) => item.id));
  if (entity.type === "program") refs.push(...entity.maintainers.map((item) => item.id));
  if (entity.type === "publication") {
    refs.push(...entity.subjects.map((item) => item.id), ...(entity.evidence || []).map((item) => item.id));
  }
  if (entity.type === "collection") {
    refs.push(...entity.curator.map((item) => item.id), ...entity.explicitMembers.map((item) => item.id));
  }
  if (entity.type === "event") {
    refs.push(...entity.participants.map((item) => item.id), ...(entity.result || []).map((item) => item.id));
  }
  return refs;
};

export const validateGraph = (entities: Entity[], relations: RelationStatement[]): void => {
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  if (byId.size !== entities.length) throw new Error("Duplicate entity ID");
  const routeKeys = new Set<string>();
  for (const entity of entities) {
    const routeKey = `${entity.locale}:${entity.type}:${entity.slug.canonical}`;
    if (routeKeys.has(routeKey)) throw new Error(`Duplicate entity route key ${routeKey}`);
    routeKeys.add(routeKey);
    for (const ref of collectEntityRefs(entity)) {
      if (!byId.has(ref)) throw new Error(`${entity.id} references unknown entity ${ref}`);
    }
  }

  const relationIds = new Set<string>();
  const triples = new Set<string>();
  for (const relation of relations) {
    if (relationIds.has(relation.id)) throw new Error(`Duplicate relation ID ${relation.id}`);
    relationIds.add(relation.id);
    const subject = byId.get(relation.subject);
    const object = byId.get(relation.object);
    if (!subject) throw new Error(`${relation.id} references unknown subject ${relation.subject}`);
    if (!object) throw new Error(`${relation.id} references unknown object ${relation.object}`);
    const definition = predicateDefinitions[relation.predicate];
    if (!definition) throw new Error(`${relation.id} uses invalid predicate ${relation.predicate}`);
    if (!definition.allowedSubjects.includes(subject.type)) {
      throw new Error(`${relation.id}: ${subject.type} cannot be subject of ${relation.predicate}`);
    }
    if (!definition.allowedObjects.includes(object.type)) {
      throw new Error(`${relation.id}: ${object.type} cannot be object of ${relation.predicate}`);
    }
    if (relation.subject === relation.object && !definition.symmetric) throw new Error(`${relation.id} is an invalid self-loop`);
    if (definition.requiresSource && !relation.sources?.length) throw new Error(`${relation.id} requires a source`);
    if (relation.visibility === "public" && [subject, object].some((item) => !isPublicEntity(item))) {
      throw new Error(`${relation.id} leaks a non-public entity`);
    }
    const triple = `${relation.subject}|${relation.predicate}|${relation.object}`;
    if (triples.has(triple)) throw new Error(`Duplicate relation triple ${triple}`);
    triples.add(triple);
  }
};
