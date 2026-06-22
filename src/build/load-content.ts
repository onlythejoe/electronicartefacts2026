import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { entityFrontmatterSchema } from "../schema/validation.js";
import type { Entity } from "../schema/entities.js";

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

const headingsFrom = (body: string): string[] =>
  [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => match[1].trim());

export const loadContent = async (rootDir: string): Promise<Entity[]> => {
  const files = await fg("content/**/*.md", {
    cwd: rootDir,
    absolute: true,
    ignore: ["content/relations/**"],
  });

  const entities: Entity[] = [];
  for (const file of files.sort()) {
    const source = await readFile(file, "utf8");
    const parsed = matter(source);
    const result = entityFrontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      throw new Error(`Invalid entity ${path.relative(rootDir, file)}:\n${result.error.message}`);
    }
    entities.push({
      ...result.data,
      bodyHtml: markdown.render(parsed.content),
      headings: headingsFrom(parsed.content),
    } as Entity);
  }
  return entities;
};
