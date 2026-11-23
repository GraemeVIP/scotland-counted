import { Suspense } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, CTA } from "@/components/Blocks";
import { Headlines, PointList } from "@/components/ExpenseKit";
import Breadcrumbs from "@/components/Breadcrumbs";
import SharePage from "@/components/SharePage";
import { JsonLd, datasetJsonLd, meta } from "@/lib/seo";
import ReceiptSearchClient from "./ReceiptSearchClient";

const PATH = "/mp-expenses-scotland/search";
const PUBLISHED_ISO = "2026-11-21";

export const metadata = meta({
  title: "Search Every Scottish MP & MSP Expense Receipt (Westminster & Holyrood)",
  description:
    "Switch cleanly between Scotland's 57 Westminster MPs (20,879 receipts) and 129 Holyrood MSPs (50,067 receipts). Search by postcode, politician, party, payee or keyword.",
  path: PATH,
  type: "article",
  published: PUBLISHED_ISO,
  modified: "2026-11-22",
  image: "/images/editorial/mp-msp-receipt-finder-scotland.webp",
  imageAlt: "Two open oak archival filing drawers side by side holding Westminster and Holyrood expense receipt folders under a brass banker's lamp",
  imageWidth: 1500,
  imageHeight: 1000,
  imageType: "image/webp",
});

export default function MpReceiptsSearchPage() {
  return (
    <>
      <JsonLd
        data={datasetJsonLd({
          name: "Scottish MPs & MSPs Individual Expense Receipts (Westminster & Holyrood)",
          description:
            "Searchable archive of 20,879 Westminster MP receipts (2022/23 to 2026/27) and 50,067 Holyrood MSP receipts (2021/22 to 2025/26 Q1), clearly separated by parliament.",
          path: PATH,
          keywords: [
            "MP expenses search Scotland",
            "MSP expenses search Scotland",
            "IPSA receipts lookup",
            "Scottish Parliament expenses",
            "search MP and MSP expenses",
          ],
          temporalCoverage: "2021/2027",
          spatialCoverage: "Scotland",
          dateModified: "2026-11-22",
        })}
      />

      <Page>
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "MP Expenses Scotland", path: "/mp-expenses-scotland" },
            { name: "Search MP & MSP Receipts", path: PATH },
          ]}
        />

        <PageHeader
          eyebrow="Westminster & Holyrood · 70,946 bills"
          title="Search every Scottish MP & MSP expense bill"
          lede="Every expense bill from Scotland's 57 MPs and 129 MSPs. Type a word, a name or your postcode."
        />

        <ContentFrame className="pt-4">
          <p className="ui mb-4 max-w-[760px] text-[16px] leading-[1.5] text-[var(--ink)]">
            <strong>Use it in 10 seconds:</strong> type a word like IKEA or taxi, or tap Surprise me.
          </p>

          <Suspense
            fallback={
              <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-8 text-center">
                Loading 20,879 Scottish MP receipts...
              </div>
            }
          >
            <ReceiptSearchClient />
          </Suspense>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/blog/scottish-mp-msp-expenses-what-it-could-buy" className="btn btn-primary">
                What £6.64m/yr could buy Scotland →
              </Link>
              <Link href="/blog/msp-expenses-scotland-investigation" className="btn btn-ghost">
                Holyrood MSP Party Tally →
              </Link>
              <Link href="/blog/worst-scottish-mp-expenses" className="btn btn-ghost">
                Top bills →
              </Link>
              <Link href="/mp-expenses-scotland" className="btn btn-ghost">
                All 57 MPs ranked →
              </Link>
            </div>
            <SharePage
              title="Search all 70,946 Scottish MP & MSP expense bills"
              text="Search every expense bill claimed by Scotland's 57 Westminster MPs and 129 Holyrood MSPs:"
              path={PATH}
              label="Share this search tool"
              className="mt-4"
            />
          </div>

          <section className="mt-14 max-w-[760px]" aria-labelledby="found-in-these-receipts">
            <p className="kicker text-[var(--brand)]">Built from these receipts</p>
            <h2 id="found-in-these-receipts" className="h2 mt-2">
              What we found when we read them all
            </h2>
            <Headlines
              label="Investigations built from these receipts"
              items={[
                {
                  value: "£2.91m",
                  label: "London flats and travel for Scotland's MPs, set against 152 Commons sitting days",
                  href: "/blog/scottish-mps-london-homes-152-sitting-days",
                  cta: "Read the investigation",
                },
                {
                  value: "£23,437",
                  label: "One day's electricity payout for the Kilmarnock MP, the UK's number one",
                  href: "/blog/kilmarnock-mp-23437-electricity-bill",
                  cta: "Read the investigation",
                },
                {
                  value: "£10,754",
                  label: "TV licences billed to taxpayers by 29 Scottish MPs, 2022 to 2026",
                  href: "/blog/scottish-mps-tv-licence-expenses",
                  cta: "Read the investigation",
                },
                {
                  value: "57",
                  label: "Scottish MPs ranked side by side on their everyday expenses",
                  href: "/mp-expenses-scotland",
                  cta: "See the rankings",
                },
              ]}
            />
          </section>

          <section className="mt-12 max-w-[760px]" aria-labelledby="how-the-rules">
            <p className="kicker text-[var(--brand)]">Before you share a receipt</p>
            <h2 id="how-the-rules" className="h2 mt-2 mb-5">
              How the rules let this happen (and why so much is still hidden)
            </h2>
            <PointList
              items={[
                {
                  title: "Nobody here broke the rules",
                  children: (
                    <>
                      IPSA and Holyrood paid every single bill in this tool.{" "}
                      <strong>MPs earn £98,599 a year.</strong> The rules still let them{" "}
                      <strong>
                        bill you for second home council tax, power bills, taxis, family flights,
                        PR consultants and leaflets.
                      </strong>
                    </>
                  ),
                },
                {
                  title: "Two things IPSA still hides",
                  children: (
                    <>
                      IPSA lumps many MP bills into <strong>one big sum</strong> with no firm named.
                      Other lines show <strong>[***]</strong> where the payee was blanked out. Tap
                      the email button on any card to ask the MP what it bought.
                    </>
                  ),
                },
                {
                  title: "Staff travel stays separate",
                  children: (
                    <>
                      Trips by an MP or MSP&apos;s staff are filed under their name. They are not
                      the politician&apos;s own hotels or cabs. We leave them out unless you tick
                      &ldquo;Show staff travel too&rdquo; under More filters.
                    </>
                  ),
                },
              ]}
            />
          </section>
        </ContentFrame>
      </Page>

      <CTA
        title="See how your own MP compares"
        body="Type your postcode. See your MP's bills, gifts, free trips and votes side by side."
        href="/email-your-mp-and-msp"
        cta="Find my MP by postcode"
        secondaryHref="/mp-expenses-scotland"
        secondaryCta="All 57 Scottish MPs ranked"
      />
    </>
  );
}
