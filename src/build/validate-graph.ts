import { predicateDefinitions } from "../schema/predicates.js";
import type { Entity } from "../schema/entities.js";
import type { EntityId, Locale } from "../schema/entity.js";
import type { RelationStatement } from "../schema/relation.js";
import { isPublicEntity } from "../semantic/visibility.js";
import { identifierPath, routeForEntity } from "../config/routes.js";

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
  if (entity.type === "artefact" && entity.sourceProject) refs.push(entity.sourceProject.id);
  if (entity.type === "event") {
    refs.push(...entity.participants.map((item) => item.id), ...(entity.result || []).map((item) => item.id));
  }
  return refs;
};

export const validateGraph = (entities: Entity[], relations: RelationStatement[]): void => {
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  if (byId.size !== entities.length) throw new Error("Duplicate entity ID");
  const routes = new Map<string, EntityId>();
  const identifiers = new Map<string, EntityId>();
  const translationLocales = new Map<EntityId, Set<Locale>>();
  for (const entity of entities) {
    const idType = entity.id.split(":")[1];
    if (idType !== entity.type) {
      throw new Error(`${entity.id} ID type ${idType} does not match entity type ${entity.type}`);
    }

    const route = routeForEntity(entity);
    const existingRoute = routes.get(route);
    if (existingRoute) throw new Error(`Duplicate entity route ${route} for ${existingRoute} and ${entity.id}`);
    routes.set(route, entity.id);

    const identifier = identifierPath(entity);
    const existingIdentifier = identifiers.get(identifier);
    if (existingIdentifier) {
      throw new Error(`Duplicate entity identifier ${identifier} for ${existingIdentifier} and ${entity.id}`);
    }
    identifiers.set(identifier, entity.id);

    if (entity.translationOf) {
      const source = byId.get(entity.translationOf);
      if (!source) throw new Error(`${entity.id} translates unknown entity ${entity.translationOf}`);
      if (source.translationOf) {
        throw new Error(`${entity.id} translates translated entity ${entity.translationOf}`);
      }
      if (source.type !== entity.type) {
        throw new Error(`${entity.id} translation type ${entity.type} does not match ${source.type}`);
      }
      if (source.locale === entity.locale) {
        throw new Error(`${entity.id} translation must use a different locale from ${entity.translationOf}`);
      }
      const locales = translationLocales.get(entity.translationOf) || new Set<Locale>();
      if (locales.has(entity.locale)) {
        throw new Error(`${entity.translationOf} has multiple ${entity.locale} translations`);
      }
      locales.add(entity.locale);
      translationLocales.set(entity.translationOf, locales);
    }
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
