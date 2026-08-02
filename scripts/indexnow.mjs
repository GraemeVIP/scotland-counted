#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, "..");

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_KEY_FILE = "9e299ef33d078ff12fc3a9f51833ffa5.txt";
export const INDEXNOW_MAX_URLS = 10_000;

const NON_PAGE_PREFIXES = [
  ".github/",
  "docs/",
  "public/",
  "scripts/",
];

const NON_PAGE_FILES = new Set([
  ".gitignore",
  "README.md",
  "eslint.config.mjs",
  "next-env.d.ts",
  "package-lock.json",
  "package.json",
  "postcss.config.mjs",
  "tsconfig.json",
]);

function git(args, { cwd = PROJECT_ROOT, allowFailure = false } = {}) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    if (allowFailure) return null;
    const detail = error?.stderr?.toString().trim();
    throw new Error(detail || `git ${args.join(" ")} failed`);
  }
}

export function readCanonicalSiteUrl(projectRoot = PROJECT_ROOT) {
  const source = readFileSync(resolve(projectRoot, "site.config.ts"), "utf8");
  const match = source.match(/\burl:\s*["'](https:\/\/[^"']+)["']/);
  if (!match) throw new Error("Could not read the canonical HTTPS URL from site.config.ts");
  return match[1].replace(/\/+$/, "");
}

export function readIndexNowKey(projectRoot = PROJECT_ROOT) {
  const file = resolve(projectRoot, "public", INDEXNOW_KEY_FILE);
  const key = readFileSync(file, "utf8").trim();
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    throw new Error(`Invalid IndexNow key in public/${INDEXNOW_KEY_FILE}`);
  }
  if (`${key}.txt` !== INDEXNOW_KEY_FILE) {
    throw new Error("The IndexNow key filename must be {key}.txt and its contents must be the same key");
  }
  return key;
}

export function normalizeCanonicalUrl(input, siteUrl) {
  const canonicalOrigin = new URL(siteUrl).origin;
  const url = input.startsWith("/") ? new URL(input, `${canonicalOrigin}/`) : new URL(input);

  if (url.origin !== canonicalOrigin) {
    throw new Error(`IndexNow URL must use the canonical origin ${canonicalOrigin}: ${input}`);
  }
  if (url.protocol !== "https:") throw new Error(`IndexNow URL must use HTTPS: ${input}`);
  if (url.search || url.hash) throw new Error(`IndexNow URL must not contain a query or fragment: ${input}`);

  const pathname = url.pathname === "/" ? "" : url.pathname.replace(/\/+$/, "");
  return `${canonicalOrigin}${pathname}`;
}

export function staticPagePath(file) {
  if (!file.startsWith("src/app/") || !file.endsWith("/page.tsx")) return null;
  const relative = file.slice("src/app/".length, -"/page.tsx".length);
  const segments = relative.split("/").filter(Boolean).filter((segment) => !/^\(.+\)$/.test(segment));

  if (segments.some((segment) => segment.startsWith("[") || segment.startsWith("@"))) return null;
  if (["embed"].includes(segments[0])) return null;
  return segments.length ? `/${segments.join("/")}` : "/";
}

export function parsePostCatalog(source) {
  const start = source.indexOf("export const posts");
  if (start < 0) return new Map();

  const posts = new Map();
  const body = source.slice(start);
  const entryPattern = /^  \{\n    slug: "([^"]+)",([\s\S]*?)^  \},/gm;
  for (const match of body.matchAll(entryPattern)) {
    const category = match[2].match(/^    category: "([^"]+)",/m)?.[1];
    if (!category) continue;
    posts.set(match[1], { category, raw: match[0] });
  }
  return posts;
}

function categoryCounts(posts) {
  const counts = new Map();
  for (const post of posts.values()) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  return counts;
}

function addCandidate(candidates, path, action, reason) {
  const current = candidates.get(path);
  if (!current) {
    candidates.set(path, { path, action, reasons: [reason] });
    return;
  }
  if (action === "deleted") current.action = "deleted";
  if (!current.reasons.includes(reason)) current.reasons.push(reason);
}

