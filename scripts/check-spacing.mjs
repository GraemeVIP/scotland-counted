#!/usr/bin/env node
/**
 * Are any words glued to a link, a glossary term or a bold phrase?
 *
 * SWC drops the leading space of a JSX text node that wraps to another line.
 * So this, which reads correctly in the editor:
 *
 *     Band {letter} is <strong>{RATIOS[letter]}</strong> of your council's Band D
 *     rate. That fraction is fixed by law.
 *
 * shipped as "240/360of your council's". The same rule swallows the space
 * before an element when the text ends a line, which published "Arevenue
 * budget pays for everyday services" on all 32 council pages. Neither is
 * visible in review and neither shows up in a typecheck.
 *
 * It cannot be caught reliably in the source: the shape that breaks is
 * indistinguishable from hundreds of harmless ones without a JSX parser. The
 * rendered HTML is unambiguous, so this checks that instead.
 *
 *   npm run build && npm start &
 *   node scripts/check-spacing.mjs [baseUrl]
 *
 * Exits 0 when no page glues a word to an inline element, 1 otherwise.
 */

const BASE = (process.argv[2] || process.env.CHECK_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Inline elements whose text runs on with the sentence around them. */
const OPENING = /(.)<(?:button class="gl"|a |strong|em|abbr|code)[^>]*>([^<\s])/g;
const CLOSING = /([^\s>])<\/(?:a|strong|em|abbr|code|button)>(.)/g;

const isWordChar = (c) => /[A-Za-z0-9]/.test(c);

async function pagePaths() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/",
  );
}

async function check(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) return [{ path, snippet: `HTTP ${res.status}` }];
  const html = await res.text();
  // Chrome and footer repeat on every page; only the body copy is interesting.
  const body = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? html;
  const found = [];
  for (const re of [OPENING, CLOSING]) {
    re.lastIndex = 0;
    for (const m of body.matchAll(re)) {
      if (isWordChar(m[1]) && isWordChar(m[2])) {
        found.push({ path, snippet: body.slice(Math.max(0, m.index - 45), m.index + 60).replace(/\s+/g, " ") });
      }
    }
  }
  return found;
}

const paths = await pagePaths();
const results = [];
// Batched so a 400-page site does not open 400 sockets at once.
for (let i = 0; i < paths.length; i += 12) {
  const batch = await Promise.all(paths.slice(i, i + 12).map(check));
  results.push(...batch.flat());
}

console.log(`Checked ${paths.length} pages.`);
if (results.length === 0) {
  console.log("No words glued to an inline element.");
  process.exit(0);
}

const seen = new Set();
for (const { path, snippet } of results) {
  if (seen.has(snippet)) continue;
  seen.add(snippet);
  console.error(`\n  ${path}\n    ${snippet}`);
}
console.error(`\n${results.length} glued word(s) across ${new Set(results.map((r) => r.path)).size} page(s).`);
console.error("Fix by putting an explicit {\" \"} where the space belongs.");
process.exit(1);
