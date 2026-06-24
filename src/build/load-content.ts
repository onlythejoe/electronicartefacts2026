import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import MarkdownIt from "markdown-it";
import { parse as parseYaml } from "yaml";
import { entityFrontmatterSchema } from "../schema/validation.js";
import type { Entity } from "../schema/entities.js";
import { headingItemsFromMarkdown } from "../semantic/heading-ids.js";

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
const defaultHeadingOpen = markdown.renderer.rules.heading_open
  || ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options));

markdown.renderer.rules.heading_open = (tokens, index, options, env, self) => {
  const queue = (env as { headingIdQueue?: string[] }).headingIdQueue;
  const id = queue?.shift();
  if (id) tokens[index].attrSet("id", id);
  return defaultHeadingOpen(tokens, index, options, env, self);
};

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
    const headingItems = headingItemsFromMarkdown(parsed.content);
    entities.push({
      ...result.data,
      bodyHtml: markdown.render(parsed.content, { headingIdQueue: headingItems.map((heading) => heading.id) }),
      headings: headingItems.map((heading) => heading.title),
      headingItems,
    } as Entity);
  }
  return entities;
};
