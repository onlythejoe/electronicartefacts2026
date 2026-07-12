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
  assert.match(template, /vaste-demo\.css\?v=2/);
  assert.doesNotMatch(template, /vaste-demo__traffic/);
  assert.match(template, /data-demo-scene="runtime"/);
  assert.match(template, /data-demo-scene="portable"/);
  assert.match(template, /data-demo-scene="boot"/);
  assert.match(template, /projection pédagogique locale/);
  assert.match(template, /local explanatory projection/);
  assert.match(runtime, /pointerdown/);
  assert.match(runtime, /attachChild/);
  assert.match(runtime, /detachChild/);
  assert.match(runtime, /isDescendant/);
  assert.match(runtime, /parentId/);
  assert.match(runtime, /ResizeObserver/);
  assert.match(runtime, /prefers-reduced-motion/);
  assert.match(styles, /@media \(max-width: 900px\)/);
  assert.match(styles, /@media \(max-width: 720px\)/);
  assert.match(styles, /width: 100vw/);
  assert.match(styles, /touch-action: none/);
});
