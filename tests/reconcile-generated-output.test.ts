import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadContent } from "../src/build/load-content.js";
import {
  generatedOutputFiles,
  loadPreviousPublicEntities,
  removeStaleGeneratedOutputs,
  staleGeneratedOutputFiles,
} from "../src/build/reconcile-generated-output.js";
import type { Entity } from "../src/schema/entities.js";

test("removes only generated files no longer owned by the public manifest", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "electronic-artefacts-reconcile-"));
  try {
    const entities = await loadContent(path.resolve("."));
    const current = entities.find((entity) => entity.id === "ea:concept:graph-runtime")!;
    const previous: Entity = {
      ...current,
      slug: { canonical: "former-graph-runtime" },
    };
    const staleFiles = generatedOutputFiles(root, previous);
    const currentFiles = generatedOutputFiles(root, current);

    for (const file of [...staleFiles, ...currentFiles]) {
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, "generated", { encoding: "utf8", flag: "w" });
    }

    assert.deepEqual(staleGeneratedOutputFiles(root, [previous], [current]), staleFiles);
    const removed = await removeStaleGeneratedOutputs(root, [previous], [current]);
    assert.deepEqual(removed, staleFiles);
    await Promise.all(staleFiles.map((file) => assert.rejects(access(file))));
    await Promise.all(currentFiles.map((file) => assert.doesNotReject(access(file))));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("ignores malformed entries from a previous generated manifest", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "electronic-artefacts-manifest-"));
  try {
    const manifest = path.join(root, "generated/manifest/entities.json");
    await mkdir(path.dirname(manifest), { recursive: true });
    await writeFile(manifest, JSON.stringify([
      { id: "ea:concept:valid", type: "concept", locale: "en", slug: { canonical: "valid" } },
      { id: "ea:concept:invalid", type: "concept", locale: "en", slug: { canonical: "../escape" } },
      { id: "ea:concept:mismatched", type: "project", locale: "en", slug: { canonical: "mismatched" } },
    ]));

    const previous = await loadPreviousPublicEntities(root);
    assert.deepEqual(previous, [{ id: "ea:concept:valid", type: "concept", locale: "en", slug: { canonical: "valid" } }]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
