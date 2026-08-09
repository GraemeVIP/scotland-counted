import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PRIMARY,
  SECTIONS,
  QUICK_AREAS,
  INVENTORY,
  MENU_FOOTER_LINKS,
} from "./navigation.ts";

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

const ROUTES = new Set(staticRoutes());

/** Dynamic routes we know exist, for hrefs that point at a specific instance. */
const DYNAMIC_PREFIXES = ["/blog/", "/areas/", "/councils/", "/constituencies/", "/indicators/"];

const allHrefs = [
  ...PRIMARY,
  ...SECTIONS.flatMap((s) => s.items),
  ...QUICK_AREAS,
  ...MENU_FOOTER_LINKS,
].map((item) => item.href);

test("every navigation link points at a route that exists", () => {
  for (const href of allHrefs) {
    const isDynamic = DYNAMIC_PREFIXES.some((p) => href.startsWith(p) && href.length > p.length);
    assert.ok(
      ROUTES.has(href) || isDynamic,
      `${href} is in the navigation but has no page`,
    );
  }
});

test("inventory counts link somewhere real", () => {
  for (const entry of INVENTORY) {
    const isDynamic = DYNAMIC_PREFIXES.some((p) => entry.href.startsWith(p));
    assert.ok(ROUTES.has(entry.href) || isDynamic, `${entry.href} has no page`);
  }
});

test("the header has six items and each one is reachable from the menu too", () => {
  assert.equal(PRIMARY.length, 6, "the header includes the MSP review hub");
  const inSections = new Set(SECTIONS.flatMap((s) => s.items.map((i) => i.href)));
  for (const item of PRIMARY) {
    assert.ok(
      inSections.has(item.href),
      `${item.href} is in the header but not in any menu section, so it is unreachable from /browse`,
    );
  }
});

test("the MSP review hub is prominent and remains in the full menu", () => {
  assert.ok(PRIMARY.some((item) => item.href === "/msp-reviews"));
  assert.ok(SECTIONS.some((section) => section.items.some((item) => item.href === "/msp-reviews")));
});

test("each section highlights exactly one item", () => {
  // More than one featured item per column and the eye has nowhere to land.
  for (const section of SECTIONS) {
    const featured = section.items.filter((i) => i.featured).length;
    assert.equal(featured, 1, `${section.title} has ${featured} featured items, expected 1`);
  }
});

test("no navigation label or blurb uses an em dash", () => {
  // Matched as \u2014 rather than the character. A sweep that stripped em
  // dashes from prose rewrote this very assertion into a check for
  // comma-space, which would have failed on any label containing a comma.
  const EM_DASH = /\u2014/;
  for (const item of [...PRIMARY, ...SECTIONS.flatMap((s) => s.items), ...MENU_FOOTER_LINKS]) {
    assert.doesNotMatch(item.label, EM_DASH, `${item.href} label`);
    if (item.blurb) assert.doesNotMatch(item.blurb, EM_DASH, `${item.href} blurb`);
  }
  for (const section of SECTIONS) {
    assert.doesNotMatch(section.title, EM_DASH);
    assert.doesNotMatch(section.intro, EM_DASH);
  }
});

test("the evidence section still carries the accountability pages", () => {
  // These are the pages that make the site checkable. Losing one from the
  // navigation would leave it published but effectively hidden.
  const hrefs = new Set(SECTIONS.flatMap((s) => s.items.map((i) => i.href)));
  for (const required of ["/data", "/methods", "/corrections", "/press", "/accessibility"]) {
    assert.ok(hrefs.has(required), `${required} has dropped out of the menu`);
  }
});

test("the editorial hub is labelled for what is mostly in it", () => {
  /*
   * /blog is fourteen explainers and guides plus one investigation. Calling
   * the primary nav item "Investigations" told every visitor that a minimum
   * wage explainer was investigative journalism, and the page they landed on
   * said "Scotland Counted explained" at the top of it.
   *
   * This is not a style preference. A site that overstates what its own
   * articles are has a harder time being believed about anything else.
   */
  const blog = PRIMARY.find((item) => item.href === "/blog");
  assert.ok(blog, "the editorial hub left the primary navigation");
  assert.equal(blog.label, "Explainers");

  const everywhere = JSON.stringify({ PRIMARY, SECTIONS });
  assert.ok(
    !/"label":\s*"Investigations"/.test(everywhere),
    "something is still labelled Investigations as though the whole hub were one",
  );
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

test("only Branchform is filed under the investigations category", () => {
  /*
   * A guide is not an investigation. If this count ever rises, either a real
   * investigation was published, in which case update it deliberately, or an
   * explainer was misfiled, which is the thing this whole change was about.
   */
  const source = readFileSync(fileURLToPath(new URL("./posts.ts", import.meta.url)), "utf8");
  const filed = source.match(/category: "politics-explained"/g) ?? [];
  assert.equal(filed.length, 1, `${filed.length} posts are filed as investigations`);
});
