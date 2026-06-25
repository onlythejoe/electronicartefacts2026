import { identifierPath, routeForEntity } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";

export interface RouteRecord {
  id: Entity["id"];
  locale: Entity["locale"];
  route: string;
  identifier: string;
}

export const buildRoutes = (entities: Entity[]): RouteRecord[] =>
  entities.map((entity) => ({
    id: entity.id,
    locale: entity.locale,
    route: routeForEntity(entity),
    identifier: identifierPath(entity),
  }));
