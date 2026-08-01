import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, PageHeader, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  BAND_LETTERS,
  chargesFor,
  waterCharges2026,
  COUNCIL_TAX_YEAR,
  WATER_YEAR,
} from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";
import { getSources } from "@/lib/data/sources";

/**
 * One page per council tax band.
 *
 * "How much is band C council tax" and its variants are a real cluster of
 * searches with nothing good answering them for Scotland. Each page carries
 * that band's charge in all 32 councils, which is content that exists nowhere
 * else in one place — not a thin split of the parent page.
 */

/** Band D is the reference band; every other band is a fixed fraction of it. */
const RATIOS: Record<string, string> = {
  A: "240/360", B: "280/360", C: "320/360", D: "360/360",
  E: "473/360", F: "585/360", G: "705/360", H: "882/360",
};

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const exact = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });

export function generateStaticParams() {
  return BAND_LETTERS.map((b) => ({ band: b.toLowerCase() }));
}

function resolve(param: string) {
  const letter = param.toUpperCase();
  if (!(BAND_LETTERS as readonly string[]).includes(letter)) return null;
  const rows = councils
    .map((c) => {
      const charges = chargesFor(c.slug);
      if (!charges) return null;
      const row = charges.find((x) => x.band === letter)!;
      return { name: c.name, slug: c.slug, ...row };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.total - a.total);
  if (rows.length === 0) return null;
  const water = waterCharges2026[letter];
  const cheapest = rows[rows.length - 1];
  const dearest = rows[0];
  const median = rows[Math.floor(rows.length / 2)];
  return { letter, rows, water, cheapest, dearest, median };
}

export async function generateMetadata(props: { params: Promise<{ band: string }> }) {
  const { band } = await props.params;
  const data = resolve(band);
  if (!data) return {};
  return meta({
    title: `How much is Band ${data.letter} council tax in Scotland?`,
    description: `Band ${data.letter} council tax in every Scottish council, from ${pounds.format(data.cheapest.total)} to ${pounds.format(data.dearest.total)} a year including water and waste water. Updated figures for all 32 councils.`,
    path: `/council-tax-bands-scotland/${data.letter.toLowerCase()}`,
    type: "website",
  });
}

export default async function BandPage(props: { params: Promise<{ band: string }> }) {
  const { band } = await props.params;
  const data = resolve(band);
  if (!data) notFound();

  const { letter, rows, water, cheapest, dearest, median } = data;
  const cited = getSources(["council-tax-scotland", "scottish-water-2026"]);

  const faq = [
    {
      q: `How much is Band ${letter} council tax?`,
      a: `It depends on your council. Across Scotland, Band ${letter} ranges from ${pounds.format(cheapest.total)} a year in ${cheapest.name} to ${pounds.format(dearest.total)} in ${dearest.name}, including water and waste water. That is roughly ${exact.format(median.total / 12)} a month in a typical council area.`,
    },
    {
      q: `How much is Band ${letter} council tax a month?`,
      a: `Between ${exact.format(cheapest.total / 12)} and ${exact.format(dearest.total / 12)} a month depending on your council, if you pay over 12 instalments. Most Scottish councils spread the bill over 10 instalments from April to January instead, which makes each payment larger but leaves February and March free.`,
    },
    {
      q: `Does Band ${letter} council tax include water charges?`,
      a: `Your bill does. Scottish Water charges ${exact.format(water.water)} for water supply and ${exact.format(water.wasteWater)} for waste water at Band ${letter}, ${exact.format(water.water + water.wasteWater)} in total. It is collected on the council tax bill, and most figures published online leave it out.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Council tax bands", path: "/council-tax-bands-scotland" },
          { name: `Band ${letter}`, path: `/council-tax-bands-scotland/${letter.toLowerCase()}` },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow={`Band ${letter} · all 32 Scottish councils`}
          title={`How much is Band ${letter} council tax?`}
          lede={`Band ${letter} costs between ${pounds.format(cheapest.total)} and ${pounds.format(dearest.total)} a year in Scotland, depending on your council. Water and waste water are included below — most figures leave them out.`}
        />

        <div className="mt-2 mb-9">
          <InShort>
            <p>
              A Band {letter} home pays about{" "}
              <strong>{exact.format(median.total / 12)} a month</strong> in a typical Scottish
              council area, or <strong>{pounds.format(median.total)} a year</strong>.
            </p>
            <p>
              Band {letter} is <strong>{RATIOS[letter]}</strong> of your council&apos;s Band D
              rate. That fraction is fixed by law and is the same in every council.
            </p>
            <p>
              This is Scotland only. Bands and rates work differently in England and Wales.
            </p>
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
            <p className="ui text-[14.5px] font-[650] text-[var(--muted)] tnum">
              A year, water included
            </p>
          </div>

          <div className="overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)]">
            {rows.map((r, i) => (
              <Link
                key={r.slug}
                href={`/areas/${r.slug}`}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-[var(--rule)] bg-[var(--surface)] px-5 py-3.5 no-underline transition-colors last:border-0 hover:bg-[var(--surface-2)]"
              >
                <span className="ui w-6 text-[14px] tnum text-[var(--muted)]">{i + 1}</span>
                <span className="ui text-[15.5px] font-[640] text-[var(--ink)]">{r.name}</span>
                <span className="display-stat text-[19px] tnum text-[var(--ink)]">
                  {pounds.format(r.total)}
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-[15px] leading-[1.55] text-[var(--muted)]">
            Council tax {COUNCIL_TAX_YEAR}, water {WATER_YEAR}. Each figure is that council&apos;s
            Band {letter} charge plus {exact.format(water.water + water.wasteWater)} of water and
            waste water.
          </p>
        </section>

        <section className="pt-12">
          <h2 className="h2 mb-4">Other bands</h2>
          <div className="flex flex-wrap gap-2">
            {BAND_LETTERS.map((b) => (
              <Link
                key={b}
                href={`/council-tax-bands-scotland/${b.toLowerCase()}`}
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

        <section className="pt-12">
          <h2 className="h2 mb-6">Questions people ask</h2>
          <div className="grid max-w-[1000px] gap-4 lg:grid-cols-2">
            {faq.map((f) => (
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
        </section>
      </Page>
    </>
  );
}
