import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile("assets/js/core/modal.js", "utf8");
type KeyEvent = { key: string; shiftKey: boolean; preventDefault(): void };

const harness = () => {
  const document: { activeElement: Element | null; body: { children: Element[] } } = {
    activeElement: null, body: { children: [] },
  };
  class Element {
    hidden = false;
    inert = false;
    isConnected = true;
    parent: Element | null = null;
    children: Element[] = [];
    listeners = new Map<string, (event: KeyEvent) => void>();
    contains(other: Element): boolean { return other === this || this.children.some((child) => child.contains(other)); }
    closest(): Element | null { return this.hidden || this.inert ? this : this.parent?.closest() || null; }
    querySelectorAll(): Element[] { return this.children; }
    getClientRects() { return [{}]; }
    focus() { document.activeElement = this; }
    addEventListener(type: string, listener: (event: KeyEvent) => void) { this.listeners.set(type, listener); }
  }
  const frames: Array<() => void> = [];
  const context = {
    document, window: {} as { EA_MODAL?: { bind(container: Element, options: { initialFocus: Element; fallbackFocus: Element; onClose?: () => void }): { open(): void; close(): void } } },
    requestAnimationFrame: (callback: () => void) => frames.push(callback),
  };
  vm.runInNewContext(source, context);
  const header = new Element();
  const main = new Element();
  const button = new Element();
  const palette = new Element();
  const input = new Element();
  const link = new Element();
  header.inert = true;
  palette.hidden = true;
  palette.children = [input, link];
  input.parent = link.parent = palette;
  document.body.children = [header, main, button, palette];
  document.activeElement = button;
  const modal = context.window.EA_MODAL!.bind(palette, { initialFocus: input, fallbackFocus: button });
  return { document, header, main, button, palette, input, link, modal, Element, bind: context.window.EA_MODAL!.bind, flush: () => frames.splice(0).forEach((callback) => callback()) };
};

test("quick navigation restores focus and the original background state after repeated opens", () => {
  const h = harness();
  h.modal.open(); h.modal.open(); h.flush();
  assert.equal(h.document.activeElement, h.input);
  assert.equal(h.main.inert, true);
  h.modal.close(); h.modal.close();
  assert.equal(h.palette.hidden, true);
  assert.equal(h.document.activeElement, h.button);
  assert.equal(h.main.inert, false);
  assert.equal(h.header.inert, true);
});

test("Tab and Shift+Tab stay inside quick navigation", () => {
  const h = harness();
  h.modal.open(); h.flush();
  let prevented = 0;
  const sendTab = (shiftKey: boolean) => h.palette.listeners.get("keydown")!({
    key: "Tab", shiftKey, preventDefault: () => { prevented += 1; },
  });
  sendTab(true);
  assert.equal(h.document.activeElement, h.link);
  sendTab(false);
  assert.equal(h.document.activeElement, h.input);
  assert.equal(prevented, 2);
});

test("a cancelled opening never steals focus after the dialog closes", () => {
  const h = harness();
  h.modal.open(); h.modal.close(); h.flush();
  assert.equal(h.document.activeElement, h.button);
  assert.equal(h.main.inert, false);
});

test("opening a second dialog closes the first and preserves background and return focus", () => {
  const h = harness();
  const second = new h.Element();
  const closeButton = new h.Element();
  second.hidden = true;
  second.children = [closeButton];
  closeButton.parent = second;
  h.document.body.children.push(second);
  let closed = 0;
  const dialog = h.bind(second, { initialFocus: closeButton, fallbackFocus: h.button, onClose: () => { closed += 1; } });
  dialog.open(); h.flush();
  assert.equal(h.document.activeElement, closeButton);
  h.modal.open(); h.flush();
  assert.equal(second.hidden, true);
  assert.equal(closed, 1);
  assert.equal(h.document.activeElement, h.input);
  assert.equal(h.main.inert, true);
  assert.equal(h.palette.inert, false);
  h.modal.close();
  assert.equal(h.document.activeElement, h.button);
  assert.equal(h.main.inert, false);
  assert.equal(h.header.inert, true);
  assert.equal(second.inert, false);
  dialog.close();
  assert.equal(closed, 1);
});
