/**
 * The command palette's searchable index.
 *
 * Split out of Command.tsx so it can be fetched only when somebody opens the
 * palette. The palette is mounted in the root layout, so while this lived
 * beside it every visitor downloaded the whole index, every council record,
 * every constituency, every MP, the glossary and the FAQ, on every page,
 * whether or not they ever pressed the key. Most people never do.
 *
 * Command.tsx imports the Item type with `import type`, which is erased at
 * compile time and does not pull this module back into the main bundle.
 */
import { councils } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";
import { terms } from "@/lib/data/glossary";
import { faqItems } from "@/lib/data/faqs";
import { posts, postCategories } from "@/lib/data/posts";
import { BAND_LETTERS } from "@/lib/data/councilTax";
import { mps } from "@/lib/data/mps";
import { holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";
import { representativeSlug } from "@/lib/representatives";
import { councilAccountabilityRecords } from "@/lib/data/councilAccountability";
import { councilTaxBandPath, councilTaxPath, postPath } from "./routeMap.ts";
import { HUBS, INVESTIGATIONS_HUB, type HubId } from "@/lib/data/navigation";

export type Item = {
  label: string;
  href: string;
  group: string;
  /** Right-aligned metadata, e.g. the area's latest rate. */
  meta?: string;
  keywords?: string;
  /** The menu section the page belongs to, for its colour, icon and heading. */
  section?: HubId;
};

/**
 * Extra search words for menu pages that have no entry above. The menu label
 * alone is short, and people search in their own words ("no money", "appeal").
 */
const NAV_KEYWORDS: Record<string, string> = {
  "/struggling-right-now-scotland": "urgent help emergency cash no money food bank today crisis bills skint",
  "/suicide-scotland-statistics-and-support": "suicide mental health samaritans breathing space helpline crisis cope suicidal statistics",
  "/where-to-apply-scotland": "apply application forms official links mygov how to apply",
  "/benefit-or-crisis-grant-rejected-scotland": "refused rejected turned down appeal review challenge redetermination spso",
  "/sight-loss-scotland": "blind blindness partially sighted cvi eyes vision blind persons allowance",
  "/disability-support-scotland": "disabled disability adp pip rights access to work blue badge",
  "/electricity-cost-calculator-scotland": "electricity energy appliance kettle cost kwh running costs bill",
  "/minimum-wage-scotland": "national living wage hourly pay rate",
  "/adult-disability-payment": "adp pip disability benefit",
  "/crisis-grant-scotland": "scottish welfare fund emergency money",
  "/who-is-my-msp": "msp holyrood find my representative postcode",
  "/who-is-my-local-councillor-by-postcode": "councillor council ward",
  "/winter-fuel-payment-scotland": "pension age winter payment heating",
  "/social-security-scotland-payment-dates": "when paid payment dates christmas bank holiday",
  "/scottish-child-payment": "scp child benefit kids",
};

const CORE: Item[] = [
  { label: "Home", href: "/", group: "Main pages" },
  { label: "Every Scottish council area", href: "/areas", group: "Main pages" },
  { label: "Council budgets and performance", href: "/councils", group: "Main pages", keywords: "council budget targets promises audit performance scrutiny" },
  { label: "Find the area your MP represents", href: "/constituencies", group: "Main pages" },
  {
    label: "Every current Scottish MP",
    href: "/representatives",
    group: "Main pages",
    keywords: "who is my mp names contact email phone westminster representatives",
  },
  {
    label: "MP Register of Interests Scotland: Donations, Trips & Gifts",
    href: "/mp-expenses-scotland",
    group: "Main pages",
    keywords: "mp register of interests donations gifts hospitality foreign trips second jobs landlords lobbying scotland",
  },
  {
    label: "Scottish MP expenses: every standout receipt",
    href: "/blog/worst-scottish-mp-expenses",
    group: "Main pages",
    keywords: "mp expenses receipts strangest worst claims speech coach iphone furniture ipsa scotland",
  },
  {
    label: "Every current Scottish MSP",
    href: "/representatives/msps",
    group: "Main pages",
    keywords: "who is my msp names contact email holyrood representatives regional constituency",
  },
  {
    label: "Glasgow poverty statistics",
    href: "/glasgow-poverty-statistics",
    group: "Main pages",
    keywords: "Glasgow poverty trends work pay health deprivation life expectancy what changed",
  },
  { label: "Why poverty is worse in Glasgow", href: "/why-poverty-is-worse-in-glasgow", group: "Main pages" },
  { label: "What would help cut poverty", href: "/solutions-to-poverty-in-scotland", group: "Main pages" },
  {
    label: "Who is responsible for poverty in Scotland?",
    href: "/who-is-responsible-for-poverty-in-scotland",
    group: "Main pages",
    keywords: "who decides what Westminster Scottish Government council poverty policy responsibility",
  },
  { label: "Email your MP and MSP", href: "/email-your-mp-and-msp", group: "Main pages", keywords: "letter mp msp email write postcode who is my mp find" },
  {
    label: "What happens when you email your MP",
    href: "/what-happens-when-you-email-your-mp",
    group: "Main pages",
    keywords: "does contacting my mp work reply response what happens after send",
  },
  { label: "Explained in plain English", href: "/blog", group: "Main pages", keywords: "blog articles guides explainers" },
  {
    label: "Everything on this site",
    href: "/browse",
    group: "Main pages",
    keywords: "all pages site map browse contents",
  },
  {
    label: "Contact Scotland Counted",
    href: "/contact",
    group: "Main pages",
    keywords: "contact form email charity data help correction mistake press tip",
  },
  {
    label: "Take home pay calculator",
    href: "/take-home-pay-calculator-scotland",
    group: "Free tools",
    keywords: "salary wage tax national insurance pension student loan net pay after tax scottish rates",
  },
  {
    label: "Scottish income tax bands 2026/27",
    href: "/tax-bands-scotland",
    group: "Main pages",
    keywords: "scottish income tax bands rates 19 20 21 42 45 48 scotland vs england crossover",
  },
  {
    label: "Scottish Budget 2027/28 (3 December 2026)",
    href: "/scottish-budget-2027-28",
    group: "Main pages",
    keywords: "scottish budget 2027 28 date 3 december 2026 jenny gilruth holyrood income tax council tax",
  },
  {
    label: "Warm Home Discount Scotland (£150)",
    href: "/warm-home-discount-scotland",
    group: "Main pages",
    keywords: "warm home discount scotland 150 apply broader group core group scottishpower british gas octopus ovo",
  },
  {
    label: "Mansion tax Scotland: Council Tax Bands I and J",
    href: "/mansion-tax-scotland",
    group: "Main pages",
    keywords: "mansion tax scotland council tax band i band j high value dwellings bill dementia exemption",
  },
  {
    label: "LBTT calculator Scotland (Stamp Duty)",
    href: "/lbtt-calculator-scotland",
    group: "Free tools",
    keywords: "lbtt calculator stamp duty scotland ads additional dwelling supplement first time buyer",
  },
  {
    label: "SIMD postcode checker",
    href: "/simd-postcode-checker",
    group: "Free tools",
    keywords: "simd postcode checker deprivation decile quintile datazone lookup",
  },
  {
    label: "Scotland bank holidays 2026 to 2028",
    href: "/scotland-bank-holidays",
    group: "Main pages",
    keywords: "scotland bank holidays 2026 2027 2028 public holidays substitute days st andrews day",
  },
  {
    label: "Council tax by band",
    href: "/council-tax-bands-scotland",
    group: "Free tools",
    keywords: "council tax band a b c d e f g h water charges how much bill",
  },
  {
    label: "Guess the figure",
    href: "/poverty-in-scotland-quiz",
    group: "Free tools",
    keywords: "quiz test questions how much do you know",
  },
  { label: "How the figures were counted", href: "/methods", group: "Check the proof" },
  { label: "Download the data", href: "/data", group: "Check the proof", keywords: "csv download dataset" },
  { label: "Press and reuse", href: "/press", group: "Check the proof", keywords: "media journalist embed png" },
  { label: "What changed", href: "/updates", group: "More", keywords: "changelog rss updates news" },
  { label: "Words explained", href: "/glossary", group: "Check the proof" },
  { label: "Questions and straight answers", href: "/faq", group: "Main pages", keywords: "faq help search question answer" },
  { label: "About Scotland Counted", href: "/about", group: "More", keywords: "about non profit mission independent data" },
  { label: "Report or see corrections", href: "/corrections", group: "More" },
  { label: "Privacy", href: "/privacy", group: "More", keywords: "data cookies tracking gdpr postcode stored" },
];

/** Every page in the menus, keyed by address, with its section. */
function menuIndex() {
  const index = new Map<string, { label: string; section: HubId; group: string }>();
  for (const hub of [...HUBS, INVESTIGATIONS_HUB]) {
    const add = (href: string, label: string) => {
      if (!index.has(href)) index.set(href, { label, section: hub.id, group: hub.label });
    };
    add(hub.href, `${hub.label}: every page`);
    for (const group of hub.groups) for (const item of group.items) add(item.href, item.label);
    add(hub.feature.href, hub.feature.title);
  }
  return index;
}

/**
 * The menus and search used to be two separate lists, so search could not
 * find most of the pages the menu offers (minimum wage, ADP, crisis help).
 * Every menu page is now in search under its section, and any page already
 * here picks up its section's colour and heading.
 */
export function buildRegistry(): Item[] {
  const menu = menuIndex();
  const seen = new Set<string>();
  const merged: Item[] = [];
  for (const item of buildBase()) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    const nav = menu.get(item.href);
    merged.push(
      nav
        ? {
            ...item,
            section: nav.section,
            group: nav.group,
            keywords: [item.keywords, nav.label, NAV_KEYWORDS[item.href]].filter(Boolean).join(" "),
          }
        : item,
    );
  }
  for (const [href, nav] of menu) {
    if (seen.has(href)) continue;
    seen.add(href);
    merged.push({ label: nav.label, href, group: nav.group, section: nav.section, keywords: NAV_KEYWORDS[href] });
  }
  return merged;
}

