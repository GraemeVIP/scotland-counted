import Image from "next/image";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA, Callout } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import SharePage from "@/components/SharePage";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import {
  JsonLd,
  articleJsonLd,
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
import MpLondonTable from "@/components/MpLondonTable";
import { LONDON_RECORD, londonTableRows } from "@/lib/data/mpLondonRecord";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Tiles } from "@/components/ExpenseKit";

const HERO_IMAGE = {
  src: "/images/editorial/mp-expenses-scotland-hub.webp",
  alt: "Open parliamentary ledgers, clipped paper expense receipts and reading glasses on an oak table overlooking Westminster at dusk",
  caption:
    "In 2025/26, Scottish MPs billed £5.21 million for flats, travel, hotels and offices, not counting staff wages.",
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
  /** One short line for the folded list under the top three cards. */
  oneLine: string;
  emailReason: string;
};

/** The three cards shown in full at the top. */
const SPOTLIGHT_LEADERS: SpotlightEntry[] = [
  {
    slug: "kilmarnock-and-loudoun",
    badge: "UK #1 Power Bill (£23,437 in One Day)",
    headlineStat: "£23,437",
    headlineLabel: "paid to Yu Energy on one day (more than a year's office rent)",
    taxpayerSummary:
      "On 19 May 2026 IPSA paid £20,385 + £3,052 on one account. That is the biggest MP power bill in the UK over five years. It equals 156 Warm Home Discounts.",
    freebiesSummary:
      "Voted in Sept 2024 to cut pensioners' Winter Fuel Payment. Also billed £27,000 for a London flat.",
    oneLine: "£23,437 paid for power on one day, the biggest MP power bill in the UK.",
    emailReason:
      "having £23,436.95 paid by IPSA to Yu Energy in a single day on 19 May 2026 (more than a full year's rent for your Kilmarnock office, and the largest MP electricity bill in the UK) after voting to restrict Winter Fuel Payments",
  },
  {
    slug: "dunfermline-and-dollar",
    badge: "#1 Highest Expenses in Scotland",
    headlineStat: "£151,954",
    headlineLabel: "billed in 2025/26, not counting staff wages (£410,253 with staff wages)",
    taxpayerSummary:
      "£41,435 for a London flat, £29,820 on flights, £3,308 car park and a £963 dinner. Cost £84,992 to house and fly him to London (£559 per sitting day).",
    freebiesSummary:
      "Listed £11,882 in free trips to Taiwan (£5,669), the USA (£4,077) and Spain (£2,137).",
    oneLine: "£151,954 billed, the most in Scotland, including £29,820 on flights.",
    emailReason:
      "claiming £151,953.90 in non-staff expenses, including £41,435 for a London flat, £29,820 for flights and £3,308 for airport parking, on top of your £93,904 salary for 2025/26, alongside £11,882 in funded trips to Taiwan, Spain and the US",
  },
  {
    slug: "glasgow-south-west",
    badge: "295 London Nights for 152 Sitting Days",
    headlineStat: "£37,359",
    headlineLabel: "for 295 London hotel nights + £30k donor",
    taxpayerSummary:
      "143 more London nights than Parliament sat (123 nights for 60 sitting days before he became a health minister on 6 Sept 2025). Also billed two £174.50 TV licences in 9 months, one at a Co-op.",
    freebiesSummary:
      "Took a £30,000 gift from Francesca Sainsbury Perrin plus £13,890 in outside surgeon pay.",
    oneLine: "£37,359 for 295 London hotel nights, when the Commons sat on 152 days.",
    emailReason:
      "charging taxpayers £37,358.58 for 295 London hotel nights (against 152 days Parliament was open) and claiming two £174.50 TV licences inside nine months, while receiving £30,000 in private donor funding",
  },
];

