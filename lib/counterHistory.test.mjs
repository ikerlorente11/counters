import test from "node:test";
import assert from "node:assert/strict";
import { COUNTER_CHART_FILTERS, getCounterValuesForRange } from "./counterHistory.js";

const buildValues = (count) => Array.from({ length: count }, (_, index) => ({
  id: index + 1,
  value: index,
}));

test("getCounterValuesForRange returns the last 7 entries by default", () => {
  const values = buildValues(20);
  const result = getCounterValuesForRange(values, "unknown");

  assert.equal(result.length, 7);
  assert.deepEqual(result.map((entry) => entry.id), [14, 15, 16, 17, 18, 19, 20]);
});

test("getCounterValuesForRange returns all entries for the all range", () => {
  const values = buildValues(20);
  const result = getCounterValuesForRange(values, "all");

  assert.equal(result.length, 20);
  assert.deepEqual(result, values);
});

test("getCounterValuesForRange limits 6m to the latest 183 entries", () => {
  const values = buildValues(220);
  const result = getCounterValuesForRange(values, "6m");

  assert.equal(result.length, 183);
  assert.equal(result[0].id, 38);
  assert.equal(result.at(-1).id, 220);
});

test("COUNTER_CHART_FILTERS includes the All selector", () => {
  assert.deepEqual(COUNTER_CHART_FILTERS.map((filter) => filter.key), ["7d", "30d", "90d", "6m", "all"]);
});