import {
  ogCompareCard,
  ogImage,
  ogInvestigationCard,
  ogPageCard,
  ogPersonCard,
  ogStatCard,
  type OgPersonStat,
} from "@/lib/og";
import { councils, getCouncil } from "@/lib/data/councils";
import { CONSTITUENCY_YEARS, getConstituency } from "@/lib/data/constituencies";
import { getMpByConstituencySlug, mps } from "@/lib/data/mps";
import { getMpInterestsByConstituencySlug } from "@/lib/data/mpInterests";
import {
  getHolyroodConstituencyBySlug,
  getHolyroodRegionBySlug,
  getHolyroodRegionalMsp,
  holyroodConstituencies,
  holyroodRegions,
} from "@/lib/data/holyrood";
import { getMspInterests } from "@/lib/data/mspInterests";
import { getMspReviewProfile } from "@/lib/data/mspReviews";
import { getCouncilAccountability } from "@/lib/data/councilAccountability";
import { councilPerformanceBySlug } from "@/lib/data/councilPerformanceIndex";
import {
  COMPARE_DEFAULTS,
  COMPARE_METRICS,
  metricById,
  placeScores,
  rankAreas,
  winner,
} from "@/lib/data/compareAreas";
import {
  COUNCIL_TAX_YEAR,
  chargesFor,
  councilTaxByBand,
  councilTaxChangeFor,
  waterCharges2026,
} from "@/lib/data/councilTax";
import { calculate } from "@/lib/tax/engine";
import { getPost, getPostCategory } from "@/lib/data/posts";
import { getExpenseStory } from "@/lib/data/expenseStories";
import { deprivation, getIndicator, lifeExpectancy } from "@/lib/data/indicators";
import { COUNCIL_SEARCH_NAMES, resolveTopLevel } from "@/lib/routeMap";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatMoney(n: number) {
  return gbp.format(Math.round(n));
}

function resolvePersonPhotoForHref(href?: string): string | null {
  if (!href) return null;
  if (href.startsWith("/representatives/mps/")) {
    const slug = href.slice("/representatives/mps/".length);
    return getMpByConstituencySlug(slug)?.photoUrl ?? null;
  }
  if (href.startsWith("/representatives/msps/constituencies/")) {
    const slug = href.slice("/representatives/msps/constituencies/".length);
    return getHolyroodConstituencyBySlug(slug)?.msp.photoUrl ?? null;
  }
  if (href.startsWith("/representatives/msps/regions/")) {
    const parts = href.slice("/representatives/msps/regions/".length).split("/");
    if (parts.length === 2) {
      return getHolyroodRegionalMsp(parts[0], parts[1])?.photoUrl ?? null;
    }
  }
  return null;
}

export function renderPostOg(slug: string) {
  const post = getPost(slug);
  if (!post) {
    return ogPageCard({
      eyebrow: "Scotland Counted",
      title: "Explained in plain English",
      description: "Public data on poverty, pay, council services and politicians across Scotland.",
    });
  }

  const category = getPostCategory(post.category);
  const expenseStory = getExpenseStory(slug);

  if (expenseStory) {
    return ogInvestigationCard({
      eyebrow:
        expenseStory.group === "msp"
          ? "Holyrood Expenses Investigation"
          : expenseStory.group === "mp"
            ? "Scottish MP Expenses Investigation"
            : "Scotland Counted Investigation",
      eyebrowColor: "#ff7a5c",
      title: post.title,
      stat: expenseStory.stat,
      statTone: expenseStory.slug === "meghan-gallacher-msp-low-expenses" ? "good" : "bad",
      photoPath: post.shareImage?.src ?? null,
      person: expenseStory.person
        ? {
            name: expenseStory.person.name,
            place: expenseStory.person.place,
            photoPath: resolvePersonPhotoForHref(expenseStory.person.href),
          }
        : undefined,
    });
  }

  return ogInvestigationCard({
    eyebrow: category?.name ?? "Explained in plain English",
    eyebrowColor: category?.colorOnDark ?? "#6db5fc",
    title: post.title,
    subtitle: post.description,
    photoPath: post.shareImage?.src ?? null,
  });
}

