import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead, CTA } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";
import { calculateLbtt, LBTT_DATA } from "@/lib/lbtt/engine";
import LbttCalculator from "./LbttCalculator";
import Breadcrumbs from "@/components/Breadcrumbs";

const HERO_IMAGE = {
  src: "/images/editorial/lbtt-calculator-scotland-stamp-duty.webp",
  alt: "House keys and envelope on a Scottish stone cottage windowsill for LBTT guide",
  caption:
    "Buyers in Scotland pay Land and Buildings Transaction Tax (LBTT) to Revenue Scotland instead of Stamp Duty.",
  width: 1200,
  height: 800,
};

export const metadata = meta({
  title: "LBTT Calculator Scotland 2026/27: Stamp Duty & ADS",
  description:
    "Calculate Land and Buildings Transaction Tax (LBTT) in Scotland for 2026/27. Includes first-time buyer relief up to £175,000 and the 8% ADS second home rate.",
  path: "/lbtt-calculator-scotland",
  type: "website",
  image: HERO_IMAGE.src,
  imageAlt: HERO_IMAGE.alt,
  imageWidth: HERO_IMAGE.width,
  imageHeight: HERO_IMAGE.height,
  imageType: "image/webp",
});

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const WORKED_PRICES = [145_000, 175_000, 200_000, 250_000, 300_000, 350_000, 450_000, 600_000];

const FAQ = [
  {
    q: "Is there Stamp Duty in Scotland?",
    a: "No. Stamp Duty Land Tax (SDLT) only applies in England and Northern Ireland. In Scotland you pay Land and Buildings Transaction Tax (LBTT), collected by Revenue Scotland.",
  },
  {
    q: "How much is LBTT for first-time buyers in Scotland?",
    a: "Eligible first-time buyers pay 0% LBTT on the first £175,000 of the purchase price instead of £145,000. On any home priced at £175,000 or more, first-time buyer relief saves £600.",
  },
  {
    q: "What is the Additional Dwelling Supplement (ADS) rate in Scotland?",
    a: "ADS is 8% of the total purchase price for transactions with an effective date on or after 5 December 2024. It applies on top of standard LBTT if you buy an additional residential property for £40,000 or more and own more than one residential property at the end of the day.",
  },
  {
    q: "Can I reclaim ADS if I sell my old home later?",
    a: "Yes. If you buy a new main home before selling your previous main residence, you pay ADS upfront and can claim a repayment from Revenue Scotland if you sell your previous main home within 36 months.",
  },
  {
    q: "When do you have to pay LBTT?",
    a: "Your solicitor normally submits the LBTT return and pays Revenue Scotland on or shortly after the date of entry. The legal deadline is within 30 days of the effective date of the transaction.",
  },
];

