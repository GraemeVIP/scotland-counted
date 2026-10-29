#!/usr/bin/env node
/**
 * Exact match check for the keyword plan.
 *
 * For every page in research/keywords/content-plan.json, loads the page from a
 * running server and checks that its address, its <title> and its H1 each
 * contain the main keyword's words in the same order. Pages the plan marks as
 * new and that do not exist yet are listed as still to build, not as failures.
 *
 *   node scripts/check-keyword-plan.mjs http://localhost:3000
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const plan = JSON.parse(readFileSync(fileURLToPath(new URL("../research/keywords/content-plan.json", import.meta.url)), "utf8"));

const words = (text) =>
  text
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;|&rsquo;|’/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();

const contains = (haystack, needle) => ` ${words(haystack)} `.includes(` ${words(needle)} `);

let failures = 0;
const missing = [];
for (const page of plan) {
  const response = await fetch(BASE + page.slug, { redirect: "manual" });
  if (response.status === 404) {
    if (page.action === "new") missing.push(page.slug);
    else {
      failures += 1;
      console.log(`FAIL  ${page.slug}: 404, but the plan says it already exists`);
    }
    continue;
  }
  if (response.status !== 200) {
    failures += 1;
    console.log(`FAIL  ${page.slug}: HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "";
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? "";
  const problems = [];
  if (!contains(page.slug.replace(/[/-]/g, " "), page.primary)) problems.push("address");
  if (!contains(title, page.primary)) problems.push(`title "${words(title)}"`);
  if (!contains(h1, page.primary)) problems.push(`H1 "${words(h1)}"`);
  if (problems.length) {
    failures += 1;
    console.log(`FAIL  ${page.slug} (${page.primary}): ${problems.join("; ")}`);
  }
}

const built = plan.length - missing.length;
console.log(`\n${built} of ${plan.length} planned pages are live; ${built - failures} pass the exact match check.`);
if (missing.length) console.log(`Still to build (${missing.length}): ${missing.join(" ")}`);
process.exitCode = failures ? 1 : 0;
