import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { topLevelSegments } from "../routeMap.ts";
import { ABOUT, EVIDENCE, EXPLAINERS, HUBS, PRIMARY, hubForPath } from "./navigation.ts";

/**
 * The navigation registry feeds the header, both menus, /browse and the 404,
 * so a typo here breaks the same link in five places at once and none of them
 * fails a build.
 *
 * These check the hrefs against the routes that actually exist on disk. A
 * running server would be a stronger test, and scripts/check-indexability.mjs
 * does that, but this catches a bad path in a second without one.
 */

// fileURLToPath, not URL.pathname: the repository lives under a directory with
// a space in its name, and pathname leaves it percent-encoded.
const APP = fileURLToPath(new URL("../../app/(site)/", import.meta.url));

/** Every static route that exists, as a path. Dynamic segments are skipped. */
function staticRoutes(dir = APP, prefix = ""): string[] {
  const out: string[] = [];
  if (existsSync(join(dir, "page.tsx"))) out.push(prefix || "/");
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("(")) continue;
    out.push(...staticRoutes(join(dir, entry.name), `${prefix}/${entry.name}`));
  }
  return out;
}

/* Exact match addresses served by the top level [slug] route, from routeMap.ts. */
const ROUTES = new Set([...staticRoutes(), ...topLevelSegments().map((segment) => `/${segment}`)]);

/** Dynamic routes we know exist, for hrefs that point at a specific instance. */
const DYNAMIC_PREFIXES = ["/blog/", "/areas/", "/councils/", "/constituencies/", "/indicators/"];

const menuItems = [
  ...HUBS.flatMap((hub) => [
    { href: hub.href, label: hub.label },
    { href: hub.feature.href, label: hub.feature.cta },
    ...hub.groups.flatMap((group) => group.items),
    ...hub.top,
  ]),
  EXPLAINERS,
  ...EVIDENCE,
  ...ABOUT,
];
const allHrefs = menuItems.map((item) => item.href);

test("every navigation link points at a route that exists", () => {
  for (const href of allHrefs) {
    const isDynamic = DYNAMIC_PREFIXES.some((p) => href.startsWith(p) && href.length > p.length);
    assert.ok(ROUTES.has(href) || isDynamic, `${href} is in the navigation but has no page`);
  }
});

test("six sections, each with three groups of real links", () => {
  assert.equal(HUBS.length, 6);
  assert.equal(new Set(HUBS.map((hub) => hub.id)).size, 6, "two sections share an id");
  for (const hub of HUBS) {
    assert.equal(hub.groups.length, 3, `${hub.label} should have three groups`);
    for (const group of hub.groups) assert.ok(group.items.length >= 2, `${hub.label}: ${group.heading} is nearly empty`);
    assert.ok(hub.top.length >= 2, `${hub.label} has no most searched links`);
  }
});

test("the header lists every section front door and Explainers", () => {
  assert.deepEqual(
    PRIMARY.map((item) => item.href),
    [...HUBS.map((hub) => hub.href), EXPLAINERS.href],
  );
});

test("the tools people come for stay one click from any page", () => {
  for (const required of ["/take-home-pay-calculator-scotland", "/council-tax-bands-scotland", "/email-your-mp-and-msp", "/msp-reviews", "/who-is-my-msp"]) {
    assert.ok(allHrefs.includes(required), `${required} has dropped out of the menu`);
  }
});

test("every planned keyword page that is live can be reached from the menu", () => {
  /*
   * A page nobody can navigate to only exists for search engines. Council tax
   * band pages and salary pages are reached through their own index pages,
   * which are in the menu, so those two clusters are checked by their index.
   */
  const plan = JSON.parse(readFileSync(fileURLToPath(new URL("../../../research/keywords/content-plan.json", import.meta.url)), "utf8")) as Array<{ slug: string; cluster: string }>;
  const reachable = new Set(allHrefs);
  for (const page of plan) {
    if (page.cluster === "Council tax" || page.cluster === "Salary after tax") continue;
    if (!ROUTES.has(page.slug)) continue;
    assert.ok(reachable.has(page.slug), `${page.slug} is live but not in the menu`);
  }
});

