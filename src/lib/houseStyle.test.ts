import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * House style rules that apply everywhere, enforced rather than remembered.
 *
 * The em dash rule is the one worth a test. It reads as a stylistic
 * preference, so it drifts back in one sentence at a time, and by the time
 * anyone notices there are four hundred of them. There were, and removing them
 * took a scripted sweep across 115 files.
 *
 * The character is written as an escape throughout this file. Writing it
 * literally would make the test fail against itself, and worse, a future sweep
 * would silently rewrite the assertion instead of the prose. That already
 * happened once: a sweep turned the metadata guard in seo.tsx into a check for
 * comma-space, which would have rejected any title containing a comma.
 */

const EM_DASH = "\u2014";
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "generated"]);
const EXTENSIONS = [".ts", ".tsx", ".md", ".mjs", ".css"];

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, found);
    else if (EXTENSIONS.some((ext) => entry.endsWith(ext))) found.push(full);
  }
  return found;
}

/**
 * This file is excluded from its own scan. It has to name the character it
 * bans in order to search for it, and a test that fails on itself teaches
 * everyone to ignore it.
 */
const SELF = fileURLToPath(import.meta.url);
const FILES = sourceFiles(ROOT).filter((file) => file !== SELF);

test("the repository contains no em dashes", () => {
  const offenders: string[] = [];
  for (const file of FILES) {
    const text = readFileSync(file, "utf8");
    if (!text.includes(EM_DASH)) continue;
    const line = text.split("\n").findIndex((l) => l.includes(EM_DASH)) + 1;
    offenders.push(`${file.replace(ROOT, "")}:${line}`);
  }
  assert.deepEqual(
    offenders,
    [],
    `em dashes found. Use a comma, a colon or a full stop instead:\n  ${offenders.join("\n  ")}`,
  );
});

/*
 * A doubled-punctuation check was written here and then removed rather than
 * weakened. Replacing a dash with a comma next to existing punctuation can
 * leave ", ," behind, which is a real risk, but no regular expression
 * separates that from ordinary TypeScript: spread syntax, array literals and
 * object literals all produce the same shapes. It reported six matches and
 * every one was code. A check that cries wolf gets muted, so it is better not
 * to have it. Prose damage from the sweep was reviewed by reading the diff.
 */

test("no sentence in visible copy opens with a lowercase conjunction after a full stop", () => {
  // The sweep turns "x — and y" into "x, and y", which is fine, but a
  // mis-parse could produce ". and y". That reads as a broken sentence.
  const offenders: string[] = [];
  for (const file of FILES) {
    if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue;
    const text = readFileSync(file, "utf8");
    text.split("\n").forEach((line, index) => {
      if (/\.\s+(and|but|so|or|yet)\b/.test(line)) {
        offenders.push(`${file.replace(ROOT, "")}:${index + 1}  ${line.trim().slice(0, 80)}`);
      }
    });
  }
  assert.deepEqual(offenders, [], `sentence starting with a conjunction:\n  ${offenders.join("\n  ")}`);
});
