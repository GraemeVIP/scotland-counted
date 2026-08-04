/**
 * Does every page that can be shared actually have a card?
 *
 * A link with no share image is a grey box with a domain under it. It is the
 * difference between a post that travels and one that does not, and it fails
 * silently: nothing on the page looks wrong, the build passes, and you only
 * find out when somebody shares it and it looks abandoned.
 *
 * Three things are checked for every indexable route in the sitemap:
 *
 *   the page declares a card at all, with a title and description to go in it
 *   the image URL is absolute and on the production canonical host, because a
 *     relative or localhost URL is what a scraper cannot follow
 *   the image actually resolves, as an image, with bytes in it
 *
 * The declared URL is always the production one, even when this runs against
 * a local build, because that is what the tags must say. The fetch is pointed
 * at whichever origin is being tested, so a local run proves the asset exists
 * without making several hundred requests to the live site.
 *
 * Usage:
 *   node scripts/check-social-cards.mjs [baseUrl]
 *   CHECK_BASE_URL=http://localhost:3211 npm run check:social
 */

import http from "node:http";
import https from "node:https";
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

function request(target, { method = "GET" } = {}) {
  const url = new URL(target);
  const client = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        // The canonical Host, so the proxy treats this as the real site.
        headers: { Host: new URL(CANONICAL).host },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks),
          }),
        );
      },
    );
    req.on("error", reject);
    req.end();
  });
}

const get = (path) => request(new URL(path, BASE).href);

const problems = [];
const fail = (path, what) => problems.push({ path, what });

const sitemap = await get("/sitemap.xml");
const paths = [...sitemap.body.toString("utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/",
);

console.log(`Checking share cards on ${paths.length} URLs against ${BASE}\n`);

const meta = (html, property) => {
  const patterns = [
    new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]*)"`, "i"),
    new RegExp(`<meta[^>]+content="([^"]*)"[^>]+property="${property}"`, "i"),
    new RegExp(`<meta[^>]+name="${property}"[^>]+content="([^"]*)"`, "i"),
    new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${property}"`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
};

/** Every distinct image, so each is fetched once rather than once per page. */
const images = new Map();

for (const path of paths) {
  const page = await get(path);
  if (page.status !== 200) {
    fail(path, `page returned ${page.status}`);
    continue;
  }
  const html = page.body.toString("utf8");

  const ogImage = meta(html, "og:image");
  const ogTitle = meta(html, "og:title");
  const ogDescription = meta(html, "og:description");
  const twitterCard = meta(html, "twitter:card");
  const twitterImage = meta(html, "twitter:image");

  if (!ogImage) {
    fail(path, "no og:image, so this shares as a grey box");
    continue;
  }
  if (!ogTitle) fail(path, "og:image with no og:title");
  if (!ogDescription) fail(path, "og:image with no og:description");
  if (!twitterCard) fail(path, "no twitter:card, so X will not use the large image");
  if (twitterImage && twitterImage !== ogImage) {
    fail(path, `twitter:image and og:image disagree`);
  }

  if (!/^https?:\/\//.test(ogImage)) {
    fail(path, `og:image is not absolute: ${ogImage}`);
    continue;
  }
  if (!ogImage.startsWith(`${CANONICAL}/`)) {
    fail(path, `og:image is not on the canonical host: ${ogImage}`);
    continue;
  }

  if (!images.has(ogImage)) images.set(ogImage, []);
  images.get(ogImage).push(path);
}

console.log(`${images.size} distinct card image(s) declared. Fetching each once.\n`);

for (const [imageUrl, usedBy] of images) {
  /*
   * Declared as production, fetched from wherever is under test. The
   * declaration is the thing being checked; the bytes just have to exist.
   */
  const target = imageUrl.replace(CANONICAL, BASE);
  let response;
  try {
    response = await request(target);
  } catch (error) {
    fail(usedBy[0], `card image could not be fetched: ${imageUrl} (${error.message})`);
    continue;
  }

  if (response.status !== 200) {
    fail(usedBy[0], `card image returned ${response.status}: ${imageUrl}`);
    continue;
  }
  const type = response.headers["content-type"] ?? "";
  if (!/^image\//.test(type)) {
    fail(usedBy[0], `card image is not an image (${type}): ${imageUrl}`);
    continue;
  }
  /*
   * A card under about 5kB is almost certainly a broken generator returning
   * an empty frame rather than a real 1200x630 image.
   */
  if (response.body.length < 5_000) {
    fail(usedBy[0], `card image is only ${response.body.length} bytes: ${imageUrl}`);
  }
}

const pagesWithProblems = new Set(problems.map((p) => p.path));
if (problems.length) {
  for (const path of pagesWithProblems) {
    console.log(path);
    for (const p of problems.filter((x) => x.path === path)) console.log(`   ${p.what}`);
  }
  console.log(`\n${problems.length} problem(s) across ${pagesWithProblems.size} page(s).`);
  process.exit(1);
}

console.log(`${paths.length}/${paths.length} URLs have a working share card on the canonical host.`);
