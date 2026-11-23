import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getTerm } from "./data/glossary.ts";

const ROOT = process.cwd();

const BANNED_JARGON = [
  "AllowancesMemberTransactions",
  "RegisterOfInterest",
  "individualBusinessCosts",
  "IPSA ledger",
  "central contingency",
  "heritable property",
  "non-payroll",
  "reimbursement",
  "Session 7",
];

const CHECKED_FILES = [
  "src/content/posts/scottish-mp-msp-expenses-what-it-could-buy.tsx",
  "src/content/posts/kilmarnock-mp-23437-electricity-bill.tsx",
  "src/content/posts/zubir-ahmed-mp-london-hotels-glasgow.tsx",
  "src/content/posts/scottish-mps-tv-licence-expenses.tsx",
  "src/content/posts/scottish-mps-london-homes-152-sitting-days.tsx",
  "src/content/posts/worst-scottish-mp-expenses.tsx",
  "src/content/posts/torcuil-crichton-mp-coaching-expenses-western-isles.tsx",
  "src/content/posts/christine-jardine-mp-christmas-lunch-expenses.tsx",
  "src/content/posts/gregor-poynton-mp-four-tv-licences-livingston.tsx",
  "src/content/posts/euan-stainbank-mp-billboard-expenses-falkirk.tsx",
  "src/content/posts/chris-law-mp-3090-broadband-expenses-dundee.tsx",
  "src/content/posts/angus-macdonald-mp-speech-coach-drains-expenses.tsx",
  "src/content/posts/pamela-nash-mp-furniture-expenses-motherwell.tsx",
  "src/content/posts/john-lamont-mp-iphone-expenses-borders.tsx",
  "src/content/posts/graeme-downie-mp-dinner-expenses-dunfermline.tsx",
  "src/content/posts/msp-expenses-scotland-investigation.tsx",
  "src/content/posts/msp-edinburgh-flats-commuter-belt.tsx",
  "src/content/posts/meghan-gallacher-msp-low-expenses.tsx",
  "src/content/posts/energy-minister-michael-shanks-flights-rutherglen.tsx",
  "src/content/posts/scottish-mp-expenses-and-freebies-investigation.tsx",
  "src/app/(site)/mp-expenses-scotland/page.tsx",
  "src/app/(site)/mp-expenses-scotland/search/page.tsx",
  "src/app/(site)/representatives/msps/_shared.tsx",
];

const REQUIRED_SQUIGGLE_IDS = [
  "ipsa",
  "holyrood",
  "westminster",
  "constituency",
  "regional-msp",
  "constituency-msp",
  "council-tax",
  "second-home",
  "winter-fuel-payment",
  "warm-home-discount",
  "register-of-interests",
  "backbencher",
  "pps",
  "minister",
  "recess",
  "hansard",
  "sitting-day",
  "councillor",
  "consultant",
  "payee",
  "engagement-provision",
  "non-refundable",
  "redundancy",
];

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
}

function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const cleaned = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

