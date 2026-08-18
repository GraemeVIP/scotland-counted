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

/**
 * Kilobytes of uncompressed response body, per page.
 *
 * Re-baselined 4 August 2026, deliberately, not to silence a red run. The
 * first baselines predate three shipped features: the homepage local-results
 * journey (about 29kB of shared JS on every page, plus result markup on the
 * pages that embed the postcode box), the reading rail returning to the
 * homepage, and the family-group comparison on council pages (about 36kB of
 * server-rendered HTML, no client JS). Measured after those, budgets are the
 * measurements plus about 5%. If a number here has to rise again, the commit
 * message must say which feature paid for it.
 */
const BUDGETS = {
  "/": { js: 1150, total: 2200 },
  "/areas": { js: 1150, total: 2270 },
  "/areas/glasgow-city": { js: 1220, total: 2350 },
  "/councils/glasgow-city": { js: 1130, total: 2020 },
  "/money": { js: 1080, total: 1810 },
  "/take-home-pay-calculator-scotland": { js: 1220, total: 2240 },
  /* The letter builder's URL moved here 18 Aug 2026; budget carried over,
     +20kB JS headroom for the post-data growth that came with PR 15. */
  "/email-your-mp-and-msp": { js: 1180, total: 2060 },
  /* /blog raised 18 Aug 2026: two investigations and the MSP review pages
     landed in the shared post data (PR 15 and the review merges), +62kB JS.
     Real growth from real content, but the next rise needs a lazy split. */
  "/blog": { js: 1240, total: 2680 },
  /* /press raised 18 Aug 2026: the Crisis Grant and drug-deaths posts grew
     the shared post data. 1kB JS over the old line, nothing structural. */
  "/press": { js: 1170, total: 2020 },
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
