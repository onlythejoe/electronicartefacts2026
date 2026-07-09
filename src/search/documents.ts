import type { Entity, PublicationEntity, ResearchFieldEntity, ResearchQuestionEntity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import type { RouteRecord } from "../build/build-routes.js";
import {
  connectedEntityIdForRelation,
  isPublicEntity,
  publicEntityIds,
  publicRelationsForEntity,
} from "../semantic/visibility.js";

export interface SearchDocument {
  id: Entity["id"];
  locale: Entity["locale"];
  route: string;
  type: Entity["type"];
  format?: PublicationEntity["format"];
  title: string;
  alternateNames: string[];
  definition?: string;
  abstract: string;
  headings: string[];
  body: string;
  tags: string[];
  questions: string[];
  relationLabels: string[];
  relatedEntityIds: string[];
  status: Entity["status"];
  confidence: Entity["confidence"];
  modifiedAt: string;
}

const textFromHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const researchQuestionText = (entity: ResearchQuestionEntity): string =>
  [
    entity.observation,
    entity.problem,
    entity.hypothesis,
    entity.currentUnderstanding,
    entity.result,
    ...(entity.nextSteps || []),
    ...(entity.experiments || []).flatMap((item) => [item.title, item.status, item.summary, item.result]),
    ...(entity.timeline || []).flatMap((item) => [item.date, item.title, item.summary]),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ");

export const buildSearchDocuments = (
  entities: Entity[],
  relations: RelationStatement[],
  routes: RouteRecord[],
): SearchDocument[] => {
  const routeById = Object.fromEntries(routes.map((route) => [route.id, route.route]));
  const publicIds = publicEntityIds(entities);
  return entities
    .filter(isPublicEntity)
    .map((entity) => {
      const connected = publicRelationsForEntity(entity, relations, publicIds);
      return {
        id: entity.id,
        locale: entity.locale,
        route: routeById[entity.id],
        type: entity.type,
        format: entity.type === "publication" ? entity.format : undefined,
        title: entity.title,
        alternateNames: entity.alternateNames || [],
        definition: entity.definition,
        abstract: entity.abstract,
        headings: entity.headings,
        body: [textFromHtml(entity.bodyHtml), entity.type === "researchQuestion" ? researchQuestionText(entity as ResearchQuestionEntity) : ""]
          .filter(Boolean)
          .join(" "),
        tags: entity.tags || [],
        questions: entity.type === "researchField"
          ? (entity as ResearchFieldEntity).questions.map((item) => item.question)
          : entity.type === "researchQuestion"
            ? [entity.title, (entity as ResearchQuestionEntity).hypothesis]
            : [],
        relationLabels: connected.map((relation) => `${relation.predicate} ${relation.statement}`),
        relatedEntityIds: connected.map((relation) => connectedEntityIdForRelation(entity, relation)),
        status: entity.status,
        confidence: entity.confidence,
        modifiedAt: entity.version.modifiedAt,
      };
    });
};
