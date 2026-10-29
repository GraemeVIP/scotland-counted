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
    colorOnDark: "#ff8b75",
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
  /** ISO date last checked or revised. */
  updated?: string;
  category: PostCategorySlug;
  tags: string[];
  readingMinutes: number;
  /** The answer box that opens the page. Money, council tax and benefit guides have one. */
  quickAnswer?: QuickAnswerData;
  /** Optional: a guide without a photograph gets the Saltire cover instead. */
  image?: {
    src: string;
    alt: string;
    caption: string;
    aspect?: "landscape" | "wide" | "video";
    objectPosition?: string;
    /** Replaces the default "AI generated illustration." credit, e.g. for a data graphic. */
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
    title: "Scotland's shoplifting rate overtakes England and Wales as convictions nearly halve",
    seoTitle: "Shoplifting in Scotland Hits Record High, Overtaking England",
    description:
      "Shoplifting in Scotland hit 53,369 in 2025-26, a record, and now outstrips England and Wales. Convictions nearly halved. See the data for all 32 councils.",
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
      src: "/images/editorial/shoplifting-scotland-record-high.png",
      cardSrc: "/images/editorial/shoplifting-scotland-record-high-card.png",
      alt: "Data graphic showing recorded shoplifting per 1,000 people in Scotland rising above England and Wales in 2025-26, at 9.6 against 8.2",
      caption:
        "Scotland had less shoplifting per person than England and Wales before Covid. In 2025-26 it had 17% more.",
      creditLabel: "Scotland Counted data graphic.",
      aspect: "wide",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/shoplifting-scotland-record-high.png",
      width: 1800,
      height: 900,
      type: "image/png",
    },
    toc: [
      { id: "short-answer", label: "Four things the figures show" },
      { id: "uk", label: "Scotland has overtaken England and Wales" },
      { id: "record", label: "A record, and almost all shoplifting" },
      { id: "caught", label: "Fewer shoplifters convicted" },
      { id: "councils", label: "Edinburgh has overtaken Glasgow" },
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
    title: "Glasgow sex crimes went up 28%. Was it migrants?",
    seoTitle: "Glasgow Sexual Assault Rise: Were Migrants Behind the 28%?",
    description:
      "Glasgow's recorded sexual assaults rose 28% and rapes 41% in 2024. We checked police, census and Home Office records to see whether migrants were behind it. Every number linked.",
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
      src: "/images/editorial/glasgow-sexual-assault-rise-migration-investigation-2026.webp",
      alt: "Scotland Counted investigation graphic with Glasgow's skyline, a map, and illustrated police and Home Office documents, asking whether migration explains the 28% rise in recorded sexual assaults",
      caption:
        "The 28.1% figure is for recorded sexual assaults in Glasgow City: 499 in April–December 2023 and 639 in the same months of 2024. The pictured chart and documents are illustrative.",
      creditLabel: "Scotland Counted editorial illustration.",
      aspect: "video",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/glasgow-sexual-assault-rise-migration-investigation-2026.webp",
      width: 1672,
      height: 941,
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
    description:
      "East Renfrewshire comes first in our 53-measure ranking. See all 32 councils, the like for like list, what residents said and every number used.",
    standfirst:
      "East Renfrewshire comes first in our new ranking of all 32 Scottish councils. East Lothian is second and Edinburgh third. But the like for like list and resident survey tell a more surprising story.",
    date: "2026-08-16",
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
      src: "/images/editorial/best-performing-councils-scotland-2026.png",
      alt: "Data graphic showing East Renfrewshire first in the Scotland Counted council performance index, followed by East Lothian, Edinburgh, East Dunbartonshire and South Ayrshire",
      caption:
        "East Renfrewshire is the clear leader. But the exact order moves when we change the rules, so we show the usual range for every council.",
      creditLabel: "Scotland Counted data graphic.",
      objectPosition: "center",
    },
    shareImage: {
      src: "/images/editorial/best-performing-councils-scotland-2026.png",
      width: 1800,
      height: 900,
      type: "image/png",
    },
    toc: [
      { id: "answer", label: "The answer in four numbers" },
      { id: "winner", label: "Why East Renfrewshire wins" },
      { id: "uncertainty", label: "Does the winner change?" },
      { id: "all-councils", label: "Every council ranked" },
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
      {
        q: "Which is the best performing council in Scotland?",
        a: "East Renfrewshire comes first in Scotland Counted's 2026 council ranking. It is number one for services and results and stayed first in all ten extra checks. We built the ranking from 53 official figures. It is not a government award.",
      },
      {
        q: "Which Scottish council do residents rate most highly?",
        a: "Shetland Islands comes first in the separate resident survey, averaging 52.1% across five questions in the 2024 Scottish Household Survey. Only a few hundred people answered in each area, so tiny gaps may be down to chance.",
      },
      {
        q: "Does the ranking measure the best place to live in Scotland?",
        a: "No. It measures how councils perform, not every reason a place is good to live. Poverty, crime, health, housing and loneliness are shown separately. That stops richer areas automatically looking like better run councils.",
      },
      {
        q: "How were Scottish councils ranked?",
        a: "We used 53 official figures, grouped into 29 topics. Services and results count for 40%, what residents said 25%, how the council is run 20%, value for money 10% and council emissions 5%. We then changed the rules 10,000 sensible ways to see how much the order moved.",
      },
      {
        q: "Which council performs best against similar councils?",
        a: "East Renfrewshire stays first and East Lothian second in the like for like list. Inverclyde jumps from 12th across Scotland to third against councils facing similar conditions.",
      },
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
    description:
      "Operation Branchform timeline covering SNP referendum donations, Peter Murrell's £400,310.65 embezzlement, Nicola Sturgeon's status and ongoing inquiries.",
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
      src: "/images/editorial/snp-money-timeline-hero.webp",
      alt: "An editorial collage of a long paper trail leading through folders and receipts towards a courthouse and an unbranded white motorhome",
      caption:
        "The story began with questions about referendum donations. The court case ultimately proved a different, 12 year course of embezzlement from the SNP's main account.",
      objectPosition: "center 48%",
    },
    shareImage: {
      src: "/images/editorial/snp-money-timeline-hero.webp",
      width: 1774,
      height: 887,
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
    slug: "drug-deaths-scotland-deprivation",
    title: "Drug deaths in Scotland: the deprivation divide",
    seoTitle: "Drug Deaths in Scotland and Deprivation | 2024 Data",
    description:
      "Scotland's drug death rate was 12 times higher in the most deprived areas in 2024. See why Glasgow's local rate was highest and what the data proves.",
    standfirst:
      "People in Scotland's most deprived areas had about 12 times the drug death rate of those in the least deprived areas in 2024. Glasgow had the highest council area rate over 2020–2024. The link is stark, but it needs to be read carefully.",
    date: "2026-08-08",
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
      src: "/images/editorial/drug-deaths-scotland-deprivation.webp",
      alt: "Abstract cut-paper illustration contrasting a dense Glasgow-style urban landscape with open areas through uneven data-like bands",
      caption:
        "A symbolic view of unequal places. It does not depict a real neighbourhood and the forms are not a chart of the published rates.",
      objectPosition: "center 50%",
    },
    toc: [
      { id: "short-answer", label: "The answer in three numbers" },
      { id: "deprivation", label: "The deprivation divide" },
      { id: "glasgow", label: "Where Glasgow sits" },
      { id: "fall", label: "Why a fall is not the end" },
      { id: "substances", label: "What the substance figures mean" },
      { id: "uk", label: "A safe UK comparison" },
      { id: "limits", label: "What the data cannot prove" },
    ],
    faq: [
      {
        q: "Are drug deaths linked to deprivation in Scotland?",
        a: "Yes, there is a very strong area level association. In 2024 the age standardised rate in Scotland's most deprived fifth was 47.3 deaths per 100,000, compared with 4.1 in the least deprived fifth. That does not prove every person who died was poor or that deprivation alone caused an individual death.",
      },
      {
        q: "Which Scottish council area has the highest drug death rate?",
        a: "Glasgow City had the highest age standardised drug misuse death rate in the National Records of Scotland comparison for 2020–2024: 41.1 deaths per 100,000. NRS combines five years because single year council rates can be unstable.",
      },
      {
        q: "Did drug deaths in Scotland fall in 2024?",
        a: "Yes. National Records of Scotland registered 1,017 drug misuse deaths, 155 fewer than in 2023 and the lowest annual count since 2017. The 2024 age standardised rate was still 3.6 times the rate in 2000.",
      },
      {
        q: "Can the substance figures be added together?",
        a: "No. More than one drug was implicated in 80% of Scotland's drug misuse deaths in 2024, and broad classes contain individual substances. The opioid, benzodiazepine, cocaine and other rows overlap.",
      },
    ],
    sourceIds: [
      "nrs-drug-deaths-2024",
      "sg-drugs-monitoring-2024-25",
      "sg-population-health-evidence",
    ],
  },
  {
    slug: "crisis-grant-acceptance-rates-scotland-councils",
    title: "Crisis Grant postcode gap: why councils award 52% to 89%",
    seoTitle: "Crisis Grant Acceptance Rates by Scottish Council | 2025/26",
    description:
      "Inverclyde awarded 89% of decided Crisis Grant applications in 2025/26. Midlothian awarded 52%. Compare all 32 councils and see what the gap proves.",
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
      {
        q: "Which Scottish council has the highest Crisis Grant award rate?",
        a: "Inverclyde had the highest published rate in 2025/26: 89% of decided Crisis Grant applications resulted in an award. Angus was next at 79% and Dundee City at 78%.",
      },
      {
        q: "Which Scottish council has the lowest Crisis Grant award rate?",
        a: "Midlothian had the lowest published rate in 2025/26 at 52%, followed by Highland at 53%. The Scotland rate was 65%.",
      },
      {
        q: "Does a lower award rate prove a council is refusing valid applications?",
        a: "No. The rate proves different outcomes, not whether the underlying applications were comparable or the decisions correct. Explaining the gap requires evidence about case mix, local administration, evidence demands, budget pressure, repeat applications and reviews.",
      },
      {
        q: "Can a refused Crisis Grant decision be reviewed?",
        a: "Yes. The statutory guidance says a first tier review is requested from the council, normally within 20 working days of the decision. A Crisis Grant review should be decided within two working days. A review cannot reduce or remove an award already made.",
      },
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
    title: "How council tax works in Scotland: discounts, help and appeals",
    seoTitle: "How Council Tax Works in Scotland | Help and Appeals",
    description:
      "How council tax works in Scotland, including who pays, water charges, discounts, Council Tax Reduction, band appeals, arrears and empty homes.",
    standfirst:
      "Your bill is a mix of a property band, your council's rate and Scottish Water charges. Here are the ten things that explain almost everything, followed by the exact sources.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Council tax", "Council tax bands", "Council Tax Reduction", "Scottish Water"],
    readingMinutes: 9,
    image: {
      src: "/images/editorial/council-tax-scotland-guide.webp",
      alt: "A Glasgow resident working through a council tax bill with a notebook and calculator at his kitchen table",
      caption:
        "The bill looks complicated because three different things are mixed together. Once they are separated, it becomes much easier to check.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-pays-for", label: "1. What council tax pays for" },
      { id: "who-pays", label: "2. Who has to pay" },
      { id: "band", label: "3. What your band means" },
      { id: "bill", label: "4. How the bill is worked out" },
      { id: "water", label: "5. Why water is on the bill" },
      { id: "discounts", label: "6. Discounts and exemptions" },
      { id: "reduction", label: "7. Help on a low income" },
      { id: "challenge", label: "8. Challenging a band" },
      { id: "moving", label: "9. Moving or missing payments" },
      { id: "empty-homes", label: "10. Empty and second homes" },
    ],
    faq: [
      {
        q: "How do I find my council tax band in Scotland?",
        a: "Look up the property free on the Scottish Assessors Association website. A postcode can find the council area, but it cannot prove the band because neighbouring homes can be different.",
      },
      {
        q: "Does Scottish council tax include water?",
        a: "The bill usually does. Your council collects separate water and waste water charges for Scottish Water. That is why a council tax only figure can be hundreds of pounds lower than the bill that arrives.",
      },
      {
        q: "Can Council Tax Reduction wipe out the whole bill?",
        a: "It can reduce the council tax part by up to 100%, depending on income and household circumstances. Water charges can remain, although an automatic water reduction of up to 35% may apply.",
      },
    ],
    sourceIds: [
      "council-tax-how-it-works",
      "council-tax-scotland",
      "scottish-water-2026",
      "council-tax-discounts",
      "council-tax-reduction-2026",
      "council-tax-band-proposals",
      "council-tax-arrears",
      "council-tax-empty-homes-2026",
    ],
  },
  {
    slug: "council-tax-rises-scotland-2026-27",
    title: "Council tax increase Scotland: every council's rise in 2026/27",
    seoTitle: "Council Tax Increase Scotland 2026/27: Every Council's Rise",
    description:
      "Every Scottish council's 2026/27 council tax rise compared with 2025/26. See the Band D cash and percentage increase, then check every band.",
    standfirst:
      "Every council raised its rate, but not by the same amount. This compares last year's council tax with this year's, and keeps Scottish Water's separate charge out of the council figures.",
    date: "2026-08-02",
    category: "money-and-bills",
    tags: ["Council tax rises", "Council tax 2026/27", "Council tax bands", "Scottish councils"],
    readingMinutes: 6,
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
      { id: "what-it-means", label: "What the percentages mean" },
      { id: "water", label: "Why water is separate" },
      { id: "check-your-bill", label: "Check your own bill" },
    ],
    faq: [],
    sourceIds: ["council-tax-scotland", "scottish-water-2026", "council-tax-how-it-works"],
  },
  {
    slug: "minimum-wage-take-home-pay-scotland-2026",
    title: "Minimum wage Scotland: what you earn in 2026 and 2027",
    seoTitle: "Minimum Wage Scotland 2026 and 2027: £12.71 to £13.21",
    description:
      "Minimum wage in Scotland is £12.71 an hour in 2026, rising to £13.21 in April 2027. See every age rate, yearly pay and take home pay after tax and NI.",
    standfirst:
      "£12.71 an hour sounds clear. A payslip is not. I have done the tax and National Insurance working for a 37.5 hour week so you can see what reaches the bank.",
    date: "2026-08-01",
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
      { id: "rates", label: "The 2026 hourly rates" },
      { id: "april-2027", label: "What changes in April 2027" },
      { id: "full-time", label: "What full time adds up to" },
      { id: "take-home", label: "What reaches the bank" },
      { id: "hours", label: "Why your pay may be lower" },
      { id: "enough", label: "Is it enough to live on?" },
    ],
    faq: [
      {
        q: "What is minimum wage in Scotland in 2026?",
        a: "From 1 April 2026 it is £12.71 an hour for workers aged 21 and over, £10.85 for ages 18 to 20, and £8 for under 18s and eligible apprentices.",
      },
      {
        q: "What will minimum wage be in Scotland in April 2027?",
        a: "From 1 April 2027 it rises to £13.21 an hour for workers aged 21 and over, £11.27 for ages 18 to 20, and £8.31 for under 18s and eligible apprentices. Scotland does not set its own rate.",
      },
      {
        q: "What is £12.71 an hour per year?",
        a: "At 37.5 paid hours every week for 52 weeks it is £24,784.50 gross a year. It is not a guaranteed annual salary: fewer paid hours or unpaid time off means less.",
      },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "scottish-tax-2026", "ni-rates-2026", "mis-2025"],
  },
  {
    slug: "real-living-wage-vs-minimum-wage-scotland",
    title: "Real Living Wage Scotland: £14.10 an hour against the legal minimum",
    seoTitle: "Real Living Wage Scotland 2026: £14.10 vs Minimum Wage",
    description:
      "The real Living Wage is now £14.10 an hour. The legal minimum is £12.71, rising to £13.21 in April 2027. Who sets each rate and what the gap is worth.",
    standfirst:
      "They sound almost identical. One is the legal floor an employer must pay. The other is a voluntary rate calculated from what ordinary life actually costs.",
    date: "2026-08-01",
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
      { id: "legal", label: "The legal minimum" },
      { id: "real", label: "The real Living Wage" },
      { id: "difference", label: "What the gap is worth" },
      { id: "check", label: "How to check your employer" },
    ],
    faq: [
      {
        q: "Is the real Living Wage compulsory in Scotland?",
        a: "No. The legal minimum wage is compulsory. The independently calculated real Living Wage is voluntary unless an employer has promised it in a contract or pay policy.",
      },
      {
        q: "How much more is the real Living Wage?",
        a: "The rate outside London is £14.10, announced on 15 October 2026. That is £1.39 an hour above the 2026 legal rate for workers aged 21 and over, or £2,710.50 gross a year at 37.5 hours a week. From April 2027, when the legal rate rises to £13.21, the gap is 89p an hour.",
      },
    ],
    sourceIds: ["minimum-wage-2026", "minimum-wage-2027", "real-living-wage", "mis-2025", "lpc-remit"],
  },
  {
    slug: "universal-credit-when-you-work-more-hours",
    title: "What happens to Universal Credit when you work more hours?",
    description:
      "Universal Credit does not stop when you work. See the 55% taper, the work allowance, and why an extra £1 of pay leaves only 45p of extra support.",
    standfirst:
      "Working more always leaves you with more total money. But the increase can feel painfully small because Universal Credit is reduced as earnings rise.",
    date: "2026-08-01",
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
      { id: "example", label: "A simple example" },
      { id: "changes", label: "Why payments jump around" },
    ],
    faq: [
      {
        q: "Do you lose Universal Credit when you start work?",
        a: "Not automatically. Your award is recalculated from the earnings reported in each monthly assessment period. It reduces as earnings rise and can reach zero if income is high enough.",
      },
      {
        q: "What is the Universal Credit taper rate?",
        a: "Universal Credit normally falls by 55p for each £1 of take home earnings counted above any work allowance. That means earnings still increase total household income.",
      },
    ],
    sourceIds: ["uc-earnings", "uc-what-youll-get", "minimum-wage-2026"],
  },
  {
    slug: "local-housing-allowance-rent-shortfall-scotland",
    title: "Local Housing Allowance in Scotland: why rent help falls short",
    seoTitle: "Local Housing Allowance Scotland | Rent Shortfalls",
    description:
      "Local Housing Allowance caps the Universal Credit help you get for private rent. Scotland's rates are frozen at 2024 levels while rents keep rising.",
    standfirst:
      "The benefit is meant to help with a cheaper local rent. In 2026 it is still using rates fixed from 2024, even though newer rent evidence is higher in most Scottish areas.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Local Housing Allowance", "Rent", "Universal Credit", "Housing"],
    readingMinutes: 6,
    image: {
      src: "/images/editorial/local-housing-allowance-rent-gap.webp",
      alt: "A prospective tenant checking a letting sheet and phone calculator inside a small Glasgow flat",
      caption:
        "Universal Credit does not promise to cover the rent written in a tenancy. For private renters, help is capped by area and bedroom need.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-is", label: "What Local Housing Allowance is" },
      { id: "frozen", label: "Why the rates are frozen" },
      { id: "glasgow", label: "The Greater Glasgow gap" },
      { id: "bedrooms", label: "Which bedroom rate applies" },
      { id: "help", label: "What to do about a shortfall" },
    ],
    faq: [
      {
        q: "Does Universal Credit pay all of your private rent?",
        a: "Not necessarily. The housing element is limited by Local Housing Allowance for your area and household size, or by your actual rent if that is lower.",
      },
      {
        q: "What is the one bedroom LHA rate in Greater Glasgow in 2026?",
        a: "It is £159.95 a week from April 2026 to March 2027, about £693 a month. The Scottish Government's 2025 advertised rent average for a one bedroom Greater Glasgow property was £865 a month.",
      },
    ],
    sourceIds: ["lha-2026", "sg-private-rents-2025", "discretionary-housing-payment"],
  },
  {
    slug: "energy-price-cap-scotland-2026-explained",
    title: "Energy price cap Scotland: what it means for your bills",
    seoTitle: "Energy Price Cap Scotland 2026: What It Means for Your Bills",
    description:
      "Ofgem's energy price cap is £1,862 from July to September 2026 for a typical use home. See what it really caps, why bills rose and how standing charges work.",
    standfirst:
      "£1,862 is not the most any household can pay. It is an illustration based on typical use. The cap controls the rates, so using more still costs more.",
    date: "2026-08-01",
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
      { id: "not-a-bill-cap", label: "Why it is not a bill cap" },
      { id: "rates", label: "The current rates" },
      { id: "standing", label: "The standing charge" },
      { id: "who", label: "Who the cap covers" },
      { id: "help", label: "If you cannot afford energy" },
    ],
    faq: [
      {
        q: "Is £1,862 the maximum energy bill in 2026?",
        a: "No. It is Ofgem's annual illustration for a typical use dual fuel household paying by Direct Debit. Your bill depends on the energy you use, your region, payment method and tariff.",
      },
      {
        q: "Does the energy price cap apply in Scotland?",
        a: "Yes. Ofgem's cap covers default domestic tariffs in England, Scotland and Wales. Regional unit rates and standing charges can differ.",
      },
    ],
    sourceIds: ["ofgem-cap-2026", "sg-cost-living-2025"],
  },
  {
    slug: "why-food-prices-stay-high-when-inflation-falls",
    title: "Why food prices are still high in Scotland",
    description:
      "Lower inflation does not mean cheaper food. It means prices are rising more slowly. UK food prices were 38.6% higher in November 2025 than five years earlier.",
    standfirst:
      "The news says inflation is down. The supermarket receipt says the weekly shop is still dear. Both can be true at the same time.",
    date: "2026-08-01",
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
      { id: "simple", label: "The simplest explanation" },
      { id: "numbers", label: "What happened to food prices" },
      { id: "why", label: "Why food rose so sharply" },
      { id: "fall", label: "Can prices actually fall?" },
      { id: "households", label: "Why low incomes feel it most" },
    ],
    faq: [
      {
        q: "Why are groceries still expensive if inflation is lower?",
        a: "Because inflation measures the rate of change, not the price level. If prices rise 10% and then inflation falls to 2%, the earlier rise stays and another 2% is added.",
      },
      {
        q: "How much did UK food prices rise?",
        a: "ONS data showed food and non alcoholic drink prices were 38.6% higher in November 2025 than in November 2020.",
      },
    ],
    sourceIds: ["ons-food-prices", "ons-cpi-2026", "brexit-food-prices", "sg-cost-living-2025"],
  },
  {
    slug: "crisis-grant-scotland-how-to-apply",
    title: "Crisis grant Scotland: how to apply and what you get",
    seoTitle: "Crisis Grant Scotland: How to Apply and What You Get",
    description:
      "A Scottish Welfare Fund Crisis Grant is emergency money you do not repay. Who can apply, what it covers, and how to claim through your council.",
    standfirst:
      "This is not a loan and it is not an advance from Universal Credit. It is a council grant for a low income person facing an immediate emergency.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Crisis Grant", "Scottish Welfare Fund", "Emergency help", "Benefits"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/scottish-welfare-fund-crisis-grant.webp",
      alt: "A community adviser helping a resident complete an online application at a public computer",
      caption:
        "Applications go to the local council. Help should be practical and immediate; you do not have to produce perfect words or repay the grant.",
      objectPosition: "center 42%",
    },
    toc: [
      { id: "what-it-is", label: "What a Crisis Grant is" },
      { id: "who", label: "Who can apply" },
      { id: "covers", label: "What it can cover" },
      { id: "apply", label: "How to apply" },
      { id: "refused", label: "If the council says no" },
    ],
    faq: [
      {
        q: "Do you pay a Scottish Crisis Grant back?",
        a: "No. It is a grant from the Scottish Welfare Fund, not a loan or a Universal Credit advance.",
      },
      {
        q: "Can I get a Crisis Grant for food or heating?",
        a: "Yes, those are the kinds of immediate essentials a Crisis Grant can cover when an emergency has left a low income person without money.",
      },
    ],
    sourceIds: ["scottish-welfare-fund"],
  },
  {
    slug: "discretionary-housing-payment-scotland",
    title: "Discretionary Housing Payments in Scotland: how to apply",
    description:
      "A Discretionary Housing Payment can top up rent when Universal Credit or Housing Benefit falls short, including the bedroom tax. How to apply in Scotland.",
    standfirst:
      "If you get help with rent but there is still a gap, your council has another fund. It can sometimes cover the shortfall, a deposit, rent in advance or moving costs.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Discretionary Housing Payment", "Rent", "Bedroom tax", "Benefit cap"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/discretionary-housing-payment.webp",
      alt: "A tenant on the phone comparing a tenancy document and household budget beside moving boxes",
      caption:
        "The payment is discretionary, so it is not automatic. A clear explanation of the rent gap and what would happen without help matters.",
      objectPosition: "center 40%",
    },
    toc: [
      { id: "what-it-is", label: "What the payment is" },
      { id: "who", label: "Who can apply" },
      { id: "covers", label: "What it may cover" },
      { id: "apply", label: "How to make a strong application" },
      { id: "next", label: "What happens next" },
    ],
    faq: [
      {
        q: "Who can get a Discretionary Housing Payment in Scotland?",
        a: "You must normally rent your home and already receive Housing Benefit or the housing element of Universal Credit. Your council then decides whether extra help is appropriate.",
      },
      {
        q: "Can a DHP cover a rent deposit?",
        a: "In some cases it can help with a deposit, rent in advance or removal costs, as well as an ongoing rent shortfall. Ask your council what its local fund will consider.",
      },
    ],
    sourceIds: ["discretionary-housing-payment", "lha-2026"],
  },
  {
    slug: "free-school-meals-clothing-grant-scotland",
    title: "Free school meals and clothing grants in Scotland",
    description:
      "Who gets free school meals in Scotland, how P1 to P5 works, the rules for older pupils, and how to claim £120 or £150 towards school clothing.",
    standfirst:
      "Some help is automatic, some has to be claimed, and the rules change with a child's school year. This is the short version for a busy parent.",
    date: "2026-08-01",
    category: "money-and-bills",
    tags: ["Free school meals", "School clothing grant", "Families", "School costs"],
    readingMinutes: 5,
    image: {
      src: "/images/editorial/free-school-meals-clothing-grant.webp",
      alt: "A parent helping her primary-school child put on an unbranded school jumper before leaving home",
      caption:
        "School is free, but uniforms, shoes, lunches and holiday weeks still cost money. Several kinds of help can be claimed together.",
      objectPosition: "center 38%",
    },
    toc: [
      { id: "meals", label: "Who gets free school meals" },
      { id: "older", label: "The rules after P5" },
      { id: "clothing", label: "School clothing grants" },
      { id: "holidays", label: "Help in school holidays" },
      { id: "apply", label: "How to apply" },
    ],
    faq: [
      {
        q: "Are school meals free for every primary pupil in Scotland?",
        a: "Lunch is universal in council and Scottish Government funded schools from primary 1 to primary 5. In primary 6 and 7, Scottish Child Payment or another qualifying benefit can give entitlement.",
      },
      {
        q: "How much is the school clothing grant in Scotland?",
        a: "Every council must pay at least £120 for a primary age child and £150 for a secondary age child. Councils set local eligibility rules and may pay more.",
      },
    ],
    sourceIds: ["free-school-meals-2026", "school-clothing-grants", "sg-child-payment-2026"],
  },
  {
    slug: "why-is-the-cost-of-living-so-high",
    title: "Why the cost of living is still so high in Scotland",
    description:
      "Scotland's cost of living crisis did not end when inflation fell. See why food, rent and energy remain expensive and which political choices worsened it.",
    standfirst:
      "War and the pandemic pushed prices up. That is true. It is also true that political choices left ordinary families with less protection, and added avoidable costs of their own.",
    date: "2026-08-01",
    updated: "2026-08-01",
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
      { id: "what-started-it", label: "What started the crisis" },
      { id: "decisions-made-it-worse", label: "The choices that made it worse" },
      { id: "glasgow-hit", label: "Why Glasgow feels it harder" },
      { id: "what-helped", label: "Decisions that did help" },
      { id: "who-can-fix-it", label: "Who can fix what" },
    ],
    faq: [
      {
        q: "Has the cost of living crisis ended because inflation is lower?",
        a: "No. Lower inflation means prices are rising more slowly; it does not put them back where they were. By March 2026, the ONS Household Costs Index was about 34% higher than five years earlier for low income households.",
      },
      {
        q: "Did MPs cause the cost of living crisis?",
        a: "Not by themselves. Pandemic disruption and Russia’s invasion of Ukraine caused major global food and energy shocks. But UK governments and MPs made choices on benefits, rent support, trade, tax and the 2022 mini budget that left households more exposed or added extra cost.",
      },
      {
        q: "Who controls help with the cost of living in Scotland?",
        a: "Both parliaments do. Westminster controls Universal Credit, Local Housing Allowance, the legal minimum wage, most tax allowances and energy regulation. Holyrood controls the Scottish Child Payment, housing, Scottish income tax bands, childcare and much of public transport. Councils control local crisis support and services.",
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
        a: "Three things: wages that have not kept up with prices, hours that are part time or unpredictable, and housing costs that take a large share of what is left. Poverty is measured after rent or mortgage is paid.",
      },
    ],
    sourceIds: ["sg-poverty-2026", "jrf"],
  },
  {
    slug: "what-does-poverty-mean",
    title: "What does poverty mean in the UK?",
    description:
      "Poverty has an official definition, and it is not what most people assume. What the poverty line is in pounds a week, and why 'after housing costs' matters.",
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
    title: "Scottish Child Payment: how much it is and how to apply",
    seoTitle: "Scottish Child Payment 2026/27: How Much and How to Apply",
    description:
      "A weekly payment for every child in a low income family in Scotland. What it is worth, who can get it, and why many eligible families never claim.",
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
        "The payment is designed to give low income families more room for everyday essentials, for every eligible child.",
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
        a: "As of April 2026 it is £28.20 per child per week, paid for every child in a low income family. It is set to rise to £40 a week for children under one from 2027.",
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
    title: "How to contact your MP or MSP in Scotland",
    description:
      "Find out how to contact your MP or MSP in Scotland, what to say and what happens next. Or use the postcode tool to open both ready written emails.",
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
      { id: "one-minute-version", label: "The one minute version" },
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
  {
    slug: "adult-disability-payment",
    title: "Adult disability payment: rates, eligibility and how to apply",
    seoTitle: "Adult Disability Payment 2026/27: Rates, Who Qualifies, How to Apply",
    description:
      "Adult Disability Payment pays £30.30 to £194.60 a week in 2026/27. The rates, who qualifies, how to apply in two parts, and how the myaccount login works.",
    standfirst:
      "Scotland's replacement for PIP. Not means tested, backdated to the day you start, and simpler to apply for than most people expect.",
    date: "2026-10-29",
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
    title: "Adult disability payment phone number",
    seoTitle: "Adult Disability Payment Phone Number: Call Times and What to Have Ready",
    description:
      "The Adult Disability Payment phone number is 0800 182 2222, free, 8am to 5pm on weekdays. Webchat, the number from abroad, the postal address and what to have ready.",
    standfirst:
      "One freephone number covers new claims, questions and changes. Here is when it's open and how to keep the call short.",
    date: "2026-10-29",
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
    title: "Carer support payment: rates, eligibility and how to apply",
    seoTitle: "Carer Support Payment 2026/27: Rates, Who Qualifies, How to Apply",
    description:
      "Carer Support Payment is £86.45 a week in 2026/27, plus an £11.70 Scottish Carer Supplement. Who qualifies, the £204 earnings limit and how to apply.",
    standfirst:
      "Scotland's replacement for Carer's Allowance, with a weekly supplement on top and extra for each additional person you care for.",
    date: "2026-10-29",
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
    title: "Best start grant: what you get and how to apply",
    seoTitle: "Best Start Grant 2026/27: Pregnancy, Early Learning and School Payments",
    description:
      "Best Start Grant pays £796.65 for a first baby, then £331.95 for early learning and £331.95 for school. Who qualifies, when to apply and how.",
    standfirst:
      "Three payments for low income families in Scotland, at birth, at two and at school age. None of it is paid back and you can spend it on anything.",
    date: "2026-10-29",
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
    slug: "winter-fuel-payment-scotland",
    title: "Winter fuel payment in Scotland: who gets it, how much and when",
    seoTitle: "Winter Fuel Payment Scotland 2026: Who Gets It, How Much and When",
    description:
      "In Scotland, Winter Fuel Payment is now Pension Age Winter Heating Payment: £105.55 to £316.70 this winter. Who gets it, the £35,000 rule and payment dates.",
    standfirst:
      "Scotland pays its own version now. Most pensioners get it without applying, but anyone with income over £35,000 hands it back through tax.",
    date: "2026-10-29",
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
    title: "Winter heating payment: who gets it and when",
    seoTitle: "Winter Heating Payment 2026: Who Gets It and When It Is Paid",
    description:
      "Winter Heating Payment is £62.00, paid automatically from December to people on certain low income benefits in Scotland. Who qualifies and when it lands.",
    standfirst:
      "A single payment every winter, whatever the weather, if you get the right benefit in the qualifying week.",
    date: "2026-10-29",
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
    title: "Social security Scotland payment dates for 2026",
    seoTitle: "Social Security Scotland Payment Dates 2026 Including Christmas",
    description:
      "Social Security Scotland payment dates over Christmas 2026: payments due 24 to 28 December come on 23 December. Every bank holiday change to 2028.",
    standfirst:
      "When a payment date falls on a bank holiday you're paid early. That helps before Christmas and hurts in January.",
    date: "2026-10-29",
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
    title: "Young carers allowance in Scotland: the Young Carer Grant",
    seoTitle: "Young Carers Allowance Scotland: The Young Carer Grant Explained",
    description:
      "Scotland's young carers allowance is the Young Carer Grant: £405.10 a year for carers aged 16 to 19 who care 16 hours a week. Who qualifies and how to apply.",
    standfirst:
      "A yearly payment for 16 to 19 year olds who look after someone. Spend it on whatever you like.",
    date: "2026-10-29",
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
    title: "Crisis grant phone number: every council in Scotland",
    seoTitle: "Crisis Grant Phone Number for Every Scottish Council",
    description:
      "The crisis grant phone number for all 32 Scottish councils, with opening hours and option numbers, checked against each council's own Scottish Welfare Fund page.",
    standfirst:
      "There is no national number. You ring the council where you live, and here is every one of them.",
    date: "2026-10-29",
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
    title: "Minimum wage 2027: every rate from 1 April",
    seoTitle: `Minimum Wage 2027: ${pounds(MINIMUM_WAGE.next.over21, true)} From April, What It Means in Scotland`,
    description: `The minimum wage rises to ${pounds(MINIMUM_WAGE.next.over21, true)} an hour on 1 April 2027 for workers 21 and over. Every age rate, the yearly pay and take home pay in Scotland.`,
    standfirst: `A ${Math.round((MINIMUM_WAGE.next.over21 - MINIMUM_WAGE.current.over21) * 100)}p rise for anyone 21 or over, and every other rate up too. Here's what it adds up to over a year, and what actually reaches the bank in Scotland.`,
    date: "2026-10-29",
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
    title: "Average salary Scotland: what full time workers earn",
    seoTitle: "Average Salary Scotland 2026: What Full Time Workers Earn by Council",
    description: `The average full time salary in Scotland is ${pounds(ASHE_2026.scotland.annual)} a year, the April 2026 median. The weekly and hourly figures, and what workers earn in all 32 councils.`,
    standfirst: `The latest official figures, published on ${ASHE_2026.released}, for Scotland and every council. Plus what the middle salary takes home, and how wide the spread really is.`,
    date: "2026-10-29",
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
    title: "Minimum wage in Glasgow Scotland: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage in Glasgow Scotland 2026: Rates and Local Pay",
    description: `The minimum wage in Glasgow is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, ${pounds(MINIMUM_WAGE.next.over21, true)} from April 2027. What local jobs pay, Glasgow rent, and what's left each month on a full time wage.`,
    standfirst: "The legal rate is the same as anywhere in the UK. What isn't the same is Glasgow's rent, its council tax and what the jobs around you pay.",
    date: "2026-10-29",
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
    title: "Minimum wage in Edinburgh Scotland: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage in Edinburgh Scotland 2026: Rates and Local Pay",
    description: `The minimum wage in Edinburgh is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, the same as the rest of the UK. With rents at ${pounds(CITY_PAY["city-of-edinburgh"].rent.oneBed)} a month, here's what it leaves you.`,
    standfirst: "Same legal rate as Dundee or London. Edinburgh's rents are what make it go less far, and I've done the sums to show by how much.",
    date: "2026-10-29",
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
    title: "Minimum wage Aberdeen: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage Aberdeen 2026: Rates and Local Pay",
    description: `The minimum wage in Aberdeen is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, ${pounds(MINIMUM_WAGE.next.over21, true)} from April 2027. Aberdeen jobs pay more and rent costs less: here's what's left each month.`,
    standfirst: "The legal rate is the UK rate. But Aberdeen pairs better paid jobs than Glasgow, Edinburgh or Dundee with rents well below Edinburgh or Glasgow.",
    date: "2026-10-29",
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
    title: "Minimum wage Dundee: the legal rate and what local jobs pay",
    seoTitle: "Minimum Wage Dundee 2026: Rates and Local Pay",
    description: `The minimum wage in Dundee is ${pounds(MINIMUM_WAGE.current.over21, true)} an hour, ${pounds(MINIMUM_WAGE.next.over21, true)} from April 2027. Rent is the lowest of Scotland's four biggest cities, so the wage goes further.`,
    standfirst: "Full time jobs in Dundee pay a little less than in Glasgow, Edinburgh or Aberdeen. Its rents are lower still, and on the legal minimum that leaves more in your pocket.",
    date: "2026-10-29",
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
    title: "Check council tax band: find your band in Scotland",
    seoTitle: "Check Council Tax Band in Scotland: Find My Council Tax Band",
    description: `Check your council tax band free on the Scottish Assessors site by postcode. Band A means a 1991 value ${bandValueLabel("A").toLowerCase()}. What each band means and how to appeal.`,
    standfirst:
      "Your band is on a public list anyone can search. Here's how to find it in a minute, what the letter means, and when you can ask for it to change.",
    date: "2026-10-29",
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
    title: "Council tax reduction Scotland: who qualifies and how much",
    seoTitle: "Council Tax Reduction Scotland: Who Qualifies and How to Apply",
    description: `Council Tax Reduction takes up to ${COUNCIL_TAX_REDUCTION.maxPercent}% off council tax if your income is low and savings are under ${pounds(COUNCIL_TAX_REDUCTION.savingsLimit)}. Who qualifies, how much and how to apply.`,
    standfirst:
      "Help from your council when money is tight, whether you work, rent, own or claim Universal Credit. Who gets it, how it's worked out, and how to claim in Edinburgh, South Lanarkshire and North Lanarkshire.",
    date: "2026-10-29",
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
    title: "Single person discount council tax Scotland: how to claim 25% off",
    seoTitle: "Single Person Discount Council Tax Scotland: 25% Off and How to Claim",
    description: `Live alone? You get ${SINGLE_PERSON_DISCOUNT.percent}% off council tax and water. That's ${pounds((bandFor("glasgow-city", "D").total * SINGLE_PERSON_DISCOUNT.percent) / 100)} a year on a Band D home in Glasgow. Who counts as an adult and how to claim.`,
    standfirst:
      "A quarter off the whole bill, water included, if you're the only adult who counts. Who's disregarded, how to claim, and what to do when someone moves in.",
    date: "2026-10-29",
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
    title: "Water rates Scotland: what every band pays in 2026/27",
    seoTitle: "Water Rates Scotland 2026/27: Charges by Council Tax Band",
    description: `Water rates in Scotland for 2026/27 run from ${pounds(waterCharges2026.A.water + waterCharges2026.A.wasteWater, true)} a year at Band A to ${pounds(waterCharges2026.H.water + waterCharges2026.H.wasteWater, true)} at Band H, paid with council tax. Every band and this year's rise.`,
    standfirst:
      "There's no separate water bill in Scotland. Scottish Water's charge comes on your council tax bill, set by your band and the same in every council.",
    date: "2026-10-29",
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
    title: "Modern studies: free resources for pupils and teachers",
    seoTitle: "Modern Studies: Free Resources for Pupils and Teachers in Scotland",
    description: `Free Modern Studies resources: N5 is ${N5_MODERN_STUDIES.totalMarks} marks, Higher ${HIGHER_MODERN_STUDIES.totalMarks}, Advanced Higher ${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks}. Course guides, past paper help and real Scottish data.`,
    standfirst:
      "Course facts from the people who set the exams, and up to date Scottish figures you can drop into an answer. All free, all sourced.",
    date: "2026-10-29",
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
    title: "National 5 modern studies: the course in plain English",
    seoTitle: "National 5 Modern Studies: Course Guide, Notes and Real Data",
    description: `National 5 Modern Studies is ${N5_MODERN_STUDIES.totalMarks} marks: an ${N5_MODERN_STUDIES.paper.marks} mark exam and a ${N5_MODERN_STUDIES.assignment.marks} mark assignment. The course in plain English, revision notes and model answers.`,
    standfirst:
      "What is in the exam, how the assignment is marked, and revision notes built on real Scottish figures you can quote.",
    date: "2026-10-29",
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
    title: "Higher modern studies: the course, the skills and the evidence",
    seoTitle: "Higher Modern Studies: Course Guide, Skills and Real Data",
    description: `Higher Modern Studies is ${HIGHER_MODERN_STUDIES.totalMarks} marks: Paper 1 (${HIGHER_MODERN_STUDIES.paper1.marks}), Paper 2 (${HIGHER_MODERN_STUDIES.paper2.marks}) and a ${HIGHER_MODERN_STUDIES.assignment.marks} mark assignment. How each is marked, plus real Scottish evidence.`,
    standfirst:
      "How Paper 1, Paper 2 and the assignment are marked, what the 2026 examiners flagged, and the latest Scottish evidence for each section.",
    date: "2026-10-29",
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
      "nrs-drug-deaths-2024",
      "phs-child-poverty-impact",
      "audit-scotland-council-budgets-2026-27",
      "recorded-crime-2025-26-dishonesty",
    ],
  },
  {
    slug: "higher-modern-studies-past-papers",
    title: "Higher modern studies past papers and practice questions",
    seoTitle: "Higher Modern Studies Past Papers and Practice Questions With Real Data",
    description: `Higher Modern Studies past papers for ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear} are free from Qualifications Scotland. Where they are, how to use them, and practice with real data.`,
    standfirst:
      "Where the official papers and marking instructions live now, how to use them properly, and three Paper 2 style questions built on real Scottish figures.",
    date: "2026-10-29",
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
      "nrs-drug-deaths-2024",
      "ecp",
      "sg-poverty-2026",
      "jrf-poverty-in-scotland-2026",
      "sgs-recorded-crime",
      "recorded-crime-2025-26-dishonesty",
    ],
  },
  {
    slug: "nat-5-modern-studies-past-papers",
    title: "Nat 5 modern studies past papers and practice questions",
    seoTitle: "Nat 5 Modern Studies Past Papers and Practice Questions",
    description: `Nat 5 Modern Studies past papers for ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear} are free from Qualifications Scotland. Where to get them, the question types and real data practice.`,
    standfirst:
      "Where the official papers and marking instructions are, how to use them so they actually help, and two full source questions built on real Scottish figures.",
    date: "2026-10-29",
    category: "poverty-explained",
    tags: ["Modern Studies", "National 5", "Past papers", "Practice questions"],
    readingMinutes: 6,
    quickAnswer: {
      label: "Nat 5 Modern Studies past papers",
      value: `${MODERN_STUDIES_PAST_PAPERS.years}`,
      unit: `years of papers, ${MODERN_STUDIES_PAST_PAPERS.firstYear} to ${MODERN_STUDIES_PAST_PAPERS.lastYear}`,
      detail: `Every National 5 Modern Studies paper and its marking instructions are free on the Qualifications Scotland past papers page, still hosted on sqa.org.uk. Some ${MODERN_STUDIES_PAST_PAPERS.modifiedYears} papers are modified versions.`,
      rows: [
        { label: "Exam", value: `${N5_MODERN_STUDIES.paper.marks} marks, ${N5_MODERN_STUDIES.paper.duration}` },
        { label: "Source questions", value: "3 in each paper, 10 marks each" },
        { label: "Marking instructions", value: "Free, one set for each year" },
        { label: "Practice on this page", value: "2 full source questions using real data" },
      ],
      asOf: "Checked 29 October 2026",
      source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.pastPapersN5 },
    },
    toc: [
      { id: "where", label: "Where to get the papers" },
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
    title: "Advanced higher modern studies: the course and where to find data",
    seoTitle: "Advanced Higher Modern Studies: Course Guide and Data Sources",
    description: `Advanced Higher Modern Studies is ${ADVANCED_HIGHER_MODERN_STUDIES.totalMarks} marks: a ${ADVANCED_HIGHER_MODERN_STUDIES.paper.marks} mark exam and a ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.words.toLocaleString("en-GB")} word dissertation worth ${ADVANCED_HIGHER_MODERN_STUDIES.dissertation.marks}. The course, and data that holds up.`,
    standfirst:
      "How the exam and the dissertation are marked, and the official Scottish data worth using, with the weakness of each source spelled out.",
    date: "2026-10-29",
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
      "nrs-drug-deaths-2024",
      "sgs-recorded-crime",
      "lgbf-family-groups",
      "audit-scotland-council-budgets-2026-27",
      "shs-council-perceptions-2024",
      "sp-open-data-msps",
    ],
  },
  {
    slug: "causes-of-poverty",
    title: "Causes of poverty: what the evidence shows in Scotland",
    seoTitle: "Causes of Poverty: What the Scottish Evidence Shows",
    description: `Poverty in Scotland has three main causes: pay from work, the cost of living and social security. ${scotlandPoverty.all.pct}% of people are in poverty. The evidence and the effects.`,
    standfirst:
      "Not bad choices. Pay, rent and benefits, set out with the official Scottish figures, then what poverty does to health and to children.",
    date: "2026-10-29",
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
      "nrs-drug-deaths-2024",
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
