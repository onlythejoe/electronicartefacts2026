import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const runAnalytics = async (options: {
  storedConsent?: { status: "granted" | "denied"; updatedAt: number; provider: string };
  cookie?: string;
} = {}) => {
  const source = await readFile(path.resolve("assets/js/core/analytics.js"), "utf8");
  const storage = new Map<string, string>();
  if (options.storedConsent) {
    storage.set("ea:analytics-consent:v1", JSON.stringify(options.storedConsent));
  }
  const headChildren: Array<{ tagName: string; src?: string; async?: boolean }> = [];
  const bodyChildren: Array<{ tagName: string; remove(): void }> = [];
  const cookieWrites: string[] = [];
  let cookieValue = options.cookie || "";

  const createElement = (tagName: string) => ({
    tagName: tagName.toUpperCase(),
    dataset: {} as Record<string, string>,
    className: "",
    innerHTML: "",
    async: false,
    src: "",
    setAttribute() {},
    addEventListener() {},
    remove() {},
  });

  const document = {
    readyState: "complete",
    documentElement: { lang: "en" },
    body: {
      dataset: {},
      appendChild(node: { tagName: string; remove(): void }) {
        bodyChildren.push(node);
        return node;
      },
    },
    head: {
      appendChild(node: { tagName: string; src?: string; async?: boolean }) {
        headChildren.push(node);
        return node;
      },
    },
    createElement,
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
  };

  Object.defineProperty(document, "cookie", {
    get() {
      return cookieValue;
    },
    set(value: string) {
      cookieWrites.push(value);
      cookieValue = cookieValue
        .split(";")
        .map((item) => item.trim())
        .filter((item) => item && !value.startsWith(`${item.split("=")[0]}=`))
        .join("; ");
    },
  });

  const context = {
    Date,
    JSON,
    Map,
    Number,
    RegExp,
    Set,
    encodeURIComponent,
    document,
    window: {
      location: { hostname: "electronicartefacts.com" },
      localStorage: {
        getItem: (key: string) => storage.get(key) || null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
      EA_ANALYTICS_CONFIG: {
        enabled: true,
        provider: "Google Analytics 4",
        measurementId: "G-TEST1234",
        privacyUrl: "/confidentialite.html",
      },
    },
  };
  vm.runInNewContext(source, context, { filename: "assets/js/core/analytics.js" });

  return { context, storage, headChildren, bodyChildren, cookieWrites };
};

test("analytics runtime does not inject Google tags before consent", async () => {
  const harness = await runAnalytics();

  assert.equal(harness.headChildren.length, 0);
  assert.equal(harness.bodyChildren.length, 1, "a consent banner should be shown when no choice exists");

  (harness.context.window as typeof harness.context.window & {
    EA_ANALYTICS: { setConsent(status: "granted" | "denied"): void };
  }).EA_ANALYTICS.setConsent("granted");

  assert.equal(harness.headChildren.length, 1);
  assert.match(harness.headChildren[0].src || "", /googletagmanager\.com\/gtag\/js\?id=G-TEST1234/);
});

test("analytics runtime honors stored refusal and clears accessible GA cookies", async () => {
  const harness = await runAnalytics({
    storedConsent: { status: "denied", updatedAt: Date.now(), provider: "Google Analytics 4" },
    cookie: "_ga=abc; _gid=def; theme=dark",
  });

  assert.equal(harness.headChildren.length, 0);
  assert.equal(harness.bodyChildren.length, 0);
  assert.ok(harness.cookieWrites.some((value) => value.startsWith("_ga=")));
  assert.ok(harness.cookieWrites.some((value) => value.startsWith("_gid=")));
});