function renderCompareOg(slugA: string, slugB: string) {
  const a = getCouncil(slugA) ? slugA : COMPARE_DEFAULTS.a;
  const b = getCouncil(slugB) && slugB !== a ? slugB : a === COMPARE_DEFAULTS.b ? COMPARE_DEFAULTS.a : COMPARE_DEFAULTS.b;

  const nameA = COUNCIL_SEARCH_NAMES[a] ?? getCouncil(a)?.name ?? a;
  const nameB = COUNCIL_SEARCH_NAMES[b] ?? getCouncil(b)?.name ?? b;

  const scored = COMPARE_METRICS.map((m) => winner(m, a, b)).filter((w) => w === "a" || w === "b");
  const aWins = scored.filter((w) => w === "a").length;
  const bWins = scored.filter((w) => w === "b").length;

  const house = metricById("house_price");
  const pay = metricById("pay");

  const factsFor = (slug: string) => {
    const out: string[] = [];
    if (house?.values[slug] != null) out.push(`Homes: ${house.format(house.values[slug]!)}`);
    if (pay?.values[slug] != null) out.push(`Pay: ${pay.format(pay.values[slug]!)}/wk`);
    return out;
  };

  return ogCompareCard({
    eyebrow: "Scotland Council Comparison · Official Figures",
    leftName: nameA,
    leftWins: aWins,
    leftFacts: factsFor(a),
    rightName: nameB,
    rightWins: bWins,
    rightFacts: factsFor(b),
    totalMeasures: scored.length,
  });
}

function renderCouncilTaxOg(councilSlug: string) {
  const c = getCouncil(councilSlug);
  const charges = chargesFor(councilSlug);
  if (!c || !charges) return null;
  const bandD = charges.find((b) => b.band === "D");
  const bandA = charges.find((b) => b.band === "A");
  const bandH = charges.find((b) => b.band === "H");
  const change = councilTaxChangeFor(councilSlug, "D");
  const name = COUNCIL_SEARCH_NAMES[councilSlug] ?? c.name;

  return ogStatCard({
    eyebrow: `Council Tax ${COUNCIL_TAX_YEAR} · All 8 Bands`,
    title: `${name} Council Tax Bands`,
    stat: bandD ? formatMoney(bandD.councilTax) : "Bands A-H",
    statTone: "accent",
    details: [
      bandD ? `Band D council tax (${formatMoney(bandD.total)} with water)` : "Official 2026/27 rates",
      change ? `Up ${change.percent.toFixed(1)}% (${formatMoney(change.cash)}) from last year` : "Includes Scottish Water charges",
      bandA && bandH ? `Bands A to H: ${formatMoney(bandA.councilTax)} to ${formatMoney(bandH.councilTax)}` : "Every band listed in full",
    ],
  });
}

function renderCouncilTaxBandOg(letter: string) {
  const upper = letter.toUpperCase();
  const values = councils
    .map((c) => ({
      name: COUNCIL_SEARCH_NAMES[c.slug] ?? c.name,
      amount: councilTaxByBand[c.slug]?.[upper],
    }))
    .filter((row): row is { name: string; amount: number } => typeof row.amount === "number")
    .sort((a, b) => a.amount - b.amount);

  if (!values.length) return null;
  const lowest = values[0];
  const highest = values[values.length - 1];
  const water = waterCharges2026[upper];
  const waterTotal = water ? water.water + water.wasteWater : null;

  return ogStatCard({
    eyebrow: `Scotland Council Tax ${COUNCIL_TAX_YEAR} · All 32 Councils`,
    title: `Council Tax Band ${upper} in Scotland`,
    stat: `Band ${upper}`,
    statTone: "accent",
    details: [
      `Lowest: ${lowest.name} (${formatMoney(lowest.amount)})`,
      `Highest: ${highest.name} (${formatMoney(highest.amount)})`,
      waterTotal ? `Plus ${formatMoney(waterTotal)} water & waste water` : "Every council ranked low to high",
    ],
  });
}

