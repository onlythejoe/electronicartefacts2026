import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the published runtime provides progressive page and media transitions", async () => {
  const [behaviors, flow, editorial, projectRuntime, main, surface, base, styles, flowBundle, editorialBundle, projectBundle, runtimeBundle, graphBundle, searchBundle, styleBundle, editorialStyleBundle, homeStyleBundle, projectStyleBundle, graphStyleBundle, searchStyleBundle, home, project, artefact, publication, canonicalSearch, graph, search] = await Promise.all([
    readFile("assets/js/core/behaviors.js", "utf8"),
    readFile("assets/js/core/flow.js", "utf8"),
    readFile("assets/js/core/editorial.js", "utf8"),
    readFile("assets/js/core/project.js", "utf8"),
    readFile("assets/js/main.js", "utf8"),
    readFile("assets/js/core/surface.js", "utf8"),
    readFile("assets/css/base.css", "utf8"),
    readFile("assets/css/style.css", "utf8"),
    readFile("assets/js/flow.js", "utf8"),
    readFile("assets/js/editorial.js", "utf8"),
    readFile("assets/js/project.js", "utf8"),
    readFile("assets/js/app.js", "utf8"),
    readFile("assets/js/graph.js", "utf8"),
    readFile("assets/js/search.js", "utf8"),
    readFile("assets/css/app.css", "utf8"),
    readFile("assets/css/editorial.css", "utf8"),
    readFile("assets/css/home.css", "utf8"),
    readFile("assets/css/project.css", "utf8"),
    readFile("assets/css/graph.css", "utf8"),
    readFile("assets/css/search.css", "utf8"),
    readFile("index.html", "utf8"),
    readFile("projects/palimpsests/index.html", "utf8"),
    readFile("archive/artefacts/voice-capture-studio-repository/index.html", "utf8"),
    readFile("publications/browser-as-a-local-first-voice-studio/index.html", "utf8"),
    readFile("search/index.html", "utf8"),
    readFile("graph.html", "utf8"),
    readFile("search.html", "utf8"),
  ]);
  const runtime = `${flow}\n${editorial}\n${projectRuntime}\n${behaviors}\n${main}\n${surface}`;
  const sourceStyles = `${base}\n${styles}`;

  assert.match(runtimeBundle, /window\.EA_EMBEDDED_INCLUDES/);
  assert.match(flow, /body\.dataset\.boundFlowRuntime/);
  assert.match(flow, /connection\?\.saveData/);
  assert.match(flow, /link\.rel = "prefetch"/);
  assert.ok(flowBundle.length < 7_000, `critical flow runtime should stay tiny (${flowBundle.length} bytes)`);
  assert.ok(editorialBundle.length < 40_000, `editorial JavaScript should stay route-scoped (${editorialBundle.length} bytes)`);
  assert.ok(projectBundle.length < 180_000, `project JavaScript should stay route-scoped (${projectBundle.length} bytes)`);
  assert.match(editorialBundle, /EA_EDITORIAL_TRANSLATIONS/);
  assert.match(projectBundle, /EA_PROJECT_TRANSLATIONS/);
  assert.match(editorial, /ea:editorial-start-to-interactive/);
  assert.match(flow, /ea_web_vitals/);
  assert.match(runtime, /const initPageTransitions = \(\) =>/);
  assert.match(runtime, /const initMediaReadiness = \(root = document\) =>/);
  assert.match(runtime, /const paintInterval = 1000 \/ \(coarsePointer \? 24 : 30\)/);
  assert.match(runtime, /const maxParticles = coarsePointer \? 64 : 96/);
  assert.match(runtime, /observer\.observe\(butterfly\)/);
  assert.match(runtime, /visibilityObserver\.observe\(experience\)/);
  assert.match(flow, /const initDesktopCursor = \(\) =>/);
  assert.match(flow, /has-desktop-cursor/);
  assert.match(flow, /cursor\.className = "ea-cursor"/);
  assert.match(sourceStyles, /html\.has-desktop-cursor body \*/);
  assert.match(sourceStyles, /cursor:\s*none\s*!important/);
  assert.match(sourceStyles, /\.ea-cursor\s*\{/);
  assert.doesNotMatch(`${behaviors}\n${editorial}`, /ea-cursor|has-desktop-cursor|initDesktopCursor|const initCursor/);
  assert.doesNotMatch(`${editorialBundle}\n${projectBundle}\n${runtimeBundle}\n${graphBundle}\n${searchBundle}`, /ea-cursor|has-desktop-cursor/);
  assert.match(sourceStyles, /@view-transition\s*\{\s*navigation: auto;/);
  assert.match(sourceStyles, /\.ambient-field\s*\{[^}]*contain: strict;/s);
  assert.match(sourceStyles, /body\.is-page-leaving > main/);
  assert.match(sourceStyles, /prefers-reduced-motion: reduce/);
  assert.match(runtime, /scope\.classList\.add\("has-hero-selection"\)/);
  assert.match(runtime, /event\.key === "Escape"/);
  assert.match(runtime, /if \(!isResearchAtlasGraph\) \{\s*drawNode\(/);
  assert.match(sourceStyles, /\.intent-hero\.has-hero-selection/);
  assert.ok(styleBundle.length < 350_000, `published CSS should stay purged and minified (${styleBundle.length} bytes)`);
  assert.ok(editorialStyleBundle.length < 120_000, `editorial CSS should stay route-scoped (${editorialStyleBundle.length} bytes)`);
  assert.ok(homeStyleBundle.length < 180_000, `homepage CSS should stay route-scoped (${homeStyleBundle.length} bytes)`);
  assert.ok(projectStyleBundle.length < 180_000, `project CSS should stay route-scoped (${projectStyleBundle.length} bytes)`);
  assert.ok(graphStyleBundle.length < 120_000, `graph CSS should stay route-scoped (${graphStyleBundle.length} bytes)`);
  assert.ok(searchStyleBundle.length < 140_000, `legacy search CSS should stay route-scoped (${searchStyleBundle.length} bytes)`);
  assert.ok(runtimeBundle.length < 800_000, `default JavaScript should stay route-scoped (${runtimeBundle.length} bytes)`);
  assert.ok(graphBundle.length < 260_000, `graph JavaScript should stay route-scoped (${graphBundle.length} bytes)`);
  assert.ok(searchBundle.length < 260_000, `legacy search JavaScript should stay route-scoped (${searchBundle.length} bytes)`);
  assert.match(home, /assets\/css\/home\.css\?v=4/);
  assert.doesNotMatch(home, /assets\/css\/app\.css/);
  assert.match(home, /assets\/js\/flow\.js\?v=2/);
  assert.match(home, /assets\/js\/app\.js\?v=78/);
  assert.match(home, /\["pointerover","focusin","pointerdown","keydown","touchstart","wheel","scroll"\]/);
  assert.match(home, /data-language-trigger/);
  assert.match(project, /assets\/css\/project\.css\?v=4/);
  assert.match(project, /assets\/js\/project\.js\?v=3/);
  assert.match(project, /assets\/js\/flow\.js\?v=2/);
  assert.doesNotMatch(project, /assets\/(?:css\/app\.css|js\/app\.js)/);
  assert.match(artefact, /assets\/css\/editorial\.css\?v=3/);
  assert.match(artefact, /assets\/js\/editorial\.js\?v=2/);
  assert.match(artefact, /assets\/js\/flow\.js\?v=2/);
  assert.doesNotMatch(artefact, /assets\/js\/app\.js/);
  assert.match(publication, /assets\/js\/editorial\.js\?v=2/);
  assert.match(canonicalSearch, /assets\/js\/editorial\.js\?v=2/);
  assert.doesNotMatch(canonicalSearch, /assets\/js\/app(?:-full)?\.js/);
  assert.match(graph, /assets\/css\/graph\.css\?v=1/);
  assert.match(graph, /assets\/js\/graph\.js\?v=1/);
  assert.doesNotMatch(graph, /assets\/js\/app(?:-full)?\.js/);
  assert.match(search, /assets\/css\/search\.css\?v=1/);
  assert.match(search, /assets\/js\/search\.js\?v=1/);
  assert.doesNotMatch(search, /assets\/js\/app(?:-full)?\.js/);
  assert.match(`${behaviors}\n${main}`, /data-card-image|initDeferredCardMedia/);
});
