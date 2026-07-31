import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import RankTable from "@/components/RankTable";
import {
  constituenciesByLevel,
  CONSTITUENCY_YEARS,
  CONSTITUENCY_COUNT,
} from "@/lib/data/constituencies";

export const metadata = meta({
  title: "Child poverty in every Scottish constituency",
  description:
    "All 57 Scottish UK Parliament constituencies ranked by child poverty after housing costs. Glasgow East is highest at 34.9%. One MP is answerable for each number — find yours.",
  path: "/constituencies",
});

export default function Constituencies() {
  const byLevel = constituenciesByLevel();
  const first = CONSTITUENCY_YEARS[0];
  const last = CONSTITUENCY_YEARS[9];
  const worst = byLevel[0];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Constituencies", path: "/constituencies" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Child poverty by Scottish UK Parliament constituency",
          description:
            "Relative child poverty after housing costs for all 57 Scottish Westminster constituencies (2024 boundaries), ten financial years.",
          path: "/constituencies",
          keywords: ["child poverty", "constituency", "MP", "Scotland", "Westminster"],
          temporalCoverage: "2014/2024",
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`All ${CONSTITUENCY_COUNT} Westminster seats · ${first} – ${last}`}
          title="Child poverty, one MP at a time"
          lede="Every UK Parliament constituency in Scotland, ranked by child poverty after housing costs. Each of these numbers has exactly one MP answerable for the reserved policies that drive it — benefits, the two-child limit's legacy, and housing support."
          stat={{
            value: `${worst.pcts[9]}%`,
            label: `${worst.name} — the highest constituency rate in Scotland, ${last}`,
            tone: "bad",
          }}
        />

        <section className="pt-2">
          <p className="text-[14.5px] text-[var(--ink-2)] mb-6">
            Glasgow seats are shaded. The rank number always refers to the {last} rate.
          </p>
          <RankTable
            nameLabel="Constituency"
            latestLabel={last}
            firstLabel={first}
            rows={byLevel.map((c) => ({
              rank: c.rankLevel,
              name: c.name,
              href: `/constituencies/${c.slug}`,
              latest: c.pcts[9],
              first: c.pcts[0],
              change: c.change,
              children: c.counts[9],
              highlight: c.glasgow,
            }))}
          />
        </section>

        <Col className="pt-12">
          <h2 className="h2 mb-4">Why constituencies, as well as councils</h2>
          <p>
            Council areas are where services are delivered, but the biggest levers on child
            poverty — Universal Credit, housing benefit, the two-child limit that ran until 2026 —
            are reserved to Westminster. A constituency is the one geography where a single named
            person answers for those choices at an election.
          </p>
          <p>
            Six of the seven worst constituency rates in Scotland are Glasgow seats.{" "}
            <Link href="/why-glasgow">Why Glasgow specifically</Link> explains what sits behind
            that. Council-level figures are on <Link href="/areas">the area pages</Link>.
          </p>
        </Col>

        <CTA
          title="Your MP's constituency has a number"
          body="Every seat page carries ten years of figures and a letter you can send in two minutes, pre-filled with the data. MPs count their postbag."
          href={`/constituencies/${worst.slug}`}
          cta={`Start with ${worst.name}`}
          secondaryHref="/take-action"
          secondaryCta="Write to your MP"
        />
      </Page>
    </>
  );
}