function renderSalaryOg(amount: number) {
  const scotland = calculate(amount, "scotland");
  const england = calculate(amount, "ruk");
  const gap = Math.round(scotland.net - england.net);
  const gapLine =
    gap === 0
      ? "Same take-home pay as England & Wales"
      : gap < 0
        ? `${formatMoney(Math.abs(gap))} less a year than England & Wales`
        : `${formatMoney(gap)} more a year than England & Wales`;

  return ogStatCard({
    eyebrow: "Scottish Take-Home Pay · 2026/27 Tax Year",
    title: `${formatMoney(amount)} After Tax in Scotland`,
    stat: formatMoney(scotland.net),
    statTone: "good",
    details: [
      `${formatMoney(scotland.net / 12)} a month take-home pay`,
      `${formatMoney(scotland.tax.total)} income tax · ${formatMoney(scotland.ni.total)} NI`,
      gapLine,
    ],
  });
}

const INDICATOR_STATS: Record<
  string,
  { title: string; stat: string; tone: "bad" | "good" | "accent"; details: string[] }
> = {
  "glasgow-child-poverty": {
    title: "Child Poverty in Glasgow",
    stat: "36.1%",
    tone: "bad",
    details: [
      "39,319 children in poverty after housing costs (2023/24)",
      "Up from roughly 1 in 4 a decade ago",
      "Highest child poverty rate in Scotland",
    ],
  },
  "glasgow-employment-rate": {
    title: "Employment Rate in Glasgow",
    stat: "71.2%",
    tone: "good",
    details: [
      "Working age Glaswegians in work, up from 62.7% in 2004",
      "More people in work, yet in-work poverty stays high",
      "Official ONS labour market figures",
    ],
  },
  "glasgow-claimant-count": {
    title: "Out-of-Work Benefit Claimants in Glasgow",
    stat: "4.5%",
    tone: "good",
    details: [
      "Claiming out-of-work benefits in Jan 2026, down from 6.0% in 2000",
      "Jumped during the pandemic, then came back down",
      "Official DWP & ONS claimant count data",
    ],
  },
  "glasgow-full-time-pay": {
    title: "Full-Time Pay in Glasgow",
    stat: "£24,785",
    tone: "bad",
    details: [
      "Gross yearly pay at £12.71/hr legal minimum (37.5 hrs/wk)",
      "29% of Glasgow employee jobs are part time",
      "Why headline median wages hide low pay",
    ],
  },
  "glasgow-life-expectancy": {
    title: "Life Expectancy in Glasgow",
    stat: "73.9 yrs",
    tone: "bad",
    details: [
      "Shortest life expectancy of any council area in Scotland",
      "Big gap with neighbouring East Dunbartonshire",
      "Official National Records of Scotland figures",
    ],
  },
  "glasgow-deprivation": {
    title: "Deprivation in Glasgow (SIMD)",
    stat: "44%",
    tone: "bad",
    details: [
      "Of Glasgow neighbourhoods sit in Scotland's poorest fifth",
      "Down from 2004, but still the highest share in Scotland",
      "Scottish Index of Multiple Deprivation data",
    ],
  },
};

