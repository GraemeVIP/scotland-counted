/**
 * What people can write to their MP and MSP about.
 *
 * The site used to write exactly one email — child poverty in your area — with
 * an optional sentence of your own dropped into the middle. That is a strong
 * letter, and it stays the default. But it is not what most people arrive
 * needing. Somebody waiting fourteen months for an operation, or sanctioned on
 * Universal Credit, or living in a flat with damp, has a real thing to raise
 * and no obvious way to raise it.
 *
 * Two kinds of letter, because they are not the same document:
 *
 *   campaign — you are asking for a policy change. It argues from published
 *              figures, makes specific asks, and ends with questions that are
 *              awkward to dodge.
 *
 *   personal — you are asking for help with your own situation. No statistics,
 *              no policy asks. Your words, a request to take it up, and the
 *              details an office needs to act.
 *
 * `who` is the part this site is actually for. Almost nobody knows that the NHS
 * in Scotland is run from Holyrood and Universal Credit from Westminster, and
 * writing to the wrong one wastes weeks. Every topic states who it goes to and
 * why, in words that assume no prior knowledge.
 */

import type { RepresentativeRole } from "@/lib/letter";

export type TopicKind = "campaign" | "personal";

export type LetterTopic = {
  id: string;
  /** What the reader picks from the list. */
  label: string;
  /** One line under the label. */
  blurb: string;
  kind: TopicKind;
  /** Who can actually act. "both" writes two different letters. */
  who: RepresentativeRole | "both";
  /** Why it goes to that person. Shown to the reader — this is the teaching bit. */
  whyWho: string;
  /** Subject line. `area` is the council or constituency name. */
  subject: (area: string) => string;
  /** The "I am writing about…" sentence. */
  opening: string;
  /** Campaign letters quote the local child-poverty figures; personal ones do not. */
  useLocalEvidence: boolean;
  /** Specific asks, filtered by who is receiving the letter. */
  asks?: Array<{ line: string; who: RepresentativeRole; localOnly?: string }>;
  /** Numbered questions at the foot. */
  questions?: string[];
  /** Placeholder for the free-text box, tuned to the topic. */
  prompt: string;
  /** Shown above the box when the topic needs the reader to supply the substance. */
  needsDetail?: boolean;
};

