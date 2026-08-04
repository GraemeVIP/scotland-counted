import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync } from "node:fs";
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

test("the header has five items and each one is reachable from the menu too", () => {
  assert.equal(PRIMARY.length, 5, "the header is deliberately five items");
  const inSections = new Set(SECTIONS.flatMap((s) => s.items.map((i) => i.href)));
  for (const item of PRIMARY) {
    assert.ok(
      inSections.has(item.href),
      `${item.href} is in the header but not in any menu section, so it is unreachable from /browse`,
    );
  }
});

test("each section highlights exactly one item", () => {
  // More than one featured item per column and the eye has nowhere to land.
  for (const section of SECTIONS) {
    const featured = section.items.filter((i) => i.featured).length;
    assert.equal(featured, 1, `${section.title} has ${featured} featured items, expected 1`);
  }
});

test("no navigation label or blurb uses an em dash", () => {
  for (const item of [...PRIMARY, ...SECTIONS.flatMap((s) => s.items), ...MENU_FOOTER_LINKS]) {
    assert.doesNotMatch(item.label, /—/, `${item.href} label`);
    if (item.blurb) assert.doesNotMatch(item.blurb, /—/, `${item.href} blurb`);
  }
  for (const section of SECTIONS) {
    assert.doesNotMatch(section.title, /—/);
    assert.doesNotMatch(section.intro, /—/);
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
