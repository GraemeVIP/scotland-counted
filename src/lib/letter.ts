/**
 * One source of truth for the emails this site writes.
 *
 * Two places build letters: the postcode flow on /take-action (which knows a
 * council and both representatives) and the button on each constituency page
 * (which knows an MP area and its MP). They must say the same thing, so the
 * wording lives here rather than in either component.
 *
 * What a letter says now depends on the topic — see src/lib/data/letterTopics.ts.
 * Campaign letters argue from the published local figures and make specific
 * asks. Personal letters carry the reader's own words and ask the office to
 * take the matter up. The child-poverty campaign remains the default, and its
 * output is unchanged from before topics existed.
 */

import type { Representative } from "@/lib/representatives";
import { asOneIn } from "@/lib/plain-language";
import { topicById, type LetterTopic } from "@/lib/data/letterTopics";

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

/** Asks this person can actually act on, for this topic and this area. */
export function asksFor(topic: LetterTopic, role: RepresentativeRole, councilSlug?: string) {
  return (topic.asks ?? []).filter(
    (ask) => ask.who === role && (!ask.localOnly || ask.localOnly === councilSlug)
  );
}

export function letterSubject(area: LetterArea, topic: LetterTopic = topicById("child-poverty")) {
  return topic.subject(area.name);
}

export function buildLetter({
  area,
  role,
  representative,
  senderName = "",
  personal = "",
  postcode = "",
  councilSlug,
  topic = topicById("child-poverty"),
}: {
  area: LetterArea;
  role: RepresentativeRole;
  representative?: Representative;
  senderName?: string;
  personal?: string;
  postcode?: string;
  councilSlug?: string;
  topic?: LetterTopic;
}) {
  const greeting = `Dear ${representative?.name ?? `your ${role}`},`;
  const signOff = `Yours sincerely,
${senderName.trim() || "[your name]"}
[your street address]
${postcode.trim().toUpperCase() || "[your postcode]"}`;

  /* ---------- Personal: their words, and a request to act ---------- */
  if (topic.kind === "personal") {
    const detail = personal.trim() || "[describe what has happened, and what you would like them to do]";
    return `${greeting}

I live in ${area.name} and I am one of your constituents.

${topic.opening}

${detail}

I would be grateful if you could look into this and let me know what you are able to do. Please contact me at the address below.

${signOff}`;
  }

  /* ---------- Campaign: the figures, the asks, the questions ---------- */
  const asks = asksFor(topic, role, councilSlug);
  const direction = area.pct > area.firstPct ? "It has got worse." : "It has improved.";
  const personalPara = personal.trim() ? `\n${personal.trim()}\n` : "";
  const evidence = area.evidenceLine ? `${area.evidenceLine}\n\n` : "";
  const plainShare = asOneIn(area.pct);
  const shareSentence = plainShare.charAt(0).toUpperCase() + plainShare.slice(1);

  const figures = topic.useLocalEvidence
    ? `${shareSentence} children here are growing up in poverty. The exact figure is ${area.pct}%, or ${area.count.toLocaleString("en-GB")} children. It was ${area.firstPct}% in ${area.firstYear}. ${direction}

${evidence}The figures come from End Child Poverty and Loughborough University, using HMRC and DWP records. The Scottish figure for the same year was ${area.scotlandPct}%.
`
    : "";

  const questions = (topic.questions ?? []).map((q) => q.replace(/\{area\}/g, area.name));

  const asksBlock = asks.length
    ? `As my ${role}, please tell me if you will support these steps:

${asks.map((ask) => `- ${ask.line}`).join("\n")}

`
    : `As my ${role}, I would like to know where you stand on this.

`;

  const questionsBlock = questions.length
    ? `Please also tell me:

${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

I would be grateful for a clear reply to ${questions.length === 2 ? "both" : "all"} questions.

`
    : "";

  const body = `${greeting}

I live in ${area.name}, and ${topic.opening}

${figures}${personalPara}
${asksBlock}${questionsBlock}${signOff}`;

  /*
   * A topic that quotes no figures and has no personal note leaves two empty
   * blocks in a row, which prints as a double blank line. Collapsing any run of
   * three or more newlines to two fixes it without special-casing each
   * combination. The default letter contains no such run, so it is untouched.
   */
  return body.replace(/\n{3,}/g, "\n\n");
}

export function mailtoUrl(
  representative: Representative,
  area: LetterArea,
  letter: string,
  topic: LetterTopic = topicById("child-poverty")
) {
  return `mailto:${representative.email}?subject=${encodeURIComponent(
    letterSubject(area, topic)
  )}&body=${encodeURIComponent(letter)}`;
}
