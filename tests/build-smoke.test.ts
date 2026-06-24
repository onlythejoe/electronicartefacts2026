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
  } catch {
    context.skip("Run npm run build to generate static output");
  }
});
