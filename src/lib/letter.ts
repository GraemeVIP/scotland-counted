/**
 * One source of truth for the emails this site writes.
 *
 * Two places build letters: the postcode flow on /find-my-mp-and-msp (which knows a
 * council and both representatives) and the button on each constituency page
 * (which knows an MP area and its MP). They must say the same thing, so the
 * wording lives here rather than in either component.
 *
 * A reader ticks subjects; this turns them into at most two emails. Each one
 * carries every ticked subject that its recipient can actually act on, in one
 * organised message, under headings — because a person in trouble is usually
 * in several kinds of trouble at once, and three emails describing one
 * situation is worse for them and worse for the office reading it.
 *
 * The order of the sections is deliberate. A representative's office triages
 * casework and campaign post to different people, so anything personal comes
 * first and the policy asks follow, clearly separated. That way the casework
 * is acted on and the campaign part stays visible enough to be passed on.
 */

import type { Representative } from "@/lib/representatives";
import { asOneIn } from "@/lib/plain-language";
import {
  joinPhrases,
  topicAppliesTo,
  topicById,
  type Ask,
  type LetterTopic,
} from "@/lib/data/letterTopics";

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

/**
 * Two asks per subject, per person. The cap is the point: a letter making
 * fifteen demands reads as a form letter and gets a form reply, and someone
 * who ticks six subjects would otherwise send exactly that. An ask restricted
 * to this council goes in first, because a local demand is harder to deflect
 * than a national one.
 */
const MAX_ASKS_PER_TOPIC = 2;

function asksForTopic(topic: LetterTopic, role: RepresentativeRole, councilSlug?: string) {
  const eligible = (topic.asks ?? []).filter(
    (ask) => ask.who === role && (!ask.localOnly || ask.localOnly === councilSlug)
  );
  const local = eligible.filter((a) => a.localOnly);
  const rest = eligible.filter((a) => !a.localOnly);
  return [...local, ...rest].slice(0, MAX_ASKS_PER_TOPIC);
}

/**
 * Asks grouped under their subject heading, with repeats removed.
 *
 * Child poverty and housing both want local housing allowance unfrozen. Tick
 * both and, without this, the same demand arrives twice in one email under two
 * headings — which makes the sender look like they are not reading their own
 * letter. First occurrence wins, so the earlier subject keeps it.
 */
export function askGroups(
  topics: LetterTopic[],
  role: RepresentativeRole,
  councilSlug?: string
): Array<{ heading: string; asks: Ask[] }> {
  const used = new Set<string>();
  const groups: Array<{ heading: string; asks: Ask[] }> = [];

  for (const topic of topics) {
    if (!topicAppliesTo(topic, role)) continue;

    const asks = asksForTopic(topic, role, councilSlug).filter((ask) => {
      if (used.has(ask.key)) return false;
      used.add(ask.key);
      return true;
    });

    if (asks.length) groups.push({ heading: topic.heading, asks });
  }

  return groups;
}

/** Subjects this person can act on, in card order. */
export function topicsForRole(topics: LetterTopic[], role: RepresentativeRole) {
  return topics.filter((t) => topicAppliesTo(t, role));
}

export function letterSubject(area: LetterArea, topics: LetterTopic[]) {
  const relevant = topics.length ? topics : [topicById("child-poverty")];

  if (relevant.length === 1) {
    return `${relevant[0].heading} — ${area.name}`;
  }

  // Phrases, not headings: headings read well as titles above a list but
  // contain "and", so joining them yields "bills and the cost of living and
  // rent, housing and homelessness". The phrases are built to be joined.
  const listed = joinPhrases(relevant.slice(0, 3).map((t) => t.phrase));
  const subject = `${area.name}: ${listed}`;

  // Mail clients truncate long subjects, and a subject that ends mid-word
  // looks like a broken mail-merge rather than a person writing.
  return subject.length > 78
    ? `${relevant.length} things I need you to act on — ${area.name}`
    : subject;
}