test("the phone menu opens on the section you are in", () => {
  assert.equal(hubForPath("/adult-disability-payment"), "benefits");
  assert.equal(hubForPath("/glasgow-council-tax-bands"), "tax");
  assert.equal(hubForPath("/30000-after-tax-scotland"), "money");
  assert.equal(hubForPath("/areas/fife"), "area");
  assert.equal(hubForPath("/representatives/msps"), "reps");
  assert.equal(hubForPath("/modern-studies"), "schools");
});

test("no navigation text uses an em dash or a hyphenated word", () => {
  // Matched as \u2014 rather than the character, so a sweep cannot rewrite the assertion.
  const EM_DASH = /\u2014/;
  const HYPHENATED = /[A-Za-z]-[A-Za-z]/;
  const texts = [
    ...menuItems.map((item) => item.label),
    ...HUBS.flatMap((hub) => [hub.intro, hub.feature.title, hub.feature.text, hub.feature.kicker, ...hub.groups.map((g) => g.heading)]),
  ];
  for (const text of texts) {
    assert.doesNotMatch(text, EM_DASH, text);
    assert.doesNotMatch(text, HYPHENATED, text);
  }
});

test("the evidence pages are on every page through the footer", () => {
  // These are the pages that make the site checkable. Losing one would leave it published but hidden.
  const hrefs = new Set(EVIDENCE.map((item) => item.href));
  for (const required of ["/data", "/methods", "/corrections", "/press", "/accessibility"]) {
    assert.ok(hrefs.has(required), `${required} has dropped out of the footer`);
  }
});

test("the editorial hub is labelled for what is mostly in it", () => {
  /*
   * /blog is mostly explainers and guides. Calling it "Investigations" told
   * every visitor that a minimum wage explainer was investigative journalism.
   */
  assert.equal(EXPLAINERS.href, "/blog");
  assert.equal(EXPLAINERS.label, "Explainers");
  assert.ok(!menuItems.some((item) => item.label === "Investigations"), "something is labelled Investigations as though the whole hub were one");
});

test("Branchform is still classified as an investigation", () => {
  /*
   * The other half of the same rule. Relabelling the section must not
   * quietly demote the one piece that genuinely is an investigation.
   *
   * Read as source rather than imported: posts.ts resolves through the @/
   * alias, which the test runner cannot follow.
   */
  const source = readFileSync(fileURLToPath(new URL("./posts.ts", import.meta.url)), "utf8");

  const labels = source.match(/name: "Investigations"/g) ?? [];
  assert.equal(labels.length, 1, "expected exactly one Investigations category");

  const at = source.indexOf("operation-branchform-snp-money-timeline");
  assert.ok(at > 0, "the Branchform timeline is gone");
  const record = source.slice(at, at + 3000);
  const category = record.match(/category: "([a-z-]+)"/);
  assert.ok(category, "Branchform has no category");
  assert.equal(
    category[1],
    "politics-explained",
    "Branchform changed category without the Investigations label following it",
  );
});

test("only evidence-led investigations are filed under the investigations category", () => {
  /*
   * A guide is not an investigation. An allowlist, not a head-count. The original assertion pinned the count
   * at one, which broke the moment a second genuine investigation, the
   * Crisis Grant piece, was published. The invariant worth keeping is that
   * nothing gets filed here casually: every slug in the category must be
   * named below, so adding an investigation is a deliberate two-line change
   * and misfiling an explainer still fails.
   */
  const INVESTIGATIONS = [
    "operation-branchform-snp-money-timeline",
    "crisis-grant-acceptance-rates-scotland-councils",
    "glasgow-sex-crime-rise-migrants",
    "shoplifting-scotland-record-high",
    "best-performing-councils-scotland",
  ];
  const source = readFileSync(fileURLToPath(new URL("./posts.ts", import.meta.url)), "utf8");
  /*
   * For each category marker, the record's slug is the nearest one BEFORE
   * it. A forward-looking span regex matched the category definition block
   * and skipped records longer than its window, which reported the wrong
   * slugs with complete confidence.
   */
  const slugs = [...source.matchAll(/category: "politics-explained"/g)].map((hit) => {
    const before = source.slice(0, hit.index);
    const last = [...before.matchAll(/slug: "([a-z0-9-]+)"/g)].at(-1);
    return last ? last[1] : "(no slug found)";
  });
  assert.ok(slugs.length >= 1, "the investigations category is empty");
  for (const slug of slugs) {
    assert.ok(
      INVESTIGATIONS.includes(slug),
      `${slug} is filed as an investigation but not named in the allowlist`,
    );
  }
});
