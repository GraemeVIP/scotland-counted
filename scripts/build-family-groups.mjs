/**
 * Build the official LGBF family groups from the published dataset.
 *
 * "Which councils is mine fairly compared with" is a question this site
 * refused to answer for a long time, on the grounds that inventing a
 * similarity rule would be inventing a comparison. That was right. What was
 * wrong was assuming nobody had already answered it.
 *
 * The Improvement Service groups all 32 councils into family groups for
 * exactly this purpose, and publishes the grouping inside the LGBF dataset
 * itself, one group per council per indicator, alongside the family group
 * average it calculates. So the grouping is theirs, the average is theirs,
 * and this script only reshapes it.
 *
 * Two sets exist and they are not interchangeable:
 *
 *   urban-rural   Urban, 2, 3, Rural
 *   deprivation   Most Deprived, 2, 3, Least Deprived
 *
 * Which set applies is a property of the indicator, not of the council, and
 * it is read from the data rather than guessed. That matters: the published
 * prose says children's measures use the deprivation groups, and CHN01, the
 * one children's measure this site carries, is on the urban-rural set. An
 * assumption would have been wrong and would have looked right.
 *
 * Usage:
 *   node scripts/build-family-groups.mjs            uses the cached CSV
 *   node scripts/build-family-groups.mjs --fetch    re-downloads it first
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const CACHE = join(ROOT, "public", "data", "lgbf-family-groups-source.csv");
const OUT = join(ROOT, "src", "lib", "data", "familyGroups.ts");

const SOURCE = {
  name: "Local Government Benchmarking Framework",
  publisher: "Improvement Service",
  page: "https://opendata.scot/datasets/improvement+service-local+government+benchmarking+framework+-+scotland/",
  file: "https://data.spatialhub.scot/dataset/9a3728b4-49ea-40af-ab10-fc0305bace84/resource/7ba35197-7ca7-4477-a38b-01fd4180466b/download/lgbf_data_table_real.csv",
};

/** Only the measures this site already publishes, so nothing new is claimed. */
const INDICATORS = ["CHN01", "CORP06b", "CORP07", "ENV01a", "ENV04b", "ENV06", "ENV07b"];

/** The dataset's council names, mapped to this site's slugs. */
const SLUGS = {
  "Aberdeen City": "aberdeen-city",
  Aberdeenshire: "aberdeenshire",
  Angus: "angus",
  "Argyll & Bute": "argyll-and-bute",
  Clackmannanshire: "clackmannanshire",
  "Dumfries & Galloway": "dumfries-and-galloway",
  "Dundee City": "dundee-city",
  "East Ayrshire": "east-ayrshire",
  "East Dunbartonshire": "east-dunbartonshire",
  "East Lothian": "east-lothian",
  "East Renfrewshire": "east-renfrewshire",
  Edinburgh: "city-of-edinburgh",
  "City of Edinburgh": "city-of-edinburgh",
  "Edinburgh City": "city-of-edinburgh",
  "Eilean Siar": "na-h-eileanan-siar",
  "Na h-Eileanan Siar": "na-h-eileanan-siar",
  "Comhairle nan Eilean Siar": "na-h-eileanan-siar",
  Falkirk: "falkirk",
  Fife: "fife",
  "Glasgow City": "glasgow-city",
  Highland: "highland",
  Inverclyde: "inverclyde",
  Midlothian: "midlothian",
  Moray: "moray",
  "North Ayrshire": "north-ayrshire",
  "North Lanarkshire": "north-lanarkshire",
  Orkney: "orkney-islands",
  "Orkney Islands": "orkney-islands",
  "Perth & Kinross": "perth-and-kinross",
  Renfrewshire: "renfrewshire",
  "Scottish Borders": "scottish-borders",
  Shetland: "shetland-islands",
  "Shetland Islands": "shetland-islands",
  "South Ayrshire": "south-ayrshire",
  "South Lanarkshire": "south-lanarkshire",
  Stirling: "stirling",
  "West Dunbartonshire": "west-dunbartonshire",
  "West Lothian": "west-lothian",
};

