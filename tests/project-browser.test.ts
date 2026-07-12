import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("project browsing keeps the newest view capped at three releases", async () => {
  const runtime = await readFile("assets/js/main.js", "utf8");

  assert.match(
    runtime,
    /const newestIds = new Set\(projects\s*\.filter\(\(item\) => item\.temporality\?\.releaseDate\)\s*\.slice\(0, 3\)/,
  );
  assert.match(runtime, /data-project-filter="\$\{esc\(filter\.id\)\}"/);
  assert.match(runtime, /data-project-result="\$\{esc\(item\.id\)\}"/);
  assert.match(runtime, /data-project-node="\$\{esc\(item\.id\)\}"/);
});

test("project browsing publishes responsive graph, results and full-grid styles", async () => {
  const styles = await readFile("assets/css/style.css", "utf8");

  assert.match(styles, /\.project-browser\s*\{/);
  assert.match(styles, /\.project-filter-results__grid/);
  assert.match(styles, /\.all-projects__grid/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 48rem\)[\s\S]*?\.project-browser/);
});