function isKnownNonPageFile(file) {
  if (NON_PAGE_FILES.has(file)) return true;
  if (NON_PAGE_PREFIXES.some((prefix) => file.startsWith(prefix))) return true;
  if (/^src\/app\/(?:robots|sitemap|icon|apple-icon|opengraph-image)\./.test(file)) return true;
  if (file.startsWith("src/app/feed.xml/") || file.startsWith("src/app/press-img/")) return true;
  if (file === "src/content/posts/index.ts") return true;
  return false;
}

function parseNameStatus(output) {
  if (!output.trim()) return [];
  return output.trim().split("\n").map((line) => {
    const parts = line.split("\t");
    const status = parts[0];
    if (status.startsWith("R") || status.startsWith("C")) {
      return { status: status[0], oldFile: parts[1], file: parts[2] };
    }
    return { status: status[0], file: parts[1] };
  });
}

function readFileAtRevision(revision, file, projectRoot) {
  return git(["show", `${revision}:${file}`], { cwd: projectRoot, allowFailure: true }) ?? "";
}

export function deriveChangedPaths({ changes, currentPosts, previousPosts = new Map() }) {
  const candidates = new Map();
  const unmapped = new Set();
  const currentCounts = categoryCounts(currentPosts);

  const mapPost = (slug, action, reason) => {
    addCandidate(candidates, `/blog/${slug}`, action, reason);
    addCandidate(candidates, "/blog", "changed", `${reason}; article listing changed`);
    const category = currentPosts.get(slug)?.category ?? previousPosts.get(slug)?.category;
    if (category && (currentCounts.get(category) ?? 0) >= 3) {
      addCandidate(candidates, `/blog/category/${category}`, "changed", `${reason}; category listing changed`);
    }
  };

  const mapFile = (file, action, reason) => {
    const pagePath = staticPagePath(file);
    if (pagePath) {
      addCandidate(candidates, pagePath, action, reason);
      return;
    }

    const postMatch = file.match(/^src\/content\/posts\/([^/]+)\.tsx$/);
    if (postMatch) {
      mapPost(postMatch[1], action, reason);
      return;
    }

    if (file === "src/lib/data/posts.ts") return;
    if (isKnownNonPageFile(file)) return;
    if (file.startsWith("src/") || file === "site.config.ts" || file === "next.config.ts") unmapped.add(file);
  };

  for (const change of changes) {
    if (change.status === "R") {
      mapFile(change.oldFile, "deleted", `renamed from ${change.oldFile}`);
      mapFile(change.file, "changed", `renamed to ${change.file}`);
    } else {
      mapFile(change.file, change.status === "D" ? "deleted" : "changed", `${change.status} ${change.file}`);
    }
  }

  if (changes.some((change) => change.file === "src/lib/data/posts.ts" || change.oldFile === "src/lib/data/posts.ts")) {
    const slugs = new Set([...previousPosts.keys(), ...currentPosts.keys()]);
    for (const slug of slugs) {
      const before = previousPosts.get(slug);
      const after = currentPosts.get(slug);
      if (before?.raw === after?.raw) continue;
      mapPost(slug, after ? "changed" : "deleted", "post metadata changed in src/lib/data/posts.ts");
    }
  }

  return {
    candidates: [...candidates.values()].sort((a, b) => a.path.localeCompare(b.path)),
    unmapped: [...unmapped].sort(),
  };
}

export function parseArgs(argv) {
  const options = { submit: false, force: false, base: null, revision: null, urls: [], help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--submit") options.submit = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--base" || arg === "--revision" || arg === "--url") {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      i += 1;
      if (arg === "--url") options.urls.push(value);
      else options[arg.slice(2)] = value;
    } else throw new Error(`Unknown option: ${arg}`);
  }
  if (options.base && options.urls.length) throw new Error("Use either --base or one or more --url values, not both");
  if (!options.help && !options.base && options.urls.length === 0) {
    throw new Error("Provide --base <previous-deployed-git-ref> or one or more --url <canonical-path>");
  }
  if (options.force && !options.submit) throw new Error("--force is only valid with --submit");
  return options;
}

export function submissionFingerprint(siteUrl, revision, urls) {
  return createHash("sha256").update(JSON.stringify({ siteUrl, revision, urls: [...urls].sort() })).digest("hex");
}