if (process.argv.includes("--fetch") || !existsSync(CACHE)) {
  console.log("Downloading the official LGBF table...");
  const response = await fetch(SOURCE.file, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`source returned ${response.status}`);
  writeFileSync(CACHE, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved to ${CACHE}`);
}

/* A small CSV reader. The file has no embedded commas in the fields used. */
const text = readFileSync(CACHE, "utf8").replace(/^﻿/, "");
const [headerLine, ...lines] = text.trim().split(/\r?\n/);
const header = headerLine.split(",");
const rows = lines.map((line) => {
  const cells = line.split(",");
  return Object.fromEntries(header.map((h, i) => [h, cells[i]]));
});

const unmapped = new Set();
const slugOf = (name) => {
  const slug = SLUGS[name?.trim()];
  if (!slug) unmapped.add(name);
  return slug;
};

const RURAL_LABELS = new Set(["Urban", "Rural"]);
const DEPRIVATION_LABELS = new Set(["Most Deprived", "Least Deprived"]);

/** Which set each indicator uses, read from the labels the data actually has. */
const kindOf = {};
for (const code of INDICATORS) {
  const labels = new Set(
    rows.filter((r) => r.Indicators_Information_Code === code).map((r) => r.FG_Data_FamilyGroup),
  );
  const rural = [...labels].some((l) => RURAL_LABELS.has(l));
  const deprivation = [...labels].some((l) => DEPRIVATION_LABELS.has(l));
  if (rural && deprivation) throw new Error(`${code} mixes both family group sets`);
  if (!rural && !deprivation) throw new Error(`${code} has no recognisable family group`);
  kindOf[code] = rural ? "urban-rural" : "deprivation";
}

/** The latest year each indicator has, since they do not all end together. */
const latestYear = {};
for (const code of INDICATORS) {
  const years = rows.filter((r) => r.Indicators_Information_Code === code).map((r) => r.LA_Data_LGBF_Year);
  latestYear[code] = years.sort().at(-1);
}

/*
 * Group membership. Taken per set rather than per indicator: within a set the
 * membership is the same for every indicator, which is asserted below rather
 * than assumed.
 */
const members = { "urban-rural": {}, deprivation: {} };
for (const code of INDICATORS) {
  const kind = kindOf[code];
  const forCode = {};
  for (const r of rows) {
    if (r.Indicators_Information_Code !== code) continue;
    if (r.LA_Data_LGBF_Year !== latestYear[code]) continue;
    const label = r.FG_Data_FamilyGroup;
    const slug = slugOf(r.LA_Information_LocalAuthority);
    if (!label || !slug) continue;
    (forCode[label] ??= new Set()).add(slug);
  }
  for (const [label, set] of Object.entries(forCode)) {
    const sorted = [...set].sort();
    const existing = members[kind][label];
    if (existing && existing.join() !== sorted.join()) {
      throw new Error(
        `${kind} group "${label}" differs between indicators:\n  ${existing.join(", ")}\n  ${sorted.join(", ")}`,
      );
    }
    members[kind][label] = sorted;
  }
}

/** Each council's group in each set. */
const councilGroup = {};
for (const [kind, groups] of Object.entries(members)) {
  for (const [label, slugs] of Object.entries(groups)) {
    for (const slug of slugs) {
      (councilGroup[slug] ??= {})[kind] = label;
    }
  }
}

/**
 * The family group average, as the Improvement Service calculates it, plus
 * the council's own figure, for every year both exist. Nothing is averaged
 * here: FG_Data_FG_Avg_Indicator_Real is their number.
 */
const series = {};
for (const r of rows) {
  const code = r.Indicators_Information_Code;
  if (!INDICATORS.includes(code)) continue;
  const slug = slugOf(r.LA_Information_LocalAuthority);
  if (!slug) continue;
  const council = Number(r.LA_Data_LA_IndicatorReal);
  const family = Number(r.FG_Data_FG_Avg_Indicator_Real);
  const scotland = Number(r.Scotland_Data_Scotland_Indicator_Real);
  if (!Number.isFinite(council)) continue;
  ((series[slug] ??= {})[code] ??= []).push({
    year: r.LA_Data_LGBF_Year,
    council: Number(council.toFixed(4)),
    family: Number.isFinite(family) ? Number(family.toFixed(4)) : null,
    scotland: Number.isFinite(scotland) ? Number(scotland.toFixed(4)) : null,
  });
}
for (const byCode of Object.values(series)) {
  for (const list of Object.values(byCode)) list.sort((a, b) => a.year.localeCompare(b.year));
}

if (unmapped.size) {
  throw new Error(`Unmapped council names in the source: ${[...unmapped].join(", ")}`);
}
for (const [kind, groups] of Object.entries(members)) {
  const total = Object.values(groups).reduce((n, g) => n + g.length, 0);
  if (total !== 32) throw new Error(`${kind} covers ${total} councils, expected 32`);
  if (Object.keys(groups).length !== 4) {
    throw new Error(`${kind} has ${Object.keys(groups).length} groups, expected 4`);
  }
}

const file = `/**
 * Official LGBF family groups, and the family group averages that go with
 * them. Generated by scripts/build-family-groups.mjs. Do not edit by hand.
 *
 * The grouping is the Improvement Service's, not this site's, and so is every
 * average here. That is the entire point: "councils like yours" is a
 * judgement, and this site does not make it. It reports the one the body that
 * runs the benchmarking framework already publishes.
 *
 * Two sets, and which one applies is a property of the indicator:
 *
 *   urban-rural   grouped by how urban or rural the area is
 *   deprivation   grouped by relative deprivation and affluence
 *
 * Source: ${SOURCE.name}, ${SOURCE.publisher}
 * ${SOURCE.page}
 */

export type FamilyGroupKind = "urban-rural" | "deprivation";

export const FAMILY_GROUP_SOURCE = ${JSON.stringify(SOURCE, null, 2)} as const;

/** Which set each indicator is grouped on, read from the published data. */
export const INDICATOR_GROUP_KIND: Record<string, FamilyGroupKind> = ${JSON.stringify(kindOf, null, 2)};

/** Every council in each group, by slug. */
export const FAMILY_GROUP_MEMBERS: Record<FamilyGroupKind, Record<string, string[]>> = ${JSON.stringify(members, null, 2)};

/** The group each council belongs to, in each set. */
export const COUNCIL_FAMILY_GROUP: Record<string, Record<FamilyGroupKind, string>> = ${JSON.stringify(councilGroup, null, 2)};

/**
 * Per council, per indicator: the council figure, the official family group
 * average and the Scotland figure, for every year published.
 */
export type FamilyYear = {
  year: string;
  council: number;
  family: number | null;
  scotland: number | null;
};

export const FAMILY_SERIES: Record<string, Record<string, FamilyYear[]>> = ${JSON.stringify(series)};

/** How each group reads in a sentence. */
export const GROUP_LABELS: Record<FamilyGroupKind, Record<string, string>> = {
  "urban-rural": {
    Urban: "the most urban councils",
    "2": "mainly urban councils",
    "3": "mainly rural councils",
    Rural: "the most rural councils",
  },
  deprivation: {
    "Most Deprived": "the most deprived councils",
    "2": "the next most deprived councils",
    "3": "the next most affluent councils",
    "Least Deprived": "the most affluent councils",
  },
};
`;

writeFileSync(OUT, file);

console.log(`\nWrote ${OUT}`);
for (const [kind, groups] of Object.entries(members)) {
  console.log(`\n${kind}:`);
  for (const [label, slugs] of Object.entries(groups)) {
    console.log(`  ${label} (${slugs.length}): ${slugs.join(", ")}`);
  }
}
console.log(`\nindicator sets: ${JSON.stringify(kindOf)}`);
