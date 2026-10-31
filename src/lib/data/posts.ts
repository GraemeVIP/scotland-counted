import { snpMoneyTimelineSources } from "@/lib/data/snpMoneyTimeline";
import type { QuickAnswerData } from "@/components/QuickAnswer";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, bandFor, pounds } from "@/lib/data/quickAnswers";
import {
  ADULT_DISABILITY_PAYMENT,
  BANK_HOLIDAY_SOURCE,
  BEST_START,
  CARER_SUPPORT_PAYMENT,
  PENSION_AGE_WINTER_HEATING,
  SOCIAL_SECURITY_SCOTLAND,
  SSS_SOURCE,
  WINTER_HEATING_PAYMENT,
  YOUNG_CARER_GRANT,
} from "@/lib/data/benefits";
import { ASHE_2026, CITY_PAY, PRIVATE_RENTS, SCOTLAND_JOBS_HOURLY, asheCouncil, cityBudget, minimumWageNext, minimumWageNow } from "@/lib/data/money";
import { waterCharges2026, BAND_LETTERS } from "@/lib/data/councilTax";
import { COUNCIL_SEARCH_NAMES } from "@/lib/routeMap";
import { BAND_PROPOSALS, COUNCIL_TAX_REDUCTION, LOTHIAN_VJB_SOURCE, SCOTTISH_WATER, SECOND_ADULT_REBATE, SINGLE_PERSON_DISCOUNT, WATER_CHARGES_REDUCTION, bandValueLabel } from "@/lib/data/councilTaxHelp";
import { scotlandPoverty } from "@/lib/data/scotland";
import { ADVANCED_HIGHER_MODERN_STUDIES, HIGHER_MODERN_STUDIES, JRF_SCOTLAND_2026, MODERN_STUDIES_EXAMS_2027, MODERN_STUDIES_LINKS, MODERN_STUDIES_PAST_PAPERS, N5_MODERN_STUDIES, QS_REPLACED_SQA, QS_SOURCE, plainPeriod } from "@/lib/data/schools";
import { ANNUAL_POPULATION_SURVEY, COUNCILLOR_SOURCE, COUNCILLOR_TOTALS, COUNCIL_UNEMPLOYMENT, GLASGOW_CRIME, GLASGOW_CRIME_PREVIOUS, LABOUR_MARKET, LABOUR_MARKET_LATEST, LIFE_EXPECTANCY, LIFE_EXPECTANCY_LATEST, LOCAL_ELECTION_2027, SCOTTISH_PARLIAMENT, TOTAL_MSPS, changePct, councilSearchName, pct, pointsChange, years } from "@/lib/data/local";

/**
 * Plain-English articles and their search/wayfinding metadata.
 *
 * The first screen gives a normal reader the answer. The same article then
 * exposes the dates, definitions and original sources that a journalist or
 * representative may need to check it.
 */

/*
 * Each category carries two colours, because one cannot serve both backgrounds.
 *
 * `color` is tuned for the light index. Moved onto a dark slab it stops being
 * legible: --brand manages 3.14:1 on --deep and --warn-text 2.77:1, against the
 * 4.5:1 this size of text needs. "Politics explained" was close to unreadable
 * on the blog hero and on the homepage rail.
 *
 * `colorOnDark` is the same idea in a light key, and every value is measured at
 * 7:1 or better on --deep. Two of them were already in use in
 * blog/[slug]/opengraph-image.tsx, which had run into this first and fixed it
 * locally with a ternary; that now reads from here instead.
 */
export const postCategories = [
  {
    slug: "money-and-bills",
    name: "Money and bills",
    description: "Why food, rent, energy and wages no longer add up in Scotland. See what each one costs now and who controls the rules that set the price.",
    color: "var(--action-text)",
    colorOnDark: "#8bb8ff",
  },
  {
    slug: "poverty-explained",
    name: "Poverty explained",
    description: "The words and the numbers stripped of jargon: what poverty officially means, how it is measured in Scotland, and the proof under every figure.",
    color: "var(--brand)",
    colorOnDark: "#8fa8ff",
  },
  {
    slug: "take-action",
    name: "Take action",
    description: "Simple ways to make the people with power answer for what they decide: who to write to, what to ask and what happens after you press send.",
    color: "var(--good-text)",
    colorOnDark: "#3ddc9a",
  },
  {
    /*
     * The slug stays "politics-explained" while the label reads
     * "Investigations". A slug change would move a live category URL for the
     * sake of tidiness, and this one has a real page behind it. If this
     * section ever holds more than the Branchform timeline, migrate the slug
     * properly with a redirect rather than quietly breaking the old one.
     */
    slug: "politics-explained",
    name: "Investigations",
    description: "The facts, dates and primary records behind Scottish political stories, with allegations, investigations and court findings kept clearly separate.",
    color: "var(--warn-text)",
    colorOnDark: "#f5b53d",
  },
] as const;

export type PostCategorySlug = (typeof postCategories)[number]["slug"];

