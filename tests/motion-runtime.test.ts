import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the published runtime provides progressive page and media transitions", async () => {
  const [behaviors, flow, main, surface, base, styles, flowBundle, runtimeBundle, fullRuntimeBundle, styleBundle, homeStyleBundle, projectStyleBundle, home, project, graph, search] = await Promise.all([
    readFile("assets/js/core/behaviors.js", "utf8"),
    readFile("assets/js/core/flow.js", "utf8"),
    readFile("assets/js/main.js", "utf8"),
    readFile("assets/js/core/surface.js", "utf8"),
    readFile("assets/css/base.css", "utf8"),
    readFile("assets/css/style.css", "utf8"),
    readFile("assets/js/flow.js", "utf8"),
    readFile("assets/js/app.js", "utf8"),
    readFile("assets/js/app-full.js", "utf8"),
    readFile("assets/css/app.css", "utf8"),
    readFile("assets/css/home.css", "utf8"),
    readFile("assets/css/project.css", "utf8"),
    readFile("index.html", "utf8"),
    readFile("projects/palimpsests/index.html", "utf8"),
    readFile("graph.html", "utf8"),
    readFile("search.html", "utf8"),
  ]);
  const runtime = `${flow}\n${behaviors}\n${main}\n${surface}`;
  const sourceStyles = `${base}\n${styles}`;

  assert.match(runtimeBundle, /window\.EA_EMBEDDED_INCLUDES/);
  assert.match(flow, /body\.dataset\.boundFlowRuntime/);
  assert.match(flow, /connection\?\.saveData/);
  assert.match(flow, /link\.rel = "prefetch"/);
  assert.ok(flowBundle.length < 5_000, `critical flow runtime should stay tiny (${flowBundle.length} bytes)`);
  assert.match(runtime, /const initPageTransitions = \(\) =>/);
  assert.match(runtime, /const initMediaReadiness = \(root = document\) =>/);
  assert.match(runtime, /const paintInterval = 1000 \/ \(coarsePointer \? 24 : 30\)/);
  assert.match(runtime, /const maxParticles = coarsePointer \? 64 : 96/);
  assert.match(runtime, /observer\.observe\(butterfly\)/);
  assert.match(sourceStyles, /@view-transition\s*\{\s*navigation: auto;/);
  assert.match(sourceStyles, /\.ambient-field\s*\{[^}]*contain: strict;/s);
  assert.match(sourceStyles, /body\.is-page-leaving > main/);
  assert.match(sourceStyles, /prefers-reduced-motion: reduce/);
  assert.match(runtime, /scope\.classList\.add\("has-hero-selection"\)/);
  assert.match(runtime, /event\.key === "Escape"/);
  assert.match(runtime, /if \(!isResearchAtlasGraph\) \{\s*drawNode\(/);
  assert.match(sourceStyles, /\.intent-hero\.has-hero-selection/);
  assert.ok(styleBundle.length < 350_000, `published CSS should stay purged and minified (${styleBundle.length} bytes)`);
  assert.ok(homeStyleBundle.length < 80_000, `homepage CSS should stay route-scoped (${homeStyleBundle.length} bytes)`);
  assert.ok(projectStyleBundle.length < 180_000, `project CSS should stay route-scoped (${projectStyleBundle.length} bytes)`);
  assert.ok(runtimeBundle.length < 800_000, `default JavaScript should stay route-scoped (${runtimeBundle.length} bytes)`);
  assert.ok(fullRuntimeBundle.length < 1_000_000, `full JavaScript should stay minified (${fullRuntimeBundle.length} bytes)`);
  assert.match(home, /assets\/css\/home\.css\?v=1/);
  assert.match(home, /assets\/css\/app\.css\?v=88/);
  assert.match(home, /assets\/js\/flow\.js\?v=1/);
  assert.match(home, /assets\/js\/app\.js\?v=72/);
  assert.match(project, /assets\/css\/project\.css\?v=1/);
  assert.match(graph, /assets\/js\/app-full\.js\?v=72/);
  assert.match(search, /assets\/js\/app-full\.js\?v=72/);
});
