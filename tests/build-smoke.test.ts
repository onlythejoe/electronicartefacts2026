import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

test("generated canonical pages contain semantic HTML when build output exists", async (context) => {
  const file = path.resolve("knowledge/concepts/graph-runtime/index.html");
  try {
    const html = await readFile(file, "utf8");
    assert.match(html, /<h1[^>]*>Graph Runtime<\/h1>/);
    assert.match(html, /<article[^>]*>[\s\S]*<h2(?:\s[^>]*)?>Definition<\/h2>/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /rel="canonical"/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      context.skip("Run npm run build to generate static output");
      return;
    }
    throw error;
  }
});

test("generated French pilot pages expose localized metadata", async (context) => {
  const file = path.resolve("fr/index.html");
  try {
    const html = await readFile(file, "utf8");
    assert.match(html, /<html lang="fr">/);
    assert.match(html, /<base href="\/" \/>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/electronicartefacts\.com\/fr\/" \/>/);
    assert.match(html, /hreflang="en" href="https:\/\/electronicartefacts\.com\/"/);
    assert.match(html, /hreflang="fr" href="https:\/\/electronicartefacts\.com\/fr\/"/);
    assert.match(html, /<meta property="og:locale" content="fr_FR" \/>/);
    assert.match(html, /data-locale="fr"/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      context.skip("Run npm run build to generate French static output");
      return;
    }
    throw error;
  }
});
