import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import Figure from "@/components/charts/Figure";
import AreaDumbbell from "./AreaDumbbell";
import RankTable from "@/components/RankTable";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { councilsByLevel, councilsByChange, COUNCIL_YEARS } from "@/lib/data/councils";

export const metadata = meta({
  title: "Poverty, work and pay in every Scottish council area",
  description:
    "Evidence for all 32 Scottish council areas: child poverty after housing costs, out-of-work claimant rates from 2000 and resident pay from 2008, each compared with Scotland.",
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
          name: "Poverty, claimant count and pay by Scottish council area, 2000–2026",
          description:
            "Relative child poverty after housing costs, out-of-work claimant rates and median resident pay for all 32 Scottish council areas, compared with Scotland across time.",
          path: "/areas",
          keywords: [
            "poverty",
            "child poverty",
            "claimant count",
            "pay",
            "Scotland",
            "council area",
            "local authority",
          ],
          temporalCoverage: "2000/2026",
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`All 32 council areas · ${first} – ${last}`}
          title="Poverty, work and pay in every Scottish council area"
          lede={`Every area has child-poverty, claimant-count and resident-pay evidence against Scotland. The ranking below uses child poverty, the strongest comparable local income measure: ${rose} of 32 areas worsened over the decade.`}
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
          <h2 className="h2 mb-2">Ranked by the latest child-poverty rate</h2>
          <p className="text-[14.5px] text-[var(--ink-2)] mb-6">
            Glasgow is shaded. The rank number always refers to the {last} rate.
          </p>
          <RankTable
            nameLabel="Council area"
            latestLabel={last}
            firstLabel={first}
            rows={byLevel.map((c) => ({
              rank: c.rankLevel,
              name: c.name,
              href: `/areas/${c.slug}`,
              latest: c.pcts[9],
              first: c.pcts[0],
              change: c.change,
              children: c.counts[9],
              highlight: c.slug === "glasgow-city",
            }))}
          />
        </section>

        <Col className="pt-12">
          <p className="text-[15.5px] text-[var(--ink-2)] border-l-[3px] border-[var(--brand)] pl-5 py-1 mb-10">
            Looking for your MP rather than your council?{" "}
            <Link href="/constituencies">
              All 57 Scottish Westminster constituencies are ranked here
            </Link>
            .
          </p>
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
          title="Your postcode is the shortest route to the evidence"
          body="Enter it once and the action tool finds your council figures, MP and constituency MSP automatically, then prepares the right addressed emails."
          href="/take-action"
          cta="Find my area and representatives"
          secondaryHref={`/areas/${byLevel[0].slug}`}
          secondaryCta={`See ${byLevel[0].name}`}
        />
      </Page>
    </>
  );
}