export const LETTER_TOPICS: LetterTopic[] = [
  /* ---------------------------------------------------------------- campaigns */
  {
    id: "child-poverty",
    label: "Child poverty where I live",
    blurb: "The local figures, and the costed changes experts say would move them.",
    kind: "campaign",
    who: "both",
    whyWho:
      "Both. The UK Government sets Universal Credit and help with private rent; the Scottish Government sets the Scottish Child Payment, housing and childcare. Each email only asks for what that person controls.",
    subject: (area) => `Poverty in ${area} — what will you do?`,
    opening: "I am writing about poverty in our area.",
    useLocalEvidence: true,
    asks: [
      { line: "Make sure help with private rent keeps up with real rents in this area.", who: "MP" },
      { line: "Increase the Scottish Child Payment for the families most likely to be poor.", who: "MSP" },
      { line: "Make sure every family entitled to the Scottish Child Payment actually gets it.", who: "MSP" },
      { line: "Fund enough affordable homes to meet the level experts say Scotland needs.", who: "MSP" },
      {
        line: "Close Glasgow's homelessness funding gap so families are not left in hotels and B&Bs.",
        who: "MSP",
        localOnly: "glasgow-city",
      },
    ],
    questions: [
      "What have you done on these issues so far?",
      "What do you expect the child-poverty figure in {area} to be in five years?",
    ],
    prompt: "Optional. One or two sentences about why this matters to you.",
  },
  {
    id: "cost-of-living",
    label: "The cost of living",
    blurb: "Energy, food and bills that went up and stayed up.",
    kind: "campaign",
    who: "both",
    whyWho:
      "Both. Energy prices and the benefits system are decided at Westminster; fuel-poverty schemes and the Scottish Child Payment at Holyrood.",
    subject: () => "The cost of living — what will you do?",
    opening: "I am writing about the cost of living.",
    useLocalEvidence: true,
    asks: [
      { line: "Support raising the level of Universal Credit so it covers the basics.", who: "MP" },
      { line: "Press for standing charges on energy bills to be reduced.", who: "MP" },
      { line: "Expand help with energy costs for households on low incomes.", who: "MSP" },
    ],
    questions: [
      "What are you doing about the level of energy standing charges?",
      "What help is available in {area} for someone struggling with bills right now?",
    ],
    prompt: "Optional. What has gone up most for you, and what has had to give?",
  },
  {
    id: "housing",
    label: "Housing, rent and homelessness",
    blurb: "Rent that outruns wages, and not enough homes people can afford.",
    kind: "campaign",
    who: "both",
    whyWho:
      "Both. Help with private rent is set at Westminster. Building affordable homes and homelessness services are run from Holyrood.",
    subject: (area) => `Housing and rent in ${area}`,
    opening: "I am writing about housing costs and the supply of homes people can afford.",
    useLocalEvidence: true,
    asks: [
      { line: "Unfreeze help with private rent so it matches real local rents.", who: "MP" },
      { line: "Fund affordable housing at the level experts say Scotland needs.", who: "MSP" },
      { line: "Close the funding gap for homelessness services.", who: "MSP" },
    ],
    questions: [
      "Do you support raising help with private rent to match real rents?",
      "How many affordable homes were completed in {area} last year?",
    ],
    prompt: "Optional. What housing costs look like where you are.",
  },
  {
    id: "low-pay",
    label: "Low pay and insecure work",
    blurb: "Full-time work that still does not cover the basics.",
    kind: "campaign",
    who: "MP",
    whyWho:
      "Your MP. The minimum wage, employment law and zero-hours contracts are all decided at Westminster, not Holyrood.",
    subject: () => "Low pay and insecure work",
    opening: "I am writing about low pay and work that does not pay enough to live on.",
    useLocalEvidence: true,
    asks: [
      { line: "Support raising the minimum wage to match the real cost of living.", who: "MP" },
      { line: "Back stronger rights for people on zero-hours and short-hours contracts.", who: "MP" },
      { line: "Support statutory sick pay that starts on day one and is worth living on.", who: "MP" },
    ],
    questions: [
      "Do you support raising the minimum wage to the level of the real Living Wage?",
      "What are you doing about insecure hours for people in {area}?",
    ],
    prompt: "Optional. Your own experience of pay or hours, if you want to include it.",
  },
  {
    id: "council-tax",
    label: "Council tax and water charges",
    blurb: "What the bill costs, and how much of it is water.",
    kind: "campaign",
    who: "MSP",
    whyWho:
      "Your MSP. Council funding, council tax rules and Scottish Water are all decided at Holyrood.",
    subject: (area) => `Council tax in ${area}`,
    opening: "I am writing about council tax and the water charges on the same bill.",
    useLocalEvidence: false,
    asks: [
      { line: "Support reform of a council tax still based on 1991 property values.", who: "MSP" },
      { line: "Make the water and waste water charge on the bill clearer to households.", who: "MSP" },
      { line: "Widen who qualifies for Council Tax Reduction.", who: "MSP" },
    ],
    questions: [
      "Do you support revaluing or replacing the current council tax bands?",
      "What help is there in {area} for someone who cannot pay their council tax?",
    ],
    prompt: "Optional. What your own bill has done in the last few years.",
  },

  /* ----------------------------------------------------------------- personal */
  {
    id: "nhs",
    label: "NHS treatment or waiting times",
    blurb: "An appointment, an operation, a GP, or mental health support.",
    kind: "personal",
    who: "MSP",
    whyWho:
      "Your MSP. The NHS in Scotland is run from Holyrood, so an MP cannot take this up for you. This is the mistake people make most often.",
    subject: () => "Constituency matter — NHS treatment",
    opening: "I am writing to ask for your help with an NHS matter.",
    useLocalEvidence: false,
    prompt:
      "What has happened, how long you have been waiting, and what you would like them to do. Include a reference number if you have one.",
    needsDetail: true,
  },
  {
    id: "benefits-problem",
    label: "A problem with benefits",
    blurb: "Universal Credit, a sanction, an assessment, or a payment that stopped.",
    kind: "personal",
    who: "both",
    whyWho:
      "Both, because Scotland's benefits are split. Universal Credit and the State Pension are Westminster, so your MP. The Scottish Child Payment and Adult Disability Payment are Holyrood, so your MSP. Sending both means you do not have to work out which yours is.",
    subject: () => "Constituency matter — benefits",
    opening: "I am writing to ask for your help with a problem with my benefits.",
    useLocalEvidence: false,
    prompt:
      "Which benefit, what has gone wrong, and the dates. Include any reference number from letters you have had.",
    needsDetail: true,
  },
  {
    id: "housing-problem",
    label: "A housing problem of my own",
    blurb: "Repairs, damp, temporary accommodation, or a homelessness application.",
    kind: "personal",
    who: "MSP",
    whyWho:
      "Your MSP. Housing and homelessness are run from Holyrood. If it is about a council house or a repair, your local councillors can also act — your council's website lists them.",
    subject: () => "Constituency matter — housing",
    opening: "I am writing to ask for your help with a housing problem.",
    useLocalEvidence: false,
    prompt:
      "What the problem is, how long it has gone on, and who you have already contacted about it.",
    needsDetail: true,
  },
  {
    id: "other",
    label: "Something else",
    blurb: "Anything at all. You write it, we handle the rest.",
    kind: "personal",
    who: "both",
    whyWho:
      "Both, so it reaches whoever is responsible. One of them will be able to act, and the other can pass it on — you do not need to know which is which.",
    subject: () => "A matter I would like your help with",
    opening: "I am writing to ask for your help with the following.",
    useLocalEvidence: false,
    prompt: "Write it in your own words. There is no wrong way to say it.",
    needsDetail: true,
  },
];

export const DEFAULT_TOPIC_ID = "child-poverty";

export function topicById(id: string): LetterTopic {
  return LETTER_TOPICS.find((t) => t.id === id) ?? LETTER_TOPICS[0];
}

export function topicsByKind(kind: TopicKind) {
  return LETTER_TOPICS.filter((t) => t.kind === kind);
}

/** Which roles get a letter for this topic. */
export function rolesFor(topic: LetterTopic): RepresentativeRole[] {
  return topic.who === "both" ? ["MP", "MSP"] : [topic.who];
}
