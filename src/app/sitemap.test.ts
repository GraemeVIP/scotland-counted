import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Every static page must appear in the sitemap.
 *
 * The sitemap is a hand-written list, so adding a route does not add it to the
 * sitemap and nothing complains. Four pages were built during the
 * repositioning work and all four were missing, which was only noticed because
 * an unrelated check quietly passed on a page it should have failed on.
 *
 * The source is read as text rather than imported, because sitemap.ts pulls in
 * the whole data layer through the "@/" alias, which `node --test` cannot
 * resolve. Reading it is enough: the question is whether the path is listed.
 */

const APP = fileURLToPath(new URL("./(site)/", import.meta.url));
const SITEMAP = readFileSync(fileURLToPath(new URL("./sitemap.ts", import.meta.url)), "utf8");

/** Static routes on disk, ignoring dynamic segments and route groups. */
function staticRoutes(dir = APP, prefix = ""): string[] {
  const out: string[] = [];
  if (existsSync(join(dir, "page.tsx"))) out.push(prefix || "/");
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("(")) continue;
    out.push(...staticRoutes(join(dir, entry.name), `${prefix}/${entry.name}`));
  }
  return out;
}

/**
 * Pages deliberately kept out of the sitemap. Each needs a reason, so that
 * leaving something out stays a decision rather than an oversight.
 */
const DELIBERATELY_ABSENT: Record<string, string> = {
  "/privacy": "linked from the footer, no search value",
  "/msp-reviews/submitted": "private submission outcome page, explicitly noindex",
};

test("every static page is listed in the sitemap", () => {
  const missing: string[] = [];
  for (const route of staticRoutes()) {
    if (route in DELIBERATELY_ABSENT) continue;
    // The root is `site.url` with nothing appended, so it never appears as a
    // path and is checked separately below.
    if (route === "/") continue;
    if (!SITEMAP.includes(`\${site.url}${route}\``)) missing.push(route);
  }
  assert.deepEqual(
    missing,
    [],
    `these pages exist but are not in the sitemap:\n  ${missing.join("\n  ")}`,
  );
});

test("the homepage is in the sitemap", () => {
  assert.match(SITEMAP, /url:\s*site\.url\b/, "the root URL is missing from the sitemap");
});

test("the new section hubs are listed", () => {
  // Named explicitly: these are the entry points the whole repositioning
  // depends on, and a silent omission would strand them.
  for (const hub of ["/areas", "/money", "/councils", "/who-decides", "/poverty", "/accessibility"]) {
    assert.ok(SITEMAP.includes(`\${site.url}${hub}\``), `${hub} is missing from the sitemap`);
  }
});

test("anything left out of the sitemap has a recorded reason", () => {
  for (const [route, reason] of Object.entries(DELIBERATELY_ABSENT)) {
    assert.ok(reason.length > 10, `${route} needs a real reason for being excluded`);
    assert.ok(
      existsSync(join(APP, route.slice(1), "page.tsx")),
      `${route} is listed as deliberately absent but no longer exists`,
    );
  }
});