function renderStaticRouteOg(path: string) {
  switch (path) {
    case "/mp-expenses-scotland":
      return ogInvestigationCard({
        eyebrow: "Scottish MP Expenses & Register of Interests",
        eyebrowColor: "#ff7a5c",
        title: "Every Scottish MP's 2025/26 Expenses & Freebies",
        stat: "£5.21m",
        statTone: "bad",
        photoPath: "/images/share/mp-expenses-scotland-hub.jpg",
      });

    case "/mp-expenses-scotland/search":
      return ogInvestigationCard({
        eyebrow: "Search Official Parliamentary Receipts",
        eyebrowColor: "#6db5fc",
        title: "Search Every Scottish MP & MSP Expense Receipt",
        stat: "70,946",
        statTone: "accent",
        photoPath: "/images/share/mp-msp-receipt-finder-scotland.jpg",
      });

    case "/warm-home-discount-scotland":
      return ogInvestigationCard({
        eyebrow: "Energy Bill Help · Scotland 2026/27",
        eyebrowColor: "#f6c453",
        title: "Warm Home Discount Scotland: Who Gets £150 & How to Apply",
        stat: "£150",
        statTone: "amber",
        photoPath: "/images/share/warm-home-discount-scotland-150.jpg",
      });

    case "/mansion-tax-scotland":
      return ogInvestigationCard({
        eyebrow: "Scottish Council Tax · High Value Homes",
        eyebrowColor: "#6db5fc",
        title: "Mansion Tax Scotland: New Bands I & J Explained",
        stat: "£1m+",
        statTone: "accent",
        photoPath: "/images/share/mansion-tax-scotland-council-tax-bands.jpg",
      });

    case "/scottish-budget-2027-28":
      return ogInvestigationCard({
        eyebrow: "Holyrood Budget · Tax & Spending",
        eyebrowColor: "#6db5fc",
        title: "Scottish Budget 2027-28: Tax, Benefits & Public Services",
        photoPath: "/images/share/scottish-budget-2027-28-holyrood.jpg",
      });

    case "/lbtt-calculator-scotland":
      return ogInvestigationCard({
        eyebrow: "Free Scottish Property Tax Tool",
        eyebrowColor: "#00c48c",
        title: "LBTT Calculator Scotland: Stamp Duty & ADS Rates",
        photoPath: "/images/share/lbtt-calculator-scotland-stamp-duty.jpg",
      });

    case "/tax-bands-scotland":
      return ogInvestigationCard({
        eyebrow: "Scottish Income Tax · 2026/27",
        eyebrowColor: "#6db5fc",
        title: "Scottish Tax Bands 2026/27: Rates, Thresholds & England Gap",
        stat: "6 bands",
        statTone: "accent",
        photoPath: "/images/share/tax-bands-scotland-2026-27.jpg",
      });

    case "/simd-postcode-checker":
      return ogInvestigationCard({
        eyebrow: "Scottish Index of Multiple Deprivation",
        eyebrowColor: "#6db5fc",
        title: "SIMD Postcode Checker: Check Any Scottish Postcode",
        stat: "6,976",
        statTone: "accent",
        photoPath: "/images/share/simd-postcode-checker-scotland.jpg",
      });

    case "/scotland-bank-holidays":
      return ogInvestigationCard({
        eyebrow: "Official Scottish Dates · 2026 & 2027",
        eyebrowColor: "#6db5fc",
        title: "Scotland Bank Holidays 2026 & 2027: Full List of Dates",
        photoPath: "/images/share/scotland-bank-holidays-calendar.jpg",
      });

    case "/take-home-pay-calculator-scotland":
      return ogStatCard({
        eyebrow: "Free Scottish Tax Tool · 2026/27",
        title: "Scotland Take-Home Pay Calculator",
        stat: "2026/27",
        statTone: "good",
        details: [
          "Exact Scottish income tax & National Insurance",
          "Side-by-side comparison with England & Wales",
          "Includes student loan & pension options",
        ],
      });

    case "/council-tax-bands-scotland":
      return ogStatCard({
        eyebrow: `All 32 Councils · ${COUNCIL_TAX_YEAR}`,
        title: "Council Tax Bands Scotland",
        stat: "32 areas",
        statTone: "accent",
        details: [
          "Every council's Band A to H bills for 2026/27",
          "Includes Scottish Water & waste water charges",
          "See who rose most and who pays least",
        ],
      });

    case "/best-place-to-live-in-scotland": {
      const top = placeScores()[0];
      const topName = top ? COUNCIL_SEARCH_NAMES[top.slug] ?? getCouncil(top.slug)?.name ?? top.slug : "Scotland";
      return ogStatCard({
        eyebrow: "All 32 Scottish Council Areas Ranked",
        title: "Best Place to Live in Scotland",
        stat: `#1 ${topName}`,
        statTone: "good",
        details: [
          "Ranked on pay, homes, crime, schools, health & poverty",
          "Compare any two Scottish council areas side by side",
          "Built entirely from latest official statistics",
        ],
      });
    }

    case "/cheapest-place-to-live-in-scotland": {
      const top = rankAreas("house_price", "asc")[0];
      const topName = top ? COUNCIL_SEARCH_NAMES[top.slug] ?? getCouncil(top.slug)?.name ?? top.slug : "Scotland";
      return ogStatCard({
        eyebrow: "Housing & Living Costs · All 32 Councils",
        title: "Cheapest Place to Live in Scotland",
        stat: top ? formatMoney(top.value) : "32 areas",
        statTone: "good",
        details: [
          `Lowest average house price: ${topName}`,
          "Compares house prices, private rents & council tax",
          "Official Registers of Scotland & ONS figures",
        ],
      });
    }

    case "/safest-place-to-live-in-scotland": {
      const top = rankAreas("crime_total", "asc")[0];
      const topName = top ? COUNCIL_SEARCH_NAMES[top.slug] ?? getCouncil(top.slug)?.name ?? top.slug : "Scotland";
      return ogStatCard({
        eyebrow: "Recorded Crime Rates · All 32 Councils",
        title: "Safest Place to Live in Scotland",
        stat: `#1 ${topName}`,
        statTone: "good",
        details: [
          top ? `${Math.round(top.value)} recorded crimes per 10,000 people` : "Lowest recorded crime rate in Scotland",
          "Every Scottish council ranked on police figures",
          "Includes violent crime & neighbourhood comparisons",
        ],
      });
    }

    case "/representatives":
      return ogStatCard({
        eyebrow: "Westminster · Scotland's 57 MPs",
        title: "Scottish MPs: Expenses, Votes & Contact Details",
        stat: "57 MPs",
        statTone: "accent",
        details: [
          "Find your MP by postcode or constituency",
          "See 2025/26 expenses, donations & voting record",
          "Email your MP directly with local figures",
        ],
      });

    case "/representatives/msps":
      return ogStatCard({
        eyebrow: "Holyrood · All 129 Scottish MSPs",
        title: "Scottish MSPs: Expenses, Votes & Contact Details",
        stat: "129 MSPs",
        statTone: "accent",
        details: [
          "73 constituency MSPs & 56 regional MSPs",
          "Check Holyrood expenses, roles & public email",
          "Every Scottish Parliament seat & region covered",
        ],
      });

    case "/msp-reviews":
      return ogStatCard({
        eyebrow: "Public Accountability · Holyrood",
        title: "Scottish MSP Reviews",
        stat: "129 MSPs",
        statTone: "amber",
        details: [
          "Read moderated, firsthand experiences of MSP offices",
          "Rate responsiveness, help & casework from 1 to 5",
          "Every constituency & regional MSP listed",
        ],
      });

    case "/areas":
      return ogStatCard({
        eyebrow: "Local Data · Every Council Area",
        title: "Child Poverty & Living Standards by Area",
        stat: "32 areas",
        statTone: "accent",
        details: [
          "Enter your postcode or pick any Scottish council",
          "10-year child poverty trends, pay, crime & schools",
          "Every figure linked to its official source",
        ],
      });

    case "/constituencies":
      return ogStatCard({
        eyebrow: "Westminster Seats · Scotland",
        title: "Child Poverty in All 57 Scottish Constituencies",
        stat: "57 seats",
        statTone: "accent",
        details: [
          "Every UK Parliament seat in Scotland ranked",
          "10-year child poverty trend & who represents it",
          "Official DWP & Loughborough University figures",
        ],
      });

    case "/councils":
      return ogStatCard({
        eyebrow: "Council Accountability · Scotland",
        title: "How All 32 Scottish Councils Perform",
        stat: "32 councils",
        statTone: "accent",
        details: [
          "Overall & like-for-like performance rankings",
          "Budget gaps, Crisis Grants & audit findings",
          "Official LGBF & Audit Scotland evidence",
        ],
      });

    case "/poverty-in-scotland":
      return ogStatCard({
        eyebrow: "Official Scottish Poverty Figures",
        title: "Poverty in Scotland: The Full Picture",
        stat: "17%",
        statTone: "bad",
        details: [
          "Of people in Scotland live in relative poverty",
          "Child poverty, in-work poverty & regional gaps",
          "Plain English answers backed by official data",
        ],
      });

    case "/glasgow-poverty-statistics":
      return ogStatCard({
        eyebrow: "Glasgow Official Data",
        title: "Glasgow Poverty Statistics",
        stat: "36.1%",
        statTone: "bad",
        details: [
          "39,319 children in poverty after housing costs",
          "Pay, employment, SIMD deprivation & life expectancy",
          "Every figure sourced to official releases",
        ],
      });

    default:
      return null;
  }
}

