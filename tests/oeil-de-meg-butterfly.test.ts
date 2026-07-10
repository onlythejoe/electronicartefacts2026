import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

test("the Oeil de Meg butterfly keeps its wing roots inward and is reused across project surfaces", async () => {
  const [view, main, styles] = await Promise.all([
    readFile(path.resolve("assets/js/core/view.js"), "utf8"),
    readFile(path.resolve("assets/js/main.js"), "utf8"),
    readFile(path.resolve("assets/css/style.css"), "utf8"),
  ]);

  assert.match(view, /hinge--left[\s\S]*wing--left/);
  assert.match(view, /hinge--right[\s\S]*wing--right/);
  assert.match(styles, /\.project-butterfly__wing--left\s*\{\s*transform:\s*scaleX\(-1\)/);
  assert.doesNotMatch(styles, /\.project-butterfly__wing--right\s*\{[^}]*scaleX\(-1\)/);

  assert.equal((view.match(/projectButterflyBubble\(item, "card"\)/g) || []).length, 3);
  assert.equal((main.match(/projectButterflyBubble\(item, "hero"\)/g) || []).length, 2);
});
