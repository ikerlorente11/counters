import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDevelopmentPreviewDataset,
  parsePreviewCounterIds,
  serializePreviewCounterIds,
} from "./developmentPreview.js";

test("buildDevelopmentPreviewDataset returns multiple realistic preview counters", () => {
  const dataset = buildDevelopmentPreviewDataset();

  assert.equal(dataset.length, 8);
  assert.deepEqual(
    dataset.map((counter) => counter.displayOrder),
    [0, 1, 2, 3, 4, 5, 6, 7],
  );
  assert.ok(dataset.every((counter) => counter.history.length === 184));
  assert.ok(dataset.every((counter) => typeof counter.title === "string" && counter.title.length > 0));
});

test("serializePreviewCounterIds and parsePreviewCounterIds roundtrip valid ids", () => {
  const ids = [3, 9, 12];

  assert.deepEqual(parsePreviewCounterIds(serializePreviewCounterIds(ids)), ids);
});

test("parsePreviewCounterIds returns empty array for invalid persisted values", () => {
  assert.deepEqual(parsePreviewCounterIds(undefined), []);
  assert.deepEqual(parsePreviewCounterIds("not-json"), []);
  assert.deepEqual(parsePreviewCounterIds('{"foo":1}'), []);
});
