import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA, Callout } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, articleJsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";
import { TAX_DATA } from "@/lib/tax/engine";
import Breadcrumbs from "@/components/Breadcrumbs";

const HERO_IMAGE = {
  src: "/images/editorial/scottish-budget-2027-28-holyrood.webp",
  alt: "Briefing folders, fountain pen and calculator on a wooden desk overlooking Edinburgh ahead of the Scottish Budget 2027/28",
  caption:
    "Deputy First Minister and Finance Secretary Jenny Gilruth presents the 2027/28 Scottish Budget to the Scottish Parliament on Thursday 3 December 2026.",
  width: 1200,
  height: 800,
};

const PUBLISHED_ISO = "2026-11-21";
const MODIFIED_ISO = "2026-11-21";

export const metadata = meta({
  title: "Scottish Budget 2027/28: 3 December Date, Tax & Benefits",
  description:
    "The 2027/28 Scottish Budget is on Thursday 3 December 2026. See what Jenny Gilruth could change on Scottish income tax bands, council tax and winter help.",
  path: "/scottish-budget-2027-28",
  type: "article",
  published: PUBLISHED_ISO,
  modified: MODIFIED_ISO,
  image: "/images/share/scottish-budget-2027-28-holyrood.jpg",
  imageAlt: HERO_IMAGE.alt,
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
});

const CURRENT_TAX_TABLE = [
  ["Personal Allowance", "Up to £12,570", "0%", "Set by Westminster (frozen across the UK)"],
  ["Starter rate", "£12,571 to £16,537", "19%", "Threshold rose 7.4% in April 2026"],
  ["Basic rate", "£16,538 to £29,526", "20%", "Threshold rose 7.4% in April 2026"],
  ["Intermediate rate", "£29,527 to £43,662", "21%", "Threshold frozen at £43,662 top end"],
  ["Higher rate", "£43,663 to £75,000", "42%", "Frozen at £43,663 (vs £50,271 in England)"],
  ["Advanced rate", "£75,001 to £125,140", "45%", "Frozen at £75,001"],
  ["Top rate", "Over £125,140", "48%", "3p higher than England's 45% top rate"],
];

const WATCHLIST_TABLE = [
  [
    "Scottish income tax bands (2027/28)",
    "Whether the £43,663 Higher rate (42%) threshold stays frozen again or rises with inflation, and how much Starter and Basic thresholds move from 6 April 2027",
    "Every Scottish PAYE worker and pensioner with a tax code starting with S",
  ],
  [
    "£100 energy payment rollout",
    "Exact payment dates and council delivery rules for the £190m+ winter energy payment for homes in council tax bands A to D",
    "Around 1.9 million Scottish households in council tax bands A to D",
  ],
  [
    "Council funding & 2027/28 council tax",
    "The local government settlement that drives how much all 32 councils put up Band D council tax in April 2027, plus progress on the new Bands I and J mansion tax bill",
    "Every household paying council tax in Scotland",
  ],
  [
    "Scottish Child Payment & benefits uprating",
    "Inflation uprating from April 2027 for Scottish Child Payment, Adult Disability Payment and Carer Support Payment, plus plans for families with babies under one",
    "Low income families, disabled people and unpaid carers",
  ],
  [
    "LBTT (Stamp Duty) thresholds",
    "Whether the £145,000 residential nil rate threshold (£175,000 for first time buyers) or 8% Additional Dwelling Supplement changes",
    "Homebuyers and landlords across Scotland",
  ],
];

