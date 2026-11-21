import Image from "next/image";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA, Callout } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import {
  JsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  datasetJsonLd,
  faqJsonLd,
  imageJsonLd,
  meta,
} from "@/lib/seo";
import { mpInterests, MP_INTERESTS_CHECKED_ISO, MP_INTERESTS_TOTALS } from "@/lib/data/mpInterests";
import { mps } from "@/lib/data/mps";
import { CONSTITUENCY_YEARS, getConstituency } from "@/lib/data/constituencies";
import MpInterestsExplorer from "./MpInterestsExplorer";
import FindMpClaims from "@/components/FindMpClaims";

const HERO_IMAGE = {
  src: "/images/editorial/refresh-court-records.webp",
  alt: "Open official parliamentary folders and financial ledgers on a wooden desk for the Scottish MP Register of Interests and IPSA Expenses",
  caption:
    "In 2025/26, Scottish MPs billed taxpayers £18.32 million in IPSA expenses (including £1.38m on London second home rent and £81,647 on second home council tax), on top of £296,895 in private donations, funded foreign visits and VIP hospitality.",
  width: 1500,
  height: 1000,
};

const PUBLISHED_ISO = "2026-11-21";
const MODIFIED_ISO = "2026-11-21";

export const metadata = meta({
  title: "MP Expenses Scotland & Register of Interests: All 57 Ranked",
  description:
    "See which Scottish MPs billed taxpayers £37k for London hotels, £6k for car parking, and £4k for 2nd home council tax while local families face rising bills.",
  path: "/mp-expenses-scotland",
  type: "article",
  published: PUBLISHED_ISO,
  modified: MODIFIED_ISO,
  image: HERO_IMAGE.src,
  imageAlt: HERO_IMAGE.alt,
  imageWidth: HERO_IMAGE.width,
  imageHeight: HERO_IMAGE.height,
  imageType: "image/webp",
});

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const poundsExact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

type SpotlightEntry = {
  slug: string;
  badge: string;
  headlineStat: string;
  headlineLabel: string;
  taxpayerSummary: string;
  freebiesSummary: string;
  localContrastNote?: string;
  emailReason: string;
};

const SPOTLIGHT_LEADERS: SpotlightEntry[] = [
  {
    slug: "dunfermline-and-dollar",
    badge: "#1 Highest Expense Claimant",
    headlineStat: "£151,954",
    headlineLabel: "billed to taxpayers on top of staff wages (£410,253 total)",
    taxpayerSummary:
      "£41,435 London flat rent (£3,453/month, triple a typical £1,050/month Scottish rent), £1,695 second home council tax, £29,820 for flights and £3,308 for airport parking.",
    freebiesSummary:
      "Declared £11,882 in funded foreign trips to Taiwan (£5,669), the USA (£4,077) and Spain (£2,137).",
    emailReason:
      "claiming £151,953.90 in non-staff expenses, including £41,435 for a London flat, £29,820 for flights and £3,308 for airport parking, on top of your £93,904 salary, alongside £11,882 in funded trips to Taiwan, Spain and the US",
  },
  {
    slug: "glasgow-south-west",
    badge: "#1 Hotel Bill (£37,359) + £30k Donation",
    headlineStat: "£37,359",
    headlineLabel: "billed to taxpayers for 295 nights in London hotels in one year",
    taxpayerSummary:
      "Instead of renting a flat, billed taxpayers £37,358.58 for 295 nights in London hotels (nearly double the £20,850 a full time Minimum Wage worker takes home in a year), plus £8,351 for flights and £4,204 for family travel.",
    freebiesSummary:
      "Declared a £30,000 private donation from Francesca Sainsbury Perrin plus £13,890 in outside surgeon payments.",
    emailReason:
      "charging taxpayers £37,358.58 for 295 nights in London hotels and £4,204.44 for family travel in a single year, while also receiving £30,000 in private donor funding",
  },
  {
    slug: "dundee-central",
    badge: "#1 Car Parking Bill (£6,292) & #2 Overall",
    headlineStat: "£129,066",
    headlineLabel: "in non-staff expenses, including £6,292 just for car parking",
    taxpayerSummary:
      "£6,292.29 for car parking alone (£121 every week of the year), on top of £28,200 (£2,350/month) for a rented London flat, £1,260 for his flat energy bills, £2,822 for hotels in Europe and £26,581 for flights.",
    freebiesSummary:
      "Declared two funded overseas trips to India worth £1,898 paid for by the Office of Tibet and the International Buddhist Confederation.",
    emailReason:
      "billing taxpayers £6,292.29 for car parking alone, on top of £28,200 a year for a rented London flat and £1,260.25 for your second home energy bills",
  },
  {
    slug: "west-aberdeenshire-and-kincardine",
    badge: "Voted to Keep 2-Child Cap + £121k Expenses",
    headlineStat: "£121,471",
    headlineLabel: "in non-staff expenses + £20k donor & Silverstone F1 VIP box",
    taxpayerSummary:
      "£32,480 for London flat rent (£2,707/month), £1,541 for second home council tax, £33,100 for flights, £1,501 for family flights and £1,293 for taxis.",
    freebiesSummary:
      "Voted against scrapping the two child benefit cap, while taking £20,000 from businessman Alasdair Locke, £1,100 in Silverstone F1 VIP tickets, and a £2,678 Jordan trip.",
    localContrastNote: "Voted No to removing the two child benefit limit on Universal Credit.",
    emailReason:
      "voting against removing the two child benefit cap on Universal Credit while claiming £121,470.92 in non-staff expenses (including £32,480 in flat rent, £1,541 in second home council tax and £1,501 for your own family travel) and accepting £1,100 in Silverstone Formula 1 hospitality",
  },
  {
    slug: "livingston",
    badge: "#1 Taxi Tab (£5,059) + £3,630 Council Tax",
    headlineStat: "£115,008",
    headlineLabel: "in rent, travel & Scotland's highest MP taxi tab",
    taxpayerSummary:
      "£5,059.35 for taxis (nearly £100 a week on cabs), £3,629.54 for his second home council tax (nearly double a typical Scottish Band D bill), £1,611 for second home energy bills, £20,800 for flat rent, and £6,232 for family flights.",
    freebiesSummary:
      "Declared £11,000 in private donations plus £1,110 in free VIP tickets to Lord's Cricket Ground and the Carabao Cup Final at Wembley.",
    emailReason:
      "billing taxpayers £5,059.35 for taxi fares, £3,629.54 for your second home council tax, £1,611.21 for your second home utility bills and £6,232.41 for family flights, while accepting £1,110 in free Lord's cricket and Wembley football tickets",
  },
  {
    slug: "cowdenbeath-and-kirkcaldy",
    badge: "#1 Family Travel (£7,932) + Qatar & Syria Trips",
    headlineStat: "£101,035",
    headlineLabel: "in non-staff expenses + £9,259 in foreign trips & courses",
    taxpayerSummary:
      "£7,932.47 for family travel (including £7,607.27 for family flights, highest in Scotland), £3,302.72 for second home council tax, £1,039 for second home energy bills, and £19,140 in flat rent (£1,595/month vs ~£795/month Fife average).",
    freebiesSummary:
      "Declared a £5,957 trip to Qatar funded by the Doha Forum, a £2,202 trip to Syria, and a £1,100 Great Britain China Centre course.",
    emailReason:
      "billing taxpayers £7,932.47 for family travel, £3,302.72 for your second home council tax and £1,038.75 for your second home energy bills on top of £19,140 in flat rent, alongside a £5,957 trip to Qatar funded by the Doha Forum",
  },
];

