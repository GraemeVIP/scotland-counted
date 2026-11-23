/**
 * Read next nudges for the explainers and guides.
 *
 * About 95% of visitors read one page and leave. Each guide and explainer is
 * given a topic here, and each topic has three things to offer a reader who
 * is still on the page:
 *
 * - a tool that answers the next practical question ("what is my bill?"),
 * - an expenses story with a real figure that ties the topic to what MPs and
 *   MSPs claimed (the same bill, paid by taxpayers),
 * - articles on the same topic first, so "read next" stays on subject.
 *
 * Every figure below is copied from the published story it links to. If a
 * story's figure changes, change it here too. The expenses stories themselves
 * are not given a topic: they have their own "Read the next one" strip.
 */
import { getPost, postsByDate, type Post } from "@/lib/data/posts";
import { EXPENSE_STORY_SLUGS } from "@/lib/data/expenseStories";
import { postPath } from "@/lib/routeMap";

export type NudgeTopic =
  | "council-tax"
  | "energy"
  | "pay"
  | "benefits"
  | "housing"
  | "cost-of-living"
  | "poverty"
  | "area"
  | "contact"
  | "school"
  | "investigation";

export type NudgeTool = {
  href: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
};

export type NudgeBridge = {
  stat: string;
  text: string;
  href: string;
  cta: string;
};

const TOOLS = {
  councilTax: {
    href: "/council-tax-bands-scotland",
    kicker: "Check yours",
    title: "What does your council tax cost?",
    body: "Type your postcode. See this year's bill for every band in your area, with water and sewerage added.",
    cta: "Check my council tax",
  },
  takeHome: {
    href: "/take-home-pay-calculator-scotland",
    kicker: "Free calculator",
    title: "What will you take home?",
    body: "Put in your pay. See what lands in your bank after Scottish income tax and National Insurance.",
    cta: "Work out my take home pay",
  },
  benefits: {
    href: "/benefits",
    kicker: "Don't miss out",
    title: "Could you be missing a payment?",
    body: "Every Scottish benefit on one page. What each one pays this year, who can get it and how to claim.",
    cta: "See every benefit and rate",
  },
  heating: {
    href: "/benefits",
    kicker: "Help with bills",
    title: "Are you getting every payment you're owed?",
    body: "Winter Heating Payment, Scottish Child Payment and the rest, on one page. See what each one pays and how to claim.",
    cta: "See every benefit and rate",
  },
  compare: {
    href: "/compare-areas",
    kicker: "Free tool",
    title: "Where is it cheaper to live?",
    body: "Put two council areas side by side. Rent, house prices, pay, crime and schools, with the official figures.",
    cta: "Compare two areas",
  },
  simd: {
    href: "/simd-postcode-checker",
    kicker: "Check your street",
    title: "How deprived is your area?",
    body: "Type a postcode. See where it sits on Scotland's official list, from most to least deprived.",
    cta: "Check my postcode",
  },
  quiz: {
    href: "/poverty-in-scotland-quiz",
    kicker: "Quick quiz",
    title: "Think you know the real numbers?",
    body: "Guess the figures on poverty in Scotland, then see the answers and where each one comes from.",
    cta: "Take the quiz",
  },
  email: {
    href: "/email-your-mp-and-msp",
    kicker: "Free tool",
    title: "Email your MP and MSP",
    body: "Type your postcode. Get an email to each of them with your area's real figures already in it.",
    cta: "Write my email",
  },
  findReps: {
    href: "/representatives",
    kicker: "Who speaks for you",
    title: "Who are your MP and MSPs?",
    body: "Type your postcode. See your MP and all eight of your MSPs in one place.",
    cta: "Find mine",
  },
} satisfies Record<string, NudgeTool>;