export function renderOgForPath(
  rawPath: string,
  opts: { a?: string; b?: string; title?: string; description?: string } = {},
) {
  const path = rawPath === "/" ? "/" : rawPath.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return ogImage();
  }

  // 1. Comparison pages
  if (path === "/glasgow-vs-edinburgh") {
    return renderCompareOg("glasgow-city", "city-of-edinburgh");
  }
  if (path === "/compare-areas") {
    return renderCompareOg(opts.a ?? COMPARE_DEFAULTS.a, opts.b ?? COMPARE_DEFAULTS.b);
  }

  // 2. MP profile pages: /representatives/mps/[slug]
  if (path.startsWith("/representatives/mps/")) {
    const slug = path.slice("/representatives/mps/".length);
    const mp = getMpByConstituencySlug(slug);
    if (mp) {
      const interests = getMpInterestsByConstituencySlug(slug);
      const seat = getConstituency(slug);
      const latestIdx = CONSTITUENCY_YEARS.length - 1;
      const stats: OgPersonStat[] = [];
      if (interests?.expenses) {
        stats.push({
          value: formatMoney(interests.expenses.nonStaffSpend),
          label: `Non-staff expenses (${interests.expenses.year})`,
          tone: interests.expenses.nonStaffSpend > 90000 ? "bad" : "accent",
        });
      }
      if (interests && interests.totalFinancialValue > 0) {
        stats.push({
          value: formatMoney(interests.totalFinancialValue),
          label: "Declared gifts, trips & pay",
          tone: "amber",
        });
      } else if (interests?.expenses && interests.expenses.accommodationSpend > 0) {
        stats.push({
          value: formatMoney(interests.expenses.accommodationSpend),
          label: "London flat & hotels",
          tone: "white",
        });
      }
      if (seat) {
        stats.push({
          value: `${seat.pcts[latestIdx]}%`,
          label: "Local child poverty",
          tone: seat.change > 0 ? "bad" : "good",
        });
      }
      if (!stats.length) {
        stats.push({ value: mp.party, label: "Party", tone: "accent" });
      }
      return ogPersonCard({
        eyebrow: `Scottish MP · ${mp.party}`,
        name: mp.name,
        roleLine: `MP for ${mp.constituency}`,
        party: mp.party,
        photoPath: mp.photoUrl,
        stats,
      });
    }
  }

  // 3. Constituency MSP pages: /representatives/msps/constituencies/[slug]
  if (path.startsWith("/representatives/msps/constituencies/")) {
    const slug = path.slice("/representatives/msps/constituencies/".length);
    const rec = getHolyroodConstituencyBySlug(slug);
    if (rec) {
      const expenses = getMspInterests(rec.msp.memberId)?.holyroodExpenses;
      const stats: OgPersonStat[] = [];
      if (expenses && expenses.total2425 > 0) {
        stats.push({
          value: formatMoney(expenses.total2425),
          label: "Holyrood expenses (2024/25)",
          tone: "accent",
        });
      }
      if (expenses && expenses.edinburghAcc2425 > 0) {
        stats.push({
          value: formatMoney(expenses.edinburghAcc2425),
          label: "Edinburgh accommodation",
          tone: "amber",
        });
      } else if (expenses && expenses.total4Yr > 0) {
        stats.push({
          value: formatMoney(expenses.total4Yr),
          label: "4-year expenses total",
          tone: "white",
        });
      }
      stats.push({
        value: rec.region,
        label: "Scottish Parliament region",
        tone: "white",
      });

      return ogPersonCard({
        eyebrow: `Constituency MSP · ${rec.msp.party}`,
        name: rec.msp.name,
        roleLine: `MSP for ${rec.constituency}`,
        party: rec.msp.party,
        photoPath: rec.msp.photoUrl,
        stats,
      });
    }
  }

  // 4. Regional MSP pages & Region index pages: /representatives/msps/regions/[slug](/[person])
  if (path.startsWith("/representatives/msps/regions/")) {
    const parts = path.slice("/representatives/msps/regions/".length).split("/");
    if (parts.length === 2) {
      const region = getHolyroodRegionBySlug(parts[0]);
      const msp = getHolyroodRegionalMsp(parts[0], parts[1]);
      if (region && msp) {
        const expenses = getMspInterests(msp.memberId)?.holyroodExpenses;
        const stats: OgPersonStat[] = [];
        if (expenses && expenses.total2425 > 0) {
          stats.push({
            value: formatMoney(expenses.total2425),
            label: "Holyrood expenses (2024/25)",
            tone: "accent",
          });
        }
        if (expenses && expenses.edinburghAcc2425 > 0) {
          stats.push({
            value: formatMoney(expenses.edinburghAcc2425),
            label: "Edinburgh accommodation",
            tone: "amber",
          });
        } else if (expenses && expenses.total4Yr > 0) {
          stats.push({
            value: formatMoney(expenses.total4Yr),
            label: "4-year expenses total",
            tone: "white",
          });
        }
        stats.push({
          value: "Regional MSP",
          label: region.region,
          tone: "white",
        });

        return ogPersonCard({
          eyebrow: `Regional MSP · ${msp.party}`,
          name: msp.name,
          roleLine: `MSP for ${region.region}`,
          party: msp.party,
          photoPath: msp.photoUrl,
          stats,
        });
      }
    } else if (parts.length === 1) {
      const region = getHolyroodRegionBySlug(parts[0]);
      if (region) {
        const seatCount = holyroodConstituencies.filter((c) => c.regionSlug === region.regionSlug).length;
        const parties = [...new Set(region.msps.map((m) => m.party))].slice(0, 3).join(", ");
        return ogStatCard({
          eyebrow: "Scottish Parliament Region · Holyrood",
          title: `Regional MSPs for ${region.region}`,
          stat: `${region.msps.length} MSPs`,
          statTone: "accent",
          details: [
            `Covering ${seatCount} constituency seats in ${region.region}`,
            `Parties represented: ${parties}`,
            "Public emails, voting records & Holyrood expenses",
          ],
        });
      }
    }
  }

  // 5. MSP review pages: /msp-reviews/[slug]
  if (path.startsWith("/msp-reviews/")) {
    const slug = path.slice("/msp-reviews/".length);
    const profile = getMspReviewProfile(slug);
    if (profile) {
      return ogPersonCard({
        eyebrow: `MSP Reviews · ${profile.msp.party}`,
        name: profile.msp.name,
        roleLine: `${profile.representation === "regional" ? "Regional" : "Constituency"} MSP for ${profile.areas.join(", ")}`,
        party: profile.msp.party,
        photoPath: profile.msp.photoUrl,
        stats: [
          { value: "1 to 5", label: "Moderated public ratings", tone: "amber" },
          { value: profile.msp.party, label: "Party at Holyrood", tone: "white" },
        ],
      });
    }
  }

  // 6. Council accountability pages: /councils/[slug]
  if (path.startsWith("/councils/")) {
    const slug = path.slice("/councils/".length);
    const rec = getCouncilAccountability(slug);
    const perf = councilPerformanceBySlug[slug];
    if (rec && perf) {
      const tone = perf.overallRank <= 10 ? "good" : perf.overallRank >= 23 ? "bad" : "accent";
      return ogStatCard({
        eyebrow: "Council Performance & Budget · Scotland",
        title: rec.councilName,
        stat: `#${perf.overallRank} of 32`,
        statTone: tone,
        details: [
          `Like-for-like peer rank: #${perf.peerRank} of 32`,
          `Resident verdict: ${perf.residentVerdict.average.toFixed(0)}% positive (rank #${perf.residentVerdict.rank})`,
          "Services, budget gap, Crisis Grants & official audits",
        ],
      });
    }
  }

  // 7. Glasgow indicator pages: /indicators/[slug]
  if (path.startsWith("/indicators/")) {
    const slug = path.slice("/indicators/".length);
    const preset = INDICATOR_STATS[slug];
    if (preset) {
      return ogStatCard({
        eyebrow: "Glasgow Official Indicator",
        title: preset.title,
        stat: preset.stat,
        statTone: preset.tone,
        details: preset.details,
      });
    }
    const ind = getIndicator(slug);
    const fallbackTitle =
      ind?.title ??
      (slug === lifeExpectancy.slug
        ? lifeExpectancy.title
        : slug === deprivation.slug
          ? deprivation.title
          : null);
    if (fallbackTitle) {
      return ogPageCard({
        eyebrow: "Scotland Counted Indicator",
        title: fallbackTitle,
        description: ind?.summary,
      });
    }
  }

  // 8. Blog post pages: /blog/[slug]
  if (path.startsWith("/blog/") && !path.startsWith("/blog/category/")) {
    const slug = path.slice("/blog/".length);
    if (getPost(slug)) return renderPostOg(slug);
  }

  // 9. Blog category pages: /blog/category/[category]
  if (path.startsWith("/blog/category/")) {
    const slug = path.slice("/blog/category/".length);
    const cat = getPostCategory(slug);
    if (cat) {
      return ogPageCard({
        eyebrow: "Scotland Counted · Explainers & Investigations",
        title: cat.name,
        description: cat.description,
      });
    }
  }

  // 10. Static rich hub / tool cards
  const staticCard = renderStaticRouteOg(path);
  if (staticCard) return staticCard;

  // 11. Top-level exact-match dynamic routes: /[slug]
  const topSlug = path.slice(1);
  if (!topSlug.includes("/")) {
    const target = resolveTopLevel(topSlug);
    if (target) {
      if (target.kind === "council-tax") {
        const card = renderCouncilTaxOg(target.councilSlug);
        if (card) return card;
      }
      if (target.kind === "council-tax-band") {
        const card = renderCouncilTaxBandOg(target.letter);
        if (card) return card;
      }
      if (target.kind === "salary") {
        return renderSalaryOg(target.amount);
      }
      if (target.kind === "post") {
        return renderPostOg(target.postSlug);
      }
    }
  }

  // 12. Clean branded fallback for any other static or future page (never the 17% card!)
  const humanTitle =
    opts.title ||
    path
      .slice(1)
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase()) ||
    "Scotland Counted";

  return ogPageCard({
    eyebrow: "Scotland Counted · Official Data in Plain English",
    title: humanTitle,
    description:
      opts.description ||
      "Independent public data on poverty, pay, council services and politicians across Scotland.",
  });
}

// Re-export counts used by tests to verify every route is covered
export const OG_ROUTE_COUNTS = {
  mps: mps.length,
  holyroodConstituencies: holyroodConstituencies.length,
  holyroodRegions: holyroodRegions.length,
};