const TIMELINE_TABLE = [
  ["Wednesday 28 October 2026", "UK Budget at Westminster sets Scotland's Barnett formula block grant adjustment and announces the £100 energy payment for Bands A to D"],
  ["Wednesday 18 November 2026", "Council Tax (High Value Dwellings etc.) (Scotland) Bill unveiled at Holyrood, proposing Band I (£1m to £2m) and Band J (£2m+) from April 2028"],
  ["Wednesday 25 November 2026", "Ofgem announces the confirmed 1 January to 31 March 2027 energy price cap (forecast by Cornwall Insight to jump 26% to £2,166)"],
  ["Thursday 3 December 2026", "Finance Secretary Jenny Gilruth presents the 2027/28 Scottish Budget statement to the Scottish Parliament alongside Scottish Fiscal Commission forecasts"],
  ["January to February 2027", "Holyrood committees scrutinise the Budget Bill and the Scottish Government negotiates cross party votes to pass the Bill"],
  ["February to March 2027", "All 32 Scottish councils meet to set their local 2027/28 council tax rises once their grant settlement is confirmed"],
  ["6 April 2027", "New 2027/28 Scottish income tax thresholds and uprated Social Security Scotland benefit rates take effect"],
];

const FAQ = [
  {
    q: "When is the Scottish Budget for 2027/28?",
    a: "The 2027/28 Scottish Budget will be presented to the Scottish Parliament on Thursday 3 December 2026 by Deputy First Minister and Finance Secretary Jenny Gilruth. The Scottish Fiscal Commission publishes its independent economic and tax forecasts on the same afternoon.",
  },
  {
    q: "Will Scottish income tax rates or bands change in the 3 December 2026 Budget?",
    a: "The Scottish Government has pledged not to introduce new income tax bands or raise headline income tax rates during this parliamentary term. The crucial decision on 3 December is what happens to the thresholds: in 2026/27 the Starter and Basic thresholds rose by 7.4%, while the 42% Higher rate threshold was kept frozen at £43,663, pulling more workers into the 42% band as wages rose.",
  },
  {
    q: "Will the Scottish Budget confirm when the £100 energy payment is paid?",
    a: "The 3 December Budget is the key moment for the Scottish Government to confirm the funding allocation and council rollout timetable for the £100 winter energy payment for the 1.9 million Scottish homes in council tax bands A to D.",
  },
  {
    q: "Does the Scottish Budget set my council tax bill for 2027/28?",
    a: "Not directly, unless the Scottish Government funds a nationwide council tax freeze. Instead, the 3 December Budget sets the central government grant given to Scotland's 32 councils. Each council then votes on its own 2027/28 Band D council tax increase in February or early March 2027.",
  },
  {
    q: "When do changes announced in the Scottish Budget take effect?",
    a: "Most tax and benefit changes announced on 3 December 2026 take effect at the start of the new financial year on 1 April 2027 (for council tax and LBTT) or 6 April 2027 (for Scottish income tax and Social Security Scotland benefit uprating).",
  },
];

