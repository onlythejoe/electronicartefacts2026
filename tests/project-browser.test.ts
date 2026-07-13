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

test("Palimpsests keeps the transparent portrait on a stable Safari layer at every viewport", async () => {
  const [styles, runtime, layout] = await Promise.all([
    readFile("assets/css/style.css", "utf8"),
    readFile("assets/js/main.js", "utf8"),
    readFile("src/templates/layout.ts", "utf8"),
  ]);

  assert.match(layout, /document\.documentElement\.classList\.add\("is-safari"\)/);
  assert.match(styles, /html\.is-safari \.palimpsests-artist-hero__portrait/);
  assert.match(styles, /\.palimpsests-artist-hero__portrait > img \{[\s\S]*?filter:none;[\s\S]*?animation:none;/);
  assert.match(styles, /\.palimpsests-orbit-nav \.tag,[\s\S]*?-webkit-backdrop-filter:none;/);
  assert.match(runtime, /const lowPowerRuntime = cpuLimited \|\| memoryLimited/);
  assert.match(runtime, /const physicsFrameInterval = lowPowerRuntime \? 22 : 15/);
});

test("Palimpsests publishes Belle as the only open album fragment", async () => {
  const page = await readFile("projects/palimpsests/index.html", "utf8");

  assert.match(page, /data-palimpsests-music/);
  assert.match(page, /class="is-available"[\s\S]*?href="#belle"[\s\S]*?<strong>Belle<\/strong>/);
  assert.match(page, /belle-instrumental-v3\.m4a/);
  assert.match(page, /belle-instrumental-v3\.mp3/);
  assert.match(page, /belle-moon-fragment\.mp4/);
  assert.doesNotMatch(page, /palimpsest-piano-study/);
  assert.match(page, /Working document — arrangement, mix and voice may still change\./);
  assert.match(page, /Qu’est-ce qu’elle est belle/);
});

test("Palimpsests keeps the portrait clear and publishes compact mobile hero actions", async () => {
  const [page, styles] = await Promise.all([
    readFile("projects/palimpsests/index.html", "utf8"),
    readFile("assets/css/style.css", "utf8"),
  ]);

  assert.doesNotMatch(page, /palimpsests-profile-window/);
  assert.match(page, /palimpsests-artist-hero__action-icon/);
  assert.match(styles, /\.palimpsests-artist-hero__actions\{display:flex;align-items:center;gap:\.65rem;width:auto\}/);
  assert.match(styles, /\.palimpsests-artist-hero__actions \.button\{display:grid;place-items:center;box-sizing:border-box;inline-size:3\.25rem;block-size:3\.25rem/);
  assert.match(styles, /aspect-ratio:1;flex:0 0 3\.25rem;[\s\S]*?border-radius:999px!important/);
});
