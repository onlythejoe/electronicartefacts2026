import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the published runtime provides progressive page and media transitions", async () => {
  const [runtime, styles, home] = await Promise.all([
    readFile("assets/js/app.js", "utf8"),
    readFile("assets/css/app.css", "utf8"),
    readFile("index.html", "utf8"),
  ]);

  assert.match(runtime, /window\.EA_EMBEDDED_INCLUDES/);
  assert.match(runtime, /const initPageTransitions = \(\) =>/);
  assert.match(runtime, /const initMediaReadiness = \(root = document\) =>/);
  assert.match(runtime, /const paintInterval = 1000 \/ \(coarsePointer \? 24 : 30\)/);
  assert.match(runtime, /const maxParticles = coarsePointer \? 64 : 96/);
  assert.match(runtime, /observer\.observe\(butterfly\)/);
  assert.match(styles, /@view-transition\s*\{\s*navigation: auto;/);
  assert.match(styles, /\.ambient-field\s*\{[^}]*contain: strict;/s);
  assert.match(styles, /body\.is-page-leaving > main/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(runtime, /scope\.classList\.add\("has-hero-selection"\)/);
  assert.match(runtime, /event\.key === "Escape"/);
  assert.match(runtime, /if \(!isResearchAtlasGraph\) \{\s*drawNode\(/);
  assert.match(styles, /\.intent-hero\.has-hero-selection/);
  assert.match(home, /assets\/css\/app\.css\?v=85/);
  assert.match(home, /assets\/js\/app\.js\?v=70/);
});
