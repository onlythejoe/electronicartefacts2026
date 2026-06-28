import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const origin = "https://electronicartefacts.com";
const ignoredDirs = new Set([".git", "node_modules"]);
const htmlFiles = [];

const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    const relative = path.relative(rootDir, file);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name) || relative.startsWith("assets/partials")) continue;
      await walk(file);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(file);
  }
};

const first = (html, pattern) => pattern.exec(html)?.[1]?.trim() || "";
const all = (html, pattern) => [...html.matchAll(pattern)].map((match) => match[1]?.trim() || "");
const isNoindex = (robots) => /(^|,)noindex(,|$)/i.test(robots);
const decodeHtml = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#039;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");
const stripTags = (value) => decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

const localPathFromAbsolute = (url) => {
  if (!url.startsWith(origin)) return null;
  const pathname = new URL(url).pathname;
  if (pathname === "/") return "index.html";
  if (pathname.endsWith("/")) return `${pathname.slice(1)}index.html`;
  return pathname.slice(1);
};

const exists = async (relative) => {
  try {
    await access(path.join(rootDir, relative));
    return true;
  } catch {
    return false;
  }
};

await walk(rootDir);

const issues = [];
const indexableCanonicals = new Map();

for (const file of htmlFiles.sort()) {
  const relative = path.relative(rootDir, file);
  const html = await readFile(file, "utf8");
  const lang = first(html, /<html[^>]*\slang="([^"]+)"/i);
  const title = stripTags(first(html, /<title>([\s\S]*?)<\/title>/i));
  const description = decodeHtml(first(html, /<meta\s+name="description"\s+content="([^"]*)"/i));
  const robots = first(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const canonical = first(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const h1s = all(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags);
  const ogTitle = first(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDescription = first(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const ogUrl = first(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
  const ogImage = first(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const twitterCard = first(html, /<meta\s+name="twitter:card"\s+content="([^"]*)"/i);
  const jsonLdCount = all(html, /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi).length;
  const noindex = isNoindex(robots);

  if (!lang) issues.push([relative, "missing html lang"]);
  if (relative.startsWith("fr/") && lang !== "fr") issues.push([relative, `expected lang=fr, got ${lang || "none"}`]);
  if (!relative.startsWith("fr/") && lang && !["en", "fr"].includes(lang)) issues.push([relative, `unexpected lang=${lang}`]);
  if (!title) issues.push([relative, "missing title"]);
  if (!description) issues.push([relative, "missing meta description"]);
  if (!robots) issues.push([relative, "missing robots meta"]);
  if (!canonical) issues.push([relative, "missing canonical"]);

  if (!noindex) {
    if (title.length > 68) issues.push([relative, `title too long (${title.length})`]);
    if (description.length < 70) issues.push([relative, `description too short (${description.length})`]);
    if (description.length > 170) issues.push([relative, `description too long (${description.length})`]);
    if (!h1s.length) issues.push([relative, "indexable page missing h1"]);
    if (h1s.length > 1) issues.push([relative, `indexable page has multiple h1s (${h1s.length})`]);
    if (!canonical.startsWith(origin)) issues.push([relative, `canonical is not absolute site URL: ${canonical}`]);
    if (!ogTitle || !ogDescription || !ogUrl || !ogImage) issues.push([relative, "incomplete Open Graph metadata"]);
    if (!twitterCard) issues.push([relative, "missing twitter card"]);
    if (!jsonLdCount) issues.push([relative, "missing JSON-LD"]);
    indexableCanonicals.set(canonical, [...(indexableCanonicals.get(canonical) || []), relative]);
  }

  if (ogImage?.startsWith(origin)) {
    const local = localPathFromAbsolute(ogImage);
    if (local && !(await exists(local))) issues.push([relative, `og:image local file missing: ${local}`]);
  }
}

for (const [canonical, files] of indexableCanonicals.entries()) {
  if (files.length > 1) issues.push([files.join(", "), `duplicate indexable canonical: ${canonical}`]);
}

const sitemap = await readFile(path.join(rootDir, "sitemap.xml"), "utf8");
const sitemapLocs = new Set(all(sitemap, /<loc>([^<]+)<\/loc>/g));
for (const canonical of indexableCanonicals.keys()) {
  if (!sitemapLocs.has(canonical)) issues.push([canonical, "indexable canonical missing from sitemap"]);
}

const summary = {
  htmlFiles: htmlFiles.length,
  indexablePages: indexableCanonicals.size,
  issues: issues.length,
};

console.log(JSON.stringify({ summary, issues: issues.slice(0, 200) }, null, 2));
if (issues.length) process.exitCode = 1;
