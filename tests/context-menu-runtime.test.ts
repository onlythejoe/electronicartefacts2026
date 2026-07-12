import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../assets/js/core/context-menu.js", import.meta.url), "utf8");
const build = await readFile(new URL("../scripts/build-assets.mjs", import.meta.url), "utf8");

test("context menu exposes an extensible semantic action registry", () => {
  assert.match(source, /window\.EA_CONTEXT_MENU = Object\.freeze\(\{ init, register, resolve \}\)/);
  assert.match(source, /kind: selection \? "selection" : graphNode \? "graph-node"/);
  assert.match(source, /data-global-graph-node/);
});

test("context menu preserves native editing and an explicit native-menu escape hatch", () => {
  assert.match(source, /event\.shiftKey \|\| event\.target\.closest\("input, textarea/);
  assert.match(source, /event\.key === "ContextMenu"/);
  assert.match(source, /event\.shiftKey && event\.key === "F10"/);
});

test("context menu source is part of the public asset bundle", () => {
  assert.match(build, /assets\/js\/core\/context-menu\.js/);
});
