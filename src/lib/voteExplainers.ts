/**
 * Plain-English explainers for parliamentary votes.
 *
 * Division titles arrive from the official record reading like legal
 * paperwork — "Draft Supply of Machinery (Safety) (Amendment etc.) and the EU
 * Machinery Regulation (Enforcement etc. in Northern Ireland) Regulations
 * 2026". Nobody this site is written for can tell from that whether their MP
 * did something that matters. The site's founder could not either, which is
 * the whole problem in one sentence.
 *
 * What CAN be explained safely, forever, is the kind of vote — what a second
 * reading is, what an amendment vote decides, what voting yes meant in that
 * kind of division. That is parliamentary procedure: it does not change from
 * bill to bill, so a pattern match on the title cannot go stale and cannot
 * misdescribe a bill's contents.
 *
 * What is deliberately NOT here is any claim about what an individual bill
 * does. That requires reading the bill, and a wrong guess published under
 * "plain English" would be worse than the jargon it replaced. Substance
 * summaries belong in SUBSTANCE below, added by hand, each one checked
 * against the bill text before it ships. The map starts almost empty on
 * purpose.
 */

export type VoteExplainer = {
  /** The kind of vote, as a short label. */
  kind: string;
  /** What it was, and what voting yes meant here. Short sentences. */
  plain: string;
};

type Rule = { pattern: RegExp; explain: VoteExplainer };

/*
 * Order matters: more specific shapes first. A "reasoned amendment to second
 * reading" must not fall through to the plain second-reading rule, because
 * voting yes means the opposite thing in each.
 */
const RULES: Rule[] = [
  {
    pattern: /reasoned amendment/i,
    explain: {
      kind: "A vote to block a new law",
      plain:
        "Some MPs tried to stop this law at its first big test. Voting yes here meant blocking it. Voting no meant letting it carry on.",
    },
  },
  {
    pattern: /second reading/i,
    explain: {
      kind: "First big vote on a new law",
      plain:
        "The first yes-or-no vote on a new law. Voting yes meant letting it move forward. Voting no meant trying to stop it early.",
    },
  },
  {
    pattern: /third reading/i,
    explain: {
      kind: "Final vote on a new law",
      plain:
        "The last vote before the law left this part of Parliament. Voting yes meant passing it.",
    },
  },
  {
    pattern: /lords amendment/i,
    explain: {
      kind: "A change asked for by the Lords",
      plain:
        "The House of Lords wanted this law changed. MPs voted on whether to accept that change.",
    },
  },
  {
    pattern: /new clause/i,
    explain: {
      kind: "A vote to add a new section",
      plain:
        "A vote on adding a new section to a law while MPs went through it in detail. Voting yes meant adding it.",
    },
  },
  {
    pattern: /report stage|(^|\W)amendment \d+/i,
    explain: {
      kind: "A vote to change part of a law",
      plain:
        "A vote on changing one part of a new law before it was finished. Voting yes meant making the change. Voting no meant leaving it as written.",
    },
  },
  {
    pattern: /opposition day/i,
    explain: {
      kind: "An opposition debate",
      plain:
        "A debate day picked by the opposition parties. This vote does not change any law by itself — but it puts every MP on the record about the issue.",
    },
  },
  {
    pattern: /programme motion|allocation of time/i,
    explain: {
      kind: "A vote about debate time",
      plain:
        "A vote about how much time MPs get to debate a law — not about the law itself.",
    },
  },
  {
    pattern: /money resolution|ways and means/i,
    explain: {
      kind: "Permission to spend money",
      plain: "A vote to let a new law spend public money.",
    },
  },
  {
    /*
     * Statutory instruments: "Draft … Regulations / Order / Rules / Code of
     * Practice". Detailed rules made under a law Parliament already passed —
     * the single most common and least understood kind of division.
     */
    pattern: /^draft .*(regulations|order|rules|code of practice)/i,
    explain: {
      kind: "Detailed rules, not a new law",
      plain:
        "A vote on switching on detailed rules made under a law that already exists. Voting yes meant the rules take effect.",
    },
  },
  // Holyrood uses stages, not readings.
  {
    pattern: /stage 1/i,
    explain: {
      kind: "First big vote on a new law",
      plain:
        "The first yes-or-no vote on a new Scottish law. Voting yes meant letting it move forward.",
    },
  },
  {
    pattern: /stage 3/i,
    explain: {
      kind: "Final vote on a new law",
      plain: "The final vote on a new Scottish law. Voting yes meant passing it.",
    },
  },
  {
    pattern: /stage 2/i,
    explain: {
      kind: "A vote to change part of a law",
      plain:
        "A vote on changing part of a new Scottish law while it was checked line by line.",
    },
  },
];

/**
 * Hand-checked summaries of what specific bills actually do, keyed by a
 * fragment of the division title, matched case-insensitively.
 *
 * Add to this ONLY after reading the bill or a primary source about it. An
 * entry here is the site asserting what a law does, in its own voice, to
 * people who will not check. The two-child-limit entries are seeded from the
 * wording already published and sourced on this site's vote round-up.
 */
export const SUBSTANCE: Array<{ match: RegExp; what: string }> = [
  {
    match: /universal credit \(removal of two child limit\)/i,
    what: "The two-child limit stopped families getting the usual benefit support for a third or later child. This bill removed it.",
  },
];

/** The kind of vote, or null when no rule matches. Never guesses substance. */
export function explainVote(title: string): VoteExplainer | null {
  for (const rule of RULES) {
    if (rule.pattern.test(title)) return rule.explain;
  }
  return null;
}

/** A hand-checked one-liner about the bill itself, when one exists. */
export function voteSubstance(title: string): string | null {
  for (const entry of SUBSTANCE) {
    if (entry.match.test(title)) return entry.what;
  }
  return null;
}

/**
 * "330 Ayes, 199 Noes" (and similar) → "Passed, 330 votes to 199".
 *
 * The official phrasing tells a reader nothing unless they already know an
 * Aye is a yes. When the string does not parse, it is returned unchanged —
 * a raw official record beats a wrong translation.
 */
export function plainResult(result: string): string {
  const m = result.match(/(\d+)\s*ayes?\s*,?\s*(\d+)\s*no(?:es)?\b/i);
  if (!m) return result;
  const ayes = parseInt(m[1], 10);
  const noes = parseInt(m[2], 10);
  if (Number.isNaN(ayes) || Number.isNaN(noes)) return result;
  return ayes > noes
    ? `Passed, ${ayes} votes to ${noes}`
    : `Did not pass — ${ayes} votes to ${noes}`;
}

/** "Aye"/"For" → "Voted yes"; "No"/"Against" → "Voted no"; otherwise as-is. */
export function plainVoteLabel(vote: string): string {
  if (/^(aye|yes|for)$/i.test(vote)) return "Voted yes";
  if (/^(no|against)$/i.test(vote)) return "Voted no";
  return vote;
}
