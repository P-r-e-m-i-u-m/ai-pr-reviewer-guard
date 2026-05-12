import assert from "node:assert/strict";
import test from "node:test";
import { parseThreshold, shouldFail } from "./threshold.js";

test("compares risk thresholds", () => {
  assert.equal(shouldFail("high", "high"), true);
  assert.equal(shouldFail("medium", "high"), false);
  assert.equal(shouldFail("critical", "never"), false);
});

test("parses valid thresholds", () => {
  assert.equal(parseThreshold("critical"), "critical");
  assert.equal(parseThreshold(undefined), "high");
});
