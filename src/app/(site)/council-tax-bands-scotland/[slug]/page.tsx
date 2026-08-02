import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, PageHeader, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  BAND_LETTERS,
  chargesFor,
  councilTaxByBand,
  waterCharges2026,
  COUNCIL_TAX_YEAR,
  PREVIOUS_COUNCIL_TAX_YEAR,
  WATER_YEAR,
  type BandCharge,
} from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";
import { getSources } from "@/lib/data/sources";
import WaterCharge from "@/components/WaterCharge";
import Faq from "@/components/Faq";

/**
 * Two kinds of page behind one dynamic segment.
 *
 *   band-a … band-h   one band across all 32 councils
 *   glasgow-city …    one council across all eight bands
 *
 * The council pages are the ones that matter. Searches pair a council with a
 * band — "council tax band a glasgow", "band e council tax glasgow" — far more
 * often than they ask about a band in the abstract, and each council page
 * carries its own eight figures, so none of it is a thin split of the parent.
 */

const RATIOS: Record<string, string> = {
  A: "240/360", B: "280/360", C: "320/360", D: "360/360",
  E: "473/360", F: "585/360", G: "705/360", H: "882/360",
};

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const exact = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });
const percent = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

const SEARCH_COUNCIL_NAMES: Record<string, string> = {
  "aberdeen-city": "Aberdeen",
  "dundee-city": "Dundee",
  "city-of-edinburgh": "Edinburgh",
  "glasgow-city": "Glasgow",
};

function councilSearchName(slug: string, officialName: string) {
  return SEARCH_COUNCIL_NAMES[slug] ?? officialName;
}

export function generateStaticParams() {
  return [
    ...BAND_LETTERS.map((b) => ({ slug: `band-${b.toLowerCase()}` })),
    ...councils.filter((c) => councilTaxByBand[c.slug]).map((c) => ({ slug: c.slug })),
  ];
}

type BandView = {
  kind: "band";
  letter: string;
  rows: (BandCharge & { name: string; slug: string })[];
  water: { water: number; wasteWater: number };
};
type CouncilView = {
  kind: "council";
  name: string;
  slug: string;
  charges: BandCharge[];
};

