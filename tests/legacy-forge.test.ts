import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

test("Forge’s legacy profile remains an independent Rust pipeline with an explicit voice-data handoff", async () => {
  const source = await readFile(path.resolve("src/legacy-data/entities.js"), "utf8");
  const forgeBlock = source.slice(source.indexOf('id: "forge"'), source.indexOf('id: "ea-lightweight-template"'));

  assert.match(forgeBlock, /type: "Internal Rust Production Engine"/);
  assert.match(forgeBlock, /"voice-capture-studio"/);
  assert.match(forgeBlock, /Video → 3D Object/);
  assert.match(forgeBlock, /Voice dataset → voice model/);
  assert.doesNotMatch(forgeBlock, /"vaste"|"palimpsests"|"oraclehub"/);
});

test("Forge’s program surface only lists direct working relationships", async () => {
  const source = await readFile(path.resolve("assets/js/main.js"), "utf8");
  const programBlock = source.slice(source.indexOf("const programSpecificPanels"), source.indexOf("const renderDetailPage"));

  assert.match(programBlock, /const networkItems = \[\.\.\.new Set/);
  assert.doesNotMatch(programBlock, /\.\.\.\(relations\.origin \|\| \[\]\)/);
  assert.doesNotMatch(programBlock, /\.\.\.\(relations\.parent \|\| \[\]\)/);
  assert.match(programBlock, /forgeCapabilities/);
});
