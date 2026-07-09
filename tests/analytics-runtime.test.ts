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
    title: "Analytics Test | Electronic Artefacts",
    referrer: "",
    documentElement: { lang: "en", scrollHeight: 2000 },
    body: {
      dataset: { page: "test-page", entryId: "ea:test" },
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
    querySelector() {
      return null;
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
      location: { hostname: "electronicartefacts.com", pathname: "/test.html" },
      innerHeight: 900,
      innerWidth: 1440,
      scrollY: 0,
      screen: { width: 1440 },
      addEventListener() {},
      requestAnimationFrame(callback: () => void) {
        callback();
        return 1;
      },
      setTimeout(callback: () => void) {
        callback();
        return 1;
      },
      clearTimeout() {},
      setInterval() {
        return 1;
      },
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

test("analytics runtime sends sanitized events only after consent", async () => {
  const harness = await runAnalytics();
  const analytics = (harness.context.window as typeof harness.context.window & {
    dataLayer?: unknown[];
    EA_ANALYTICS: {
      setConsent(status: "granted" | "denied"): void;
      track(eventName: string, params?: Record<string, unknown>): boolean;
    };
  }).EA_ANALYTICS;

  assert.equal(analytics.track("search", { search_term: "before@example.com" }), false);

  analytics.setConsent("granted");
  assert.equal(analytics.track("search", { search_term: "runtime test@example.com", result_count: 3 }), true);

  const dataLayer = (harness.context.window as typeof harness.context.window & { dataLayer: unknown[] }).dataLayer;
  const searchEvent = dataLayer.find((entry) =>
    Array.isArray(entry) && entry[0] === "event" && entry[1] === "search",
  ) as unknown[] | undefined;

  assert.ok(searchEvent, "search event should be queued after consent");
  assert.deepEqual(
    {
      search_term: (searchEvent[2] as Record<string, unknown>).search_term,
      result_count: (searchEvent[2] as Record<string, unknown>).result_count,
      page_type: (searchEvent[2] as Record<string, unknown>).page_type,
      entry_id: (searchEvent[2] as Record<string, unknown>).entry_id,
    },
    {
      search_term: "runtime [email]",
      result_count: 3,
      page_type: "test-page",
      entry_id: "ea:test",
    },
  );
});
