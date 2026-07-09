import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import type { RouteRecord } from "./build-routes.js";
import { isPublicEntity, isIndexableEntity } from "../semantic/visibility.js";

export { isPublicEntity, isIndexableEntity };

export const buildCatalog = (entities: Entity[], relations: RelationStatement[], routes: RouteRecord[]) => {
  const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
  const publicEntities = entities.filter(isPublicEntity);
  const publicIds = new Set(publicEntities.map((entity) => entity.id));
  const publicRoutes = Object.fromEntries(
    routes.filter((route) => publicIds.has(route.id)).map((route) => [route.id, route.route]),
  );
  const compactRefs = (refs?: Array<{ id: string; label?: string }>) =>
    (refs || []).map((ref) => ({ id: ref.id, label: ref.label }));
  const researchQuestionFields = (entity: Entity) => entity.type === "researchQuestion"
    ? {
        started: entity.started,
        updated: entity.updated,
        priority: entity.priority,
        homepage: entity.homepage,
        observation: entity.observation,
        problem: entity.problem,
        hypothesis: entity.hypothesis,
        currentUnderstanding: entity.currentUnderstanding,
        experiments: entity.experiments || [],
        result: entity.result,
        nextSteps: entity.nextSteps || [],
        relatedProjects: compactRefs(entity.relatedProjects),
        relatedSoftware: compactRefs(entity.relatedSoftware),
        relatedArticles: compactRefs(entity.relatedArticles),
        relatedCollections: compactRefs(entity.relatedCollections),
        relatedConcepts: compactRefs(entity.relatedConcepts),
        relatedTechnologies: compactRefs(entity.relatedTechnologies),
        relatedRepositories: entity.relatedRepositories || [],
        timeline: entity.timeline || [],
      }
    : {};
  return {
    schemaVersion: "1.0.0",
    entities: publicEntities.map((entity) => ({
      id: entity.id,
      legacyId: entity.id.split(":").at(-1),
      kind: entity.type,
      type: entity.type,
      locale: entity.locale,
      translationKey: entity.translationKey,
      translationOf: entity.translationOf,
      title: entity.title,
      subtitle: entity.subtitle,
      summary: entity.abstract,
      description: entity.description,
      definition: entity.definition,
      status: entity.status,
      maturity: entity.maturity,
      confidence: entity.confidence,
      visibility: entity.visibility,
      publicationClass: entity.publicationClass,
      tags: entity.tags || [],
      discipline: entity.disciplines || [],
      route: routeById[entity.id],
      identifier: routes.find((route) => route.id === entity.id)?.identifier,
      ...researchQuestionFields(entity),
      temporality: {
        creationDate: entity.version.createdAt,
        lastUpdated: entity.version.modifiedAt,
        releaseDate: entity.version.publishedAt || "",
        creationYear: entity.version.createdAt.slice(0, 4),
      },
    })),
    relations: relations.filter((relation) =>
      relation.visibility === "public" && publicIds.has(relation.subject) && publicIds.has(relation.object)),
    routes: publicRoutes,
  };
};