const BRIDGES = {
  councilTax: {
    stat: "£161,374",
    text: "Council tax on MSPs' Edinburgh flats, billed to taxpayers in one year. The year before it was £72,822.",
    href: "/blog/msp-expenses-scotland-investigation#double-council-tax",
    cta: "See how it doubled",
  },
  tvLicence: {
    stat: "£10,754",
    text: "You pay for your own TV licence. 29 Scottish MPs put theirs on expenses.",
    href: "/blog/scottish-mps-tv-licence-expenses",
    cta: "See which MPs",
  },
  whatItCouldBuy: {
    stat: "£6.64m",
    text: "One year of Scottish MP and MSP perks. More than Glasgow, Edinburgh and Dundee paid out in Crisis Grants.",
    href: "/blog/scottish-mp-msp-expenses-what-it-could-buy",
    cta: "See what it could buy",
  },
  energyBill: {
    stat: "£23,437",
    text: "One energy bill for Kilmarnock MP Lillian Jones, paid by taxpayers. It came in two claims, dated the same day.",
    href: "/blog/kilmarnock-mp-23437-electricity-bill",
    cta: "Read the story",
  },
  flats: {
    stat: "£623,696",
    text: "Paid by taxpayers in one year to rent Edinburgh flats for 36 MSPs. Some live 50 miles away.",
    href: "/blog/msp-edinburgh-flats-commuter-belt",
    cta: "See who claims",
  },
  receipts: {
    stat: "20,879",
    text: "Receipts Scottish MPs put on expenses. Check what yours claimed before you write.",
    href: "/mp-expenses-scotland/search",
    cta: "Search by postcode",
  },
} satisfies Record<string, NudgeBridge>;

type TopicSetup = { tool?: NudgeTool; altTool?: NudgeTool; bridge?: NudgeBridge };

const TOPICS: Record<NudgeTopic, TopicSetup> = {
  "council-tax": { tool: TOOLS.councilTax, altTool: TOOLS.compare, bridge: BRIDGES.councilTax },
  energy: { tool: TOOLS.heating, altTool: TOOLS.councilTax, bridge: BRIDGES.energyBill },
  pay: { tool: TOOLS.takeHome, altTool: TOOLS.compare, bridge: BRIDGES.tvLicence },
  benefits: { tool: TOOLS.benefits, altTool: TOOLS.takeHome, bridge: BRIDGES.whatItCouldBuy },
  housing: { tool: TOOLS.compare, altTool: TOOLS.benefits, bridge: BRIDGES.flats },
  "cost-of-living": { tool: TOOLS.takeHome, altTool: TOOLS.benefits, bridge: BRIDGES.energyBill },
  poverty: { tool: TOOLS.simd, altTool: TOOLS.quiz, bridge: BRIDGES.whatItCouldBuy },
  area: { tool: TOOLS.compare, altTool: TOOLS.simd },
  contact: { tool: TOOLS.email, altTool: TOOLS.findReps, bridge: BRIDGES.receipts },
  school: { tool: TOOLS.quiz, altTool: TOOLS.simd },
  investigation: { tool: TOOLS.findReps, bridge: BRIDGES.whatItCouldBuy },
};

const SLUG_TOPIC: Record<string, NudgeTopic> = {
  "how-council-tax-works-scotland": "council-tax",
  "council-tax-rises-scotland-2026-27": "council-tax",
  "check-council-tax-band": "council-tax",
  "council-tax-reduction-scotland": "council-tax",
  "single-person-discount-council-tax-scotland": "council-tax",
  "water-rates-scotland": "council-tax",

  "energy-price-cap-scotland-2026-explained": "energy",
  "100-energy-payment-scotland": "energy",
  "winter-fuel-payment-scotland": "energy",
  "winter-heating-payment": "energy",

  "minimum-wage-2027": "pay",
  "minimum-wage-aberdeen": "pay",
  "minimum-wage-dundee": "pay",
  "minimum-wage-in-edinburgh-scotland": "pay",
  "minimum-wage-in-glasgow-scotland": "pay",
  "minimum-wage-take-home-pay-scotland-2026": "pay",
  "real-living-wage-vs-minimum-wage-scotland": "pay",
  "average-salary-scotland": "pay",
  "unemployment-scotland": "pay",

  "adult-disability-payment": "benefits",
  "adult-disability-payment-phone-number": "benefits",
  "best-start-grant": "benefits",
  "carer-support-payment": "benefits",
  "crisis-grant-phone-number": "benefits",
  "crisis-grant-scotland-how-to-apply": "benefits",
  "free-school-meals-clothing-grant-scotland": "benefits",
  "social-security-scotland-payment-dates": "benefits",
  "what-is-the-scottish-child-payment": "benefits",
  "universal-credit-when-you-work-more-hours": "benefits",
  "young-carers-allowance-scotland": "benefits",

  "local-housing-allowance-rent-shortfall-scotland": "housing",
  "discretionary-housing-payment-scotland": "housing",
  "buchanan-galleries-man-council-houses": "housing",

  "why-is-the-cost-of-living-so-high": "cost-of-living",
  "why-food-prices-stay-high-when-inflation-falls": "cost-of-living",

  "what-does-poverty-mean": "poverty",
  "do-people-in-poverty-work": "poverty",
  "causes-of-poverty": "poverty",
  "drug-deaths-scotland-deprivation": "poverty",

  "crime-rate-glasgow": "area",
  "life-expectancy-glasgow": "area",
  "east-vs-west-dunbartonshire": "area",
  "best-performing-councils-scotland": "area",
  "shoplifting-scotland-record-high": "area",
  "glasgow-sex-crime-rise-migrants": "area",
  "crisis-grant-acceptance-rates-scotland-councils": "area",

  "how-to-contact-your-mp-or-msp": "contact",
  "who-is-my-msp": "contact",
  "who-is-my-local-councillor-by-postcode": "contact",

  "modern-studies": "school",
  "national-5-modern-studies": "school",
  "higher-modern-studies": "school",
  "advanced-higher-modern-studies": "school",
  "higher-modern-studies-past-papers": "school",
  "nat-5-modern-studies-past-papers": "school",

  "operation-branchform-snp-money-timeline": "investigation",
};

