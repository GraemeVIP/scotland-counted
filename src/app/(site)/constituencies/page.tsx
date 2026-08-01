import Link from "next/link";
import { Page, Col, PageHeader, CTA, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import RankTable from "@/components/RankTable";
import {
  constituenciesByLevel,
  CONSTITUENCY_YEARS,
  CONSTITUENCY_COUNT,
} from "@/lib/data/constituencies";
import { asOneIn } from "@/lib/plain-language";

export const metadata = meta({
  title: "Child poverty in every Scottish MP area",
  description:
    "See child poverty in all 57 areas represented by a Scottish MP. Glasgow East is highest. Enter your postcode and we find your MP for you.",
  path: "/constituencies",
});

export default function Constituencies() {
  const byLevel = constituenciesByLevel();
  const last = CONSTITUENCY_YEARS[9];
  const worst = byLevel[0];
  const worstShare = asOneIn(worst.pcts[9]);

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
          eyebrow={`All ${CONSTITUENCY_COUNT} Scottish MP areas`}
          title="See the facts for your MP's area"
          lede="One MP represents each area. You do not need to know the political name for your area or who your MP is — enter your postcode and we find them for you."
          stat={{
            value: worstShare.replace(/^(about|more than|almost)\s+/, ""),
            label: `About one child in every three in ${worst.name} is growing up in poverty. Exact figure: ${worst.pcts[9]}% in ${last} — the highest in Scotland.`,
            tone: "bad",
          }}
        />

        <InShort>
          <p>This list shows child poverty in every part of Scotland represented by an MP. Number 1 has the worst rate.</p>
          <p><strong>Six of the seven worst areas are in Glasgow.</strong> Glasgow is shaded so that is impossible to miss.</p>
        </InShort>

        <section className="pt-10">
          <RankTable
            kicker={`All ${CONSTITUENCY_COUNT} MP areas`}
            title="Every MP area in Scotland, worst rate first"
            standfirst="The ten highest are shown to begin with. Glasgow areas are shaded. Tap any column to sort, or any row to open that area."
            measure={`Children in poverty · ${last}`}
            nameLabel="Area represented by an MP"
            latestLabel="Now"
            firstLabel="10 years ago"
            collapsedRows={10}
            showAllLabel={`See all ${CONSTITUENCY_COUNT} MP areas`}
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
          <h2 className="h2 mb-4">Why show the area your MP represents?</h2>
          <p>
            Councils run local services. MPs vote on Universal Credit and help with private rent.
            Showing the figure for each MP&apos;s area makes it clear who local people can question.
          </p>
          <p>
            Six of the seven worst MP areas in Scotland are in Glasgow.{" "}
            <Link href="/why-glasgow">See why Glasgow is hit harder</Link>. Council-level figures
            are on <Link href="/areas">the local area pages</Link>.
          </p>
        </Col>

        <CTA
          title="You do not need to work out who your MP is"
          body="Enter your postcode. We find your MP, add the exact local figure and open a ready-written email."
          href="/take-action"
          cta="Find and email my MP"
          secondaryHref={`/constituencies/${worst.slug}`}
          secondaryCta={`See ${worst.name}`}
        />
      </Page>
    </>
  );
}