function canonicalFromHtml(html) {
  const tag = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/href=["']([^"']+)["']/i)?.[1] ?? null;
}

function robotsFromHtml(html) {
  const tag = html.match(/<meta\s+[^>]*name=["']robots["'][^>]*>/i)?.[0];
  return tag?.match(/content=["']([^"']+)["']/i)?.[1] ?? "";
}

async function fetchWithTimeout(fetchImpl, url, init = {}) {
  return fetchImpl(url, { ...init, signal: init.signal ?? AbortSignal.timeout(15_000) });
}

export async function verifyDeployment({ candidates, siteUrl, key, keyFile = INDEXNOW_KEY_FILE, fetchImpl = fetch }) {
  const keyUrl = `${siteUrl}/${keyFile}`;
  const keyResponse = await fetchWithTimeout(fetchImpl, keyUrl, { redirect: "error", headers: { accept: "text/plain" } });
  if (keyResponse.status !== 200) {
    throw new Error(`IndexNow key is not deployed: GET ${keyUrl} returned ${keyResponse.status}`);
  }
  if ((await keyResponse.text()).trim() !== key) {
    throw new Error(`IndexNow key file at ${keyUrl} does not contain the configured key`);
  }

  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const sitemapResponse = await fetchWithTimeout(fetchImpl, sitemapUrl, { redirect: "error" });
  if (sitemapResponse.status !== 200) {
    throw new Error(`Cannot validate canonical URLs: GET ${sitemapUrl} returned ${sitemapResponse.status}`);
  }
  const sitemap = await sitemapResponse.text();
  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  for (const candidate of candidates) {
    const response = await fetchWithTimeout(fetchImpl, candidate.url, {
      redirect: "manual",
      headers: { accept: "text/html" },
    });

    if (candidate.action === "deleted") {
      if ((response.status >= 300 && response.status < 400) || response.status === 404 || response.status === 410) continue;
      throw new Error(`Deleted URL is still live with HTTP ${response.status}: ${candidate.url}`);
    }

    if (response.status !== 200) {
      throw new Error(`Changed URL is not live with HTTP 200: ${candidate.url} returned ${response.status}`);
    }
    if (!sitemapUrls.has(candidate.url)) {
      throw new Error(`Changed URL is not in the deployed canonical sitemap: ${candidate.url}`);
    }
    if (/noindex/i.test(response.headers.get("x-robots-tag") ?? "")) {
      throw new Error(`Changed URL has an X-Robots-Tag noindex header: ${candidate.url}`);
    }

    const html = await response.text();
    if (/noindex/i.test(robotsFromHtml(html))) {
      throw new Error(`Changed URL has a meta robots noindex directive: ${candidate.url}`);
    }
    const canonical = canonicalFromHtml(html);
    if (canonical !== candidate.url) {
      throw new Error(`Canonical mismatch for ${candidate.url}: received ${canonical ?? "none"}`);
    }
  }

  return { keyUrl, sitemapUrl };
}

export async function postIndexNow({ urls, siteUrl, key, fetchImpl = fetch }) {
  if (urls.length === 0) throw new Error("No changed URLs to submit");
  if (urls.length > INDEXNOW_MAX_URLS) throw new Error(`IndexNow accepts at most ${INDEXNOW_MAX_URLS} URLs per POST`);

  const response = await fetchWithTimeout(fetchImpl, INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(siteUrl).host,
      key,
      keyLocation: `${siteUrl}/${INDEXNOW_KEY_FILE}`,
      urlList: urls,
    }),
  });

  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text()).trim().slice(0, 500);
    throw new Error(`IndexNow rejected the batch with HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
  }
  return response.status;
}

function stateFile(projectRoot) {
  const gitPath = git(["rev-parse", "--git-path", "indexnow-submissions.json"], { cwd: projectRoot });
  return resolve(projectRoot, gitPath);
}

function readState(file) {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    if (!Array.isArray(parsed.submissions)) throw new Error("missing submissions array");
    return parsed;
  } catch (error) {
    if (error?.code === "ENOENT") return { submissions: [] };
    throw new Error(`Cannot read IndexNow idempotency state at ${file}: ${error.message}`);
  }
}

function recordSubmission(file, entry) {
  const state = readState(file);
  state.submissions = [entry, ...state.submissions.filter((item) => item.fingerprint !== entry.fingerprint)].slice(0, 100);
  const temporary = `${file}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  renameSync(temporary, file);
}