const MORE_SPOTLIGHT_LEADERS: SpotlightEntry[] = [
  {
    slug: "glasgow-east",
    badge: "£42,000 Flat Rent + £7,000 Qatar Trip",
    headlineStat: "£96,187",
    headlineLabel: "in non-staff expenses + £7,000 Qatar Ministry trip",
    taxpayerSummary:
      "£42,000.00 for London flat rent (highest in Scotland at £3,500/month, more than triple a typical Glasgow rent), plus £2,486.44 for second home council tax, £949 for second home energy bills, £1,379 for family travel and £1,081 for taxis.",
    freebiesSummary:
      "Accepted a £7,000.00 trip to Qatar paid for by the Ministry of Foreign Affairs of Qatar, plus a £330 banquet ticket.",
    emailReason:
      "charging taxpayers £42,000 a year (£3,500 a month) for London flat rent and £2,486.44 for your second home council tax, and accepting a £7,000 trip paid for by the Ministry of Foreign Affairs of Qatar",
  },
  {
    slug: "argyll-bute-and-south-lochaber",
    badge: "Spouse on Public Payroll + Football VIP Boxes",
    headlineStat: "£114,985",
    headlineLabel: "in non-staff expenses + spouse employed as Office Manager",
    taxpayerSummary:
      "£29,322 for London flat rent (£2,443/month), £990 for council tax, £943 for energy bills, £2,010 for family flights and £3,109 for car parking, plus employs his spouse full time as Office Manager.",
    freebiesSummary:
      "Declared £1,525 in VIP football hospitality from Enersoft International (Tottenham v Dortmund Champions League + Hampden Cup Final) and £2,541 in foreign trips.",
    emailReason:
      "claiming £114,984.88 in non-staff expenses (including £29,322 flat rent and £3,109 for car parking), employing your spouse on the public payroll, and accepting £1,525 in Champions League and Hampden football hospitality",
  },
  {
    slug: "east-kilbride-and-strathaven",
    badge: "£2,400 Freebie From Her Husband's Own Firm",
    headlineStat: "£85,563",
    headlineLabel: "in non-staff expenses + husband is a lobbyist",
    taxpayerSummary:
      "£31,366 for London flat rent (£2,614/month), £9,906 for flights and £3,941 for family flights (£348,096 total including staff). Also declares rental property income.",
    freebiesSummary:
      "Declared £2,400 of free media training (coaching on how to handle TV and press interviews) from Earthcott Ltd. Companies House shows Earthcott is her husband David Taylor's own firm: he is its only director and owns over 75% of it. She also declares that he is a lobbyist. So a perk worth £2,400 came from her husband's business, on top of £4,700 she billed taxpayers in 2025/26 for PR and website work from Causeway Creative (£24,664 since 2024, more than any other MP in the UK).",
    emailReason:
      "claiming £85,563.46 in non-staff expenses (including £31,366 for flat rent and £3,941 for family flights) while accepting £2,400 of free media training from Earthcott Ltd, the PR firm owned and run by your husband, a lobbyist",
  },
];

const FAQ = [
  {
    q: "How much is an MP's salary?",
    a: "An MP's basic salary is £98,599 a year from April 2026, set by IPSA, the independent body that decides MPs' pay. It was £93,904 in 2025/26 and £91,346 in 2024/25. Expenses for offices, staff, travel and second homes are paid on top of the salary, not out of it.",
  },
  {
    q: "How much did Scottish MPs claim in taxpayer expenses in 2025/26?",
    a: `According to the official IPSA 2025/26 annual dataset, Scotland's MPs claimed £18,323,504.06 in total parliamentary expenses and staffing costs. Stripping out staffing costs (£13.11m), Scottish MPs claimed £5,210,950.38 for their own London flats, hotels, flights, taxis, second home council tax, energy bills and offices.`,
  },
  {
    q: "Do Scottish MPs claim their second home council tax and energy bills on expenses?",
    a: "Yes. In addition to their £93,904 basic salary, 47 Scottish MPs billed taxpayers £81,646.92 to pay the council tax on their second homes in 2025/26, led by Douglas Alexander MP (£4,093.21), Gregor Poynton MP (£3,629.54) and Melanie Ward MP (£3,302.72). Thirty eight Scottish MPs also billed taxpayers £39,218.00 for their second home heating, electricity and water bills, led by Angus MacDonald MP (£3,314.09) and Ian Murray MP (£3,197.22).",
  },
  {
    q: "Which Scottish MPs voted against removing the two child benefit cap while claiming second home bills and family travel?",
    a: "Five Scottish Conservative MPs (Andrew Bowie, John Lamont, David Mundell, John Cooper and Harriet Cross) voted against removing the two child benefit limit on Universal Credit in February 2026. In the 2025/26 IPSA dataset, those same five MPs claimed £497,461 in non-staff expenses between them, including £144,680 in London flat rent, £6,766 in second home council tax, £4,033 in second home heating and utilities, £8,566 in family travel and £3,202 in airport parking, while David Mundell declared £11,100 from the Coalition for Global Prosperity and Andrew Bowie declared £20,000 from businessman Alasdair Locke plus £1,100 in Silverstone Formula 1 hospitality.",
  },
  {
    q: "Who pays for Scottish MPs' overseas trips and VIP hospitality?",
    a: "On the Register of Interests, Scottish MPs declared 33 funded overseas visits worth £76,556.68, paid for by the Ministry of Foreign Affairs of Qatar (£7,000 for John Grady MP), the Doha Forum (£5,957 for Melanie Ward MP), the Great Britain China Centre (£6,421 for Elaine Stewart MP and £4,763 for Alan Gemmell MP), the Ministry of Foreign Affairs of Taiwan (£5,669 for Graeme Downie MP), Yachad (£2,169 for Patricia Ferguson MP to visit Palestine), and the Embassy of Jordan (£2,678 for Andrew Bowie MP). Declared hospitality includes Silverstone Formula 1 tickets (£1,860 for Dave Doogan MP and £1,100 for Andrew Bowie MP), Champions League and Hampden boxes (£1,525 for Brendan O'Hara MP) and Murrayfield rugby boxes (£1,298 for Christine Jardine MP).",
  },
  {
    q: "Which Scottish MPs are married to a lobbyist?",
    a: "Two of Scotland's 57 MPs declare a husband who works as a lobbyist, and both are Scottish Labour. Joani Reid MP (East Kilbride and Strathaven) declares her husband David Taylor, who owns and runs Earthcott Ltd. Earthcott gave her £2,400 of free media training in February 2026 and is not on the official Register of Consultant Lobbyists, so his clients are not public. Johanna Baxter MP (Paisley and Renfrewshire South) declares her husband Mark Henry Glover, Executive Chairman of SEC Newgate UK, whose lobbying clients in July to September 2026 included gas network Cadent and Infinis Energy. MPs must declare close family members who lobby, so this is the full official list.",
  },
  {
    q: "Can I write to my MP and ask them to explain their expense claims?",
    a: "Yes. Every MP represents everyone in their constituency, whether you voted for them or not. Click 'Ask to explain by email' on any card above, or open your MP's profile page, and we pre-fill a polite, factual email with their exact 2025/26 expense claims, registered donations and local child poverty figures so you can ask for their response.",
  },
];

function renderSpotlightCard(card: SpotlightEntry) {
  const mp = mps.find((m) => m.constituencySlug === card.slug);
  const c = getConstituency(card.slug);
  if (!mp || !c) return null;

  const latestIdx = CONSTITUENCY_YEARS.length - 1;
  const povPct = c.pcts[latestIdx];
  const povCount = c.counts[latestIdx];

  const subject = `Question from a constituent: your 2025/26 expenses and registered interests (${mp.constituency})`;
  const body = `Dear ${mp.name},\n\nI am writing as a constituent in ${mp.constituency} to ask how you explain ${card.emailReason}, according to the 2025/26 IPSA and Register of Interests records.\n\nIn ${mp.constituency}, an estimated ${povCount.toLocaleString("en-GB")} children (${povPct}%) are living in poverty after housing costs, and local households are paying rising council tax, energy bills and rent out of their own wages.\n\nCould you explain why taxpayers should pick up the bill for these costs on top of your £93,904 MP salary?\n\nYours sincerely,\n[Your name]\n[Your address and postcode in ${mp.constituency}]`;
  const mailto = `mailto:${mp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <article key={card.slug} className="tile flex flex-col overflow-hidden">
      {/* Top band: who, and the one number */}
      <div className="relative border-b border-[var(--rule)] bg-[linear-gradient(160deg,var(--surface-2),var(--surface)_70%)] px-5 pb-5 pt-4">
        <span className="ui inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--bad)_12%,transparent)] px-2.5 py-1 text-[12px] font-[660] text-[var(--bad-text)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--bad)]" />
          {card.badge}
        </span>

        <div className="mt-3.5 flex items-center gap-3.5">
          {mp.photoUrl && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--surface-2)] ring-2 ring-[var(--surface)] shadow-[0_0_0_1px_var(--rule-strong)]">
              <Image
                src={mp.photoUrl}
                alt={`${mp.name}, ${mp.party} MP for ${mp.constituency}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="ui text-[18px] font-[680] leading-[1.2] text-[var(--ink)]">
              <Link
                href={`/representatives/mps/${mp.constituencySlug}#donations-and-interests`}
                className="no-underline hover:underline"
              >
                {mp.name}
              </Link>
            </h3>
            <p className="ui mt-0.5 text-[13px] text-[var(--muted)]">
              {mp.party} · {mp.constituency}
            </p>
          </div>
        </div>

        <p className="figure-num tnum mt-4 text-[clamp(34px,3.2vw,40px)] leading-none text-[var(--bad-text)]">
          {card.headlineStat}
        </p>
        <p className="ui mt-1.5 text-[13.5px] leading-[1.4] text-[var(--ink-2)]">
          {card.headlineLabel}
        </p>
      </div>

      {/* Body: the detail */}
      <ExplainText>
        <dl className="flex-1 space-y-3.5 px-5 py-5 text-[14px] leading-[1.5] text-[var(--ink-2)]">
          <div>
            <dt className="tile-key mb-1">Billed to taxpayers</dt>
            <dd>{card.taxpayerSummary}</dd>
          </div>
          <div>
            <dt className="tile-key mb-1">Donations & perks declared</dt>
            <dd>{card.freebiesSummary}</dd>
          </div>
          <div className="rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-3.5 py-2.5">
            <dt className="tile-key mb-1">Meanwhile in {mp.constituency}</dt>
            <dd>
              <Link
                href={`/constituencies/${mp.constituencySlug}`}
                className="font-[640] text-[var(--action-text)]"
              >
                {povCount.toLocaleString("en-GB")} children ({povPct}%)
              </Link>{" "}
              live in poverty after housing costs.
              {card.localContrastNote ? ` ${card.localContrastNote}` : ""}
            </dd>
          </div>
        </dl>
      </ExplainText>

      <div className="flex flex-col gap-2 border-t border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4">
        <a
          href={mailto}
          className="btn btn-primary w-full justify-center text-center text-[14.5px]"
        >
          Ask {mp.name.replace(/^Mr |^Dr /, "")} to explain
        </a>
        <Link
          href={`/representatives/mps/${mp.constituencySlug}#donations-and-interests`}
          className="ui text-center text-[13.5px] font-[600] text-[var(--action-text)] no-underline hover:underline"
        >
          Full receipts & voting record →
        </Link>
      </div>
    </article>
  );
}