export function buildLetter({
  area,
  role,
  representative,
  senderName = "",
  personal = "",
  postcode = "",
  councilSlug,
  topics = [],
}: {
  area: LetterArea;
  role: RepresentativeRole;
  representative?: Representative;
  senderName?: string;
  personal?: string;
  postcode?: string;
  councilSlug?: string;
  /**
   * Defaults to child poverty. The constituency pages argue that one case and
   * pass nothing, so the default keeps their letter byte-for-byte what it was.
   */
  topics?: LetterTopic[];
}) {
  const chosen = topics.length ? topics : [topicById("child-poverty")];
  const mine = topicsForRole(chosen, role);
  // Nothing here is theirs to act on. The caller should not have asked for
  // this letter, but returning something coherent beats returning a fragment.
  const subjects = mine.length ? mine : chosen;

  const greeting = `Dear ${representative?.name ?? `your ${role}`},`;
  const signOff = `Yours sincerely,
${senderName.trim() || "[your name]"}
[your street address]
${postcode.trim().toUpperCase() || "[your postcode]"}`;

  const opening = `I live in ${area.name} and I am one of your constituents.

I am writing about ${joinPhrases(subjects.map((t) => t.phrase))}.`;

  /* ---------- Their own words, first ---------- */
  const detail = personal.trim();
  const personalBlock = detail
    ? `What has happened to me

${detail}

`
    : "";

  /* ---------- The figures, if a subject calls for them ---------- */
  const wantsEvidence = subjects.some((t) => t.useLocalEvidence);
  const direction = area.pct > area.firstPct ? "It has got worse." : "It has improved.";
  const plainShare = asOneIn(area.pct);
  const shareSentence = plainShare.charAt(0).toUpperCase() + plainShare.slice(1);
  const evidence = area.evidenceLine ? `${area.evidenceLine}\n\n` : "";

  const figuresBlock = wantsEvidence
    ? `The figures where I live

${shareSentence} children here are growing up in poverty. The exact figure is ${area.pct}%, or ${area.count.toLocaleString("en-GB")} children. It was ${area.firstPct}% in ${area.firstYear}. ${direction}

${evidence}The figures come from End Child Poverty and Loughborough University, using HMRC and DWP records. The Scottish figure for the same year was ${area.scotlandPct}%.

`
    : "";

  /* ---------- The asks, grouped and deduplicated ---------- */
  const groups = askGroups(subjects, role, councilSlug);
  const asksBlock = groups.length
    ? `What I would like changed

${groups
  .map((g) => `${g.heading}\n${g.asks.map((a) => `- ${a.line}`).join("\n")}`)
  .join("\n\n")}

`
    : "";

  /* ---------- What they should do about it ---------- */
  const closing = detail
    ? groups.length
      ? "I would be grateful if you could look into my own situation and let me know what you are able to do. Please also tell me where you stand on the changes above, and what you have done about them so far."
      : "I would be grateful if you could look into this and let me know what you are able to do. Please contact me at the address below."
    : groups.length
      ? `As my ${role}, please tell me whether you support these changes, what you have done about them so far, and what you expect to change in the next five years.`
      : `As my ${role}, I would like to know where you stand on this and what you are doing about it.`;

  const body = `${greeting}

${opening}

${personalBlock}${figuresBlock}${asksBlock}${closing}

${signOff}`;

  /*
   * Blocks are optional and each ends with its own blank line, so any two that
   * sit next to each other can leave a run of newlines behind. Collapsing runs
   * of three or more to two fixes every combination at once, rather than
   * special-casing which block follows which.
   */
  return body.replace(/\n{3,}/g, "\n\n");
}

export function mailtoUrl(
  representative: Representative,
  area: LetterArea,
  letter: string,
  topics: LetterTopic[] = []
) {
  return `mailto:${representative.email}?subject=${encodeURIComponent(
    letterSubject(area, topics)
  )}&body=${encodeURIComponent(letter)}`;
}
