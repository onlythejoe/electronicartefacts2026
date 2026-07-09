import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

interface I18nRuntime {
  localizeHref(value: string): string;
}

interface MutationLike {
  type: "attributes" | "characterData" | "childList";
  target: any;
  addedNodes: unknown[];
}

interface RuntimeHarness {
  runtime: I18nRuntime;
  emitMutations(mutations: MutationLike[]): void;
  walkedRoots: unknown[];
}

const loadFrenchRuntime = async (): Promise<RuntimeHarness> => {
  const source = await readFile(path.resolve("assets/js/core/i18n.js"), "utf8");
  const documentElement = { lang: "fr" };
  const walkedRoots: unknown[] = [];
  let observerCallback: ((mutations: MutationLike[]) => void) | undefined;
  const context = {
    URL,
    NodeFilter: {
      SHOW_TEXT: 4,
      FILTER_ACCEPT: 1,
      FILTER_REJECT: 2,
    },
    MutationObserver: class {
      constructor(callback: (mutations: MutationLike[]) => void) {
        observerCallback = callback;
      }
      observe(_target: unknown, _options: unknown) {}
    },
    document: {
      documentElement,
      createTreeWalker: (root: unknown) => {
        walkedRoots.push(root);
        return {
          currentNode: null,
          nextNode: () => false,
        };
      },
    },
    window: {
      location: {
        origin: "https://electronicartefacts.com",
        pathname: "/fr/",
      },
      queueMicrotask,
    },
  };

  vm.runInNewContext(source, context, { filename: "assets/js/core/i18n.js" });
  return {
    runtime: (context.window as typeof context.window & { EA_I18N: I18nRuntime }).EA_I18N,
    emitMutations(mutations) {
      assert.ok(observerCallback, "the French runtime should register its mutation observer");
      observerCallback(mutations);
    },
    walkedRoots,
  };
};

test("French link localization is idempotent across every generated alternate", async () => {
  const { runtime } = await loadFrenchRuntime();
  const alternates = JSON.parse(
    await readFile(path.resolve("generated/i18n-alternates.json"), "utf8"),
  ) as Record<string, { en?: string; fr?: string }>;

  let checked = 0;
  for (const [route, locales] of Object.entries(alternates)) {
    if (route.startsWith("/fr/") || route === "/fr" || !locales.fr?.startsWith("/fr/")) continue;
    const localized = runtime.localizeHref(route);
    assert.equal(localized, locales.fr, `${route} should resolve to its generated French alternate`);
    assert.equal(runtime.localizeHref(localized), localized, `${localized} should remain stable`);
    assert.equal(runtime.localizeHref(runtime.localizeHref(localized)), localized, `${localized} should not oscillate`);
    checked += 1;
  }

  assert.ok(checked > 100, `expected broad alternate coverage, checked ${checked}`);
});

test("French link localization preserves queries, fragments and non-page assets", async () => {
  const { runtime } = await loadFrenchRuntime();

  assert.equal(runtime.localizeHref("./work.html?view=systems#forensic-web"), "/fr/work.html?view=systems#forensic-web");
  assert.equal(runtime.localizeHref("/fr/knowledge/concepts/knowledge-graph/"), "/fr/knowledge/concepts/knowledge-graph/");
  assert.equal(runtime.localizeHref("/assets/media/example.svg"), "/assets/media/example.svg");
  assert.equal(runtime.localizeHref("https://example.com/reference"), "https://example.com/reference");
  assert.equal(runtime.localizeHref("#method"), "#method");
});

test("dynamic localization scopes mutation work to the changed subtree", async () => {
  const harness = await loadFrenchRuntime();
  const attributes = new Map([["href", "/knowledge/concepts/knowledge-graph/"]]);
  const link = {
    nodeType: 1,
    isConnected: true,
    matches: (selector: string) => selector === "a[href]",
    querySelectorAll: () => [],
    getAttribute: (name: string) => attributes.get(name) || null,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
  };

  harness.emitMutations([{ type: "attributes", target: link, addedNodes: [] }]);
  await new Promise<void>((resolve) => queueMicrotask(resolve));

  assert.equal(attributes.get("href"), "/fr/knowledge/concepts/knowledge-graph/");
  assert.equal(harness.walkedRoots.length, 1);
  assert.equal(harness.walkedRoots[0], link, "the observer should localize only the changed link subtree");
});

test("language switcher preserves query strings and fragments on legacy detail pages", async () => {
  const source = await readFile(path.resolve("assets/js/core/behaviors.js"), "utf8");
  let assignedUrl = "";
  const optionNodes = ["en", "fr"].map((language) => ({
    title: "",
    classList: { toggle() {} },
    getAttribute: (name: string) => name === "data-language-option" ? language : null,
    setAttribute() {},
    addEventListener() {},
  }));
  const root = {
    dataset: {},
    classList: { toggle() {}, contains: () => false },
    querySelector: (selector: string) => {
      if (selector === "[data-language-menu]") return { hidden: false, addEventListener() {} };
      if (selector === "[data-language-current]") return { textContent: "" };
      if (selector === "[data-language-status]") return { textContent: "" };
      return { setAttribute() {}, addEventListener() {} };
    },
    querySelectorAll: (selector: string) => selector === "[data-language-option]" ? optionNodes : [],
  };
  const context = {
    URL,
    window: {
      EA_UTILS: { esc: (value: unknown) => String(value ?? ""), slugify: (value: unknown) => String(value ?? "") },
      EA_I18N: { translateText: (value: string) => value },
      location: {
        origin: "https://electronicartefacts.com",
        href: "https://electronicartefacts.com/fr/program.html?id=oraclehub#runtime",
        pathname: "/fr/program.html",
        assign: (target: string) => {
          assignedUrl = target;
        },
      },
      localStorage: { getItem: () => null, setItem() {} },
      requestAnimationFrame: (callback: () => void) => callback(),
      setTimeout,
    },
    document: {
      documentElement: { dataset: {} },
      querySelector: (selector: string) => selector === "[data-language-switcher]" ? root : null,
      addEventListener() {},
    },
    navigator: {
      languages: ["en-US"],
      language: "en-US",
    },
    fetch: async () => ({
      ok: true,
      json: async () => ({
        "/fr/program.html": { en: "/program.html", fr: "/fr/program.html" },
      }),
    }),
  };

  vm.runInNewContext(source, context, { filename: "assets/js/core/behaviors.js" });
  await (context.window as typeof context.window & { EA_BEHAVIORS: { initLanguageSwitcher: () => Promise<void> } }).EA_BEHAVIORS.initLanguageSwitcher();

  assert.equal(assignedUrl, "/program.html?id=oraclehub#runtime");
});
