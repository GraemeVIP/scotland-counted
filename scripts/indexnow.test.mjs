import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveChangedPaths,
  normalizeCanonicalUrl,
  parsePostCatalog,
  postIndexNow,
  staticPagePath,
  submissionFingerprint,
  verifyDeployment,
} from "./indexnow.mjs";

const SITE = "https://scotlandcounted.org.uk";
const KEY = "9e299ef33d078ff12fc3a9f51833ffa5";

function postsSource(entries) {
  return `export const posts = [\n${entries.map(({ slug, category, title = slug }) => `  {\n    slug: "${slug}",\n    title: "${title}",\n    category: "${category}",\n  },`).join("\n")}\n];`;
}

test("normalizes only canonical HTTPS URLs without query strings", () => {
  assert.equal(normalizeCanonicalUrl("/blog/example/", SITE), `${SITE}/blog/example`);
  assert.equal(normalizeCanonicalUrl(`${SITE}/`, SITE), SITE);
  assert.throws(() => normalizeCanonicalUrl("https://example.com/page", SITE), /canonical origin/);
  assert.throws(() => normalizeCanonicalUrl("/page?preview=1", SITE), /query or fragment/);
});

test("maps only static App Router pages automatically", () => {
  assert.equal(staticPagePath("src/app/(site)/about/page.tsx"), "/about");
  assert.equal(staticPagePath("src/app/(site)/page.tsx"), "/");
  assert.equal(staticPagePath("src/app/(site)/areas/[slug]/page.tsx"), null);
  assert.equal(staticPagePath("src/app/embed/[slug]/page.tsx"), null);
});

test("maps a changed article to its article, hub and indexable category", () => {
  const currentPosts = parsePostCatalog(postsSource([
    { slug: "one", category: "money-and-bills" },
    { slug: "two", category: "money-and-bills" },
    { slug: "three", category: "money-and-bills" },
  ]));
  const result = deriveChangedPaths({
    changes: [{ status: "M", file: "src/content/posts/one.tsx" }],
    currentPosts,
  });
  assert.deepEqual(result.unmapped, []);
  assert.deepEqual(result.candidates.map((item) => item.path), [
    "/blog",
    "/blog/category/money-and-bills",
    "/blog/one",
  ]);
});

test("fails closed on shared source files that cannot identify exact pages", () => {
  const result = deriveChangedPaths({
    changes: [{ status: "M", file: "src/components/Chrome.tsx" }],
    currentPosts: new Map(),
  });
  assert.deepEqual(result.candidates, []);
  assert.deepEqual(result.unmapped, ["src/components/Chrome.tsx"]);
});

test("submission fingerprints are order-independent and revision-specific", () => {
  const a = submissionFingerprint(SITE, "abc", [`${SITE}/b`, `${SITE}/a`]);
  const b = submissionFingerprint(SITE, "abc", [`${SITE}/a`, `${SITE}/b`]);
  const c = submissionFingerprint(SITE, "def", [`${SITE}/a`, `${SITE}/b`]);
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test("deployment verification requires the key, sitemap, self-canonical and indexability", async () => {
  const page = `${SITE}/blog/example`;
  const responses = new Map([
    [`${SITE}/${KEY}.txt`, new Response(`${KEY}\n`, { status: 200 })],
    [`${SITE}/sitemap.xml`, new Response(`<urlset><url><loc>${page}</loc></url></urlset>`, { status: 200 })],
    [page, new Response(`<html><head><link rel="canonical" href="${page}"><meta name="robots" content="index, follow"></head></html>`, { status: 200 })],
  ]);
  const fetchImpl = async (url) => responses.get(url)?.clone() ?? new Response("missing", { status: 404 });

  await assert.doesNotReject(verifyDeployment({
    candidates: [{ url: page, action: "changed" }],
    siteUrl: SITE,
    key: KEY,
    keyFile: `${KEY}.txt`,
    fetchImpl,
  }));

  responses.set(page, new Response(`<meta name="robots" content="noindex, follow"><link rel="canonical" href="${page}">`, { status: 200 }));
  await assert.rejects(verifyDeployment({
    candidates: [{ url: page, action: "changed" }],
    siteUrl: SITE,
    key: KEY,
    keyFile: `${KEY}.txt`,
    fetchImpl,
  }), /meta robots noindex/);
});

test("IndexNow treats 200 and 202 as accepted and fails loudly on other responses", async () => {
  const urls = [`${SITE}/blog/example`];
  await assert.equal(await postIndexNow({
    urls,
    siteUrl: SITE,
    key: KEY,
    fetchImpl: async () => new Response("", { status: 202 }),
  }), 202);

  await assert.rejects(postIndexNow({
    urls,
    siteUrl: SITE,
    key: KEY,
    fetchImpl: async () => new Response("key not found", { status: 403 }),
  }), /HTTP 403: key not found/);
});
