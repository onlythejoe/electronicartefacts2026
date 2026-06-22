import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { parse } from "yaml";
import { relationSchema } from "../schema/validation.js";
import type { RelationStatement } from "../schema/relation.js";

export const loadRelations = async (rootDir: string): Promise<RelationStatement[]> => {
  const files = await fg("content/relations/*.{yaml,yml}", { cwd: rootDir, absolute: true });
  const relations: RelationStatement[] = [];
  for (const file of files.sort()) {
    const records = parse(await readFile(file, "utf8"));
    if (!Array.isArray(records)) throw new Error(`${path.relative(rootDir, file)} must contain a YAML array`);
    for (const record of records) {
      const result = relationSchema.safeParse(record);
      if (!result.success) {
        throw new Error(`Invalid relation in ${path.relative(rootDir, file)}:\n${result.error.message}`);
      }
      relations.push(result.data as RelationStatement);
    }
  }
  return relations;
};