function help() {
  console.log(`IndexNow changed-URL notifier

Dry run from a deployed Git comparison:
  npm run indexnow:plan -- --base <previous-deployed-ref>

Dry run with explicit canonical paths:
  npm run indexnow:plan -- --url /blog/example --url /blog

Submit only after that revision and the key file are deployed:
  npm run indexnow:submit -- --base <previous-deployed-ref>

Options:
  --base <ref>       Compare the ref with HEAD and map unambiguous page changes
  --url <path|url>   Explicit changed canonical URL; may be repeated
  --revision <id>    Idempotency revision; defaults to the current Git commit
  --submit           Verify production, then POST the batch
  --force            Resubmit an already-recorded revision/URL batch
  --help             Show this help
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return help();

  const siteUrl = readCanonicalSiteUrl();
  const revision = options.revision ?? git(["rev-parse", "HEAD"]);
  let planned;
  let unmapped = [];

  if (options.urls.length) {
    planned = options.urls.map((input) => ({
      url: normalizeCanonicalUrl(input, siteUrl),
      action: "unknown",
      reasons: ["explicit --url"],
    }));
  } else {
    git(["rev-parse", "--verify", `${options.base}^{commit}`]);
    const output = git(["diff", "--name-status", "--find-renames=50%", `${options.base}..HEAD`]);
    const changes = parseNameStatus(output);
    const currentSource = readFileSync(resolve(PROJECT_ROOT, "src/lib/data/posts.ts"), "utf8");
    const previousSource = readFileAtRevision(options.base, "src/lib/data/posts.ts", PROJECT_ROOT);
    const result = deriveChangedPaths({
      changes,
      currentPosts: parsePostCatalog(currentSource),
      previousPosts: parsePostCatalog(previousSource),
    });
    unmapped = result.unmapped;
    planned = result.candidates.map((candidate) => ({
      ...candidate,
      url: normalizeCanonicalUrl(candidate.path, siteUrl),
    }));
  }

  planned = [...new Map(planned.map((candidate) => [candidate.url, candidate])).values()].sort((a, b) => a.url.localeCompare(b.url));
  if (planned.length === 0) throw new Error("No canonical page changes were found");
  if (planned.length > INDEXNOW_MAX_URLS) throw new Error(`Planned batch exceeds ${INDEXNOW_MAX_URLS} URLs`);

  console.log(`IndexNow plan for ${revision}:`);
  for (const candidate of planned) console.log(`- ${candidate.url} [${candidate.action}]`);

  if (unmapped.length) {
    console.error("\nThese content-bearing files cannot be mapped safely to exact canonical URLs:");
    for (const file of unmapped) console.error(`- ${file}`);
    throw new Error("Use explicit --url values for this deployment; nothing was submitted");
  }
  if (!options.submit) {
    console.log("\nDry run only. No request was sent.");
    return;
  }

  const urls = planned.map((candidate) => candidate.url);
  const fingerprint = submissionFingerprint(siteUrl, revision, urls);
  const statePath = stateFile(PROJECT_ROOT);
  const state = readState(statePath);
  if (!options.force && state.submissions.some((entry) => entry.fingerprint === fingerprint)) {
    console.log("\nThis exact revision and URL batch was already accepted by IndexNow; nothing was sent.");
    return;
  }

  const key = readIndexNowKey();
  await verifyDeployment({ candidates: planned, siteUrl, key });
  const status = await postIndexNow({ urls, siteUrl, key });
  recordSubmission(statePath, {
    fingerprint,
    revision,
    urls,
    status,
    submittedAt: new Date().toISOString(),
  });

  console.log(status === 202
    ? "\nIndexNow accepted the batch (HTTP 202); key validation is pending."
    : "\nIndexNow accepted the batch (HTTP 200)."
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`IndexNow: ${error.message}`);
    process.exitCode = 1;
  });
}
