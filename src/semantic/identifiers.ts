import { site } from "../config/site.js";
import { identifierPath } from "../config/routes.js";
import type { Entity } from "../schema/entities.js";

export const identifierUrl = (entity: Entity): string => `${site.origin}${identifierPath(entity)}`;