/** Shown as one-line rows with a face, and as full cards behind "Show". */
const MORE_SPOTLIGHT_LEADERS: SpotlightEntry[] = [
  {
    slug: "cowdenbeath-and-kirkcaldy",
    badge: "£10k Unnamed Consultant + £7k Paid Back",
    headlineStat: "£10,000",
    headlineLabel: "to an unnamed office consultant (plus £101k bills)",
    taxpayerSummary:
      "Top consultant bill by any Scottish MP, with who got paid hidden. Also billed £4,000 for unnamed PR help, paid back £7,000 for a report, and spent £4,691 at IKEA and £7,932 on family trips.",
    freebiesSummary: "Took a £5,957 trip to Qatar, a £2,202 trip to Syria, and a £1,100 China course.",
    oneLine: "£10,000 to an unnamed consultant, plus £4,691 at IKEA.",
    emailReason:
      "billing taxpayers £10,000 for an unnamed 'Policy and Office set up consultant' and £4,000 for unnamed 'Communications Support' (on top of £7,000 for a local industrial strategy you had to repay in full), plus £4,691 at IKEA, £7,932.47 for family travel and £3,302.72 for second home council tax",
  },
  {
    slug: "dundee-central",
    badge: "#1 Car Parking (£6,292) + £3,090 Broadband",
    headlineStat: "£129,066",
    headlineLabel: "in everyday bills in 2025/26, not counting staff wages (£121 a week just to park)",
    taxpayerSummary:
      "£6,292 car park in one year, £28,200 London flat rent, £2,822 Europe hotels, £26,581 flights. Also billed £3,090 just to set up 5G home broadband.",
    freebiesSummary:
      "Took two free trips to India worth £1,898 paid by the Office of Tibet and Buddhist groups.",
    oneLine: "£6,292 on parking, the most in Scotland, and £3,090 just to set up broadband.",
    emailReason:
      "billing taxpayers £6,292.29 for car parking alone, £28,200 a year for a rented London flat, and £3,090 to set up 5G home broadband",
  },
  {
    slug: "west-aberdeenshire-and-kincardine",
    badge: "Voted to Keep 2-Child Cap + £121k Bills",
    headlineStat: "£121,471",
    headlineLabel: "in everyday bills in 2025/26 (not counting staff wages) + £20k donor & F1 VIP box",
    taxpayerSummary:
      "£32,480 London flat rent, £1,541 second home council tax, £33,100 flights, £1,501 family flights and £5,898 to post his yearly report.",
    freebiesSummary:
      "Voted to keep the two child cap (the rule that stops Universal Credit paying for a third child or more). Took £20,000 from Alasdair Locke, £1,100 F1 VIP tickets, and a £2,678 Jordan trip.",
    oneLine: "Voted to keep the two child cap. £33,100 on flights, a £20,000 donor and F1 VIP tickets.",
    emailReason:
      "voting against removing the two child benefit cap on Universal Credit while claiming £121,470.92 in non-staff expenses (including £32,480 in flat rent, £1,541 in second home council tax and £1,501 for your own family travel) and accepting £1,100 in Silverstone Formula 1 hospitality",
  },
  {
    slug: "livingston",
    badge: "#1 Taxi Tab (£5,059) + 4 TV Licences in a Year",
    headlineStat: "£115,008",
    headlineLabel: "in rent, travel, taxis & £3,630 council tax (2025/26)",
    taxpayerSummary:
      "£5,059 on taxis (£100 a week), £3,630 second home council tax, £6,232 family flights, £20,800 flat rent, £9,600 PR firm, plus four TV licences (£688) in under a year.",
    freebiesSummary: "Took £11,000 from donors plus £1,110 in free VIP tickets to Lord's and Wembley.",
    oneLine: "£5,059 on taxis, the most in Scotland, and four TV licences in under a year.",
    emailReason:
      "billing taxpayers £5,059.35 for taxi fares, £3,629.54 for your second home council tax, £6,232.41 for family flights, £9,600 for a PR firm and four TV licences in under 12 months, while accepting £1,110 in free cricket and Wembley tickets",
  },
  {
    slug: "glasgow-east",
    badge: "£42,000 Flat Rent + £13,117 Report",
    headlineStat: "£96,187",
    headlineLabel: "in everyday bills in 2025/26 + £7,000 Qatar trip",
    taxpayerSummary:
      "£42,000 London flat rent (top in Scotland at £3,500 a month), £2,486 council tax, plus £13,117 to print and post his yearly report.",
    freebiesSummary: "Took a £7,000 Qatar trip paid by Qatar's government, plus a £330 dinner ticket.",
    oneLine: "£42,000 London flat rent, the top in Scotland, and a £7,000 Qatar trip.",
    emailReason:
      "charging taxpayers £42,000 a year (£3,500 a month) for London flat rent and £13,116.80 to post an annual report, and accepting a £7,000 trip paid for by the Ministry of Foreign Affairs of Qatar",
  },
  {
    slug: "argyll-bute-and-south-lochaber",
    badge: "£24,530 Phone Bills + Spouse on Payroll",
    headlineStat: "£114,985",
    headlineLabel: "in everyday bills in 2025/26 + £24.5k EE phone tab",
    taxpayerSummary:
      "£29,322 London flat rent, £3,109 car park, hires his spouse as office boss, and ran up £24,530 on EE mobile bills over five years (up to £909 a month).",
    freebiesSummary:
      "Took £1,525 in VIP football boxes (Champions League & Hampden) and £2,541 in free trips.",
    oneLine: "£24,530 on EE mobile bills over five years, and his spouse on the payroll.",
    emailReason:
      "claiming £114,984.88 in non-staff expenses (including £29,322 flat rent and £3,109 car parking), £24,530 in EE mobile bills over five years, employing your spouse on the public payroll, and accepting £1,525 in football hospitality",
  },
  {
    slug: "east-kilbride-and-strathaven",
    badge: "£2,561 Per Day Spoken + Husband's Firm Perk",
    headlineStat: "£85,563",
    headlineLabel: "in everyday bills in 2025/26 + £2,400 from husband's firm",
    taxpayerSummary:
      "£31,366 London flat rent, £9,906 flights, £3,941 family flights. Cost £48,655 to house and fly her to London while speaking on 19 days (£2,561 for each day she spoke).",
    freebiesSummary:
      "Took £2,400 of free media training from Earthcott Ltd, owned by her lobbyist husband David Taylor.",
    oneLine: "£2,561 for each of the 19 days she spoke, and a perk from her husband's firm.",
    emailReason:
      "claiming £85,563.46 in non-staff expenses (including £31,366 flat rent and £3,941 family flights) while speaking on 19 days and accepting £2,400 of free media training from your lobbyist husband's own firm",
  },
];

const FAQ = [
  {
    q: "How much is an MP paid?",
    a: "An MP gets £98,599 a year from April 2026. IPSA sets that pay. It was £93,904 in 2025/26. Bills for flats, offices, staff and trips are paid on top of that pay.",
  },
  {
    q: "How much did Scottish MPs claim in 2025/26?",
    a: "Scotland's MPs claimed £18.32 million in total bills and staff pay. Take off £13.11 million in staff pay, and they claimed £5.21 million for London flats, hotels, flights, taxis, council tax, power bills and offices.",
  },
  {
    q: "Do Scottish MPs claim council tax and power on second homes?",
    a: "Yes. On top of their £93,904 pay (2025/26), 47 Scottish MPs billed taxpayers £81,647 for second home council tax in 2025/26. Douglas Alexander topped the list at £4,093. Also, 38 MPs billed £39,218 for heat, power and water, led by Angus MacDonald at £3,314.",
  },
  {
    q: "Which MPs voted to keep the two child cap while claiming family bills?",
    a: "Five Scottish Tory MPs voted against ending the two child cap (the rule that stops Universal Credit paying for a third child or more) in Feb 2026: Andrew Bowie, John Lamont, David Mundell, John Cooper and Harriet Cross. In 2025/26 those five billed £523,512, not counting staff wages. That counts £147,964 on London rent, £7,218 council tax, £4,185 heat and power and £1,501 family trips.",
  },
  {
    q: "Who pays for Scottish MPs' free trips and VIP tickets?",
    a: "Scottish MPs listed 33 free trips abroad worth £76,557 on the Register of Interests (the public list where MPs must declare gifts, trips and donations). Payers include Qatar (£7,000 for John Grady), Doha Forum (£5,957 for Melanie Ward), China groups (Elaine Stewart and Alan Gemmell), Taiwan (Graeme Downie) and Jordan (Andrew Bowie). Free VIP perks include Silverstone F1 boxes, football boxes and Murrayfield rugby.",
  },
  {
    q: "Which Scottish MPs are wed to a lobbyist?",
    a: "Two of Scotland's 57 MPs list a husband who is a lobbyist. Both are Scottish Labour. Joani Reid lists David Taylor, who runs Earthcott Ltd and gave her £2,400 of free media training. Johanna Baxter lists Mark Glover, chair of SEC Newgate UK, whose clients include Cadent and Infinis Energy.",
  },
  {
    q: "Can I email my MP to ask about their bills?",
    a: "Yes. Your MP serves everyone in your seat, no matter how you voted. Click Ask to explain on any card, or open your MP's page. We fill in their real numbers and local child poverty rates for you.",
  },
];

function shortParty(p: string) {
  if (p === "Scottish National Party") return "SNP";
  if (p === "Liberal Democrat") return "Lib Dem";
  if (p === "Labour (Co-op)") return "Labour Co-op";
  return p;
}

