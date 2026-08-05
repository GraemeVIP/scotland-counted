import { test } from "node:test";
import assert from "node:assert/strict";
import { isUkVisitor } from "./ukAccess.ts";

test("GB visitors are allowed on Vercel", () => {
  assert.equal(isUkVisitor("GB", true), true);
});

test("country matching is trimmed and case-insensitive", () => {
  assert.equal(isUkVisitor(" gb ", true), true);
});

test("visitors outside the UK are denied", () => {
  assert.equal(isUkVisitor("US", true), false);
  assert.equal(isUkVisitor("FR", false), false);
});

test("a missing country is denied on Vercel", () => {
  assert.equal(isUkVisitor(null, true), false);
});

test("a missing country remains usable in local development", () => {
  assert.equal(isUkVisitor(null, false), true);
});
