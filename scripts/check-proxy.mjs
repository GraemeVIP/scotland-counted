#!/usr/bin/env node
/**
 * Does the proxy actually send the headers it is supposed to?
 *
 * The unit tests cover the matcher and the export name. They cannot cover the
 * thing that matters most: whether a request from a non-canonical host really
 * comes back marked noindex. That needs a running build and a real Host header.
 *
 * This is the check that would have caught the original bug. The proxy was
 * running, so the site looked fine, but its config was exported under a name
 * Next.js ignores, so the matcher never applied and every stylesheet and font
 * was being processed and told it was noindex.
 *
 *   npm run build && npm start &
 *   node scripts/check-proxy.mjs [baseUrl]
 *
 * Run it against a local build, never production: it sends deliberately
 * malformed Host headers, which is exactly what bot protection looks for.
 *
 * Exits 0 when every expectation holds, 1 otherwise.
 */

import { readFileSync } from "node:fs";
import http from "node:http";

/**
 * Requests go through node:http, not fetch.
 *
 * `host` is a forbidden header name in the Fetch spec, so undici drops it
 * silently. Every spoofed-host request then arrives as plain localhost, which
 * is non-canonical, so a check expecting noindex passes without testing
 * anything. The first version of this script did exactly that and reported
 * nine green checks that proved nothing.
 */
function request(path, host) {
  const url = new URL(path, BASE);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: "GET",
        headers: host ? { Host: host } : {},
      },
      (res) => {
        res.resume();
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            robots: res.headers["x-robots-tag"] ?? null,
            frame: res.headers["x-frame-options"] ?? null,
          }),
        );
      },
    );
    req.on("error", reject);
    req.end();
  });
}

function body(path, host) {
  const url = new URL(path, BASE);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "GET",
        headers: host ? { Host: host } : {},
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      },
    );
    req.on("error", reject);
    req.end();
  });
}

const BASE = (process.argv[2] || process.env.CHECK_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

if (!/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(BASE) && !process.env.ALLOW_REMOTE) {
  console.error(`Refusing to run against ${BASE}.`);
  console.error("This sends spoofed Host headers. Run it against a local build.");
  process.exit(2);
}

// The canonical host comes from the same config the proxy reads, so the check
// cannot drift from the thing it is checking.
const configSource = readFileSync(new URL("../site.config.ts", import.meta.url), "utf8");
const canonical = new URL(configSource.match(/url:\s*"([^"]+)"/)[1]).host;

const results = [];
const record = (name, pass, detail) => results.push({ name, pass, detail });

const headers = (path, host) => request(path, host);

// 1. The canonical host must stay indexable. This is the expensive one to get
//    wrong: a forgotten noindex on the real domain costs everything.
{
  const h = await headers("/", canonical);
  record("canonical host is indexable", h.robots === null, `x-robots-tag: ${h.robots ?? "(none)"}`);
}

// 2. Non-canonical and preview hosts must be told not to index.
for (const host of ["scotlandcounted.co.uk", "scotland-counted.vercel.app", "localhost:9999"]) {
  const h = await headers("/", host);
  record(`${host} is noindex`, h.robots === "noindex, follow", `x-robots-tag: ${h.robots ?? "(none)"}`);
}

// 3. noindex must keep "follow", so crawlers can still discover the site.
{
  const h = await headers("/", "scotlandcounted.co.uk");
  record(
    "noindex keeps follow",
    (h.robots ?? "").includes("follow") && !(h.robots ?? "").includes("nofollow"),
    h.robots ?? "(none)",
  );
}

// 4. Static assets must be skipped by the matcher. This is the regression.
{
  const html = await body("/", canonical);
  const asset = html.match(/\/_next\/static\/[^"']+\.css/)?.[0];
  if (!asset) {
    record("static asset excluded", false, "could not find a stylesheet to test");
  } else {
    const h = await headers(asset, "scotlandcounted.co.uk");
    record(
      "static asset skips the proxy",
      h.robots === null && h.frame === null,
      `${asset} -> robots: ${h.robots ?? "(none)"}, frame: ${h.frame ?? "(none)"}`,
    );
  }
}

// 5. Embed routes must be framable; normal pages must not.
{
  const embed = await headers("/embed", canonical);
  record("embed route is framable", embed.frame === null, `x-frame-options: ${embed.frame ?? "(none)"}`);

  const page = await headers("/councils", canonical);
  record("normal page keeps frame protection", page.frame === "SAMEORIGIN", `x-frame-options: ${page.frame ?? "(none)"}`);
}

// 6. Generated routes stay covered on a non-canonical host.
for (const path of ["/robots.txt", "/sitemap.xml"]) {
  const h = await headers(path, "scotlandcounted.co.uk");
  record(`${path} still carries noindex off-canonical`, h.robots === "noindex, follow", h.robots ?? "(none)");
}

const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? "  ok  " : "  FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
}
console.log(`\n${results.length - failed.length}/${results.length} proxy checks passed.`);
process.exit(failed.length ? 1 : 0);