function resolve(slug: string): BandView | CouncilView | null {
  const bandMatch = /^band-([a-h])$/.exec(slug);
  if (bandMatch) {
    const letter = bandMatch[1].toUpperCase();
    const rows = councils
      .map((c) => {
        const charges = chargesFor(c.slug);
        if (!charges) return null;
        return { name: c.name, slug: c.slug, ...charges.find((x) => x.band === letter)! };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.total - a.total);
    if (!rows.length) return null;
    return { kind: "band", letter, rows, water: waterCharges2026[letter] };
  }

  const council = councils.find((c) => c.slug === slug);
  const charges = council ? chargesFor(council.slug) : null;
  if (!council || !charges) return null;
  return { kind: "council", name: council.name, slug: council.slug, charges };
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const v = resolve(slug);
  if (!v) return {};

  if (v.kind === "band") {
    const cheap = v.rows[v.rows.length - 1];
    const dear = v.rows[0];
    return meta({
      title: `Council Tax Band ${v.letter} Scotland 2026/27 | Monthly Cost`,
      description: `Compare 2026/27 Band ${v.letter} council tax in all 32 Scottish councils, from ${pounds.format(cheap.total)} in ${cheap.name} to ${pounds.format(dear.total)} in ${dear.name}, water included.`,
      path: `/council-tax-bands-scotland/band-${v.letter.toLowerCase()}`,
      type: "website",
    });
  }

  const d = v.charges[3];
  const placeName = councilSearchName(v.slug, v.name);
  return meta({
    title: `${placeName} Council Tax Bands 2026/27 | A-H Prices`,
    description: `2026/27 ${placeName} council tax by band. Band D rose ${percent.format(d.councilTaxRisePct)}% to ${pounds.format(d.councilTax)} before water. See A to H, last year's price and current totals.`,
    path: `/council-tax-bands-scotland/${v.slug}`,
    type: "website",
  });
}

export default async function CouncilTaxSlugPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const v = resolve(slug);
  if (!v) notFound();
  const cited = getSources(["council-tax-scotland", "scottish-water-2026"]);

  const sourceNote = (
    <section className="pt-12">
      <h2 className="label mb-4">Where these figures come from</h2>
      <ul className="max-w-[760px] space-y-2.5">
        {cited.map((s) => (
          <li key={s.id} className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> — {s.publisher}
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[720px] text-[15px] leading-[1.55] text-[var(--muted)]">
        Council tax figures for {PREVIOUS_COUNCIL_TAX_YEAR} and {COUNCIL_TAX_YEAR} are the
        complete official sets for all 32 councils. Water and waste water are separate{" "}
        {WATER_YEAR} charges published by Scottish Water.
      </p>
    </section>
  );

  /* ---------- One council, all eight bands ---------- */
  if (v.kind === "council") {
    const a = v.charges[0];
    const d = v.charges[3];
    const placeName = councilSearchName(v.slug, v.name);
    const faq = [
      ...v.charges.slice(0, 5).map((c) => ({
        q: `How much is Band ${c.band} council tax in ${placeName}?`,
        a: `Band ${c.band} in ${placeName} is ${exact.format(c.total)} a year including water and waste water, or about ${exact.format(c.total / 12)} a month. The council-tax part rose from ${exact.format(c.previousCouncilTax)} in 2025/26 to ${exact.format(c.councilTax)} in 2026/27, an increase of ${exact.format(c.councilTaxRise)} or ${percent.format(c.councilTaxRisePct)}%. Scottish Water's separate charges add ${exact.format(c.water + c.wasteWater)}.`,
      })),
      {
        q: `How much did council tax rise in ${placeName} in 2026/27?`,
        a: `At Band D, ${placeName} council tax rose from ${exact.format(d.previousCouncilTax)} in 2025/26 to ${exact.format(d.councilTax)} in 2026/27. That is ${exact.format(d.councilTaxRise)} more a year, or ${percent.format(d.councilTaxRisePct)}%. This compares council tax only and excludes Scottish Water charges.`,
      },
      {
        q: `How do I find my council tax band in ${placeName}?`,
        a: `Your band is set by the Scottish Assessors, not the council, and it depends on what the property was worth in April 1991. Look it up free on the Scottish Assessors Association website, then find that band in the table on this page.`,
      },
      {
        q: `Can I pay less council tax in ${placeName}?`,
        a: `Possibly. Council Tax Reduction lowers the bill for people on a low income, and anyone getting it can have up to 35% off the water charges as well. An adult living alone gets 25% off. Both are applied for free through ${placeName} council.`,
      },
    ];

    return (
      <>
        <JsonLd data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Council tax bands", path: "/council-tax-bands-scotland" },
          { name: placeName, path: `/council-tax-bands-scotland/${v.slug}` },
        ])} />
        <JsonLd data={faqJsonLd(faq)} />

        <Page>
          <PageHeader
            eyebrow={`${placeName} · 2026/27 · bands A to H`}
            title={`${placeName} council tax bands 2026/27`}
            lede={`Band D council tax rose by ${exact.format(d.councilTaxRise)} to ${exact.format(d.councilTax)} — ${percent.format(d.councilTaxRisePct)}%. The full Band D bill is ${pounds.format(d.total)} after Scottish Water's separate charges are added.`}
          />

          <div className="mt-2 mb-9">
            <InShort>
              <p>
                Most homes in {placeName} are <strong>Band A to C</strong>. At Band A the bill is
                about <strong>{exact.format(a.total / 12)} a month</strong>.
              </p>
              <p>
                At Band D, council tax was <strong>{exact.format(d.previousCouncilTax)}</strong> in{" "}
                {PREVIOUS_COUNCIL_TAX_YEAR}. It is now <strong>{exact.format(d.councilTax)}</strong>,
                up <strong>{exact.format(d.councilTaxRise)} ({percent.format(d.councilTaxRisePct)}%)</strong>.
              </p>
              <p>
                Your bill includes <strong>water and waste water</strong>. That is Scottish
                Water&apos;s charge, not the council&apos;s, and almost every figure published
                online leaves it out.
              </p>
              <p>On a low income you may pay considerably less. See below.</p>
            </InShort>
          </div>

          <section>
            <div className="mb-6 border-b-2 border-[var(--ink)] pb-4">
              <p className="kicker mb-2 text-[var(--brand)]">Every band</p>
              <h2 className="display-stat text-[clamp(26px,3.2vw,40px)] max-w-[20ch]">
                What each band costs in {placeName}
              </h2>
            </div>

            <div className="space-y-3">
              {v.charges.map((c) => (
                <div
                  key={c.band}
                  id={`band-${c.band.toLowerCase()}`}
                  className="scroll-mt-24 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-[19px] font-[750]">
                      Band {c.band} council tax in {placeName}
                    </h3>
                    <p className="display-stat text-[26px] tnum text-[var(--brand)]">
                      {pounds.format(c.total)}
                      <span className="ui text-[14px] font-[600] text-[var(--muted)]"> a year</span>
                    </p>
                  </div>
                  <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                    About <strong className="text-[var(--ink)]">{exact.format(c.total / 12)} a
                    month</strong> or {exact.format(c.total / 52)} a week.
                  </p>
                  <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                    Council tax alone: <strong className="text-[var(--ink)]">{exact.format(c.councilTax)}</strong>,
                    up {exact.format(c.councilTaxRise)} ({percent.format(c.councilTaxRisePct)}%) from{" "}
                    {exact.format(c.previousCouncilTax)} last year. Scottish Water separately adds{" "}
                    {exact.format(c.water)} for water and {exact.format(c.wasteWater)} for waste
                    water. Band {c.band} is {RATIOS[c.band]} of the Band D rate.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <WaterCharge className="mt-12" />

          <section className="pt-12">
            <h2 className="h2 mb-4">Compare with other councils</h2>
            <div className="flex flex-wrap gap-2">
              {BAND_LETTERS.map((b) => (
                <Link
                  key={b}
                  href={`/council-tax-bands-scotland/band-${b.toLowerCase()}`}
                  className="ui rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-2.5 text-[15px] font-[650] text-[var(--ink-2)] no-underline transition-colors hover:border-[var(--brand)]"
                >
                  Band {b} everywhere
                </Link>
              ))}
            </div>
            <p className="mt-5 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
              <Link href={`/areas/${v.slug}`}>See poverty and pay in {placeName}</Link>, or{" "}
              <Link href="/council-tax-bands-scotland">check another postcode</Link>.
            </p>
          </section>

          <Faq items={faq} className="pt-12" />

          {sourceNote}
        </Page>
      </>
    );
  }

  /* ---------- One band, all 32 councils ---------- */
  const { letter, rows, water } = v;
  const cheapest = rows[rows.length - 1];
  const dearest = rows[0];
  const median = rows[Math.floor(rows.length / 2)];
  const rises = [...rows].sort((a, b) => b.councilTaxRisePct - a.councilTaxRisePct);
  const largestRise = rises[0];
  const smallestRise = rises[rises.length - 1];
  const faq = [
    {
      q: `How much is Band ${letter} council tax?`,
      a: `It depends on the council. Across Scotland, Band ${letter} runs from ${pounds.format(cheapest.total)} a year in ${cheapest.name} to ${pounds.format(dearest.total)} in ${dearest.name}, water included — about ${exact.format(median.total / 12)} a month in a typical area.`,
    },
    {
      q: `How much is Band ${letter} council tax a month?`,
      a: `Between ${exact.format(cheapest.total / 12)} and ${exact.format(dearest.total / 12)} a month over 12 instalments. Most Scottish councils spread it over 10 from April to January instead, so payments are larger but February and March are free.`,
    },
    {
      q: `Does Band ${letter} council tax include water?`,
      a: `Your bill does. At Band ${letter} Scottish Water charges ${exact.format(water.water)} for water and ${exact.format(water.wasteWater)} for waste water, ${exact.format(water.water + water.wasteWater)} in total, collected with the council tax.`,
    },
    {
      q: `How much did Band ${letter} council tax rise in 2026/27?`,
      a: `It depends on the council. The Band ${letter} council-tax increase runs from ${percent.format(smallestRise.councilTaxRisePct)}% in ${smallestRise.name} to ${percent.format(largestRise.councilTaxRisePct)}% in ${largestRise.name}. Those figures compare council tax only; Scottish Water charges are separate.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Council tax bands", path: "/council-tax-bands-scotland" },
        { name: `Band ${letter}`, path: `/council-tax-bands-scotland/band-${letter.toLowerCase()}` },
      ])} />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow={`Band ${letter} · 2026/27 · all 32 Scottish councils`}
          title={`Council tax Band ${letter} in Scotland: monthly and yearly cost`}
          lede={`Band ${letter} costs between ${pounds.format(cheapest.total)} and ${pounds.format(dearest.total)} a year in Scotland depending on your council, water and waste water included.`}
        />

        <div className="mt-2 mb-9">
          <InShort>
            <p>
              A Band {letter} home pays about{" "}
              <strong>{exact.format(median.total / 12)} a month</strong> in a typical Scottish
              council area.
            </p>
            <p>
              Band {letter} is <strong>{RATIOS[letter]}</strong> of your council&apos;s Band D
              rate. That fraction is fixed by law and identical in every council.
            </p>
            <p>
              Council tax rose by <strong>{percent.format(smallestRise.councilTaxRisePct)}% to{" "}
              {percent.format(largestRise.councilTaxRisePct)}%</strong> depending on the council.
              Scottish Water is separate from that rise.
            </p>
            <p>Scotland only. Bands and rates work differently in England and Wales.</p>
          </InShort>
        </div>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b-2 border-[var(--ink)] pb-4">
            <div>
              <p className="kicker mb-2 text-[var(--brand)]">Every council</p>
              <h2 className="display-stat text-[clamp(26px,3.2vw,40px)] max-w-[20ch]">
                Band {letter} in all 32 Scottish councils
              </h2>
            </div>
            <p className="ui text-[14.5px] font-[650] tnum text-[var(--muted)]">
              Current total and council-tax rise
            </p>
          </div>
          <div className="overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)]">
            {rows.map((r, i) => (
              <Link
                key={r.slug}
                href={`/council-tax-bands-scotland/${r.slug}#band-${letter.toLowerCase()}`}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 border-b border-[var(--rule)] bg-[var(--surface)] px-5 py-3.5 no-underline transition-colors last:border-0 hover:bg-[var(--surface-2)]"
              >
                <span className="ui w-6 text-[14px] tnum text-[var(--muted)]">{i + 1}</span>
                <span>
                  <span className="ui block text-[15.5px] font-[640] text-[var(--ink)]">{r.name}</span>
                  <span className="mt-1 block text-[15px] leading-[1.4] text-[var(--muted)]">
                    Council tax {exact.format(r.previousCouncilTax)} → {exact.format(r.councilTax)}
                  </span>
                </span>
                <span className="text-right">
                  <span className="display-stat block text-[19px] tnum text-[var(--ink)]">
                    {pounds.format(r.total)}
                  </span>
                  <span className="mt-1 block text-[15px] leading-[1.4] tnum text-[var(--action)]">
                    +{exact.format(r.councilTaxRise)} · {percent.format(r.councilTaxRisePct)}%
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-12">
          <h2 className="h2 mb-4">Other bands</h2>
          <div className="flex flex-wrap gap-2">
            {BAND_LETTERS.map((b) => (
              <Link
                key={b}
                href={`/council-tax-bands-scotland/band-${b.toLowerCase()}`}
                aria-current={b === letter ? "page" : undefined}
                className={`ui rounded-[var(--r-s)] border px-4 py-2.5 text-[15px] font-[650] no-underline transition-colors ${
                  b === letter
                    ? "border-[var(--brand)] bg-[var(--brand-wash)] text-[var(--ink)]"
                    : "border-[var(--rule)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--brand)]"
                }`}
              >
                Band {b}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            Not sure which band you are?{" "}
            <Link href="/council-tax-bands-scotland">Check with your postcode</Link>, or look the
            property up free on the{" "}
            <a href="https://www.saa.gov.uk/" target="_blank" rel="noopener noreferrer">
              Scottish Assessors
            </a>{" "}
            site.
          </p>
        </section>

        <Faq items={faq} className="pt-12" />

        {sourceNote}
      </Page>
    </>
  );
}
