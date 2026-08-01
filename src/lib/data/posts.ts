/**
 * Plain-English articles and their search/wayfinding metadata.
 *
 * The first screen gives a normal reader the answer. The same article then
 * exposes the dates, definitions and original sources that a journalist or
 * representative may need to check it.
 */

export const postCategories = [
  {
    slug: "money-and-bills",
    name: "Money and bills",
    description: "Why food, rent, energy and wages no longer add up — and who controls the rules.",
    color: "var(--action)",
  },
  {
    slug: "poverty-explained",
    name: "Poverty explained",
    description: "The words and numbers stripped of jargon, with the proof underneath.",
    color: "var(--brand)",
  },
  {
    slug: "take-action",
    name: "Take action",
    description: "Simple ways to make the people with power answer for what they decide.",
    color: "var(--good)",
  },
] as const;

export type PostCategorySlug = (typeof postCategories)[number]["slug"];

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
  category: PostCategorySlug;
  tags: string[];
  readingMinutes: number;
  featured?: boolean;
  image: {
    src: string;
    alt: string;
    caption: string;
    objectPosition?: string;
  };
  /** Explicit headings keep the contents list honest and stable. */
  toc: { id: string; label: string }[];
  /** Feeds FAQPage structured data and the questions block at the foot. */
  faq: { q: string; a: string }[];
  /** Source ids from src/lib/data/sources.ts. */
  sourceIds: string[];
};

