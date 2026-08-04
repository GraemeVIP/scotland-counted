/**
 * Render-ready family group comparison for one council page.
 *
 * All the judgement-free assembly lives here, out of the JSX, so it can be
 * tested: which peer councils to name, which figures to show, and how to
 * format a raw LGBF value in the units readers already see elsewhere on the
 * page.
 *
 * The formatting map exists because of a trap found by cross-checking the two
 * datasets rather than assuming they agree: the LGBF "Real" table stores
 * percentage measures as fractions, 0.306 for 30.6%, while money and days are
 * absolute. A single generic formatter would have published family averages a
 * hundred times too small on all 32 council pages, and every one of them
 * would have looked plausible at a glance.
 */

// Extensions kept explicit so this runs under `node --test` as well as Next.
import {
  COUNCIL_FAMILY_GROUP,
  FAMILY_GROUP_MEMBERS,
  FAMILY_GROUP_SOURCE,
  FAMILY_SERIES,
  GROUP_LABELS,
  INDICATOR_GROUP_KIND,
  type FamilyGroupKind,
} from "./data/familyGroups.ts";
import { councilBenchmarks } from "./data/councilBenchmarks.ts";
import { councils } from "./data/councils.ts";

/*
 * Multiplying a fraction by 100 leaves floating point dust: 0.9525 * 100 is
 * 95.25000000000001, which toFixed rounds up to 95.3 while the benchmarks
 * pipeline, working from 95.25 directly, rounds down to 95.2. Same measure,
 * two figures, one page. toPrecision sweeps the dust before rounding, so both
 * paths land on the same digit.
 */
/*
 * toPrecision sweeps the float dust from the multiplication before rounding.
 * Exact .x5 boundaries can still round differently from the pipeline that
 * built the benchmarks displays, because the two start from different floats,
 * one from 0.9525 and one from 95.25, and no rounding rule reconciles floats
 * that already disagree. That cannot put two versions of one figure on a
 * page: where the vintages match, the council figure below reuses the
 * benchmarks display string itself.
 */
const percent = (v: number) => `${Number((v * 100).toPrecision(12)).toFixed(1)}%`;

/** How each measure's raw LGBF value reads as text. Keyed by indicator code. */
const FORMATS: Record<string, (value: number) => string> = {
  /* Fractions in the source: multiply out and say percent. */
  ENV04b: percent,
  CORP07: percent,
  ENV06: percent,
  ENV07b: percent,
  /*
   * Absolute in the source. Pence below £100 and whole pounds above, because
   * that is the convention the benchmarks rows on the same page already use,
   * and one measure shown two ways on one page reads as two measures.
   */
  ENV01a: (v) => (v >= 100 ? `£${Math.round(v).toLocaleString("en-GB")}` : `£${v.toFixed(2)}`),
  CHN01: (v) => `£${Math.round(v).toLocaleString("en-GB")}`,
  CORP06b: (v) => `${v.toFixed(1)} days`,
};

export function formatFamilyValue(code: string, value: number): string | null {
  const format = FORMATS[code];
  if (!format || !Number.isFinite(value)) return null;
  return format(value);
}

export type PeerGroup = {
  kind: FamilyGroupKind;
  /** What this set groups by, said plainly. */
  groupedBy: string;
  /** The official group, in plain English. */
  label: string;
  /** The other seven councils, named and linked. */
  peers: { slug: string; name: string }[];
};

export type FamilyMeasure = {
  code: string;
  /** The measure, in the words the page already uses. */
  label: string;
  year: string;
  council: string;
  family: string;
  scotland: string | null;
  /** Which peer set the official average is calculated over. */
  kind: FamilyGroupKind;
  /** The earliest published figure, for the trend sentence. */
  firstYear: string;
  firstValue: string;
  /** Carried from the benchmarks row where low does not mean good. */
  note?: string;
};

const nameOf = (slug: string) =>
  councils.find((c) => c.slug === slug)?.name.replace(/ Council$/, "") ?? slug;

export function peerGroupsFor(slug: string): PeerGroup[] {
  const groups = COUNCIL_FAMILY_GROUP[slug];
  if (!groups) return [];
  const describe: Record<FamilyGroupKind, string> = {
    "urban-rural": "services shaped by geography, such as bins, roads and recycling",
    deprivation: "services shaped by deprivation, such as collection rates and satisfaction",
  };
  return (Object.keys(describe) as FamilyGroupKind[]).map((kind) => ({
    kind,
    groupedBy: describe[kind],
    label: GROUP_LABELS[kind][groups[kind]] ?? groups[kind],
    peers: (FAMILY_GROUP_MEMBERS[kind][groups[kind]] ?? [])
      .filter((member) => member !== slug)
      .map((member) => ({ slug: member, name: nameOf(member) })),
  }));
}

export function familyMeasuresFor(slug: string): FamilyMeasure[] {
  const byCode = FAMILY_SERIES[slug];
  const rows = councilBenchmarks[slug];
  if (!byCode || !rows) return [];

  const measures: FamilyMeasure[] = [];
  for (const row of rows) {
    const series = byCode[row.code];
    const kind = INDICATOR_GROUP_KIND[row.code];
    if (!series || !kind) continue;

    /*
     * The latest year with a published family average. The newest row can
     * carry a council figure before the family average lands, and a
     * comparison with half its numbers missing is not a comparison.
     */
    const latest = [...series].reverse().find((y) => y.family !== null);
    const first = series.find((y) => Number.isFinite(y.council));
    if (!latest || !first) continue;

    /*
     * The council's own figure: when the benchmarks row is the same vintage,
     * its display string is reused verbatim, so this section can never show
     * a different rendering of a number that already appears higher up the
     * page. Formatting from the raw value is the fallback for the years the
     * benchmarks file does not carry.
     */
    const sameVintage = latest.year.replace("-", "/").endsWith(row.year.replace("-", "/").slice(-5));
    const council = sameVintage ? row.display.trim() : formatFamilyValue(row.code, latest.council);
    const family = latest.family === null ? null : formatFamilyValue(row.code, latest.family);
    const firstValue = formatFamilyValue(row.code, first.council);
    if (!council || !family || !firstValue) continue;

    measures.push({
      code: row.code,
      label: row.plain || row.label,
      year: latest.year,
      council,
      family,
      scotland: latest.scotland === null ? null : formatFamilyValue(row.code, latest.scotland),
      kind,
      firstYear: first.year,
      firstValue,
      ...(row.direction === "depends" && row.note ? { note: row.note } : {}),
    });
  }
  return measures;
}

export const FAMILY_SOURCE_LINE = `${FAMILY_GROUP_SOURCE.name}, ${FAMILY_GROUP_SOURCE.publisher}`;
export const FAMILY_SOURCE_URL = FAMILY_GROUP_SOURCE.page;
