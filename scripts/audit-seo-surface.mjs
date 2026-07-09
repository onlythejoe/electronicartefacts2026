import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const origin = "https://electronicartefacts.com";
const ignoredDirs = new Set([".git", "node_modules"]);
const htmlFiles = [];
const staticFallbackPages = new Set([
  "work.html", "projects.html", "programs.html", "research.html", "archive.html", "about.html", "contact.html",
  "fr/index.html", "fr/work.html", "fr/projects.html", "fr/programs.html", "fr/research.html", "fr/archive.html", "fr/about.html", "fr/contact.html",
]);

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
const bodyText = (html) => stripTags(
  first(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " "),
);
const wordCount = (value) => value.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length || 0;

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
  const jsonLdBlocks = all(html, /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  const jsonLdCount = jsonLdBlocks.length;
  const noindex = isNoindex(robots);
  const schemaNodes = [];

  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block);
      schemaNodes.push(...(Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed]));
    } catch (error) {
      issues.push([relative, `invalid JSON-LD: ${error.message}`]);
    }
  }
  const schemaTypes = new Set(schemaNodes.flatMap((node) => Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]]).filter(Boolean));

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

  if (relative === "index.html") {
    const levels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
    const words = wordCount(bodyText(html));
    const website = schemaNodes.find((node) => node?.["@type"] === "WebSite");
    const organization = schemaNodes.find((node) => node?.["@type"] === "Organization");
    if (title.length < 50 || title.length > 60) issues.push([relative, `homepage title should be 50-60 characters (${title.length})`]);
    if (description.length < 100 || description.length > 130) issues.push([relative, `homepage description should be 100-130 characters (${description.length})`]);
    if (words < 500) issues.push([relative, `homepage static body is too light (${words} words)`]);
    if (!levels.includes(2)) issues.push([relative, "homepage static body is missing h2 headings"]);
    for (let index = 1; index < levels.length; index += 1) {
      if (levels[index] > levels[index - 1] + 1) {
        issues.push([relative, `homepage heading hierarchy jumps from h${levels[index - 1]} to h${levels[index]}`]);
        break;
      }
    }
    if (!/href="https:\/\/www\.instagram\.com\/electronic\.artefacts\//i.test(html)) {
      issues.push([relative, "homepage static body is missing the verified Instagram profile"]);
    }
    if (!/itemscope\s+itemtype="https:\/\/schema\.org\/Organization"/i.test(html)) {
      issues.push([relative, "homepage is missing Organization microdata"]);
    }
    if (!/itemscope\s+itemtype="https:\/\/schema\.org\/CreativeWork"/i.test(html)) {
      issues.push([relative, "homepage is missing CreativeWork microdata"]);
    }
    if (!schemaTypes.has("Organization") || !schemaTypes.has("WebPage")) {
      issues.push([relative, "homepage JSON-LD is missing Organization or WebPage"]);
    }
    if (!Array.isArray(website?.alternateName) || !website.alternateName.includes("electronicartefacts.com")) {
      issues.push([relative, "homepage WebSite JSON-LD is missing site-name alternatives"]);
    }
    if (organization?.logo?.width !== 1024 || organization?.logo?.height !== 1024 || !organization?.logo?.contentUrl) {
      issues.push([relative, "homepage Organization logo is missing explicit image metadata"]);
    }
    if (!/<meta\s+name="application-name"\s+content="Electronic Artefacts"/i.test(html)) {
      issues.push([relative, "homepage is missing the browser application name"]);
    }
    if (!/<meta\s+property="og:locale:alternate"\s+content="fr_FR"/i.test(html)) {
      issues.push([relative, "homepage is missing the alternate Open Graph locale"]);
    }
  }

  const isPrimaryInternalPage = (/^[^/]+\.html$/.test(relative) || /^fr\/[^/]+\.html$/.test(relative))
    && !relative.endsWith("index.html");
  if (!noindex && isPrimaryInternalPage && canonical.startsWith(origin) && !schemaTypes.has("BreadcrumbList")) {
    issues.push([relative, "primary internal page is missing BreadcrumbList JSON-LD"]);
  }
  if (!noindex && canonical.startsWith(origin) && !["index.html", "fr/index.html"].includes(relative) && !schemaTypes.has("BreadcrumbList")) {
    issues.push([relative, "indexable internal page is missing BreadcrumbList JSON-LD"]);
  }
  if (staticFallbackPages.has(relative)) {
    const words = wordCount(bodyText(html));
    if (words < 170) issues.push([relative, `primary page static fallback is too light (${words} words)`]);
    if (!/<section\s+data-render="[^"]+">[\s\S]*?<h2\b/i.test(html)) {
      issues.push([relative, "primary page is missing a rendered static h2 fallback"]);
    }
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
if (!/<loc>https:\/\/electronicartefacts\.com\/<\/loc>[\s\S]*?<lastmod>2026-07-09<\/lastmod>/.test(sitemap)) {
  issues.push(["sitemap.xml", "homepage lastmod does not reflect the current search-surface update"]);
}

const manifest = JSON.parse(await readFile(path.join(rootDir, "site.webmanifest"), "utf8"));
if (!manifest.icons?.some((icon) => icon.sizes === "192x192") || !manifest.icons?.some((icon) => icon.sizes === "512x512")) {
  issues.push(["site.webmanifest", "manifest is missing 192px or 512px icons"]);
}
if (!Array.isArray(manifest.shortcuts) || manifest.shortcuts.length < 3) {
  issues.push(["site.webmanifest", "manifest is missing primary navigation shortcuts"]);
}

const indexNowKey = "d6780748-5a16-40e1-a7e3-8849fea962e2";
const indexNowKeyFile = (await readFile(path.join(rootDir, `${indexNowKey}.txt`), "utf8")).trim();
if (indexNowKeyFile !== indexNowKey) issues.push([`${indexNowKey}.txt`, "IndexNow key file does not match the configured key"]);

const summary = {
  htmlFiles: htmlFiles.length,
  indexablePages: indexableCanonicals.size,
  issues: issues.length,
};

console.log(JSON.stringify({ summary, issues: issues.slice(0, 200) }, null, 2));
if (issues.length) process.exitCode = 1;
