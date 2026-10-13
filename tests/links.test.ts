import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditHtmlLinks } from "../src/build/audit-links.js";

test("link auditing resolves French base URLs, directory routes and URL state", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ea-links-"));
  try {
    await mkdir(path.join(root, "projects/example"), { recursive: true });
    await writeFile(path.join(root, "projects/example/index.html"), "");
    await writeFile(path.join(root, "work.html"), '<section id="details"></section>');
    await writeFile(path.join(root, "index.html"), '<main id="main"></main>');
    const issues = await auditHtmlLinks(root, "fr/index.html", `
      <base href="/" /><a href="./work.html?q=graph&amp;view=all#details">Work</a>
      <a href="/projects/example/">Project</a><a href="https://example.com/">External</a>
      <a href="mailto:studio@example.com">Email</a><a href="#main">Skip</a>
      <script>const example = '<a href="/not-a-link">';</script>
    `);
    assert.deepEqual(issues, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("link auditing catches missing navigation, deferred images and responsive candidates", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ea-links-"));
  try {
    await writeFile(path.join(root, "existing.webp"), "");
    const issues = await auditHtmlLinks(root, "index.html", `
      <a href="/missing.html">Missing</a><img data-src="/deferred.webp" />
      <img srcset="/existing.webp 400w, /missing.webp 800w" />
    `);
    assert.deepEqual(issues.map((issue) => issue.reference), ["/missing.html", "/deferred.webp", "/missing.webp"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("link auditing accepts escaped filenames and ignores comment examples", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ea-links-"));
  try {
    await writeFile(path.join(root, "A&B.svg"), "");
    assert.deepEqual(await auditHtmlLinks(root, "index.html", `<img src="/A&amp;B.svg" /><!-- <img src="/missing.svg" /> -->`), []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("link auditing checks local, cross-page, encoded and legacy named anchors", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ea-anchors-"));
  const html = `<main id="main"></main><a href="#main">Skip</a><a href="#missing">Broken</a>
    <a href="/guide/#caf%C3%A9">Encoded</a><a href="/guide/#old">Legacy</a>
    <a href="/guide/#absent">Broken target</a><a href="#main:~:text=Hello">Text</a>
    <a href="#:~:text=Hello">Text only</a><span data-entry-id="missing"></span>
    <script>const example = '<span id="missing">';</script>`;
  try {
    await mkdir(path.join(root, "guide"));
    await writeFile(path.join(root, "guide/index.html"), '<h2 id="café">Cafe</h2><a name="old"></a>');
    await writeFile(path.join(root, "index.html"), html);
    const issues = await auditHtmlLinks(root, "index.html", html);
    assert.deepEqual(issues.map((issue) => issue.reference), ["#missing", "/guide/#absent"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});
