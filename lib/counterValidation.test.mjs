import test from "node:test";
import assert from "node:assert/strict";
import {
  toSafeInt,
  normalizeTitle,
  buildValidatedCounterPayload,
} from "./counterValidation.js";

test("toSafeInt returns parsed integer for valid numeric strings", () => {
  assert.equal(toSafeInt("42"), 42);
  assert.equal(toSafeInt("9.8"), 9);
});

test("toSafeInt returns default value for invalid values", () => {
  assert.equal(toSafeInt("abc"), 0);
  assert.equal(toSafeInt(null, 7), 7);
});

test("normalizeTitle trims and falls back to Counter when empty", () => {
  assert.equal(normalizeTitle("  Steps  "), "Steps");
  assert.equal(normalizeTitle("   "), "Counter");
  assert.equal(normalizeTitle(undefined), "Counter");
});

test("buildValidatedCounterPayload returns invalid result for non-integer value", () => {
  const result = buildValidatedCounterPayload({
    title: "Counter",
    value: "foo",
    color: "white",
    bgColor: "black",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.error, "Value must be a valid integer.");
});

test("buildValidatedCounterPayload normalizes title and parses value", () => {
  const result = buildValidatedCounterPayload({
    title: "  Water  ",
    value: "15",
    color: "#fff",
    bgColor: "#000",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.payload, {
    title: "Water",
    value: 15,
    color: "#fff",
    bgColor: "#000",
  });
});