function readingAgeFromProse(tsxSource: string): number {
  const noComments = stripComments(tsxSource);
  const blocks = [
    ...noComments.matchAll(/<(Lead|P|LI)\b[^>]*>([\s\S]*?)<\/\1>/g),
  ].map((m) =>
    m[2]
      .replace(/<code[\s\S]*?<\/code>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\{\s*" "\s*\}/g, " ")
      .replace(/&apos;|&#x27;|&#39;/g, "'")
      .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  );

  const sentences: string[][] = [];
  for (const b of blocks) {
    for (const part of b.split(/[.!?]+/)) {
      const words = part.match(/[A-Za-z']+/g) ?? [];
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
  return 0.39 * asl + 11.8 * asw - 15.59 + 5;
}

describe("Scotland Counted plain English & squiggle safeguards", () => {
  it("contains zero banned API or official jargon in rendered MP and MSP pages", () => {
    for (const rel of CHECKED_FILES) {
      const text = stripComments(fs.readFileSync(path.join(ROOT, rel), "utf8"));
      for (const banned of BANNED_JARGON) {
        const re = new RegExp(`\\b${banned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        assert.ok(!re.test(text), `Found banned jargon "${banned}" in ${rel}`);
      }
    }
  });

  it("wires every necessary political and expenses word into both glossary.ts and AUTO_GLOSSARY_IDS", () => {
    const annotateSource = fs.readFileSync(
      path.join(ROOT, "src/components/glossaryAnnotate.tsx"),
      "utf8",
    );
    for (const id of REQUIRED_SQUIGGLE_IDS) {
      assert.ok(getTerm(id), `Missing glossary definition for "${id}" in src/lib/data/glossary.ts`);
      assert.ok(
        annotateSource.includes(`"${id}"`),
        `Term "${id}" is in glossary.ts but missing from AUTO_GLOSSARY_IDS in glossaryAnnotate.tsx (so it will not get a squiggle!)`,
      );
    }
  });

  it("keeps our MP and MSP investigation articles within UK tabloid Reading Age 8 to 10 (<= 10.5)", () => {
    const articles = [
      "src/content/posts/scottish-mp-msp-expenses-what-it-could-buy.tsx",
      "src/content/posts/kilmarnock-mp-23437-electricity-bill.tsx",
      "src/content/posts/zubir-ahmed-mp-london-hotels-glasgow.tsx",
      "src/content/posts/scottish-mps-tv-licence-expenses.tsx",
      "src/content/posts/scottish-mps-london-homes-152-sitting-days.tsx",
      "src/content/posts/worst-scottish-mp-expenses.tsx",
      "src/content/posts/msp-expenses-scotland-investigation.tsx",
      "src/content/posts/msp-edinburgh-flats-commuter-belt.tsx",
      "src/content/posts/meghan-gallacher-msp-low-expenses.tsx",
      "src/content/posts/energy-minister-michael-shanks-flights-rutherglen.tsx",
    ];
    for (const rel of articles) {
      const age = readingAgeFromProse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
      assert.ok(
        age <= 10.5,
        `${rel} prose reading age is ${age.toFixed(1)} (must be <= 10.5 for Age 8 to 10 target)`,
      );
    }
  });

  it("enforces zero duplicate editorial images across ALL articles in posts.ts and verifies every file exists", () => {
    const postsSource = fs.readFileSync(path.join(ROOT, "src/lib/data/posts.ts"), "utf8");
    const blocks = postsSource.split(/\n  \{\n    slug: /).slice(1);
    const seen = new Map<string, string>();
    const hubImages = new Set([
      "/images/editorial/mp-expenses-scotland-hub.webp",
      "/images/editorial/mp-expenses-scotland-receipts.webp",
      "/images/editorial/mp-msp-receipt-finder-scotland.webp",
    ]);

    for (const block of blocks) {
      const slugMatch = block.match(/^"([^"]+)"/);
      const imgMatch = block.match(/image:\s*\{[\s\S]*?src:\s*"([^"]+)"/);
      if (!slugMatch || !imgMatch) continue;
      const slug = slugMatch[1];
      const img = imgMatch[1];

      const diskPath = path.join(ROOT, "public", img);
      assert.ok(fs.existsSync(diskPath), `Missing image file on disk for ${slug}: ${diskPath}`);
      assert.ok(
        !hubImages.has(img),
        `Article "${slug}" reuses a hub page image (${img}); every article must have its own unique image.`,
      );
      assert.ok(
        !seen.has(img),
        `Duplicate editorial image "${img}" used by both "${seen.get(img)}" and "${slug}". Every article must have its own unique image.`,
      );
      seen.set(img, slug);
    }
    assert.ok(seen.size >= 70, `Expected at least 70 articles with unique images, checked ${seen.size}`);
  });
});
