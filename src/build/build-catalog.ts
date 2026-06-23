import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import type { RouteRecord } from "./build-routes.js";
import { isPublicEntity, isIndexableEntity } from "../semantic/visibility.js";

export { isPublicEntity, isIndexableEntity };

export const buildCatalog = (entities: Entity[], relations: RelationStatement[], routes: RouteRecord[]) => {
  const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
  const publicEntities = entities.filter(isPublicEntity);
  const publicIds = new Set(publicEntities.map((entity) => entity.id));
  return {
    schemaVersion: "1.0.0",
    entities: publicEntities.map((entity) => ({
      id: entity.id,
      legacyId: entity.id.split(":").at(-1),
      kind: entity.type,
      type: entity.type,
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
      temporality: {
        creationDate: entity.version.createdAt,
        lastUpdated: entity.version.modifiedAt,
        releaseDate: entity.version.publishedAt || "",
        creationYear: entity.version.createdAt.slice(0, 4),
      },
    })),
    relations: relations.filter((relation) =>
      relation.visibility === "public" && publicIds.has(relation.subject) && publicIds.has(relation.object)),
    routes: routeById,
  };
};
