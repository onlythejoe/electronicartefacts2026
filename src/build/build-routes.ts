import { identifierPath, routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";

export interface RouteRecord {
  id: Entity["id"];
  route: string;
  identifier: string;
}

export const buildRoutes = (entities: Entity[]): RouteRecord[] =>
  entities.map((entity) => ({
    id: entity.id,
    route: routeForEntity(entity),
    identifier: identifierPath(entity),
  }));
