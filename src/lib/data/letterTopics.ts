/**
 * What people can write to their MP and MSP about.
 *
 * The organising rule is one email per representative, not one per subject.
 * Somebody in trouble is usually in several kinds of trouble at once — a
 * sanction becomes arrears becomes damp becomes a homelessness application —
 * and making them send three emails to the same person to describe one
 * situation fragments the story and adds exactly the friction this site
 * exists to remove.
 *
 * So the reader ticks subjects. Everything after that is arithmetic:
 *
 *   1. Work out which of the selected subjects each representative can act on.
 *   2. Fold all of them into a single organised email for that person.
 *   3. Never produce more than two emails in total.
 *
 * The campaign/personal distinction that used to be in the picker is gone.
 * It was never the reader's problem to solve: someone choosing "Benefits" may
 * have had their payment stopped, or may think the rate is too low, or both,
 * and which one it is emerges from what they write rather than from a
 * category they had to pick first. Every subject therefore carries both a way
 * of introducing a personal account and its own policy asks.
 *
 * `who` is the part this site is actually for. Almost nobody knows the NHS in
 * Scotland is run from Holyrood and Universal Credit from Westminster, and
 * writing to the wrong one wastes weeks.
 */

import type { RepresentativeRole } from "@/lib/letter";

export type Ask = {
  /**
   * Stable identity for the demand itself, not its wording. Two subjects can
   * want the same thing in different words — child poverty and housing both
   * want local housing allowance unfrozen — and someone who ticks both should
   * not send an email that asks for it twice. Deduplication is by key.
   */
  key: string;
  line: string;
  who: RepresentativeRole;
  /** Restricts an ask to one council, for figures only that council publishes. */
  localOnly?: string;
};

export type LetterTopic = {
  id: string;
  /** What the reader ticks. */
  label: string;
  /** One line under the label on the card. */
  blurb: string;
  /** Who can act. Drives which emails get written. */
  who: RepresentativeRole | "both";
  /** Why it goes to that person. Shown to the reader — this is the teaching bit. */
  whyWho: string;
  /**
   * How this subject reads mid-sentence, for "I am writing about X, Y and Z."
   * Lower case, no article.
   */
  phrase: string;
  /** Short heading above this subject's asks inside the email. */
  heading: string;
  /** Hint shown when this is the only subject ticked. */
  prompt: string;
  /** Quote the local child-poverty figures when this subject is selected. */
  useLocalEvidence?: boolean;
  asks?: Ask[];
};

