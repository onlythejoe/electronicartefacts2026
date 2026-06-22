import type { Entity, PublicationEntity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import { renderEntityPage } from "./entity-page.js";

export const renderPublicationPage = (
  entity: PublicationEntity,
  relations: RelationStatement[],
  byId: Map<string, Entity>,
  routeById: Record<string, string>,
): string => renderEntityPage(entity, relations, byId, routeById);
