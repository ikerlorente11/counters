import assert from "node:assert";
import test from "node:test";
import {
  getDragCompensation,
  getDropIndex,
  GRID_COLUMN_GAP,
  GRID_COLUMNS,
  moveItem,
} from "./counterReordering.js";

test("moveItem moves one counter to a new index", () => {
  const items = [1, 2, 3, 4];

  assert.deepStrictEqual(moveItem(items, 0, 2), [2, 3, 1, 4]);
});

test("moveItem returns a clone when indexes are equal", () => {
  const items = [1, 2, 3];

  assert.deepStrictEqual(moveItem(items, 1, 1), [1, 2, 3]);
  assert.notStrictEqual(moveItem(items, 1, 1), items);
});

test("getDropIndex resolves list mode target from vertical drag", () => {
  assert.strictEqual(
    getDropIndex({
      fromIndex: 1,
      itemCount: 4,
      layoutMode: "list",
      translationY: 130,
    }),
    2,
  );
});

test("getDropIndex clamps list mode target inside bounds", () => {
  assert.strictEqual(
    getDropIndex({
      fromIndex: 0,
      itemCount: 4,
      layoutMode: "list",
      translationY: -400,
    }),
    0,
  );
});

test("getDropIndex resolves grid mode target from row and column drag", () => {
  const cellWidth = (320 - GRID_COLUMN_GAP) / GRID_COLUMNS;

  assert.strictEqual(
    getDropIndex({
      fromIndex: 0,
      itemCount: 5,
      layoutMode: "grid",
      containerWidth: 320,
      translationX: cellWidth + GRID_COLUMN_GAP,
      translationY: 190,
    }),
    3,
  );
});

test("getDropIndex keeps current index when grid width is unavailable", () => {
  assert.strictEqual(
    getDropIndex({
      fromIndex: 2,
      itemCount: 5,
      layoutMode: "grid",
      containerWidth: 0,
      translationX: 120,
      translationY: 180,
    }),
    2,
  );
});

test("getDragCompensation offsets list reflow for the dragged item", () => {
  assert.deepStrictEqual(
    getDragCompensation({
      fromIndex: 1,
      toIndex: 3,
      layoutMode: "list",
    }),
    { x: 0, y: -236 },
  );
});

test("getDragCompensation offsets grid reflow for the dragged item", () => {
  assert.deepStrictEqual(
    getDragCompensation({
      fromIndex: 0,
      toIndex: 3,
      layoutMode: "grid",
      containerWidth: 320,
    }),
    { x: -166, y: -180 },
  );
});
