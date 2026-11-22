import divisionsSnapshot from "./data/holyroodDivisions.json" with { type: "json" };
import type { VoteRecord } from "./voting.ts";

/**
 * Plain-English helpers for Holyrood votes on MSP profiles.
 *
 * Every fact here comes from Scottish Parliament Open Data: the MSP's own
 * vote, the official totals, which party put each motion or amendment
 * forward, and how each party's MSPs voted. Nothing here says how anyone
 * should have voted.
 */

export type VoteChoice = "yes" | "no" | "abstain" | "notVoted";

export type PartyTally = { yes: number; no: number; abstain: number; notVoted: number };

export type HolyroodDivision = {
  reference: string;
  title: string;
  date: string | null;
  result: string | null;
  yes: number;
  no: number;
  abstain: number;
  notVoted: number;
  broughtBy: string | null;
  parties: Record<string, PartyTally>;
};

const divisions = divisionsSnapshot.divisions as Record<string, HolyroodDivision>;
export const HOLYROOD_DIVISIONS_SOURCE = divisionsSnapshot.source;

export function getDivision(reference?: string) {
  return reference ? divisions[reference] : undefined;
}

export function voteChoice(vote: string): VoteChoice {
  const v = vote.trim().toLowerCase();
  if (v === "yes" || v === "for" || v === "aye") return "yes";
  if (v === "no" || v === "against") return "no";
  if (v === "abstain") return "abstain";
  return "notVoted";
}

/** Party abbreviations used by the Scottish Parliament vote records. */
const PARTY_CODES: [RegExp, string][] = [
  [/scottish national|^snp$/i, "SNP"],
  [/conservative/i, "Con"],
  [/labour/i, "Lab"],
  [/liberal democrat/i, "LD"],
  [/green/i, "Green"],
  [/reform/i, "Reform"],
  [/^independent$/i, "Ind"],
  [/no party/i, "NPA"],
];

export function partyCode(partyName: string) {
  return PARTY_CODES.find(([pattern]) => pattern.test(partyName))?.[1] ?? null;
}

/** Short name for "Most ___ MSPs". */
const PARTY_SHORT: Record<string, string> = {
  SNP: "SNP",
  Con: "Conservative",
  Lab: "Labour",
  LD: "Lib Dem",
  Green: "Green",
  Reform: "Reform UK",
};

/** Name for "put forward by ___". */
const PARTY_PROPOSER: Record<string, string> = {
  SNP: "the SNP",
  Con: "the Scottish Conservatives",
  Lab: "Scottish Labour",
  LD: "the Scottish Lib Dems",
  Green: "the Scottish Greens",
  Reform: "Reform UK",
  Ind: "an independent MSP",
};

export function partyShortName(code: string | null) {
  return code ? (PARTY_SHORT[code] ?? null) : null;
}

export function proposerName(code: string | null) {
  return code ? (PARTY_PROPOSER[code] ?? null) : null;
}

/** "S7M-01766.3" is amendment 3 to motion "S7M-01766". */
export function splitReference(reference?: string) {
  const match = reference?.match(/^(.*?)(?:\.(\d+))?$/);
  return {
    motion: match?.[1] ?? reference ?? "",
    amendment: match?.[2] ? Number(match[2]) : null,
  };
}

export function passed(result?: string | null) {
  if (!result) return null;
  if (/carried|agreed|passed/i.test(result)) return true;
  if (/defeated|disagreed|rejected|fell/i.test(result)) return false;
  return null;
}

/**
 * How most MSPs in the same party voted, leaving this MSP out, so it compares
 * them with their colleagues. Needs at least two colleagues who voted, and a
 * clear winner, otherwise there is no "party line" to show.
 */
export function partyMajority(
  division: HolyroodDivision | undefined,
  code: string | null,
  own: VoteChoice,
): Exclude<VoteChoice, "notVoted"> | null {
  if (!division || !code || code === "Ind" || code === "NPA") return null;
  const tally = division.parties[code];
  if (!tally) return null;
  const counts = { yes: tally.yes, no: tally.no, abstain: tally.abstain };
  if (own !== "notVoted" && counts[own] > 0) counts[own] -= 1;
  const ranked = (Object.entries(counts) as [Exclude<VoteChoice, "notVoted">, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const total = ranked.reduce((sum, [, n]) => sum + n, 0);
  if (total < 2 || ranked[0][1] === ranked[1][1]) return null;
  return ranked[0][0];
}

/** Debates MSPs talked about, in words a ten year old can follow. */
const TOPICS: { match: RegExp; short: string; about: string }[] = [
  {
    match: /alcohol and drug deaths/i,
    short: "Stopping deaths from alcohol and drugs",
    about: "How Scotland can stop people dying because of alcohol and drugs.",
  },
  {
    match: /learning disabilities, autism and neurodivergence/i,
    short: "A proposed law for autistic and learning disabled people",
    about:
      "A proposed law to protect the rights of people with learning disabilities, autism and other ways of thinking and learning (neurodivergence).",
  },
  {
    match: /international climate justice/i,
    short: "Helping poorer countries with climate change",
    about: "How Scotland helps poorer countries that are hit hardest by climate change.",
  },
  {
    match: /cyber resilience/i,
    short: "Keeping Scotland safe from online attacks",
    about: "How to protect Scotland's computers, websites and public services from hackers.",
  },
  {
    match: /fishing industry/i,
    short: "Support for Scotland's fishing industry",
    about: "How to help Scotland's fishing boats, fishing towns and the people who work in them.",
  },
  {
    match: /prosperity and future in europe/i,
    short: "Scotland and Europe",
    about: "Scotland's links with Europe and what they mean for jobs and money.",
  },
];

export function debateTopic(title: string) {
  const topic = TOPICS.find((t) => t.match.test(title));
  return {
    short: topic?.short ?? title,
    about: topic?.about ?? null,
  };
}

export type HolyroodVoteRow = {
  vote: VoteRecord;
  choice: VoteChoice;
  amendment: number | null;
  division?: HolyroodDivision;
  partyLine: Exclude<VoteChoice, "notVoted"> | null;
};

export type HolyroodDebate = {
  id: string;
  title: string;
  date: string;
  rows: HolyroodVoteRow[];
};

/** Groups an MSP's votes by debate: changes first, then the final vote. */
export function groupHolyroodVotes(votes: VoteRecord[], partyName: string): HolyroodDebate[] {
  const code = partyCode(partyName);
  const debates = new Map<string, HolyroodDebate>();
  for (const vote of votes) {
    const { motion, amendment } = splitReference(vote.reference);
    const key = motion || `${vote.title}-${vote.date.slice(0, 10)}`;
    const choice = voteChoice(vote.vote);
    const division = getDivision(vote.reference);
    const debate = debates.get(key) ?? {
      id: `vote-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      title: vote.title,
      date: vote.date,
      rows: [],
    };
    debate.rows.push({ vote, choice, amendment, division, partyLine: partyMajority(division, code, choice) });
    debates.set(key, debate);
  }
  const list = [...debates.values()];
  for (const debate of list) {
    debate.rows.sort((a, b) => (a.amendment ?? Infinity) - (b.amendment ?? Infinity));
  }
  return list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
