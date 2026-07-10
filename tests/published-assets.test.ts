import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

test("legacy data sources remain outside the published assets and the runtime excludes non-public records", async () => {
  await assert.rejects(access(path.resolve("assets/js/data")), { code: "ENOENT" });

  const runtime = await readFile(path.resolve("assets/js/app.js"), "utf8");
  assert.doesNotMatch(runtime, /\bvisibility\s*:\s*["'](?:internal|restricted)["']/);
});
