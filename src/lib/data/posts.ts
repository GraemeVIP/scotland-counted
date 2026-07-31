/**
 * The blog: plain-English explainers.
 *
 * The area and constituency pages answer "how bad is it where I live". They
 * cannot answer the questions people actually type into Google first — what
 * poverty even means, whether poor families work, what the Scottish Child
 * Payment is, how you contact an MP. Those questions are the front door, and
 * every post is written to send the reader on to the local figures and the
 * action tool.
 *
 * Every claim here is already published and sourced elsewhere on the site.
 * Posts do not introduce new numbers; they explain the ones we hold.
 */

export type Post = {
  slug: string;
  title: string;
  /** Meta description and card text. Written for a search result, not a headline. */
  description: string;
  /** The opening line on the post itself. */
  standfirst: string;
  /** ISO date published. */
  date: string;
  /** ISO date last checked or revised. */
  updated?: string;
  /** Grouping label shown on cards. */
  topic: "How it works" | "The numbers" | "Take action";
  readingMinutes: number;
  /** Feeds FAQPage structured data and the questions block at the foot. */
  faq: { q: string; a: string }[];
  /** Source ids from src/lib/data/sources.ts. */
  sourceIds: string[];
};

export const posts: Post[] = [
  {
    slug: "do-people-in-poverty-work",
    title: "Most children in poverty in Scotland have a parent who works",
    description:
      "Three out of four children living in poverty in Scotland have a parent in work. Here is what that means, and why working more hours does not fix it.",
    standfirst:
      "The most common thing said about poverty is that people should get a job. Most of them already have one.",
    date: "2026-07-31",
    topic: "The numbers",
    readingMinutes: 4,
    faq: [
      {
        q: "Do most people in poverty work?",
        a: "Yes. In Scotland, about 75% of children living in poverty are in a household where at least one adult works. Work has stopped being a reliable way out of poverty.",
      },
      {
        q: "Why does working not lift a family out of poverty?",
        a: "Three things: wages that have not kept up with prices, hours that are part-time or unpredictable, and housing costs that take a large share of what is left. Poverty is measured after rent or mortgage is paid.",
      },
    ],
    sourceIds: ["sg-poverty-2026", "jrf"],
  },
  {
    slug: "what-does-poverty-mean",
    title: "What does “poverty” actually mean when the government says it?",
    description:
      "Poverty has an official definition, and it is not what most people assume. What the poverty line is in pounds per week, and why 'after housing costs' changes everything.",
    standfirst:
      "The word gets used loosely. The measure behind it is precise, and knowing it makes every other number on this site readable.",
    date: "2026-07-31",
    topic: "How it works",
    readingMinutes: 5,
    faq: [
      {
        q: "What is the poverty line in the UK?",
        a: "A household is in relative poverty when it has less than 60% of the usual UK household income. In 2022/23, after housing costs, a couple with two young children needed more than £407 a week to be above it.",
      },
      {
        q: "What does 'after housing costs' mean?",
        a: "Rent or mortgage is taken off the household's income before the comparison is made. It is the money actually available for everything else, so it is the fairer measure in places where housing is expensive.",
      },
    ],
    sourceIds: ["sg-poverty-2026", "thresholds"],
  },
  {
    slug: "what-is-the-scottish-child-payment",
    title: "What is the Scottish Child Payment, and is your family missing out?",
    description:
      "A weekly payment for every child in a low-income family in Scotland. What it is worth, who can get it, and why thousands of eligible families still do not claim it.",
    standfirst:
      "It does not exist anywhere else in the UK, and some families entitled to it have never claimed it.",
    date: "2026-07-31",
    topic: "How it works",
    readingMinutes: 4,
    faq: [
      {
        q: "How much is the Scottish Child Payment?",
        a: "As of April 2026 it is £28.20 per child per week, paid for every child in a low-income family. It is set to rise to £40 a week for children under one from 2027.",
      },
      {
        q: "Who decides the Scottish Child Payment?",
        a: "The Scottish Parliament in Edinburgh. It is a devolved payment, so your MSP can be asked about it. Most other benefits, including Universal Credit, are decided at Westminster by your MP.",
      },
    ],
    sourceIds: ["cpag", "jrf"],
  },
  {
    slug: "how-to-contact-your-mp-or-msp",
    title: "How to contact your MP or MSP (and what to actually say)",
    description:
      "You do not need to know anything about politics to write to the people who represent you. What to say, what happens next, and how to do it in about a minute.",
    standfirst:
      "Most people never contact their representatives, and the main reason is not apathy. It is not knowing how it works.",
    date: "2026-07-31",
    topic: "Take action",
    readingMinutes: 4,
    faq: [
      {
        q: "Do I have to have voted for my MP to contact them?",
        a: "No. An MP represents everyone who lives in their area, whether they voted for them, voted against them, or did not vote at all. They still have to deal with your case.",
      },
      {
        q: "What is the difference between an MP and an MSP?",
        a: "Your MP works in the UK Parliament in London and helps decide Universal Credit, most benefits and help with private rent. Your MSP works in the Scottish Parliament in Edinburgh and helps decide the Scottish Child Payment, housing, childcare and schools. You have both.",
      },
      {
        q: "Will my MP actually reply?",
        a: "Usually yes, though it can take a few weeks. Offices log what constituents write about, so the volume of letters on a subject matters even when an individual reply is short.",
      },
    ],
    sourceIds: [],
  },
];

export const POST_COUNT = posts.length;

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** Newest first, which is how the index and the feed should read. */
export function postsByDate() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Two other posts to show at the foot of a post. */
export function relatedPosts(slug: string, limit = 2) {
  const current = getPost(slug);
  if (!current) return [];
  const others = posts.filter((p) => p.slug !== slug);
  const sameTopic = others.filter((p) => p.topic === current.topic);
  return [...sameTopic, ...others.filter((p) => p.topic !== current.topic)].slice(0, limit);
}
