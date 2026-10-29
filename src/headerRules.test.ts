import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { FRAME_PROTECTED_PATHS, PAGE_PATHS, pageHeaderRules, sourceCovers } from "./headerRules.ts";

/**
 * These headers keep preview hosts out of search results, so a mistake here is
 * invisible until the wrong domain is indexed, or the real one is not.
 *
 * They used to come from a proxy that ran as a function on every request,
 * which used up the free plan's monthly server time. They are static rules
 * now. scripts/check-proxy.mjs checks real responses against a build; this
 * covers what can be checked without one.
 */

test("nothing runs as a function on every request", () => {
  for (const file of ["./proxy.ts", "./middleware.ts", "../proxy.ts", "../middleware.ts"]) {
    assert.equal(
      existsSync(new URL(file, import.meta.url)),
      false,
      `${file} would run on every request; put headers in src/headerRules.ts instead`,
    );
  }
});

test("built assets get no page headers", () => {
  for (const path of [
    "/_next/static/chunks/main.css",
    "/_next/static/chunks/app.js",
    "/_next/image",
    "/favicon.ico",
    "/data/scottish-councils-benchmarks.csv",
    "/og/default.png",
    "/photo.jpeg",
    "/logo.svg",
    "/fonts/archivo.woff2",
    "/report.pdf",
  ]) {
    assert.equal(sourceCovers(PAGE_PATHS, path), false, `${path} should be excluded`);
    assert.equal(sourceCovers(FRAME_PROTECTED_PATHS, path), false, `${path} should be excluded`);
  }
});

test("every real route is covered, including robots and sitemap", () => {
  // A preview host's robots.txt and sitemap.xml should still say noindex.
  for (const path of [
    "/",
    "/councils",
    "/councils/stirling",
    "/take-home-pay-calculator-scotland",
    "/representatives/mps/glasgow-east",
    "/embed/child-poverty",
    "/robots.txt",
    "/sitemap.xml",
  ]) {
    assert.equal(sourceCovers(PAGE_PATHS, path), true, `${path} should be covered`);
  }
});

test("embeds can be framed and normal pages cannot", () => {
  for (const path of ["/embed", "/embed/child-poverty", "/embed/area-renfrewshire"]) {
    assert.equal(sourceCovers(FRAME_PROTECTED_PATHS, path), false, `${path} should be framable`);
  }
  for (const path of ["/", "/councils", "/embedded-charts-guide"]) {
    assert.equal(sourceCovers(FRAME_PROTECTED_PATHS, path), true, `${path} should be protected`);
  }
});

test("noindex is skipped on the canonical host and nowhere else", () => {
  const [noindex] = pageHeaderRules("scotlandcounted.org.uk");
  assert.deepEqual(noindex.missing, [{ type: "host", value: "scotlandcounted.org.uk" }]);
  assert.deepEqual(noindex.headers, [{ key: "X-Robots-Tag", value: "noindex, follow" }]);
});

test("the moderation rule comes last, so its stricter headers win", () => {
  const last = pageHeaderRules("scotlandcounted.org.uk").at(-1)!;
  assert.equal(last.source, "/review-moderation/:path*");
  const robots = last.headers.find((h) => h.key === "X-Robots-Tag")?.value ?? "";
  assert.match(robots, /\bnofollow\b/);
  assert.match(robots, /\bnoindex\b/);
});
