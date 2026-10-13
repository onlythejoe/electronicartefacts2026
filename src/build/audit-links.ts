import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { site } from "../config/site.js";

export interface LinkIssue { page: string; reference: string; }

const decodeAttribute = (value: string): string => value
  .replace(/&#(x[\da-f]+|\d+);/gi, (_match, number: string) => String.fromCodePoint(
    number.toLowerCase().startsWith("x") ? parseInt(number.slice(1), 16) : parseInt(number, 10),
  ))
  .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&apos;", "'");

export const auditHtmlLinks = async (
  rootDir: string,
  page: string,
  html: string,
  exists: (file: string) => Promise<boolean> = async (file) => {
    try {
      const info = await stat(file);
      return info.isDirectory() ? (await stat(path.join(file, "index.html"))).isFile() : info.isFile();
    } catch { return false; }
  },
): Promise<LinkIssue[]> => {
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  const tags = [...markup.matchAll(/<([a-z][\w:-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)];
  const attributesFor = (tag: string) => [...tag.matchAll(/\b(href|src|poster|data-src|srcset|data-srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)]
    .map((match) => ({ name: match[1]!.toLowerCase(), value: decodeAttribute(match[2] ?? match[3] ?? "") }));
  let base = new URL(page, `${site.origin}/`);
  const baseTag = tags.find((tag) => tag[1]?.toLowerCase() === "base");
  const baseHref = baseTag && attributesFor(baseTag[0]).find((attribute) => attribute.name === "href")?.value;
  if (baseHref) base = new URL(baseHref, base);

  const issues: LinkIssue[] = [];
  for (const tag of tags) {
    if (tag[1]?.toLowerCase() === "base") continue;
    for (const { name, value } of attributesFor(tag[0])) {
      if (!value || value.startsWith("#") || value.startsWith("data:")) continue;
      const references = name.endsWith("srcset") ? value.split(",").map((item) => item.trim().split(/\s+/)[0]!) : [value];
      for (const reference of references) {
        let url: URL;
        try { url = new URL(reference, base); } catch { issues.push({ page, reference }); continue; }
        if (url.origin !== site.origin) continue;
        let file: string;
        try { file = path.resolve(rootDir, `.${decodeURIComponent(url.pathname)}`); }
        catch { issues.push({ page, reference }); continue; }
        if ((file !== rootDir && !file.startsWith(`${rootDir}${path.sep}`)) || !await exists(file)) issues.push({ page, reference });
      }
    }
  }
  return issues;
};

export const auditPublicLinks = async (rootDir: string) => {
  const files = await glob("**/*.html", {
    cwd: rootDir, nodir: true,
    ignore: ["node_modules/**", "assets/partials/**", "docs/**", "src/**", "output/**"],
  });
  const cache = new Map<string, Promise<boolean>>();
  const exists = (file: string): Promise<boolean> => {
    if (!cache.has(file)) cache.set(file, (async () => {
      try {
        const info = await stat(file);
        return info.isDirectory() ? (await stat(path.join(file, "index.html"))).isFile() : info.isFile();
      } catch { return false; }
    })());
    return cache.get(file)!;
  };
  const issues: LinkIssue[] = [];
  for (const page of files.sort()) issues.push(...await auditHtmlLinks(rootDir, page, await readFile(path.join(rootDir, page), "utf8"), exists));
  return { summary: { htmlFiles: files.length, issues: issues.length }, issues };
};
