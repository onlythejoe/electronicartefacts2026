import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

test("legacy data sources remain outside the published assets and the runtime excludes non-public records", async () => {
  await assert.rejects(access(path.resolve("assets/js/data")), { code: "ENOENT" });

  for (const file of ["app.js", "home.js"]) {
    const runtime = await readFile(path.resolve(`assets/js/${file}`), "utf8");
    assert.doesNotMatch(runtime, /\bvisibility\s*:\s*["'](?:internal|restricted)["']/);
  }
});

test("both homepages load a smaller dedicated runtime and retain their static hero", async () => {
  const runtime = await readFile("assets/js/home.js", "utf8");
  assert.ok(Buffer.byteLength(runtime) < 600_000, "homepage runtime exceeds its byte budget");
  for (const file of ["index.html", "fr/index.html"]) {
    const html = await readFile(file, "utf8");
    assert.match(html, /\/assets\/js\/home\.js\?v=/);
    assert.doesNotMatch(html, /\/assets\/js\/app\.js\?v=/);
    assert.match(html, /data-render="home-hero" data-runtime-static="true"/);
  }
});
