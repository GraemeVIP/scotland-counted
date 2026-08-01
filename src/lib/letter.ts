/**
 * One source of truth for the emails this site writes.
 *
 * Two places build letters: the postcode flow on /take-action (which knows a
 * council and both representatives) and the button on each constituency page
 * (which knows an MP area and its MP). They must say the same thing, so the
 * wording lives here rather than in either component.
 */

import type { Representative } from "@/lib/representatives";
import { asOneIn } from "@/lib/plain-language";

export type RepresentativeRole = "MP" | "MSP";

/**
 * The area a letter argues from. Council pages and MP-area pages publish
 * different geographies, so a letter quotes whichever one the reader is
 * looking at — that is the figure they can check on the page in front of them.
 */
export type LetterArea = {
  name: string;
  /** Latest published child-poverty rate, after housing costs. */
  pct: number;
  /** Latest published number of children. */
  count: number;
  /** The same rate ten years earlier, and the year it refers to. */
  firstPct: number;
  firstYear: string;
  /** The national rate for the latest year, for comparison. */
  scotlandPct: number;
  /**
   * An optional extra paragraph of local evidence (currently claimant count).
   * Only councils publish these series, so MP areas leave it out.
   */
  evidenceLine?: string;
};

export const ASKS: Array<{ line: string; who: RepresentativeRole; localOnly?: string }> = [
  {
    line: "Make sure help with private rent keeps up with real rents in this area.",
    who: "MP",
  },
  {
    line: "Increase the Scottish Child Payment for the families most likely to be poor.",
    who: "MSP",
  },
  {
    line: "Make sure every family entitled to the Scottish Child Payment actually gets it.",
    who: "MSP",
  },
  {
    line: "Fund enough affordable homes to meet the level experts say Scotland needs.",
    who: "MSP",
  },
  {
    line: "Close Glasgow's homelessness funding gap so families are not left in hotels and B&Bs.",
    who: "MSP",
    localOnly: "glasgow-city",
  },
];

export function asksFor(role: RepresentativeRole, councilSlug?: string) {
  return ASKS.filter(
    (ask) => ask.who === role && (!ask.localOnly || ask.localOnly === councilSlug)
  );
}

export function letterSubject(area: LetterArea) {
  return `Poverty in ${area.name} — what will you do?`;
}

export function buildLetter({
  area,
  role,
  representative,
  senderName = "",
  personal = "",
  postcode = "",
  councilSlug,
}: {
  area: LetterArea;
  role: RepresentativeRole;
  representative?: Representative;
  senderName?: string;
  personal?: string;
  postcode?: string;
  councilSlug?: string;
}) {
  const asks = asksFor(role, councilSlug);
  const direction = area.pct > area.firstPct ? "It has got worse." : "It has improved.";
  const personalPara = personal.trim() ? `\n${personal.trim()}\n` : "";
  const evidence = area.evidenceLine ? `${area.evidenceLine}\n\n` : "";
  const plainShare = asOneIn(area.pct);
  const shareSentence = plainShare.charAt(0).toUpperCase() + plainShare.slice(1);

  return `Dear ${representative?.name ?? `your ${role}`},

I live in ${area.name}, and I am writing about poverty in our area.

${shareSentence} children here are growing up in poverty. The exact figure is ${area.pct}%, or ${area.count.toLocaleString("en-GB")} children. It was ${area.firstPct}% in ${area.firstYear}. ${direction}

${evidence}The figures come from End Child Poverty and Loughborough University, using HMRC and DWP records. The Scottish figure for the same year was ${area.scotlandPct}%.
${personalPara}
As my ${role}, please tell me if you will support these steps:

${asks.map((ask) => `- ${ask.line}`).join("\n")}

Please also tell me:

1. What have you done on these issues so far?
2. What do you expect the child-poverty figure in ${area.name} to be in five years?

I would be grateful for a clear reply to both questions.

Yours sincerely,
${senderName.trim() || "[your name]"}
[your street address]
${postcode.trim().toUpperCase() || "[your postcode]"}`;
}

export function mailtoUrl(representative: Representative, area: LetterArea, letter: string) {
  return `mailto:${representative.email}?subject=${encodeURIComponent(
    letterSubject(area)
  )}&body=${encodeURIComponent(letter)}`;
}
