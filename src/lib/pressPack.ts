/**
 * A complete press package for one council, assembled from the data.
 *
 * Everything here is a fixed template with slots filled from a dataset field.
 * Nothing in this file works out what a figure means, decides which story is
 * the interesting one, or writes a sentence that is not already true of the
 * numbers going into it. That is deliberate and it is the whole design: a
 * generator that can phrase an opinion is a generator that will eventually
 * phrase one nobody checked, in a press release, under this site's name.
 *
 * Three rules hold it to that:
 *
 *   1. Every fact carries the source it came from. A fact with no source is
 *      dropped rather than published bare.
 *   2. A ranking claim is only made when the data says so, rank === of for
 *      last place and rank === 1 for first. Nothing is described as "among
 *      the worst" or "one of the highest", because those are judgements about
 *      where a line sits, and no line in a dataset says where its own line is.
 *   3. Measures a fresher official series has overtaken are excluded, and so
 *      are the two councils Audit Scotland itself declines to rank.
 *
 * The reader of the output is a journalist on a deadline who will paste it
 * and move on, so the caveats travel with the figures rather than sitting at
 * the bottom under a heading nobody reads.
 */

// Extensions kept explicit so this runs under `node --test` as well as Next.
import { councilBenchmarks, LGBF_SOURCE } from "./data/councilBenchmarks.ts";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "./data/councils.ts";
import {
  BUDGET_SOURCE,
  COMPARISON_CAVEAT,
  COUNCIL_TAX,
  NATIONAL,
  gapFor,
  isReserveOutlier,
} from "./data/councilBudgetMechanics.ts";
import { CITATION, COUNCIL_DATA_FILE, supersededNotes } from "./pressLines.ts";
import { site } from "../../site.config.ts";

const LGBF = `${LGBF_SOURCE.name}, ${LGBF_SOURCE.publisher}`;
const AUDIT = `${BUDGET_SOURCE.title}, ${BUDGET_SOURCE.publisher}, June 2026`;
const ECP = "End Child Poverty / Loughborough University";

import type { PressFact, PressPack } from "./pressPackText.ts";
export type { PressFact, PressPack };
export { pressPackText } from "./pressPackText.ts";

/** Codes that read as a plain last-place sentence, and how each one reads. */
const LAST_PLACE: Record<string, (name: string, here: string, scotland: string) => string> = {
  ENV04b: (n, h, s) =>
    `${n} has the worst-maintained main roads of Scotland's 32 council areas: ${h} are flagged as needing repair, against ${s} nationally`,
  ENV01a: (n, h, s) =>
    `${n} has the most expensive bin collection in Scotland at ${h} per property, against ${s} nationally`,
  CORP06b: (n, h, s) =>
    `${n} has the highest staff sickness of Scotland's 32 council areas, at ${h} lost per employee against ${s} nationally`,
  ENV06: (n, h, s) =>
    `${n} recycles less household waste than any other Scottish council area, at ${h} against ${s} nationally`,
  ENV07b: (n, h, s) =>
    `${n} has the least satisfied residents in Scotland on street cleaning: ${h} say they are happy with it, against ${s} nationally`,
};

/** The same measures, phrased for a council that comes first rather than last. */
const FIRST_PLACE: Record<string, (name: string, here: string, scotland: string) => string> = {
  ENV04b: (n, h, s) =>
    `${n} has the best-maintained main roads of Scotland's 32 council areas: ${h} are flagged as needing repair, against ${s} nationally`,
  ENV01a: (n, h, s) =>
    `${n} runs the cheapest bin collection in Scotland at ${h} per property, against ${s} nationally`,
  CORP06b: (n, h, s) =>
    `${n} has the lowest staff sickness of Scotland's 32 council areas, at ${h} lost per employee against ${s} nationally`,
  ENV06: (n, h, s) =>
    `${n} recycles more household waste than any other Scottish council area, at ${h} against ${s} nationally`,
  ENV07b: (n, h, s) =>
    `${n} has the most satisfied residents in Scotland on street cleaning: ${h} say they are happy with it, against ${s} nationally`,
};

const supersededCodes = () => new Set(supersededNotes().map((n) => n.measure));

