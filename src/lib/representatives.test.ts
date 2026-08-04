import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  localAreaLinks,
  parseRepresentativePostcode,
  representativePagePath,
  representativePostcodeFromRequest,
  type Representative,
} from "./representatives.ts";
import { councils } from "./data/councils.ts";
import { constituencies } from "./data/constituencies.ts";

/* fileURLToPath, not URL.pathname: the repository path contains a space. */
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

test("normalises a valid postcode without retaining the raw input", () => {
  assert.deepEqual(parseRepresentativePostcode("  g12   8qq "), {
    compact: "G128QQ",
    formatted: "G12 8QQ",
  });
  assert.equal(parseRepresentativePostcode("Glasgow"), null);
  assert.equal(parseRepresentativePostcode(128), null);
});

test("reads the normal lookup postcode from a POST body", async () => {
  const request = new Request("https://scotlandcounted.org.uk/api/representatives", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcode: "eh1 1yz" }),
  });

  assert.deepEqual(await representativePostcodeFromRequest(request), {
    compact: "EH11YZ",
    formatted: "EH1 1YZ",
  });
});

test("a postcode in the URL is ignored, whatever the method", async () => {
  /*
   * This used to be a passing test asserting the opposite. A ?postcode= that
   * works is a postcode written into the access log, the Referer header and
   * whatever the reader pastes to a friend, on a site that promises in three
   * places that it does not save your postcode.
   */
  for (const method of ["GET", "PUT", "DELETE"]) {
    const request = new Request(
      "https://scotlandcounted.org.uk/api/representatives?postcode=AB10%201AB",
      method === "GET" ? undefined : { method }
    );
    assert.equal(
      await representativePostcodeFromRequest(request),
      null,
      `${method} read a postcode out of the URL`
    );
  }

  // A POST must not pick it up out of the query string either.
  const sneaky = new Request(
    "https://scotlandcounted.org.uk/api/representatives?postcode=AB10%201AB",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }
  );
  assert.equal(await representativePostcodeFromRequest(sneaky), null);

  const badPost = new Request("https://scotlandcounted.org.uk/api/representatives", {
    method: "POST",
    body: "not-json",
  });
  assert.equal(await representativePostcodeFromRequest(badPost), null);
});

test("no API route accepts a postcode over GET", () => {
  /*
   * The library is the guard, but a route can always define its own handler
   * and read the URL itself. This reads the routes.
   */
  const apiDir = join(ROOT, "src", "app", "api");
  for (const route of readdirSync(apiDir, { withFileTypes: true })) {
    if (!route.isDirectory()) continue;
    const file = join(apiDir, route.name, "route.ts");
    if (!existsSync(file)) continue;
    const source = readFileSync(file, "utf8");
    const readsPostcodeFromUrl =
      /searchParams\s*\.\s*get\(\s*["']postcode["']\s*\)/.test(source);
    assert.ok(
      !readsPostcodeFromUrl,
      `${route.name}/route.ts reads a postcode from the query string`
    );
  }
});

test("every link a resolved postcode offers is a real, shareable page", () => {
  /*
   * The slugs are derived, not looked up, so this walks the real data and
   * fails if any council or constituency would produce a 404. It also fails
   * if a link ever carries the postcode.
   */
  for (const council of councils) {
    for (const constituency of constituencies) {
      const links = localAreaLinks({
        council: { name: council.name, slug: council.slug },
        mp: { constituency: constituency.name },
      });
      for (const link of links) {
        assert.ok(link.href.startsWith("/"), `${link.href} is not a site-relative path`);
        assert.ok(!link.href.includes("?"), `${link.href} carries a query string`);
        assert.ok(link.label.length > 0 && link.blurb.length > 0);
      }
      assert.deepEqual(links.map((l) => l.href), [
        `/areas/${council.slug}`,
        `/councils/${council.slug}`,
        `/council-tax-bands-scotland/${council.slug}`,
        `/constituencies/${constituency.slug}`,
      ]);
    }
  }
});

test("a postcode never reaches any of the links", () => {
  const links = localAreaLinks({
    council: { name: "Glasgow City Council", slug: "glasgow-city" },
    mp: { constituency: "Glasgow North" },
  });
  const serialised = JSON.stringify(links);
  assert.ok(!/G\d{1,2}\s?\d[A-Z]{2}/i.test(serialised), "a postcode leaked into the links");
  assert.deepEqual(
    links.map((l) => l.href),
    [
      "/areas/glasgow-city",
      "/councils/glasgow-city",
      "/council-tax-bands-scotland/glasgow-city",
      "/constituencies/glasgow-north",
    ]
  );
  // The spending label names the body; nothing ever reads "Council Council".
  assert.ok(links.some((l) => l.label === "What Glasgow City Council does with the money"));
  for (const council of councils) {
    const labels = localAreaLinks({
      council: { name: council.name, slug: council.slug },
      mp: { constituency: "Glasgow North" },
    }).map((l) => l.label);
    assert.ok(
      labels.every((l) => !l.includes("Council Council")),
      `${council.name} produces a doubled Council`
    );
  }
});

test("builds the matching public contact page for every representative type", () => {
  const common = {
    name: "Example Person",
    party: "Example Party",
    email: "example@parliament.test",
    profileUrl: "https://example.test/profile",
  };

  assert.equal(
    representativePagePath({
      ...common,
      role: "MP",
      constituency: "Inverness, Skye and West Ross-shire",
    } as Representative),
    "/representatives/mps/inverness-skye-and-west-ross-shire"
  );
  assert.equal(
    representativePagePath({
      ...common,
      role: "MSP",
      representationType: "constituency",
      constituency: "Na h-Eileanan an Iar",
    } as Representative),
    "/representatives/msps/constituencies/na-h-eileanan-an-iar"
  );
  assert.equal(
    representativePagePath({
      ...common,
      role: "MSP",
      representationType: "regional",
      name: "David Smith",
      constituency: "Central Scotland and Lothians West",
    } as Representative),
    "/representatives/msps/regions/central-scotland-and-lothians-west/david-smith"
  );
});
