#!/usr/bin/env node
/**
 * Is every page in the sitemap actually indexable, and correctly described?
 *
 * These are the failures that never show up in a build: a page with two H1s,
 * a canonical pointing at a preview host, an Open Graph URL built from
 * localhost, a sitemap entry that redirects. Search engines notice all of
 * them and nothing else does.
 *
 *   npm run build && npm start &
 *   npm run check:indexability
 *
 * Run it against a local production build. It fetches every URL in the
 * sitemap, which on this site is several hundred requests in a few seconds:
 * against production that is indistinguishable from an attack, and Vercel's
 * bot protection will start serving challenge pages instead of the site.
 *
 * Exits 0 when every page passes, 1 otherwise.
 */

import http from "node:http";
import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || process.env.CHECK_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

if (!/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(BASE) && !process.env.ALLOW_REMOTE) {
  console.error(`Refusing to crawl ${BASE}.`);
  console.error("This makes hundreds of requests in seconds. Run it against a local build.");
  process.exit(2);
}

/** The canonical host, read from the same config the site builds from. */
const configSource = readFileSync(new URL("../site.config.ts", import.meta.url), "utf8");
const CANONICAL = configSource.match(/url:\s*"([^"]+)"/)[1].replace(/\/$/, "");

function get(path) {
  const url = new URL(path, BASE);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: "GET",
        // The canonical Host, so the proxy treats this as the real site and
        // does not add the noindex that every other host receives.
        headers: { Host: new URL(CANONICAL).host },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
      },
    );
    req.on("error", reject);
    req.end();
  });
}

const problems = [];
const fail = (path, what) => problems.push({ path, what });

const sitemap = await get("/sitemap.xml");
const paths = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/");

console.log(`Checking ${paths.length} URLs from the sitemap against ${BASE}\n`);

const canonicals = new Map();

async function check(path) {
  let res;
  try {
    res = await get(path);
  } catch (error) {
    fail(path, `request failed: ${error.message}`);
    return;
  }

  if (res.status !== 200) {
    // A sitemap should never list a URL that redirects or 404s.
    fail(path, `HTTP ${res.status}${res.headers.location ? ` to ${res.headers.location}` : ""}`);
    return;
  }

  if (res.headers["x-robots-tag"]?.includes("noindex")) {
    fail(path, "noindex header on the canonical host");
  }

  const head = res.body.slice(0, res.body.indexOf("</head>") + 7);

  const h1s = [...res.body.matchAll(/<h1\b/g)].length;
  if (h1s !== 1) fail(path, `${h1s} H1 elements, expected exactly 1`);

  const title = head.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) fail(path, "empty or missing title");

  const description = head.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  if (!description) fail(path, "empty or missing meta description");

  const canonical = head.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) {
    fail(path, "no canonical link");
  } else {
    const expected = `${CANONICAL}${path === "/" ? "" : path}`;
    if (canonical !== expected) fail(path, `canonical is ${canonical}, expected ${expected}`);
    if (canonicals.has(canonical)) {
      fail(path, `duplicate canonical, already claimed by ${canonicals.get(canonical)}`);
    }
    canonicals.set(canonical, path);
  }

  const ogUrl = head.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
  if (ogUrl && !ogUrl.startsWith(CANONICAL)) {
    fail(path, `Open Graph URL points off-canonical: ${ogUrl}`);
  }

  // A development or preview host leaking into production metadata.
  for (const leak of ["localhost", "127.0.0.1", "vercel.app"]) {
    if (head.includes(leak)) fail(path, `metadata contains "${leak}"`);
  }

  // Structured data with empty required fields is worse than none.
  for (const [, json] of head.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      const parsed = JSON.parse(json);
      const walk = (node, trail = "") => {
        if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${trail}[${i}]`));
        if (node && typeof node === "object") {
          for (const [key, value] of Object.entries(node)) {
            if (value === "" || value === null) fail(path, `structured data field ${trail}.${key} is empty`);
            else walk(value, `${trail}.${key}`);
          }
        }
      };
      walk(parsed);
    } catch {
      fail(path, "structured data is not valid JSON");
    }
  }
}

// Batched so a few hundred pages do not open a few hundred sockets at once.
for (let i = 0; i < paths.length; i += 12) {
  await Promise.all(paths.slice(i, i + 12).map(check));
}

// Internal links, checked on the pages most likely to carry them.
const NAV_SAMPLE = ["/", "/browse", "/areas", "/money", "/councils", "/who-decides", "/poverty"];
const known = new Set(paths);
for (const page of NAV_SAMPLE) {
  const res = await get(page);
  if (res.status !== 200) continue;
  const hrefs = [...res.body.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const href of new Set(hrefs)) {
    if (known.has(href) || href.startsWith("/_next") || href.includes(".")) continue;
    const target = await get(href);
    if (target.status !== 200) fail(page, `links to ${href} which returns ${target.status}`);
  }
}

const byPath = new Map();
for (const { path, what } of problems) {
  byPath.set(path, [...(byPath.get(path) ?? []), what]);
}

for (const [path, whats] of byPath) {
  console.log(`  ${path}`);
  for (const what of whats) console.log(`      ${what}`);
}

console.log(
  `\n${paths.length - byPath.size}/${paths.length} URLs clean, ${problems.length} problem(s) across ${byPath.size} page(s).`,
);
process.exit(problems.length ? 1 : 0);
