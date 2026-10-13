import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile("assets/js/core/context-menu.js", "utf8");
const harness = () => {
  let active: Element;
  class Element {
    hidden = false; tabIndex = 0; textContent = ""; type = ""; className = "";
    dataset: Record<string, string> = {}; style: Record<string, string> = {};
    children: Element[] = []; listeners = new Map<string, (event: any) => any>();
    classList = { add() {}, remove() {} };
    getAttribute() { return null; } setAttribute() {}
    append(child: Element) { this.children.push(child); }
    replaceChildren() { this.children = []; }
    contains(element: Element) { return this.children.includes(element); }
    closest(selector: string) { return selector === "[data-context-action]" && this.dataset.contextAction ? this : null; }
    getBoundingClientRect() { return { left: 10, top: 10, width: 200, height: 200 }; }
    querySelectorAll() { return this.children.filter((child) => child.type === "button"); }
    querySelector() { return this.querySelectorAll()[0] || null; }
    focus() { active = this; }
    addEventListener(type: string, callback: (event: any) => any) { this.listeners.set(type, callback); }
  }
  const opener = new Element(), body = new Element(); active = opener;
  const listeners = new Map<string, (event: any) => void>();
  const windowListeners = new Map<string, () => void>();
  const copied: string[] = [];
  const document = { title: "Record", documentElement: { lang: "en" }, body,
    get activeElement() { return active; }, querySelector: () => null,
    createElement: () => new Element(), addEventListener: (name: string, callback: (event: any) => void) => listeners.set(name, callback),
  };
  const context = { document, URL, navigator: { clipboard: { writeText: async (value: string) => { copied.push(value); } } },
    window: { location: { href: "https://electronicartefacts.com/graph.html", pathname: "/graph.html" }, innerWidth: 1000, innerHeight: 900, addEventListener: (name: string, callback: () => void) => windowListeners.set(name, callback) },
  };
  vm.runInNewContext(source, context);
  (context.window as any).EA_CONTEXT_MENU.init();
  let prevented = false;
  const key = (value: string) => { prevented = false; listeners.get("keydown")!({ key: value, target: active, preventDefault: () => { prevented = true; } }); return prevented; };
  key("ContextMenu");
  return { opener, menu: body.children[0]!, copied, key, resize: () => windowListeners.get("resize")!(), active: () => active };
};

test("context menu arrows move focus and Tab closes without blocking the native focus order", () => {
  const h = harness();
  assert.ok(h.menu.querySelectorAll().every((button) => button.tabIndex === -1));
  h.key("End");
  assert.equal(h.active(), h.menu.querySelectorAll().at(-1));
  assert.equal(h.key("Tab"), false);
  assert.equal(h.menu.hidden, true);
  assert.equal(h.active(), h.opener);
});

test("context actions restore focus before running and Escape returns to the opener", async () => {
  const h = harness();
  const copy = h.menu.querySelectorAll().find((button) => button.dataset.contextAction === "copy-link")!;
  await h.menu.listeners.get("click")!({ target: copy });
  assert.equal(h.menu.hidden, true);
  assert.equal(h.active(), h.opener);
  assert.deepEqual(h.copied, ["https://electronicartefacts.com/graph.html"]);
  h.key("ContextMenu");
  assert.equal(h.key("Escape"), true);
  assert.equal(h.active(), h.opener);
  h.key("ContextMenu"); h.resize();
  assert.equal(h.menu.hidden, true);
  assert.equal(h.active(), h.opener);
});