function buildBase(): Item[] {
  return [
    ...CORE,
    ...indicators.map((i) => ({
      label: i.title,
      href: `/indicators/${i.slug}`,
      group: "Glasgow facts",
      keywords: `${i.label} chart data`,
    })),
    /*
     * lifeExpectancy and deprivation are separate exports, not members of the
     * indicators array, so mapping over that array alone silently left two
     * whole pages out of search. The sitemap already spread all three.
     */
    ...[lifeExpectancy, deprivation].map((i) => ({
      label: i.title,
      href: `/indicators/${i.slug}`,
      group: "Glasgow facts",
      keywords: `${i.summary} chart data`,
    })),
    ...councils.map((c) => ({
      label: c.name,
      href: `/areas/${c.slug}`,
      group: "Council areas",
      meta: `${c.pcts[9]}%`,
      keywords: "council area child poverty",
    })),
    ...councilAccountabilityRecords.map((record) => ({
      label: `${record.councilName} budget and performance`,
      href: `/councils/${record.councilSlug}`,
      group: "Council performance",
      keywords: `${record.summary} council budget audit targets promises`,
    })),
    ...constituencies.map((c) => ({
      label: c.name,
      href: `/constituencies/${c.slug}`,
      group: "Areas represented by an MP",
      meta: `${c.pcts[9]}%`,
      keywords: "constituency mp seat westminster",
    })),
    ...mps.map((mp) => ({
      label: `${mp.name}, MP for ${mp.constituency}`,
      href: `/representatives/mps/${mp.constituencySlug}`,
      group: "Scottish MPs",
      meta: mp.party,
      keywords: `who is mp contact email phone representative westminster ${mp.constituency} ${mp.party}`,
    })),
    ...holyroodConstituencies.map((record) => ({
      label: `${record.msp.name}, MSP for ${record.constituency}`,
      href: `/representatives/msps/constituencies/${record.constituencySlug}`,
      group: "Scottish MSPs",
      meta: record.msp.party,
      keywords: `who is msp contact email representative holyrood ${record.constituency} ${record.region} ${record.msp.party}`,
    })),
    ...holyroodRegions.map((record) => ({
      label: `Regional MSPs for ${record.region}`,
      href: `/representatives/msps/regions/${record.regionSlug}`,
      group: "Scottish MSPs",
      meta: "7 regional MSPs",
      keywords: `regional msps contact email representative holyrood ${record.region}`,
    })),
    ...holyroodRegions.flatMap((record) => record.msps.map((msp) => ({
      label: `${msp.name}, regional MSP for ${record.region}`,
      href: `/representatives/msps/regions/${record.regionSlug}/${representativeSlug(msp.name)}`,
      group: "Scottish MSPs",
      meta: msp.party,
      keywords: `who is msp contact email representative holyrood ${record.region} ${msp.party}`,
    }))),
    ...faqItems.map((item) => ({
      label: item.q,
      href: `/faq#${item.id}`,
      group: "Questions",
      keywords: `${item.a} ${item.keywords ?? ""}`,
    })),
    ...terms.map((t) => ({
      label: t.term,
      href: `/glossary#${t.id}`,
      group: "Glossary",
      keywords: t.def.slice(0, 60),
    })),

    /*
     * Everything below was missing, which meant search could not find most of
     * the site's writing. The blog alone is 23 pages, and the council tax
     * cluster is 40, between them the largest body of content here, and none
     * of it was reachable from the search box.
     */
    ...posts.map((p) => ({
      label: p.title,
      href: postPath(p.slug),
      group: "Explainers",
      meta: `${p.readingMinutes} min`,
      keywords: `${p.description} ${p.tags.join(" ")} blog article guide`,
    })),
    ...postCategories.map((c) => ({
      label: c.name,
      href: `/blog/category/${c.slug}`,
      group: "Explainers",
      keywords: `${c.description} category topic`,
    })),
    ...councils.map((c) => ({
      label: `${c.name} council tax`,
      href: councilTaxPath(c.slug),
      group: "Council tax",
      keywords: `council tax bands rates water charges ${c.name}`,
    })),
    ...BAND_LETTERS.map((b) => ({
      label: `Council tax Band ${b}`,
      href: councilTaxBandPath(b),
      group: "Council tax",
      keywords: `band ${b} council tax how much cost every council water`,
    })),
  ];
}
