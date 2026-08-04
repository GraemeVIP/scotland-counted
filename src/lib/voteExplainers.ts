/**
 * Plain-English explainers for parliamentary votes.
 *
 * Division titles arrive from the official record reading like legal
 * paperwork, "Draft Supply of Machinery (Safety) (Amendment etc.) and the EU
 * Machinery Regulation (Enforcement etc. in Northern Ireland) Regulations
 * 2026". Nobody this site is written for can tell from that whether their MP
 * did something that matters. The site's founder could not either, which is
 * the whole problem in one sentence.
 *
 * What CAN be explained safely, forever, is the kind of vote, what a second
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
        "A debate day picked by the opposition parties. This vote does not change any law by itself, but it puts every MP on the record about the issue.",
    },
  },
  {
    pattern: /programme motion|allocation of time/i,
    explain: {
      kind: "A vote about debate time",
      plain:
        "A vote about how much time MPs get to debate a law, not about the law itself.",
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
     * Practice". Detailed rules made under a law Parliament already passed, 
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
 * Every entry was researched against a primary or official source before it
 * shipped. The source is named in the comment above each one. An entry here
 * is the site asserting what a law does, in its own voice, to people who will
 * not check, so nothing goes in from memory or inference.
 *
 * `example` is the picture-it line: where a person would actually feel this,
 * or, just as useful, a plain note that it only applies in England while
 * their Scottish MP voted on it anyway.
 *
 * Maintenance: the vote feed refreshes over time, so new divisions will
 * appear without an entry. They still get the kind-of-vote explainer; add
 * substance here as new bills show up, source first.
 */
export const SUBSTANCE: Array<{ match: RegExp; what: string; example?: string }> = [
  // Source: this site's own sourced vote round-up (votes.ts).
  {
    match: /universal credit \(removal of two child limit\)/i,
    what: "The two-child limit stopped families getting the usual benefit support for a third or later child. This bill removed it.",
    example:
      "A family with three children on Universal Credit now gets help for all three, not just the first two.",
  },
  // Source: bills.parliament.uk/bills/4254; Amnesty UK second reading briefing.
  {
    match: /immigration and asylum bill/i,
    what: "A new law to make it easier to refuse and deport people who ask for asylum. It limits appeals based on the right to family life, and replaces immigration judges with a new type of decision-maker.",
    example:
      "Immigration rules are the same across the UK, so this applies in Scotland too. It passed this stage by 264 votes to 90.",
  },
  // Source: Commons Library CBP-10359 and CBP-10424 (Hillsborough Law).
  {
    match: /public office \(accountability\) bill/i,
    what: "Known as the Hillsborough Law. It makes public officials legally bound to tell the truth and help investigations after disasters and scandals, with real penalties for cover-ups. Bereaved families get their legal costs covered, like the authorities they face.",
    example:
      "After a disaster like Hillsborough or Grenfell, officials could not lawfully close ranks, and families would not face the state\u2019s lawyers alone.",
  },
  // Source: Commons Library CBP-10896; Lords Library LLN-2026-0030.
  {
    match: /national security \(state threats\) bill/i,
    what: "Lets the government put an organisation on a banned list if it says it works for a hostile foreign state. Supporting or profiting from a listed group becomes a crime, with up to 14 years in prison.",
    example:
      "The House of Lords added protection so journalists and aid workers could not be treated as criminals just for doing their jobs. This vote was about accepting that change.",
  },
  // Source: Commons Library CBP-10913.
  {
    match: /taxation \(energy and vehicles\) bill/i,
    what: "A tax law brought in after energy prices jumped. It raises the windfall tax on electricity generators from 45% to 55%. It also raises the tax-free rate for people who drive for work, and pauses road tax for lorries for a year.",
    example:
      "If you use your own car for your job, the tax-free amount your employer can pay you per mile goes up.",
  },
  // Source: Commons order paper 7 Jul 2026; Commons Library CBP-10974.
  {
    match: /early release of prisoners/i,
    what: "The Conservatives asked MPs to demand that people convicted of sexual offences be kept out of the new early-release rules for prisoners, brought in because prisons are full.",
    example:
      "Those rules cover England and Wales, Scottish prisons follow separate Scottish rules. Your MP voted on it anyway.",
  },
  // Source: legislation.gov.uk ukdsi/2026/9780348284584; gov.uk draft Code of Practice.
  {
    match: /permissible means of voting|electronic and workplace ballots/i,
    what: "Lets union members vote online, at their workplace, or by post in union ballots, including strike votes, which used to be post-only.",
    example:
      "A nurse voting on strike action could do it on her phone instead of waiting for a form in the post.",
  },
  // Source: legislation.gov.uk ukdsi/2026/9780348282849; Hansard 23 Jun 2026.
  {
    match: /employment tribunal/i,
    what: "Part of a package giving workers six months instead of three to start an employment tribunal claim.",
    example:
      "If you are sacked unfairly, you get twice as long to bring a case, which matters when you are still reeling or hunting for a new job first.",
  },
  // Source: legislation.gov.uk ukdsi/2026/9780348282269 explanatory memorandum.
  {
    match: /climate change act 2008 \(credit limit\)/i,
    what: "Blocks the UK from using overseas carbon credits to hit its 2028 to 2032 climate target. The cuts have to happen at home.",
    example: "The government cannot buy its way to its climate promise with offsets from abroad.",
  },
  // Source: gov.uk national scheme of delegation guidance; SI ukdsi/2026/9780348283709.
  {
    match: /discharge of local planning authority functions/i,
    what: "Makes councils in England hand more planning decisions to their staff instead of elected councillors, to speed up building.",
    example:
      "This one is about England, planning in Scotland runs under Scottish law. Your MP still voted on it.",
  },
  // Source: Hansard 30 Jun 2026; SI ukdsi/2026/9780348283624.
  {
    match: /supply of machinery/i,
    what: "Keeps the safety rules for machines (cranes, diggers, even lawnmowers) in line with the EU\u2019s new rules, so the same machines can keep being sold here and in Europe. Northern Ireland follows the EU rules directly under the Brexit deal.",
    example: "A digger that passes the new EU safety checks can still be sold in Scotland.",
  },
  // Source: legislation.gov.uk ukpga/2026/21; gov.uk education hub explainer.
  {
    match: /children.?s wellbeing and schools act/i,
    what: "Tidy-up rules for a new schools law in England. New schools there no longer have to be academies, and councils get more say over them.",
    example:
      "Schools in Scotland are not affected, education is run from Holyrood. Your MP still voted on it.",
  },
  // Source: votes.parliament.uk division 2355; Commons Library CBP-10818.
  {
    match: /king.?s speech/i,
    what: "The vote on the government\u2019s whole plan for the year, set out in the King\u2019s Speech. By tradition, losing it would bring the government down.",
    example: "This is the closest thing to a yearly confidence vote MPs get.",
  },
];

