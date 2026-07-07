import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://electronicartefacts.com";
const host = new URL(origin).host;
const key = "d6780748-5a16-40e1-a7e3-8849fea962e2";
const keyLocation = `${origin}/${key}.txt`;
const args = process.argv.slice(2);

if (!args.length) {
  console.error("Usage: npm run indexnow:submit -- --all | /changed-page/ [more URLs]");
  process.exit(1);
}

const normalizeUrl = (value) => {
  const url = new URL(value, origin);
  if (url.origin !== origin) throw new Error(`IndexNow URL must belong to ${origin}: ${value}`);
  url.hash = "";
  return url.href;
};

const sitemapUrls = async () => {
  const sitemap = await readFile(path.join(rootDir, "sitemap.xml"), "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
};

const keyFile = (await readFile(path.join(rootDir, `${key}.txt`), "utf8")).trim();
if (keyFile !== key) throw new Error("IndexNow key file does not match the configured key.");

const requestedUrls = args.includes("--all") ? await sitemapUrls() : args;
const urlList = [...new Set(requestedUrls.map(normalizeUrl))];
if (!urlList.length) throw new Error("No URLs were selected for IndexNow submission.");
if (urlList.length > 10_000) throw new Error("IndexNow accepts at most 10,000 URLs per request.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${await response.text()}`);
}

console.log(`Submitted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} to IndexNow (HTTP ${response.status}).`);
