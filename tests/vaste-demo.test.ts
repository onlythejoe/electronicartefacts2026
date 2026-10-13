import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the VASTE dossier publishes a responsive interactive graph surface", async () => {
  const [template, runtime, styles] = await Promise.all([
    readFile("src/templates/entity-page.ts", "utf8"),
    readFile("assets/js/vaste-demo.js", "utf8"),
    readFile("assets/css/vaste-demo.css", "utf8"),
  ]);

  assert.match(template, /data-vaste-demo/);
  assert.match(template, /vaste-demo\.css\?v=3/);
  assert.match(template, /vaste-demo\.js\?v=4/);
  assert.doesNotMatch(template, /vaste-demo__traffic/);
  assert.match(template, /data-demo-scene="runtime"/);
  assert.match(template, /data-demo-scene="portable"/);
  assert.match(template, /data-demo-scene="boot"/);
  assert.match(template, /data-demo-selection-properties/);
  assert.match(template, /data-demo-selection-surface/);
  assert.match(template, /data-demo-selection-environment/);
  assert.match(template, /data-demo-selection-extensions/);
  assert.match(template, /data-demo-selection-ties-list/);
  assert.match(template, /data-demo-selection-actions/);
  assert.match(template, /projection pédagogique locale/);
  assert.match(template, /local explanatory projection/);
  assert.match(runtime, /pointerdown/);
  assert.match(runtime, /attachChild/);
  assert.match(runtime, /detachChild/);
  assert.match(runtime, /isDescendant/);
  assert.match(runtime, /parentId/);
  assert.match(runtime, /ResizeObserver/);
  assert.match(runtime, /system:ea:root/);
  assert.doesNotMatch(runtime, /\["[^"]+", "[^"]+", "(?:extension|action|surface|environment)"/);
  assert.match(runtime, /\["vertex:cognition", "Advisory Cognition", "vertex"/);
  assert.match(runtime, /\["vertex:world-model", "Situated World Model", "vertex"/);
  assert.match(runtime, /\["vertex:public-knowledge", "Public Knowledge", "vertex"/);
  assert.match(runtime, /world-model:delta\.ingest · running/);
  assert.match(runtime, /knowledge:publish · available/);
  assert.match(runtime, /const hasKernel = !node\.id\.startsWith\("system:"\)/);
  assert.match(runtime, /facts: raw\[8\]/);
  assert.match(runtime, /prefers-reduced-motion/);
  assert.match(styles, /@media \(max-width: 900px\)/);
  assert.match(styles, /@media \(max-width: 720px\)/);
  assert.match(styles, /width: 100vw/);
  assert.match(styles, /touch-action: none/);
  assert.match(styles, /height: clamp\(460px, 126vw, 540px\)/);
});

test("VASTE navigation anchors resolve in both languages and preserve heading permalinks", async () => {
  for (const prefix of ["", "fr/"]) {
    const html = await readFile(`${prefix}programs/vaste/index.html`, "utf8");
    const nav = html.match(/<nav class="vaste-console__nav"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    const links = [...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
    assert.equal(links.length, 7);
    assert.ok(links.every((id) => ids.has(id)), `${prefix}VASTE dossier has broken navigation`);
    assert.ok(ids.has(prefix ? "modele-runtime" : "runtime-model"));
    assert.ok(ids.has(prefix ? "registre-de-preuves" : "validation-record"));
    const controls = html.match(/<div class="vaste-demo__scenes"[\s\S]*?<\/div>/)?.[0];
    assert.ok(controls);
    assert.match(controls, /role="group"/);
    assert.equal([...controls.matchAll(/aria-pressed="(?:true|false)"/g)].length, 3);
    assert.doesNotMatch(controls, /role="tab"|aria-selected/);
  }
});
