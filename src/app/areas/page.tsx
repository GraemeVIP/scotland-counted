import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import Figure from "@/components/charts/Figure";
import AreaDumbbell from "./AreaDumbbell";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { councilsByLevel, councilsByChange, COUNCIL_YEARS } from "@/lib/data/councils";

export const metadata = meta({
  title: "Child poverty in every Scottish council area",
  description:
    "All 32 Scottish council areas ranked by child poverty after housing costs, 2014/15 to 2023/24. Glasgow is highest at 36.1%; East Renfrewshire lowest at 12.0%.",
  path: "/areas",
});

export default function Areas() {
  const byLevel = councilsByLevel();
  const byChange = councilsByChange();
  const first = COUNCIL_YEARS[0];
  const last = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];
  const rose = byChange.filter((c) => c.change > 0).length;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Child poverty by Scottish council area, 2014/15–2023/24",
          description:
            "Relative child poverty after housing costs for all 32 Scottish council areas across ten financial years, with counts of children and change over the period.",
          path: "/areas",
          keywords: ["child poverty", "Scotland", "council area", "local authority", "deprivation"],
          temporalCoverage: "2014/2024",
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`All 32 council areas · ${first} – ${last}`}
          title="Child poverty in every Scottish council area"
          lede={`Glasgow is highest in Scotland and rose fastest. ${rose} of the 32 areas got worse over the decade; the rest improved. Pick any area for its own page.`}
        />

        <div className="mt-9">
          <Figure
            title={`Every council area in Scotland, ${first} and ${last}`}
            sub="Child poverty after housing costs · ranked by today's level · End Child Poverty / Loughborough University"
            caption="Tap or click any row for that area's own page. Blue connectors mean the rate rose over the decade; grey means it fell."
          >
            <AreaDumbbell
              rows={byLevel.map((c) => ({
                name: c.name,
                slug: c.slug,
                from: c.pcts[0],
                to: c.pcts[9],
                highlight: c.slug === "glasgow-city",
              }))}
              fromLabel={first}
              toLabel={last}
            />
          </Figure>
        </div>

        <section className="pt-12">
          <h2 className="h2 mb-5">Ranked by today&apos;s rate</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[15px]">
              <thead>
                <tr>
                  {["#", "Council area", last, first, "Change", "Children"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--muted)] font-normal text-right first:text-left [&:nth-child(2)]:text-left pr-4 pb-2.5 border-b border-[var(--rule)] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byLevel.map((c) => (
                  <tr
                    key={c.slug}
                    className={c.slug === "glasgow-city" ? "bg-[var(--glasgow-wash)]" : undefined}
                  >
                    <td className="pr-4 py-2.5 border-b border-[var(--rule)] tnum text-[var(--muted)]">
                      {c.rankLevel}
                    </td>
                    <td className="pr-4 py-2.5 border-b border-[var(--rule)]">
                      <Link
                        href={`/areas/${c.slug}`}
                        className={`hover:text-[var(--glasgow)] ${
                          c.slug === "glasgow-city" ? "font-[640]" : ""
                        }`}
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="pr-4 py-2.5 border-b border-[var(--rule)] text-right tnum font-[600]">
                      {c.pcts[9]}%
                    </td>
                    <td className="pr-4 py-2.5 border-b border-[var(--rule)] text-right tnum text-[var(--ink-2)]">
                      {c.pcts[0]}%
                    </td>
                    <td
                      className={`pr-4 py-2.5 border-b border-[var(--rule)] text-right tnum ${
                        c.change > 0 ? "text-[var(--bad)]" : "text-[var(--good)]"
                      }`}
                    >
                      {c.change > 0 ? "+" : ""}
                      {c.change}
                    </td>
                    <td className="py-2.5 border-b border-[var(--rule)] text-right tnum text-[var(--ink-2)]">
                      {c.counts[9].toLocaleString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Col className="pt-12">
          <h2 className="h2 mb-4">The pattern behind the ranking</h2>
          <p>
            The three areas with the lowest child poverty — {byLevel[31].name},{" "}
            {byLevel[30].name} and {byLevel[29].name} — are all commuter belt. Two of them border
            Glasgow directly.
          </p>
          <p>
            That is not a coincidence.{" "}
            <Link href="/why-glasgow">
              Glasgow hosts the region&apos;s better-paid jobs and exports the wages
            </Link>{" "}
            to exactly these places.
          </p>
        </Col>

        <CTA
          title="Find the figures for where you live"
          body="Every council area has its own page with ten years of data, its rank, and how it compares with Glasgow and with Scotland."
          href={`/areas/${byLevel[0].slug}`}
          cta={`Start with ${byLevel[0].name}`}
          secondaryHref="/take-action"
          secondaryCta="Write to your representative"
        />
      </Page>
    </>
  );
}
