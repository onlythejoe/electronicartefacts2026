import type { Entity, ResearchQuestionEntity } from "../schema/entities.js";
import type { EntityRef, EntityId } from "../schema/entity.js";
import type { RelationPredicate, RelationStatement } from "../schema/relation.js";
import { isPublicEntity } from "../semantic/visibility.js";

const slugFromId = (id: EntityId): string => id.split(":").at(-1) || id;

const predicateSlug = (predicate: RelationPredicate): string =>
  predicate.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const relationIdFor = (
  question: ResearchQuestionEntity,
  predicate: RelationPredicate,
  target: Entity,
  reverse = false,
): `ear:${string}` => {
  const left = reverse ? slugFromId(target.id) : question.slug.canonical;
  const right = reverse ? question.slug.canonical : slugFromId(target.id);
  return `ear:${left}-${predicateSlug(predicate)}-${right}`;
};

const existingTripleKey = (relation: Pick<RelationStatement, "subject" | "predicate" | "object">): string =>
  `${relation.subject}|${relation.predicate}|${relation.object}`;

const resolveRefs = (
  refs: EntityRef[] | undefined,
  byId: Map<EntityId, Entity>,
): Entity[] => (refs || [])
  .map((ref) => byId.get(ref.id))
  .filter(isPublicEntity);

export const deriveResearchQuestionRelations = (
  entities: Entity[],
  authoredRelations: RelationStatement[],
): RelationStatement[] => {
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const usedIds = new Set(authoredRelations.map((relation) => relation.id));
  const usedTriples = new Set(authoredRelations.map(existingTripleKey));
  const derived: RelationStatement[] = [];

  const add = (
    question: ResearchQuestionEntity,
    predicate: RelationPredicate,
    target: Entity,
    statement: string,
    options: { reverse?: boolean } = {},
  ) => {
    const relation: RelationStatement = {
      id: relationIdFor(question, predicate, target, options.reverse),
      subject: options.reverse ? target.id : question.id,
      predicate,
      object: options.reverse ? question.id : target.id,
      statement,
      confidence: question.confidence,
      validFrom: question.started,
      createdAt: question.started,
      reviewedAt: question.updated,
      visibility: "public",
    };
    const triple = existingTripleKey(relation);
    if (usedIds.has(relation.id) || usedTriples.has(triple)) return;
    usedIds.add(relation.id);
    usedTriples.add(triple);
    derived.push(relation);
  };

  for (const entity of entities) {
    if (entity.type !== "researchQuestion" || entity.translationOf || !isPublicEntity(entity)) continue;
    const question = entity;
    const implementationTargets = [
      ...resolveRefs(question.relatedProjects, byId),
      ...resolveRefs(question.relatedSoftware, byId),
    ];
    for (const target of implementationTargets) {
      add(
        question,
        "implementedBy",
        target,
        `${target.title} is listed as a current software or project answer for the research question "${question.title}".`,
      );
    }

    for (const target of resolveRefs(question.relatedConcepts, byId)) {
      add(
        question,
        "appliesConcept",
        target,
        `The research question "${question.title}" applies ${target.title} as part of its current model.`,
      );
    }

    for (const target of resolveRefs(question.relatedTechnologies, byId)) {
      add(
        question,
        "usesTechnology",
        target,
        `The research question "${question.title}" uses ${target.title} as a relevant technical reference.`,
      );
    }

    for (const target of resolveRefs(question.relatedArticles, byId)) {
      add(
        question,
        "documents",
        target,
        `${target.title} documents context, evidence or vocabulary for the research question "${question.title}".`,
        { reverse: true },
      );
    }

    for (const target of resolveRefs(question.relatedCollections, byId)) {
      add(
        question,
        "memberOfCollection",
        target,
        `The research question "${question.title}" belongs to the ${target.title} collection for editorial navigation.`,
      );
    }
  }

  return derived;
};

export const withDerivedRelations = (
  entities: Entity[],
  authoredRelations: RelationStatement[],
): RelationStatement[] => [
  ...authoredRelations,
  ...deriveResearchQuestionRelations(entities, authoredRelations),
];
