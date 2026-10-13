import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile("assets/js/core/graph-page.js", "utf8");
const harness = () => {
  let activeElement: Element | null = null;
  class Element {
    dataset: Record<string, string> = {};
    hidden = false; textContent = ""; href = "";
    attributes = new Map<string, string>(); classes = new Set<string>();
    listeners = new Map<string, (event: any) => void>(); selectors = new Map<string, Element[]>();
    properties = new Map<string, string>();
    style = { setProperty: (name: string, value: string) => this.properties.set(name, value) };
    classList = {
      add: (...names: string[]) => names.forEach((name) => this.classes.add(name)),
      remove: (...names: string[]) => names.forEach((name) => this.classes.delete(name)),
      contains: (name: string) => this.classes.has(name),
      toggle: (name: string, enabled: boolean) => enabled ? this.classes.add(name) : this.classes.delete(name),
    };
    querySelectorAll(selector: string) { return this.selectors.get(selector) || []; }
    querySelector(selector: string) { return this.querySelectorAll(selector)[0] || null; }
    getAttribute(name: string) { return this.attributes.get(name) || null; }
    setAttribute(name: string, value: string) { this.attributes.set(name, value); }
    getBoundingClientRect() { return { left: 100, top: 200, width: 200, height: 200 }; }
    addEventListener(name: string, callback: (event: any) => void) { this.listeners.set(name, callback); }
    setPointerCapture() {} releasePointerCapture() {} closest() { return null; }
    focus() { activeElement = this; }
    emit(type: string, values: Record<string, unknown> = {}) {
      let prevented = false;
      this.listeners.get(type)?.({ type, target: this, button: 0, pointerId: 1, clientX: 0, clientY: 0,
        preventDefault: () => { prevented = true; }, stopPropagation() {}, ...values });
      return prevented;
    }
  }
  const graph = new Element(), stage = new Element(), viewport = new Element(), canvas = new Element();
  const node = new Element(), circle = new Element(), clear = new Element(), all = new Element(), link = new Element();
  node.dataset = { globalGraphId: "test", globalGraphX: "50", globalGraphY: "30", globalGraphType: "program", globalGraphTitle: "VASTE", globalGraphRoute: "/programs/vaste/" };
  all.dataset.globalGraphFilter = "all";
  node.selectors.set("circle", [circle]);
  graph.selectors.set("[data-global-graph-node]", [node]);
  graph.selectors.set("[data-global-graph-filter]", [all]);
  graph.selectors.set("[data-global-graph-stage]", [stage]);
  graph.selectors.set("[data-global-graph-viewport]", [viewport]);
  graph.selectors.set(".global-graph__canvas", [canvas]);
  graph.selectors.set("[data-global-graph-clear]", [clear]);
  graph.selectors.set("[data-global-graph-inspector-link]", [link]);
  for (const key of ["kind", "title", "copy", "count"]) graph.selectors.set(`[data-global-graph-inspector-${key}]`, [new Element()]);
  Object.assign(viewport, { getScreenCTM: () => ({ inverse: () => ({ a: 0.5, d: 0.5, e: -50, f: -100 }) }) });
  Object.assign(canvas, {
    getScreenCTM: () => ({ a: 2, d: 2 }),
    createSVGPoint: () => ({ x: 0, y: 0, matrixTransform(matrix: { a: number; d: number; e: number; f: number }) { return { x: this.x * matrix.a + matrix.e, y: this.y * matrix.d + matrix.f }; } }),
  });
  const frames: Array<() => void> = [];
  const context = {
    window: { addEventListener() {} }, location: { pathname: "/graph.html" },
    document: { documentElement: { lang: "en" }, querySelector: (selector: string) => selector === "[data-global-graph]" ? graph : null },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    performance: { mark() {}, measure() {} },
    requestAnimationFrame: (callback: () => void) => { frames.push(callback); return frames.length; },
  };
  vm.runInNewContext(source, context);
  return { node, circle, stage, viewport, clear, all, link, active: () => activeElement, flush: () => frames.splice(0).forEach((callback) => callback()) };
};

test("graph dragging applies the inverse screen transform and preserves the grab offset", () => {
  const h = harness();
  h.node.emit("pointerdown", { clientX: 203, clientY: 264 });
  h.node.emit("pointermove", { clientX: 223, clientY: 274 }); h.flush();
  assert.equal(Number(h.node.dataset.globalGraphX), 60);
  assert.equal(Number(h.node.dataset.globalGraphY), 35);
  assert.equal(h.circle.getAttribute("cx"), "60");
  h.node.emit("pointerup");
  assert.equal(h.node.emit("click"), true);
  assert.equal(h.link.hidden, true, "the drag's click does not select a record");
});

test("graph panning converts screen pixels to SVG units", () => {
  const h = harness();
  h.stage.emit("pointerdown");
  h.stage.emit("pointermove", { clientX: 12, clientY: 8 }); h.flush();
  assert.equal(h.viewport.properties.get("--global-graph-pan-x"), "6px");
  assert.equal(h.viewport.properties.get("--global-graph-pan-y"), "4px");
  assert.equal(h.stage.emit("keydown", { key: "+", metaKey: true }), false);
});

test("graph right clicks never drag and cancelled drags allow the next selection", () => {
  const h = harness();
  h.node.emit("pointerdown", { button: 2 });
  assert.equal(h.node.classes.has("is-dragging"), false);
  h.node.emit("pointerdown", { clientX: 200, clientY: 260 });
  h.node.emit("pointermove", { clientX: 220, clientY: 270 }); h.flush();
  h.node.emit("pointercancel");
  h.node.emit("click");
  assert.equal(h.link.hidden, false);
  h.clear.emit("click");
  assert.equal(h.link.hidden, true);
  assert.equal(h.clear.hidden, true);
  assert.equal(h.active(), h.all, "clearing returns focus to a visible filter");
});