export type Post = {
  slug: string;
  title: string;
  /** Optional search/social title when the natural on-page H1 should read differently. */
  seoTitle?: string;
  /** Meta description and card text. Written for a search result, not a headline. */
  description: string;
  /** The opening line on the post itself. */
  standfirst: string;
  /** ISO date published. */
  date: string;
  /** ISO date the content was last revised. Shown as "Last updated". */
  updated?: string;
  /**
   * ISO date every figure on the page was last checked against its source.
   * Only set it when that has actually been done: it is shown to readers as
   * "Figures checked", so a page with figures known to be out of date has none.
   */
  checked?: string;
  category: PostCategorySlug;
  tags: string[];
  readingMinutes: number;
  /** The answer box that opens the page. Money, council tax and benefit guides have one. */
  quickAnswer?: QuickAnswerData;
  /** Preserve guide placement when it has an editorial image. */
  guideImage?: boolean;
  /** Optional: a guide without a photograph gets the Saltire cover instead. */
  image?: {
    src: string;
    alt: string;
    caption: string;
    aspect?: "landscape" | "wide" | "video";
    objectPosition?: string;
    /** Optional credit, e.g. for a data graphic. */
    creditLabel?: string;
    /**
     * Optional version for listing cards, which crop to anything from square
     * to about 2:1. A wide data graphic loses its title and labels in that
     * crop, so it can supply one composed to survive it. Falls back to src.
     */
    cardSrc?: string;
  };
  /** Optional direct Open Graph and X image. Falls back to the generated post card. */
  shareImage?: {
    src: string;
    width: number;
    height: number;
    type: string;
    /** For a card with words on it. Falls back to the hero photo's alt text. */
    alt?: string;
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
    slug: "shoplifting-scotland-record-high",
    title: "Shoplifting in Scotland: the rate overtakes England and Wales as convictions nearly halve",
    seoTitle: "Shoplifting in Scotland: Record High, Above England and Wales",
    description: "Shoplifting in Scotland hit a record 53,369 crimes in 2025/26: 9.6 per 1,000 people against 8.2 in England and Wales. Convictions nearly halved.",
    standfirst:
      "Shoplifting in Scotland is at its highest since 1971 and now higher per person than in England and Wales. Convictions have nearly halved. Food prices explain much of the surge, but not the last two years.",
    date: "2026-09-28",
    category: "politics-explained",
    tags: [
      "Shoplifting Scotland",
      "Shoplifting statistics",
      "Crime in Scotland",
      "Cost of living",
      "Police Scotland",
      "Edinburgh",
      "Glasgow",
    ],
    readingMinutes: 13,
    image: {
      src: "/images/editorial/refresh-shoplifting.webp",
      alt: "An empty grocery shop aisle with everyday goods on the shelves",
      caption:
        "Scotland had less shoplifting per person than England and Wales before Covid. In 2025-26 it had 17% more.",
      aspect: "wide",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/refresh-shoplifting.webp",
      width: 1500,
      height: 1000,
      type: "image/webp",
    },
    toc: [
      { id: "short-answer", label: "Four key figures" },
      { id: "uk", label: "Scotland has overtaken England and Wales" },
      { id: "record", label: "A record, and almost all shoplifting" },
      { id: "caught", label: "Fewer shoplifters convicted" },
      { id: "councils", label: "Shoplifting by council" },
      { id: "food-prices", label: "Food prices, up to a point" },
      { id: "reporting", label: "Are shops reporting more?" },
      { id: "who-is-in-charge", label: "Who is responsible?" },
      { id: "verdict", label: "What is driving it" },
      { id: "limits", label: "What the data cannot prove" },
    ],
    faq: [
      {
        q: "Is shoplifting in Scotland at a record high?",
        a: "Yes. Police Scotland recorded 53,369 shoplifting crimes in 2025-26, the highest since comparable records began in 1971. That is 19% more than in 2024-25 and 74% more than in 2019-20, the last year before Covid.",
      },
      {
        q: "Does Scotland have more shoplifting than England?",
        a: "Per person, yes. In 2025-26 Scotland recorded 9.6 shoplifting crimes per 1,000 people, against 8.2 in England and Wales. Scotland was lower before Covid. Shoplifting fell 4% in England and Wales in 2025-26 but rose 19% in Scotland.",
      },
      {
        q: "Are fewer shoplifters being convicted in Scotland?",
        a: "Yes. 5,422 people were convicted with shoplifting as their main crime in 2019-20, and 2,854 in 2023-24, the latest year published. Police solved 50.6% of recorded shoplifting in 2025-26, down from 66.3% in 2019-20. People who are convicted are not sentenced more lightly: the share jailed rose.",
      },
      {
        q: "Is the cost of living crisis causing more shoplifting?",
        a: "It fits the timing of the biggest rises. Shoplifting grew fastest in 2022-23 and 2023-24, when food prices were rising fastest. Since 2024 it has grown faster than food prices alone would predict, while Crisis Grant applications and food bank parcels fell, so other causes such as lower detection, more reporting and organised theft are likely to play a part.",
      },
      {
        q: "Which council area in Scotland has the most shoplifting?",
        a: "Edinburgh recorded the most shoplifting crimes in 2025-26, 10,595, ahead of Glasgow on 9,722. Dundee City had the highest rate for its size, 211.8 crimes per 10,000 people.",
      },
    ],
    sourceIds: [
      "recorded-crime-2025-26-dishonesty",
      "recorded-crime-2025-26-tables",
      "sgs-recorded-crime",
      "criminal-proceedings-2023-24",
      "ons-cpi-food-index",
      "ons-crime-england-wales-2026",
      "swf-tables-2025-26",
      "sgs-scottish-welfare-fund",
      "ecp",
      "trussell-parcels-2025",
      "spa-retail-crime-2024",
      "retail-non-intervention",
      "slr-retail-crime-taskforce",
      "police-scotland-retail-taskforce",
      "chalfin-mccrary-2017",
      "sentencing-presumption-2019",
      "sg-prison-population-2025",
      "prisoners-early-release-act-2025",
      "sps-early-release",
      "short-term-prisoner-release-2026",
      "spa-proportionate-response",
      "judiciary-shoplifting-case-management",
      "scottish-parliament-devolved-powers",
      "crime-policing-act-2026-retail",
      "protection-of-workers-scotland-2021",
    ],
  },
  {
    slug: "glasgow-sex-crime-rise-migrants",
    title: "Glasgow sexual assaults went up 28%. Was it migrants?",
    seoTitle: "Glasgow Sexual Assault Rise: Were Migrants Behind the 28%?",
    description: "Recorded sexual assaults in Glasgow rose 28% and rapes 41% in April to December 2024. The public data checked here do not establish who caused it.",
    standfirst:
      "A post on X says Glasgow's 30% rise in sexual assaults was driven by migrants. The rise is real. Here is what the police records, the census and the Home Office files say about who was behind it.",
    date: "2026-09-06",
    category: "politics-explained",
    tags: [
      "Glasgow sexual assault",
      "Glasgow rape statistics",
      "Migrants and crime Scotland",
      "Asylum seekers Glasgow",
      "Police Scotland recorded crime",
      "Glasgow crime 2024",
      "Fact check",
    ],
    readingMinutes: 13,
    image: {
      src: "/images/editorial/refresh-glasgow-investigation.webp",
      alt: "Paper documents and a magnifying glass beside a window overlooking a Scottish street",
      caption:
        "The 28.1% figure is for recorded sexual assaults in Glasgow City: 499 in April–December 2023 and 639 in the same months of 2024.",
      aspect: "video",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/refresh-glasgow-investigation.webp",
      width: 1500,
      height: 1000,
      type: "image/webp",
    },
    toc: [
      { id: "number", label: "The number is real" },
      { id: "changed", label: "Two things changed in April 2024" },
      { id: "kind", label: "What kind of crimes went up" },
      { id: "caught", label: "What the accused records show" },
      { id: "arrivals", label: "Could new arrivals have done it?" },
      { id: "last-year", label: "The last 12 months" },
      { id: "england", label: "The England test" },
      { id: "sums", label: "How we did the sums" },
      { id: "unknown", label: "What we still do not know" },
      { id: "download", label: "Check every number" },
      { id: "ask", label: "The request we are sending" },
    ],
    faq: [
      {
        q: "Did sexual assaults in Glasgow really rise by 30%?",
        a: "Recorded sexual assaults in Glasgow City rose 28%, from 499 to 639, in April to December 2024 compared with the same months in 2023. Rapes rose 41% in the same police report. Across the rest of Scotland, sexual assaults fell 4%.",
      },
      {
        q: "Were migrants behind Glasgow's rise in sexual assaults?",
        a: "The public data checked here do not establish who caused the increase. The police reports discuss an evidence rule change for domestic abuse and reporting for rape, but do not explain the sexual assault rise. Of 117 accused entries in a Greater Glasgow disclosure for 2025, 43 were British, 12 had named non British nationalities and 62 had unknown nationality. Across 276 English and Welsh councils, the comparisons are mixed: a small positive association between places and an uncertain result within councils over time. Neither identifies a Glasgow cause.",
      },
      {
        q: "What changed in April 2024?",
        a: "Police Scotland links a domestic abuse increase to corroboration guidance introduced in April 2024. UNIFI was fully rolled out by 5 December 2023, and the Scottish Police Authority says all crime data came from the common system from April 2024. Those changes are relevant context, but their contribution to Glasgow's sexual assault increase has not been measured.",
      },
      {
        q: "How many asylum seekers live in Glasgow?",
        a: "Home Office figures show between about 3,800 and 4,200 people supported in Glasgow at any point from 2023 to June 2026. The rising group is refugees who have been granted the right to stay and then apply to the council as homeless: about 3,500 households in 2025/26.",
      },
      {
        q: "Has sexual crime in Glasgow gone up in the past year?",
        a: "In the year to June 2026, rape and attempted rape in Glasgow fell 1%, sexual assault rose 3% (the same as Scotland) and all sexual crimes rose 9%, driven by online offences such as sending indecent images.",
      },
    ],
    sourceIds: [
      "ps-glasgow-q3-2024-25",
      "ps-glasgow-q2-2025-26",
      "ps-management-information-2025-26",
      "recorded-crime-scotland-2025-26",
      "sg-recorded-crime-ye-june-2026",
      "spa-performance-q4-2024-25",
      "spa-rape-deep-dive-2025",
      "ps-foi-24-0634",
      "ps-foi-26-0040",
      "ps-foi-25-0272",
      "ps-foi-25-1795",
      "ps-foi-24-1614",
      "ps-foi-26-0373",
      "ps-foi-25-3132",
      "census-2022-uv204-uv206",
      "nrs-mid-year-2025",
      "ho-asylum-support-la-jun-2026",
      "glasgow-hscp-annual-2024-25",
      "glasgow-hscp-strategic-monitoring-apr-2026",
      "glasgow-hscp-chief-officer-mar-2026",
      "nrs-international-migration-2025",
      "dwp-nino-mar-2026",
      "ho-irregular-migration-jun-2026",
      "ho-prc-csp-open-data-2026",
      "mygov-when-arrested",
    ],
  },
  {
    slug: "best-performing-councils-scotland",
    title: "Best council in Scotland: all 32 ranked",
    seoTitle: "Best Council in Scotland 2026: All 32 Ranked",
    description: "The best council in Scotland is East Renfrewshire on our 2026 ranking of 53 official figures. See all 32 councils, the like for like list and every number.",
    standfirst:
      "East Renfrewshire comes first in our new ranking of all 32 Scottish councils. East Lothian is second and Edinburgh third. But the like for like list and resident survey tell a more surprising story.",
    date: "2026-08-16",
    updated: "2026-10-29",
    category: "politics-explained",
    tags: [
      "Best council in Scotland",
      "Scottish council rankings",
      "Council performance",
      "Local Government Benchmarking Framework",
      "Best places to live in Scotland",
      "Scottish local government",
      "Council services",
    ],
    readingMinutes: 14,
    image: {
      src: "/images/editorial/refresh-councils.webp",
      alt: "A civic building with an accessible entrance and a tree-lined street",
      caption:
        "East Renfrewshire is the clear leader. But the exact order moves when we change the rules, so we show the usual range for every council.",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/refresh-councils.webp",
      width: 1500,
      height: 1000,
      type: "image/webp",
    },
    toc: [
      { id: "answer", label: "The answer in four numbers" },
      { id: "winner", label: "Why East Renfrewshire wins" },
      { id: "uncertainty", label: "Does the winner change?" },
      { id: "all-councils", label: "Every council ranked" },
      { id: "cities", label: "How the cities compare" },
      { id: "different-winners", label: "Five ways to be good" },
      { id: "peer-groups", label: "The like for like list" },
      { id: "residents", label: "Residents disagree" },
      { id: "surprises", label: "The biggest contradiction" },
      { id: "not-in-score", label: "What was left out" },
      { id: "method", label: "How we worked it out" },
      { id: "download", label: "Check every number" },
      { id: "questions", label: "What councils must answer" },
    ],
    faq: [
      { q: "What is the best council in Scotland?", a: "East Renfrewshire comes first in Scotland Counted's 2026 council ranking. It is number one for services and results and stayed first in all ten extra checks. We built the ranking from 53 official figures. It is not a government award." },
      { q: "Which Scottish council do residents rate most highly?", a: "Shetland Islands comes first in the separate resident survey, averaging 52.1% across five questions in the 2024 Scottish Household Survey. Only a few hundred people answered in each area, so tiny gaps may be down to chance." },
      { q: "Does the ranking measure the best place to live in Scotland?", a: "No. It measures how councils perform, not every reason a place is good to live. Poverty, crime, health, housing and loneliness are shown separately. That stops richer areas automatically looking like better run councils." },
      { q: "How were Scottish councils ranked?", a: "We used 53 official figures, grouped into 29 topics. Services and results count for 40%, what residents said 25%, how the council is run 20%, value for money 10% and council emissions 5%. We then changed the rules 10,000 sensible ways to see how much the order moved." },
      { q: "Which council performs best against similar councils?", a: "East Renfrewshire stays first and East Lothian second in the like for like list. Inverclyde jumps from 12th across Scotland to third against councils facing similar conditions." },
      { q: "Which council comes last in Scotland?", a: "Dundee comes last in our 2026 main ranking. That does not mean Dundee is Scotland's worst place to live, or that the council caused the city's poverty or health problems. It had the weakest overall result in the latest council figures we could compare fairly." },
    ],
    sourceIds: [
      "lgbf-performance-2026",
      "lgbf-family-groups",
      "shs-council-perceptions-2024",
      "shs-methodology-2024",
      "shs-neighbourhoods-2024",
      "shcs-local-authority-2022-24",
      "recorded-crime-scotland-2025-26",
      "oecd-composite-indicators",
      "jrc-composite-normalisation",
      "ecp",
      "nrs-drug-deaths-2024",
      "swf-statistics-2025-26",
    ],
  },
  {
    slug: "operation-branchform-snp-money-timeline",
    title: "Operation Branchform timeline: the full SNP money story",
    seoTitle: "Operation Branchform Timeline: SNP Money Case Explained",
    description: "Operation Branchform: Peter Murrell admitted embezzling £400,310.65 from the SNP. Nicola Sturgeon and Colin Beattie were investigated but not charged.",
    standfirst:
      "Use this Operation Branchform timeline to follow every major event from the SNP fundraisers to Peter Murrell's conviction. Nicola Sturgeon and Colin Beattie were not charged.",
    date: "2026-08-02",
    updated: "2026-08-02",
    category: "politics-explained",
    tags: [
      "Operation Branchform",
      "Operation Branchform timeline",
      "Nicola Sturgeon",
      "Peter Murrell",
      "SNP finances",
      "Scottish politics",
      "Indyref2 fundraiser",
    ],
    readingMinutes: 26,
    image: {
      src: "/images/editorial/refresh-snp-finances.webp",
      alt: "A stack of paper records and a folder on a desk overlooking a city",
      caption:
        "The story began with questions about referendum donations. The court case ultimately proved a different, 12 year course of embezzlement from the SNP's main account.",
      objectPosition: "center 48%",
    },
    shareImage: {
      src: "/images/editorial/refresh-snp-finances.webp",
      width: 1500,
      height: 1000,
      type: "image/webp",
    },
    toc: [
      { id: "short-answer", label: "The whole story in one minute" },
      { id: "money", label: "Three money figures" },
      { id: "timeline", label: "The full timeline" },
      { id: "court-proved", label: "What the court proved" },
      { id: "investigation", label: "How the case worked" },
      { id: "what-is-live", label: "What is still live" },
      { id: "updates", label: "Bookmark and follow updates" },
    ],
    faq: [
      {
        q: "Was Nicola Sturgeon charged over the SNP finances?",
        a: "No. Police arrested Sturgeon in June 2023 but did not charge her. On 20 March 2025, Police Scotland said she was no longer under investigation in Operation Branchform. Prosecutors later said two separate senior counsel reviews agreed that no charge or further inquiry was required.",
      },
      {
        q: "How much did Peter Murrell steal from the SNP?",
        a: "The final amount established by his guilty plea and the agreed court narrative was £400,310.65, embezzled between August 2010 and October 2022. Earlier figures above £459,000 were allegations at earlier stages, not the final proved total.",
      },
      {
        q: "Was the £600,000 referendum fund the money Murrell stole?",
        a: "The court did not make that finding. Questions about referendum appeals prompted the wider police inquiry, which uncovered embezzlement from the SNP's principal account. Prosecutors said that account mainly contained membership fees, donations and legacies, but the agreed narrative did not allocate each stolen pound to the referendum appeal.",
      },
      {
        q: "Is Operation Branchform finished?",
        a: "Murrell's criminal prosecution and sentence are complete. However, court action to recover money gained through the crime and decide what happens to seized property remained, and the Electoral Commission was reviewing earlier filings at its latest update. It is therefore too broad to say every part is closed.",
      },
      {
        q: "Is Nicola Sturgeon under investigation again over Yes Scotland?",
        a: "Police confirmed in July 2026 that they were making inquiries after a separate complaint about Yes Scotland's finances. As at 2 August, police had not publicly named Sturgeon or anyone else as a suspect. Yes Scotland denied money was missing and provided its accounts.",
      },
    ],
    sourceIds: snpMoneyTimelineSources.map((source) => source.id),
  },
  {
    slug: "east-vs-west-dunbartonshire",
    title: "East vs West Dunbartonshire: next door, worlds apart",
    seoTitle: "East vs West Dunbartonshire: Why Two Neighbours Are Worlds Apart",
    description:
      "East Dunbartonshire is the 2nd best place to live in Scotland on the official figures. West Dunbartonshire, next door, is 30th. Here is what happened, in the numbers and the history.",
    standfirst:
      "They share a name and a border. On almost every official measure they sit at opposite ends of Scotland, with around five years between them in life expectancy. The reasons go back to shipyards, a sewing machine factory and where a council boundary fell in 1996.",
    date: "2026-10-29",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "poverty-explained",
    tags: [
      "East Dunbartonshire",
      "West Dunbartonshire",
      "Clydebank",
      "Bearsden",
      "Deprivation",
      "Life expectancy",
      "Compare areas",
    ],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/east-vs-west-dunbartonshire.webp",
      cardSrc: "/images/editorial/east-vs-west-dunbartonshire-card.webp",
      alt: "Collage titled East Dunbartonshire vs West Dunbartonshire: green hills, a high street and old stone ruins on the east side; a castle on a rock, Loch Lomond, a shipyard crane and boats on a river on the west.",
      caption:
        "A baby boy born in East Dunbartonshire can expect to live 80.3 years. In West Dunbartonshire, next door, it's 75.0.",
      aspect: "landscape",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/east-vs-west-dunbartonshire.webp",
      width: 1500,
      height: 1000,
      type: "image/webp",
    },
    quickAnswer: {
      label: "Why West Dunbartonshire is poorer than East Dunbartonshire",
      detail:
        "When councils were redrawn in 1996, East Dunbartonshire got the commuter suburbs north of Glasgow and West Dunbartonshire got the industrial towns on the Clyde. Those towns lost their shipyards and the Singer factory. Today 48 of West Dunbartonshire's 121 neighbourhoods are in Scotland's most deprived fifth, against 5 of East Dunbartonshire's 130.",
      rows: [
        { label: "Best place to live ranking", value: "2nd vs 30th of 32" },
        { label: "Life expectancy, men", value: "80.3 vs 75.0 years" },
        { label: "Average house price", value: "£273,891 vs £132,345" },
        { label: "Child poverty", value: "14.9% vs 25.2%" },
      ],
      asOf: "East first, West second · latest official figures",
    },
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "numbers", label: "The gap in numbers" },
      { id: "line", label: "Same name, two councils" },
      { id: "west", label: "What West Dunbartonshire lost" },
      { id: "east", label: "How East Dunbartonshire pulled ahead" },
      { id: "health", label: "The gap that matters most" },
      { id: "averages", label: "What the averages hide" },
      { id: "who", label: "Who can change it" },
    ],
    faq: [
      {
        q: "Why is West Dunbartonshire so deprived?",
        a: "West Dunbartonshire is made up of Clydebank, Dumbarton and the Vale of Leven, towns built on shipbuilding and heavy industry. The Denny shipyard in Dumbarton closed in 1963, shipbuilding ended at John Brown's in Clydebank in 1972 and the Singer factory closed in 1980. Today 48 of its 121 neighbourhoods are in Scotland's most deprived fifth, and men there live about five years less than in East Dunbartonshire.",
      },
      {
        q: "Is East Dunbartonshire a good place to live?",
        a: "On the official figures it is one of the best in Scotland: 2nd of the 32 council areas, behind only East Renfrewshire, on pay, jobs, poverty, crime, health and schools. Half of its neighbourhoods are in Scotland's least deprived fifth, and 79.1% of its school leavers leave with at least one Higher.",
      },
      {
        q: "What is the difference between East and West Dunbartonshire?",
        a: "They are separate councils, both created in 1996 and both named after the old county of Dunbartonshire. East Dunbartonshire covers the suburbs north of Glasgow, including Bearsden, Milngavie, Bishopbriggs, Lenzie and Kirkintilloch. West Dunbartonshire covers Clydebank, Dumbarton and the Vale of Leven.",
      },
      {
        q: "Which towns are in West Dunbartonshire?",
        a: "Clydebank, Dumbarton and the Vale of Leven towns of Alexandria, Balloch, Bonhill, Jamestown and Renton, plus Old Kilpatrick, Bowling and Duntocher.",
      },
      {
        q: "Which towns are in East Dunbartonshire?",
        a: "Bearsden, Milngavie, Bishopbriggs, Kirkintilloch and Lenzie, plus Lennoxtown, Milton of Campsie, Torrance and Twechar.",
      },
    ],
    sourceIds: [
      "simd-2020",
      "nrs-life-expectancy-2022-2024",
      "nrs-drug-deaths-2025",
      "ecp",
      "ashe",
      "uk-hpi-2026-08",
      "recorded-crime-2025-26",
      "ssaild-2026",
      "lgsa-1994-schedule-1",
      "boundaries-scotland-1995-onwards",
      "lgsa-1973-schedule-1",
      "edlc-towns-and-villages",
      "uofg-john-brown",
      "rmg-lusitania",
      "wdc-three-queens",
      "wdc-singer",
      "stone-1979-singer",
      "nrs-clydebank-blitz",
      "wdc-blitz",
      "wdc-aviation",
      "wdc-river-leven-trail",
      "smm-denny",
      "wdc-queens-quay",
      "edc-old-bearsden-appraisal",
      "edc-tannoch-appraisal",
      "gcph-excess-mortality-2016",
    ],
  },
  {
    slug: "drug-deaths-scotland-deprivation",
    title: "Drug deaths in Scotland: the deprivation divide",
    seoTitle: "Drug Deaths in Scotland and Deprivation | 2025 Data",
    description: "Drug deaths in Scotland rose to 1,133 in 2025. The rate in the most deprived areas was about 15 times the least deprived, and Glasgow's was highest.",
    standfirst: "People in Scotland's most deprived areas had about 15 times the drug death rate of those in the least deprived areas in 2025. Glasgow had the highest council area rate over 2021 to 2025. The link is stark, but it needs to be read carefully.",
    date: "2026-08-08",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "poverty-explained",
    tags: [
      "Drug deaths Scotland",
      "Deprivation",
      "Glasgow drug deaths",
      "Health inequality",
      "SIMD",
      "Poverty in Scotland",
    ],
    readingMinutes: 8,
    image: {
      src: "/images/editorial/refresh-drug-deaths.webp",
      alt: "A quiet residential street with tenements and a public building in the distance",
      caption:
        "The figures below compare rates across areas, rather than describing individual circumstances.",
      objectPosition: "center 50%",
    },
    toc: [
      { id: "short-answer", label: "The answer in three numbers" },
      { id: "deprivation", label: "The deprivation divide" },
      { id: "glasgow", label: "Where Glasgow sits" },
      { id: "rise", label: "The rise in 2025" },
      { id: "substances", label: "What the substance figures mean" },
      { id: "uk", label: "A safe UK comparison" },
      { id: "limits", label: "What the data cannot prove" },
    ],
    faq: [
      { q: "Are drug deaths linked to deprivation in Scotland?", a: "Yes, there is a very strong area level association. In 2025 the age standardised rate in Scotland's most deprived fifth was 54.5 deaths per 100,000, compared with 3.6 in the least deprived fifth: about 15 times as high. That does not prove every person who died was poor or that deprivation alone caused an individual death." },
      { q: "Which Scottish council area has the highest drug death rate?", a: "Glasgow City had the highest age standardised drug use death rate in the National Records of Scotland comparison for 2021 to 2025: 38.0 deaths per 100,000, against 21.6 for Scotland as a whole. Dundee City (34.0) and North Ayrshire (31.0) came next. NRS combines five years because single year council rates can be unstable." },
      { q: "Did drug deaths in Scotland rise in 2025?", a: "Yes. National Records of Scotland registered 1,133 drug use deaths in 2025, 116 more than in 2024 and up 11%. The age standardised rate rose from 19.1 to 21.4 per 100,000, but NRS says that rise is not statistically significant. The number is still below the 2020 peak of 1,339." },
      { q: "Can the substance figures be added together?", a: "No. More than one drug was implicated in 78% of Scotland's drug use deaths in 2025, and broad classes contain individual substances. The opioid, cocaine, benzodiazepine and other rows overlap." },
    ],
    sourceIds: ["nrs-drug-deaths-2025", "sg-drugs-monitoring-2024-25", "sg-population-health-evidence"],
  },
  {
    slug: "crisis-grant-acceptance-rates-scotland-councils",
    title: "Crisis Grant acceptance rates: the 52% to 89% postcode gap",
    seoTitle: "Crisis Grant Acceptance Rates by Scottish Council | 2025/26",
    description: "Crisis Grant acceptance rates in 2025/26 ranged from 89% in Inverclyde to 52% in Midlothian, against 65% across Scotland. Compare all 32 councils.",
    standfirst:
      "Inverclyde awarded 89% of decided Crisis Grant applications in 2025/26. Midlothian awarded 52%. The same national scheme produced a persistent 37 point postcode gap that councils need to explain.",
    date: "2026-08-16",
    category: "politics-explained",
    tags: [
      "Crisis Grant acceptance rates",
      "Scottish Welfare Fund",
      "Scottish councils",
      "Emergency grants",
      "Council accountability",
      "Poverty in Scotland",
    ],
    readingMinutes: 10,
    image: {
      src: "/images/editorial/scottish-welfare-fund-crisis-grant.webp",
      alt: "A community adviser helping a resident complete an emergency grant application at a public computer",
      caption:
        "The application is local, but the scheme is national. In 2025/26 the published council award rates stretched from 52% to 89%.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "short-answer", label: "The story in three numbers" },
      { id: "every-council", label: "Every council compared" },
      { id: "persistent", label: "Why one year is not enough" },
      { id: "explanations", label: "What might explain the gap" },
      { id: "limits", label: "What the figures cannot prove" },
      { id: "questions", label: "Questions for every council" },
      { id: "refused", label: "If your application was refused" },
      { id: "data", label: "Data and method" },
    ],
    faq: [
      { q: "Which Scottish council has the highest Crisis Grant award rate?", a: "Inverclyde had the highest published rate in 2025/26: 89% of decided Crisis Grant applications resulted in an award. Angus was next at 79% and Dundee City at 78%." },
      { q: "Which Scottish council has the lowest Crisis Grant award rate?", a: "Midlothian had the lowest published rate in 2025/26 at 52%, followed by Highland at 53%. The Scotland rate was 65%." },
      { q: "What percentage of Crisis Grant applications are successful in Scotland?", a: "In 2025/26, 65% of decided Crisis Grant applications in Scotland resulted in an award. Council rates ranged from 52% in Midlothian to 89% in Inverclyde." },
      { q: "Does a lower award rate prove a council is refusing valid applications?", a: "No. The rate proves different outcomes, not whether the underlying applications were comparable or the decisions correct. Explaining the gap requires evidence about case mix, local administration, evidence demands, budget pressure, repeat applications and reviews." },
      { q: "How quickly should a Crisis Grant decision be made?", a: "By the end of the next working day. Nationally, 98% of Crisis Grant decisions met that deadline in January to March 2026. Local rates ranged from 67% in Shetland to 100% in nine councils." },
      { q: "Can a refused Crisis Grant decision be reviewed?", a: "Yes. The statutory guidance says a first tier review is requested from the council, normally within 20 working days of the decision. A Crisis Grant review should be decided within two working days. A review cannot reduce or remove an award already made." },
    ],
    sourceIds: [
      "swf-statistics-2025-26",
      "swf-tables-2025-26",
      "swf-statutory-guidance-2026",
      "scottish-welfare-fund",
    ],
  },
  {
    slug: "how-council-tax-works-scotland",
    title: "How does council tax work in Scotland? Bands, bills, water and help",
    seoTitle: "How Does Council Tax Work in Scotland? Bands and Bills",
    description: "Your home's 1991 value sets its band, your council sets the rate and Scottish Water adds £652 a year at Band D. How council tax in Scotland is worked out.",
    standfirst: "Your bill is a property band, your council's rate and Scottish Water's charges added together. Here are the eleven things that explain almost everything, with a worked example.",
    date: "2026-08-01",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Council tax", "Council tax bands", "Council Tax Reduction", "Scottish Water"],
    readingMinutes: 9,
    quickAnswer: {
      "label": "How council tax works in Scotland",
      "detail": "The Assessor puts your home in a band from A to H by its value on 1 April 1991. Your council sets a charge for each band, and Scottish Water's charges are added to the same bill.",
      "rows": [
        {
          "label": "Band set by",
          "value": "The home's value on 1 April 1991"
        },
        {
          "label": "Rate set by",
          "value": "Your council, as a Band D charge"
        },
        {
          "label": "Band A pays",
          "value": "Two thirds of Band D"
        },
        {
          "label": "Water and waste water, Band D",
          "value": "£652.32 a year"
        },
        {
          "label": "Single person discount",
          "value": "25%"
        }
      ],
      "asOf": "2026/27",
      "source": {
        "publisher": "mygov.scot",
        "url": "https://www.mygov.scot/council-tax"
      }
    },
    image: {
      src: "/images/editorial/council-tax-scotland-guide.webp",
      alt: "A Glasgow resident working through a council tax bill with a notebook and calculator at his kitchen table",
      caption:
        "The bill looks complicated because three different things are mixed together. Once they are separated, it becomes much easier to check.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-pays-for", label: "1. What council tax pays for" },
      { id: "who-pays", label: "2. Who pays" },
      { id: "band", label: "3. What sets your band" },
      { id: "bill", label: "4. How the bill is worked out" },
      { id: "how-much", label: "5. How much it costs" },
      { id: "water", label: "6. Is water included?" },
      { id: "discounts", label: "7. Discounts and exemptions" },
      { id: "reduction", label: "8. Help on a low income" },
      { id: "challenge", label: "9. Challenging a band" },
      { id: "moving", label: "10. Moving or missing payments" },
      { id: "empty-homes", label: "11. Empty and second homes" },
    ],
    faq: [
      { q: "How does council tax work in Scotland?", a: "Every home is in a band from A to H based on its value on 1 April 1991. Your council sets a charge for Band D, every other band pays a fixed share of it, and Scottish Water's charges are added to the same bill." },
      { q: "How is council tax calculated in Scotland?", a: "Take your council's Band D charge and apply your band's fixed share: two thirds for Band A, up to almost two and a half times for Band H. Then add Scottish Water's charges and take off any discount or Council Tax Reduction." },
      { q: "Is council tax per person or per household?", a: "Per home. A full bill assumes two or more adults live there. If only one adult counts, you get 25% off, but extra adults do not make the bill any higher." },
      { q: "How do I find my council tax band in Scotland?", a: "Look up the property free on the Scottish Assessors Association website. A postcode can find the council area, but it cannot prove the band because neighbouring homes can be different." },
      { q: "Does Scottish council tax include water?", a: "The bill usually does. Your council collects separate water and waste water charges for Scottish Water. That is why a council tax only figure can be hundreds of pounds lower than the bill that arrives." },
      { q: "Can Council Tax Reduction wipe out the whole bill?", a: "It can reduce the council tax part by up to 100%, depending on income and household circumstances. Water charges can remain, although an automatic water reduction of up to 35% may apply." },
    ],
    sourceIds: ["council-tax-how-it-works", "council-tax-scotland", "scottish-water-2026", "council-tax-discounts", "council-tax-reduction-2026", "council-tax-band-proposals", "council-tax-arrears", "council-tax-empty-homes-2026", "lothian-vjb-council-tax", "scottish-water-charges-2026", "edinburgh-single-occupancy-discount", "ctr-regulations-2021", "highland-council-tax-instalments"],
  },
  {
    slug: "council-tax-rises-scotland-2026-27",
    title: "Council tax increase Scotland: every council's rise in 2026/27",
    seoTitle: "Council Tax Increase Scotland 2026/27: Every Council's Rise",
    description: "Every Scottish council raised council tax in 2026/27. Band D rose by 4% in Edinburgh up to 10% in Aberdeenshire and Moray. See every council and every band.",
    standfirst: "Every council raised its rate, but not by the same amount: from 4% to 10% at Band D. This compares last year's council tax with this year's, and keeps Scottish Water's separate charge out of the figures.",
    date: "2026-08-02",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Council tax rises", "Council tax 2026/27", "Council tax bands", "Scottish councils"],
    readingMinutes: 6,
    quickAnswer: {
      "label": "Council tax increase Scotland 2026/27, Band D",
      "value": "4% to 10%",
      "unit": "depending on the council",
      "detail": "All 32 councils raised council tax. The smallest rise was in Edinburgh and the largest in Aberdeenshire and Moray. Half the councils raised Band D by more than 7.8%.",
      "rows": [
        {
          "label": "Edinburgh",
          "value": "+£62.54 a year (4%)"
        },
        {
          "label": "Glasgow",
          "value": "+£95.00 a year (5.9%)"
        },
        {
          "label": "Aberdeenshire",
          "value": "+£153.28 a year (10%)"
        },
        {
          "label": "Moray",
          "value": "+£157.38 a year (10%)"
        }
      ],
      "asOf": "2025/26 to 2026/27, council tax only",
      "source": {
        "publisher": "Scottish Government",
        "url": "https://www.gov.scot/publications/council-tax-datasets/"
      }
    },
    image: {
      src: "/images/editorial/council-tax-rises-scotland.webp",
      alt: "Council tax bills and a calculator on a kitchen table overlooking a Scottish residential street",
      caption:
        "The rise belongs to the council tax part of the bill. Scottish Water sets its own separate charge, even though both arrive together.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "all-councils", label: "Every council compared" },
      { id: "by-band", label: "Rises by band" },
      { id: "what-it-means", label: "What the percentages mean" },
      { id: "water", label: "Why water is separate" },
      { id: "next-year", label: "Council tax 2027/28" },
      { id: "help", label: "Help with the bill" },
      { id: "check-your-bill", label: "Check your own bill" },
    ],
    faq: [
      { q: "How much has council tax gone up in Scotland in 2026?", a: "It depends on the council. Band D council tax rose by between 4% and 10% in 2026/27, and half the councils raised it by more than 7.8%, about £120 a year at Band D." },
      { q: "Which council has the biggest council tax increase in Scotland?", a: "Aberdeenshire and Moray both raised Band D by 10% in 2026/27. In cash terms Argyll and Bute had the largest rise, £157.69 a year at Band D." },
      { q: "Did every Scottish council raise council tax in 2026/27?", a: "Yes. All 32 councils increased council tax. The smallest rise was 4% in Edinburgh." },
      { q: "Does the council tax increase include water charges?", a: "No. These figures are council tax only. Scottish Water sets its own charges, which are collected on the same bill but are not decided by the council." },
      { q: "When is council tax for 2027/28 set?", a: "Councils set it at their budget meetings in February and early March 2027, after the Scottish Budget, and bills arrive from March." },
    ],
    sourceIds: ["council-tax-scotland", "scottish-water-2026", "council-tax-how-it-works", "council-tax-reduction-2026", "lgfa-1992-discounts", "scottish-water-charges-2026"],
  },
  {
    slug: "minimum-wage-take-home-pay-scotland-2026",
    title: "Minimum wage Scotland 2026: rates, take home pay and the 2027 rise",
    seoTitle: "Minimum Wage Scotland 2026 and 2027: £12.71 to £13.21",
    description:
      "Minimum wage in Scotland is £12.71 an hour in 2026, rising to £13.21 in April 2027. See every age rate, yearly pay and take home pay after tax and NI.",
    standfirst:
      "£12.71 an hour sounds clear. A payslip is not. I have done the tax and National Insurance working for a 37.5 hour week so you can see what reaches the bank.",
    date: "2026-08-01",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Minimum wage", "Take home pay", "Scottish income tax", "Low pay"],
    quickAnswer: {
      label: "Minimum wage Scotland, 21 and over",
      value: pounds(MINIMUM_WAGE.current.over21, true),
      unit: "an hour",
      detail: `Every employer in Scotland has to pay at least this from 1 April 2026. It goes up to ${pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027. Scotland doesn't set its own rate; Westminster does.`,
      rows: [
        { label: "Age 21 and over", value: `${pounds(MINIMUM_WAGE.current.over21, true)}, then ${pounds(MINIMUM_WAGE.next.over21, true)}` },
        { label: "Age 18 to 20", value: `${pounds(MINIMUM_WAGE.current.age18to20, true)}, then ${pounds(MINIMUM_WAGE.next.age18to20, true)}` },
        { label: "Under 18", value: `${pounds(MINIMUM_WAGE.current.under18, true)}, then ${pounds(MINIMUM_WAGE.next.under18, true)}` },
        { label: "Apprentice", value: `${pounds(MINIMUM_WAGE.current.apprentice, true)}, then ${pounds(MINIMUM_WAGE.next.apprentice, true)}` },
      ],
      asOf: "2026/27 rates, then the rates from 1 April 2027",
      source: MINIMUM_WAGE.source,
    },
    readingMinutes: 6,
    image: {
      src: "/images/editorial/minimum-wage-take-home-scotland.webp",
      alt: "A supermarket worker checking a payslip and phone calculator during her break",
      caption:
        "Minimum wage is an hourly floor, not a guaranteed salary. Hours, unpaid time off, tax and National Insurance decide what reaches the bank.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "rates", label: "Every 2026 rate" },
      { id: "by-age", label: "Rates by age" },
      { id: "national-minimum-wage", label: "Who sets the minimum wage" },
      { id: "april-2027", label: "What changes in April 2027" },
      { id: "full-time", label: "Yearly pay by hours" },
      { id: "take-home", label: "Take home pay" },
      { id: "hours", label: "Why your pay may be lower" },
      { id: "underpaid", label: "If you are underpaid" },
      { id: "cities", label: "Glasgow and other cities" },
      { id: "enough", label: "Is it enough to live on?" },
    ],
    faq: [
      { q: "What is the minimum wage in Scotland in 2026?", a: "From 1 April 2026 it is £12.71 an hour for workers aged 21 and over, £10.85 for ages 18 to 20, and £8 for under 18s and eligible apprentices. Scotland uses the same rates as the rest of the UK." },
      { q: "What is the minimum wage for a 16 year old in Scotland?", a: "Workers aged 16 and 17 who are past school leaving age get at least £8 an hour from 1 April 2026, rising to £8.31 on 1 April 2027." },
      { q: "What is the minimum wage for an 18 year old in Scotland?", a: "Workers aged 18 to 20 get at least £10.85 an hour from 1 April 2026, rising to £11.27 on 1 April 2027. At 21 the rate goes up to the full £12.71." },
      { q: "Is there a different minimum wage for over 25s in Scotland?", a: "No. There is no separate over 25 rate any more. Everyone aged 21 or over is due the same £12.71 an hour, which the UK Government calls the National Living Wage." },
      { q: "What is the minimum wage in Scotland a year?", a: "At 37.5 paid hours every week for 52 weeks, £12.71 an hour is £24,784.50 a year before tax, or about £21,404 after Scottish income tax and National Insurance. Fewer paid hours means less." },
      { q: "What will the minimum wage be in Scotland in April 2027?", a: "From 1 April 2027 it rises to £13.21 an hour for workers aged 21 and over, £11.27 for ages 18 to 20, and £8.31 for under 18s and eligible apprentices." },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "scottish-tax-2026", "ni-rates-2026", "mis-2025", "lpc-remit", "real-living-wage", "pay-work-rights", "nmw-what-counts-as-pay", "nmw-employers", "ons-pipr-2026-10"],
  },
  {
    slug: "real-living-wage-vs-minimum-wage-scotland",
    title: "Real Living Wage Scotland: £14.10 an hour against the legal minimum",
    seoTitle: "Real Living Wage Scotland 2026: £14.10 vs Minimum Wage",
    description: "The real Living Wage in Scotland is £14.10 an hour, set in October 2026. The legal minimum is £12.71, rising to £13.21 in April 2027. What the gap is worth.",
    standfirst:
      "They sound almost identical. One is the legal floor an employer must pay. The other is a voluntary rate calculated from what ordinary life actually costs.",
    date: "2026-08-01",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Real Living Wage", "Minimum wage", "Pay", "Living costs"],
    quickAnswer: {
      label: "Real Living Wage Scotland",
      value: pounds(REAL_LIVING_WAGE.uk, true),
      unit: "an hour",
      detail: "The voluntary rate for employers signed up with the Living Wage Foundation, set on 15 October 2026. They have until 1 May 2027 to start paying it. The legal minimum is lower.",
      rows: [
        { label: "Outside London", value: pounds(REAL_LIVING_WAGE.uk, true) },
        { label: "London", value: pounds(REAL_LIVING_WAGE.london, true) },
        { label: "Legal minimum, 21 and over", value: pounds(MINIMUM_WAGE.current.over21, true) },
        { label: "Gap a year at 37.5 hours", value: pounds((REAL_LIVING_WAGE.uk - MINIMUM_WAGE.current.over21) * 37.5 * 52, true) },
      ],
      asOf: "Rates announced 15 October 2026",
      source: REAL_LIVING_WAGE.source,
    },
    readingMinutes: 5,
    image: {
      src: "/images/editorial/real-living-wage-scotland.webp",
      alt: "Two café workers comparing their pay envelopes and rota before opening",
      caption:
        "The legal minimum is set from the labour market. The real Living Wage starts with the cost of a decent basic life.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "rates", label: "2026 rates" },
      { id: "vs-minimum-wage", label: "Living wage vs minimum wage" },
      { id: "legal", label: "The National Living Wage" },
      { id: "real", label: "How the real rate is set" },
      { id: "difference", label: "What the gap is worth" },
      { id: "glasgow", label: "Glasgow, Edinburgh and cities" },
      { id: "compulsory", label: "Is it compulsory?" },
      { id: "check", label: "How to check your employer" },
    ],
    faq: [
      { q: "What is the real Living Wage in Scotland in 2026?", a: "£14.10 an hour, announced on 15 October 2026. It is the same everywhere in Scotland. Accredited employers have until 1 May 2027 to pay it. The previous rate was £13.45." },
      { q: "What is the difference between the living wage and the minimum wage in Scotland?", a: "The legal minimum, called the National Living Wage, is £12.71 an hour for workers aged 21 and over and every employer must pay it. The real Living Wage of £14.10 is worked out from living costs and is voluntary." },
      { q: "How much is the National Living Wage in Scotland?", a: "£12.71 an hour from 1 April 2026 for workers aged 21 and over, rising to £13.21 on 1 April 2027. It is the same across the UK because Westminster sets it." },
      { q: "Is the real Living Wage compulsory in Scotland?", a: "No. Only the legal minimum wage is compulsory. Employers that take most discretionary Scottish public sector grants awarded since 1 July 2023 must pay at least the real Living Wage, and an employer can promise it in a contract." },
      { q: "Is the living wage different in Glasgow or Edinburgh?", a: "No. The real Living Wage is £14.10 in Glasgow, Edinburgh and the rest of Scotland. Only London has a higher rate, £15.45." },
      { q: "How much more is the real Living Wage?", a: "£1.39 an hour above the 2026 legal rate for workers aged 21 and over, or £2,710.50 a year before tax at 37.5 hours a week. After tax and National Insurance that is about £1,952 a year. From April 2027 the gap is 89p an hour." },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "real-living-wage", "mis-2025", "lpc-remit", "scottish-tax-2026", "ni-rates-2026", "ashe-2026-workplace", "fair-work-first"],
  },
  {
    slug: "universal-credit-when-you-work-more-hours",
    title: "How many hours can you work on Universal Credit?",
    seoTitle: "How Many Hours Can You Work on Universal Credit? 2026",
    description: "There is no limit on the hours you can work on Universal Credit. It falls by 55p for each £1 you earn above any work allowance of £427 or £710 a month.",
    standfirst: "Working more always leaves you with more money in total. But the gain can feel small, because Universal Credit falls by 55p for each extra £1 of take home pay.",
    date: "2026-08-01",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Universal Credit", "Work allowance", "Benefits", "Low pay"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/universal-credit-working.webp",
      alt: "A working parent comparing a work rota and household budget beside a laptop at home",
      caption:
        "A change in shifts can change both wages and Universal Credit. The calculation is monthly, which is why irregular pay can make awards jump around.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "short-answer", label: "The short answer" },
      { id: "taper", label: "How the 55% taper works" },
      { id: "allowance", label: "Who gets a work allowance" },
      { id: "example", label: "Worked examples" },
      { id: "working-hours", label: "What the jobcentre expects" },
      { id: "overtime", label: "Does overtime count?" },
      { id: "pay-rise", label: "A new job or pay rise" },
      { id: "changes", label: "Why payments jump around" },
    ],
    faq: [
      { q: "How many hours can you work on Universal Credit?", a: "There is no limit. You can work part time or full time and still get Universal Credit. The payment falls by 55p for each £1 of take home pay above any work allowance, and stops once you earn enough." },
      { q: "Does overtime affect Universal Credit?", a: "Yes. Overtime and bonuses count as earnings in the assessment period they are paid in, so that month's payment is lower. If a big month takes the award to zero and earnings drop again within 6 months, payments restart automatically." },
      { q: "How many hours does the jobcentre expect you to work on Universal Credit?", a: "Usually 35 hours a week. Once you earn what 35 hours at the minimum wage for your age would pay, about £1,928 a month before tax at 21 or over, you normally have no work search requirements. Carers, parents of young children and disabled people can have fewer expected hours." },
      { q: "Do you lose Universal Credit when you start work?", a: "Not automatically. Your award is recalculated from the earnings reported in each monthly assessment period. It reduces as earnings rise and can reach zero if income is high enough." },
      { q: "What happens to Universal Credit if you get a pay rise?", a: "Your payment falls by 55p for each extra £1 of take home pay, so you still keep 45p. Your employer reports pay automatically. If your Universal Credit stops, check help that depends on it, such as the Scottish Child Payment." },
      { q: "What is the Universal Credit taper rate?", a: "Universal Credit normally falls by 55p for each £1 of take home earnings counted above any work allowance. That means earnings still increase total household income." },
    ],
    sourceIds: ["uc-earnings", "uc-what-youll-get", "uc-expected-hours", "uc-scottish-choices", "minimum-wage-2026", "scottish-tax-2026", "ni-rates-2026"],
  },
  {
    slug: "local-housing-allowance-rent-shortfall-scotland",
    title: "Local Housing Allowance Scotland 2026/27: rates for every area and the rent gap",
    seoTitle: "Local Housing Allowance Scotland 2026/27: Rates by Area",
    description: "Local Housing Allowance in Scotland is frozen for 2026/27. Greater Glasgow pays up to £695 a month for one bedroom on Universal Credit. All 18 areas listed.",
    standfirst: "The benefit is meant to cover a cheaper local rent. In 2026/27 it still uses rates fixed in January 2024, and in each of the four cities the one bedroom rate sits below the average rent.",
    date: "2026-08-01",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Local Housing Allowance", "Rent", "Universal Credit", "Housing"],
    readingMinutes: 6,
    quickAnswer: {
      "label": "Local Housing Allowance, one bedroom, Greater Glasgow",
      "value": "£695",
      "unit": "a month on Universal Credit",
      "detail": "LHA is the most Universal Credit or Housing Benefit pays towards private rent. Scotland's 2026/27 rates are frozen at the levels set in January 2024.",
      "rows": [
        {
          "label": "Greater Glasgow, one bedroom",
          "value": "£695 a month"
        },
        {
          "label": "Lothian (Edinburgh), one bedroom",
          "value": "£750 a month"
        },
        {
          "label": "Aberdeen and Shire, one bedroom",
          "value": "£475 a month"
        },
        {
          "label": "Dundee and Angus, one bedroom",
          "value": "£400 a month"
        }
      ],
      "asOf": "April 2026 to March 2027",
      "source": {
        "publisher": "DWP (GOV.UK)",
        "url": "https://www.gov.uk/csv-preview/697a205fc23c8fa26650dec1/scotland-rates-2026-to-2027.csv"
      }
    },
    image: {
      src: "/images/editorial/local-housing-allowance-rent-gap.webp",
      alt: "A prospective tenant checking a letting sheet and phone calculator inside a small Glasgow flat",
      caption:
        "Universal Credit does not promise to cover the rent written in a tenancy. For private renters, help is capped by area and bedroom need.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-is", label: "What Local Housing Allowance is" },
      { id: "rates", label: "Rates for every area" },
      { id: "glasgow", label: "LHA Glasgow 2026" },
      { id: "edinburgh", label: "Edinburgh and the other cities" },
      { id: "frozen", label: "Why the rates are frozen" },
      { id: "bedrooms", label: "Which bedroom rate applies" },
      { id: "housing-benefit", label: "Who still gets Housing Benefit" },
      { id: "help", label: "What to do about a shortfall" },
    ],
    faq: [
      { q: "Does Universal Credit pay all of your private rent?", a: "Not necessarily. The housing element is limited by Local Housing Allowance for your area and household size, or by your actual rent if that is lower." },
      { q: "What is the one bedroom LHA rate in Greater Glasgow in 2026?", a: "It is £695 a month on Universal Credit, or £159.95 a week on Housing Benefit, from April 2026 to March 2027. The average advertised one bedroom rent in Greater Glasgow was £865 a month in 2025." },
      { q: "What are the LHA rates in Scotland for 2026/27?", a: "They vary by area and bedroom size. For one bedroom on Universal Credit they run from £375 a month in the Ayrshires and the Scottish Borders up to £750 in Lothian. The full table for all 18 areas is on this page." },
      { q: "What is the Local Housing Allowance rate in Edinburgh?", a: "Edinburgh is in the Lothian area. On Universal Credit the 2026/27 rate is £475 a month for a shared room, £750 for one bedroom and £970 for two bedrooms." },
      { q: "Has Local Housing Allowance gone up in 2026?", a: "No. Scotland's 2026/27 rates are frozen at the cash levels set in January 2024, even though newer rent evidence is higher in most areas." },
    ],
    sourceIds: ["lha-2026", "lha-uc-monthly-scotland-2026", "sg-private-rents-2025", "ons-pipr-2026-10", "housing-benefit-eligibility", "housing-benefit-spare-bedrooms", "discretionary-housing-payment"],
  },
  {
    slug: "energy-price-cap-scotland-2026-explained",
    title: "Energy price cap Scotland: what the October 2026 cap means for your bills",
    seoTitle: "Energy Price Cap Scotland: £1,723 From October 2026",
    description: "The energy price cap in Scotland is £1,723 a year from 1 October 2026, up 4%. North and South Scotland unit rates, standing charges and the VAT cut.",
    standfirst: "£1,723 is not the most any household can pay. It is Ofgem's figure for typical use. The cap controls the rates, so using more still costs more.",
    date: "2026-08-01",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Energy price cap", "Energy bills", "Standing charge", "Cost of living"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/energy-price-cap-scotland.webp",
      alt: "A resident in a jumper adjusting a tenement radiator while holding an energy bill envelope",
      caption:
        "The cap limits unit rates and standing charges on default tariffs. It cannot stop a cold home from needing more energy.",
      objectPosition: "center 45%",
    },
    toc: [
      { id: "current-cap", label: "October to December 2026" },
      { id: "scotland-rates", label: "North and South Scotland rates" },
      { id: "not-a-bill-cap", label: "Why it is not a bill cap" },
      { id: "rates", label: "Price per kWh" },
      { id: "standing", label: "The standing charge" },
      { id: "vat", label: "No VAT on electricity" },
      { id: "january-2027", label: "January 2027 cap" },
      { id: "who", label: "Who the cap covers" },
      { id: "help", label: "If you cannot afford energy" },
    ],
    faq: [
      { q: "What is the energy price cap from October 2026?", a: "From 1 October to 31 December 2026 it is £1,723 a year for a typical home paying by Direct Debit, up 4% or about £60 a year. Prepayment is £1,678 and paying when the bill arrives is £1,861." },
      { q: "Is £1,723 the maximum energy bill?", a: "No. It is Ofgem's figure for a typical home using 2,500 kWh of electricity and 9,500 kWh of gas a year. The cap limits unit rates and standing charges, so a home that uses more pays more." },
      { q: "Does the energy price cap apply in Scotland?", a: "Yes. Ofgem's cap covers default domestic tariffs in England, Scotland and Wales. Scotland has two regions, North and South Scotland, each with slightly different unit rates and standing charges." },
      { q: "What is the price cap per kWh in Scotland?", a: "On Direct Debit from 1 October 2026, electricity is capped at 26.35p a kWh in North Scotland and 26.11p in South Scotland, and gas at 7.87p in both. Standing charges are extra." },
      { q: "What is the electricity standing charge in Scotland?", a: "On Direct Debit from 1 October 2026 it is 55.14p a day in North Scotland and 61.41p in South Scotland, against a 54.83p Great Britain average." },
      { q: "When will the January 2027 energy price cap be announced?", a: "Ofgem announces each cap about five weeks ahead. It published the July cap on 27 May and the October cap on 26 August, so the January to March 2027 cap is expected in late November 2026." },
    ],
    sourceIds: ["ofgem-cap-oct-2026", "ofgem-press-oct-2026", "ofgem-press-jul-2026", "ofgem-regional-rates-oct-2026", "ofgem-cap-2026", "sg-cost-living-2025"],
  },
  {
    slug: "why-food-prices-stay-high-when-inflation-falls",
    title: "Food prices in Scotland: why they stay high when inflation falls",
    seoTitle: "Food Prices in Scotland: Why They Are Still So High",
    description: "UK food prices were 38.5% higher in September 2026 than five years earlier. Food inflation is now 1.3%, so prices are rising more slowly, not falling.",
    standfirst:
      "The news says inflation is down. The supermarket receipt says the weekly shop is still dear. Both can be true at the same time.",
    date: "2026-08-01",
    checked: "2026-10-29",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Food prices", "Inflation", "Groceries", "Cost of living"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/food-prices-inflation.webp",
      alt: "A shopper comparing basic groceries with a shopping list in a supermarket aisle",
      caption:
        "Falling inflation changes the speed of price rises. It does not reverse the rises already built into bread, milk, vegetables and everything else.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "simple", label: "Why prices stay high" },
      { id: "numbers", label: "The latest figures" },
      { id: "why", label: "Why food rose so sharply" },
      { id: "fall", label: "Will food prices go down?" },
      { id: "households", label: "Why low incomes feel it most" },
      { id: "help", label: "Help with food costs" },
    ],
    faq: [
      { q: "Why are food prices still so high in Scotland?", a: "Because prices jumped between 2021 and 2023 and have kept rising since, only more slowly. UK food prices were 38.5% higher in September 2026 than in September 2021." },
      { q: "Why are groceries still expensive if inflation is lower?", a: "Because inflation measures the rate of change, not the price level. If prices rise 10% and then inflation falls to 2%, the earlier rise stays and another 2% is added." },
      { q: "What is food inflation now?", a: "UK food and non alcoholic drink prices rose 1.3% in the year to September 2026, according to the ONS. Food inflation peaked at 19.1% in March 2023." },
      { q: "How much have food prices gone up in the UK?", a: "ONS figures show food and non alcoholic drink prices were 38.5% higher in September 2026 than in September 2021, and 38.6% higher in November 2025 than in November 2020." },
      { q: "Will food prices go down?", a: "Individual items can get cheaper, but a broad fall needs costs across many products to come down and shops to pass that on. In every year from 2022 to 2026 the overall price of food still went up." },
    ],
    sourceIds: ["ons-cpi-food-sep-2026", "ons-cpi-sep-2026", "ons-food-prices", "ons-household-costs-2026", "brexit-food-prices", "free-school-meals-2026", "sg-cost-living-2025"],
  },
  {
    slug: "crisis-grant-scotland-how-to-apply",
    title: "Crisis grant Scotland: how to apply and what you get",
    seoTitle: "Crisis Grant Scotland: How to Apply and How Much You Get",
    description: "A crisis grant is emergency money from your council that you never pay back. The average award in Scotland was £130 in 2025/26. Apply online or by phone.",
    standfirst: "It is not a loan and not a Universal Credit advance. It is council money for an emergency, and in 2025/26 Scottish councils made 167,990 awards.",
    date: "2026-08-01",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Crisis Grant", "Scottish Welfare Fund", "Emergency help", "Benefits"],
    readingMinutes: 5,
    quickAnswer: {
      "label": "Average crisis grant in Scotland",
      "value": "£130",
      "unit": "per award in 2025/26",
      "detail": "A crisis grant is emergency money from your council's Scottish Welfare Fund that you do not pay back. Apply to the council where you live. It should decide by the end of the next working day.",
      "rows": [
        {
          "label": "Applications in 2025/26",
          "value": "258,490"
        },
        {
          "label": "Awards",
          "value": "167,990"
        },
        {
          "label": "Share of decisions that led to an award",
          "value": "65%"
        },
        {
          "label": "Decided by the next working day, January to March 2026",
          "value": "98%"
        }
      ],
      "asOf": "Scottish Welfare Fund statistics to 31 March 2026",
      "source": {
        "publisher": "Scottish Government",
        "url": "https://www.gov.scot/publications/scottish-welfare-fund-statistics-update-to-31-march-2026/"
      }
    },
    image: {
      src: "/images/editorial/scottish-welfare-fund-crisis-grant.webp",
      alt: "A community adviser helping a resident complete an online application at a public computer",
      caption:
        "Applications go to the local council. Help should be practical and immediate; you do not have to produce perfect words or repay the grant.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-is", label: "What a crisis grant is" },
      { id: "who", label: "Who can apply" },
      { id: "covers", label: "What it can cover" },
      { id: "how-much", label: "How much you get" },
      { id: "apply", label: "How to apply" },
      { id: "application", label: "What happens next" },
      { id: "crisis-loan", label: "Crisis loans" },
      { id: "community-care-grant", label: "Community care grants" },
      { id: "refused", label: "If the council says no" },
    ],
    faq: [
      { q: "How much is a crisis grant in Scotland?", a: "There is no fixed amount. The council pays for what you need to get through the emergency. In 2025/26 the average crisis grant in Scotland was £130." },
      { q: "How do I apply for a crisis grant?", a: "Apply to the council where you live, through its online Scottish Welfare Fund form or by phone. Have your income, bank balance, who lives with you and what you need today ready." },
      { q: "How long does a crisis grant take?", a: "The council should decide by the end of the next working day once it has all the information it needs. In January to March 2026, 98% of decisions in Scotland met that deadline." },
      { q: "Do you pay a crisis grant back?", a: "No. It is a grant from the Scottish Welfare Fund, not a loan or a Universal Credit advance." },
      { q: "Can I get a crisis loan in Scotland?", a: "No. DWP crisis loans ended in Scotland on 1 April 2013 and were replaced by Scottish Welfare Fund crisis grants, which you do not repay. The only emergency loan left is a Universal Credit advance." },
      { q: "Is there a UK crisis grant?", a: "There is no single UK crisis grant. In Scotland emergency grants come from the Scottish Welfare Fund, run by each council, so you apply to the council where you live." },
    ],
    sourceIds: ["scottish-welfare-fund", "swf-statistics-2025-26", "swf-tables-2025-26", "swf-statutory-guidance-2026", "moray-swf-review"],
  },
  {
    slug: "discretionary-housing-payment-scotland",
    title: "Discretionary housing payment Scotland: who can get it and how to apply",
    seoTitle: "Discretionary Housing Payment Scotland: Who Can Get It",
    description: "A discretionary housing payment tops up rent help from your council. In Scotland it covers the bedroom tax in full, a 14% or 25% rent cut. How to apply.",
    standfirst: "If you get help with rent but there is still a gap, your council has another fund. In Scotland it should cover the bedroom tax in full, and it can sometimes help with other shortfalls, deposits and moving costs.",
    date: "2026-08-01",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Discretionary Housing Payment", "Rent", "Bedroom tax", "Benefit cap"],
    readingMinutes: 5,
    quickAnswer: {
      "label": "Discretionary housing payment for the bedroom tax in Scotland",
      "value": "100%",
      "unit": "of the shortfall, if you apply",
      "detail": "The Scottish Government funds councils to cover the bedroom tax in full through DHP, and expects anyone affected who applies to get it. DHP can also help with the benefit cap and some other rent gaps.",
      "rows": [
        {
          "label": "Bedroom tax, one spare bedroom",
          "value": "14% off eligible rent"
        },
        {
          "label": "Bedroom tax, two or more",
          "value": "25% off eligible rent"
        },
        {
          "label": "DHP budget for Scotland, 2025/26",
          "value": "£97.1 million"
        },
        {
          "label": "Of which for the bedroom tax",
          "value": "£79.7 million"
        }
      ],
      "asOf": "2025/26 budget, current rules",
      "source": {
        "publisher": "Scottish Government",
        "url": "https://www.gov.scot/publications/scottish-discretionary-housing-payments-guidance-manual/"
      }
    },
    image: {
      src: "/images/editorial/discretionary-housing-payment.webp",
      alt: "A tenant on the phone comparing a tenancy document and household budget beside moving boxes",
      caption:
        "The payment is discretionary, so it is not automatic. A clear explanation of the rent gap and what would happen without help matters.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "what-it-is", label: "What the payment is" },
      { id: "bedroom-tax", label: "Bedroom tax Scotland" },
      { id: "benefit-cap", label: "The benefit cap" },
      { id: "who", label: "Who can apply" },
      { id: "covers", label: "What it may cover" },
      { id: "budget", label: "How much councils spend" },
      { id: "apply", label: "How to apply" },
      { id: "next", label: "What happens next" },
    ],
    faq: [
      { q: "What is a discretionary housing payment?", a: "It is extra money from your council when Housing Benefit or the housing part of Universal Credit does not cover your rent. You have to apply, and the council decides how much and for how long." },
      { q: "Who can get a Discretionary Housing Payment in Scotland?", a: "You must normally rent your home and already receive Housing Benefit or the housing element of Universal Credit. Your council then decides whether extra help is appropriate." },
      { q: "Do you have to pay the bedroom tax in Scotland?", a: "The UK rule still cuts housing support by 14% for one spare bedroom and 25% for two or more. In Scotland, councils use DHP to pay that shortfall in full for anyone affected who applies." },
      { q: "Can a DHP cover a rent deposit?", a: "In some cases it can help with a deposit, rent in advance or removal costs, as well as an ongoing rent shortfall. Ask your council what its local fund will consider." },
      { q: "Is DHP different in Edinburgh and Glasgow?", a: "The national rules are the same across Scotland, but each council runs its own form and decides its own cases. Apply to the council that handles your Housing Benefit or Universal Credit housing costs." },
    ],
    sourceIds: ["discretionary-housing-payment", "dhp-guidance-manual-2025", "dhp-statistics-2025-26", "housing-benefit-spare-bedrooms", "lha-2026"],
  },
  {
    slug: "free-school-meals-clothing-grant-scotland",
    title: "Free school meals and clothing grant in Scotland: who qualifies in 2026/27",
    seoTitle: "Free School Meals and Clothing Grant Scotland 2026/27",
    description: "All P1 to P5 pupils in Scotland get free school lunches. Older pupils qualify on Universal Credit earning up to £995 a month. Clothing grants start at £120.",
    standfirst: "Some help is automatic, some has to be claimed, and the rules change with a child's school year. Here are the 2026/27 rules, the income limit and what councils pay.",
    date: "2026-08-01",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Free school meals", "School clothing grant", "Families", "School costs"],
    readingMinutes: 5,
    quickAnswer: {
      "label": "Free school meals and clothing grant, Scotland",
      "value": "£995",
      "unit": "a month, the Universal Credit earnings limit",
      "detail": "Every P1 to P5 pupil gets a free lunch. From P6, a child qualifies through a benefit such as Universal Credit with earnings of £995 a month or less, which also unlocks the clothing grant.",
      "rows": [
        {
          "label": "P1 to P5",
          "value": "Free lunch for every pupil"
        },
        {
          "label": "P6 and P7",
          "value": "Also free with Scottish Child Payment"
        },
        {
          "label": "Clothing grant, primary",
          "value": "At least £120"
        },
        {
          "label": "Clothing grant, secondary",
          "value": "At least £150"
        }
      ],
      "asOf": "From 1 April 2026",
      "source": {
        "publisher": "legislation.gov.uk",
        "url": "https://www.legislation.gov.uk/ssi/2026/19/made"
      }
    },
    image: {
      src: "/images/editorial/free-school-meals-clothing-grant.webp",
      alt: "A parent helping her primary-school child put on an unbranded school jumper before leaving home",
      caption:
        "School is free, but uniforms, shoes, lunches and holiday weeks still cost money. Several kinds of help can be claimed together.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "meals", label: "Who gets free school meals" },
      { id: "eligibility", label: "Eligibility after P5" },
      { id: "p6-p7", label: "P6 and P7" },
      { id: "clothing", label: "Clothing grant amounts" },
      { id: "holidays", label: "Help in school holidays" },
      { id: "apply", label: "How to apply" },
    ],
    faq: [
      { q: "Are school meals free for every primary pupil in Scotland?", a: "Lunch is universal in council and Scottish Government funded schools from primary 1 to primary 5. In primary 6 and 7, Scottish Child Payment or another qualifying benefit can give entitlement." },
      { q: "What is the income limit for free school meals in Scotland?", a: "If you get Universal Credit, your monthly earned income, or you and your partner's together, must be £995 or less. The limit rose from £850 on 1 April 2026. Other benefits such as Pension Credit have no earnings test." },
      { q: "Do P6 and P7 get free school meals in Scotland?", a: "Yes, if the family gets Scottish Child Payment or another qualifying benefit. The Scottish Child Payment route gives lunches only, not the clothing grant or holiday payments." },
      { q: "How much is the school clothing grant in Scotland?", a: "Every council must pay at least £120 for a primary age child and £150 for a secondary age child. Some pay more: Highland pays £166.50 and £178.50, and South Lanarkshire £150 and £170." },
      { q: "Can I get the clothing grant with Scottish Child Payment?", a: "Not on Scottish Child Payment alone. Councils such as Highland, Midlothian and Moray say it gives P6 and P7 lunches only. You usually need Universal Credit under the earnings limit or another qualifying benefit." },
    ],
    sourceIds: ["free-school-meals-2026", "school-clothing-grants", "fsm-regulations-2026", "highland-meals-clothing-grants", "south-lanarkshire-clothing-grant", "midlothian-free-school-meals", "moray-meals-clothing-grants", "sss-best-start", "sg-child-payment-2026"],
  },
  {
    slug: "why-is-the-cost-of-living-so-high",
    title: "Cost of living Scotland: why it is still so high in 2026",
    seoTitle: "Cost of Living Scotland: Why Prices Are Still So High",
    description: "Prices rose 3.5% in the year to September 2026, on top of a 34% five year rise for low income households. Scotland's bills, the causes and who can fix it.",
    standfirst:
      "War and the pandemic pushed prices up. That is true. It is also true that political choices left ordinary families with less protection, and added avoidable costs of their own.",
    date: "2026-08-01",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Cost of living", "Food", "Energy", "Rent", "Universal Credit"],
    readingMinutes: 10,
    image: {
      src: "/images/editorial/glasgow-cost-of-living.webp",
      alt: "A supermarket worker at a Glasgow kitchen table checking household bills beside a bag of groceries",
      caption:
        "The squeeze is not one bill. Food, energy, rent and tax all land on the same household income.",
      objectPosition: "center 48%",
    },
    toc: [
      { id: "what-is-happening", label: "What is happening now" },
      { id: "monthly-costs", label: "The main bills in 2026" },
      { id: "scotland-vs-uk", label: "Is Scotland expensive?" },
      { id: "what-started-it", label: "What started the crisis" },
      { id: "decisions-made-it-worse", label: "The choices that made it worse" },
      { id: "glasgow-hit", label: "Why Glasgow feels it harder" },
      { id: "what-helped", label: "Decisions that did help" },
      { id: "who-can-fix-it", label: "Who can fix what" },
    ],
    faq: [
      { q: "Why is the cost of living so high in Scotland?", a: "Prices rose sharply between 2021 and 2023 after the pandemic and the war in Ukraine, and most never came back down. Inflation was 3.5% in the year to September 2026, so prices are rising again from that higher level." },
      { q: "What is the cost of living in Scotland?", a: "In autumn 2026 the average private rent in Scotland was £1,011 a month (£702 for one bedroom), typical gas and electricity was £1,723 a year under the Ofgem cap, and a Band D council tax and water bill ran from about £2,121 to £2,468 a year depending on the council." },
      { q: "Is it cheaper to live in Scotland than England?", a: "Rent is lower on average: £1,011 a month in Scotland in September 2026 against £1,406 across the UK. Income tax is slightly lower in Scotland on modest pay and higher on bigger salaries, and pay is close to the UK figure." },
      { q: "Has the cost of living crisis ended because inflation is lower?", a: "No. Lower inflation means prices are rising more slowly; it does not put them back where they were. By March 2026, the ONS Household Costs Index was about 34% higher than five years earlier for low income households." },
      { q: "Did MPs cause the cost of living crisis?", a: "Not by themselves. Pandemic disruption and Russia’s invasion of Ukraine caused major global food and energy shocks. But UK governments and MPs made choices on benefits, rent support, trade, tax and the 2022 mini budget that left households more exposed or added extra cost." },
      { q: "Who controls help with the cost of living in Scotland?", a: "Both parliaments do. Westminster controls Universal Credit, Local Housing Allowance, the legal minimum wage, most tax allowances and energy regulation. Holyrood controls the Scottish Child Payment, housing, Scottish income tax bands, childcare and much of public transport. Councils control local crisis support and services." },
    ],
    sourceIds: ["ons-cpi-2026", "ons-cpi-sep-2026", "ons-household-costs-2026", "ons-pipr-2026-10", "ons-pipr-uk-sep-2026", "ofgem-cap-oct-2026", "ashe-2026-residence", "council-tax-scotland", "scottish-water-2026", "scottish-tax-2026", "ni-rates-2026", "sg-cost-living-2025", "sg-private-rents-2025", "welfare-freeze-act", "welfare-freeze-vote", "welfare-freeze-impact", "uc-uplift-withdrawal", "lha-2026", "mini-budget-2022", "brexit-food-prices", "nao-energy-market", "obr-tax-thresholds-2025", "scottish-housing-budget", "sg-child-payment-2026", "cpag", "minimum-wage-2026", "mis-2025"],
  },
  {
    slug: "do-people-in-poverty-work",
    title: "In work poverty Scotland: most children in poverty have a parent who works",
    seoTitle: "In Work Poverty Scotland: Why a Job Is Not Enough",
    description: "75% of children in poverty in Scotland live with a working adult, and 66% of people in poverty have someone in work. Why a job is not always enough.",
    standfirst:
      "The most common thing said about poverty is that people should get a job. Most of them already have one.",
    date: "2026-07-31",
    updated: "2026-10-29",
    checked: "2026-10-29",
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
      { id: "what-is-in-work-poverty", label: "What is in work poverty?" },
      { id: "in-work-poverty-scotland", label: "The figures for Scotland" },
      { id: "why-work-does-not-fix-it", label: "Why work does not fix it" },
      { id: "housing-costs", label: "How housing changes the picture" },
      { id: "what-this-changes", label: "What this changes" },
      { id: "what-helps", label: "What can help" },
      { id: "modern-studies", label: "For Modern Studies" },
    ],
    faq: [
      { q: "Do most people in poverty work?", a: "Yes. In Scotland, 75% of children in poverty live in a household where at least one adult works, and 66% of all people in poverty have someone in work (2022 to 2025). Work has stopped being a reliable way out of poverty." },
      { q: "What is in work poverty?", a: "In work poverty means a household is below the poverty line even though at least one adult in it has a paid job. Poverty is measured for the whole household after rent or mortgage, so one wage may not stretch far enough." },
      { q: "Does working full time protect you from poverty?", a: "Mostly. In Scotland 11% of people in families where at least one adult works full time are in poverty, and 5% where every adult works full time. With only part time work it is 27%, and where nobody works it is 43% (Joseph Rowntree Foundation, 2022 to 2025)." },
      { q: "Why does working not lift a family out of poverty?", a: "Three things: wages that have not kept up with prices, hours that are part time or unpredictable, and housing costs that take a large share of what is left. Poverty is measured after rent or mortgage is paid." },
      { q: "What help can a working family get in Scotland?", a: "Universal Credit can top up low pay while you work. Families getting it can also claim the Scottish Child Payment for each child under 16, the Best Start Grant for young children, and Council Tax Reduction." },
    ],
    sourceIds: ["sg-poverty-2026", "jrf-poverty-in-scotland-2026", "thresholds", "minimum-wage-2026", "jrf"],
  },
  {
    slug: "what-does-poverty-mean",
    title: "What does poverty mean? The UK poverty line explained",
    seoTitle: "UK Poverty Line 2024/25: What Poverty Means in Pounds a Week",
    description: "The UK poverty line is 60% of typical income after rent. In 2024/25 that was £212 a week for a single adult and £519 for a couple with two children.",
    standfirst: "The word gets used loosely. The measure behind it is precise, and it comes down to a sum in pounds a week that you can check your own household against.",
    date: "2026-07-31",
    updated: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Poverty line", "Housing costs", "Definitions"],
    readingMinutes: 5,
    quickAnswer: {
      "label": "UK poverty line, single adult",
      "value": "£212",
      "unit": "a week after housing costs",
      "detail": "The UK poverty line is 60% of median household income, counted after rent or mortgage. A household with less than this is in relative poverty.",
      "rows": [
        {
          "label": "Single adult",
          "value": "£212 a week"
        },
        {
          "label": "Single parent, one child aged one",
          "value": "£285 a week"
        },
        {
          "label": "Couple, no children",
          "value": "£365 a week"
        },
        {
          "label": "Couple, two children aged three and seven",
          "value": "£519 a week"
        }
      ],
      "asOf": "2024/25, the latest year published",
      "source": {
        "publisher": "Trust for London, from DWP Households Below Average Income",
        "url": "https://trustforlondon.org.uk/data/poverty-thresholds/"
      }
    },
    image: {
      src: "/images/editorial/glasgow-everyday-street.webp",
      alt: "People walking along a wet Glasgow tenement street after rain",
      caption:
        "Poverty is not a type of person or place. It is a household being left with too little to take part in ordinary life.",
    },
    toc: [
      { id: "what-is-poverty", label: "What is poverty?" },
      { id: "uk-poverty-line", label: "The UK poverty line" },
      { id: "single-person", label: "For a single person" },
      { id: "am-i-below", label: "Am I below the line?" },
      { id: "after-housing-costs", label: "Before and after housing costs" },
      { id: "relative-absolute", label: "Relative and absolute poverty" },
      { id: "poverty-in-the-uk", label: "UK and Scotland figures" },
      { id: "modern-studies", label: "For Modern Studies" },
    ],
    faq: [
      { q: "What is the poverty line in the UK?", a: "A household is below the UK poverty line when its income is less than 60% of the typical (median) UK household income, counted after rent or mortgage. In 2024/25 that was £212 a week for a single adult and £519 a week for a couple with two children aged three and seven." },
      { q: "What is the UK poverty line for a single person?", a: "£212 a week in 2024/25, about £11,024 a year. That is income after tax, council tax and housing costs, so it is not the same as a salary. The figure is the same for a single pensioner." },
      { q: "Am I below the poverty line?", a: "Add up your household's weekly income after tax, including benefits. Take off council tax, then your rent or mortgage interest and water charges. If what is left is less than the line for a household like yours, such as £212 a week for one adult, you are below it." },
      { q: "What is the difference between relative and absolute poverty?", a: "Relative poverty compares a household with typical income today: below 60% of this year's median. Absolute poverty uses a line fixed in a past year and raised only with prices, so it shows whether living standards at the bottom are really improving." },
      { q: "What does 'after housing costs' mean?", a: "Rent or mortgage is taken off the household's income before the comparison is made. It is the money actually available for everything else, so it is the fairer measure in places where housing is expensive." },
      { q: "What is the poverty line in Scotland?", a: "Scotland uses the same UK poverty line. On average over 2022 to 2025, 17% of people in Scotland, about 940,000, were below it after housing costs, including 21% of children." },
    ],
    sourceIds: ["sg-poverty-2026", "thresholds", "dwp-hbai-fye-2025", "dwp-hbai-methodology-fye-2025"],
  },
  {
    slug: "what-is-the-scottish-child-payment",
    title: "Scottish Child Payment: how much it is and how to apply",
    seoTitle: "Scottish Child Payment 2026/27: £28.20 a Week, Who Qualifies",
    description: "Scottish Child Payment is £28.20 a week for each child under 16, paid every four weeks to families on Universal Credit or Pension Credit. How to apply.",
    standfirst: "£28.20 a week for every child, on top of other benefits. It does not exist anywhere else in the UK, and some families who are entitled to it have never claimed.",
    date: "2026-07-31",
    updated: "2026-10-29",
    category: "money-and-bills",
    tags: ["Benefits", "Families", "Scottish Child Payment"],
    readingMinutes: 4,
    quickAnswer: {
      "label": "Scottish Child Payment",
      "value": "£28.20",
      "unit": "a week per child under 16",
      "detail": "Paid every four weeks by Social Security Scotland to families on Universal Credit or Pension Credit. There is no limit on the number of children and it does not reduce other benefits.",
      "rows": [
        {
          "label": "One child, every four weeks",
          "value": "£112.80"
        },
        {
          "label": "Two children, a week",
          "value": "£56.40"
        },
        {
          "label": "Rate in 2025/26",
          "value": "£27.15"
        },
        {
          "label": "Apply by phone",
          "value": "0800 182 2222"
        }
      ],
      "asOf": "From April 2026",
      "source": {
        "publisher": "Social Security Scotland",
        "url": "https://www.socialsecurity.gov.scot/news/2026/02/scottish-child-payment-five-year-anniversary"
      }
    },
    image: {
      src: "/images/editorial/scotland-secure-homes.webp",
      alt: "Two children arriving home from school to a secure family home",
      caption:
        "The payment is designed to give low income families more room for everyday essentials, for every eligible child.",
      objectPosition: "center 44%",
    },
    toc: [
      { id: "how-much", label: "How much it is" },
      { id: "increase", label: "The 2026 increase" },
      { id: "who-can-get-it", label: "Who qualifies" },
      { id: "apply", label: "How to apply" },
      { id: "payment-dates", label: "Payment dates" },
      { id: "child-benefit", label: "Scottish Child Payment and Child Benefit" },
      { id: "why-it-matters", label: "Why it matters" },
      { id: "who-decides", label: "Who decides it" },
      { id: "take-up", label: "The money going unclaimed" },
    ],
    faq: [
      { q: "How much is Scottish Child Payment in 2026?", a: "From April 2026 it is £28.20 per child per week, paid as £112.80 per child every four weeks. It was £27.15 in 2025/26. The Scottish Government plans £40 a week for babies under one from 2027." },
      { q: "Who qualifies for Scottish Child Payment?", a: "You must live in Scotland, be responsible for a child under 16 and get Universal Credit or Pension Credit. Only one person can get it for each child, and there is no limit on the number of children." },
      { q: "How do I apply for Scottish Child Payment?", a: "Apply to Social Security Scotland online through mygov.scot, by paper form, or by phone on 0800 182 2222. It is not paid automatically when you get Universal Credit." },
      { q: "Is Scottish Child Payment the same as Child Benefit?", a: "No. Child Benefit is paid across the UK by HMRC, £27.05 a week for the eldest child and £17.90 for others. Scottish Child Payment is extra, only in Scotland, and you can get both." },
      { q: "Who decides the Scottish Child Payment?", a: "The Scottish Parliament in Edinburgh. It is a devolved payment, so your MSP can be asked about it. Most other benefits, including Universal Credit, are decided at Westminster by your MP." },
    ],
    sourceIds: ["sss-scp-five-years", "turn2us-scp-amount", "turn2us-scp-eligibility", "turn2us-scp-claim", "sg-child-payment-2026", "child-benefit-rates", "sss-contact", "sss-bank-holiday-dates", "sss-best-start", "cpag", "jrf"],
  },
  {
    slug: "how-to-contact-your-mp-or-msp",
    title: "Contact MSP or MP in Scotland: how to do it and what to say",
    seoTitle: "Contact MSP or MP in Scotland: Email, Phone and What to Say",
    description: "Email your MSP at firstname.surname.msp@parliament.scot or call 0131 348 5000. How to contact your MP too, what to write and what happens next.",
    standfirst: "Most people never contact their representatives, and the main reason is not apathy. It is not knowing how it works. Here are the addresses, the numbers and the words.",
    date: "2026-07-31",
    updated: "2026-10-29",
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
      { id: "mp-and-msp", label: "MSP or MP: which one" },
      { id: "contact-msp", label: "Contact your MSP" },
      { id: "contact-mp", label: "Contact your MP" },
      { id: "what-to-say", label: "What to actually say" },
      { id: "what-happens-next", label: "What happens next" },
      { id: "scottish-government", label: "The Scottish Government" },
      { id: "one-minute-version", label: "The one minute version" },
    ],
    faq: [
      { q: "How do I contact my MSP?", a: "Email them, usually at firstname.surname.msp@parliament.scot, phone the Scottish Parliament on 0131 348 5000 (free on 0800 092 7500), or write to The Scottish Parliament, Edinburgh, EH99 1SP. Include your full address and postcode." },
      { q: "Can I contact any of my 8 MSPs?", a: "Yes. Everyone in Scotland has one constituency MSP and seven regional MSPs. The Scottish Parliament says you can contact either type about anything it deals with." },
      { q: "What is the Scottish Parliament phone number?", a: "0131 348 5000, or 0800 092 7500 free. Calls are answered 10am to 1pm and 2pm to 4pm, Monday to Friday." },
      { q: "How do I contact my MP in Scotland?", a: "Most MPs use an email in the form firstname.surname.mp@parliament.uk. You can also phone their local office, call the House of Commons on 020 7219 3000, or write to House of Commons, London, SW1A 0AA." },
      { q: "What is the difference between an MP and an MSP?", a: "Your MP sits in the UK Parliament in London and deals with things like Universal Credit, the State Pension, immigration and the minimum wage. Your MSPs sit in the Scottish Parliament in Edinburgh and deal with the NHS, schools, housing, policing and Scottish benefits like the Scottish Child Payment." },
      { q: "Do I have to have voted for my MP to contact them?", a: "No. An MP represents everyone who lives in their area, whether they voted for them, voted against them, or did not vote at all. They still have to deal with your case." },
    ],
    sourceIds: ["sp-about-msps", "sp-contact-us", "sp-open-data-msps", "uk-parliament-members-api", "uk-parliament-contact-mp"],
  },
  {
    slug: "adult-disability-payment",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-adult-disability-payment.webp",
      alt: "Disability support, a wheelchair beside a welcoming home entrance",
      caption: "Disability support, a wheelchair beside a welcoming home entrance.",
    },
    title: "Adult disability payment: rates, eligibility and how to apply",
    seoTitle: "Adult Disability Payment 2026/27: Rates, Who Qualifies, How to Apply",
    description:
      "Adult Disability Payment pays £30.30 to £194.60 a week in 2026/27. The rates, who qualifies, how to apply in two parts, and how the myaccount login works.",
    standfirst:
      "Scotland's replacement for PIP. Not means tested, backdated to the day you start, and simpler to apply for than most people expect.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Adult Disability Payment", "Social Security Scotland", "Disability benefits", "PIP"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Adult Disability Payment rates 2026/27",
      value: pounds(ADULT_DISABILITY_PAYMENT.dailyLiving.enhanced + ADULT_DISABILITY_PAYMENT.mobility.enhanced, true),
      unit: "a week at most",
      detail: "There are two parts, daily living and mobility, each with a standard and an enhanced rate. You can get one part or both. Income and savings don't count.",
      rows: [
        { label: "Daily living, standard", value: `${pounds(ADULT_DISABILITY_PAYMENT.dailyLiving.standard, true)} a week` },
        { label: "Daily living, enhanced", value: `${pounds(ADULT_DISABILITY_PAYMENT.dailyLiving.enhanced, true)} a week` },
        { label: "Mobility, standard", value: `${pounds(ADULT_DISABILITY_PAYMENT.mobility.standard, true)} a week` },
        { label: "Mobility, enhanced", value: `${pounds(ADULT_DISABILITY_PAYMENT.mobility.enhanced, true)} a week` },
      ],
      asOf: "2026/27 rates",
      source: ADULT_DISABILITY_PAYMENT.source,
    },
    toc: [
      { id: "rates", label: "Rates for 2026/27" },
      { id: "eligibility", label: "Who qualifies" },
      { id: "apply", label: "How to apply" },
      { id: "login", label: "The login" },
      { id: "paid", label: "When it's paid" },
      { id: "carers", label: "If someone cares for you" },
    ],
    faq: [
      {
        q: "Is Adult Disability Payment means tested?",
        a: "No. Your wages, savings and other income are not taken into account, and you can get it whether you work or not.",
      },
      {
        q: "Do I need to apply if I already get PIP?",
        a: "No. Social Security Scotland moves people on PIP over to Adult Disability Payment automatically and writes to tell you when.",
      },
      {
        q: "How far back is Adult Disability Payment paid?",
        a: "From the day you submitted part 1 of the application, online or by phone, not from the day you get the decision.",
      },
      {
        q: "What is the adult disability payment phone number?",
        a: "Social Security Scotland's freephone number is 0800 182 2222, open 8am to 5pm, Monday to Friday, except bank holidays.",
      },
    ],
    sourceIds: ["sss-adult-disability-payment", "sss-contact"],
  },
  {
    slug: "adult-disability-payment-phone-number",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-adult-disability-payment-phone-number.webp",
      alt: "A telephone handset beside a blank notepad",
      caption: "A telephone handset beside a blank notepad.",
    },
    title: "Adult disability payment phone number",
    seoTitle: "Adult Disability Payment Phone Number: Call Times and What to Have Ready",
    description:
      "The Adult Disability Payment phone number is 0800 182 2222, free, 8am to 5pm on weekdays. Webchat, the number from abroad, the postal address and what to have ready.",
    standfirst:
      "One freephone number covers new claims, questions and changes. Here is when it's open and how to keep the call short.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Adult Disability Payment", "Social Security Scotland", "Phone numbers"],
    readingMinutes: 3,
    quickAnswer: {
      label: "Adult Disability Payment phone number",
      value: SOCIAL_SECURITY_SCOTLAND.phone,
      unit: "freephone",
      detail: "Social Security Scotland, 8am to 5pm, Monday to Friday, except bank holidays. You can start a claim on this number too.",
      rows: [
        { label: "From outside the UK", value: SOCIAL_SECURITY_SCOTLAND.abroad },
        { label: "Webchat", value: "8am to 5pm on weekdays" },
        { label: "Post", value: "PO Box 10301, Dundee, DD1 9FY" },
      ],
      source: SSS_SOURCE,
    },
    toc: [
      { id: "numbers", label: "Numbers and other ways in" },
      { id: "ready", label: "What to have ready" },
      { id: "apply-by-phone", label: "Applying by phone" },
      { id: "other", label: "Other numbers" },
    ],
    faq: [
      {
        q: "Is the Adult Disability Payment number free?",
        a: "Yes. 0800 182 2222 is a freephone number. If your mobile won't call 0800 numbers, you can call free from a landline or payphone.",
      },
      {
        q: "Can I apply for Adult Disability Payment by phone?",
        a: "Yes. They complete part 1 with you on the call and post you a paper form for part 2. If you're terminally ill the whole application can be done on the phone.",
      },
    ],
    sourceIds: ["sss-contact", "sss-adult-disability-payment"],
  },
  {
    slug: "carer-support-payment",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-carer-support-payment.webp",
      alt: "Two hands gently holding a warm mug together",
      caption: "Two hands gently holding a warm mug together.",
    },
    title: "Carer support payment: rates, eligibility and how to apply",
    seoTitle: "Carer Support Payment 2026/27: Rates, Who Qualifies, How to Apply",
    description:
      "Carer Support Payment is £86.45 a week in 2026/27, plus an £11.70 Scottish Carer Supplement. Who qualifies, the £204 earnings limit and how to apply.",
    standfirst:
      "Scotland's replacement for Carer's Allowance, with a weekly supplement on top and extra for each additional person you care for.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Carer Support Payment", "Carers", "Social Security Scotland", "Benefits"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Carer Support Payment 2026/27",
      value: pounds(CARER_SUPPORT_PAYMENT.weekly, true),
      unit: "a week",
      detail: `Plus the Scottish Carer Supplement of ${pounds(CARER_SUPPORT_PAYMENT.supplement, true)} a week, paid automatically. You need to care for 35 hours a week or more and take home no more than ${pounds(CARER_SUPPORT_PAYMENT.earningsLimit)} a week.`,
      rows: [
        { label: "Carer Support Payment", value: `${pounds(CARER_SUPPORT_PAYMENT.weekly, true)} a week` },
        { label: "Scottish Carer Supplement", value: `${pounds(CARER_SUPPORT_PAYMENT.supplement, true)} a week` },
        { label: "Each additional person", value: `${pounds(CARER_SUPPORT_PAYMENT.additionalPerson, true)} a week` },
        { label: "Earnings limit", value: `${pounds(CARER_SUPPORT_PAYMENT.earningsLimit)} a week take home` },
      ],
      asOf: "2026/27 rates",
      source: CARER_SUPPORT_PAYMENT.source,
    },
    toc: [
      { id: "rates", label: "Rates for 2026/27" },
      { id: "eligibility", label: "Who qualifies" },
      { id: "apply", label: "How to apply" },
      { id: "paid", label: "When you're paid" },
    ],
    faq: [
      {
        q: "Has Carer Support Payment replaced Carer's Allowance in Scotland?",
        a: "Yes. Carer Support Payment replaced Carer's Allowance across Scotland from November 2024. The Scottish Carer Supplement replaced the old Carer's Allowance Supplement.",
      },
      {
        q: "Can I work and get Carer Support Payment?",
        a: "Yes, as long as your take home pay is no more than £204 a week after tax, National Insurance and some allowed expenses. Pay that goes up and down can be averaged.",
      },
      {
        q: "Does Carer Support Payment affect Universal Credit?",
        a: "Yes. The DWP counts it as income for Universal Credit and other income related benefits. The Scottish Carer Supplement and the Carer Additional Person Payment don't affect other benefits.",
      },
    ],
    sourceIds: ["sss-carer-support-payment"],
  },
  {
    slug: "best-start-grant",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-best-start-grant.webp",
      alt: "A baby blanket and small knitted baby shoes",
      caption: "A baby blanket and small knitted baby shoes.",
    },
    title: "Best start grant: what you get and how to apply",
    seoTitle: "Best Start Grant 2026/27: Pregnancy, Early Learning and School Payments",
    description:
      "Best Start Grant pays £796.65 for a first baby, then £331.95 for early learning and £331.95 for school. Who qualifies, when to apply and how.",
    standfirst:
      "Three payments for low income families in Scotland, at birth, at two and at school age. None of it is paid back and you can spend it on anything.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Best Start Grant", "Best Start Foods", "Families", "Social Security Scotland"],
    readingMinutes: 5,
    quickAnswer: {
      label: "Best Start Grant 2026/27",
      value: pounds(BEST_START.pregnancyAndBabyFirst, true),
      unit: "for a first child",
      detail: "The Pregnancy and Baby Payment for your first child. Later children get less. The Early Learning and School Age payments are the same for every child.",
      rows: [
        { label: "Pregnancy and Baby, first child", value: pounds(BEST_START.pregnancyAndBabyFirst, true) },
        { label: "Pregnancy and Baby, later children", value: pounds(BEST_START.pregnancyAndBabyLater, true) },
        { label: "Early Learning Payment", value: pounds(BEST_START.earlyLearning, true) },
        { label: "School Age Payment", value: pounds(BEST_START.schoolAge, true) },
      ],
      asOf: "2026/27 rates",
      source: BEST_START.source,
    },
    toc: [
      { id: "amounts", label: "How much it is" },
      { id: "early-learning", label: "Early Learning Payment" },
      { id: "who", label: "Who can get it" },
      { id: "foods", label: "Best Start Foods" },
      { id: "apply", label: "How to apply" },
    ],
    faq: [
      {
        q: "When can I apply for the Best Start Grant Early Learning Payment?",
        a: "When your child is between 2 years old and 3 years 6 months. Your child doesn't need to go to nursery.",
      },
      {
        q: "Does Child Benefit count for Best Start Grant?",
        a: "Not on its own. You or your partner normally need Universal Credit, Housing Benefit, Income Support, Pension Credit, income based JSA or income related ESA. Parents under 18 don't need any benefit.",
      },
      {
        q: "Is the Best Start Grant paid automatically?",
        a: "The Early Learning and School Age payments can be, if you already get Scottish Child Payment for a child of the right age. The Pregnancy and Baby Payment needs an application.",
      },
    ],
    sourceIds: ["sss-best-start"],
  },
  {
    slug: "100-energy-payment-scotland",
    title: "£100 energy payment in Scotland: who gets it and when",
    seoTitle: "£100 Energy Payment Scotland: Who Gets It, Bands A to D and When",
    description:
      "The £100 energy payment from the UK Budget goes to homes in council tax bands A to D. Scotland will pay it too. Check your band, and what's still not announced.",
    standfirst:
      "Announced in the Budget on 28 October. The band rule is settled for Scotland. The date, and whether you need to apply, are not.",
    date: "2026-10-30",
    checked: "2026-10-30",
    category: "money-and-bills",
    tags: ["£100 energy payment", "Council tax bands", "Energy bills", "UK Budget"],
    readingMinutes: 4,
    guideImage: true,
    image: {
      src: "/images/editorial/guide-100-energy-payment-scotland.webp",
      alt: "Scotland Counted graphic headed £100 energy payment in Scotland, with a piggy bank and a glowing house marked £100 beside an energy bill and a radiator",
      caption: "Homes in council tax bands A to D get £100. The date, and whether you need to apply, are still to be announced.",
      aspect: "landscape",
      objectPosition: "50% 0%",
    },
    shareImage: {
      src: "/images/editorial/guide-100-energy-payment-scotland-share.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "Scotland Counted graphic: £100 energy payment in Scotland. Who gets it, when it's paid and how to apply.",
    },
    quickAnswer: {
      label: "£100 energy payment, Scotland",
      value: "£100",
      unit: "per household",
      detail:
        "For homes in council tax bands A to D, using the bands they have now. The Scottish Government says it will pay it, working with councils. No date yet.",
      rows: [
        { label: "Bands A to D", value: "Get £100" },
        { label: "Bands E to H", value: "Don't get it" },
        { label: "Do I need to apply?", value: "Not announced yet" },
        { label: "When", value: "This winter, date not set" },
      ],
      asOf: "Announced 28 October 2026",
      source: {
        publisher: "BBC Scotland",
        url: "https://www.yahoo.com/news/politics/articles/scottish-ministers-councils-100-energy-115428442.html",
      },
    },
    toc: [
      { id: "who", label: "Who gets it" },
      { id: "scotland", label: "Is Scotland getting it?" },
      { id: "bands", label: "Am I in band A to D?" },
      { id: "when", label: "When it's paid" },
      { id: "fair", label: "Why bands, not income" },
      { id: "other-help", label: "Other help this winter" },
    ],
    faq: [
      {
        q: "Who gets the £100 energy payment?",
        a: "Households in council tax bands A to D. It isn't means tested, so income and benefits don't matter. Homes in bands E to H don't get it.",
      },
      {
        q: "Is Scotland getting the £100 energy payment?",
        a: "Yes. The UK Government is giving Scotland its share of the money, and the Scottish Government has said it will pay it to homes in bands A to D, working with councils.",
      },
      {
        q: "When will the £100 energy payment be paid in Scotland?",
        a: "No date has been announced for Scotland yet. The UK Government says it's for this winter. Early reports say councils in England will pay it from January 2027.",
      },
      {
        q: "Do I need to apply for the £100 energy payment in Scotland?",
        a: "That hasn't been announced. In England, people who pay council tax by direct debit are expected to get it automatically, and others will be asked to claim. Scotland hasn't said how it will work here.",
      },
      {
        q: "How do I find out my council tax band in Scotland?",
        a: "It's printed on your council tax bill. You can also look it up free with your postcode on the Scottish Assessors Association website.",
      },
    ],
    sourceIds: ["independent-energy-payment", "bbc-energy-payment-scotland", "lothian-vjb-council-tax", "moray-valuation-bands"],
  },
  {
    slug: "buchanan-galleries-man-council-houses",
    title: "The man on the Buchanan Galleries steps: was he right about council houses?",
    seoTitle: "Buchanan Galleries Man Video: Was He Right About Council Houses?",
    description:
      "A Glasgow man's 86 second rant says Scotland's council houses were sold off and rented back at fortunes. The full transcript, checked against official figures.",
    standfirst:
      "His clip has gone round social media this week. Most of what he says stands up. Here's every word, the figures behind it, and why hardship can reach anyone.",
    date: "2026-10-31",
    checked: "2026-10-31",
    category: "poverty-explained",
    tags: [
      "Buchanan Galleries video",
      "Right to Buy Scotland",
      "Council houses",
      "Private rents Glasgow",
      "Homelessness Scotland",
      "Housing emergency",
      "Fact check",
    ],
    readingMinutes: 8,
    image: {
      src: "/images/editorial/buchanan-galleries-steps-wide.webp",
      alt: "A grey haired man in a dark jacket sitting on stone steps at night, talking to the camera",
      caption: "A still from the video, sharpened. Filmed on the steps by Buchanan Galleries by @scotsagainstcorruption.",
      aspect: "video",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/buchanan-galleries-share-card.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "A grey haired man on stone steps at night, beside the headline: Was he right about council houses? 494,580 council homes sold under Right to Buy.",
    },
    quickAnswer: {
      label: "Were Scotland's council houses sold off?",
      value: "494,580",
      unit: "homes sold",
      detail:
        "Council and housing association homes sold to their tenants under Right to Buy, 1979/80 to 2014/15. Rents have soared since. Where he goes too far is calling it fraud: Parliament passed it, so it was legal.",
      rows: [
        { label: "Right to Buy ended", value: "31 July 2016" },
        { label: "Glasgow's council homes", value: "Handed to Glasgow Housing Association in 2003" },
        { label: "2 bed private rent, Greater Glasgow, 2025", value: "£1,094 a month" },
        { label: "Average council rent, 2024/25", value: "£86.32 a week" },
      ],
      asOf: "Figures checked 31 October 2026",
      source: {
        publisher: "Scottish Government",
        url: "https://www.gov.scot/news/right-to-buy-ends-in-scotland/",
      },
    },
    toc: [
      { id: "what-he-said", label: "What he said" },
      { id: "his-story", label: "What we don't know about him" },
      { id: "sold", label: "Were the houses sold off?" },
      { id: "fraud", label: "Was it fraud?" },
      { id: "rents", label: "Is he right about rents?" },
      { id: "demand", label: "Can you still demand a home?" },
      { id: "anyone", label: "Hardship can reach anyone" },
      { id: "help", label: "If you're struggling" },
    ],
    faq: [
      {
        q: "Who is the man on the Buchanan Galleries steps?",
        a: "He hasn't been named publicly. The video was filmed and first posted on TikTok by @scotsagainstcorruption, and shared widely on X at the end of October 2026. Nobody watching knows his circumstances.",
      },
      {
        q: "How many council houses were sold under Right to Buy in Scotland?",
        a: "494,580 council and housing association homes were sold to their tenants between 1979/80 and 2014/15, according to the Scottish Government. Sales peaked at just under 40,000 in 1989. Right to Buy ended in Scotland on 31 July 2016.",
      },
      {
        q: "Was Right to Buy fraud?",
        a: "Not in law. Parliament passed it, and councils had to sell when a qualifying tenant applied. The argument he's making is a moral one: homes built with public money for everyone were sold cheaply, never replaced, and some are now rented privately at much higher rents.",
      },
      {
        q: "How much is private rent for a two bedroom home in Glasgow?",
        a: "The average advertised two bedroom private rent in Greater Glasgow was £1,094 a month in 2025, up 94% from £564 in 2010. The average council rent in Scotland was £86.32 a week in 2024/25, about £374 a month.",
      },
      {
        q: "Does the council have to house you in Scotland?",
        a: "If you're homeless and it isn't judged to be your own fault, yes. Since 31 December 2012 councils have a legal duty to find you a settled home. But a record 19,004 households were in temporary accommodation in March 2026, and on 21,800 occasions in 2025/26 councils didn't offer temporary accommodation when they should have.",
      },
    ],
    sourceIds: [
      "video-scotsagainstcorruption",
      "sg-right-to-buy-ends-2016",
      "sg-housing-key-trends-2019-rtb",
      "sg-housing-key-trends-2016-tenure",
      "sg-housing-key-trends-2025-tenure",
      "sfha-glasgow-stock-transfer",
      "sg-private-rents-2025",
      "sg-hra-2024-25",
      "ons-pipr-2026-10",
      "sg-homelessness-2025-26",
      "spice-housing-emergency",
      "sg-poverty-2026",
      "jrf-poverty-in-scotland-2026",
      "shelter-scotland-helpline",
    ],
  },
  {
    slug: "winter-fuel-payment-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-winter-fuel-payment-scotland.webp",
      alt: "A warm Scottish home in winter, snow outside",
      caption: "A warm Scottish home in winter, snow outside.",
    },
    title: "Winter fuel payment in Scotland: who gets it, how much and when",
    seoTitle: "Winter Fuel Payment Scotland 2026: Who Gets It, How Much and When",
    description:
      "In Scotland, Winter Fuel Payment is now Pension Age Winter Heating Payment: £105.55 to £316.70 this winter. Who gets it, the £35,000 rule and payment dates.",
    standfirst:
      "Scotland pays its own version now. Most pensioners get it without applying, but anyone with income over £35,000 hands it back through tax.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Winter Fuel Payment", "Pension Age Winter Heating Payment", "Pensioners", "Energy bills"],
    readingMinutes: 4,
    quickAnswer: {
      label: "Winter fuel payment Scotland, winter 2026 to 2027",
      value: `${pounds(PENSION_AGE_WINTER_HEATING.min, true)} to ${pounds(PENSION_AGE_WINTER_HEATING.max, true)}`,
      detail: `Paid as Pension Age Winter Heating Payment from ${PENSION_AGE_WINTER_HEATING.paidFrom} to people born on or before ${PENSION_AGE_WINTER_HEATING.bornOnOrBefore}. Most people don't need to apply.`,
      rows: [
        { label: "Living alone, up to 79", value: pounds(PENSION_AGE_WINTER_HEATING.under80, true) },
        { label: "Living alone, 80 or over", value: pounds(PENSION_AGE_WINTER_HEATING.over80, true) },
        { label: "Income over £35,000", value: "HMRC takes it back" },
        { label: "Not paid by March 2027", value: "Call Social Security Scotland" },
      ],
      asOf: "Winter 2026 to 2027",
      source: PENSION_AGE_WINTER_HEATING.source,
    },
    toc: [
      { id: "who", label: "Who gets it" },
      { id: "all-pensioners", label: "Do all pensioners get it?" },
      { id: "how-much", label: "How much it is" },
      { id: "when", label: "When it's paid" },
      { id: "pip", label: "Winter fuel payment and PIP" },
    ],
    faq: [
      {
        q: "Is there still a Winter Fuel Payment in Scotland?",
        a: "Not under that name. In Scotland it has been replaced by Pension Age Winter Heating Payment, paid by Social Security Scotland.",
      },
      {
        q: "Do all pensioners get the winter fuel payment in Scotland?",
        a: "Most people born on or before 27 June 1960 who live in Scotland get it automatically. If your own income is over £35,000, HMRC takes it back.",
      },
      {
        q: "When is the winter fuel payment paid in Scotland?",
        a: "From November 2026, through the winter. You get a letter first. Contact Social Security Scotland if you haven't been paid by the start of March 2027.",
      },
    ],
    sourceIds: ["sss-pension-age-winter-heating"],
  },
  {
    slug: "winter-heating-payment",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-winter-heating-payment.webp",
      alt: "A radiator beside a window on a cold Scottish day",
      caption: "A radiator beside a window on a cold Scottish day.",
    },
    title: "Winter heating payment: who gets it and when",
    seoTitle: "Winter Heating Payment 2026: Who Gets It and When It Is Paid",
    description:
      "Winter Heating Payment is £62.00, paid automatically from December to people on certain low income benefits in Scotland. Who qualifies and when it lands.",
    standfirst:
      "A single payment every winter, whatever the weather, if you get the right benefit in the qualifying week.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Winter Heating Payment", "Energy bills", "Social Security Scotland"],
    readingMinutes: 4,
    quickAnswer: {
      label: "Winter Heating Payment",
      value: pounds(WINTER_HEATING_PAYMENT.amount, true),
      unit: "once a winter",
      detail: `Paid automatically from ${WINTER_HEATING_PAYMENT.paidFrom} if you got a qualifying benefit in the week of ${WINTER_HEATING_PAYMENT.qualifyingWeek}. It shows as WHP on your statement.`,
      source: WINTER_HEATING_PAYMENT.source,
    },
    toc: [
      { id: "who", label: "Who gets it" },
      { id: "when", label: "When it's paid" },
      { id: "allowance", label: "Winter heating allowance" },
    ],
    faq: [
      {
        q: "Do I need to apply for Winter Heating Payment?",
        a: "No. It's paid automatically if you get a qualifying benefit during the qualifying week. You can send a request if you think you've been missed.",
      },
      {
        q: "Does Winter Heating Payment depend on the weather?",
        a: "No. Unlike the old Cold Weather Payment, it's a single payment every winter however cold it gets.",
      },
    ],
    sourceIds: ["sss-winter-heating"],
  },
  {
    slug: "social-security-scotland-payment-dates",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-social-security-scotland-payment-dates.webp",
      alt: "A plain calendar and a coin on a kitchen table",
      caption: "A plain calendar and a coin on a kitchen table.",
    },
    title: "Social security Scotland payment dates for 2026",
    seoTitle: "Social Security Scotland Payment Dates 2026 Including Christmas",
    description:
      "Social Security Scotland payment dates over Christmas 2026: payments due 24 to 28 December come on 23 December. Every bank holiday change to 2028.",
    standfirst:
      "When a payment date falls on a bank holiday you're paid early. That helps before Christmas and hurts in January.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Payment dates", "Social Security Scotland", "Christmas", "Benefits"],
    readingMinutes: 3,
    quickAnswer: {
      label: "Social Security Scotland Christmas payment dates",
      value: "23 December",
      detail: "Payments due on 24, 25 or 28 December 2026 are paid on Wednesday 23 December. Payments due on 1 or 4 January 2027 are paid on Thursday 31 December.",
      rows: [
        { label: "Due 24, 25 or 28 December", value: "Paid Wednesday 23 December" },
        { label: "Due 1 or 4 January", value: "Paid Thursday 31 December" },
        { label: "Best Start Foods", value: "Not affected" },
      ],
      asOf: "Christmas 2026",
      source: BANK_HOLIDAY_SOURCE,
    },
    toc: [
      { id: "christmas", label: "Christmas 2026" },
      { id: "all", label: "Every bank holiday change" },
      { id: "normal", label: "Your normal payment date" },
    ],
    faq: [
      {
        q: "Will my Social Security Scotland payment be early at Christmas?",
        a: "Yes, if it's due on a bank holiday. Payments due from 24 to 28 December 2026 come on 23 December, and those due on 1 or 4 January 2027 come on 31 December.",
      },
      {
        q: "Which benefits do the bank holiday dates cover?",
        a: "Adult Disability Payment, Carer Support Payment, Child Disability Payment, Pension Age Disability Payment, Scottish Child Payment and Scottish Adult DLA. Best Start Foods is not affected.",
      },
    ],
    sourceIds: ["sss-bank-holiday-dates"],
  },
  {
    slug: "young-carers-allowance-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-young-carers-allowance-scotland.webp",
      alt: "A school backpack and a cup of tea on a kitchen table",
      caption: "A school backpack and a cup of tea on a kitchen table.",
    },
    title: "Young carers allowance in Scotland: the Young Carer Grant",
    seoTitle: "Young Carers Allowance Scotland: The Young Carer Grant Explained",
    description:
      "Scotland's young carers allowance is the Young Carer Grant: £405.10 a year for carers aged 16 to 19 who care 16 hours a week. Who qualifies and how to apply.",
    standfirst:
      "A yearly payment for 16 to 19 year olds who look after someone. Spend it on whatever you like.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Young Carer Grant", "Young carers", "Carers", "Social Security Scotland"],
    readingMinutes: 3,
    quickAnswer: {
      label: "Young Carer Grant",
      value: pounds(YOUNG_CARER_GRANT.yearly, true),
      unit: "once a year",
      detail: "For carers aged 16 to 19 in Scotland who have cared an average of 16 hours a week for the last three months. You can claim every year until you turn 20.",
      source: YOUNG_CARER_GRANT.source,
    },
    toc: [
      { id: "who", label: "Who can get it" },
      { id: "how-often", label: "How often you can claim" },
      { id: "spend", label: "What you can spend it on" },
      { id: "apply", label: "How to apply" },
    ],
    faq: [
      {
        q: "Is there a Young Carers Allowance in Scotland?",
        a: "Not by that name. The payment for young carers in Scotland is the Young Carer Grant, £405.10 once a year for 16 to 19 year olds.",
      },
      {
        q: "Can I get the Young Carer Grant and Carer Support Payment?",
        a: "Not at the same time. If you care 35 hours a week or more, get the Young Carer Grant first, then apply for Carer Support Payment.",
      },
    ],
    sourceIds: ["sss-young-carer-grant"],
  },
  {
    slug: "crisis-grant-phone-number",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-crisis-grant-phone-number.webp",
      alt: "A phone and simple map outline of Scotland",
      caption: "A phone and simple map outline of Scotland.",
    },
    title: "Crisis grant phone number: every council in Scotland",
    seoTitle: "Crisis Grant Phone Number for Every Scottish Council",
    description:
      "The crisis grant phone number for all 32 Scottish councils, with opening hours and option numbers, checked against each council's own Scottish Welfare Fund page.",
    standfirst:
      "There is no national number. You ring the council where you live, and here is every one of them.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Crisis Grant", "Scottish Welfare Fund", "Phone numbers", "Emergency help"],
    readingMinutes: 4,
    quickAnswer: {
      label: "Crisis grant phone number",
      value: "Your council",
      detail: "Crisis grants come from your council's Scottish Welfare Fund, so the number depends on where you live. The table below has all 32.",
      rows: [
        { label: "Glasgow", value: "0141 276 1177, option 1" },
        { label: "Edinburgh", value: "0131 529 5299" },
        { label: "North Lanarkshire", value: "0300 555 0405" },
        { label: "South Lanarkshire", value: "0800 952 0448" },
      ],
      asOf: "Checked 29 October 2026",
      source: { publisher: "Council websites", url: "https://www.mygov.scot/scottish-welfare-fund/crisis-grants" },
    },
    toc: [
      { id: "numbers", label: "Every council's number" },
      { id: "before", label: "Before you call" },
      { id: "what", label: "What a crisis grant is" },
    ],
    faq: [
      {
        q: "Is there one phone number for crisis grants in Scotland?",
        a: "No. Each council runs its own Scottish Welfare Fund, so you call the council where you live. The Scottish Government doesn't take applications.",
      },
      {
        q: "How quickly will I hear about a crisis grant?",
        a: "Councils aim to decide a crisis grant by the end of the next working day.",
      },
    ],
    sourceIds: ["scottish-welfare-fund"],
  },
  {
    slug: "minimum-wage-2027",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-minimum-wage-2027.webp",
      alt: "A payslip and coins on a table",
      caption: "A payslip and coins on a table.",
    },
    title: "Minimum wage 2027: every rate from 1 April",
    seoTitle: `Minimum Wage 2027: ${pounds(MINIMUM_WAGE.next.over21, true)} From April, What It Means in Scotland`,
    description: `The minimum wage rises to ${pounds(MINIMUM_WAGE.next.over21, true)} an hour on 1 April 2027 for workers 21 and over. Every age rate, the yearly pay and take home pay in Scotland.`,
    standfirst: `A ${Math.round((MINIMUM_WAGE.next.over21 - MINIMUM_WAGE.current.over21) * 100)}p rise for anyone 21 or over, and every other rate up too. Here's what it adds up to over a year, and what actually reaches the bank in Scotland.`,
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Minimum wage", "National Living Wage", "Take home pay", "Scottish income tax"],
    readingMinutes: 5,
    quickAnswer: {
      label: "Minimum wage from 1 April 2027, 21 and over",
      value: pounds(MINIMUM_WAGE.next.over21, true),
      unit: "an hour",
      detail: `Up from ${pounds(MINIMUM_WAGE.current.over21, true)}. At 37.5 hours a week that's ${pounds(minimumWageNext.annual, true)} a year before tax, about ${pounds(minimumWageNext.netMonthly)} a month take home in Scotland on this year's tax rules.`,
      rows: [
        { label: "Age 21 and over", value: pounds(MINIMUM_WAGE.next.over21, true) },
        { label: "Age 18 to 20", value: pounds(MINIMUM_WAGE.next.age18to20, true) },
        { label: "Under 18", value: pounds(MINIMUM_WAGE.next.under18, true) },
        { label: "Apprentice", value: pounds(MINIMUM_WAGE.next.apprentice, true) },
      ],
      asOf: "Rates from 1 April 2027",
      source: MINIMUM_WAGE.source,
    },
    toc: [
      { id: "rates", label: "Every rate from 1 April 2027" },
      { id: "yearly", label: "What it adds up to in a year" },
      { id: "take-home", label: "Take home pay in Scotland" },
      { id: "scotland", label: "Does Scotland set its own rate?" },
      { id: "living-wage", label: "Against the real Living Wage" },
      { id: "check", label: "If your pay doesn't go up" },
    ],
    faq: [
      {
        q: "What will the minimum wage be in April 2027?",
        a: `From 1 April 2027 it is ${pounds(MINIMUM_WAGE.next.over21, true)} an hour for workers aged 21 and over, ${pounds(MINIMUM_WAGE.next.age18to20, true)} for ages 18 to 20, ${pounds(MINIMUM_WAGE.next.under18, true)} for under 18s and ${pounds(MINIMUM_WAGE.next.apprentice, true)} for apprentices on the apprentice rate.`,
      },
      {
        q: "How much is the minimum wage going up in 2027?",
        a: `By ${Math.round((MINIMUM_WAGE.next.over21 - MINIMUM_WAGE.current.over21) * 100)}p an hour for workers aged 21 and over, from ${pounds(MINIMUM_WAGE.current.over21, true)} to ${pounds(MINIMUM_WAGE.next.over21, true)}. At 37.5 hours a week that's ${pounds(minimumWageNext.annual - minimumWageNow.annual)} a year more before tax.`,
      },
      {
        q: `How much is ${pounds(MINIMUM_WAGE.next.over21, true)} an hour a year?`,
        a: `At 37.5 hours a week for 52 weeks it's ${pounds(minimumWageNext.annual, true)} before tax. On this year's Scottish tax rules that's about ${pounds(minimumWageNext.net)} a year take home, or ${pounds(minimumWageNext.netMonthly)} a month.`,
      },
      {
        q: "Is the minimum wage different in Scotland?",
        a: "No. The UK Government sets one minimum wage for the whole UK. Scotland sets its own income tax bands, so take home pay on the same wage is slightly different from England.",
      },
    ],
    sourceIds: ["minimum-wage-2027", "minimum-wage-2026", "scottish-tax-2026", "ni-rates-2026", "lpc-remit", "real-living-wage", "pay-work-rights", "nmw-employers"],
  },
  {
    slug: "average-salary-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-average-salary-scotland.webp",
      alt: "A plain payslip beside coins and a calculator without numbers",
      caption: "A plain payslip beside coins and a calculator without numbers.",
    },
    title: "Average salary Scotland: what full time workers earn",
    seoTitle: "Average Salary Scotland 2026: What Full Time Workers Earn by Council",
    description: `The average full time salary in Scotland is ${pounds(ASHE_2026.scotland.annual)} a year, the April 2026 median. The weekly and hourly figures, and what workers earn in all 32 councils.`,
    standfirst: `The latest official figures, published on ${ASHE_2026.released}, for Scotland and every council. Plus what the middle salary takes home, and how wide the spread really is.`,
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Average salary", "Wages", "Earnings", "Edinburgh", "Aberdeen", "Glasgow"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Average full time salary, Scotland",
      value: pounds(ASHE_2026.scotland.annual),
      unit: "a year",
      detail: `The median for full time employees living in Scotland in ${ASHE_2026.period}. Half earn more and half earn less. It works out at ${pounds(ASHE_2026.scotland.weekly, true)} a week before tax.`,
      rows: [
        { label: "Mean, pulled up by top earners", value: pounds(ASHE_2026.scotland.annualMean) },
        { label: "UK", value: pounds(ASHE_2026.uk.annual) },
        { label: "Edinburgh", value: pounds(asheCouncil("city-of-edinburgh").annual ?? 0) },
        { label: "Aberdeen", value: pounds(asheCouncil("aberdeen-city").annual ?? 0) },
        { label: "Glasgow", value: pounds(asheCouncil("glasgow-city").annual ?? 0) },
      ],
      asOf: `${ASHE_2026.period}, provisional`,
      source: ASHE_2026.residenceSource,
    },
    toc: [
      { id: "average-wage", label: "The average wage in Scotland" },
      { id: "councils", label: "Every council" },
      { id: "edinburgh", label: "Average salary in Edinburgh" },
      { id: "aberdeen", label: "Average salary in Aberdeen" },
      { id: "take-home", label: "What it takes home" },
      { id: "spread", label: "The lowest and highest paid" },
      { id: "source", label: "Where the figures come from" },
    ],
    faq: [
      {
        q: "What is the average salary in Scotland?",
        a: `${pounds(ASHE_2026.scotland.annual)} a year for full time employees, the median from the ONS Annual Survey of Hours and Earnings for ${ASHE_2026.period}. The mean, which high earners pull up, is ${pounds(ASHE_2026.scotland.annualMean)}. The 2026 figures are provisional.`,
      },
      {
        q: "What is the average wage in Scotland per hour?",
        a: `${pounds(ASHE_2026.scotland.hourly, true)} an hour for full time employees living in Scotland, leaving out overtime, in ${ASHE_2026.period}. Counting part time jobs as well, the middle hourly wage for jobs in Scotland is ${pounds(SCOTLAND_JOBS_HOURLY.hourlyMedian, true)}.`,
      },
      {
        q: "What is the average salary in Edinburgh?",
        a: `Full time workers living in Edinburgh earn ${pounds(asheCouncil("city-of-edinburgh").annual ?? 0)} a year in the middle, ${ASHE_2026.period}. Full time jobs based in the city pay ${pounds(CITY_PAY["city-of-edinburgh"].jobs.fullTimeAnnual)}, because they include people who travel in.`,
      },
      {
        q: "What is the average salary in Aberdeen?",
        a: `Full time workers living in Aberdeen earn ${pounds(asheCouncil("aberdeen-city").annual ?? 0)} a year in the middle, ${ASHE_2026.period}. Full time jobs based in the city pay ${pounds(CITY_PAY["aberdeen-city"].jobs.fullTimeAnnual)}, the highest of Scotland's four biggest cities.`,
      },
      {
        q: "Is £30,000 a good salary in Scotland?",
        a: `It's below the middle. About 1 in 5 full time workers in Scotland earn less than ${pounds(ASHE_2026.scotland.spread.p20)}, and 1 in 4 earn less than ${pounds(ASHE_2026.scotland.spread.p25)}. So £30,000 sits just above the lowest fifth of full time pay.`,
      },
    ],
    sourceIds: ["ashe-2026-residence", "ashe-2026-workplace", "ashe-uk-2026", "ashe-guide", "scottish-tax-2026", "ni-rates-2026", "ons-pipr-2026-10"],
  },
  {
    slug: "minimum-wage-in-glasgow-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-minimum-wage-in-glasgow-scotland.webp",
      alt: "Glasgow tenement street and an ordinary worker's lunch bag",
      caption: "Glasgow tenement street and an ordinary worker's lunch bag.",
    },
    title: "Minimum wage in Glasgow Scotland: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage in Glasgow Scotland 2026: Rates and Local Pay",
    description: `The minimum wage in Glasgow is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, ${pounds(MINIMUM_WAGE.next.over21, true)} from April 2027. What local jobs pay, Glasgow rent, and what's left each month on a full time wage.`,
    standfirst: "The legal rate is the same as anywhere in the UK. What isn't the same is Glasgow's rent, its council tax and what the jobs around you pay.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Minimum wage", "Glasgow", "Pay", "Rent", "Council tax"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Minimum wage in Glasgow, 21 and over",
      value: pounds(MINIMUM_WAGE.current.over21, true),
      unit: "an hour",
      detail: `The same legal rate as the rest of the UK, rising to ${pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027. Full time, that's about ${pounds(minimumWageNow.netMonthly)} a month take home.`,
      rows: [
        { label: "Age 21 and over", value: `${pounds(MINIMUM_WAGE.current.over21, true)}, then ${pounds(MINIMUM_WAGE.next.over21, true)}` },
        { label: "Age 18 to 20", value: `${pounds(MINIMUM_WAGE.current.age18to20, true)}, then ${pounds(MINIMUM_WAGE.next.age18to20, true)}` },
        { label: `One bedroom rent, ${CITY_PAY["glasgow-city"].rentArea}`, value: `${pounds(CITY_PAY["glasgow-city"].rent.oneBed)} a month` },
        { label: "Left after rent and council tax", value: `${pounds(cityBudget("glasgow-city").left)} a month` },
      ],
      asOf: `Rates from 1 April 2026. Rent for ${PRIVATE_RENTS.month}`,
      source: MINIMUM_WAGE.source,
    },
    toc: [
      { id: "rates", label: "The legal rate in Glasgow" },
      { id: "pay", label: "Full time pay" },
      { id: "local-jobs", label: "What Glasgow jobs pay" },
      { id: "money", label: "After rent and council tax" },
      { id: "living-wage", label: "The real Living Wage gap" },
      { id: "underpaid", label: "If you're underpaid" },
    ],
    faq: [
      {
        q: "Is the minimum wage different in Glasgow?",
        a: `No. The UK Government sets one minimum wage for the whole UK. In Glasgow it's ${pounds(MINIMUM_WAGE.current.over21, true)} an hour for workers aged 21 and over, the same as Edinburgh or London.`,
      },
      {
        q: "How much is the minimum wage a month in Glasgow?",
        a: `Working 37.5 hours a week at ${pounds(MINIMUM_WAGE.current.over21, true)} takes home about ${pounds(minimumWageNow.netMonthly)} a month after Scottish income tax and National Insurance. That's the same anywhere in Scotland.`,
      },
      {
        q: "What do jobs in Glasgow pay?",
        a: `In ${ASHE_2026.period}, 1 in 10 jobs based in Glasgow paid less than ${pounds(CITY_PAY["glasgow-city"].jobs.hourlyP10, true)} an hour and the middle job paid ${pounds(CITY_PAY["glasgow-city"].jobs.hourlyMedian, true)}. The middle full time job paid ${pounds(CITY_PAY["glasgow-city"].jobs.fullTimeAnnual)} a year.`,
      },
      {
        q: "What will the minimum wage be in Glasgow in 2027?",
        a: `${pounds(MINIMUM_WAGE.next.over21, true)} an hour from 1 April 2027 for workers aged 21 and over, the same as the rest of the UK.`,
      },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "scottish-tax-2026", "ni-rates-2026", "ashe-2026-workplace", "ashe-2026-residence", "ons-pipr-2026-10", "council-tax-scotland", "scottish-water-2026", "council-tax-discounts", "real-living-wage", "pay-work-rights", "nmw-employers"],
  },
  {
    slug: "minimum-wage-in-edinburgh-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-minimum-wage-in-edinburgh-scotland.webp",
      alt: "Edinburgh street with ordinary shops and a worker's lunch bag",
      caption: "Edinburgh street with ordinary shops and a worker's lunch bag.",
    },
    title: "Minimum wage in Edinburgh Scotland: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage in Edinburgh Scotland 2026: Rates and Local Pay",
    description: `The minimum wage in Edinburgh is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, the same as the rest of the UK. With rents at ${pounds(CITY_PAY["city-of-edinburgh"].rent.oneBed)} a month, here's what it leaves you.`,
    standfirst: "Same legal rate as Dundee or London. Edinburgh's rents are what make it go less far, and I've done the sums to show by how much.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Minimum wage", "Edinburgh", "Pay", "Rent", "Council tax"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Minimum wage in Edinburgh, 21 and over",
      value: pounds(MINIMUM_WAGE.current.over21, true),
      unit: "an hour",
      detail: `The UK wide legal rate, rising to ${pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027. Edinburgh rents take ${Math.round(cityBudget("city-of-edinburgh").rentShare * 100)}% of full time take home pay.`,
      rows: [
        { label: "Age 21 and over", value: `${pounds(MINIMUM_WAGE.current.over21, true)}, then ${pounds(MINIMUM_WAGE.next.over21, true)}` },
        { label: "Age 18 to 20", value: `${pounds(MINIMUM_WAGE.current.age18to20, true)}, then ${pounds(MINIMUM_WAGE.next.age18to20, true)}` },
        { label: `One bedroom rent, ${CITY_PAY["city-of-edinburgh"].rentArea}`, value: `${pounds(CITY_PAY["city-of-edinburgh"].rent.oneBed)} a month` },
        { label: "Left after rent and council tax", value: `${pounds(cityBudget("city-of-edinburgh").left)} a month` },
      ],
      asOf: `Rates from 1 April 2026. Rent for ${PRIVATE_RENTS.month}`,
      source: MINIMUM_WAGE.source,
    },
    toc: [
      { id: "rates", label: "The legal rate in Edinburgh" },
      { id: "rent", label: "Rent against a minimum wage" },
      { id: "money", label: "After rent and council tax" },
      { id: "pay", label: "Full time take home pay" },
      { id: "local-jobs", label: "What Edinburgh jobs pay" },
      { id: "living-wage", label: "The real Living Wage gap" },
      { id: "underpaid", label: "If you're underpaid" },
    ],
    faq: [
      {
        q: "Is the minimum wage higher in Edinburgh?",
        a: `No. The legal minimum is the same across the UK: ${pounds(MINIMUM_WAGE.current.over21, true)} an hour for workers aged 21 and over, rising to ${pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027.`,
      },
      {
        q: "How much of a minimum wage goes on rent in Edinburgh?",
        a: `The average one bedroom rent in the Lothian area was ${pounds(CITY_PAY["city-of-edinburgh"].rent.oneBed)} a month in ${PRIVATE_RENTS.month}. That's ${Math.round(cityBudget("city-of-edinburgh").rentShare * 100)}% of the ${pounds(minimumWageNow.netMonthly)} a full time minimum wage takes home.`,
      },
      {
        q: "What do jobs in Edinburgh pay?",
        a: `In ${ASHE_2026.period}, 1 in 10 jobs based in Edinburgh paid less than ${pounds(CITY_PAY["city-of-edinburgh"].jobs.hourlyP10, true)} an hour and the middle job paid ${pounds(CITY_PAY["city-of-edinburgh"].jobs.hourlyMedian, true)}. The middle full time job paid ${pounds(CITY_PAY["city-of-edinburgh"].jobs.fullTimeAnnual)} a year.`,
      },
      {
        q: "What will the minimum wage be in Edinburgh in 2027?",
        a: `${pounds(MINIMUM_WAGE.next.over21, true)} an hour from 1 April 2027 for workers aged 21 and over, the same as everywhere else in the UK.`,
      },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "scottish-tax-2026", "ni-rates-2026", "ons-pipr-2026-10", "ashe-2026-workplace", "ashe-2026-residence", "council-tax-scotland", "scottish-water-2026", "council-tax-discounts", "nmw-what-counts-as-pay", "real-living-wage", "pay-work-rights"],
  },
  {
    slug: "minimum-wage-aberdeen",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-minimum-wage-aberdeen.webp",
      alt: "Aberdeen granite street with ordinary shops and a worker's lunch bag",
      caption: "Aberdeen granite street with ordinary shops and a worker's lunch bag.",
    },
    title: "Minimum wage Aberdeen: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage Aberdeen 2026: Rates and Local Pay",
    description: `The minimum wage in Aberdeen is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, ${pounds(MINIMUM_WAGE.next.over21, true)} from April 2027. Aberdeen jobs pay more and rent costs less: here's what's left each month.`,
    standfirst: "The legal rate is the UK rate. But Aberdeen pairs better paid jobs than Glasgow, Edinburgh or Dundee with rents well below Edinburgh or Glasgow.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Minimum wage", "Aberdeen", "Pay", "Rent", "Council tax"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Minimum wage in Aberdeen, 21 and over",
      value: pounds(MINIMUM_WAGE.current.over21, true),
      unit: "an hour",
      detail: `The same legal rate as the rest of the UK, rising to ${pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027. The middle job in Aberdeen pays ${pounds(CITY_PAY["aberdeen-city"].jobs.hourlyMedian, true)} an hour.`,
      rows: [
        { label: "Age 21 and over", value: `${pounds(MINIMUM_WAGE.current.over21, true)}, then ${pounds(MINIMUM_WAGE.next.over21, true)}` },
        { label: "Age 18 to 20", value: `${pounds(MINIMUM_WAGE.current.age18to20, true)}, then ${pounds(MINIMUM_WAGE.next.age18to20, true)}` },
        { label: `One bedroom rent, ${CITY_PAY["aberdeen-city"].rentArea}`, value: `${pounds(CITY_PAY["aberdeen-city"].rent.oneBed)} a month` },
        { label: "Left after rent and council tax", value: `${pounds(cityBudget("aberdeen-city").left)} a month` },
      ],
      asOf: `Rates from 1 April 2026. Rent for ${PRIVATE_RENTS.month}`,
      source: MINIMUM_WAGE.source,
    },
    toc: [
      { id: "rates", label: "The legal rate in Aberdeen" },
      { id: "local-jobs", label: "What Aberdeen jobs pay" },
      { id: "rent", label: "Rent on a minimum wage" },
      { id: "money", label: "Council tax and what's left" },
      { id: "pay", label: "Full time take home pay" },
      { id: "living-wage", label: "The real Living Wage gap" },
      { id: "underpaid", label: "If you're underpaid" },
    ],
    faq: [
      {
        q: "Is the minimum wage different in Aberdeen?",
        a: `No. It's ${pounds(MINIMUM_WAGE.current.over21, true)} an hour for workers aged 21 and over, the same everywhere in the UK. The UK Government sets it each year on advice from the Low Pay Commission.`,
      },
      {
        q: "What do jobs in Aberdeen pay?",
        a: `In ${ASHE_2026.period}, the middle job based in Aberdeen paid ${pounds(CITY_PAY["aberdeen-city"].jobs.hourlyMedian, true)} an hour, and only 1 in 10 paid less than ${pounds(CITY_PAY["aberdeen-city"].jobs.hourlyP10, true)}. The middle full time job paid ${pounds(CITY_PAY["aberdeen-city"].jobs.fullTimeAnnual)} a year.`,
      },
      {
        q: "How much is left on minimum wage in Aberdeen after rent?",
        a: `About ${pounds(cityBudget("aberdeen-city").left)} a month, working full time at ${pounds(MINIMUM_WAGE.current.over21, true)}, after an average one bedroom rent of ${pounds(CITY_PAY["aberdeen-city"].rent.oneBed)} and a Band A council tax and water bill.`,
      },
      {
        q: "What will the minimum wage be in Aberdeen in 2027?",
        a: `${pounds(MINIMUM_WAGE.next.over21, true)} an hour from 1 April 2027 for workers aged 21 and over.`,
      },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "scottish-tax-2026", "ni-rates-2026", "ashe-2026-workplace", "ashe-2026-residence", "ons-pipr-2026-10", "council-tax-scotland", "scottish-water-2026", "council-tax-discounts", "lpc-remit", "real-living-wage", "pay-work-rights", "nmw-employers"],
  },
  {
    slug: "minimum-wage-dundee",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-minimum-wage-dundee.webp",
      alt: "Dundee city street with ordinary shops and a worker's lunch bag",
      caption: "Dundee city street with ordinary shops and a worker's lunch bag.",
    },
    title: "Minimum wage Dundee: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage Dundee 2026: Rates and Local Pay",
    description: `The minimum wage in Dundee is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, ${pounds(MINIMUM_WAGE.next.over21, true)} from April 2027. Rent is the lowest of Scotland's four biggest cities, so the wage goes further.`,
    standfirst: "Full time jobs in Dundee pay a little less than in Glasgow, Edinburgh or Aberdeen. Its rents are lower still, and on the legal minimum that leaves more in your pocket.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Minimum wage", "Dundee", "Pay", "Rent", "Council tax"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Minimum wage in Dundee, 21 and over",
      value: pounds(MINIMUM_WAGE.current.over21, true),
      unit: "an hour",
      detail: `The same legal rate as the rest of the UK, rising to ${pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027. Working full time, that's about ${pounds(minimumWageNow.netMonthly)} a month take home.`,
      rows: [
        { label: "Age 21 and over", value: `${pounds(MINIMUM_WAGE.current.over21, true)}, then ${pounds(MINIMUM_WAGE.next.over21, true)}` },
        { label: "Age 18 to 20", value: `${pounds(MINIMUM_WAGE.current.age18to20, true)}, then ${pounds(MINIMUM_WAGE.next.age18to20, true)}` },
        { label: `One bedroom rent, ${CITY_PAY["dundee-city"].rentArea}`, value: `${pounds(CITY_PAY["dundee-city"].rent.oneBed)} a month` },
        { label: "Left after rent and council tax", value: `${pounds(cityBudget("dundee-city").left)} a month` },
      ],
      asOf: `Rates from 1 April 2026. Rent for ${PRIVATE_RENTS.month}`,
      source: MINIMUM_WAGE.source,
    },
    toc: [
      { id: "rates", label: "The legal rate in Dundee" },
      { id: "money", label: "After rent and council tax" },
      { id: "council-tax", label: "Dundee council tax" },
      { id: "local-jobs", label: "What Dundee jobs pay" },
      { id: "pay", label: "Full time take home pay" },
      { id: "living-wage", label: "The real Living Wage gap" },
      { id: "underpaid", label: "If you're underpaid" },
    ],
    faq: [
      {
        q: "Is the minimum wage different in Dundee?",
        a: `No. The UK Government sets one rate for the whole UK. In Dundee it's ${pounds(MINIMUM_WAGE.current.over21, true)} an hour for workers aged 21 and over.`,
      },
      {
        q: "How much is left on minimum wage in Dundee after rent?",
        a: `About ${pounds(cityBudget("dundee-city").left)} a month, working full time at ${pounds(MINIMUM_WAGE.current.over21, true)}, after an average one bedroom rent of ${pounds(CITY_PAY["dundee-city"].rent.oneBed)} and a Band A council tax and water bill. That's more than in Glasgow, Edinburgh or Aberdeen.`,
      },
      {
        q: "How much did Dundee council tax go up?",
        a: `Dundee City Council raised council tax by ${cityBudget("dundee-city").councilTaxRisePct.toFixed(1)}% for 2026/27. A Band A bill with water and waste water is ${pounds(cityBudget("dundee-city").councilTaxAnnual, true)} a year.`,
      },
      {
        q: "What do jobs in Dundee pay?",
        a: `In ${ASHE_2026.period}, 1 in 10 jobs based in Dundee paid less than ${pounds(CITY_PAY["dundee-city"].jobs.hourlyP10, true)} an hour and the middle job paid ${pounds(CITY_PAY["dundee-city"].jobs.hourlyMedian, true)}. The middle full time job paid ${pounds(CITY_PAY["dundee-city"].jobs.fullTimeAnnual)} a year.`,
      },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "scottish-tax-2026", "ni-rates-2026", "ons-pipr-2026-10", "council-tax-scotland", "scottish-water-2026", "council-tax-discounts", "council-tax-reduction-2026", "ashe-2026-workplace", "ashe-2026-residence", "real-living-wage", "pay-work-rights"],
  },
  {
    slug: "check-council-tax-band",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-check-council-tax-band.webp",
      alt: "Scottish terraced houses with a plain letter and a magnifying glass",
      caption: "Scottish terraced houses with a plain letter and a magnifying glass.",
    },
    title: "Check council tax band: find your band in Scotland",
    seoTitle: "Check Council Tax Band in Scotland: Find My Council Tax Band",
    description: `Check your council tax band free on the Scottish Assessors site by postcode. Band A means a 1991 value ${bandValueLabel("A").toLowerCase()}. What each band means and how to appeal.`,
    standfirst:
      "Your band is on a public list anyone can search. Here's how to find it in a minute, what the letter means, and when you can ask for it to change.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Council tax bands", "Council tax", "Scottish Assessors", "Council tax appeals"],
    readingMinutes: 5,
    quickAnswer: {
      label: "Check council tax band in Scotland",
      value: "Free",
      unit: "on saa.gov.uk, by postcode",
      detail:
        "Search your postcode or address on the Scottish Assessors Association website and pick your home. Your band is also printed on your council tax bill.",
      rows: [
        { label: "Band A, value on 1 April 1991", value: bandValueLabel("A") },
        { label: "Band D, value on 1 April 1991", value: bandValueLabel("D") },
        { label: "Band H, value on 1 April 1991", value: bandValueLabel("H") },
        { label: "Time a new owner has to appeal", value: `${BAND_PROPOSALS.newOwnerMonths} months` },
      ],
      asOf: "Bands A to H, based on values at 1 April 1991",
      source: LOTHIAN_VJB_SOURCE,
    },
    toc: [
      { id: "find", label: "Find your band" },
      { id: "check-my-band", label: "Check it against your bill" },
      { id: "bands", label: "What the bands mean" },
      { id: "appeal", label: "How to appeal" },
      { id: "council-tax-check", label: "Check your whole bill" },
    ],
    faq: [
      {
        q: "How to find out your council tax band in Scotland?",
        a: "Search your postcode or address on the Scottish Assessors Association website, saa.gov.uk, and pick your home from the list. It's free. Your band is also printed on your council tax bill.",
      },
      {
        q: "Who decides my council tax band?",
        a: "The local Assessor, who is independent of the council. The council only sets the price of each band.",
      },
      {
        q: `Can I appeal my council tax band after ${BAND_PROPOSALS.newOwnerMonths} months?`,
        a: "Only in certain cases, for example if the home has lost value because part of it was knocked down, the area around it physically changed, or it was adapted for a disabled person. A fall in house prices doesn't count.",
      },
      {
        q: "Do I keep paying council tax while I appeal my band?",
        a: "Yes. Keep paying as normal until the Assessor makes a decision.",
      },
      {
        q: "Why is my council tax band based on 1991?",
        a: "Council tax started in Scotland on 1 April 1993, and homes were banded on what they would have sold for on 1 April 1991. Bands A to H still use those values.",
      },
    ],
    sourceIds: [
      "lothian-vjb-council-tax",
      "lanarkshire-vjb-proposals",
      "grampian-assessor-appeals",
      "west-lothian-council-tax-bands",
      "moray-valuation-bands",
      "council-tax-scotland",
    ],
  },
  {
    slug: "council-tax-reduction-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-council-tax-reduction-scotland.webp",
      alt: "A modest Scottish home and household bills",
      caption: "A modest Scottish home and household bills.",
    },
    title: "Council tax reduction Scotland: who qualifies and how much",
    seoTitle: "Council Tax Reduction Scotland: Who Qualifies and How to Apply",
    description: `Council Tax Reduction takes up to ${COUNCIL_TAX_REDUCTION.maxPercent}% off council tax if your income is low and savings are under ${pounds(COUNCIL_TAX_REDUCTION.savingsLimit)}. Who qualifies, how much and how to apply.`,
    standfirst:
      "Help from your council when money is tight, whether you work, rent, own or claim Universal Credit. Who gets it, how it's worked out, and how to claim in Edinburgh, South Lanarkshire and North Lanarkshire.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Council Tax Reduction", "Council tax", "Universal Credit", "Low income"],
    readingMinutes: 7,
    quickAnswer: {
      label: "Council Tax Reduction Scotland",
      value: `Up to ${COUNCIL_TAX_REDUCTION.maxPercent}%`,
      unit: "off your council tax",
      detail: `For households on a low income, in work or not, including people on Universal Credit. You claim it from your council. Savings over ${pounds(COUNCIL_TAX_REDUCTION.savingsLimit)} rule you out unless you get Guarantee Credit.`,
      rows: [
        { label: "Savings limit", value: pounds(COUNCIL_TAX_REDUCTION.savingsLimit) },
        { label: "Income above what you need", value: `You pay ${COUNCIL_TAX_REDUCTION.taperPercent}% of the difference` },
        { label: "Water charges", value: `Up to ${WATER_CHARGES_REDUCTION.maxPercent}% off, applied for you` },
        { label: "Second adult rebate", value: `${SECOND_ADULT_REBATE.middleIncomePercent}% to ${SECOND_ADULT_REBATE.onBenefitsPercent}% off` },
      ],
      asOf: "2026/27 rules for working age households",
      source: COUNCIL_TAX_REDUCTION.source,
    },
    toc: [
      { id: "who-qualifies", label: "Who qualifies" },
      { id: "how-much", label: "How much you can get" },
      { id: "universal-credit", label: "Universal Credit" },
      { id: "second-adult", label: "The second adult rule" },
      { id: "apply", label: "How to apply" },
      { id: "edinburgh", label: "Edinburgh" },
      { id: "south-lanarkshire", label: "South Lanarkshire" },
      { id: "north-lanarkshire", label: "North Lanarkshire" },
      { id: "other-help", label: "Other help with the bill" },
    ],
    faq: [
      {
        q: "Can I get Council Tax Reduction if I work?",
        a: `Yes. It depends on your income, not on whether you work. If your income is above what the rules say you need, you pay ${COUNCIL_TAX_REDUCTION.taperPercent}% of the difference towards council tax and the reduction covers the rest.`,
      },
      {
        q: "Do I get Council Tax Reduction automatically with Universal Credit?",
        a: "No. It's a separate claim to your council. The DWP may pass on your details if you asked for it when you claimed Universal Credit, but send your own application to be safe.",
      },
      {
        q: "Does Council Tax Reduction cover water charges?",
        a: `No. But anyone who gets it can get up to ${WATER_CHARGES_REDUCTION.maxPercent}% off water and waste water through the Water Charges Reduction Scheme. The council applies it for you.`,
      },
      {
        q: "What is the savings limit for Council Tax Reduction?",
        a: `${pounds(COUNCIL_TAX_REDUCTION.savingsLimit)}. Savings above that rule you out, unless you or your partner get the Guarantee Credit part of Pension Credit.`,
      },
    ],
    sourceIds: [
      "ctr-regulations-2021",
      "ctr-second-adult-2026",
      "spice-ctr-universal-credit",
      "edinburgh-ctr",
      "south-lanarkshire-ctr",
      "south-lanarkshire-second-adult",
      "north-lanarkshire-ctr",
      "north-lanarkshire-ctr-review",
      "scottish-water-charges-2026",
      "council-tax-scotland",
    ],
  },
  {
    slug: "single-person-discount-council-tax-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-single-person-discount-council-tax-scotland.webp",
      alt: "One cup and a plain household bill on a kitchen table",
      caption: "One cup and a plain household bill on a kitchen table.",
    },
    title: "Single person discount council tax Scotland: how to claim 25% off",
    seoTitle: "Single Person Discount Council Tax Scotland: 25% Off and How to Claim",
    description: `Live alone? You get ${SINGLE_PERSON_DISCOUNT.percent}% off council tax and water. That's ${pounds((bandFor("glasgow-city", "D").total * SINGLE_PERSON_DISCOUNT.percent) / 100)} a year on a Band D home in Glasgow. Who counts as an adult and how to claim.`,
    standfirst:
      "A quarter off the whole bill, water included, if you're the only adult who counts. Who's disregarded, how to claim, and what to do when someone moves in.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Single person discount", "Council tax discounts", "Council tax", "Living alone"],
    readingMinutes: 5,
    quickAnswer: {
      label: "Single person discount council tax Scotland",
      value: `${SINGLE_PERSON_DISCOUNT.percent}%`,
      unit: "off your whole bill",
      detail: `If you're the only adult in your home, or the only one who isn't disregarded, your council takes ${SINGLE_PERSON_DISCOUNT.percent}% off council tax, water and waste water. Income doesn't matter. You have to apply.`,
      rows: [
        ...["glasgow-city", "city-of-edinburgh", "aberdeen-city"].map((slug) => ({
          label: `Band D, ${COUNCIL_SEARCH_NAMES[slug]}`,
          value: `${pounds((bandFor(slug, "D").total * SINGLE_PERSON_DISCOUNT.percent) / 100)} a year off`,
        })),
        { label: "If another adult moves in", value: `Tell the council within ${SINGLE_PERSON_DISCOUNT.notifyDays} days` },
      ],
      asOf: "2026/27 bills, water included",
      source: SINGLE_PERSON_DISCOUNT.source,
    },
    toc: [
      { id: "worth", label: "What it's worth" },
      { id: "who-counts", label: "Who counts as an adult" },
      { id: "apply", label: "How to claim" },
      { id: "moves-in", label: "If someone moves in" },
      { id: "other-discounts", label: "Other discounts" },
    ],
    faq: [
      {
        q: "Does the single person discount apply to water charges?",
        a: `Yes. In Scotland the ${SINGLE_PERSON_DISCOUNT.percent}% comes off the water and waste water charges as well as the council tax.`,
      },
      {
        q: "Who counts as an adult for council tax?",
        a: "Anyone aged 18 or over, except people who are disregarded, such as full time students, some apprentices, some carers, and people living permanently in a care home or in prison.",
      },
      {
        q: "What happens to my single person discount if someone moves in?",
        a: `It stops from the day another adult who isn't disregarded moves in. Tell the council in writing within ${SINGLE_PERSON_DISCOUNT.notifyDays} days, or it can charge a ${pounds(SINGLE_PERSON_DISCOUNT.penalty)} penalty.`,
      },
      {
        q: "Can I get the single person discount and Council Tax Reduction?",
        a: "Yes. The discount comes off first, then Council Tax Reduction is worked out on what's left.",
      },
    ],
    sourceIds: [
      "edinburgh-single-occupancy-discount",
      "edinburgh-council-tax-discounts",
      "south-lanarkshire-council-tax-discounts",
      "south-lanarkshire-spd-review",
      "spice-ctr-universal-credit",
      "lgfa-1992-discounts",
      "ct-administration-regs-1992",
      "lgfa-1992-penalties",
      "ctr-regulations-2021",
      "council-tax-scotland",
      "scottish-water-2026",
    ],
  },
  {
    slug: "water-rates-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-water-rates-scotland.webp",
      alt: "A water tap and a clear glass of water in a Scottish home",
      caption: "A water tap and a clear glass of water in a Scottish home.",
    },
    title: "Water rates Scotland: what every band pays in 2026/27",
    seoTitle: "Water Rates Scotland 2026/27: Charges by Council Tax Band",
    description: `Water rates in Scotland for 2026/27 run from ${pounds(waterCharges2026.A.water + waterCharges2026.A.wasteWater, true)} a year at Band A to ${pounds(waterCharges2026.H.water + waterCharges2026.H.wasteWater, true)} at Band H, paid with council tax. Every band and this year's rise.`,
    standfirst:
      "There's no separate water bill in Scotland. Scottish Water's charge comes on your council tax bill, set by your band and the same in every council.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Water rates", "Scottish Water", "Council tax", "Water charges"],
    readingMinutes: 5,
    quickAnswer: {
      label: "Water rates Scotland 2026/27",
      value: pounds(waterCharges2026.D.water + waterCharges2026.D.wasteWater, true),
      unit: "a year at Band D",
      detail:
        "Scottish Water's charge for water and waste water, collected on your council tax bill. It depends on your band and is the same in every council.",
      rows: BAND_LETTERS.map((band) => ({
        label: `Band ${band}`,
        value: `${pounds(waterCharges2026[band].water + waterCharges2026[band].wasteWater, true)} a year`,
      })),
      asOf: "1 April 2026 to 31 March 2027",
      source: SCOTTISH_WATER.source,
    },
    toc: [
      { id: "charges", label: "Charges by band" },
      { id: "same-everywhere", label: "Same in every council" },
      { id: "rise", label: "This year's rise" },
      { id: "help", label: "Help with water charges" },
      { id: "not-connected", label: "Not on mains or sewers" },
      { id: "meters", label: "Water meters" },
    ],
    faq: [
      {
        q: "Do you pay water rates in Scotland?",
        a: "Most homes do. Scottish Water's water and waste water charges are added to your council tax bill and collected by your council. There's no separate bill unless you have a water meter.",
      },
      {
        q: "Are water rates included in council tax in Scotland?",
        a: "They're on the same bill, but they're a separate charge. Your council collects them for Scottish Water, and the amount depends on your council tax band.",
      },
      {
        q: "How much are water rates in Scotland a month?",
        a: `At Band D, ${pounds((waterCharges2026.D.water + waterCharges2026.D.wasteWater) / 12, true)} a month spread over 12 months. Band A is ${pounds((waterCharges2026.A.water + waterCharges2026.A.wasteWater) / 12, true)} a month.`,
      },
      {
        q: "Do students pay water rates in Scotland?",
        a: "Full time students don't pay water charges, so a home where everyone is a full time student pays none.",
      },
      {
        q: "Do I pay water rates if I get Council Tax Reduction?",
        a: `Yes. Council Tax Reduction doesn't cover water, but you can get up to ${WATER_CHARGES_REDUCTION.maxPercent}% off through the Water Charges Reduction Scheme. Your council applies it for you.`,
      },
    ],
    sourceIds: [
      "scottish-water-2026",
      "scottish-water-2025",
      "scottish-water-charges-2026",
      "scottish-water-unmetered-faqs",
      "edinburgh-single-occupancy-discount",
      "council-tax-scotland",
    ],
  },
  {
    slug: "modern-studies",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-modern-studies.webp",
      alt: "Open textbook and pencil beside a Scottish Parliament exterior silhouette",
      caption: "Open textbook and pencil beside a Scottish Parliament exterior silhouette.",
    },
    title: "Modern studies: free resources for pupils and teachers",
    seoTitle: "Modern Studies: Free Resources for Pupils and Teachers in Scotland",
    description: `Free Modern Studies resources: N5 is ${N5_MODERN_STUDIES.totalMarks} marks, Higher ${HIGHER_MODERN_STUDIES.totalMarks}, Advanced Higher ${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks}. Course guides, past paper help and real Scottish data.`,
    standfirst:
      "Course facts from the people who set the exams, and up to date Scottish figures you can drop into an answer. All free, all sourced.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "National 5", "Higher", "Advanced Higher", "Revision", "Teachers"],
    readingMinutes: 5,
    quickAnswer: {
      label: "Modern Studies in Scotland",
      value: "3",
      unit: "areas of study: democracy, social issues and international issues",
      detail: `Qualifications Scotland, which replaced SQA on ${QS_REPLACED_SQA}, sets and marks the exams. Every level combines an exam with coursework.`,
      rows: [
        { label: "National 5", value: `${N5_MODERN_STUDIES.totalMarks} marks: ${N5_MODERN_STUDIES.paper.marks} exam, ${N5_MODERN_STUDIES.assignment.marks} assignment` },
        { label: "Higher", value: `${HIGHER_MODERN_STUDIES.totalMarks} marks: two papers worth ${HIGHER_MODERN_STUDIES.paper1.marks + HIGHER_MODERN_STUDIES.paper2.marks}, assignment ${HIGHER_MODERN_STUDIES.assignment.marks}` },
        { label: "Advanced Higher", value: `${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks} marks: ${ADVANCED_HIGHER_MODERN_STUDIES.paper.marks} exam, ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.marks} dissertation` },
        { label: "Exams in 2027", value: MODERN_STUDIES_EXAMS_2027.date },
      ],
      asOf: "Course specifications checked 29 October 2026",
      source: QS_SOURCE,
    },
    toc: [
      { id: "what", label: "What modern studies is" },
      { id: "levels", label: "The courses, level by level" },
      { id: "resources", label: "Resources on this site" },
      { id: "revision", label: "Revision with real data" },
      { id: "teachers", label: "For teachers" },
      { id: "official", label: "Official links" },
    ],
    faq: [
      {
        q: "What is modern studies?",
        a: "A Scottish school subject about politics, society and international issues. At National 5 and Higher it has three areas of study: democracy in Scotland and the UK, social issues in the UK, and international issues.",
      },
      {
        q: "Is SQA now called Qualifications Scotland?",
        a: `Yes. Qualifications Scotland replaced SQA on ${QS_REPLACED_SQA}. Course documents and past papers are still on sqa.org.uk while its new website is built, and Qualifications Scotland says they remain current.`,
      },
      {
        q: "When is the modern studies exam in 2027?",
        a: `Every Modern Studies exam is on ${MODERN_STUDIES_EXAMS_2027.date}. National 5 is ${MODERN_STUDIES_EXAMS_2027.n5}. Higher Paper 1 is ${MODERN_STUDIES_EXAMS_2027.higherPaper1} and Paper 2 ${MODERN_STUDIES_EXAMS_2027.higherPaper2}. Advanced Higher is ${MODERN_STUDIES_EXAMS_2027.advancedHigher}.`,
      },
      {
        q: "What are the best free modern studies resources?",
        a: "The official course pages and past papers from Qualifications Scotland, BBC Bitesize for notes, and up to date Scottish statistics for examples. This site links each part of the course to official figures on poverty, crime, councils and MSPs.",
      },
      {
        q: "How should I start modern studies revision?",
        a: "Learn how your course is marked, then learn a few recent, accurate Scottish examples for each topic, then practise past paper questions on time and mark them with the marking instructions.",
      },
    ],
    sourceIds: [
      "qs-modern-studies-subject",
      "qs-n5-modern-studies-spec",
      "qs-higher-modern-studies-spec",
      "qs-ah-modern-studies-spec",
      "qs-exam-timetable-2027",
      "qs-higher-modern-studies-report-2026",
      "sg-poverty-2026",
      "sp-open-data-msps",
      "audit-scotland-council-budgets-2026-27",
      "recorded-crime-2025-26-dishonesty",
    ],
  },
  {
    slug: "national-5-modern-studies",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-national-5-modern-studies.webp",
      alt: "School exercise books, pencil and an abstract Scottish Parliament silhouette",
      caption: "School exercise books, pencil and an abstract Scottish Parliament silhouette.",
    },
    title: "National 5 modern studies: the course in plain English",
    seoTitle: "National 5 Modern Studies: Course Guide, Notes and Real Data",
    description: `National 5 Modern Studies is ${N5_MODERN_STUDIES.totalMarks} marks: an ${N5_MODERN_STUDIES.paper.marks} mark exam and a ${N5_MODERN_STUDIES.assignment.marks} mark assignment. The course in plain English, revision notes and model answers.`,
    standfirst:
      "What is in the exam, how the assignment is marked, and revision notes built on real Scottish figures you can quote.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "National 5", "Revision", "Model answers"],
    readingMinutes: 8,
    quickAnswer: {
      label: "National 5 Modern Studies marks",
      value: `${N5_MODERN_STUDIES.totalMarks}`,
      unit: "marks in total",
      detail: `An exam worth ${N5_MODERN_STUDIES.paper.marks} marks, lasting ${N5_MODERN_STUDIES.paper.duration}, and an assignment worth ${N5_MODERN_STUDIES.assignment.marks}, written up in ${N5_MODERN_STUDIES.assignment.duration}. The exam is ${N5_MODERN_STUDIES.paper.sharePct}% of your grade.`,
      rows: [
        { label: "Exam", value: `${N5_MODERN_STUDIES.paper.marks} marks, ${N5_MODERN_STUDIES.paper.duration}` },
        { label: "Assignment", value: `${N5_MODERN_STUDIES.assignment.marks} marks, ${N5_MODERN_STUDIES.assignment.duration} to write up` },
        { label: `Grade A in ${N5_MODERN_STUDIES.results.year}`, value: `${N5_MODERN_STUDIES.results.a} out of ${N5_MODERN_STUDIES.totalMarks}` },
        { label: "Exam in 2027", value: `${MODERN_STUDIES_EXAMS_2027.date}, ${MODERN_STUDIES_EXAMS_2027.n5}` },
      ],
      asOf: `Course specification ${N5_MODERN_STUDIES.specVersion}`,
      source: N5_MODERN_STUDIES.source,
    },
    toc: [
      { id: "course", label: "How it is assessed" },
      { id: "exam", label: "What is in the exam" },
      { id: "assignment", label: "The assignment" },
      { id: "notes", label: "Revision notes" },
      { id: "model-answers", label: "Model answers" },
      { id: "dates", label: "Exam date and results" },
    ],
    faq: [
      {
        q: "How long is the National 5 Modern Studies exam?",
        a: `${N5_MODERN_STUDIES.paper.duration}, for ${N5_MODERN_STUDIES.paper.marks} marks. It has three sections, democracy, social issues and international issues, and you answer one option in each.`,
      },
      {
        q: "How many marks is the N5 Modern Studies assignment worth?",
        a: `${N5_MODERN_STUDIES.assignment.marks} marks out of ${N5_MODERN_STUDIES.totalMarks}. You research a topic of your choice, then write it up in ${N5_MODERN_STUDIES.assignment.duration} using only your research sheet, which is two single sided sheets of A4.`,
      },
      {
        q: "What topics are in National 5 Modern Studies?",
        a: "Democracy in Scotland or the UK; social inequality or crime and the law; and a world power or a world issue. Your school chooses the options.",
      },
      {
        q: "Where can I find national 5 modern studies revision notes?",
        a: "BBC Bitesize has free notes for every topic. This guide adds revision notes built on up to date Scottish figures for democracy, social inequality and crime, which you can quote as recent examples.",
      },
      {
        q: "Are there national 5 modern studies model answers?",
        a: "The marking instructions published with every past paper show what earns marks. This guide also has two example answers, a 4 mark describe and a 6 mark explain, written to show the shape markers look for.",
      },
    ],
    sourceIds: [
      "qs-n5-modern-studies-spec",
      "qs-n5-modern-studies-sqp",
      "qs-n5-modern-studies-cat",
      "qs-n5-modern-studies-report-2025",
      "qs-exam-timetable-2027",
      "sp-open-data-msps",
      "scottish-parliament-devolved-powers",
      "sg-poverty-2026",
      "ecp",
      "jrf-poverty-in-scotland-2026",
      "free-school-meals-2026",
      "recorded-crime-2025-26-dishonesty",
      "sgs-recorded-crime",
      "ons-crime-england-wales-2026",
    ],
  },
  {
    slug: "higher-modern-studies",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-higher-modern-studies.webp",
      alt: "Notebook and documents beside a Scottish Parliament exterior silhouette",
      caption: "Notebook and documents beside a Scottish Parliament exterior silhouette.",
    },
    title: "Higher modern studies: the course, the skills and the evidence",
    seoTitle: "Higher Modern Studies: Course Guide, Skills and Real Data",
    description: `Higher Modern Studies is ${HIGHER_MODERN_STUDIES.totalMarks} marks: Paper 1 (${HIGHER_MODERN_STUDIES.paper1.marks}), Paper 2 (${HIGHER_MODERN_STUDIES.paper2.marks}) and a ${HIGHER_MODERN_STUDIES.assignment.marks} mark assignment. How each is marked, plus real Scottish evidence.`,
    standfirst:
      "How Paper 1, Paper 2 and the assignment are marked, what the 2026 examiners flagged, and the latest Scottish evidence for each section.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "Higher", "Revision", "Exam skills"],
    readingMinutes: 7,
    quickAnswer: {
      label: "Higher Modern Studies marks",
      value: `${HIGHER_MODERN_STUDIES.totalMarks}`,
      unit: "marks in total",
      detail: `Paper 1 tests knowledge through essays, Paper 2 tests source skills, and the assignment tests your research. All three count towards one grade.`,
      rows: [
        { label: "Paper 1", value: `${HIGHER_MODERN_STUDIES.paper1.marks} marks, ${HIGHER_MODERN_STUDIES.paper1.duration}` },
        { label: "Paper 2", value: `${HIGHER_MODERN_STUDIES.paper2.marks} marks, ${HIGHER_MODERN_STUDIES.paper2.duration}` },
        { label: "Assignment", value: `${HIGHER_MODERN_STUDIES.assignment.marks} marks, ${HIGHER_MODERN_STUDIES.assignment.duration} to write up` },
        { label: "Exams in 2027", value: MODERN_STUDIES_EXAMS_2027.date },
      ],
      asOf: `Course specification ${HIGHER_MODERN_STUDIES.specVersion}`,
      source: HIGHER_MODERN_STUDIES.source,
    },
    toc: [
      { id: "assessment", label: "How Higher is assessed" },
      { id: "paper-1", label: "Paper 1: the essays" },
      { id: "paper-2", label: "Paper 2: source skills" },
      { id: "assignment", label: "The assignment" },
      { id: "evidence", label: "Evidence for each section" },
      { id: "bitesize", label: "BBC Bitesize and free help" },
      { id: "dates", label: "Dates and grade boundaries" },
    ],
    faq: [
      {
        q: "How many marks is Higher Modern Studies?",
        a: `${HIGHER_MODERN_STUDIES.totalMarks}. Paper 1 is worth ${HIGHER_MODERN_STUDIES.paper1.marks}, Paper 2 is worth ${HIGHER_MODERN_STUDIES.paper2.marks} and the assignment is worth ${HIGHER_MODERN_STUDIES.assignment.marks}.`,
      },
      {
        q: "Is BBC Bitesize higher modern studies enough to pass?",
        a: "It is a good free start and covers democracy, inequality, crime and the law and international issues. But markers reward recent, accurate examples, so learn each topic there and then add the latest Scottish figures.",
      },
      {
        q: "What is the difference between Paper 1 and Paper 2?",
        a: `Paper 1 is three essays worth ${HIGHER_MODERN_STUDIES.paper1.marks} marks in all, two of them worth 20 and one worth 12, testing knowledge, analysis and evaluation. Paper 2 is three source questions on conclusions, objectivity and reliability, worth ${HIGHER_MODERN_STUDIES.paper2.marks} marks in all.`,
      },
      {
        q: "When is the Higher Modern Studies exam in 2027?",
        a: `${MODERN_STUDIES_EXAMS_2027.date}. Paper 1 runs ${MODERN_STUDIES_EXAMS_2027.higherPaper1} and Paper 2 runs ${MODERN_STUDIES_EXAMS_2027.higherPaper2}.`,
      },
    ],
    sourceIds: [
      "qs-higher-modern-studies-spec",
      "qs-higher-past-papers",
      "qs-higher-modern-studies-cat",
      "qs-higher-modern-studies-report-2026",
      "qs-exam-timetable-2027",
      "sp-open-data-msps",
      "sg-poverty-2026",
      "jrf-poverty-in-scotland-2026",
      "nrs-drug-deaths-2025",
      "phs-child-poverty-impact",
      "audit-scotland-council-budgets-2026-27",
      "recorded-crime-2025-26-dishonesty",
    ],
  },
  {
    slug: "higher-modern-studies-past-papers",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-higher-modern-studies-past-papers.webp",
      alt: "Unmarked exam papers, pencils and a desk",
      caption: "Unmarked exam papers, pencils and a desk.",
    },
    title: "Higher modern studies past papers and practice questions",
    seoTitle: "Higher Modern Studies Past Papers and Practice Questions With Real Data",
    description: `Higher Modern Studies past papers for ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear} are free from Qualifications Scotland. Where they are, how to use them, and practice with real data.`,
    standfirst:
      "Where the official papers and marking instructions live now, how to use them properly, and three Paper 2 style questions built on real Scottish figures.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "Higher", "Past papers", "Practice questions"],
    readingMinutes: 7,
    quickAnswer: {
      label: "Higher Modern Studies past papers",
      value: `${MODERN_STUDIES_PAST_PAPERS.years}`,
      unit: `years of papers, ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear}`,
      detail: `Paper 1, Paper 2 and the marking instructions for every year are free on the Qualifications Scotland past papers page, still hosted on sqa.org.uk. Some ${MODERN_STUDIES_PAST_PAPERS.modifiedYears} papers are shorter, modified versions.`,
      rows: [
        { label: "Paper 1", value: `${HIGHER_MODERN_STUDIES.paper1.marks} marks, ${HIGHER_MODERN_STUDIES.paper1.duration}` },
        { label: "Paper 2", value: `${HIGHER_MODERN_STUDIES.paper2.marks} marks, ${HIGHER_MODERN_STUDIES.paper2.duration}` },
        { label: "Marking instructions", value: "Free, one set for each paper" },
        { label: "Practice on this page", value: "3 Paper 2 questions using real data" },
      ],
      asOf: "Checked 29 October 2026",
      source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.pastPapersHigher },
    },
    toc: [
      { id: "where", label: "Where the papers are" },
      { id: "use", label: "How to use them well" },
      { id: "question-types", label: "Question types and marks" },
      { id: "practice-conclusions", label: "Practice: conclusions" },
      { id: "practice-objectivity", label: "Practice: objectivity" },
      { id: "practice-reliability", label: "Practice: reliability" },
    ],
    faq: [
      {
        q: "Where can I find SQA past papers for Higher Modern Studies now?",
        a: `On the past papers page of the SQA website, which Qualifications Scotland still uses since it replaced SQA on ${QS_REPLACED_SQA}. Choose Modern Studies and Higher to see every paper from ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear}.`,
      },
      {
        q: "Are the Higher Modern Studies marking instructions free?",
        a: "Yes. A set of marking instructions sits beside every paper on the official past papers page, and you can download them all at once.",
      },
      {
        q: "Why are some 2022 and 2023 past papers labelled modified?",
        a: "They were changed because of Covid disruption, for example made shorter or given fewer marks. They are still useful for single questions, but they will not match the full exam.",
      },
      {
        q: "Are the practice questions on this page official?",
        a: "No. I wrote them in the style of Paper 2 using real Scottish figures, with hints on what a strong answer covers. For official questions and marking, use the past papers.",
      },
    ],
    sourceIds: [
      "qs-higher-past-papers",
      "qs-higher-modern-studies-spec",
      "qs-higher-modern-studies-report-2026",
      "nrs-drug-deaths-2025",
      "ecp",
      "sg-poverty-2026",
      "jrf-poverty-in-scotland-2026",
      "sgs-recorded-crime",
      "recorded-crime-2025-26-dishonesty",
    ],
  },
  {
    slug: "nat-5-modern-studies-past-papers",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-nat-5-modern-studies-past-papers.webp",
      alt: "Unmarked exam papers and a pencil on a school desk",
      caption: "Unmarked exam papers and a pencil on a school desk.",
    },
    title: "Nat 5 modern studies past papers and practice questions",
    seoTitle: "Nat 5 Modern Studies Past Papers and Practice Questions",
    description: `Download every Nat 5 Modern Studies past paper from ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear} with marking instructions, one tap each. Plus question types and real data practice.`,
    standfirst:
      "Where the official papers and marking instructions are, how to use them so they actually help, and two full source questions built on real Scottish figures.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "National 5", "Past papers", "Practice questions"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Nat 5 Modern Studies past papers",
      value: `${MODERN_STUDIES_PAST_PAPERS.years}`,
      unit: `years of papers, ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear}`,
      detail: `Every National 5 Modern Studies paper and its marking instructions from ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear} are on this page to download, one tap each. Some ${MODERN_STUDIES_PAST_PAPERS.modifiedYears} papers are modified versions.`,
      rows: [
        { label: "Exam", value: `${N5_MODERN_STUDIES.paper.marks} marks, ${N5_MODERN_STUDIES.paper.duration}` },
        { label: "Source questions", value: "3 in each paper, 10 marks each" },
        { label: "Download here", value: "Paper and marking instructions, every year" },
        { label: "Practice on this page", value: "2 full source questions using real data" },
      ],
      asOf: "Checked 29 October 2026",
      source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.pastPapersN5 },
    },
    toc: [
      { id: "where", label: "Download the papers" },
      { id: "use", label: "How to use a past paper" },
      { id: "question-types", label: "Question types and marks" },
      { id: "practice-knowledge", label: "Practice knowledge questions" },
      { id: "practice-conclusions", label: "Practice: conclusions" },
      { id: "practice-support-oppose", label: "Practice: support and oppose" },
    ],
    faq: [
      {
        q: "Where can I get modern studies nat 5 past papers?",
        a: `On the past papers page of the SQA website, which Qualifications Scotland still uses. Choose Modern Studies and National 5 for every paper and marking instruction from ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear}.`,
      },
      {
        q: "How many marks are the N5 Modern Studies source questions worth?",
        a: `Each one is worth 10 marks, and there is one at the end of each of the three sections, so 30 of the ${N5_MODERN_STUDIES.paper.marks} exam marks are for source skills.`,
      },
      {
        q: "Do Nat 5 Modern Studies past papers come with answers?",
        a: "They come with marking instructions, which explain how each question is marked and give examples of creditworthy points. They are free on the same page as the papers.",
      },
      {
        q: "Are the 2022 and 2023 papers the same as the real exam?",
        a: "Some are labelled modified because they were changed after Covid, for example made shorter. Use them for practice questions, and use a later paper for a full timed run.",
      },
    ],
    sourceIds: [
      "qs-n5-past-papers",
      "qs-n5-modern-studies-sqp",
      "qs-n5-modern-studies-spec",
      "qs-n5-modern-studies-report-2025",
      "sg-poverty-2026",
      "jrf-poverty-in-scotland-2026",
      "sgs-recorded-crime",
      "recorded-crime-2025-26-dishonesty",
      "ons-crime-england-wales-2026",
    ],
  },
  {
    slug: "advanced-higher-modern-studies",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-advanced-higher-modern-studies.webp",
      alt: "Unmarked research papers and a simple chart with no labels",
      caption: "Unmarked research papers and a simple chart with no labels.",
    },
    title: "Advanced higher modern studies: the course and where to find data",
    seoTitle: "Advanced Higher Modern Studies: Course Guide and Data Sources",
    description: `Advanced Higher Modern Studies is ${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks} marks: a ${ADVANCED_HIGHER_MODERN_STUDIES.paper.marks} mark exam and a ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.words.toLocaleString("en-GB")} word dissertation worth ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.marks}. The course, and data that holds up.`,
    standfirst:
      "How the exam and the dissertation are marked, and the official Scottish data worth using, with the weakness of each source spelled out.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "Advanced Higher", "Dissertation", "Research methods"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Advanced Higher Modern Studies marks",
      value: `${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks}`,
      unit: "marks in total",
      detail: `A ${ADVANCED_HIGHER_MODERN_STUDIES.paper.duration} exam worth ${ADVANCED_HIGHER_MODERN_STUDIES.paper.marks} marks (${ADVANCED_HIGHER_MODERN_STUDIES.paper.sharePct}% of the grade) and a project dissertation worth ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.marks} (${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.sharePct}%).`,
      rows: [
        { label: "Exam", value: `${ADVANCED_HIGHER_MODERN_STUDIES.paper.marks} marks, ${ADVANCED_HIGHER_MODERN_STUDIES.paper.duration}` },
        { label: "Dissertation", value: `${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.marks} marks, ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.words.toLocaleString("en-GB")} words` },
        { label: `Grade A in ${ADVANCED_HIGHER_MODERN_STUDIES.results.year}`, value: `${ADVANCED_HIGHER_MODERN_STUDIES.results.a} out of ${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks}` },
        { label: "Exam in 2027", value: `${MODERN_STUDIES_EXAMS_2027.date}, ${MODERN_STUDIES_EXAMS_2027.advancedHigher}` },
      ],
      asOf: `Course specification ${ADVANCED_HIGHER_MODERN_STUDIES.specVersion}`,
      source: ADVANCED_HIGHER_MODERN_STUDIES.source,
    },
    toc: [
      { id: "assessment", label: "How it is assessed" },
      { id: "exam", label: "The exam" },
      { id: "dissertation", label: "The dissertation" },
      { id: "data", label: "Where to find data" },
      { id: "research-methods", label: "Research methods examples" },
      { id: "results", label: "Results and the 2027 exam" },
    ],
    faq: [
      {
        q: "How long is the Advanced Higher Modern Studies dissertation?",
        a: `${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.words.toLocaleString("en-GB")} words, including your evaluation of research methods but not the contents page, bibliography, footnotes or appendices. Going more than ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.penaltyOverPct}% over brings a penalty.`,
      },
      {
        q: "How long is the Advanced Higher Modern Studies exam?",
        a: `${ADVANCED_HIGHER_MODERN_STUDIES.paper.duration}, for ${ADVANCED_HIGHER_MODERN_STUDIES.paper.marks} marks. You answer one section: two ${ADVANCED_HIGHER_MODERN_STUDIES.essayMarks} mark essays from a choice of three, plus a ${ADVANCED_HIGHER_MODERN_STUDIES.researchMethodsMarks} mark research methods question and a ${ADVANCED_HIGHER_MODERN_STUDIES.sourceTrustMarks} mark question on how trustworthy a source is.`,
      },
      {
        q: "Where can I find data for an Advanced Higher Modern Studies dissertation?",
        a: "Official statistics are the strongest base: Scottish Government poverty and crime statistics, National Records of Scotland, Audit Scotland and the Local Government Benchmarking Framework. Evaluate each one, because the weaknesses earn marks too.",
      },
      {
        q: "Can I choose my own dissertation title?",
        a: "Yes. Qualifications Scotland publishes an approved list of titles and a form for checking your own. Its 2026 course report said pupils who built their own titles often wrote insightful dissertations.",
      },
    ],
    sourceIds: [
      "qs-ah-modern-studies-spec",
      "qs-ah-modern-studies-cat",
      "qs-ah-modern-studies-report-2026",
      "qs-ah-past-papers",
      "qs-exam-timetable-2027",
      "jrf-poverty-in-scotland-2026",
      "sg-poverty-2026",
      "ecp",
      "nrs-drug-deaths-2025",
      "sgs-recorded-crime",
      "lgbf-family-groups",
      "audit-scotland-council-budgets-2026-27",
      "shs-council-perceptions-2024",
      "sp-open-data-msps",
    ],
  },
  {
    slug: "causes-of-poverty",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-causes-of-poverty.webp",
      alt: "A modest Scottish residential street and household essentials",
      caption: "A modest Scottish residential street and household essentials.",
    },
    title: "Causes of poverty: what the evidence shows in Scotland",
    seoTitle: "Causes of Poverty: What the Scottish Evidence Shows",
    description: `Poverty in Scotland has three main causes: pay from work, the cost of living and social security. ${scotlandPoverty.all.pct}% of people are in poverty. The evidence and the effects.`,
    standfirst:
      "Not bad choices. Pay, rent and benefits, set out with the official Scottish figures, then what poverty does to health and to children.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Causes of poverty", "Child poverty", "Housing costs", "Modern Studies"],
    readingMinutes: 7,
    quickAnswer: {
      label: "Main causes of poverty in Scotland",
      value: "3",
      unit: "drivers: income from work, the cost of living and social security",
      detail: `Public Health Scotland and the Scottish Government group the causes into these three. In ${plainPeriod(scotlandPoverty.period)}, ${scotlandPoverty.all.pct}% of people in Scotland, ${scotlandPoverty.all.count.toLocaleString("en-GB")}, were in poverty after housing costs.`,
      rows: [
        { label: "Income from work", value: `${scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in poverty live in a working household` },
        { label: "Cost of living", value: `${JRF_SCOTLAND_2026.tenure.find((row) => row.home === "Private renters")?.pct}% of private renters are in poverty` },
        { label: "Social security", value: `${JRF_SCOTLAND_2026.universalCreditFamiliesPct}% of people in families on Universal Credit are in poverty` },
      ],
      asOf: plainPeriod(scotlandPoverty.period),
      source: JRF_SCOTLAND_2026.source,
    },
    toc: [
      { id: "drivers", label: "The three drivers" },
      { id: "work", label: "Income from work" },
      { id: "costs", label: "The cost of living" },
      { id: "security", label: "Social security" },
      { id: "who", label: "Who is most at risk" },
      { id: "myths", label: "What the evidence does not support" },
      { id: "effects", label: "Effects of poverty" },
      { id: "childhood", label: "Effects of childhood poverty" },
      { id: "answers", label: "Using this in an answer" },
    ],
    faq: [
      {
        q: "What are the main causes of poverty in Scotland?",
        a: "Three drivers: not enough income from work, because of low pay or too few hours; high costs, above all housing; and social security that does not pay enough to keep families out of poverty.",
      },
      {
        q: "What is the impact of poverty on families in Scotland?",
        a: `It leaves many families far short: people in poverty had incomes ${JRF_SCOTLAND_2026.averageGapPct}% below the poverty line on average. Public Health Scotland says it strains parents' mental health and relationships, raises the risk of debt, and harms children's health and development.`,
      },
      {
        q: "What are the effects of childhood poverty?",
        a: "Public Health Scotland says the harm starts before birth and builds up over a lifetime, affecting children's health, development, behaviour and how they do at school, and it can pass from one generation to the next.",
      },
      {
        q: "Is poverty caused by people not working?",
        a: `Mostly not. ${scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in poverty in Scotland live in a household where someone works. Low pay, short hours and high rent keep many working families below the line.`,
      },
      {
        q: "Does poverty affect health?",
        a: "Yes. In 2024 the drug death rate in Scotland's most deprived areas was more than ten times the rate in the least deprived, and Public Health Scotland finds poorer children have worse general health and mental wellbeing.",
      },
    ],
    sourceIds: [
      "phs-child-poverty-drivers",
      "phs-child-poverty-impact",
      "phs-child-poverty-statement-2025",
      "jrf-poverty-in-scotland-2026",
      "sg-poverty-2026",
      "ecp",
      "nrs-drug-deaths-2025",
    ],
  },
  {
    slug: "who-is-my-msp",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-who-is-my-msp.webp",
      alt: "Scottish Parliament exterior and an unmarked folded map of Scotland",
      caption: "Scottish Parliament exterior and an unmarked folded map of Scotland.",
    },
    title: "Who is my MSP? Find your MSP and MP by postcode",
    seoTitle: "Who Is My MSP? Find Your MSP and MP by Postcode",
    description: `Every address in Scotland has ${SCOTTISH_PARLIAMENT.perPerson} MSPs: 1 constituency MSP and ${SCOTTISH_PARLIAMENT.regionalPerRegion} regional MSPs, plus 1 MP. Put in your postcode to see their names and emails.`,
    standfirst:
      "One constituency MSP, seven regional MSPs and an MP. Here's how to find all of them from your postcode, and which one to go to with what.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "take-action",
    tags: ["MSP", "Scottish Parliament", "MP", "Find your representative"],
    readingMinutes: 4,
    quickAnswer: {
      label: "Who is my MSP?",
      value: String(SCOTTISH_PARLIAMENT.perPerson),
      unit: "MSPs for every address",
      detail:
        "One constituency MSP for your local area and seven regional MSPs for the wider region, and all of them represent you. Put your postcode into the finder below to see their names, parties and emails, along with your MP.",
      rows: [
        { label: "Constituency MSPs", value: `${SCOTTISH_PARLIAMENT.constituencyMsps} in Scotland, 1 for you` },
        { label: "Regional MSPs", value: `${SCOTTISH_PARLIAMENT.regionalMsps} in Scotland, ${SCOTTISH_PARLIAMENT.regionalPerRegion} for you` },
        { label: "MSPs in total", value: String(TOTAL_MSPS) },
        { label: "Scottish Parliament phone", value: `${SCOTTISH_PARLIAMENT.phone}, or free on ${SCOTTISH_PARLIAMENT.freephone}` },
      ],
      asOf: `Elected ${SCOTTISH_PARLIAMENT.elected}`,
      source: SCOTTISH_PARLIAMENT.source,
    },
    toc: [
      { id: "postcode", label: "Who is my MSP by postcode" },
      { id: "two-kinds", label: "Constituency and regional MSPs" },
      { id: "regions", label: "MSP for my area" },
      { id: "contact", label: "How to contact my MSP" },
      { id: "mp-or-msp", label: "MSP or MP: who to ask" },
    ],
    faq: [
      {
        q: "Who is my MSP by postcode?",
        a: "Put your postcode into the finder on this page. It shows your constituency MSP, your seven regional MSPs and your MP, with their email addresses, from the Scottish Parliament's and the UK Parliament's own records.",
      },
      {
        q: "How do I find my MSP?",
        a: `The quickest way is by postcode. If you already know your constituency or region, the MSP directory lists all ${TOTAL_MSPS} MSPs by area.`,
      },
      {
        q: "How many MSPs do I have?",
        a: `You have ${SCOTTISH_PARLIAMENT.perPerson}: one constituency MSP for your local area and ${SCOTTISH_PARLIAMENT.regionalPerRegion} regional MSPs for the wider region. All of them represent you.`,
      },
      {
        q: "Can I contact a regional MSP instead of my constituency MSP?",
        a: "Yes. The Scottish Parliament says you can contact either type of MSP about any issue it deals with. You don't need to say why you chose them.",
      },
      {
        q: "What is the Scottish Parliament phone number?",
        a: `${SCOTTISH_PARLIAMENT.phone}, or free on ${SCOTTISH_PARLIAMENT.freephone}. Calls are answered ${SCOTTISH_PARLIAMENT.hours}.`,
      },
    ],
    sourceIds: ["sp-about-msps", "sp-contact-us", "sp-open-data-msps", "scottish-parliament-devolved-powers"],
  },
  {
    slug: "who-is-my-local-councillor-by-postcode",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-who-is-my-local-councillor-by-postcode.webp",
      alt: "A Scottish local council building and an unmarked street map",
      caption: "A Scottish local council building and an unmarked street map.",
    },
    title: "Who is my local councillor by postcode?",
    seoTitle: "Who Is My Local Councillor by Postcode? Find Your Councillors",
    description: `Most homes in Scotland have 3 or 4 councillors, not 1. Use your postcode to find your council, then every councillor for your ward. All ${COUNCILLOR_TOTALS.councils} councils listed.`,
    standfirst:
      "Scotland elects councillors in groups, so you almost certainly have more than one. Here's how to find them all from your postcode, and what they can help with.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "take-action",
    tags: ["Councillors", "Local council", "Wards", "Council elections 2027"],
    readingMinutes: 4,
    quickAnswer: {
      label: "Who is my local councillor?",
      value: "3 or 4",
      unit: "councillors for most wards",
      detail:
        "Scotland elects councillors in groups, so most homes have three or four, and every one of them represents you. Find your council with the postcode box below, then use its councillor finder in the table.",
      rows: [
        { label: "Councils", value: String(COUNCILLOR_TOTALS.councils) },
        { label: "Wards", value: COUNCILLOR_TOTALS.wards.toLocaleString("en-GB") },
        { label: "Councillors", value: COUNCILLOR_TOTALS.councillors.toLocaleString("en-GB") },
        { label: "Next council election", value: LOCAL_ELECTION_2027.date },
      ],
      asOf: "Wards in use since the May 2022 election",
      source: COUNCILLOR_SOURCE,
    },
    toc: [
      { id: "postcode", label: "Find my councillor by postcode" },
      { id: "councils", label: "Councillors in my area" },
      { id: "who", label: "Who are my councillors?" },
      { id: "what", label: "What a councillor can help with" },
      { id: "contact", label: "How to contact my local councillor" },
      { id: "election", label: "The next council election" },
    ],
    faq: [
      {
        q: "Who is my local councillor by postcode?",
        a: "Put your postcode into the box on this page to find your council, then open that council's councillor finder from the table. Most take your postcode or street and show your ward and every councillor for it.",
      },
      {
        q: "Who are my councillors?",
        a: "The councillors elected for your ward. Almost every ward in Scotland elects three or four, and all of them represent you equally. Some island wards elect one or two.",
      },
      {
        q: "How many councillors are there in Scotland?",
        a: `${COUNCILLOR_TOTALS.councillors.toLocaleString("en-GB")} councillors across ${COUNCILLOR_TOTALS.wards} wards in ${COUNCILLOR_TOTALS.councils} councils, the numbers in use since the May 2022 election.`,
      },
      {
        q: "Can I contact any of my councillors?",
        a: "Yes. Every councillor for your ward represents you, whichever party they are from and whether or not you voted for them. You can contact one, some or all of them.",
      },
      {
        q: "When are the next council elections in Scotland?",
        a: `${LOCAL_ELECTION_2027.date}, in all ${COUNCILLOR_TOTALS.councils} councils at once.`,
      },
    ],
    sourceIds: ["boundaries-scotland-wards-1995-onwards", "emb-local-elections-2027", "council-councillor-finders"],
  },
  {
    slug: "life-expectancy-glasgow",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-life-expectancy-glasgow.webp",
      alt: "Two contrasting Glasgow residential streets",
      caption: "Two contrasting Glasgow residential streets.",
    },
    title: "Life expectancy Glasgow: the figures and the gap",
    seoTitle: "Life Expectancy Glasgow: How Long People Live, Area by Area",
    description: `Life expectancy in Glasgow is ${years(LIFE_EXPECTANCY_LATEST.glasgow.men)} years for men and ${years(LIFE_EXPECTANCY_LATEST.glasgow.women)} for women (${LIFE_EXPECTANCY_LATEST.period}), the lowest in Scotland. Inside the city, the gap for men is ${years(LIFE_EXPECTANCY.glasgowByDeprivation.rows[4].men - LIFE_EXPECTANCY.glasgowByDeprivation.rows[0].men)} years.`,
    standfirst:
      "Glasgow has the lowest life expectancy of any council in Scotland. But where you live inside the city matters far more than living in Glasgow at all.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Life expectancy", "Glasgow", "Health inequality", "Deprivation"],
    readingMinutes: 5,
    quickAnswer: {
      label: `Life expectancy in Glasgow, ${LIFE_EXPECTANCY_LATEST.period}`,
      value: years(LIFE_EXPECTANCY_LATEST.glasgow.men),
      unit: "years for men",
      detail: `Women in Glasgow can expect ${years(LIFE_EXPECTANCY_LATEST.glasgow.women)} years. Both are the lowest of Scotland's 32 council areas, ${years(LIFE_EXPECTANCY_LATEST.scotland.men - LIFE_EXPECTANCY_LATEST.glasgow.men)} and ${years(LIFE_EXPECTANCY_LATEST.scotland.women - LIFE_EXPECTANCY_LATEST.glasgow.women)} years below Scotland as a whole.`,
      rows: [
        { label: "Glasgow, men", value: `${years(LIFE_EXPECTANCY_LATEST.glasgow.men)} years` },
        { label: "Glasgow, women", value: `${years(LIFE_EXPECTANCY_LATEST.glasgow.women)} years` },
        { label: "Scotland, men", value: `${years(LIFE_EXPECTANCY_LATEST.scotland.men)} years` },
        { label: "Scotland, women", value: `${years(LIFE_EXPECTANCY_LATEST.scotland.women)} years` },
      ],
      asOf: `${LIFE_EXPECTANCY_LATEST.period}, published ${LIFE_EXPECTANCY.published}`,
      source: LIFE_EXPECTANCY.source,
    },
    toc: [
      { id: "average", label: "Average life expectancy" },
      { id: "men", label: "Glasgow male life expectancy" },
      { id: "gap", label: "The gap inside Glasgow" },
      { id: "councils", label: "Every council compared" },
      { id: "at-65", label: "At 65" },
    ],
    faq: [
      {
        q: "What is the average life expectancy in Glasgow?",
        a: `${years(LIFE_EXPECTANCY_LATEST.glasgow.men)} years for men and ${years(LIFE_EXPECTANCY_LATEST.glasgow.women)} years for women, for ${LIFE_EXPECTANCY_LATEST.period}, from National Records of Scotland. NRS does not publish a single figure for men and women together.`,
      },
      {
        q: "What is Glasgow male life expectancy?",
        a: `${years(LIFE_EXPECTANCY_LATEST.glasgow.men)} years in ${LIFE_EXPECTANCY_LATEST.period}, up from ${years(LIFE_EXPECTANCY.trend[LIFE_EXPECTANCY.trend.length - 2].glasgow.men)} in ${LIFE_EXPECTANCY.trend[LIFE_EXPECTANCY.trend.length - 2].period}. It is ${years(LIFE_EXPECTANCY_LATEST.scotland.men - LIFE_EXPECTANCY_LATEST.glasgow.men)} years below Scotland and the lowest of any council area.`,
      },
      {
        q: "Is Glasgow's life expectancy the lowest in Scotland?",
        a: `Yes. In ${LIFE_EXPECTANCY_LATEST.period} Glasgow City had the lowest life expectancy of Scotland's 32 council areas for both men and women, and ${councilSearchName(LIFE_EXPECTANCY.councils[LIFE_EXPECTANCY.councils.length - 1].slug)} the highest.`,
      },
      {
        q: "How big is the life expectancy gap inside Glasgow?",
        a: `Over ${LIFE_EXPECTANCY.glasgowByDeprivation.period}, men in Glasgow's most deprived fifth of neighbourhoods could expect ${years(LIFE_EXPECTANCY.glasgowByDeprivation.rows[0].men)} years, against ${years(LIFE_EXPECTANCY.glasgowByDeprivation.rows[4].men)} in the least deprived fifth. For women it was ${years(LIFE_EXPECTANCY.glasgowByDeprivation.rows[0].women)} against ${years(LIFE_EXPECTANCY.glasgowByDeprivation.rows[4].women)}.`,
      },
    ],
    sourceIds: ["nrs-life-expectancy-2022-2024", "nrs-life-expectancy-local-simd-2026"],
  },
  {
    slug: "unemployment-scotland",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-unemployment-scotland.webp",
      alt: "A quiet Scottish high street with a closed shop and unmarked job application",
      caption: "A quiet Scottish high street with a closed shop and unmarked job application.",
    },
    title: "Unemployment Scotland: the rate, the trend and your council",
    seoTitle: "Unemployment Scotland 2026: Rate, Trend and Council Figures",
    description: `Scotland's unemployment rate was ${pct(LABOUR_MARKET_LATEST.rate)} in ${LABOUR_MARKET_LATEST.period}, against ${pct(LABOUR_MARKET.uk.rate)} for the UK. The trend, youth unemployment and the rate for all 32 councils.`,
    standfirst:
      "The latest official rate, what it actually counts, how it has moved since 2008, and the estimate for every council in Scotland.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "money-and-bills",
    tags: ["Unemployment", "Labour market", "Youth unemployment", "Scotland statistics"],
    readingMinutes: 5,
    quickAnswer: {
      label: `Scotland unemployment rate, ${LABOUR_MARKET_LATEST.period}`,
      value: pct(LABOUR_MARKET_LATEST.rate),
      unit: "aged 16 and over",
      detail: `About ${(Math.round(LABOUR_MARKET.scotland.unemployed / 1000) * 1000).toLocaleString("en-GB")} people. The UK rate for the same months was ${pct(LABOUR_MARKET.uk.rate)}. Scotland's rate is ${pointsChange(LABOUR_MARKET_LATEST.rateChangeOnYear)} on a year earlier.`,
      rows: [
        { label: "UK rate", value: pct(LABOUR_MARKET.uk.rate) },
        { label: "Scotland employment rate, 16 to 64", value: pct(LABOUR_MARKET_LATEST.employment) },
        { label: "Youth unemployment, 16 to 24", value: `${pct(ANNUAL_POPULATION_SURVEY.scotland.youth)} (${ANNUAL_POPULATION_SURVEY.period})` },
        { label: "Highest council", value: `${councilSearchName(COUNCIL_UNEMPLOYMENT.rows[0].slug)}, ${pct(COUNCIL_UNEMPLOYMENT.rows[0].rate)}` },
      ],
      asOf: `${LABOUR_MARKET_LATEST.period}, published ${LABOUR_MARKET.published}`,
      source: LABOUR_MARKET.source,
    },
    toc: [
      { id: "rate", label: "Scotland unemployment rate" },
      { id: "trend", label: "The trend since 2008" },
      { id: "employment", label: "Scotland employment rate" },
      { id: "youth", label: "Youth unemployment" },
      { id: "councils", label: "Unemployment by council" },
      { id: "claimant", label: "The claimant count" },
    ],
    faq: [
      {
        q: "What is the unemployment rate in Scotland?",
        a: `${pct(LABOUR_MARKET_LATEST.rate)} for people aged 16 and over in ${LABOUR_MARKET_LATEST.period}, published by the ONS on ${LABOUR_MARKET.published}. The UK rate was ${pct(LABOUR_MARKET.uk.rate)}.`,
      },
      {
        q: "Is unemployment higher in Scotland than the UK?",
        a: `Not at the moment. Scotland's ${pct(LABOUR_MARKET_LATEST.rate)} is below the UK's ${pct(LABOUR_MARKET.uk.rate)} for ${LABOUR_MARKET_LATEST.period}, although Scotland's rate is ${pointsChange(LABOUR_MARKET_LATEST.rateChangeOnYear)} on a year earlier while the UK's is ${pointsChange(LABOUR_MARKET.uk.changeOnYear)}.`,
      },
      {
        q: "What is youth unemployment in Scotland?",
        a: `${pct(ANNUAL_POPULATION_SURVEY.scotland.youth)} of 16 to 24 year olds who were working or looking for work, in ${ANNUAL_POPULATION_SURVEY.period}, against ${pct(ANNUAL_POPULATION_SURVEY.uk.youth)} for the UK. Students who are not looking for work are not counted.`,
      },
      {
        q: "Which council has the highest unemployment in Scotland?",
        a: `${councilSearchName(COUNCIL_UNEMPLOYMENT.rows[0].slug)}, at an estimated ${pct(COUNCIL_UNEMPLOYMENT.rows[0].rate)} in ${COUNCIL_UNEMPLOYMENT.period}, followed by ${councilSearchName(COUNCIL_UNEMPLOYMENT.rows[1].slug)} at ${pct(COUNCIL_UNEMPLOYMENT.rows[1].rate)}.`,
      },
      {
        q: "What is the employment rate in Scotland?",
        a: `${pct(LABOUR_MARKET_LATEST.employment)} of people aged 16 to 64 were in work in ${LABOUR_MARKET_LATEST.period}, against ${pct(LABOUR_MARKET.uk.employment)} for the UK.`,
      },
    ],
    sourceIds: [
      "ons-regional-labour-market-oct-2026",
      "ons-hi11-scotland-oct-2026",
      "nomis-aps-jul-2025-jun-2026",
      "nomis-model-unemployment-2026",
      "nomis-claimant-count-sep-2026",
    ],
  },
  {
    slug: "crime-rate-glasgow",
    guideImage: true,
    image: {
      src: "/images/editorial/guide-crime-rate-glasgow.webp",
      alt: "Glasgow street at dusk, ordinary buildings",
      caption: "Glasgow street at dusk, ordinary buildings.",
    },
    title: "Crime rate Glasgow: what the police figures show",
    seoTitle: "Crime Rate Glasgow: Recorded Crime by Type and Year",
    description: `Glasgow's crime rate was ${GLASGOW_CRIME.glasgow.rate} crimes per 10,000 people in ${GLASGOW_CRIME.year}, against ${GLASGOW_CRIME.scotland.rate} for Scotland. Crime by type, year by year, and what the rate leaves out.`,
    standfirst:
      "Glasgow records more crime per resident than anywhere in Scotland except Dundee. Here's what that's made of, how it has changed since the 1990s and what the rate doesn't tell you.",
    date: "2026-10-29",
    checked: "2026-10-29",
    category: "poverty-explained",
    tags: ["Glasgow crime", "Crime statistics", "Recorded crime", "Police Scotland"],
    readingMinutes: 5,
    quickAnswer: {
      label: `Crime rate Glasgow, ${GLASGOW_CRIME.year}`,
      value: GLASGOW_CRIME.glasgow.rate.toLocaleString("en-GB"),
      unit: "recorded crimes per 10,000 people",
      detail: `Scotland's rate was ${GLASGOW_CRIME.scotland.rate}. Only Dundee was higher. Police recorded ${GLASGOW_CRIME.glasgow.crimes.toLocaleString("en-GB")} crimes in Glasgow City, up ${changePct(GLASGOW_CRIME_PREVIOUS.glasgow, GLASGOW_CRIME.glasgow.crimes)}% on the year before.`,
      rows: [
        { label: "Crimes recorded in Glasgow", value: GLASGOW_CRIME.glasgow.crimes.toLocaleString("en-GB") },
        { label: "Scotland rate", value: `${GLASGOW_CRIME.scotland.rate} per 10,000` },
        { label: `Change on ${GLASGOW_CRIME_PREVIOUS.year}`, value: `up ${changePct(GLASGOW_CRIME_PREVIOUS.glasgow, GLASGOW_CRIME.glasgow.crimes)}%` },
        { label: `Glasgow rate in ${GLASGOW_CRIME.history[0].year}`, value: `${GLASGOW_CRIME.history[0].glasgowRate.toLocaleString("en-GB")} per 10,000` },
      ],
      asOf: "April 2025 to March 2026",
      source: GLASGOW_CRIME.source,
    },
    toc: [
      { id: "rate", label: "Glasgow against Scotland" },
      { id: "types", label: "Crime stats by type" },
      { id: "years", label: "Crime by year" },
      { id: "caveats", label: "What the rate leaves out" },
      { id: "local", label: "The local police reports" },
    ],
    faq: [
      {
        q: "What is the crime rate in Glasgow?",
        a: `${GLASGOW_CRIME.glasgow.rate} recorded crimes per 10,000 people in ${GLASGOW_CRIME.year}, against ${GLASGOW_CRIME.scotland.rate} for Scotland. Police recorded ${GLASGOW_CRIME.glasgow.crimes.toLocaleString("en-GB")} crimes in Glasgow City that year.`,
      },
      {
        q: "Does Glasgow have the highest crime rate in Scotland?",
        a: `No. Dundee had the highest recorded crime rate in ${GLASGOW_CRIME.year}. Glasgow was second, at ${GLASGOW_CRIME.glasgow.rate} per 10,000.`,
      },
      {
        q: "Is crime going up in Glasgow?",
        a: `It rose ${changePct(GLASGOW_CRIME_PREVIOUS.glasgow, GLASGOW_CRIME.glasgow.crimes)}% in ${GLASGOW_CRIME.year}, to ${GLASGOW_CRIME.glasgow.crimes.toLocaleString("en-GB")} crimes. Over the longer run it has fallen a lot: in ${GLASGOW_CRIME.history[0].year} the city recorded ${GLASGOW_CRIME.history[0].glasgow.toLocaleString("en-GB")}.`,
      },
      {
        q: "Where do crime stats for Glasgow come from?",
        a: "The official figures are the Scottish Government's Recorded Crime in Scotland statistics, published each year for every council. Police Scotland also reports quarterly figures for the city to the Safe Glasgow Partnership.",
      },
    ],
    sourceIds: [
      "sg-recorded-crimes-offences-open-data",
      "recorded-crime-scotland-2025-26",
      "sgs-recorded-crime",
      "sg-recorded-crime-ye-june-2026",
      "ps-glasgow-q3-2024-25",
      "ps-glasgow-q2-2025-26",
      "spa-performance-q4-2024-25",
    ],
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

/** Thin category pages stay out of search until they curate at least three articles. */
export function isPostCategoryIndexable(slug: string) {
  return postsInCategory(slug).length >= 3;
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
