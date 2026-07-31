import Link from "next/link";
import { Page, Col, PageHeader, CTA, InShort } from "@/components/Blocks";
import Figure from "@/components/charts/Figure";
import AreaDumbbell from "./AreaDumbbell";
import RankTable from "@/components/RankTable";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { councilsByLevel, councilsByChange, COUNCIL_YEARS } from "@/lib/data/councils";

export const metadata = meta({
  title: "Poverty and pay in every Scottish area",
  description:
    "Choose any Scottish council area and see a simple summary, exact poverty figures, out-of-work benefits and typical pay.",
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
          eyebrow="All 32 Scottish council areas"
          title="See what is happening where you live"
          lede={`Choose an area for a clear answer first, then open the exact figures and sources. Things got worse in ${rose} of 32 areas over the last ten years.`}
        />

        <InShort>
          <p>Tap your area to see how many children are in poverty, how that has changed, how many people need out-of-work benefits and what a typical worker earns.</p>
          <p><strong>Glasgow is highlighted because it has the worst child-poverty rate in Scotland and the biggest ten-year rise.</strong></p>
        </InShort>

        <div className="mt-9">
          <Figure
            title="How child poverty changed in every area"
            sub={`${first} compared with ${last} · exact percentage after rent or mortgage`}
            caption="Tap any row to open that area's page. Blue means the figure got worse; grey means it improved. Glasgow is marked so its record stays visible."
            technical={["Source: End Child Poverty and Loughborough University. Areas are ordered by the latest exact rate."]}
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
          <h2 className="h2 mb-2">Every area, from highest to lowest</h2>
          <p className="text-[15px] text-[var(--ink-2)] mb-6">
            Glasgow is shaded. Number 1 has the highest child-poverty rate.
          </p>
          <RankTable
            nameLabel="Council area"
            latestLabel="Now"
            firstLabel="10 years ago"
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
          <h2 className="h2 mb-4">Why nearby places can look very different</h2>
          <p>
            The three areas with the lowest child poverty — {byLevel[31].name},{" "}
            {byLevel[30].name} and {byLevel[29].name} — are places where many people travel to
            better-paid jobs elsewhere. Two border Glasgow.
          </p>
          <p>
            That is not a coincidence.{" "}
            <Link href="/why-glasgow">
              Many better-paid jobs are in Glasgow, but the people doing them often live outside it
            </Link>{" "}
            to exactly these places.
          </p>
        </Col>

        <CTA
          title="Enter your postcode and we do the rest"
          body="We find your area, MP and MSP automatically, add the local facts and prepare two addressed emails."
          href="/take-action"
          cta="Find my MP and MSP"
          secondaryHref={`/areas/${byLevel[0].slug}`}
          secondaryCta={`See ${byLevel[0].name}`}
        />
      </Page>
    </>
  );
}
