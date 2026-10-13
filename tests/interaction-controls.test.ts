import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const sources = await Promise.all(["tabs", "language-menu"].map((name) => readFile(`assets/js/core/${name}.js`, "utf8")));
const harness = () => {
  let document: Element;
  class Element {
    id = ""; hidden = false; tabIndex = 0; activeElement: Element | null = null;
    dataset: Record<string, string> = {};
    attributes = new Map<string, string>();
    selectors = new Map<string, Element[]>();
    children: Element[] = [];
    listeners = new Map<string, Array<(event: any) => void>>();
    classes = new Set<string>();
    classList = {
      toggle: (name: string, active: boolean) => active ? this.classes.add(name) : this.classes.delete(name),
      contains: (name: string) => this.classes.has(name),
    };
    getAttribute(name: string) { return this.attributes.get(name) ?? null; }
    setAttribute(name: string, value: string) { this.attributes.set(name, value); }
    querySelectorAll(selector: string) { return this.selectors.get(selector) || []; }
    querySelector(selector: string) { return this.querySelectorAll(selector)[0] || null; }
    contains(element: Element): boolean { return element === this || this.children.some((child) => child.contains(element)); }
    focus() { document.activeElement = this; }
    addEventListener(type: string, listener: (event: any) => void) {
      this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
    }
    emit(type: string, key = "") {
      let prevented = false;
      const event = { key, target: this, preventDefault: () => { prevented = true; } };
      this.listeners.get(type)?.forEach((listener) => listener(event));
      return prevented;
    }
  }
  document = new Element();
  const window: any = { requestAnimationFrame: (callback: () => void) => callback() };
  sources.forEach((source) => vm.runInNewContext(source, { window, document, URL }));
  const root = new Element(), trigger = new Element(), menu = new Element();
  const options = [new Element(), new Element()];
  options[0]!.setAttribute("aria-checked", "true");
  options[1]!.setAttribute("aria-checked", "false");
  menu.hidden = true; menu.children = options; root.children = [trigger, menu];
  root.selectors.set("[data-language-trigger]", [trigger]);
  root.selectors.set("[data-language-menu]", [menu]);
  root.selectors.set("[data-language-option]", options);
  return { Element, document, window, root, trigger, menu, options };
};

test("language menus support opening at either end and Escape restores the trigger", () => {
  const h = harness(); h.window.EA_LANGUAGE_MENU.bind(h.root);
  assert.equal(h.trigger.emit("keydown", "ArrowUp"), true);
  assert.equal(h.document.activeElement, h.options[1]);
  assert.equal(h.menu.hidden, false);
  h.document.emit("keydown", "Escape");
  assert.equal(h.menu.hidden, true);
  assert.equal(h.document.activeElement, h.trigger);
  assert.equal(h.trigger.getAttribute("aria-expanded"), "false");
  h.trigger.emit("keydown", "ArrowDown");
  assert.equal(h.document.activeElement, h.options[0]);
});

test("language menu arrows cycle and Tab closes without blocking the native tab order", () => {
  const h = harness(); h.window.EA_LANGUAGE_MENU.bind(h.root); h.trigger.emit("click");
  h.menu.emit("keydown", "ArrowUp");
  assert.equal(h.document.activeElement, h.options[1]);
  h.menu.emit("keydown", "Home");
  assert.equal(h.document.activeElement, h.options[0]);
  assert.equal(h.menu.emit("keydown", "Tab"), false);
  assert.equal(h.menu.hidden, true);
  assert.equal(h.document.activeElement, h.trigger);
});

test("language changes retain live queries and fragments without overwriting target state", () => {
  const { window } = harness();
  const preserve = window.EA_LANGUAGE_MENU.preserveUrlState;
  assert.equal(preserve("https://electronicartefacts.com/fr/search.html", "http://127.0.0.1:4197/search/?q=graph#main"), "/fr/search.html?q=graph#main");
  assert.equal(preserve("/fr/search.html?q=own#target", "http://127.0.0.1:4197/search/?q=current#main"), "/fr/search.html?q=own#target");
});

const tabHarness = () => {
  const h = harness(); const root = new h.Element();
  const tabs = [new h.Element(), new h.Element(), new h.Element()];
  const panels = [new h.Element(), new h.Element(), new h.Element()];
  tabs.forEach((tab, index) => { tab.setAttribute("aria-controls", `panel-${index}`); tab.setAttribute("aria-selected", String(index === 1)); });
  panels.forEach((panel, index) => { panel.id = `panel-${index}`; });
  root.selectors.set("tabs", tabs); root.selectors.set("panels", panels);
  return { ...h, root, tabs, panels };
};

test("tab initialization displays exactly the selected panel and keeps one tab in the tab order", () => {
  const h = tabHarness(); h.window.EA_TABS.bind(h.root, { tabSelector: "tabs", panelSelector: "panels" });
  assert.deepEqual(h.panels.map((panel) => panel.hidden), [true, false, true]);
  assert.deepEqual(h.tabs.map((tab) => tab.tabIndex), [-1, 0, -1]);
});

test("tab keyboard navigation cycles, moves focus and updates panel visibility", () => {
  const h = tabHarness(); h.window.EA_TABS.bind(h.root, { tabSelector: "tabs", panelSelector: "panels" });
  h.tabs[1]!.emit("keydown", "End"); h.tabs[2]!.emit("keydown", "ArrowRight");
  assert.equal(h.document.activeElement, h.tabs[0]);
  assert.deepEqual(h.panels.map((panel) => panel.hidden), [false, true, true]);
  assert.equal(h.tabs[0]!.getAttribute("aria-selected"), "true");
});

test("rebinding tabs never duplicates activation callbacks", () => {
  const h = tabHarness(); let count = 0;
  const options = { tabSelector: "tabs", panelSelector: "panels", onActivate: () => { count += 1; } };
  h.window.EA_TABS.bind(h.root, options); h.window.EA_TABS.bind(h.root, options);
  h.tabs[2]!.emit("click");
  assert.equal(count, 2);
});

test("published project CSS retains tab enhancement and explicit hidden panels", async () => {
  const css = await readFile("assets/css/project.css", "utf8");
  assert.ok(css.includes(".project-command.is-tabbed"));
  assert.match(css, /\.project-command__panel\[hidden\]\{display:none\}/);
});
