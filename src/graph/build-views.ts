import type { Entity } from "../schema/entities.js";
import type { RelationStatement } from "../schema/relation.js";
import type { RouteRecord } from "../build/build-routes.js";
import { localNeighborhood } from "./selectors.js";

export const buildGraphViews = (
  entities: Entity[],
  relations: RelationStatement[],
  routes: RouteRecord[],
) => entities.map((entity) => localNeighborhood(entity, entities, relations, routes));
