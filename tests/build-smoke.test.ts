import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

test("generated canonical pages contain semantic HTML when build output exists", async (context) => {
  const file = path.resolve("knowledge/concepts/graph-runtime/index.html");
  try {
    const html = await readFile(file, "utf8");
    assert.match(html, /<h1[^>]*>Graph Runtime<\/h1>/);
    assert.match(html, /<article[^>]*>[\s\S]*<h2(?:\s[^>]*)?>Definition<\/h2>/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /rel="canonical"/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      context.skip("Run npm run build to generate static output");
      return;
    }
    throw error;
  }
});

test("generated French pilot pages expose localized metadata", async (context) => {
  const file = path.resolve("fr/index.html");
  try {
    const html = await readFile(file, "utf8");
    assert.match(html, /<html lang="fr">/);
    assert.match(html, /<base href="\/" \/>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/electronicartefacts\.com\/fr\/" \/>/);
    assert.match(html, /hreflang="en" href="https:\/\/electronicartefacts\.com\/"/);
    assert.match(html, /hreflang="fr" href="https:\/\/electronicartefacts\.com\/fr\/"/);
    assert.match(html, /<meta property="og:locale" content="fr_FR" \/>/);
    assert.match(html, /data-locale="fr"/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      context.skip("Run npm run build to generate French static output");
      return;
    }
    throw error;
  }
});

test("generated project pages keep machine details secondary and avoid fake telemetry", async (context) => {
  const englishFile = path.resolve("programs/vaste/index.html");
  const frenchFile = path.resolve("fr/projects/vestiges/index.html");
  try {
    const [programHtml, frenchProjectHtml] = await Promise.all([
      readFile(englishFile, "utf8"),
      readFile(frenchFile, "utf8"),
    ]);
    assert.doesNotMatch(programHtml, /128\.4 GB\/s|Live computation field/);
    assert.match(programHtml, /<details class="zone-card record-details">/);
    assert.match(frenchProjectHtml, /<summary>[\s\S]*Détails de la fiche/);
    assert.doesNotMatch(frenchProjectHtml, />See related context<|\b18 useful links\b|<dt>Confidence<\/dt>/);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      context.skip("Run npm run build to generate static output");
      return;
    }
    throw error;
  }
});

test("Vestiges dossier hands product participation to the official Vestiges surface", async (context) => {
  const englishFile = path.resolve("projects/v6/index.html");
  const frenchFile = path.resolve("fr/projects/v6/index.html");
  try {
    const [englishHtml, frenchHtml] = await Promise.all([
      readFile(englishFile, "utf8"),
      readFile(frenchFile, "utf8"),
    ]);
    for (const html of [englishHtml, frenchHtml]) {
      assert.match(html, /href="https:\/\/www\.vestiges\.world\/"/);
      assert.match(html, /href="https:\/\/www\.vestiges\.world\/participer\/"/);
      assert.match(html, /href="mailto:contact@vestiges\.world"/);
      assert.doesNotMatch(html, /future platform for mapping art and craft|future plateforme de cartographie/i);
    }
    assert.match(englishHtml, /The product conversation continues on Vestiges\./);
    assert.match(frenchHtml, /La conversation produit continue sur Vestiges\./);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      context.skip("Run npm run build to generate static output");
      return;
    }
    throw error;
  }
});