export const LETTER_TOPICS: LetterTopic[] = [
  {
    id: "cost-of-living",
    label: "Bills and the cost of living",
    blurb: "Energy, food and bills that went up and stayed up.",
    who: "both",
    whyWho:
      "Both. Energy prices and the benefits system are decided at Westminster; fuel-poverty schemes and the Scottish Child Payment at Holyrood.",
    phrase: "the cost of living",
    heading: "Bills and the cost of living",
    prompt: "What has gone up most for you, and what has had to give?",
    asks: [
      {
        key: "uc-level",
        line: "Support raising the level of Universal Credit so it covers the basics.",
        who: "MP",
      },
      {
        key: "standing-charges",
        line: "Press for standing charges on energy bills to be reduced.",
        who: "MP",
      },
      {
        key: "fuel-poverty",
        line: "Expand help with energy costs for households on low incomes.",
        who: "MSP",
      },
    ],
  },
  {
    id: "housing",
    label: "Rent, housing or homelessness",
    blurb: "Rent, repairs, damp, temporary accommodation or a homelessness application.",
    who: "both",
    whyWho:
      "Both. Help with private rent is set at Westminster. Building affordable homes, homelessness services and tenants' rights are run from Holyrood. If it is a council house or a repair, your councillors can act too — you have three or four of them, and there is a guide to finding them further down this page.",
    phrase: "housing",
    heading: "Rent, housing and homelessness",
    prompt:
      "What the problem is, how long it has gone on, and who you have already contacted about it.",
    asks: [
      {
        key: "lha",
        line: "Unfreeze help with private rent so it matches real local rents.",
        who: "MP",
      },
      {
        key: "affordable-homes",
        line: "Fund affordable housing at the level experts say Scotland needs.",
        who: "MSP",
      },
      {
        key: "homelessness-funding",
        line: "Close the funding gap for homelessness services.",
        who: "MSP",
      },
    ],
  },
  {
    id: "low-pay",
    label: "Pay, hours or insecure work",
    blurb: "Full-time work that still does not cover the basics.",
    who: "MP",
    whyWho:
      "Your MP. The minimum wage, employment law and zero-hours contracts are all decided at Westminster, not Holyrood.",
    phrase: "low pay",
    heading: "Pay, hours and insecure work",
    prompt: "Your own experience of pay or hours, if you want to include it.",
    asks: [
      {
        key: "min-wage",
        line: "Support raising the minimum wage to match the real cost of living.",
        who: "MP",
      },
      {
        key: "zero-hours",
        line: "Back stronger rights for people on zero-hours and short-hours contracts.",
        who: "MP",
      },
      {
        key: "sick-pay",
        line: "Support statutory sick pay that starts on day one and is worth living on.",
        who: "MP",
      },
    ],
  },
  {
    id: "council-tax",
    label: "Council tax and water charges",
    blurb: "What the bill costs, and how much of it is water.",
    who: "MSP",
    whyWho:
      "Your MSP. Council funding, council tax rules and Scottish Water are all decided at Holyrood.",
    phrase: "council tax",
    heading: "Council tax and water charges",
    prompt: "What your own bill has done in the last few years.",
    asks: [
      {
        key: "ct-reform",
        line: "Support reform of a council tax still based on 1991 property values.",
        who: "MSP",
      },
      {
        key: "water-clarity",
        line: "Make the water and waste water charge on the bill clearer to households.",
        who: "MSP",
      },
      {
        key: "ctr-widen",
        line: "Widen who qualifies for Council Tax Reduction.",
        who: "MSP",
      },
    ],
  },
  {
    id: "child-poverty",
    label: "Child poverty",
    blurb: "The local figures, and the costed changes experts say would move them.",
    who: "both",
    whyWho:
      "Both. The UK Government sets Universal Credit and help with private rent; the Scottish Government sets the Scottish Child Payment, housing and childcare. Each email only asks for what that person controls.",
    phrase: "child poverty",
    heading: "Child poverty",
    prompt: "One or two sentences about why this matters to you.",
    useLocalEvidence: true,
    asks: [
      {
        key: "lha",
        line: "Make sure help with private rent keeps up with real rents in this area.",
        who: "MP",
      },
      {
        key: "scp",
        line: "Increase the Scottish Child Payment for the families most likely to be poor.",
        who: "MSP",
      },
      {
        key: "scp-uptake",
        line: "Make sure every family entitled to the Scottish Child Payment actually gets it.",
        who: "MSP",
      },
      {
        key: "affordable-homes",
        line: "Fund enough affordable homes to meet the level experts say Scotland needs.",
        who: "MSP",
      },
      {
        key: "homelessness-funding",
        line: "Close Glasgow's homelessness funding gap so families are not left in hotels and B&Bs.",
        who: "MSP",
        localOnly: "glasgow-city",
      },
    ],
  },
  {
    id: "benefits",
    label: "Benefits",
    blurb: "Universal Credit, a sanction, an assessment, or a payment that stopped.",
    who: "both",
    whyWho:
      "Both, because Scotland's benefits are split. Universal Credit and the State Pension are Westminster, so your MP. The Scottish Child Payment and Adult Disability Payment are Holyrood, so your MSP. Ticking this sends to both, so you do not have to work out which yours is.",
    phrase: "benefits",
    heading: "Benefits",
    prompt:
      "Which benefit, what has gone wrong, and the dates. Include any reference number from letters you have had.",
    asks: [
      {
        key: "sanctions",
        line: "Review the use of sanctions, which push people into destitution rather than work.",
        who: "MP",
      },
      {
        key: "five-week-wait",
        line: "End the five-week wait for a first Universal Credit payment.",
        who: "MP",
      },
      {
        key: "scot-benefit-uptake",
        line: "Make sure everyone entitled to Scottish benefits is actually receiving them.",
        who: "MSP",
      },
    ],
  },
  {
    id: "nhs",
    label: "NHS treatment or waiting times",
    blurb: "An appointment, an operation, a GP, or mental health support.",
    who: "MSP",
    whyWho:
      "Your MSP. The NHS in Scotland is run from Holyrood, so an MP cannot take this up for you. This is the mistake people make most often.",
    phrase: "NHS waiting times",
    heading: "NHS treatment and waiting times",
    prompt:
      "What has happened, how long you have been waiting, and what you would like them to do. Include a reference number if you have one.",
    asks: [
      {
        key: "waiting-times",
        line: "Set out what is being done about waiting times at my local health board.",
        who: "MSP",
      },
      {
        key: "mental-health",
        line: "Improve access to mental health support without long waits.",
        who: "MSP",
      },
    ],
  },
  {
    id: "other",
    label: "Something else",
    blurb: "Anything at all. You write it, I handle the rest.",
    who: "both",
    whyWho:
      "Both, so it reaches whoever is responsible. One of them will be able to act, and the other can pass it on — you do not need to know which is which.",
    phrase: "another matter",
    heading: "Something else",
    prompt: "Write it in your own words. There is no wrong way to say it.",
  },
];

export const DEFAULT_TOPIC_IDS = ["child-poverty"];

export function topicById(id: string): LetterTopic {
  return LETTER_TOPICS.find((t) => t.id === id) ?? LETTER_TOPICS[0];
}

export function topicsByIds(ids: string[]): LetterTopic[] {
  // Keep the order of the card list rather than the order they were ticked, so
  // the email reads the same way the page does.
  return LETTER_TOPICS.filter((t) => ids.includes(t.id));
}

/** Which representatives get an email, given everything ticked. */
export function rolesForTopics(topics: LetterTopic[]): RepresentativeRole[] {
  const roles = new Set<RepresentativeRole>();
  for (const t of topics) {
    if (t.who === "both") {
      roles.add("MP");
      roles.add("MSP");
    } else {
      roles.add(t.who);
    }
  }
  return (["MP", "MSP"] as const).filter((r) => roles.has(r));
}

/** True when this subject is something the given representative can act on. */
export function topicAppliesTo(topic: LetterTopic, role: RepresentativeRole) {
  return topic.who === "both" || topic.who === role;
}

/** "A", "A and B", "A, B and C" — for the opening sentence and the subject line. */
export function joinPhrases(parts: string[]) {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}
