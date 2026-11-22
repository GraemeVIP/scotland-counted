#!/usr/bin/env node
/**
 * Objective readability & squiggle checker for Scotland Counted pages.
 * Target: UK tabloid reading age of 8 to 10 (Flesch-Kincaid Grade <= 5.5,
 * Reading Age = FK Grade + 5 <= 10.5). Also flags banned internal/API jargon
 * and counts live glossary squiggle tooltips on each rendered page.
 *
 * Usage:
 *   node scripts/check-reading-age.mjs http://localhost:3459/mp-expenses-scotland ...
 */

const BANNED_JARGON = [
  "AllowancesMemberTransactions",
  "RegisterOfInterest",
  "individualBusinessCosts",
  "IPSA ledger",
  "central contingency",
  "heritable property",
  "remuneration",
  "non-payroll",
  "reimbursement",
  "Session 7",
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<table[\s\S]*?<\/table>/gi, " ")
    .replace(/<select[\s\S]*?<\/select>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&apos;|&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#34;|&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const cleaned = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

function analyseHtml(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = mainMatch ? mainMatch[1] : html;

  // Count glossary squiggle buttons rendered by <G>
  const squiggles = (scope.match(/class="[^"]*glossary-term|aria-expanded=/g) || []).length;

  // Extract prose blocks (<p>, <dd>, plain-text <li>) excluding tables/nav/scripts and verbatim official declarations
  const cleanedScope = scope
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<table[\s\S]*?<\/table>/gi, " ")
    .replace(/<select[\s\S]*?<\/select>/gi, " ")
    .replace(/<ul[^>]*data-verbatim="true"[\s\S]*?<\/ul>/gi, " ");

  // Extract leaf prose blocks (<p>, <dd>, and plain-text <li> without nested block cards)
  const blocks = [...cleanedScope.matchAll(/<(p|li|dd)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .filter((m) => !(m[1].toLowerCase() === "li" && /<(p|div|h[1-6]|dl|ul|ol)\b/i.test(m[2])))
    .map((m) => stripTags(m[2]))
    .filter((t) => t.length > 0);

  const sentences = [];
  for (const b of blocks) {
    for (const part of b.split(/[.!?]+/)) {
      const words = part.match(/[A-Za-z']+/g) || [];
      if (words.length >= 5) sentences.push(words);
    }
  }

  const totalSents = sentences.length || 1;
  const totalWords = sentences.reduce((a, s) => a + s.length, 0) || 1;
  const totalSyls = sentences.reduce(
    (a, s) => a + s.reduce((b, w) => b + syllables(w), 0),
    0,
  );

  const asl = totalWords / totalSents;
  const asw = totalSyls / totalWords;
  const ease = 206.835 - 1.015 * asl - 84.6 * asw;
  const grade = 0.39 * asl + 11.8 * asw - 15.59;
  const age = grade + 5;
  const over20 = sentences.filter((s) => s.length > 20).length;

  const visibleText = stripTags(scope);
  const jargonHits = BANNED_JARGON.filter((j) =>
    visibleText.toLowerCase().includes(j.toLowerCase()),
  );

  return {
    sentences: totalSents,
    words: totalWords,
    asl: Number(asl.toFixed(1)),
    ease: Number(ease.toFixed(1)),
    grade: Number(grade.toFixed(1)),
    age: Number(age.toFixed(1)),
    over20,
    squiggles,
    jargonHits,
  };
}

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Pass one or more URLs, e.g. http://localhost:3459/mp-expenses-scotland");
  process.exit(1);
}

let failed = false;
for (const url of urls) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${url}: HTTP ${res.status}`);
    failed = true;
    continue;
  }
  const html = await res.text();
  const r = analyseHtml(html);
  const ok = r.age <= 10.5 && r.jargonHits.length === 0;
  const tag = ok ? "PASS" : "HIGH";
  if (!ok) failed = true;
  console.log(
    `${tag} | Age ${String(r.age).padStart(4)} (Grade ${String(r.grade).padStart(4)}, Ease ${String(r.ease).padStart(4)}) | Avg ${String(r.asl).padStart(4)}w | >20w: ${String(r.over20).padStart(2)} | Squiggles: ${String(r.squiggles).padStart(3)} | Jargon: ${r.jargonHits.length ? r.jargonHits.join(", ") : "none"} | ${url.replace("http://localhost:3459", "")}`,
  );
}
process.exit(failed ? 1 : 0);