export function pressPackFor(slug: string): PressPack | null {
  const council = councils.find((c) => c.slug === slug);
  if (!council) return null;

  const name = council.name.replace(/ Council$/, "");
  const body = `${name} Council`;
  const facts: PressFact[] = [];
  const notes: string[] = [];

  /* ---- Child poverty, straight from the series the charts use ---- */
  const latestYear = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];
  const latestPct = council.pcts[council.pcts.length - 1];
  const latestCount = council.counts[council.counts.length - 1];
  const scotlandPct = SCOTLAND_PCTS[SCOTLAND_PCTS.length - 1];

  facts.push({
    text: `${latestPct}% of children in ${name} were living in relative poverty after housing costs in ${latestYear}, which is ${latestCount.toLocaleString("en-GB")} children. The figure across Scotland was ${scotlandPct}%.`,
    source: `${ECP}, ${latestYear}`,
  });

  /*
   * The change over the series. Direction is read off the sign rather than
   * asserted, and the first year is named so nobody has to guess the window.
   */
  const change = council.change;
  if (change !== 0) {
    const direction = change > 0 ? "rose" : "fell";
    facts.push({
      text: `Child poverty in ${name} ${direction} by ${Math.abs(change).toFixed(1)} percentage points between ${COUNCIL_YEARS[0]} and ${latestYear}.`,
      source: `${ECP}, ${COUNCIL_YEARS[0]} to ${latestYear}`,
    });
  }

  /* ---- The budget gap, with the outlier caveat where it applies ---- */
  const gap = gapFor(slug);
  if (gap !== undefined) {
    const amount = `£${Math.abs(gap).toLocaleString("en-GB")}m`;
    facts.push({
      text:
        gap > 0
          ? `${body} identified a budget gap of ${amount} when setting its 2026/27 budget. ${NATIONAL.councilsWithGap} of Scotland's ${NATIONAL.councilsTotal} councils identified a gap, totalling ${NATIONAL.gapTotal}.`
          : `${body} reported a surplus of ${amount} when setting its 2026/27 budget. It was the only one of Scotland's ${NATIONAL.councilsTotal} councils to do so.`,
      source: AUDIT,
    });
    notes.push(COMPARISON_CAVEAT);
    if (isReserveOutlier(slug)) {
      notes.push(
        `Audit Scotland leaves ${name} out of its own comparison chart because its harbour reserves make it an outlier. The gap figure is stated in the bulletin, but it should not be ranked against the other councils.`,
      );
    }
  }

  facts.push({
    text: `Every Scottish council raised council tax for 2026/27, by an average of ${COUNCIL_TAX.averageIncrease}. It was the second consecutive year of increases, ${COUNCIL_TAX.twoYearAverage} over the two years together.`,
    source: AUDIT,
  });

  /* ---- Benchmarking, ranking claims only where the data supports one ---- */
  const superseded = supersededCodes();
  const rows = councilBenchmarks[slug] ?? [];
  for (const row of rows) {
    if (superseded.has(row.label)) continue;
    if (row.direction === "depends") continue;

    const isLast = row.rank === row.of;
    const isFirst = row.rank === 1;

    if (isLast && LAST_PLACE[row.code]) {
      facts.push({
        text: `${LAST_PLACE[row.code](name, row.display, row.scotlandDisplay)}.`,
        source: `${LGBF}, ${row.year}`,
      });
    } else if (isFirst && FIRST_PLACE[row.code]) {
      facts.push({
        text: `${FIRST_PLACE[row.code](name, row.display, row.scotlandDisplay)}.`,
        source: `${LGBF}, ${row.year}`,
      });
    }
  }

  for (const note of supersededNotes()) {
    notes.push(
      `${note.measure} is left out of this pack because a newer official series has overtaken the benchmarking file: ${note.newer}.`,
    );
  }

  /*
   * The headline is the first fact, cut to a headline shape. It is not chosen
   * for impact: the facts are already in a fixed order, so which one leads is
   * a property of the data and not of anyone's judgement about the story.
   */
  const budgetTail =
    gap === undefined ? "" : gap < 0 ? ", and a council budget surplus" : ", and a council budget gap";
  const headline = `${name}: ${latestPct}% of children in poverty${budgetTail}`;
  const standfirst = `Figures for ${body} from the Local Government Benchmarking Framework, Audit Scotland and End Child Poverty, with sources and the underlying file.`;

  return {
    councilName: name,
    slug,
    headline,
    standfirst,
    facts: facts.filter((f) => f.source.trim().length > 0),
    notes,
    boilerplate: `${site.publisher.description} It is written and published by ${site.author.name}. No party affiliation, no funding and no paywall.`,
    citation: CITATION,
    dataFile: `${site.url}${COUNCIL_DATA_FILE}`,
    pageUrl: `${site.url}/councils/${slug}`,
    contactUrl: `${site.url}/contact`,
  };
}

/** Every council that can produce a pack, for listing in the UI. */
export function pressPackCouncils() {
  return councils
    .map((c) => ({ slug: c.slug, name: c.name.replace(/ Council$/, "") }))
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}
