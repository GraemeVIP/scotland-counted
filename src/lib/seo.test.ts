import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ENTITY,
  orgJsonLd,
  articleJsonLd,
  datasetJsonLd,
  videoJsonLd,
  imageJsonLd,
} from "./structuredData.ts";
import { site } from "../../site.config.ts";

/*
 * Who the site says it is, to a machine.
 *
 * Nobody reads structured data, which is exactly why it drifts. For a long
 * time every article and dataset here named the author's consultancy as its
 * publisher, so the machine-readable version of an independent public-data
 * site described a commercial one. Nothing on the page looked wrong.
 *
 * fileURLToPath, not URL.pathname: the repository path contains a space and
 * pathname hands back %20.
 */
const ROOT = fileURLToPath(new URL("../../", import.meta.url));

type Node = Record<string, unknown>;
const graph = () => orgJsonLd()["@graph"] as unknown as Node[];
const byId = (id: string) => graph().find((n) => n["@id"] === id);

test("the publisher is the site, not the author's consultancy", () => {
  const org = byId(ENTITY.org);
  assert.ok(org, "no organisation node");
  assert.equal(org["name"], site.name);
  assert.equal(org["url"], site.url);
  assert.notEqual(
    org["name"],
    site.organisation.name,
    "the consultancy is being published as the site again",
  );
});

test("the consultancy exists, separately, and only the person links to it", () => {
  const consultancy = byId(ENTITY.consultancy);
  assert.ok(consultancy, "no consultancy node");
  assert.equal(consultancy["name"], site.organisation.name);

  const person = byId(ENTITY.author) as Node;
  assert.deepEqual(person["worksFor"], { "@id": ENTITY.consultancy });

  // Nothing the site publishes may point at the consultancy.
  const published = JSON.stringify([
    articleJsonLd({ headline: "H", description: "D", path: "/blog/x" }),
    datasetJsonLd({
      name: "N",
      description: "D",
      path: "/data",
      keywords: ["k"],
      temporalCoverage: "2020/2026",
    }),
    videoJsonLd({
      name: "N",
      description: "D",
      thumbnail: "/t.png",
      uploadDate: "2026-01-01",
      youtubeId: "abc",
    }),
    imageJsonLd({ src: "/i.png", alt: "a", title: "t", width: 1, height: 1 }),
  ]);
  assert.ok(
    !published.includes(site.organisation.name),
    "published content names the consultancy",
  );
  assert.ok(
    !published.includes(ENTITY.consultancy),
    "published content links the consultancy",
  );
});

test("every published thing points at the one publisher node", () => {
  const article = articleJsonLd({ headline: "H", description: "D", path: "/blog/x" }) as Node;
  const dataset = datasetJsonLd({
    name: "N",
    description: "D",
    path: "/data",
    keywords: ["k"],
    temporalCoverage: "2020/2026",
  }) as Node;
  const video = videoJsonLd({
    name: "N",
    description: "D",
    thumbnail: "/t.png",
    uploadDate: "2026-01-01",
    youtubeId: "abc",
  }) as Node;
  const image = imageJsonLd({ src: "/i.png", alt: "a", title: "t", width: 1, height: 1 }) as Node;

  for (const [label, ref] of [
    ["article", article["publisher"]],
    ["dataset", dataset["publisher"]],
    ["video", video["publisher"]],
    ["image", image["creator"]],
  ] as const) {
    assert.equal((ref as Node)?.["@id"], ENTITY.org, `${label} has its own publisher`);
    assert.equal((ref as Node)?.["name"], site.name, `${label} publisher is misnamed`);
  }

  // A dataset built from someone else's numbers must not claim to have made them.
  assert.equal(dataset["creator"], undefined, "the site is claiming it created the data");
  assert.equal(article["author"] && (article["author"] as Node)["@id"], ENTITY.author);
});

test("every @id in the graph is unique and every reference resolves", () => {
  const nodes = graph();
  const ids = nodes.map((n) => n["@id"] as string);
  assert.equal(new Set(ids).size, ids.length, "duplicate @id in the graph");

  // Collect every { "@id": ... } reference and check the graph defines it.
  const refs: string[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") {
      const node = v as Node;
      const id = node["@id"];
      if (typeof id === "string" && Object.keys(node).length <= 4 && !("@context" in node)) {
        refs.push(id);
      }
      Object.values(node).forEach(walk);
    }
  };
  nodes.forEach((n) => Object.entries(n).forEach(([k, v]) => k === "@id" || walk(v)));
  for (const ref of refs) {
    assert.ok(ids.includes(ref), `dangling reference: ${ref}`);
  }
});

test("the policy pages the organisation points at are real pages", () => {
  for (const path of [site.publisher.publishingPrinciples, site.publisher.correctionsPolicy]) {
    const page = join(ROOT, "src", "app", "(site)", path.replace(/^\//, ""), "page.tsx");
    assert.ok(existsSync(page), `${path} is claimed in structured data but has no page`);
  }
});

test("the logo is a real file, and big enough to be usable", () => {
  const org = byId(ENTITY.org) as Node;
  const logo = org["logo"] as Node;
  assert.equal(logo["url"], `${site.url}${site.publisher.logo}`);
  // app/apple-icon.png is served at /apple-icon.png by the file convention.
  assert.ok(
    existsSync(join(ROOT, "src", "app", site.publisher.logo.replace(/^\//, ""))),
    "the logo path has no file behind it",
  );
  // Google will not use a logo under 112px.
  assert.ok((logo["width"] as number) >= 112 && (logo["height"] as number) >= 112);
});

test("no entity claims a legal form, a qualification or a reviewer", () => {
  /*
   * The brief was explicit: do not invent a legal status, qualifications or
   * external reviewers. A personal project is allowed to say it is one. It is
   * not allowed to imply incorporation, accreditation or peer review in a
   * field no reader ever sees.
   */
  const banned = [
    "legalName",
    "vatID",
    "taxID",
    "duns",
    "leiCode",
    "naics",
    "isicV4",
    "foundingDate",
    "nonprofitStatus",
    "hasCredential",
    "award",
    "awards",
    "accreditation",
    "reviewedBy",
    "memberOf",
    "alumniOf",
    "knowsAbout",
  ];
  const serialised = JSON.stringify(orgJsonLd());
  for (const field of banned) {
    assert.ok(!serialised.includes(`"${field}"`), `structured data asserts ${field}`);
  }
});

test("every URL in the graph is absolute and on the canonical host", () => {
  const urls = JSON.stringify(orgJsonLd()).match(/"https?:\/\/[^"]+"/g) ?? [];
  const allowed = [site.url, site.organisation.url, site.author.url, "https://schema.org"];
  if (site.social.x) allowed.push(`https://x.com/${site.social.x}`);
  for (const raw of urls) {
    const url = raw.slice(1, -1);
    assert.ok(
      allowed.some((a) => url === a || url.startsWith(`${a}/`)),
      `unexpected host in structured data: ${url}`,
    );
  }
});

test("the publisher description says what the site is now", () => {
  const description = site.publisher.description;
  // Written as an escape, not the character. A file that spells out an em
  // dash in order to ban it is still a file containing one, and the
  // repository-wide scan is literal. seo.tsx learned this the hard way.
  assert.ok(!description.includes("\u2014"), "em dash in the publisher description");
  assert.ok(description.length > 80 && description.length < 320);
  // The repositioning: public data first, poverty as one of the subjects.
  assert.match(description, /public data/i);
  assert.ok(
    !/^A free guide to poverty/i.test(description),
    "the publisher description has drifted back to the old positioning",
  );
});
