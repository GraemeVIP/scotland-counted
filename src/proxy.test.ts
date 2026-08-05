import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PROXY_MATCHER, proxyRunsOn } from "./proxyMatcher.ts";

/**
 * The proxy carries the noindex that keeps preview and non-canonical hosts out
 * of search results. A failure there is invisible until the wrong domain is
 * already indexed, so it is worth pinning down.
 *
 * This file covers what can be checked without a server: the matcher, and the
 * name the config is exported under. The header behaviour itself needs a real
 * request, so it lives in scripts/check-proxy.mjs against a production build.
 *
 * The export name is asserted against the source on purpose. It shipped as
 * `proxyConfig`, which is not an error Next.js reports; it is silently ignored,
 * and the proxy then runs unmatched on every asset.
 */

const source = readFileSync(new URL("./proxy.ts", import.meta.url), "utf8");

test("the matcher is exported under the name Next.js reads", () => {
  assert.match(source, /export const config\s*=/, "config export is missing");
  assert.doesNotMatch(
    source,
    /export const proxyConfig\s*=/,
    "proxyConfig is not a name Next.js recognises, so the matcher would be ignored",
  );
});

test("the proxy function is exported under the name the file convention expects", () => {
  assert.match(source, /export (?:default )?(?:async )?function proxy\b/);
});

test("the proxy blocks non-UK Vercel requests before rendering", () => {
  assert.match(source, /VERCEL_COUNTRY_HEADER/);
  assert.match(source, /isUkVisitor/);
  assert.match(source, /status:\s*403/);
});

test("static assets are excluded from proxy processing", () => {
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
    assert.equal(proxyRunsOn(path), false, `${path} should be excluded`);
  }
});

test("every real route stays covered, including robots and sitemap", () => {
  // A preview host's robots.txt and sitemap.xml should still say noindex,
  // so they are deliberately not excluded.
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
    assert.equal(proxyRunsOn(path), true, `${path} should be covered`);
  }
});

test("the matcher is a single anchored pattern, not a directory list", () => {
  assert.ok(PROXY_MATCHER.startsWith("/"), "matcher must start with a slash");
  assert.ok(PROXY_MATCHER.includes("_next/static"), "static chunks must be excluded");
});

test("the test mirror still matches the real matcher in proxy.ts", () => {
  // proxy.ts has to spell the matcher out as a literal, because Next.js
  // static-analyses it at build time and rejects a variable. That leaves two
  // copies, so this fails the moment they drift apart.
  const literal = source.match(/matcher:\s*\[\s*"((?:[^"\\]|\\.)*)"/)?.[1];
  assert.ok(literal, "could not find the matcher literal in proxy.ts");
  const unescaped = literal.replace(/\\\\/g, "\\");
  assert.equal(
    unescaped,
    PROXY_MATCHER,
    "proxyMatcher.ts has drifted from the matcher in proxy.ts",
  );
});