export const posts: Post[] = [
  {
    slug: "why-is-the-cost-of-living-so-high",
    title: "Why everything still costs so much — and the choices that made it worse",
    description:
      "The cost of living crisis in Scotland did not end when inflation fell. See why food, rent and energy stay expensive, which political decisions made the squeeze worse, and who can change it.",
    standfirst:
      "War and the pandemic pushed prices up. That is true. It is also true that political choices left ordinary families with less protection — and added avoidable costs of their own.",
    date: "2026-08-01",
    updated: "2026-08-01",
    category: "money-and-bills",
    tags: ["Cost of living", "Food", "Energy", "Rent", "Universal Credit"],
    readingMinutes: 10,
    featured: true,
    image: {
      src: "/images/editorial/glasgow-cost-of-living.webp",
      alt: "A supermarket worker at a Glasgow kitchen table checking household bills beside a bag of groceries",
      caption:
        "The squeeze is not one bill. Food, energy, rent and tax all land on the same household income.",
      objectPosition: "center 48%",
    },
    toc: [
      { id: "what-is-happening", label: "What is happening now" },
      { id: "what-started-it", label: "What started the crisis" },
      { id: "decisions-made-it-worse", label: "The choices that made it worse" },
      { id: "glasgow-hit", label: "Why Glasgow feels it harder" },
      { id: "what-helped", label: "Decisions that did help" },
      { id: "who-can-fix-it", label: "Who can fix what" },
    ],
    faq: [
      {
        q: "Has the cost of living crisis ended because inflation is lower?",
        a: "No. Lower inflation means prices are rising more slowly; it does not put them back where they were. By March 2026, the ONS Household Costs Index was about 34% higher than five years earlier for low-income households.",
      },
      {
        q: "Did MPs cause the cost of living crisis?",
        a: "Not by themselves. Pandemic disruption and Russia’s invasion of Ukraine caused major global food and energy shocks. But UK governments and MPs made choices on benefits, rent support, trade, tax and the 2022 mini-budget that left households more exposed or added extra cost.",
      },
      {
        q: "Who controls help with the cost of living in Scotland?",
        a: "Both parliaments do. Westminster controls Universal Credit, Local Housing Allowance, the legal minimum wage, most tax allowances and energy regulation. Holyrood controls the Scottish Child Payment, housing, Scottish income-tax bands, childcare and much of public transport. Councils control local crisis support and services.",
      },
    ],
    sourceIds: [
      "ons-cpi-2026",
      "ons-household-costs-2026",
      "sg-cost-living-2025",
      "sg-private-rents-2025",
      "welfare-freeze-act",
      "welfare-freeze-vote",
      "welfare-freeze-impact",
      "uc-uplift-withdrawal",
      "lha-2026",
      "mini-budget-2022",
      "brexit-food-prices",
      "nao-energy-market",
      "obr-tax-thresholds-2025",
      "scottish-housing-budget",
      "sg-child-payment-2026",
      "cpag",
      "minimum-wage-2026",
      "mis-2025",
    ],
  },
  {
    slug: "do-people-in-poverty-work",
    title: "Most children in poverty in Scotland have a parent who works",
    description:
      "Three out of four children living in poverty in Scotland have a parent in work. Here is what that means, and why working more hours does not fix it.",
    standfirst:
      "The most common thing said about poverty is that people should get a job. Most of them already have one.",
    date: "2026-07-31",
    category: "poverty-explained",
    tags: ["Work", "Low pay", "Housing costs"],
    readingMinutes: 4,
    image: {
      src: "/images/editorial/scotland-working-family.webp",
      alt: "A parent in work clothes walking home with her school-age child and a bag of groceries",
      caption:
        "Having a job is no longer a guaranteed route out of poverty. Most children in poverty have a working parent.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "why-work-does-not-fix-it", label: "Why work does not fix it" },
      { id: "housing-costs", label: "How housing changes the picture" },
      { id: "what-this-changes", label: "What this changes" },
    ],
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
    category: "poverty-explained",
    tags: ["Poverty line", "Housing costs", "Definitions"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/glasgow-everyday-street.webp",
      alt: "People walking along a wet Glasgow tenement street after rain",
      caption:
        "Poverty is not a type of person or place. It is a household being left with too little to take part in ordinary life.",
    },
    toc: [
      { id: "short-version", label: "The short version" },
      { id: "real-money", label: "What it means in pounds" },
      { id: "after-housing-costs", label: "Why housing matters" },
      { id: "three-measures", label: "Three different measures" },
      { id: "where-scotland-stands", label: "Where Scotland stands" },
    ],
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
      "It does not exist anywhere else in the UK, and some families who are entitled to it have never claimed it.",
    date: "2026-07-31",
    updated: "2026-08-01",
    category: "money-and-bills",
    tags: ["Benefits", "Families", "Scottish Child Payment"],
    readingMinutes: 4,
    image: {
      src: "/images/editorial/scotland-secure-homes.webp",
      alt: "Two children arriving home from school to a secure family home",
      caption:
        "The payment is designed to give low-income families more room for everyday essentials, for every eligible child.",
      objectPosition: "center 44%",
    },
    toc: [
      { id: "who-can-get-it", label: "Who can get it" },
      { id: "why-it-matters", label: "Why it matters" },
      { id: "who-decides", label: "Who decides it" },
      { id: "take-up", label: "The money going unclaimed" },
    ],
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
    category: "take-action",
    tags: ["MP", "MSP", "Email"],
    readingMinutes: 4,
    image: {
      src: "/images/editorial/email-your-representative.webp",
      alt: "A woman writing an email on a laptop at her Glasgow kitchen table",
      caption:
        "You do not need political knowledge or perfect words. You live in their area, so you are entitled to ask for an answer.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "mp-and-msp", label: "Your MP and your MSP" },
      { id: "what-to-say", label: "What to actually say" },
      { id: "what-happens-next", label: "What happens next" },
      { id: "one-minute-version", label: "The one-minute version" },
    ],
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

export function getPostCategory(slug: string) {
  return postCategories.find((category) => category.slug === slug);
}

export function postsInCategory(slug: string) {
  return postsByDate().filter((post) => post.category === slug);
}

/** Newest first, which is how the index and the feed should read. */
export function postsByDate() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Other posts, prioritising the same category and then recency. */
export function relatedPosts(slug: string, limit = 2) {
  const current = getPost(slug);
  if (!current) return [];
  const others = postsByDate().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  return [
    ...sameCategory,
    ...others.filter((p) => p.category !== current.category),
  ].slice(0, limit);
}
