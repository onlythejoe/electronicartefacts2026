import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import fg from "fast-glob";

test("the canonical generated catalog overrides migrated legacy records", async () => {
  const source = await readFile(path.resolve("assets/js/catalog.js"), "utf8");
  const window: Record<string, unknown> = {
    location: { pathname: "/" },
    EA_TAXONOMIES: {},
    EA_RELATIONS: { graph: [] },
    EA_TIMELINES: [],
    EA_ACTIVITY: [],
    EA_COLLECTIONS: [],
    EA_ENTITIES: {
      programs: [
        {
          id: "vaste",
          kind: "program",
          title: "Legacy VASTE",
          subtitle: "Legacy runtime",
          status: "legacy-status",
          maturity: "legacy-maturity",
          confidence: "speculative",
          visibility: "public",
          domain: "Preserved presentation field",
        },
        {
          id: "oreth-program",
          canonicalId: "ea:program:oreth",
          kind: "program",
          title: "Legacy ORETH program",
          status: "prototype",
          visibility: "public",
        },
      ],
      artists: [{ id: "oreth", kind: "artist", title: "ORETH artist", status: "active", visibility: "public" }],
    },
    EA_PUBLIC_CATALOG: {
      entities: [
        {
          id: "ea:program:vaste",
          legacyId: "vaste",
          kind: "program",
          type: "program",
          locale: "en",
          title: "VASTE",
          subtitle: "Canonical runtime",
          summary: "Canonical VASTE summary",
          description: "Canonical VASTE description",
          status: "development",
          maturity: "experimental",
          confidence: "validated",
          visibility: "public",
          publicationClass: "canonical",
          route: "/programs/vaste/",
          tags: ["Graph Runtime"],
          discipline: ["Runtime Systems"],
        },
        {
          id: "ea:program:oreth",
          legacyId: "oreth",
          kind: "program",
          type: "program",
          locale: "en",
          title: "ORETH",
          subtitle: "Archived Speech-Synthesis Research Prototype",
          summary: "Canonical ORETH summary",
          description: "Canonical ORETH description",
          status: "archived",
          maturity: "archived",
          confidence: "observed",
          visibility: "public",
          publicationClass: "canonical",
          route: "/programs/oreth/",
          tags: ["Audio Intelligence"],
          discipline: ["Research"],
        },
      ],
      relations: [{ id: "canonical-relation" }],
      routes: {},
    },
  };
  const context = vm.createContext({
    window,
    document: { documentElement: { lang: "en" } },
  });
  vm.runInContext(source, context, { filename: "assets/js/catalog.js" });

  const catalog = window.EA_CATALOG as {
    authority: string;
    programs: Array<Record<string, unknown>>;
    artists: Array<Record<string, unknown>>;
    relations: Array<Record<string, unknown>>;
  };
  assert.equal(catalog.authority, "generated-public-catalog");
  assert.equal(catalog.programs.length, 2);
  assert.equal(catalog.artists.length, 1);
  assert.deepEqual(Array.from(catalog.relations, (relation) => relation.id), ["canonical-relation"]);

  const vaste = catalog.programs.find((item) => item.id === "vaste");
  assert.equal(vaste?.title, "VASTE");
  assert.equal(vaste?.subtitle, "Canonical runtime");
  assert.equal(vaste?.status, "development");
  assert.equal(vaste?.maturity, "experimental");
  assert.equal(vaste?.confidence, "validated");
  assert.equal(vaste?.route, "/programs/vaste/");
  assert.equal(vaste?.domain, "Preserved presentation field");

  const orethProgram = catalog.programs.find((item) => item.id === "oreth-program");
  assert.equal(orethProgram?.semanticId, "ea:program:oreth");
  assert.equal(orethProgram?.status, "archived");
  assert.equal(catalog.artists[0]?.title, "ORETH artist");
});

test("localized catalog-only projects do not duplicate migrated projects", async () => {
  const source = await readFile(path.resolve("assets/js/catalog.js"), "utf8");
  const window: Record<string, unknown> = {
    location: { pathname: "/fr/projects.html" },
    EA_TAXONOMIES: {},
    EA_RELATIONS: { graph: [] },
    EA_TIMELINES: [],
    EA_ACTIVITY: [],
    EA_COLLECTIONS: [],
    EA_ENTITIES: {
      projects: [{
        id: "voice-capture-studio",
        kind: "project",
        type: "project",
        title: "Legacy Voice Capture Studio",
        status: "released",
        visibility: "public",
      }],
    },
    EA_PUBLIC_CATALOG: {
      entities: [
        {
          id: "ea:project:voice-capture-studio",
          legacyId: "voice-capture-studio",
          locale: "en",
          type: "project",
          title: "Voice Capture Studio",
          status: "released",
          visibility: "public",
        },
        {
          id: "ea:project:voice-capture-studio-fr",
          legacyId: "voice-capture-studio-fr",
          translationOf: "ea:project:voice-capture-studio",
          locale: "fr",
          type: "project",
          title: "Voice Capture Studio",
          status: "released",
          visibility: "public",
        },
        {
          id: "ea:project:innerside",
          legacyId: "innerside",
          locale: "en",
          type: "project",
          title: "InnerSide",
          status: "research",
          visibility: "public",
        },
        {
          id: "ea:project:innerside-fr",
          legacyId: "innerside-fr",
          translationOf: "ea:project:innerside",
          locale: "fr",
          type: "project",
          title: "InnerSide",
          status: "research",
          visibility: "public",
        },
      ],
      relations: [],
      routes: {},
    },
  };
  const context = vm.createContext({
    window,
    document: { documentElement: { lang: "fr" } },
  });
  vm.runInContext(source, context, { filename: "assets/js/catalog.js" });

  const catalog = window.EA_CATALOG as { projects: Array<Record<string, unknown>> };
  assert.deepEqual(Array.from(catalog.projects, (project) => project.id), ["voice-capture-studio", "innerside"]);
  assert.deepEqual(Array.from(catalog.projects, (project) => project.title), ["Voice Capture Studio", "InnerSide"]);
});

test("the route-scoped runtime carries projects and the complete compact research atlas", async () => {
  const [source, surface] = await Promise.all([
    readFile(path.resolve("scripts/build-assets.mjs"), "utf8"),
    readFile(path.resolve("assets/js/core/surface.js"), "utf8"),
  ]);
  const bundle = await readFile(path.resolve("assets/js/app.js"), "utf8");

  assert.match(source, /"publicationClass", "category", "tags"/);
  assert.match(source, /const researchAtlasReferenceIds = new Set/);
  assert.match(source, /"updated", "observation", "hypothesis", "currentUnderstanding"/);
  assert.match(source, /researchAtlasReferenceIds\.has\(entity\.translationOf\)/);
  assert.match(surface, /localizedBySourceId/);
  assert.match(bundle, /ea:project:innerside/);
  assert.match(bundle, /legacyId:"innerside"/);
  assert.match(bundle, /currentUnderstanding/);
  assert.match(bundle, /relatedProjects/);
  assert.match(bundle, /ea:concept:ai-agent/);
  assert.match(bundle, /ea:program:vaste/);
});

test("canonical content consistently uses the Vestiges project name", async () => {
  const files = await fg(["content/**/*.md"]);
  const stale: string[] = [];
  for (const file of files) {
    const source = await readFile(path.resolve(file), "utf8");
    if (/\bV6\b/.test(source)) stale.push(file);
  }
  assert.deepEqual(stale, [], `V6 remains in canonical content: ${stale.join(", ")}`);
});