export default function MpRegisterOfInterestsScotlandPage() {
  const allDonations = mpInterests
    .flatMap((mp) =>
      mp.donations.map((d) => ({
        mpName: mp.name,
        party: mp.party,
        slug: mp.constituencySlug,
        ...d,
      })),
    )
    .sort((a, b) => b.value - a.value);

  const allVisits = mpInterests
    .flatMap((mp) =>
      mp.visits.map((v) => ({
        mpName: mp.name,
        party: mp.party,
        slug: mp.constituencySlug,
        ...v,
      })),
    )
    .sort((a, b) => b.value - a.value);

  const allGifts = mpInterests
    .flatMap((mp) =>
      mp.gifts.map((g) => ({
        mpName: mp.name,
        party: mp.party,
        slug: mp.constituencySlug,
        ...g,
      })),
    )
    .sort((a, b) => b.value - a.value);

  const EYE_OPENING_EXPENSES = [
    [
      "London second home rent",
      poundsExact.format(MP_INTERESTS_TOTALS.secondHomeRent),
      "49 of 55 MPs",
      "John Grady (£42,000.00), Graeme Downie (£41,434.53), Kirsty Blackman (£39,951.21)",
    ],
    [
      "MP air travel (flights)",
      poundsExact.format(MP_INTERESTS_TOTALS.flights),
      "55 of 55 MPs",
      "Alistair Carmichael (£35,437.22), Andrew Bowie (£33,100.15), Graeme Downie (£29,819.74)",
    ],
    [
      "London hotel rooms (the MP's own)",
      poundsExact.format(MP_INTERESTS_TOTALS.londonHotels),
      "8 of 55 MPs",
      "Dr Zubir Ahmed (£37,358.58), Alison Taylor (£5,370.00), Alan Gemmell (£1,565.35)",
    ],
    [
      "Family & spouse flights / trains",
      poundsExact.format(MP_INTERESTS_TOTALS.dependantTravel),
      "35 of 55 MPs",
      "Melanie Ward (£7,932.47), Kirsty Blackman (£7,307.88), Alistair Carmichael (£6,301.65)",
    ],
    [
      "Second home council tax (billed to public)",
      poundsExact.format(MP_INTERESTS_TOTALS.secondHomeCouncilTax),
      "47 of 55 MPs",
      "Douglas Alexander (£4,093.21), Gregor Poynton (£3,629.54), Melanie Ward (£3,302.72)",
    ],
    [
      "Airport & station car parking",
      poundsExact.format(MP_INTERESTS_TOTALS.parking),
      "35 of 55 MPs",
      "Chris Law (£6,292.29), Graeme Downie (£3,308.30), John Lamont (£3,196.71)",
    ],
    [
      "Taxis & cab fares (the MP's own)",
      poundsExact.format(MP_INTERESTS_TOTALS.taxis),
      "46 of 55 MPs",
      "Gregor Poynton (£5,059.35), Blair McDougall (£2,895.01), Alan Gemmell (£2,468.09)",
    ],
    [
      "Second home heating & electricity bills",
      poundsExact.format(MP_INTERESTS_TOTALS.secondHomeUtilities),
      "38 of 55 MPs",
      "Angus MacDonald (£3,314.09), Ian Murray (£3,197.22), Christine Jardine (£1,950.42)",
    ],
  ];

  /** The headline figure shown on each contrast card, keyed by its topic. */
  const JUXTAPOSITION_FIGURES: Record<string, { value: string; label: string }> = {
    "Energy & heating bills": {
      value: "£39,218",
      label: "second home energy bills",
    },
    "Council tax bills": { value: "£81,647", label: "second home council tax" },
    "Child support & family costs": {
      value: "£89,111",
      label: "family travel to London",
    },
    "Personal cash & housing": { value: "£1.38m", label: "London flat rent" },
  };

  const JUXTAPOSITION_ROWS = [
    [
      "Energy & heating bills",
      <>
        38 Scottish MPs billed taxpayers <strong>£39,218.00</strong> for their second home gas,
        electricity and water bills (up to <strong>£3,314</strong> for a single MP).
      </>,
      <>
        Scottish households face a{" "}
        <Link href="/energy-price-cap-scotland">£2,166 typical energy price cap</Link>. Low income
        families are not even given the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> automatically in
        Scotland and must apply before supplier pots run out, or rely on the{" "}
        <Link href="/winter-heating-payment">£59.75 Winter Heating Payment</Link>.
      </>,
    ],
    [
      "Council tax bills",
      <>
        47 Scottish MPs billed taxpayers <strong>£81,646.92</strong> to pay the council tax on their
        second homes (led by Douglas Alexander MP on <strong>£4,093.21</strong> and Gregor Poynton
        MP on <strong>£3,629.54</strong>).
      </>,
      <>
        Households across Scotland faced{" "}
        <Link href="/council-tax-increase-scotland">steep council tax rises</Link> and have to apply
        for <Link href="/council-tax-reduction-scotland">means-tested Council Tax Reduction</Link>{" "}
        if their wages cannot cover the bill.
      </>,
    ],
    [
      "Child support & family costs",
      <>
        35 Scottish MPs billed taxpayers <strong>£89,110.80</strong> for their spouses and children
        to fly or take the train to London (up to <strong>£7,932</strong> for one MP). Five Scottish
        MPs voted <strong>against</strong> scrapping the two child benefit cap while claiming{" "}
        <strong>£497,461</strong> in non-staff expenses between them.
      </>,
      <>
        Around <Link href="/poverty-in-scotland">240,000 children in Scotland live in poverty</Link>{" "}
        after housing costs. Families running out of money for food or prepaid meters have to apply
        for an emergency{" "}
        <Link href="/crisis-grant-scotland">Scottish Welfare Fund Crisis Grant</Link> or rely on the{" "}
        <Link href="/scottish-child-payment">£28.20 Scottish Child Payment</Link>.
      </>,
    ],
    [
      "Personal cash & housing",
      <>
        49 MPs claimed <strong>£1,383,619.92</strong> for London flat rent (up to{" "}
        <strong>£42,000 a year</strong>), 8 MPs claimed <strong>£45,614.77</strong> for their own London
        hotel stays (up to <strong>£37,359</strong> for Dr Zubir Ahmed MP), and 10 MPs received{" "}
        <strong>£205,242.29</strong> in private donor funding (up to <strong>£30,000</strong> each).
      </>,
      <>
        A full-time worker on the{" "}
        <Link href="/minimum-wage-scotland">Minimum Wage in Scotland</Link> takes home roughly
        £20,850 a year after tax and pays every penny of their rent, council tax, heating and bus or
        train fares out of that pay packet.
      </>,
    ],
  ];

  const PARTY_TALLY_ROWS = [
    [
      <strong key="lab">Scottish Labour</strong>,
      "37 MPs (65% of seats)",
      "£3,343,933 (£90,377/MP)",
      "£59,231 (73% of total)",
      "£44,605 (98% of total, mostly one MP)",
      "£24,976 taxis · £58,905 family",
      <strong key="lab-free" className="text-[var(--bad-text)]">
        £169,931 (£105.6k donors · £57.3k trips)
      </strong>,
    ],
    [
      <strong key="snp">Scottish National Party (SNP)</strong>,
      "8 MPs (7 in 2025/26 IPSA)",
      "£778,624 (£111,232/MP)",
      "£7,761",
      "£716",
      "£6,024 taxis · £19,749 family",
      "£11,902 (£0 donors · £7.5k trips · £4.4k gifts)",
    ],
    [
      <strong key="con">Scottish Conservatives</strong>,
      "6 MPs (5 in 2025/26 IPSA)",
      "£523,512 (£104,702/MP)",
      "£7,218",
      "£294",
      "£2,436 taxis · £1,501 family",
      <strong key="con-free">£80,001 (£71.1k donors · £6.9k trips)</strong>,
    ],
    [
      <strong key="ld">Scottish Liberal Democrats</strong>,
      "6 MPs",
      "£564,881 (£94,147/MP)",
      "£7,437",
      "£0",
      "£5,819 taxis · £8,654 family",
      "£35,061 (£28.6k donors · £4.9k trips)",
    ],
  ];

  /** Two simple bar charts drawn from the party tally table below them. */
  const PARTY_BARS = [
    {
      kicker: "Average per MP · 2025/26",
      title: "Non-staff expenses per MP (rent, travel, hotels, office)",
      rows: [
        { party: "SNP", value: 111232, display: "£111,232", colour: "#e8b500" },
        {
          party: "Conservative",
          value: 104702,
          display: "£104,702",
          colour: "#0a7ad6",
        },
        {
          party: "Lib Dem",
          value: 94147,
          display: "£94,147",
          colour: "#f39200",
        },
        {
          party: "Labour",
          value: 90377,
          display: "£90,377",
          colour: "#d6202a",
        },
      ],
    },
    {
      kicker: "Register of Interests · Total",
      title: "Private donations, funded trips and gifts declared",
      rows: [
        {
          party: "Labour",
          value: 169931,
          display: "£169,931",
          colour: "#d6202a",
        },
        {
          party: "Conservative",
          value: 80001,
          display: "£80,001",
          colour: "#0a7ad6",
        },
        {
          party: "Lib Dem",
          value: 35061,
          display: "£35,061",
          colour: "#f39200",
        },
        { party: "SNP", value: 11902, display: "£11,902", colour: "#e8b500" },
      ],
    },
  ];

  const JUMP_LINKS = [
    { href: "/mp-expenses-scotland/receipts", label: "The receipts" },
    { href: "#two-sets-of-rules", label: "MPs vs families" },
    { href: "#party-tally", label: "By party" },
    { href: "#top-claimants", label: "Spotlight" },
    { href: "#leaderboard", label: "All 57 MPs" },
    { href: "#full-lists", label: "Full lists" },
    { href: "#faq", label: "Questions" },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Scottish MPs", path: "/representatives" },
          {
            name: "MP Expenses & Register of Interests",
            path: "/mp-expenses-scotland",
          },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "MP Expenses and Register of Interests Scotland: All 57 MPs Ranked",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />
      <JsonLd
        data={articleJsonLd({
          headline:
            "MP Expenses & Register of Interests Scotland: Every Scottish MP Ranked on Taxpayer Claims, Second Home Bills, Foreign Trips and Freebies",
          description:
            "Search and compare all 57 Scottish MPs across £18.32 million in 2025/26 IPSA taxpayer expenses (second home rent, council tax, energy bills, hotels, taxis) and £296,895 in private donations, foreign trips and corporate gifts.",
          path: "/mp-expenses-scotland",
          published: PUBLISHED_ISO,
          modified: MODIFIED_ISO,
          image: HERO_IMAGE.src,
          section: "Scottish MPs",
          keywords: [
            "mp expenses",
            "mp expenses list",
            "mp expenses scotland",
            "mp expenses scandal",
            "mp register of interests",
            "mps register of interests",
          ],
          schemaType: "Article",
        })}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Scottish MPs IPSA Expenses (2025/26) & Register of Financial Interests (All 57 Constituencies)",
          description:
            "Complete structured extract of IPSA 2025/26 annual expenses and the UK Parliament Register of Members' Financial Interests for all 57 Scottish MPs.",
          path: "/mp-expenses-scotland",
          keywords: [
            "MP expenses Scotland",
            "MP register of interests Scotland",
            "Scottish MP donations",
            "MP gifts and hospitality",
            "MP foreign trips",
          ],
          temporalCoverage: "2024/2026",
          spatialCoverage: "Scotland",
          dateModified: MP_INTERESTS_CHECKED_ISO,
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`MP expenses · Checked ${new Date(MP_INTERESTS_CHECKED_ISO).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
          title="MP expenses, donations and freebies in Scotland: all 57 MPs ranked"
          stat={{
            value: "£5.21m",
            label:
              "billed by Scotland's MPs in 2025/26 for flats, travel, hotels and offices, on top of a £93,904 salary and £13.11m in staffing costs.",
            tone: "bad",
          }}
          lede="MPs were paid a basic salary of £93,904 in 2025/26, rising to £98,599 from April 2026. Yet in 2025/26, 47 Scottish MPs billed the taxpayer £81,647 to pay the council tax on their second homes and £39,218 to heat and light them, part of £18.32 million in total expense claims. Alongside taxpayer expenses, Scottish MPs declared £296,895 in private donations, funded trips to Qatar, China and Taiwan, and VIP hospitality at Silverstone, Murrayfield and Hampden."
        >
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="#your-mp" className="btn btn-primary">
              See what your MP claimed →
            </Link>
            <Link
              href="/blog/scottish-mp-expenses-and-freebies-investigation"
              className="btn btn-ghost"
            >
              Read our full investigation article →
            </Link>
          </div>
          <SharePage
            title="Scottish MP expenses, donations & freebies: all 57 ranked"
            text="47 Scottish MPs billed taxpayers £81,647 for their 2nd home council tax and £39,218 for their energy bills, plus £37k on hotels and £297k in private donations and trips:"
            path="/mp-expenses-scotland"
            label="Share this investigation"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame as="section" id="your-mp" className="scroll-mt-24 mb-8">
          <div className="rounded-[var(--r-m)] border-2 border-[var(--brand)] bg-[var(--surface)] p-5 sm:p-6">
            <h2 className="text-[22px] font-[700] leading-[1.2] text-[var(--ink)] sm:text-[26px]">
              See what your MP claimed
            </h2>
            <p className="ui mt-1.5 mb-4 text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
              Put in your postcode. We&apos;ll find your MP and show you every claim they made in
              2025/26, plus their donations, gifts and free trips.
            </p>
            <FindMpClaims slugs={Object.fromEntries(mps.map((m) => [m.memberId, m.constituencySlug]))} />
          </div>
        </ContentFrame>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "What Scotland's 57 MPs claimed & declared",
              value: pounds.format(MP_INTERESTS_TOTALS.expensesNonStaff),
              unit: "in rent, travel, hotels & offices (+£13.11m staff & £297k donations/trips)",
              detail:
                "Every MP received a £93,904 salary in 2025/26. On top of that pay, Scottish MPs billed taxpayers £5.21 million in 2025/26 for London flats, council tax, energy bills, hotels, flights, car parking, family travel, staff travel and offices (plus £13.11m for staff wages). Separately, 26 MPs declared £296,895 in private donations, funded overseas trips and VIP hospitality.",
              rows: [
                {
                  label: "2nd home rent, council tax & heating billed to public",
                  value: `${pounds.format(MP_INTERESTS_TOTALS.secondHomeRent)} rent · ${pounds.format(MP_INTERESTS_TOTALS.secondHomeCouncilTax)} council tax · ${pounds.format(MP_INTERESTS_TOTALS.secondHomeUtilities)} energy`,
                },
                {
                  label: "London hotels, car parking, taxis & family travel",
                  value: `${pounds.format(MP_INTERESTS_TOTALS.londonHotels)} hotels · ${pounds.format(MP_INTERESTS_TOTALS.parking)} parking · ${pounds.format(MP_INTERESTS_TOTALS.taxis)} taxis · ${pounds.format(MP_INTERESTS_TOTALS.dependantTravel)} family`,
                },
                {
                  label: "Private donations, funded foreign trips & VIP gifts",
                  value: `${pounds.format(MP_INTERESTS_TOTALS.donations)} donations · ${pounds.format(MP_INTERESTS_TOTALS.visits)} foreign trips · ${pounds.format(MP_INTERESTS_TOTALS.gifts)} VIP tickets`,
                },
              ],
              asOf: `Checked ${MP_INTERESTS_CHECKED_ISO} against official 2025/26 IPSA receipts & Commons Register`,
              source: {
                publisher: "IPSA & House of Commons Register",
                url: "https://www.theipsa.org.uk/mp-staffing-business-costs/annual-publications",
              },
              nextStep: {
                label: "Enter your postcode to ask your MP to explain",
                href: "/email-your-mp-and-msp",
              },
            }}
          />
          <nav aria-label="On this page" className="mt-8">
            <p className="tile-key mb-2.5">On this page</p>
            <ul className="flex flex-wrap gap-2">
              {JUMP_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="ui inline-flex items-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-3.5 py-1.5 text-[14px] font-[600] text-[var(--ink-2)] no-underline transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </ContentFrame>

        {/* FROM THE RECEIPTS: front and centre */}
        <ContentFrame as="section" id="receipts" className="pt-12 scroll-mt-20">
          <div className="tile-night tile overflow-hidden p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-[56ch]">
                <p className="tile-key">From the receipts · IPSA records</p>
                <h2 className="display-stat mt-2 text-[clamp(26px,3vw,38px)] text-white">
                  Things you paid for and never knew about
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5 sm:shrink-0">
                <Link href="/mp-expenses-scotland/receipts" className="btn btn-primary">
                  See all the receipts →
                </Link>
                <Link
                  href="/blog/worst-scottish-mp-expenses"
                  className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  Read the worst of them
                </Link>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["£3,000", "a speech and presentation skills workshop", "Angus MacDonald"],
                ["£546", "jet washing the drains at a second home", "Angus MacDonald"],
                ["£3,090", "just to set up broadband at his home (a typical setup claim is £90)", "Chris Law"],
              ].map(([amount, what, who]) => (
                <li
                  key={what}
                  className="rounded-[var(--r-m)] border border-white/10 bg-white/[0.06] px-4 py-4"
                >
                  <p className="figure-num tnum text-[32px] leading-none text-white">{amount}</p>
                  <p className="mt-2 text-[15px] leading-[1.45] text-white/90">{what}</p>
                  <p className="tile-key mt-2">{who}</p>
                </li>
              ))}
            </ul>
          </div>
        </ContentFrame>

        {/* THE JUXTAPOSITION: WHAT MPS CLAIM VS WHAT CONSTITUENTS GET */}
        <ContentFrame as="section" id="two-sets-of-rules" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="Two sets of rules · Westminster vs Scottish households"
            title="What MPs can bill to the taxpayer vs what ordinary families face"
          />
          <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              After the 2009 MPs&apos; expenses scandal, voters were told the system had been
              reformed. Yet under current IPSA rules, MPs on £98,599 a year can still claim back
              household bills that their own constituents have to pay out of taxed wages or cover
              through emergency grants:
            </ExplainText>
          </p>
          <div className="mt-7 space-y-4">
            {JUXTAPOSITION_ROWS.map(([topic, mpText, familyText]) => {
              const fig = JUXTAPOSITION_FIGURES[topic as string];
              return (
                <div
                  key={topic as string}
                  className="tile grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
                >
                  <div className="relative border-b border-[var(--rule)] p-5 sm:p-6 md:border-b-0 md:border-r">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[4px] bg-[var(--bad)]"
                    />
                    <p className="tile-key">{topic} · What MPs billed</p>
                    {fig && (
                      <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5">
                        <span className="figure-num tnum text-[clamp(32px,3.4vw,42px)] leading-none text-[var(--bad-text)]">
                          {fig.value}
                        </span>
                        <span className="ui text-[14px] font-[560] text-[var(--ink-2)]">
                          {fig.label}
                        </span>
                      </p>
                    )}
                    <p className="mt-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      <ExplainText>{mpText}</ExplainText>
                    </p>
                  </div>
                  <div className="bg-[var(--surface-2)] p-5 sm:p-6">
                    <p className="tile-key">What families in Scotland get</p>
                    <p className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                      <ExplainText>{familyText}</ExplainText>
                    </p>
                  </div>
                </div>
              );
            })}
            <p className="ui text-[13px] leading-[1.5] text-[var(--muted)]">
              Sources: IPSA 2025/26 individualBusinessCosts dataset, UK Parliament Register of
              Interests, Ofgem, Social Security Scotland and End Child Poverty constituency
              estimates.
            </p>
          </div>

          {/* Real-world comparison: Why second homes exist, 145 sitting days, remote voting & carbon footprint */}
          <h3 className="ui mt-12 text-[22px] font-[680] leading-[1.25] text-[var(--ink)]">
            Four questions people ask when they see these numbers
          </h3>
          <ExplainText>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div id="why-second-homes" className="tile scroll-mt-24 p-6">
                <span className="chip mb-3">01 · Why do they get 2nd homes?</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  Why taxpayers pay for two properties (and bills on homes MPs already own)
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  Because Scottish MPs represent a constituency in Scotland and attend Parliament in
                  London, IPSA lets them designate one property as their main home and bill
                  taxpayers for a <strong>second home</strong> (either in London or in Scotland).
                  Even when an MP <strong>already owns</strong> their second property outright and
                  pays £0 rent, IPSA still lets them bill taxpayers for its council tax, energy
                  bills, factor fees, buildings insurance and drain cleaning, as{" "}
                  <Link href="/representatives/mps/lothian-east#donations-and-interests">
                    Douglas Alexander
                  </Link>{" "}
                  (£4,093 council tax + £1,683 factor fees),{" "}
                  <Link href="/representatives/mps/edinburgh-south#donations-and-interests">
                    Ian Murray
                  </Link>{" "}
                  (£3,197 utilities + £2,822 council tax) and{" "}
                  <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
                    Angus MacDonald
                  </Link>{" "}
                  (£3,314 utilities + £546 drain jet washing + £3,000 speech coaching) all did.
                </p>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  It can cost double. Many Scottish councils, including East Lothian since April 2024,
                  charge double council tax on second homes. IPSA told the Telegraph it raised
                  MPs&apos; accommodation budgets to cover that, so taxpayers pick up the extra too.
                </p>
              </div>

              <div className="tile p-6">
                <span className="chip mb-3">02 · 145 days a year in Westminster</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  £3,500 a month London flats for a 3-day week in Westminster
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  The House of Commons only sits for around <strong>145 days a year</strong>{" "}
                  (usually Monday afternoon to Thursday). Yet taxpayers fund full-year London leases
                  up to <strong>£42,000 a year (£3,500/month)</strong> (more than triple the average
                  Scottish private rent of ~£1,000/month), while MPs like{" "}
                  <Link href="/representatives/mps/dundee-central#donations-and-interests">
                    Chris Law
                  </Link>{" "}
                  (£6,292 in car parking and £2,822 in European hotels on top of £28,200 flat rent)
                  and{" "}
                  <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
                    Graeme Downie
                  </Link>{" "}
                  (£29,820 in flights and £3,308 in airport parking on top of £41,435 flat rent)
                  billed thousands more <em>on top of</em> a rented flat.
                </p>
              </div>

              <div className="tile p-6">
                <span className="chip mb-3">03 · No normal job pays for this</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  Why can&apos;t MPs vote remotely like Holyrood (or any modern workplace)?
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  In almost every other job in Britain, commuting, parking, family train tickets and
                  council tax come out of your own salary. During 2020 and 2021, Westminster proved
                  MPs could debate via video link and cast votes remotely on their phones, a digital
                  voting system the <strong>Scottish Parliament at Holyrood still uses</strong>.
                  Westminster scrapped remote voting, locking in <strong>£1.38m a year</strong> in
                  London rents, <strong>£46k</strong> in their own London hotels and{" "}
                  <strong>£89k in spouse and child travel</strong>.
                </p>
              </div>

              <div className="tile p-6">
                <span className="chip mb-3">04 · £1.17m in flights</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  Climate targets for everyone else, £1.17m in flights for MPs, staff and family
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  Westminster sets the carbon budgets and net zero targets that shape what
                  households pay for fuel, heating and travel. In the same year, Scottish MPs billed
                  taxpayers <strong>£912,654.62 for their own flights</strong>,{" "}
                  <strong>£188,478.04 for staff flights</strong> and{" "}
                  <strong>£73,647.56 for family flights</strong> (£1.17m in total air travel), plus{" "}
                  <strong>£58,237.33 for airport parking</strong> and{" "}
                  <strong>£39,253.53 for their own taxis</strong>, including Central Belt MPs on the direct
                  East Coast rail line like{" "}
                  <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
                    Graeme Downie
                  </Link>{" "}
                  (£29,820 on his own flights and £11,065 on staff flights, against £3,935 on rail).
                  The rules ask households to cut their emissions. They do not ask the same of MPs
                  travelling at public expense.
                </p>
              </div>
            </div>
          </ExplainText>
        </ContentFrame>

        {/* THE PARTY TALLY */}
        <ContentFrame as="section" id="party-tally" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="The Party Tally · Labour vs SNP vs Conservatives vs Lib Dems"
            title="Which party claims the most in expenses, second home bills, foreign trips and donations?"
          />
          <div className="mt-3 max-w-[66ch] space-y-3 text-[17px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              <p>
                Scottish Labour holds 37 of Scotland&apos;s 57 Westminster seats (65%), yet its MPs
                account for <strong>73% of all second home council tax</strong> billed to taxpayers
                (£59,231),{" "}
                <strong>75% of all funded foreign trips</strong> (£57,288, including trips to Qatar,
                China, Taiwan and Syria), and <strong>both MPs married to lobbyists</strong>.
              </p>
              <p>
                Meanwhile, the <strong>Scottish Conservatives</strong> took the highest private
                donations per MP (<strong>£13,333 per MP</strong>, led by David Mundell and Andrew
                Bowie) while voting against removing the two child benefit cap, and{" "}
                <strong>SNP and Highland/Islands MPs</strong> recorded the highest per-MP travel and
                non-staff totals (£111,232 per SNP MP) driven by weekly flights and London flats,
                while declaring <strong>£0</strong> in private cash donations.
              </p>
            </ExplainText>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {PARTY_BARS.map((group) => {
              const max = Math.max(...group.rows.map((r) => r.value));
              return (
                <div key={group.title} className="tile p-5 sm:p-6">
                  <p className="tile-key">{group.kicker}</p>
                  <h3 className="ui mt-1.5 text-[17px] font-[660] leading-[1.3] text-[var(--ink)]">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-3.5">
                    {group.rows.map((r) => (
                      <li key={r.party}>
                        <div className="ui flex items-baseline justify-between gap-3 text-[14px]">
                          <span className="inline-flex items-center gap-2 font-[600] text-[var(--ink)]">
                            <span
                              aria-hidden="true"
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ background: r.colour }}
                            />
                            {r.party}
                          </span>
                          <span className="tnum font-[660] text-[var(--ink)]">{r.display}</span>
                        </div>
                        <span
                          aria-hidden="true"
                          className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[var(--paper-3)]"
                        >
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${Math.max(3, Math.round((r.value / max) * 100))}%`,
                              background: r.colour,
                            }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <GuideTable
              kicker="2025/26 IPSA Expenses & Commons Register · By Party"
              title="Scottish MP expenses, second home bills, foreign trips and donations by political party"
              columns={[
                "Party",
                "Scottish MPs",
                "Non-Staff Expenses (Avg/MP)",
                "2nd Home Council Tax",
                "London Hotels",
                "Taxis & Family Travel",
                "Private Donations & Trips",
              ]}
              align={["left", "left", "right", "right", "right", "right", "right"]}
              rows={PARTY_TALLY_ROWS}
              caption="Source: Calculated across all 57 Scottish MPs from IPSA 2025/26 totalSpend and individualBusinessCosts datasets and the House of Commons Register of Interests (checked 2026-11-21). Two MPs (1 Conservative, 1 SNP) entered Parliament in June 2026 by-elections after the 2025/26 IPSA year closed."
            />
          </div>
        </ContentFrame>

        {/* SPOTLIGHT PHOTO CARDS */}
        <ContentFrame as="section" id="top-claimants" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="The public record · Photos, receipts & local poverty contrast"
            title="Spotlight on the highest expense claims and private donations in Scotland"
          />
          <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              Every card below pairs an MP&apos;s official 2025/26 IPSA expense receipts and
              Register of Interests declarations with the child poverty rate in the constituency
              they represent. Click <strong>Ask to explain</strong> on any card to open a
              pre-drafted email with their exact figures.
            </ExplainText>
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SPOTLIGHT_LEADERS.map((card) => renderSpotlightCard(card))}
          </div>

          <details className="group tile mt-5 overflow-hidden">
            <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-[640] text-[var(--action-text)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 [&::-webkit-details-marker]:hidden">
              <span>
                Show 3 more spotlight profiles (£42k flat + Qatar trip, a wife on the payroll & a
                lobbyist husband)
              </span>
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="grid gap-5 border-t border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
              {MORE_SPOTLIGHT_LEADERS.map((card) => renderSpotlightCard(card))}
            </div>
          </details>
        </ContentFrame>

        {/* INTERACTIVE LEADERBOARD (COLLAPSED TO TOP 10 BY DEFAULT) */}
        <ContentFrame as="section" id="leaderboard" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="Full 57-MP Leaderboard · Search & filter"
            title="Check any Scottish MP: switch between Taxpayer Expenses and Private Donations"
          />
          <p className="mt-3 mb-6 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              We show the top 10 highest claimants first so the page stays fast to read. Type any
              MP, town, donor or country into the box, or click{" "}
              <strong>Show all 57 Scottish MPs</strong> at the bottom of the table.
            </ExplainText>
          </p>
          <MpInterestsExplorer records={mpInterests} />
        </ContentFrame>

        {/* COMPACT COLLAPSIBLE DRAWERS FOR ALL RAW CATEGORIES, DONATIONS, FOREIGN TRIPS & GIFTS */}
        <ContentFrame as="section" id="full-lists" className="pt-16 scroll-mt-20">
          <SectionHead
            eyebrow="Dig into the raw receipts"
            title="Open the full lists: 2nd home council tax, Qatar/China trips, F1 tickets, donors & lobbyist husbands"
          />
          <p className="mt-3 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              Click any drawer below to open the 8 taxpayer expense categories (£5.21m), all 33
              funded foreign trips (£76,557), all 23 private donations (£205,242), all 22 VIP
              hospitality gifts (£15,096), and the MPs with lobbyist husbands or rental properties.
            </ExplainText>
          </p>

          <ExplainText>
            <div className="mt-6 space-y-3.5">
              {/* Drawer 1: 8 Taxpayer Expense Categories + Hidden Line Items */}
              <details className="group tile overflow-hidden">
                <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-[640] leading-[1.35] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3.5">
                    <span className="tnum mt-px inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[13px] font-[700] text-[var(--paper)]">
                      1
                    </span>
                    <span>
                      Where the £5.21m in taxpayer expenses went: 2nd home council tax, energy
                      bills, hotels, speech coaching, drain cleaning & PR
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="space-y-5 border-t border-[var(--rule)] p-5 sm:p-6">
                  <GuideTable
                    kicker="2025/26 Official IPSA Receipts · 6,101 claims"
                    title="Eight things Scottish MPs charged to taxpayers on top of their £93,904 salary"
                    columns={[
                      "What was billed to taxpayers",
                      "Scottish MPs total",
                      "How many MPs claimed it",
                      "Biggest individual claimants",
                    ]}
                    align={["left", "right", "left", "left"]}
                    rows={EYE_OPENING_EXPENSES}
                    caption="Source: IPSA 2025/26 individualBusinessCosts dataset."
                  />
                  <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                    <p className="font-[630] text-[var(--ink)] mb-2">
                      Buried in the 6,101 receipts: what else Scottish MPs billed to taxpayers in
                      2025/26
                    </p>
                    <ul className="list-disc space-y-2.5 pl-5 marker:text-[var(--bad)]">
                      <li>
                        <strong>£3,000 for a personal speech & presentation skills workshop</strong>
                        , <strong>£546 for professional drain jet washing</strong>,{" "}
                        <strong>£939 for London flat service charges</strong> and{" "}
                        <strong>£746 for second home buildings insurance</strong> (claimed by
                        Inverness, Skye and West Ross-shire Lib Dem MP{" "}
                        <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
                          Angus MacDonald
                        </Link>
                        ).
                      </li>
                      <li>
                        <strong>£4,093.21 for second home council tax</strong>,{" "}
                        <strong>£1,683 for factor service charges</strong>,{" "}
                        <strong>£385.50 for second home broadband/landline</strong> and{" "}
                        <strong>£330.81 for buildings insurance</strong> on a property where he pays{" "}
                        <strong>£0 rent</strong> (claimed by Lothian East Labour Minister{" "}
                        <Link href="/representatives/mps/lothian-east#donations-and-interests">
                          Douglas Alexander
                        </Link>
                        ).
                      </li>
                      <li>
                        <strong>£20,384.74 in a single electricity bill claim</strong> to Yu Energy,
                        plus <strong>£1,500 to a digital media studio</strong> and{" "}
                        <strong>£723.18 for European hotels</strong> (claimed by Kilmarnock and
                        Loudoun Labour MP{" "}
                        <Link href="/representatives/mps/kilmarnock-and-loudoun#donations-and-interests">
                          Lillian Jones
                        </Link>
                        ).
                      </li>
                      <li>
                        <strong>£9,193.95 for European hotels</strong> across 12 Scottish MPs (led
                        by{" "}
                        <Link href="/representatives/mps/dundee-central#donations-and-interests">
                          Chris Law
                        </Link>{" "}
                        on £2,821.90,{" "}
                        <Link href="/representatives/mps/paisley-and-renfrewshire-south#donations-and-interests">
                          Johanna Baxter
                        </Link>{" "}
                        on £1,004.48 and{" "}
                        <Link href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests">
                          Brendan O&apos;Hara
                        </Link>{" "}
                        on £822.38).
                      </li>
                      <li>
                        <strong>£40,449.35 for bought-in PR, media and consultancy</strong>,
                        including <strong>£4,000</strong> for &quot;Communications Support&quot; (
                        <Link href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests">
                          Melanie Ward
                        </Link>
                        ), <strong>£3,500</strong> to Causeway Creative (
                        <Link href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
                          Joani Reid
                        </Link>
                        ), <strong>£1,500</strong> for website design (
                        <Link href="/representatives/mps/central-ayrshire#donations-and-interests">
                          Alan Gemmell
                        </Link>
                        ) and <strong>£1,100</strong> for social media templates (
                        <Link href="/representatives/mps/rutherglen#donations-and-interests">
                          Michael Shanks
                        </Link>
                        ).
                      </li>
                      <li>
                        <strong>£1,248 for an iPhone and case</strong> (
                        <Link href="/representatives/mps/berwickshire-roxburgh-and-selkirk#donations-and-interests">
                          John Lamont
                        </Link>
                        ), <strong>£2,542 for DFS and IKEA furniture</strong> plus{" "}
                        <strong>£5,000 for office carpet and refurbishment</strong> (
                        <Link href="/representatives/mps/motherwell-wishaw-and-carluke#donations-and-interests">
                          Pamela Nash
                        </Link>
                        ), <strong>£9,159.58 for newspaper subscriptions</strong>,{" "}
                        <strong>£3,862.66 for 32 TV licences</strong>, and{" "}
                        <strong>17 duplicate or overclaimed expense claims</strong> that had to be
                        repaid (including a £1,200 duplicate claim by Graeme Downie and a £1,476
                        repayment by Torcuil Crichton).
                      </li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Drawer 2: Foreign Trips */}
              <details className="group tile overflow-hidden">
                <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-[640] leading-[1.35] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3.5">
                    <span className="tnum mt-px inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[13px] font-[700] text-[var(--paper)]">
                      2
                    </span>
                    <span>
                      All 33 free foreign trips (£76,557): Qatar, China, Taiwan, Palestine, Syria &
                      Jordan
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="space-y-4 border-t border-[var(--rule)] p-5 sm:p-6">
                  <p className="text-[16px] leading-[1.55] text-[var(--ink-2)]">
                    Nineteen Scottish MPs declared 33 overseas trips paid for by foreign
                    governments, think tanks or lobby groups, including the{" "}
                    <strong>Ministry of Foreign Affairs of Qatar</strong> (£7,000 for John Grady
                    MP), the <strong>Doha Forum</strong> (£5,957 for Melanie Ward MP), the{" "}
                    <strong>Great Britain China Centre</strong> (£6,421 for Elaine Stewart MP and
                    £4,763 for Alan Gemmell MP), <strong>Taiwan</strong> (£5,669 for Graeme Downie
                    MP), <strong>Yachad</strong> (£2,169 for Patricia Ferguson MP to visit
                    Palestine), and the <strong>Embassy of Jordan</strong> (£2,678 for Andrew Bowie
                    MP).
                  </p>
                  <GuideTable
                    kicker="All 33 declared overseas visits"
                    title="Every funded foreign trip taken by current Scottish MPs"
                    columns={["MP", "Party", "Destination", "Who paid for the trip", "Value"]}
                    align={["left", "left", "left", "left", "right"]}
                    rows={allVisits.map((v) => [
                      <Link
                        key={`${v.slug}-${v.id}`}
                        href={`/representatives/mps/${v.slug}#donations-and-interests`}
                        className="font-[580] text-[var(--action-text)]"
                      >
                        {v.mpName}
                      </Link>,
                      v.party,
                      v.countries.join(", "),
                      v.donors.join(", "),
                      poundsExact.format(v.value),
                    ])}
                  />
                </div>
              </details>

              {/* Drawer 3: Donations */}
              <details className="group tile overflow-hidden">
                <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-[640] leading-[1.35] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3.5">
                    <span className="tnum mt-px inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[13px] font-[700] text-[var(--paper)]">
                      3
                    </span>
                    <span>
                      All 23 private donations & free office staff (£205,242): wealthy donors,
                      companies & campaign groups
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="space-y-4 border-t border-[var(--rule)] p-5 sm:p-6">
                  <p className="text-[16px] leading-[1.55] text-[var(--ink-2)]">
                    Ten Scottish MPs declared £205,242.29 in private cash and free staff placed
                    inside their offices: <strong>£30,000</strong> from Francesca Sainsbury Perrin
                    to Dr Zubir Ahmed MP, <strong>£27,564</strong> from Best for Britain to Lillian
                    Jones MP, <strong>£20,000</strong> from oil businessman Alasdair Locke to Andrew
                    Bowie MP, <strong>£19,500</strong> in migration policy staff from RAMP to Chris
                    Murray MP, and <strong>£2,400</strong> of free media training to Joani Reid MP
                    from <strong>Earthcott Ltd</strong>, a firm owned and run by her husband, a
                    lobbyist.
                  </p>
                  <GuideTable
                    kicker="All 23 declared donations"
                    title="Every cash and staffing donation declared by Scottish MPs"
                    columns={["MP", "Party", "Donor", "Donor type", "Amount"]}
                    align={["left", "left", "left", "left", "right"]}
                    rows={allDonations.map((d) => [
                      <Link
                        key={`${d.slug}-${d.id}`}
                        href={`/representatives/mps/${d.slug}#donations-and-interests`}
                        className="font-[580] text-[var(--action-text)]"
                      >
                        {d.mpName}
                      </Link>,
                      d.party,
                      d.donor,
                      d.donorStatus,
                      poundsExact.format(d.value),
                    ])}
                  />
                </div>
              </details>

              {/* Drawer 4: VIP Tickets & Gifts */}
              <details className="group tile overflow-hidden">
                <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-[640] leading-[1.35] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3.5">
                    <span className="tnum mt-px inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[13px] font-[700] text-[var(--paper)]">
                      4
                    </span>
                    <span>
                      All 22 VIP tickets & freebies (£15,096): Silverstone F1, Champions League,
                      Murrayfield & £450 scarf
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="space-y-4 border-t border-[var(--rule)] p-5 sm:p-6">
                  <p className="text-[16px] leading-[1.55] text-[var(--ink-2)]">
                    Includes Silverstone Formula 1 VIP tickets (£1,860 for Dave Doogan MP and £1,100
                    for Andrew Bowie MP), Edinburgh Military Tattoo tickets (£1,544 for Pamela Nash
                    MP), Champions League and Hampden Cup Final boxes (£1,525 for Brendan
                    O&apos;Hara MP), Murrayfield rugby boxes (£1,298 for Christine Jardine MP), and
                    a £450 cashmere scarf gifted to Elaine Stewart MP.
                  </p>
                  <GuideTable
                    kicker="All 22 declared gifts and hospitality packages"
                    title="Every free ticket, gift and hospitality package declared by Scottish MPs"
                    columns={["MP", "Party", "Giver / Host", "What was given", "Value"]}
                    align={["left", "left", "left", "left", "right"]}
                    rows={allGifts.map((g) => [
                      <Link
                        key={`${g.slug}-${g.id}`}
                        href={`/representatives/mps/${g.slug}#donations-and-interests`}
                        className="font-[580] text-[var(--action-text)]"
                      >
                        {g.mpName}
                      </Link>,
                      g.party,
                      g.donor,
                      g.description,
                      poundsExact.format(g.value),
                    ])}
                  />
                </div>
              </details>

              {/* Drawer 5: Lobbyist husbands, wife on payroll & landlords */}
              <details className="group tile overflow-hidden">
                <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16.5px] font-[640] leading-[1.35] text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3.5">
                    <span className="tnum mt-px inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[13px] font-[700] text-[var(--paper)]">
                      5
                    </span>
                    <span>
                      Lobbyist husbands, a wife on the payroll, MP landlords & second jobs
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-[var(--rule)] p-5 sm:p-6">
                  <ul className="list-disc space-y-3 pl-6 text-[16px] leading-[1.6] text-[var(--ink-2)] marker:text-[var(--bad)]">
                    <li>
                      <strong>Husbands who are lobbyists:</strong> East Kilbride Labour MP{" "}
                      <Link href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
                        Joani Reid
                      </Link>{" "}
                      declares her husband David Taylor is a lobbyist. Companies House shows he is
                      the{" "}
                      <a href="https://find-and-update.company-information.service.gov.uk/company/13598010">
                        only director and owner of over 75%
                      </a>{" "}
                      of <strong>Earthcott Ltd</strong>, a PR and consultancy firm. In February 2026
                      Earthcott gave her <strong>£2,400 of free media training</strong>, which she
                      declared as a donation. The register does not say what the training covered or
                      who gave it. The questions it leaves: what was she trained for, who did the
                      training, and does Earthcott work for any clients who want something from
                      Parliament? MPs must declare gifts like this, but declaring a perk from your
                      husband&apos;s business does not answer why it was given.
                      <div className="mt-3 block rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-4 py-3 text-[15px]">
                        <strong>What we checked:</strong> none of her taxpayer expense claims from
                        2024 to 2027 went to Earthcott. Earthcott is not on the official{" "}
                        <a href="https://orcl.my.site.com/CLR_Search">
                          Register of Consultant Lobbyists
                        </a>
                        . That register only covers lobbying of government ministers and their top
                        civil servants, so this does not mean any rule was broken. It does mean the
                        public cannot see who pays her husband to lobby.
                      </div>
                      <div className="mt-3 block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 text-[15px]">
                        <strong>A separate firm, Causeway Creative:</strong> nothing links it to her
                        husband. It is a design and communications agency used by dozens of Labour
                        MPs. But since 2024 she has billed taxpayers <strong>£24,664</strong> for its
                        work, more than any other MP in the UK. IPSA records list seven payments:
                        <div className="mt-2 block overflow-x-auto">
                          <table className="w-full min-w-[420px] border-collapse text-[14px]">
                            <thead>
                              <tr className="border-b border-[var(--rule-strong)] text-left">
                                <th className="py-1.5 pr-3 font-[600]">Date</th>
                                <th className="py-1.5 pr-3 font-[600]">What IPSA records</th>
                                <th className="py-1.5 text-right font-[600]">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="tnum divide-y divide-[var(--rule)]">
                              <tr><td className="py-1.5 pr-3">14 Mar 2025</td><td className="py-1.5 pr-3">Website hosting and design</td><td className="py-1.5 text-right">£4,800</td></tr>
                              <tr><td className="py-1.5 pr-3">31 Mar 2025</td><td className="py-1.5 pr-3">Bought-in comms and media</td><td className="py-1.5 text-right">£3,582</td></tr>
                              <tr><td className="py-1.5 pr-3">31 Mar 2025</td><td className="py-1.5 pr-3">Bought-in comms and media</td><td className="py-1.5 text-right">£3,582</td></tr>
                              <tr><td className="py-1.5 pr-3">31 Mar 2025</td><td className="py-1.5 pr-3">Bought-in comms and media</td><td className="py-1.5 text-right">£3,500</td></tr>
                              <tr><td className="py-1.5 pr-3">24 Apr 2025</td><td className="py-1.5 pr-3">Bought-in comms and media</td><td className="py-1.5 text-right">£4,500</td></tr>
                              <tr><td className="py-1.5 pr-3">24 Apr 2025</td><td className="py-1.5 pr-3">Bought-in comms and media</td><td className="py-1.5 text-right">£3,500</td></tr>
                              <tr><td className="py-1.5 pr-3">12 Mar 2026</td><td className="py-1.5 pr-3">Website hosting and design</td><td className="py-1.5 text-right">£1,200</td></tr>
                              <tr className="font-[650]"><td className="py-1.5 pr-3" colSpan={2}>Total: £18,664 comms and media, £6,000 website</td><td className="py-1.5 text-right">£24,664</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-2 block">
                          &ldquo;Bought-in comms and media&rdquo; means paying an outside firm to do
                          press, social media or newsletter work instead of her own staff. IPSA
                          does not publish what each invoice covered. Five of the payments, worth
                          £18,664, were made between 31 March and 24 April 2025. 31 March is the
                          last day of IPSA&apos;s budget year.
                        </div>
                        <div className="mt-3 block rounded-[var(--r-s)] border-2 border-[var(--bad-text)] bg-[var(--surface)] px-4 py-3">
                          <strong className="text-[var(--bad-text)]">
                            What she said vs what the receipts show:
                          </strong>{" "}
                          In December 2025 she told The Scotsman she had &quot;not used any public
                          money to hire any consultant or consultancy services for public or media
                          relations&quot;. IPSA&apos;s records show £18,664 of public money paid to
                          this outside firm, filed as &quot;Comms &amp; Media&quot;.{" "}
                          <strong>Put side by side, they don&apos;t match.</strong>
                        </div>
                        <div className="mt-2 block">
                          She also said the money mostly went on a website. IPSA&apos;s records show
                          only £6,000 of it as website work.
                        </div>
                      </div>
                      <div className="mt-4 block">
                        Paisley South Labour MP{" "}
                        <Link href="/representatives/mps/paisley-and-renfrewshire-south#donations-and-interests">
                          Johanna Baxter
                        </Link>{" "}
                        declares her husband Mark Henry Glover is Executive Chairman of lobbying and
                        PR agency <strong>SEC Newgate UK</strong>. Unlike Earthcott, SEC Newgate is
                        on the{" "}
                        <a href="https://orcl.my.site.com/CLR_Public_Profile?id=00124000009RJrJAAW">
                          official lobbying register
                        </a>
                        . Its clients for July to September 2026 were gas network Cadent, Infinis
                        Energy, the Independent Renewable Energy Generators Group, Environment Bank,
                        Kingston University, THCT and the Venture Capital Trust Association.
                      </div>
                      <div className="mt-3 block rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-4 py-3 text-[15px]">
                        <strong>What we checked:</strong> we searched every speech she has made in
                        the Commons (Hansard). She has not mentioned any of those clients. None of
                        her taxpayer expense claims went to SEC Newgate either. The link to watch is
                        energy: if she speaks or votes on gas networks or renewable energy, her
                        husband&apos;s firm is paid by companies with a stake in the result.
                      </div>
                    </li>
                    <li>
                      <strong>Spouse employed on the taxpayer payroll:</strong> Argyll and Bute SNP
                      MP{" "}
                      <Link href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests">
                        Brendan O&apos;Hara
                      </Link>{" "}
                      employs his wife Catherine O&apos;Hara full time as his Office Manager.
                    </li>
                    <li>
                      <strong>MP landlords collecting rent:</strong> Thirteen Scottish MPs own 22
                      extra properties across Scotland, London, Spain and France, including 9 rental
                      properties declared by{" "}
                      <Link href="/representatives/mps/caithness-sutherland-and-easter-ross#donations-and-interests">
                        Jamie Stone
                      </Link>
                      ,{" "}
                      <Link href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
                        Joani Reid
                      </Link>
                      ,{" "}
                      <Link href="/representatives/mps/edinburgh-south#donations-and-interests">
                        Ian Murray
                      </Link>
                      ,{" "}
                      <Link href="/representatives/mps/glenrothes-and-mid-fife#donations-and-interests">
                        Richard Baker
                      </Link>
                      ,{" "}
                      <Link href="/representatives/mps/hamilton-and-clyde-valley#donations-and-interests">
                        Imogen Walker
                      </Link>
                      ,{" "}
                      <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
                        Angus MacDonald
                      </Link>
                      ,{" "}
                      <Link href="/representatives/mps/orkney-and-shetland#donations-and-interests">
                        Alistair Carmichael
                      </Link>{" "}
                      and{" "}
                      <Link href="/representatives/mps/paisley-and-renfrewshire-north#donations-and-interests">
                        Alison Taylor
                      </Link>
                      .
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </ExplainText>

          <div className="mt-7">
            <Callout>
              <ExplainText>
                <p className="font-[640] text-[var(--ink)] mb-1">Put the figures to your own MP</p>
                <p className="text-[16.5px] leading-[1.55] text-[var(--ink-2)]">
                  Every one of our <Link href="/representatives">57 Scottish MP pages</Link> pairs
                  their 2025/26 expense claims and private donations with local child poverty
                  figures and a ready drafted email. You can also check if your household qualifies
                  for the <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link>,{" "}
                  <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> or an
                  emergency <Link href="/crisis-grant-scotland">Crisis Grant</Link>.
                </p>
              </ExplainText>
            </Callout>
          </div>
        </ContentFrame>

        <ContentFrame as="section" id="faq" className="pt-16 scroll-mt-20">
          <Faq
            items={FAQ}
            kicker="Questions"
            title="Common questions about Scottish MP expenses, donations and freebies"
          />
        </ContentFrame>

        <ContentFrame as="section" className="mt-14 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-3">Official data sources (checked {MP_INTERESTS_CHECKED_ISO})</p>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              All expense figures come from the official{" "}
              <strong>Independent Parliamentary Standards Authority (IPSA)</strong> 2025/26 annual
              dataset (6,101 individual Scottish MP claim lines, and annual totals of £18,323,504.06). All
              donations, overseas trips, gifts, properties and family lobbying declarations come
              from the official{" "}
              <strong>House of Commons Register of Members&apos; Financial Interests API</strong>{" "}
              (210 registered entries across Scotland&apos;s 57 MPs). Company ownership comes from{" "}
              <strong>Companies House</strong> (checked 21 November 2026). Constituency child
              poverty after housing costs figures come from the{" "}
              <strong>End Child Poverty / Loughborough University</strong> dataset. MPs&apos;
              salaries come from IPSA&apos;s pay decisions for 2025/26 (£93,904) and 2026/27
              (£98,599).
            </ExplainText>
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Ask your MP to explain their expenses and voting record"
        body="Enter your Scottish postcode to see your own MP's 2025/26 expense claims, registered donations, local child poverty rate and voting record, and open a ready drafted email."
        href="/email-your-mp-and-msp"
        cta="Check and email my MP"
        secondaryHref="/representatives"
        secondaryCta="Browse all 57 Scottish MPs"
      />
    </>
  );
}
