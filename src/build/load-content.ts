import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import MarkdownIt from "markdown-it";
import { parse as parseYaml } from "yaml";
import { entityFrontmatterSchema } from "../schema/validation.js";
import type { Entity } from "../schema/entities.js";

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });

const headingsFrom = (body: string): string[] =>
  [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) => match[1].trim());

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const parseFrontmatter = (source: string, file: string, rootDir: string): { data: unknown; content: string } => {
  const match = frontmatterPattern.exec(source);
  if (!match) {
    throw new Error(`Missing frontmatter in ${path.relative(rootDir, file)}`);
  }
  return {
    data: parseYaml(match[1] || "") || {},
    content: source.slice(match[0].length),
  };
};

export const loadContent = async (rootDir: string): Promise<Entity[]> => {
  const files = await fg("content/**/*.md", {
    cwd: rootDir,
    absolute: true,
    ignore: ["content/relations/**"],
  });

  const entities: Entity[] = [];
  for (const file of files.sort()) {
    const source = await readFile(file, "utf8");
    const parsed = parseFrontmatter(source, file, rootDir);
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