/** The kind of vote, or null when no rule matches. Never guesses substance. */
export function explainVote(title: string): VoteExplainer | null {
  for (const rule of RULES) {
    if (rule.pattern.test(title)) return rule.explain;
  }
  return null;
}

/** The hand-checked story of the bill itself, when one exists. */
export function voteSubstance(title: string): { what: string; example?: string } | null {
  for (const entry of SUBSTANCE) {
    if (entry.match.test(title)) return { what: entry.what, example: entry.example };
  }
  return null;
}

/**
 * "330 Ayes, 199 Noes" (and similar) → "Passed, 330 votes to 199".
 *
 * The official phrasing tells a reader nothing unless they already know an
 * Aye is a yes. When the string does not parse, it is returned unchanged, 
 * a raw official record beats a wrong translation.
 */
export function plainResult(result: string): string {
  const m = result.match(/(\d+)\s*ayes?\s*,?\s*(\d+)\s*no(?:es)?\b/i);
  if (!m) return result;
  const ayes = parseInt(m[1], 10);
  const noes = parseInt(m[2], 10);
  if (Number.isNaN(ayes) || Number.isNaN(noes)) return result;
  return ayes > noes
    ? `Passed: ${ayes} votes to ${noes}`
    : `Did not pass: ${ayes} votes to ${noes}`;
}

/** "Aye"/"For" → "Voted yes"; "No"/"Against" → "Voted no"; otherwise as-is. */
export function plainVoteLabel(vote: string): string {
  if (/^(aye|yes|for)$/i.test(vote)) return "Voted yes";
  if (/^(no|against)$/i.test(vote)) return "Voted no";
  return vote;
}
