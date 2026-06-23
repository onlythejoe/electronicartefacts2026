import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { loadContent } from "../src/build/load-content.js";
import { metadataFor } from "../src/seo/metadata.js";
import { buildSitemap } from "../src/seo/sitemaps.js";
import { jsonLdFor } from "../src/semantic/jsonld.js";

test("generates canonical metadata and JSON-LD", async () => {
  const entities = await loadContent(path.resolve("."));
  for (const entity of entities) {
    const metadata = metadataFor(entity);
    assert.ok(metadata.canonicalUrl.startsWith("https://electronicartefacts.com/"));
    assert.match(metadata.robots, /^index,follow/);
    const jsonLd = jsonLdFor(entity);
    assert.equal(jsonLd["@context"], "https://schema.org");
    assert.ok(jsonLd["@graph"].length >= 2);
  }
});

test("sitemap excludes noindex generated search route", async () => {
  const entities = await loadContent(path.resolve("."));
  const sitemap = buildSitemap(entities);

  assert.doesNotMatch(sitemap, /https:\/\/electronicartefacts\.com\/search\//);
});
