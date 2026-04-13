import test from "node:test";
import assert from "node:assert/strict";
import { getArchiveTimestamp } from "./counterArchive.js";

test("getArchiveTimestamp returns UTC ISO string", () => {
  const timestamp = getArchiveTimestamp(new Date("2026-04-13T10:30:45.000Z"));
  assert.equal(timestamp, "2026-04-13T10:30:45.000Z");
});