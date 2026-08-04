import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
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
 * Files exempt from the rule, each for a stated reason.
 *
 * This file, because it has to name the character it bans in order to search
 * for it, and a test that fails on itself teaches everyone to ignore it.
 *
 * The privacy page, because it is out of scope by instruction. A repository
 * wide sweep changed four dashes in its body copy and those changes were
 * reverted: a privacy policy is a written statement about what software does,
 * and an unrelated task has no business editing one, even its punctuation.
 * Two of the four replacements were comma splices as well.
 */
const EXEMPT = [
  fileURLToPath(import.meta.url),
  join(ROOT, "src", "app", "(site)", "privacy", "page.tsx"),
];

// Every exempt path must exist. A typo would silently exempt nothing, and the
// first version of this list did exactly that by omitting the src segment.
for (const path of EXEMPT) {
  if (!existsSync(path)) throw new Error(`exempt path does not exist: ${path}`);
}

const FILES = sourceFiles(ROOT).filter((file) => !EXEMPT.includes(file));

/**
 * The character, and every way of writing it that a browser renders as one.
 *
 * A sweep that only looked for the character left `&mdash;` untouched in JSX,
 * where it is invisible to a source scan and renders as an em dash on the
 * page. It survived on all 32 council records that way.
 */
const EM_DASH_FORMS = [EM_DASH, "&mdash;", "&#8212;", "&#x2014;"];

test("the repository contains no em dashes, written any way", () => {
  const offenders: string[] = [];
  for (const file of FILES) {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    for (const form of EM_DASH_FORMS) {
      if (!text.includes(form)) continue;
      const line = lines.findIndex((l) => l.includes(form)) + 1;
      offenders.push(`${file.replace(ROOT, "")}:${line} (${form === EM_DASH ? "character" : form})`);
    }
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