export default function LbttCalculatorPage() {
  const workedRows = WORKED_PRICES.map((price) => [
    money.format(price),
    money.format(calculateLbtt(price, "standard").totalTax),
    money.format(calculateLbtt(price, "first-time").totalTax),
    money.format(calculateLbtt(price, "additional").totalTax),
  ]);

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Your money", path: "/money" },
          { name: "LBTT calculator Scotland", path: "/lbtt-calculator-scotland" },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "LBTT calculator Scotland 2026/27",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`Scotland · ${LBTT_DATA.taxYear} residential rates`}
          title="LBTT calculator Scotland: Stamp Duty and ADS worked out"
          lede="Scotland does not use Stamp Duty. Buyers pay Land and Buildings Transaction Tax (LBTT) to Revenue Scotland. Enter a property price below to see exact standard, first-time buyer and second home (8% ADS) costs."
        >
          <SharePage
            title="LBTT calculator Scotland 2026/27"
            text="Free Scottish LBTT (Stamp Duty) calculator for 2026/27, including first-time buyer relief and the 8% second home ADS rate."
            path="/lbtt-calculator-scotland"
            label="Share LBTT calculator"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "LBTT (Stamp Duty) thresholds in Scotland",
              value: "£145,000",
              unit: "standard 0% band",
              detail:
                "Standard buyers pay 0% LBTT up to £145,000, rising in slices from 2% to 12%. First-time buyers pay 0% up to £175,000. Second homes and buy-to-lets pay an extra 8% ADS on the full price at £40,000 or more.",
              rows: [
                { label: "Standard 0% threshold", value: "Up to £145,000" },
                { label: "First-time buyer 0%", value: "Up to £175,000 (saves £600)" },
                { label: "Additional property (ADS)", value: "8% on full price (£40,000+)" },
                { label: "Collected by", value: "Revenue Scotland" },
              ],
              asOf: `Current Revenue Scotland rates (${LBTT_DATA.taxYear})`,
              source: {
                publisher: "Revenue Scotland",
                url: "https://revenue.scot/taxes/land-buildings-transaction-tax/residential-property",
              },
              nextStep: {
                label: "Check council tax bands in your area",
                href: "/council-tax-bands-scotland",
              },
            }}
          />
        </ContentFrame>

        <ContentFrame className="pt-10">
          <LbttCalculator />
          <EditorialImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            caption={HERO_IMAGE.caption}
            aspect="wide"
            className="mt-12"
          />
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Official rates"
            title="Residential LBTT bands in Scotland"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            Like income tax, standard LBTT is charged in slices rather than on the whole purchase
            price. The one exception is the 8% Additional Dwelling Supplement (ADS), which applies to
            the entire purchase price once a second residential property costs £40,000 or more.
          </p>
          <div className="mt-6">
            <GuideTable
              kicker="Revenue Scotland"
              title="LBTT bands and percentages"
              columns={["Purchase price slice", "Standard rate", "First-time buyer rate"]}
              align={["left", "right", "right"]}
              rows={[
                ["Up to £145,000", "0%", "0%"],
                ["£145,001 to £175,000", "2%", "0%"],
                ["£175,001 to £250,000", "2%", "2%"],
                ["£250,001 to £325,000", "5%", "5%"],
                ["£325,001 to £750,000", "10%", "10%"],
                ["Over £750,000", "12%", "12%"],
              ]}
              caption="First-time buyer relief cannot be claimed on transactions where the 8% Additional Dwelling Supplement applies."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Quick reference"
            title="LBTT examples at common Scottish house prices"
          />
          <div className="mt-6">
            <GuideTable
              kicker="Worked examples"
              title="LBTT by property price"
              columns={["Property price", "Moving home", "First-time buyer", "Additional home (+8% ADS)"]}
              align={["left", "right", "right", "right"]}
              rows={workedRows}
              caption="Worked using official Revenue Scotland residential LBTT bands and the 8% ADS rate."
            />
          </div>
          <p className="mt-5 max-w-[66ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            Comparing places to buy? Check{" "}
            <Link href="/cheapest-place-to-live-in-scotland">the cheapest places to live in Scotland</Link>,{" "}
            <Link href="/safest-place-to-live-in-scotland">the safest places in Scotland</Link>,{" "}
            <Link href="/council-tax-bands-scotland">council tax bands for all 32 Scottish councils</Link>, or how
            Scotland&apos;s new{" "}
            <Link href="/mansion-tax-scotland">
              Council Tax Bands I and J (mansion tax)
            </Link>{" "}
            work for homes worth over £1 million.
          </p>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq items={FAQ} kicker="Questions" title="Common questions about LBTT and Stamp Duty in Scotland" />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources</p>
          <ul className="space-y-2.5 text-[15.5px] text-[var(--ink-2)]">
            <li>
              <a
                href="https://revenue.scot/taxes/land-buildings-transaction-tax/residential-property"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                LBTT for residential property transactions
              </a>
              , Revenue Scotland
            </li>
            <li>
              <a
                href="https://revenue.scot/taxes/land-buildings-transaction-tax/additional-dwelling-supplement-ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[580] text-[var(--ink)]"
              >
                Additional Dwelling Supplement (ADS) rates and rules
              </a>
              , Revenue Scotland
            </li>
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="Compare Scottish council areas before you move"
        body="See house prices, rent, council tax, crime, schools and local pay side by side for any two council areas in Scotland."
        href="/compare-areas"
        cta="Compare two areas"
        secondaryHref="/best-place-to-live-in-scotland"
        secondaryCta="Best places to live"
      />
    </>
  );
}
