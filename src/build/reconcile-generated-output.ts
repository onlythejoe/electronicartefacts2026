import { readFile, rm, rmdir } from "node:fs/promises";
import path from "node:path";
import { identifierPath, routeByType, routeForEntity } from "../config/routes.js";
import { graphNeighborhoodRoute } from "../graph/paths.js";
import type { Entity } from "../schema/entities.js";
import { routeToFile } from "./write-output.js";

type GeneratedEntity = Pick<Entity, "id" | "type" | "slug" | "locale">;

const manifestPath = "generated/manifest/entities.json";

const isGeneratedEntity = (value: unknown): value is GeneratedEntity => {
  if (!value || typeof value !== "object") return false;
  const entity = value as Record<string, unknown>;
  return typeof entity.id === "string"
    && typeof entity.type === "string" && entity.type in routeByType
    && (entity.locale === "en" || entity.locale === "fr")
    && entity.id.startsWith(`ea:${entity.type}:`)
    && Boolean(entity.slug
      && typeof entity.slug === "object"
      && typeof (entity.slug as Record<string, unknown>).canonical === "string"
      && /^[a-z0-9][a-z0-9-]*$/.test((entity.slug as Record<string, unknown>).canonical as string));
};

export const loadPreviousPublicEntities = async (rootDir: string): Promise<GeneratedEntity[]> => {
  try {
    const value: unknown = JSON.parse(await readFile(path.join(rootDir, manifestPath), "utf8"));
    return Array.isArray(value) ? value.filter(isGeneratedEntity) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw new Error(`Cannot read ${manifestPath}: ${(error as Error).message}`);
  }
};

export const generatedOutputFiles = (rootDir: string, entity: GeneratedEntity): string[] => {
  const typedEntity = entity as Entity;
  const identifierDirectory = identifierPath(typedEntity).replace(/^\/|\/$/g, "");
  return [
    routeToFile(rootDir, routeForEntity(typedEntity)),
    path.join(rootDir, identifierDirectory, "index.html"),
    path.join(rootDir, identifierDirectory, "index.json"),
    path.join(rootDir, identifierDirectory, "index.jsonld"),
    path.join(rootDir, graphNeighborhoodRoute(typedEntity).replace(/^\//, "")),
  ];
};

export const staleGeneratedOutputFiles = (
  rootDir: string,
  previousEntities: GeneratedEntity[],
  currentEntities: GeneratedEntity[],
): string[] => {
  const currentFiles = new Set(currentEntities.flatMap((entity) => generatedOutputFiles(rootDir, entity)));
  return [...new Set(previousEntities.flatMap((entity) => generatedOutputFiles(rootDir, entity)))]
    .filter((file) => !currentFiles.has(file));
};

export const removeStaleGeneratedOutputs = async (
  rootDir: string,
  previousEntities: GeneratedEntity[],
  currentEntities: GeneratedEntity[],
): Promise<string[]> => {
  const staleFiles = staleGeneratedOutputFiles(rootDir, previousEntities, currentEntities);
  for (const file of staleFiles) {
    await rm(file, { force: true });
    await rmdir(path.dirname(file)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT" && error.code !== "ENOTEMPTY") throw error;
    });
  }
  return staleFiles;
};
