/**
 * Performance budgets, measured in a real browser.
 *
 * Usage:
 *   node scripts/check-budgets.mjs            check against the budgets below
 *   node scripts/check-budgets.mjs --measure  print what the pages weigh now
 *
 * Point it at a running production server:
 *   CHECK_BASE_URL=http://localhost:3211 node scripts/check-budgets.mjs
 *
 * Why bytes over the wire rather than the build's own report: the build tells
 * you what it produced, and a reader on a phone pays for what actually gets
 * fetched, which includes fonts, the document itself and anything a client
 * component pulls in after hydration.
 *
 * Budgets are set from measurement with a little headroom, not from a round
 * number somebody liked. If one of these fails, the honest options are to make
 * the page lighter or to change the budget deliberately and say why.
 */
import { chromium } from "playwright";

const BASE = (process.env.CHECK_BASE_URL || "http://127.0.0.1:3211").replace(/\/$/, "");
const MEASURE = process.argv.includes("--measure");

if (!/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(BASE) && !process.env.ALLOW_REMOTE) {
  console.error(`Refusing to load ${BASE}. Set ALLOW_REMOTE=1 to override.`);
  process.exit(2);
}

/** Kilobytes of uncompressed response body, per page. */
const BUDGETS = {
  "/": { js: 1150, total: 2000 },
  "/areas": { js: 1150, total: 2150 },
  "/areas/glasgow-city": { js: 1200, total: 2200 },
  "/councils/glasgow-city": { js: 1150, total: 1950 },
  "/money": { js: 1100, total: 1800 },
  "/take-home-pay-calculator-scotland": { js: 1220, total: 2100 },
  "/find-my-mp-and-msp": { js: 1160, total: 2000 },
  "/blog": { js: 1160, total: 2550 },
  "/press": { js: 1150, total: 1950 },
};

const browser = await chromium.launch();
const rows = [];

for (const path of Object.keys(BUDGETS)) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const seen = new Map();

  page.on("response", async (res) => {
    const url = res.url();
    if (!url.startsWith(BASE)) return;
    try {
      const body = await res.body();
      seen.set(url, { bytes: body.length, type: res.request().resourceType() });
    } catch {
      /* redirects and aborted requests carry no body */
    }
  });

  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const bucket = { script: 0, stylesheet: 0, font: 0, image: 0, document: 0, other: 0 };
  for (const { bytes, type } of seen.values()) {
    bucket[type in bucket ? type : "other"] += bytes;
  }
  const total = Object.values(bucket).reduce((a, b) => a + b, 0);
  rows.push({ path, ...bucket, total, requests: seen.size });
  await context.close();
}

await browser.close();

const kb = (n) => Math.round(n / 1024);
const pad = (n) => String(kb(n)).padStart(7);

console.log(
  "page".padEnd(38) + "  reqs" + "      JS" + "     CSS" + "    font" + "     img" + "    HTML" + "   TOTAL"
);
for (const r of rows) {
  console.log(
    r.path.padEnd(38) +
      String(r.requests).padStart(6) +
      pad(r.script) + pad(r.stylesheet) + pad(r.font) + pad(r.image) + pad(r.document) + pad(r.total)
  );
}
console.log("\nkilobytes, uncompressed response bodies");

if (MEASURE) process.exit(0);

const over = [];
for (const r of rows) {
  const budget = BUDGETS[r.path];
  if (kb(r.script) > budget.js) over.push(`${r.path}: JS ${kb(r.script)}kB over budget ${budget.js}kB`);
  if (kb(r.total) > budget.total) over.push(`${r.path}: total ${kb(r.total)}kB over budget ${budget.total}kB`);
}

if (over.length) {
  console.error(`\n${over.length} page(s) over budget:`);
  for (const line of over) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} pages within budget.`);