/** One page can swap its topic's expenses link for a closer one, or drop it (null). */
const BRIDGE_OVERRIDES: Record<string, NudgeBridge | null> = {
  "crisis-grant-acceptance-rates-scotland-councils": BRIDGES.whatItCouldBuy,
  "best-performing-councils-scotland": BRIDGES.councilTax,
  "glasgow-sex-crime-rise-migrants": null,
  "drug-deaths-scotland-deprivation": null,
  "local-housing-allowance-rent-shortfall-scotland": BRIDGES.flats,
  "100-energy-payment-scotland": BRIDGES.energyBill,
};

export function topicFor(slug: string): NudgeTopic | undefined {
  return SLUG_TOPIC[slug];
}

export type PostNudges = {
  topic?: NudgeTopic;
  /** The tool to offer, never the page the reader is already on. */
  tool?: NudgeTool;
  bridge?: NudgeBridge;
};

/**
 * The tool and expenses link for one page. Pass `avoid` with any href the
 * page already promotes nearby (the compare box, say) so the reader is not
 * offered the same thing twice.
 */
export function nudgesFor(slug: string, avoid: string[] = []): PostNudges {
  const topic = topicFor(slug);
  if (!topic || EXPENSE_STORY_SLUGS.has(slug)) return { topic };
  const setup = TOPICS[topic];
  const here = postPath(slug);
  const usable = (tool?: NudgeTool) => tool && tool.href !== here && !avoid.includes(tool.href);
  const tool = usable(setup.tool) ? setup.tool : usable(setup.altTool) ? setup.altTool : undefined;
  const bridge = slug in BRIDGE_OVERRIDES ? (BRIDGE_OVERRIDES[slug] ?? undefined) : setup.bridge;
  return { topic, tool, bridge };
}

/**
 * Articles to read next, in order: same topic, then same section, then the
 * rest. Expenses stories are left out of a guide's list because the expenses
 * link above already points there, and the series has its own strip.
 */
export function readNextFor(slug: string, limit = 5): Post[] {
  const current = getPost(slug);
  if (!current) return [];
  const isStory = EXPENSE_STORY_SLUGS.has(slug);
  const topic = topicFor(slug);
  const tags = new Set(current.tags);
  const shared = (p: Post) => p.tags.filter((t) => tags.has(t)).length;
  // A stable shuffle, so similar pages point at different neighbours.
  const mix = (other: string) => {
    let h = 0;
    for (const ch of slug + other) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return h;
  };
  const score = (p: Post) =>
    (topic && topicFor(p.slug) === topic ? 100 : 0) + (p.category === current.category ? 10 : 0) + shared(p);
  return postsByDate()
    .filter((p) => p.slug !== slug && (isStory || !EXPENSE_STORY_SLUGS.has(p.slug)))
    .sort((a, b) => score(b) - score(a) || mix(a.slug) - mix(b.slug))
    .slice(0, limit);
}

/** Tiles for the top of each section page and the explainers index. */
export const SECTION_STARTERS: Record<string, Array<NudgeTool | NudgeBridge>> = {
  "money-and-bills": [TOOLS.councilTax, TOOLS.takeHome, TOOLS.benefits],
  "poverty-explained": [TOOLS.simd, TOOLS.compare, TOOLS.quiz],
  "take-action": [TOOLS.email, TOOLS.findReps, BRIDGES.receipts],
  "politics-explained": [BRIDGES.flats, BRIDGES.whatItCouldBuy, BRIDGES.receipts],
  all: [TOOLS.councilTax, TOOLS.takeHome, BRIDGES.receipts],
};

export function isBridge(item: NudgeTool | NudgeBridge): item is NudgeBridge {
  return "stat" in item;
}