function renderSpotlightCard(card: SpotlightEntry) {
  const mp = mps.find((m) => m.constituencySlug === card.slug);
  const c = getConstituency(card.slug);
  if (!mp || !c) return null;

  const latestIdx = CONSTITUENCY_YEARS.length - 1;
  const povPct = c.pcts[latestIdx];
  const povCount = c.counts[latestIdx];

  const subject = `Question from a constituent: your 2025/26 expenses and registered interests (${mp.constituency})`;
  const body = `Dear ${mp.name},\n\nI am writing as a constituent in ${mp.constituency} to ask how you explain ${card.emailReason}, according to the 2025/26 IPSA and Register of Interests records.\n\nIn ${mp.constituency}, an estimated ${povCount.toLocaleString("en-GB")} children (${povPct}%) are living in poverty after housing costs, and local households are paying rising council tax, energy bills and rent out of their own wages.\n\nCould you explain why taxpayers should pick up the bill for these costs on top of your 2025/26 MP salary of £93,904?\n\nYours sincerely,\n[Your name]\n[Your address and postcode in ${mp.constituency}]`;
  const mailto = `mailto:${mp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <article key={card.slug} className="tile flex flex-col overflow-hidden">
      {/* Top band: who, and the one number */}
      <div className="relative border-b border-[var(--rule)] bg-[linear-gradient(160deg,var(--surface-2),var(--surface)_70%)] px-5 pb-4 pt-4">
        <span className="ui inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--bad)_12%,transparent)] px-2.5 py-1 text-[12.5px] font-[660] text-[var(--bad-text)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--bad)]" />
          {card.badge}
        </span>

        <div className="mt-3.5 flex items-center gap-3">
          {mp.photoUrl && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--surface-2)] ring-2 ring-[var(--surface)] shadow-[0_0_0_1px_var(--rule-strong)]">
              <Image
                src={mp.photoUrl}
                alt={`${mp.name}, ${mp.party} MP for ${mp.constituency}`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="ui text-[19px] font-[680] leading-[1.2] text-[var(--ink)]">
              <Link
                href={`/representatives/mps/${mp.constituencySlug}#donations-and-interests`}
                className="no-underline hover:underline"
              >
                {mp.name}
              </Link>
            </h3>
            <p className="ui mt-0.5 text-[13.5px] leading-[1.35] text-[var(--muted)]">
              {shortParty(mp.party)} MP
            </p>
          </div>
        </div>
        <p className="ui mt-1.5 text-[13.5px] leading-[1.35] text-[var(--muted)]">
          {mp.constituency}
        </p>

        <p className="figure-num tnum mt-3 text-[clamp(34px,3.2vw,40px)] leading-none text-[var(--bad-text)]">
          {card.headlineStat}
        </p>
        <p className="ui mt-1.5 text-[14px] leading-[1.4] text-[var(--ink-2)]">
          {card.headlineLabel}
        </p>
      </div>

      {/* Body: the detail */}
      <ExplainText>
        <dl className="flex-1 space-y-3 px-5 py-4 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
          <div>
            <dt className="tile-key mb-0.5">Billed to taxpayers</dt>
            <dd>{card.taxpayerSummary}</dd>
          </div>
          <div>
            <dt className="tile-key mb-0.5">Votes, donations & perks</dt>
            <dd>{card.freebiesSummary}</dd>
          </div>
          <div className="rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-3.5 py-2.5">
            <dt className="tile-key mb-0.5">Meanwhile in {mp.constituency}</dt>
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

/** One short row: face, name, the number and one line. */
function renderSpotlightRow(card: SpotlightEntry) {
  const mp = mps.find((m) => m.constituencySlug === card.slug);
  if (!mp) return null;
  const href = `/representatives/mps/${mp.constituencySlug}#donations-and-interests`;
  return (
    <li key={card.slug} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      {mp.photoUrl && (
        <span className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--surface-2)] shadow-[0_0_0_1px_var(--rule-strong)]">
          <Image src={mp.photoUrl} alt={mp.name} fill sizes="40px" className="object-cover" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="ui text-[16px] leading-[1.3]">
          <Link href={href} className="font-[680] text-[var(--ink)] no-underline hover:underline">
            {mp.name.replace(/^Mr |^Dr /, "")}
          </Link>{" "}
          <span className="text-[13.5px] text-[var(--muted)]">
            {shortParty(mp.party)} · {mp.constituency}
          </span>
        </p>
        <p className="mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">
          <ExplainText>{card.oneLine}</ExplainText>
        </p>
      </div>
    </li>
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
        38 Scottish MPs billed taxpayers <strong>£39,218</strong> for second home gas, power and
        water (up to <strong>£3,314</strong> for one MP).
      </>,
      <>
        Scottish homes face a{" "}
        <Link href="/energy-price-cap-scotland">£2,166 energy price cap</Link>. Low paid homes in
        Scotland must apply for the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link> before pots run
        out, or rely on the{" "}
        <Link href="/winter-heating-payment">£59.75 Winter Heating Payment</Link>.
      </>,
    ],
    [
      "Council tax bills",
      <>
        47 Scottish MPs billed taxpayers <strong>£81,647</strong> for second home council tax.
        Douglas Alexander topped the list at <strong>£4,093</strong>, then Gregor Poynton at{" "}
        <strong>£3,630</strong>.
      </>,
      <>
        Homes across Scotland faced{" "}
        <Link href="/council-tax-increase-scotland">steep council tax rises</Link>. Folk on low pay
        must apply for{" "}
        <Link href="/council-tax-reduction-scotland">means tested Council Tax Reduction</Link> to
        get help.
      </>,
    ],
    [
      "Child support & family costs",
      <>
        35 Scottish MPs billed taxpayers <strong>£89,111</strong> to fly or train partners and kids
        to London (up to <strong>£7,932</strong> each). Five Scottish MPs voted to keep the two
        child cap (the rule that stops Universal Credit paying for a third child or more) while
        claiming <strong>£523,512</strong>.
      </>,
      <>
        About <Link href="/poverty-in-scotland">240,000 children in Scotland live in poverty</Link>.
        Parents who run short for food or gas meters must apply for a{" "}
        <Link href="/crisis-grant-scotland">Crisis Grant</Link> or rely on the{" "}
        <Link href="/scottish-child-payment">£28.20 Scottish Child Payment</Link>.
      </>,
    ],
    [
      "Personal cash & housing",
      <>
        49 MPs claimed <strong>£1.38 million</strong> for London flat rent (up to{" "}
        <strong>£42,000 a year</strong>). Eight claimed <strong>£45,615</strong> for London hotels
        (up to <strong>£37,359</strong> for Dr Zubir Ahmed,{" "}
        <Link href="/mp-expenses-scotland/receipts#hotel-nights">night by night</Link>). Ten took{" "}
        <strong>£205,242</strong> from donors.
      </>,
      <>
        A full time worker on the{" "}
        <Link href="/minimum-wage-scotland">Minimum Wage in Scotland</Link> takes home about
        £20,850 a year after tax. They pay rent, council tax, heat and bus fares out of that pay.
      </>,
    ],
  ];

  /** IPSA 2025/26 "Staff Travel" claims for Scotland's current MPs (individual claim files). */
  const mpLink = (slug: string, name: string) => (
    <Link key={slug} href={`/representatives/mps/${slug}#donations-and-interests`} className="font-[600]">
      {name}
    </Link>
  );
  const STAFF_HOTEL_ROWS = [
    [mpLink("dundee-central", "Chris Law (SNP)"), "£10,996", "73"],
    [mpLink("dunfermline-and-dollar", "Graeme Downie (Labour)"), "£8,539", "39"],
    [mpLink("edinburgh-south-west", "Dr Scott Arthur (Labour)"), "£8,291", "47"],
    [mpLink("angus-and-perthshire-glens", "Dave Doogan (SNP)"), "£8,258", "56"],
    [mpLink("mid-dunbartonshire", "Susan Murray (Lib Dem)"), "£8,022", "38"],
    [mpLink("edinburgh-north-and-leith", "Tracy Gilbert (Labour)"), "£7,557", "49"],
  ];
  const STAFF_TRAVEL_ROWS = [
    [mpLink("dunfermline-and-dollar", "Graeme Downie (Labour)"), "£31,098", "£41,240"],
    [mpLink("glasgow-south-west", "Dr Zubir Ahmed (Labour)"), "£25,897", "£13,080"],
    [mpLink("argyll-bute-and-south-lochaber", "Brendan O'Hara (SNP)"), "£25,471", "£37,312"],
    [mpLink("dundee-central", "Chris Law (SNP)"), "£25,035", "£43,009"],
    [mpLink("angus-and-perthshire-glens", "Dave Doogan (SNP)"), "£22,643", "£34,622"],
  ];

  /** Party totals for 2025/26. Averages divide by the MPs who sat in 2025/26 (Labour 37, SNP 7, Conservative 5, Lib Dem 6). */
  const PARTY_TALLY = [
    {
      party: "Scottish Labour",
      mps: "37 MPs (65% of seats)",
      lines: [
        ["Rent, travel & office", "£3,343,933 (£90,377 per MP)"],
        ["2nd home council tax", "£59,231 (73% of total)"],
        ["London hotels", "£44,605 (98% of total, mostly one MP)"],
        ["Taxis · family travel", "£24,976 · £58,905"],
        ["Donations, trips & gifts", "£169,931 (£105.6k donors · £57.3k trips)"],
      ],
    },
    {
      party: "Scottish National Party (SNP)",
      mps: "8 MPs (7 in 2025/26 IPSA)",
      lines: [
        ["Rent, travel & office", "£778,624 (£111,232 per MP)"],
        ["2nd home council tax", "£7,761"],
        ["London hotels", "£716"],
        ["Taxis · family travel", "£6,024 · £19,749"],
        ["Donations, trips & gifts", "£11,902 (£0 donors · £7.5k trips · £4.4k gifts)"],
      ],
    },
    {
      party: "Scottish Conservatives",
      mps: "6 MPs (5 in 2025/26 IPSA)",
      lines: [
        ["Rent, travel & office", "£523,512 (£104,702 per MP)"],
        ["2nd home council tax", "£7,218"],
        ["London hotels", "£294"],
        ["Taxis · family travel", "£2,436 · £1,501"],
        ["Donations, trips & gifts", "£80,001 (£71.1k donors · £6.9k trips)"],
      ],
    },
    {
      party: "Scottish Liberal Democrats",
      mps: "6 MPs",
      lines: [
        ["Rent, travel & office", "£564,881 (£94,147 per MP)"],
        ["2nd home council tax", "£7,437"],
        ["London hotels", "£0"],
        ["Taxis · family travel", "£5,819 · £8,654"],
        ["Donations, trips & gifts", "£35,061 (£28.6k donors · £4.9k trips)"],
      ],
    },
  ];

  /** Two simple bar charts drawn from the party tally table below them. */
  const PARTY_BARS = [
    {
      kicker: "Average per MP · 2025/26",
      title: "Rent, travel, hotels and office, per MP (not staff wages)",
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
    { href: "#top-claimants", label: "Worst offenders" },
    { href: "#leaderboard", label: "All 57 MPs" },
    { href: "#party-tally", label: "By party" },
    { href: "#london-record", label: "152 sitting days" },
    { href: "#full-lists", label: "Full lists" },
  ];

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Scottish MPs", path: "/representatives" },
          {
            name: "MP Expenses & Register of Interests",
            path: "/mp-expenses-scotland",
          },
        ]} />
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
            "Search and compare all 57 Scottish MPs across £5.21 million in 2025/26 IPSA expenses, not counting staff wages (second home rent, council tax, energy bills, hotels, taxis), and £296,895 in private donations, foreign trips and gifts.",
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
              "billed by Scotland's MPs in 2025/26 for flats, travel, hotels and offices. Staff wages are not included.",
            tone: "bad",
          }}
          lede="Scotland's MPs billed £5.21m for flats, travel, hotels and offices in 2025/26. That is on top of their £93,904 pay (the 2025/26 MP salary)."
        >
          {/* POSTCODE FINDER: straight under the intro */}
          <div
            id="your-mp"
            className="mt-6 scroll-mt-24 rounded-[var(--r-m)] border-2 border-[var(--brand)] bg-[var(--surface)] p-4 sm:p-6"
          >
            <h2 className="text-[21px] font-[700] leading-[1.2] text-[var(--ink)] sm:text-[24px]">
              Check your own MP first
            </h2>
            <p className="ui mt-1 mb-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
              Type your Scottish postcode to see your MP&apos;s claims, donations and free trips.
            </p>
            <FindMpClaims slugs={Object.fromEntries(mps.map((m) => [m.memberId, m.constituencySlug]))} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/mp-expenses-scotland/search" className="btn btn-primary">
              Search all 20,879 receipts →
            </Link>
            <Link href="/mp-expenses-scotland/receipts" className="btn btn-ghost">
              The strangest receipts →
            </Link>
          </div>
          <p className="ui mt-4 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            <ExplainText>
              We also cover all 129 MSPs at Holyrood (the Scottish Parliament):{" "}
              <Link href="/blog/msp-expenses-scotland-investigation" className="font-[620]">
                MSP expenses
              </Link>{" "}
              ·{" "}
              <Link href="/representatives/msps" className="font-[620]">
                every MSP
              </Link>
              .
            </ExplainText>
          </p>
          <SharePage
            title="Scottish MP expenses, donations & freebies: all 57 ranked"
            text="Scotland's MPs billed £5.21m for flats, travel, hotels and offices in 2025/26, on top of their £93,904 pay (2025/26). See all 57 ranked:"
            path="/mp-expenses-scotland"
            label="Share this investigation"
            className="mt-4"
          />
        </PageHeader>

        {/* JUMP LINKS */}
        <ContentFrame className="mb-4">
          <nav aria-label="On this page">
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

        {/* THE BIGGEST CLAIMS: THREE FULL CARDS, THE REST AS ONE-LINE ROWS */}
        <ContentFrame as="section" id="top-claimants" className="pt-4">
          <SectionHead
            eyebrow="The standout claims · Faces, receipts & local poverty"
            title="The Scottish MPs with the biggest and most outrageous claims"
          />
          <p className="mt-2 max-w-[66ch] text-[16.5px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              Each card shows official IPSA figures and the child poverty rate where the MP serves.
              Tap <strong>Ask to explain</strong> to email them their numbers.
            </ExplainText>
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SPOTLIGHT_LEADERS.map((card) => renderSpotlightCard(card))}
          </div>

          <div className="tile mt-5 p-5 sm:p-6">
            <h3 className="ui text-[18px] font-[680] leading-[1.3] text-[var(--ink)]">
              {MORE_SPOTLIGHT_LEADERS.length} more MPs with standout claims
            </h3>
            <ul className="mt-4 divide-y divide-[var(--rule)]">
              {MORE_SPOTLIGHT_LEADERS.map((card) => renderSpotlightRow(card))}
            </ul>
          </div>

          <details className="group tile mt-4 overflow-hidden">
            <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-[640] text-[var(--action-text)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 [&::-webkit-details-marker]:hidden">
              <span>Show full cards and emails for these {MORE_SPOTLIGHT_LEADERS.length} MPs</span>
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="grid gap-5 border-t border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
              {MORE_SPOTLIGHT_LEADERS.map((card) => renderSpotlightCard(card))}
            </div>
          </details>
        </ContentFrame>

        {/* COMPACT 4-CARD INVESTIGATIONS STRIP */}
        <ContentFrame as="section" id="receipts" className="pt-12">
          <div className="tile-night tile overflow-hidden p-6 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="tile-key">Deep dives · Official expense spreadsheets</p>
                <h2 className="display-stat mt-1.5 text-[clamp(24px,2.8vw,34px)] text-white">
                  Four stories that sum up Westminster
                </h2>
              </div>
              <Link href="/mp-expenses-scotland/search" className="btn btn-primary shrink-0">
                Search all 20,879 receipts →
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  stat: "£23,437",
                  label: "Electricity paid in one day for Kilmarnock's MP (UK #1)",
                  href: "/blog/kilmarnock-mp-23437-electricity-bill",
                },
                {
                  stat: "£2.91m",
                  label: "To shuttle MPs to London for 152 sitting days (up to £3,007 for each day an MP spoke)",
                  href: "/blog/scottish-mps-london-homes-152-sitting-days",
                },
                {
                  stat: "£10,754",
                  label: "Billed by 29 Scottish MPs for TV licences (4 in one year)",
                  href: "/blog/scottish-mps-tv-licence-expenses",
                },
                {
                  stat: "£10,000",
                  label: "Unnamed consultant, £3,090 broadband setup & £3k speech coach",
                  href: "/mp-expenses-scotland/receipts",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[var(--r-m)] border border-white/15 bg-white/[0.06] px-4 py-4 no-underline transition-colors hover:bg-white/[0.12]"
                >
                  <p className="figure-num tnum text-[30px] leading-none text-white">{item.stat}</p>
                  <p className="mt-2 text-[14.5px] leading-[1.45] text-white/90">{item.label}</p>
                  <p className="ui mt-2.5 text-[13.5px] font-[640] text-[#8bb8ff] group-hover:underline">
                    Read story →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </ContentFrame>

        {/* FULL 57-MP LEADERBOARD (MOVED UP!) */}
        <ContentFrame as="section" id="leaderboard" className="pt-14">
          <SectionHead
            eyebrow="All 57 Scottish MPs · Search &amp; sort"
            title="Every Scottish MP ranked: Expenses vs Private Donations"
          />
          <p className="mt-2 mb-5 max-w-[66ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              Top 10 shown first so the page stays quick. Type any MP, town or donor into the box,
              or click <strong>Show all 57 Scottish MPs</strong> below.
            </ExplainText>
          </p>
          <MpInterestsExplorer records={mpInterests} />
        </ContentFrame>

        {/* COMPACT PARTY COMPARISON */}
        <ContentFrame as="section" id="party-tally" className="pt-14">
          <SectionHead
            eyebrow="By party · Labour vs SNP vs Conservatives vs Lib Dems"
            title="Every Westminster party is at the exact same trough"
          />
          <p className="mt-2 max-w-[66ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              Scottish Labour MPs make up <strong>73% of second home council tax</strong> and{" "}
              <strong>75% of free trips abroad</strong>. Tories took the most in donations, trips
              and gifts per MP (<strong>£13,333 each</strong>). SNP and Highland MPs had the biggest
              travel bills. Across all four parties, the average MP&apos;s bills for rent, travel,
              hotels and office sat between £90,000 and £111,000.
            </ExplainText>
          </p>
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
          <p className="ui mt-3 max-w-[66ch] text-[13.5px] leading-[1.5] text-[var(--muted)]">
            How we counted: IPSA&apos;s 2025/26 yearly totals for office, rent, hotels, travel
            (including staff trips) and other costs. Staff wages are left out. Each average divides
            by the MPs who sat in 2025/26, so the 2 MPs elected in June 2026 (1 SNP, 1 Conservative)
            are not counted. Our receipt search counts all current MPs and leaves out staff trips,
            so its averages are lower.
          </p>
          <details className="group tile mt-4 overflow-hidden">
            <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-[15px] font-[640] text-[var(--action-text)] hover:bg-[var(--surface-2)] [&::-webkit-details-marker]:hidden">
              <span>Full numbers for each party</span>
              <span aria-hidden="true" className="text-[13px] text-[var(--muted)]">Expand ↓</span>
            </summary>
            <div className="border-t border-[var(--rule)] p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {PARTY_TALLY.map((row) => (
                  <div key={row.party} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4">
                    <p className="ui text-[16px] font-[680] text-[var(--ink)]">{row.party}</p>
                    <p className="ui text-[13.5px] text-[var(--muted)]">{row.mps}</p>
                    <dl className="mt-3 space-y-1.5 text-[14.5px] leading-[1.45]">
                      {row.lines.map(([k, v]) => (
                        <div key={k} className="flex flex-wrap justify-between gap-x-3">
                          <dt className="text-[var(--ink-2)]">{k}</dt>
                          <dd className="tnum font-[620] text-[var(--ink)]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
              <p className="ui mt-3 text-[13px] leading-[1.5] text-[var(--muted)]">
                Source: IPSA 2025/26 expense files and the House of Commons Register of Interests
                (checked 2026-11-21). Two MPs (1 Conservative, 1 SNP) were elected in June 2026
                by-elections, after the 2025/26 expenses year closed.
              </p>
            </div>
          </details>
        </ContentFrame>

        {/* COLLAPSIBLE DEEP-DIVE DRAWERS (KEEPS PAGE SHORT, ZERO FACTS LOST) */}
        <ContentFrame as="section" id="london-record" className="pt-14">
          <SectionHead
            eyebrow="Tap a box to open it"
            title="Dig deeper"
          />
          <div className="mt-5 space-y-3">
            <details className="group tile overflow-hidden">
              <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-[650] text-[var(--ink)] hover:bg-[var(--surface-2)] [&::-webkit-details-marker]:hidden">
                <span>
                  152 sitting days: every MP compared
                </span>
                <span aria-hidden="true" className="text-[13.5px] font-[600] text-[var(--action-text)] shrink-0">
                  Open table ↓
                </span>
              </summary>
              <div className="border-t border-[var(--rule)] p-5 sm:p-6">
                <p className="mb-4 max-w-[66ch] text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                  <ExplainText>
                    The Commons sat on <strong>{LONDON_RECORD.sittingDays} days</strong> in
                    2025/26. It did not sit on the other 213. Read our plain-English breakdown of{" "}
                    <Link href="/blog/scottish-mps-london-homes-152-sitting-days">
                      the £2.91m London shuttle bill (up to £3,007 for each day an MP spoke) →
                    </Link>
                  </ExplainText>
                </p>
                <MpLondonTable
                  rows={londonTableRows(Object.fromEntries(mps.map((m) => [m.memberId, m.party])))}
                  sittingDays={LONDON_RECORD.sittingDays}
                />
              </div>
            </details>

            <details id="two-sets-of-rules" className="group tile overflow-hidden">
              <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-[650] text-[var(--ink)] hover:bg-[var(--surface-2)] [&::-webkit-details-marker]:hidden">
                <span>
                  Two sets of rules: MPs vs families
                </span>
                <span aria-hidden="true" className="text-[13.5px] font-[600] text-[var(--action-text)] shrink-0">
                  Open explainer ↓
                </span>
              </summary>
              <div className="border-t border-[var(--rule)] p-5 sm:p-6">
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
              Sources: IPSA 2025/26 official expense spreadsheets, UK Parliament Register of
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
              <div id="why-second-homes" className="tile p-6">
                <span className="chip mb-3">01 · Why do they get 2nd homes?</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  Why you pay for two homes (even ones MPs own)
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  Scottish MPs work in their local area and in Westminster. So IPSA lets them bill
                  you for a <strong>second home</strong>. Even if an MP <strong>owns</strong> that
                  home with £0 rent, they can still bill council tax, heat, power, factor fees and
                  drains.{" "}
                  <Link href="/representatives/mps/lothian-east#donations-and-interests">
                    Douglas Alexander
                  </Link>{" "}
                  (£4,093 council tax),{" "}
                  <Link href="/representatives/mps/edinburgh-south#donations-and-interests">
                    Ian Murray
                  </Link>{" "}
                  (£3,197 power) and{" "}
                  <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
                    Angus MacDonald
                  </Link>{" "}
                  (£3,314 power + £546 drains) all did.
                </p>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  It can cost double. Many councils, like East Lothian, charge double council tax on
                  second homes. IPSA lifted MP caps to pay that extra bill too.
                </p>
              </div>

              <div className="tile p-6">
                <span className="chip mb-3">02 · 152 days a year in Westminster</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  £3,500 a month London flats for a 3-day week
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  The Commons sits for about <strong>152 days a year</strong>, mostly Monday to
                  Thursday. Yet you pay full year London rent up to{" "}
                  <strong>£42,000 a year (£3,500 a month)</strong>. That is three times normal
                  Scottish rent. On top of rent,{" "}
                  <Link href="/representatives/mps/dundee-central#donations-and-interests">
                    Chris Law
                  </Link>{" "}
                  billed £6,292 to park and{" "}
                  <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
                    Graeme Downie
                  </Link>{" "}
                  billed £29,820 on flights.
                </p>
              </div>

              <div className="tile p-6">
                <span className="chip mb-3">03 · No normal job pays for this</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  Why not vote online like Holyrood?
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  In normal jobs, travel, parking and council tax come out of your own pay. In 2020
                  and 2021, MPs spoke on video and voted by phone. <strong>Holyrood still uses
                  online votes.</strong> Westminster binned them, locking in{" "}
                  <strong>£1.38m a year</strong> in London rent, <strong>£46k</strong> in hotels and{" "}
                  <strong>£89k</strong> in family trips.
                </p>
              </div>

              <div className="tile p-6">
                <span className="chip mb-3">04 · £1.17m in flights</span>
                <h3 className="ui text-[18px] font-[660] leading-[1.3] text-[var(--ink)]">
                  Green rules for you, £1.17m in flights for MPs
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                  Westminster sets net zero rules that push up fuel and heat bills. In that same
                  year, Scottish MPs billed <strong>£912,655 for their own flights</strong>,{" "}
                  <strong>£188,478 for staff flights</strong> and{" "}
                  <strong>£73,648 for family flights</strong>. Add £58,237 to park and £39,254 on
                  taxis.{" "}
                  <Link href="/representatives/mps/dunfermline-and-dollar#donations-and-interests">
                    Graeme Downie
                  </Link>{" "}
                  spent £29,820 on flights vs £3,935 on trains.
                </p>
              </div>
            </div>
          </ExplainText>
              </div>
            </details>

            <details id="staff-travel" className="group tile overflow-hidden">
              <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-[650] text-[var(--ink)] hover:bg-[var(--surface-2)] [&::-webkit-details-marker]:hidden">
                <span>
                  £565,753 on staff travel
                </span>
                <span aria-hidden="true" className="text-[13.5px] font-[600] text-[var(--action-text)] shrink-0">
                  Open tables ↓
                </span>
              </summary>
              <div className="border-t border-[var(--rule)] p-5 sm:p-6">
                <div className="max-w-[66ch] space-y-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  <ExplainText>
                    <p>
                      Most MP staff help local folk with housing, benefits and visas. That work
                      happens in Scotland by phone and email. Yet in 2025/26 MPs billed{" "}
                      <strong>£565,753</strong> for staff trips.
                    </p>
                    <p>
                      That counts <strong>£188,478 on staff flights</strong> and{" "}
                      <strong>£169,523 on staff London hotels</strong>. That is four times what MPs
                      spent on London hotels for themselves (£45,615).
                    </p>
                    <p>
                      IPSA lets MPs claim staff trips for Parliament work. The files never say what
                      each trip was for. Why do local office staff spend up to 73 nights a year in
                      London hotels?
                    </p>
                  </ExplainText>
                </div>
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <GuideTable
                    kicker="Biggest staff hotel bills"
                    title="Staff London hotel stays, by MP"
                    columns={["MP", "Staff London hotels", "Nights"]}
                    align={["left", "right", "right"]}
                    rows={STAFF_HOTEL_ROWS}
                    caption="Source: Official IPSA 2025/26 expense spreadsheets, London hotels under Staff Travel."
                  />
                  <GuideTable
                    kicker="The same names again"
                    title="All staff travel, and the MP's own travel"
                    columns={["MP", "Staff travel", "Their own travel"]}
                    align={["left", "right", "right"]}
                    rows={STAFF_TRAVEL_ROWS}
                    caption="Source: Official IPSA 2025/26 spreadsheets. Graeme Downie and Chris Law are also No. 1 and No. 2 in Scotland for total everyday expenses."
                  />
                </div>
              </div>
            </details>
          </div>
        </ContentFrame>

        <ContentFrame as="section" id="full-lists" className="pt-16">
          <SectionHead
            eyebrow="Every entry, in full"
            title="The full lists"
          />
          <p className="mt-3 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>
              On top of their expenses, MPs declared <strong>£296,895</strong> in donations, free
              trips and gifts on the Register of Interests (the public list where MPs must declare
              them).
            </ExplainText>
          </p>
          <Tiles
            items={[
              { value: "£205,242", label: "23 donations from donors and firms", hot: true },
              { value: "£76,557", label: "33 free trips abroad" },
              { value: "£15,096", label: "22 VIP tickets and gifts" },
              { value: "£81,647", label: "2nd home council tax billed by 47 MPs" },
            ]}
          />

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
                      Where the £5.21m went
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
                  <div>
                    <p className="ui text-[17px] font-[660] leading-[1.3] text-[var(--ink)]">
                      Eight things Scottish MPs billed in 2025/26, on top of their £93,904 salary that year
                    </p>
                    <ul className="mt-3 divide-y divide-[var(--rule)]">
                      {EYE_OPENING_EXPENSES.map(([what, total, who, top]) => (
                        <li key={what} className="py-3 first:pt-0">
                          <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <span className="ui text-[15.5px] font-[640] text-[var(--ink)]">{what}</span>
                            <span className="tnum text-[16px] font-[680] text-[var(--bad-text)]">{total}</span>
                          </p>
                          <p className="ui mt-0.5 text-[13.5px] text-[var(--muted)]">{who}</p>
                          <p className="mt-1 text-[14.5px] leading-[1.45] text-[var(--ink-2)]">Top: {top}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="ui mt-2 text-[13px] text-[var(--muted)]">Source: IPSA 2025/26 expense files (6,101 claims).</p>
                  </div>
                  <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 text-[15px] leading-[1.6] text-[var(--ink-2)]">
                    <p className="font-[630] text-[var(--ink)] mb-2">
                      Buried in the 6,101 rows: what else Scottish MPs billed in 2025/26
                    </p>
                    <ul className="list-disc space-y-2.5 pl-5 marker:text-[var(--bad)]">
                      <li>
                        <strong>£3,000 for a speech coach</strong>,{" "}
                        <strong>£546 to jet wash drains</strong>,{" "}
                        <strong>£939 in flat fees</strong> and{" "}
                        <strong>£746 for home cover</strong> (
                        <Link href="/representatives/mps/inverness-skye-and-west-ross-shire#donations-and-interests">
                          Angus MacDonald
                        </Link>
                        , Lib Dem).
                      </li>
                      <li>
                        <strong>£4,093 for second home council tax</strong>,{" "}
                        <strong>£1,683 in factor fees</strong> and{" "}
                        <strong>£386 for broadband</strong> on a house with{" "}
                        <strong>£0 rent</strong> (
                        <Link href="/representatives/mps/lothian-east#donations-and-interests">
                          Douglas Alexander
                        </Link>
                        , Labour).
                      </li>
                      <li>
                        <strong>£20,385 in one power bill</strong> to Yu Energy,{" "}
                        <strong>£1,500 to a media firm</strong> and{" "}
                        <strong>£723 for Europe hotels</strong> (
                        <Link href="/representatives/mps/kilmarnock-and-loudoun#donations-and-interests">
                          Lillian Jones
                        </Link>
                        , Labour).
                      </li>
                      <li>
                        <strong>£9,194 for Europe hotels</strong> across 12 MPs. Top were{" "}
                        <Link href="/representatives/mps/dundee-central#donations-and-interests">
                          Chris Law
                        </Link>{" "}
                        (£2,822),{" "}
                        <Link href="/representatives/mps/paisley-and-renfrewshire-south#donations-and-interests">
                          Johanna Baxter
                        </Link>{" "}
                        (£1,004) and{" "}
                        <Link href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests">
                          Brendan O&apos;Hara
                        </Link>{" "}
                        (£822).
                      </li>
                      <li>
                        <strong>£40,449 for outside PR and consultants</strong>. That counts{" "}
                        <strong>£4,000</strong> for{" "}
                        <Link href="/representatives/mps/cowdenbeath-and-kirkcaldy#donations-and-interests">
                          Melanie Ward
                        </Link>
                        , <strong>£1,500</strong> for{" "}
                        <Link href="/representatives/mps/kilmarnock-and-loudoun#donations-and-interests">
                          Lillian Jones
                        </Link>
                        , <strong>£1,500</strong> for{" "}
                        <Link href="/representatives/mps/central-ayrshire#donations-and-interests">
                          Alan Gemmell
                        </Link>{" "}
                        and <strong>£1,100</strong> for{" "}
                        <Link href="/representatives/mps/rutherglen#donations-and-interests">
                          Michael Shanks
                        </Link>
                        .
                      </li>
                      <li>
                        <strong>£1,248 for an iPhone</strong> (
                        <Link href="/representatives/mps/berwickshire-roxburgh-and-selkirk#donations-and-interests">
                          John Lamont
                        </Link>
                        ) and <strong>£2,542 at DFS and IKEA</strong> plus{" "}
                        <strong>£5,000 for carpet and work</strong> (
                        <Link href="/representatives/mps/motherwell-wishaw-and-carluke#donations-and-interests">
                          Pamela Nash
                        </Link>
                        ). Plus <strong>£9,160 on papers</strong>,{" "}
                        <strong>£3,863 on 32 TV licences</strong>, and{" "}
                        <strong>17 double or over claims</strong> paid back.
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
                      33 free trips abroad (£76,557)
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
                    19 Scottish MPs took 33 free trips paid by foreign states or groups.{" "}
                    <strong>Qatar</strong> paid £7,000 for John Grady. <strong>Doha Forum</strong>{" "}
                    paid £5,957 for Melanie Ward. <strong>China groups</strong> paid £6,421 for
                    Elaine Stewart and £4,763 for Alan Gemmell. <strong>Taiwan</strong> paid £5,669
                    for Graeme Downie, and <strong>Jordan</strong> paid £2,678 for Andrew Bowie.
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
                      23 donations (£205,242)
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
                    Ten Scottish MPs listed £205,242 in donor cash and free staff. Dr Zubir Ahmed
                    got <strong>£30,000</strong> from Francesca Sainsbury Perrin. Lillian Jones got{" "}
                    <strong>£27,564</strong> from Best for Britain. Andrew Bowie got{" "}
                    <strong>£20,000</strong> from Alasdair Locke. Chris Murray got{" "}
                    <strong>£19,500</strong> in free staff. Joani Reid got <strong>£2,400</strong>{" "}
                    in free media training from her husband&apos;s firm.
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
                      22 VIP tickets and gifts (£15,096)
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
                    Top free perks include Silverstone F1 tickets (£1,860 for Dave Doogan, £1,100
                    for Andrew Bowie). Pamela Nash got £1,544 in Tattoo tickets. Brendan O&apos;Hara
                    got £1,525 in football boxes. Christine Jardine got £1,298 in rugby boxes, and
                    Elaine Stewart got a £450 scarf.
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
                      <strong>Husbands who lobby:</strong> East Kilbride Labour MP{" "}
                      <Link href="/representatives/mps/east-kilbride-and-strathaven#donations-and-interests">
                        Joani Reid
                      </Link>{" "}
                      lists her husband David Taylor as a lobbyist. Companies House shows he owns
                      over 75% of <strong>Earthcott Ltd</strong>, a PR firm. In Feb 2026 Earthcott
                      gave her <strong>£2,400 of free media training</strong>. The file does not say
                      what it covered or who taught it.
                      <div className="mt-3 block rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-4 py-3 text-[15px]">
                        <strong>What we checked:</strong> None of her public bills went to
                        Earthcott. Earthcott is not on the{" "}
                        <a href="https://orcl.my.site.com/CLR_Search">
                          Register of Consultant Lobbyists
                        </a>
                        . That breaks no rule, as the list only tracks talks with ministers. It does
                        mean the public cannot see his clients.
                      </div>
                      <div className="mt-4 block">
                        Paisley South Labour MP{" "}
                        <Link href="/representatives/mps/paisley-and-renfrewshire-south#donations-and-interests">
                          Johanna Baxter
                        </Link>{" "}
                        lists her husband Mark Glover. He chairs PR and lobbying firm{" "}
                        <strong>SEC Newgate UK</strong>. SEC Newgate is on the{" "}
                        <a href="https://orcl.my.site.com/CLR_Public_Profile?id=00124000009RJrJAAW">
                          public lobbying list
                        </a>
                        . Its clients in July to Sept 2026 included Cadent, Infinis Energy,
                        Environment Bank and Kingston University.
                      </div>
                      <div className="mt-3 block rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-4 py-3 text-[15px]">
                        <strong>What we checked:</strong> We checked all her speeches in Hansard.
                        She has not named those firms, and none of her bills went to SEC Newgate.
                        The point to watch is gas and power votes, where his firm has paid clients.
                      </div>
                    </li>
                    <li>
                      <strong>Wife on the public payroll:</strong> Argyll and Bute SNP MP{" "}
                      <Link href="/representatives/mps/argyll-bute-and-south-lochaber#donations-and-interests">
                        Brendan O&apos;Hara
                      </Link>{" "}
                      hires his wife Catherine O&apos;Hara full time as his office boss.
                    </li>
                    <li>
                      <strong>MP landlords:</strong> 13 Scottish MPs own 22 extra homes across
                      Scotland, London, Spain and France. Nine rental homes are listed by{" "}
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
                  Every one of our <Link href="/representatives">57 Scottish MP pages</Link> shows
                  their bills, gifts, local child poverty rate and a ready email. You can also check
                  the <Link href="/warm-home-discount-scotland">£150 Warm Home Discount</Link>,{" "}
                  <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> or a{" "}
                  <Link href="/crisis-grant-scotland">Crisis Grant</Link>.
                </p>
              </ExplainText>
            </Callout>
          </div>
        </ContentFrame>

        <ContentFrame as="section" id="faq" className="pt-16">
          <Faq
            items={FAQ}
            kicker="Questions"
            title="Common questions about Scottish MP expenses, gifts and trips"
          />
        </ContentFrame>

        <ContentFrame as="section" className="mt-14 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-3">Public sources (checked {MP_INTERESTS_CHECKED_ISO})</p>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
            <ExplainText>
              All bills come from <strong>IPSA</strong> (the body that pays MPs&apos; expenses) 2025/26
              public files: 6,101 Scottish rows, £18.32 million in total including £13.11 million in
              staff wages. Gifts, free trips, homes and lobby links come from the{" "}
              <strong>Register of Interests</strong> (210 entries), the public list where MPs declare gifts, trips and donations. Firm ownership comes from{" "}
              <strong>Companies House</strong>. Child poverty rates come from End Child Poverty. MP
              pay (£93,904 in 2025/26, £98,599 in 2026/27) comes from IPSA.
            </ExplainText>
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Ask your MP to explain their bills"
        body="Type your Scottish postcode to see your MP's claims, gifts and votes, then send a ready email."
        href="/email-your-mp-and-msp"
        cta="Check and email my MP"
        secondaryHref="/representatives"
        secondaryCta="Browse all 57 Scottish MPs"
      />
    </>
  );
}
