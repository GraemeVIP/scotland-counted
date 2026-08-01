import Link from "next/link";
import { Page, PageHeader, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import CouncilTaxLookup from "./CouncilTaxLookup";
import WaterCharge from "@/components/WaterCharge";
import { councilTaxByBand, chargesFor, COUNCIL_TAX_YEAR, WATER_YEAR } from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Council tax bands in Scotland: how much is my council tax?",
  description:
    "How much council tax you pay in Scotland, by band and by council. Every band from A to H with water and waste water included, which most figures leave out. Enter your postcode for your own council.",
  path: "/council-tax-bands-scotland",
  type: "website",
});

const FAQ = [
  {
    q: "How do I find out my council tax band?",
    a: "Your band belongs to the property, not the postcode, and only the Scottish Assessors hold it. You can look it up free on the Scottish Assessors Association website. Most flats and smaller homes in Scotland are Band A to C.",
  },
  {
    q: "Does council tax include water charges in Scotland?",
    a: "Yes. Water and waste water charges are set by Scottish Water but collected on your council tax bill. They are a large part of it — £434.88 a year at Band A — and most figures published online leave them out.",
  },
  {
    q: "Can I pay less council tax?",
    a: "Possibly. Council Tax Reduction cuts the bill for people on a low income, and anyone receiving it can get up to 35% off the water charges as well. An adult living alone gets a 25% single person discount. Both are applied for through your council and both are free to apply for.",
  },
  {
    q: "Why is council tax different in each council area?",
    a: "Each of Scotland's 32 councils sets its own Band D rate, and every other band is a fixed proportion of it. Band A is two thirds of Band D; Band H is about two and a half times it. So the same size of home costs different amounts in different council areas.",
  },
  {
    q: "What months are free of council tax?",
    a: "Most Scottish councils spread the bill over 10 instalments from April to January, so February and March have no payment. That is not a discount — the same total is collected in ten payments rather than twelve. You can usually ask your council to spread it over 12 months instead, which makes each payment smaller.",
  },
  {
    q: "How is council tax calculated?",
    a: "Two things decide it. Your property has a band from A to H, set by the Scottish Assessors from what it was worth in April 1991. Your council then sets a Band D rate each year, and every other band is a fixed fraction of that: Band A is 240/360 of Band D, Band C is 320/360, Band H is 882/360.",
  },
  {
    q: "How much is council tax a month in Scotland?",
    a: "It depends on your band and your council. At Band A, the most common band in Scotland, the bill including water is roughly £125 to £135 a month. At Band D it is roughly £180 to £195. The postcode lookup above gives your own council's exact figures.",
  },
];

export default function CouncilTaxPage() {
  const withData = councils.filter((c) => councilTaxByBand[c.slug]);
  const bandD = withData
    .map((c) => ({ name: c.name, slug: c.slug, total: chargesFor(c.slug)![3].total }))
    .sort((a, b) => b.total - a.total);
  const cited = getSources(["council-tax-scotland", "scottish-water-2026"]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Council tax bands", path: "/council-tax-bands-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Scotland · all 32 councils · bands A to H"
          title="How much is my council tax?"
          lede="Enter your postcode and see what every band costs where you live — with water and waste water included, which most figures leave out. Scotland only: the bands and rates here do not apply in England or Wales."
        />

        <div className="mt-2 mb-9">
          <InShort>
            <p>
              Council tax is worked out from a <strong>band</strong>, which depends on your
              property, and a <strong>rate</strong>, which your council sets.
            </p>
            <p>
              Your bill also includes <strong>water and waste water</strong>. That is Scottish
              Water&apos;s charge, not the council&apos;s, but it arrives on the same bill — and at
              Band A it is £434.88 a year on its own.
            </p>
            <p>On a low income you may pay a lot less. We explain how below.</p>
          </InShort>
          <p className="mt-4 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            Need the rules as well as the price? Read the{" "}
            <Link href="/blog/council-tax-in-scotland-guide">
              plain-English guide to bands, discounts, reductions, appeals and arrears
            </Link>.
          </p>
        </div>

        <WaterCharge className="mb-10" />

        <CouncilTaxLookup />

        <section className="pt-14">
          <h2 className="h2 mb-3">Band D across Scotland, worst first</h2>
          <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            Band D is the standard comparison. Every other band is a fixed proportion of it, so
            this ranking holds for all bands. Water and waste water are included.
          </p>
          <div className="mt-6 grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
            {bandD.map((c, i) => (
              <Link
                key={c.slug}
                href={`/council-tax-bands-scotland/${c.slug}`}
                className="group flex items-baseline justify-between gap-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--brand)]"
              >
                <span className="ui text-[14.5px] font-[640] leading-[1.25] text-[var(--ink-2)] group-hover:text-[var(--ink)]">
                  <span className="tnum text-[var(--muted)]">{i + 1}.</span> {c.name}
                </span>
                <span className="display-stat shrink-0 text-[17px] tnum text-[var(--ink)]">
                  £{Math.round(c.total).toLocaleString("en-GB")}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-6">Questions people ask</h2>
          <div className="grid max-w-[1000px] gap-4 lg:grid-cols-2">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t-2 border-[var(--ink)] pt-4">
                <h3 className="h3 mb-2">{f.q}</h3>
                <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-12">
          <h2 className="label mb-4">Where these figures come from</h2>
          <ul className="max-w-[760px] space-y-2.5">
            {cited.map((s) => (
              <li key={s.id} className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>{" "}
                — {s.publisher}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[720px] text-[15px] leading-[1.55] text-[var(--muted)]">
            Council tax is {COUNCIL_TAX_YEAR}, the latest complete set published for all 32
            councils. Water is {WATER_YEAR}. Some councils have announced rises for 2026-27 that
            are not in the national dataset yet, so your bill may be slightly higher than shown.
          </p>
        </section>
      </Page>
    </>
  );
}