export default function ScottishBudgetPage() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Your money", path: "/money" },
          { name: "Scottish Budget 2027/28", path: "/scottish-budget-2027-28" },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "Scottish Budget 2027/28: 3 December 2026 date, tax bands and benefits",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Scottish Budget 2027/28: 3 December 2026 Date, Income Tax, Council Tax & Benefits",
          description:
            "Everything to watch in the 2027/28 Scottish Budget on Thursday 3 December 2026: Scottish income tax thresholds, £100 energy payment funding, council tax and Scottish Child Payment.",
          path: "/scottish-budget-2027-28",
          published: PUBLISHED_ISO,
          modified: MODIFIED_ISO,
          image: HERO_IMAGE.src,
          section: "Your money",
          keywords: [
            "scottish budget 2027 28",
            "scottish budget",
            "budget scotland",
            "when is the scottish budget",
            "scottish income tax bands 2027 28",
          ],
          schemaType: "Article",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Holyrood · Published 21 November 2026 · Last updated 21 November 2026"
          title="Scottish Budget 2027/28: 3 December date and what it means for your money"
          lede="Deputy First Minister and Finance Secretary Jenny Gilruth presents the 2027/28 Scottish Budget to Holyrood on Thursday 3 December 2026. That single statement sets next April's Scottish income tax thresholds, Social Security Scotland benefit rises, and the funding settlement that decides how much your council puts up council tax."
        >
          <SharePage
            title="Scottish Budget 2027/28: 3 December date, income tax & benefits"
            text="What the 3 December 2026 Scottish Budget means for your take home pay, council tax, the £100 energy payment and Scottish benefits."
            path="/scottish-budget-2027-28"
            label="Share Scottish Budget guide"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Scottish Budget 2027/28",
              value: "3 Dec 2026",
              unit: "presented at the Scottish Parliament",
              detail:
                "Finance Secretary Jenny Gilruth delivers the 2027/28 Scottish Budget on Thursday 3 December 2026. It sets Scottish income tax thresholds from 6 April 2027, Social Security Scotland benefit rates, council funding for 2027/28, and winter support delivery.",
              rows: [
                { label: "Budget date", value: "Thursday 3 December 2026" },
                { label: "Delivered by", value: "Jenny Gilruth (Finance Secretary)" },
                { label: "Tax changes start", value: "6 April 2027 (2027/28 tax year)" },
                { label: "Current Higher rate (42%)", value: "Starts at £43,663 in 2026/27" },
              ],
              asOf: "Checked 21 November 2026 · Scottish Government & Scottish Parliament",
              source: {
                publisher: "Scottish Government Budget hub",
                url: "https://www.gov.scot/budget/",
              },
              nextStep: {
                label: "Check your current 2026/27 take home pay",
                href: "/take-home-pay-calculator-scotland",
              },
            }}
          />
          <EditorialImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            caption={HERO_IMAGE.caption}
            aspect="wide"
            loading="eager"
            className="mt-10"
          />
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="Five things that hit your pocket"
            title="What to watch on Thursday 3 December 2026"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            A Westminster Budget and a Holyrood Budget pull completely different levers. Westminster
            controls the £12,570 Personal Allowance, National Insurance, the State Pension and
            Universal Credit. Holyrood controls Scottish income tax bands on earnings, council
            funding, Land and Buildings Transaction Tax (LBTT) and devolved benefits paid by Social
            Security Scotland.
          </p>
          <div className="mt-6">
            <GuideTable
              kicker="Scottish Budget · 3 December 2026"
              title="The five household money decisions in the 2027/28 Scottish Budget"
              columns={["Decision area", "What is on the table on 3 December", "Who it affects"]}
              align={["left", "left", "left"]}
              rows={WATCHLIST_TABLE}
              caption="We will update this page and our Scottish tax and benefit calculators on Thursday 3 December 2026 as soon as the Budget documents are laid before Parliament."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="1. Scottish income tax bands"
            title="Will the £43,663 Higher rate threshold stay frozen?"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              For the current {TAX_DATA.taxYear} tax year, the Scottish Government lifted the
              Starter (19%) and Basic (20%) thresholds by 7.4%, meaning anyone earning under around
              £30,000 pays slightly less income tax than someone on the exact same wage in England.
            </p>
            <p>
              Above £30,000, the picture flips. Because Scotland&apos;s{" "}
              <strong>42% Higher rate starts at £43,663</strong> (compared with £50,271 for
              England&apos;s 40% rate) and has been repeatedly frozen while wages rise with
              inflation, tens of thousands more Scottish teachers, nurses, police officers and
              skilled tradespeople are pulled into the 42% bracket every April. Economists call that{" "}
              <strong>fiscal drag</strong>.
            </p>
          </div>
          <div className="mt-6">
            <GuideTable
              kicker="Baseline before the 3 December Budget"
              title="Current 2026/27 Scottish income tax bands"
              columns={["Band", "2026/27 taxable pay", "Rate", "Current position"]}
              align={["left", "left", "right", "left"]}
              rows={CURRENT_TAX_TABLE}
              caption="Full England comparison and salary tables are on our Scottish income tax bands page."
            />
          </div>
          <p className="mt-5 max-w-[66ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            You can check what you currently pay on any wage from £15,000 to £150,000 using our{" "}
            <Link href="/take-home-pay-calculator-scotland">Scottish take home pay calculator</Link>{" "}
            and <Link href="/tax-bands-scotland">Scottish tax bands guide</Link>. Once Jenny Gilruth
            sits down on 3 December, you will be able to compare your current 2026/27 pay packet
            with the new 2027/28 thresholds right here.
          </p>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="2. Energy bills & the £100 payment"
            title="How the Budget lands eight days after Ofgem's January price cap shock"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              Timing is everything for this Budget. On Wednesday 25 November 2026, eight days before
              Jenny Gilruth stands up at Holyrood, Ofgem announces the confirmed{" "}
              <Link href="/energy-price-cap-scotland">January to March 2027 energy price cap</Link>.
              Cornwall Insight&apos;s final forecast warns that typical Direct Debit bills will jump
              26% (+£443 a year) from £1,723 to <strong>£2,166</strong>.
            </p>
            <p>
              Following the UK Budget at the end of October, the Scottish Government confirmed it
              would mirror Westminster&apos;s{" "}
              <Link href="/100-energy-payment-scotland">
                £100 winter energy payment for homes in council tax bands A to D
              </Link>
              , covering around 1.9 million Scottish households at a cost of at least £190 million.
              Households are looking to the 3 December Budget statement for the confirmed council
              delivery mechanism and payment dates.
            </p>
            <p>
              If you are on a low income today, do not wait for the Budget to claim existing help:
              check whether you need to apply directly to your electricity supplier for the{" "}
              <Link href="/warm-home-discount-scotland">£150 Warm Home Discount in Scotland</Link>,
              and check your entitlement to{" "}
              <Link href="/winter-heating-payment">Winter Heating Payment</Link> (£59.75) and{" "}
              <Link href="/winter-fuel-payment-scotland">Pension Age Winter Heating Payment</Link>.
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="3. Council tax & the mansion tax bill"
            title="What the Budget means for your 2027/28 council tax bill"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              In 2026/27, every single one of Scotland&apos;s 32 councils put up council tax, with{" "}
              <Link href="/council-tax-increase-scotland">Band D rises</Link> stretching across the
              country after the previous freeze ended.
            </p>
            <p>
              The 3 December Scottish Budget sets the local government revenue settlement for
              2027/28. When councils receive a tight grant settlement from Holyrood and no funded
              freeze, they make up the gap by raising local{" "}
              <Link href="/council-tax-bands-scotland">council tax bands</Link> in February and
              March.
            </p>
            <p>
              Alongside next year&apos;s funding settlement, Holyrood has just begun debating the{" "}
              <Link href="/mansion-tax-scotland">
                Council Tax (High Value Dwellings etc.) (Scotland) Bill
              </Link>
              , which introduces new <strong>Band I (£1m to £2m)</strong> and{" "}
              <strong>Band J (over £2m)</strong> charges from April 2028, as well as backdated
              council tax exemptions for people diagnosed with dementia.
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="4. Social Security Scotland benefits"
            title="Scottish Child Payment, disability benefits and April 2027 uprating"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              By law, the Scottish Government must uprate devolved Social Security Scotland benefits
              by inflation each April. On 3 December, the Budget sets out the exact 2027/28 weekly
              rates for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link href="/scottish-child-payment">Scottish Child Payment</Link> (including
                scrutiny over promised enhanced support for eligible families with babies under one)
              </li>
              <li>
                <Link href="/adult-disability-payment">Adult Disability Payment</Link> (Scotland&apos;s
                replacement for PIP)
              </li>
              <li>
                <Link href="/carer-support-payment">Carer Support Payment</Link> and the annual{" "}
                <Link href="/young-carers-allowance-scotland">Young Carer Grant</Link>
              </li>
              <li>
                <Link href="/best-start-grant">Best Start Grant and Best Start Foods</Link>
              </li>
            </ul>
            <p>
              For this winter&apos;s early holiday payment dates around Christmas and New Year, see{" "}
              <Link href="/social-security-scotland-payment-dates">
                Social Security Scotland payment dates
              </Link>{" "}
              and <Link href="/scotland-bank-holidays">Scotland bank holidays</Link>.
            </p>
          </div>
          <Callout>
            <p className="font-[600] text-[var(--ink)] mb-1">
              Why the SNP needs opposition votes to pass the Budget
            </p>
            <p className="text-[16.5px] leading-[1.55] text-[var(--ink-2)]">
              Because the Scottish Government operates as a minority administration at Holyrood,
              publishing the Budget on 3 December is only step one. To pass the Budget (Scotland)
              Bill in early 2027, Jenny Gilruth must secure abstentions or votes from at least one
              other party in the chamber. That gives opposition MSPs leverage to demand extra cash
              for councils, housing, or tax threshold adjustments between December and February.
            </p>
          </Callout>
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="Key dates"
            title="The winter 2026/27 Scottish tax and bills calendar"
          />
          <div className="mt-6">
            <GuideTable
              kicker="Autumn 2026 to April 2027"
              title="Every key date from the UK Budget to the new April 2027 tax year"
              columns={["Date", "What happens"]}
              align={["left", "left"]}
              rows={TIMELINE_TABLE}
              caption="Bookmark this page: we will update every table on Thursday 3 December 2026 as soon as the 2027/28 Scottish Budget is published."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq
            items={FAQ}
            kicker="Questions"
            title="Common questions about the 2027/28 Scottish Budget"
          />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources and how each figure is used</p>
          <ul className="space-y-3.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            <li>
              <a
                href="https://www.gov.scot/budget/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Scottish Budget hub
              </a>
              , Scottish Government (gov.scot): official Thursday 3 December 2026 publication date
              for the 2027/28 Scottish Budget delivered by Deputy First Minister and Finance
              Secretary Jenny Gilruth.
            </li>
            <li>
              <a
                href="https://www.gov.scot/publications/scottish-income-tax-rates-and-bands/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Scottish Income Tax rates and bands 2026 to 2027
              </a>
              , Scottish Government (gov.scot): the six 2026/27 Scottish income tax bands (19% to
              48%), the 7.4% Starter and Basic threshold uplift, and the £43,663 Higher rate (42%)
              threshold compared against England&apos;s £50,271 40% threshold.
            </li>
            <li>
              <a
                href="https://www.fiscalcommission.scot/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Economic and Fiscal Forecasts
              </a>
              , Scottish Fiscal Commission: independent official forecasts of Scottish income tax
              revenues, fiscal drag across thresholds, and devolved social security spending.
            </li>
            <li>
              <a
                href="https://www.parliament.scot/bills-and-laws/bills/s7/council-tax-high-value-dwellings-etc-scotland-bill"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Council Tax (High Value Dwellings etc.) (Scotland) Bill
              </a>
              , Scottish Parliament: Band I (£1m to £2m) and Band J (over £2m) council tax reform
              introduced on 18 to 19 November 2026.
            </li>
            <li>
              <a
                href="https://www.cornwall-insight.com/press-releases/energy-bills-set-for-steep-rise-in-january/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Energy bills set for steep rise in January 2027
              </a>
              , Cornwall Insight: final forecast of a 26% (+£443) rise in the Ofgem energy price
              cap to £2,166 ahead of Ofgem&apos;s Wednesday 25 November 2026 announcement.
            </li>
            <li>
              <a
                href="https://revenue.scot/taxes/land-buildings-transaction-tax/residential-property"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Land and Buildings Transaction Tax (LBTT) residential rates
              </a>
              , Revenue Scotland: £145,000 residential nil rate threshold, £175,000 first time
              buyer threshold, and 8% Additional Dwelling Supplement (ADS).
            </li>
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="See what you keep on current Scottish tax rates"
        body="Enter your annual salary or hourly wage to see your exact Scottish income tax, National Insurance and take home pay, and compare Scotland with England."
        href="/take-home-pay-calculator-scotland"
        cta="Open take home pay calculator"
        secondaryHref="/tax-bands-scotland"
        secondaryCta="See all 6 Scottish tax bands"
      />
    </>
  );
}
