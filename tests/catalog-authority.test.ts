import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

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
