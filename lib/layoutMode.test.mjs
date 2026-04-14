import assert from "node:assert";
import test from "node:test";
import {
  DEFAULT_LAYOUT_MODE,
  GRID_LAYOUT_MODE,
  normalizeLayoutMode,
} from "./layoutMode.js";

test("normalizeLayoutMode keeps valid grid mode", () => {
  assert.strictEqual(normalizeLayoutMode(GRID_LAYOUT_MODE), GRID_LAYOUT_MODE);
});

test("normalizeLayoutMode falls back to list mode for invalid values", () => {
  assert.strictEqual(normalizeLayoutMode("cards"), DEFAULT_LAYOUT_MODE);
  assert.strictEqual(normalizeLayoutMode(null), DEFAULT_LAYOUT_MODE);
  assert.strictEqual(normalizeLayoutMode(undefined), DEFAULT_LAYOUT_MODE);
});
