import { Suspense } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, CTA, Callout } from "@/components/Blocks";
import { ExplainText } from "@/components/ExplainServer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SharePage from "@/components/SharePage";
import { JsonLd, datasetJsonLd, meta } from "@/lib/seo";
import ReceiptSearchClient from "./ReceiptSearchClient";

const PATH = "/mp-expenses-scotland/search";
const PUBLISHED_ISO = "2026-11-21";

export const metadata = meta({
  title: "Search Every Scottish MP Expense Receipt (2022 to 2026)",
  description:
    "Search and filter all 20,879 individual IPSA expense receipts filed by Scotland's 57 MPs from 2022/23 to 2026/27. Filter by MP, party, year or keyword.",
  path: PATH,
  type: "article",
  published: PUBLISHED_ISO,
  modified: PUBLISHED_ISO,
  image: "/images/editorial/refresh-court-records.webp",
  imageAlt: "Searchable ledger of Scottish MP IPSA expense receipts from 2022 to 2026",
  imageWidth: 1500,
  imageHeight: 1000,
  imageType: "image/webp",
});

export default function MpReceiptsSearchPage() {
  return (
    <>
      <JsonLd
        data={datasetJsonLd({
          name: "Scottish MPs Individual IPSA Expense Receipts (2022/23 to 2026/27)",
          description:
            "Searchable archive of all 20,879 non-payroll individual business cost claims filed by Scotland's 57 current MPs across five IPSA financial years.",
          path: PATH,
          keywords: [
            "MP expenses search Scotland",
            "IPSA receipts lookup",
            "Scottish MP expense claims",
            "search MP expenses",
          ],
          temporalCoverage: "2022/2027",
          spatialCoverage: "Scotland",
          dateModified: PUBLISHED_ISO,
        })}
      />

      <Page>
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "MP Expenses Scotland", path: "/mp-expenses-scotland" },
            { name: "Search Every Receipt", path: PATH },
          ]}
        />

        <PageHeader
          eyebrow="Full 5-Year IPSA Archive · 20,879 line-by-line receipts"
          title="Search every Scottish MP expense receipt (2022 to 2026)"
          lede="IPSA buries MPs' expense receipts inside five separate spreadsheets totalling more than 350,000 lines. We pulled every single non-payroll receipt filed by Scotland's 57 current MPs from 2022/23 to 2026/27 so you can search, filter, copy and challenge any claim yourself."
        >
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link href="/blog/kilmarnock-mp-23437-electricity-bill" className="btn btn-ghost">
              £23,437 Kilmarnock electricity bill (UK #1) →
            </Link>
            <Link href="/blog/scottish-mps-tv-licence-expenses" className="btn btn-ghost">
              29 MPs&apos; TV licences (£10,754) →
            </Link>
            <Link href="/mp-expenses-scotland/receipts" className="btn btn-ghost">
              Top highlighted receipts →
            </Link>
            <Link href="/blog/worst-scottish-mp-expenses" className="btn btn-ghost">
              Worst expenses roundup →
            </Link>
            <Link href="/mp-expenses-scotland" className="btn btn-ghost">
              All 57 MPs ranked →
            </Link>
          </div>
          <SharePage
            title="Search all 20,879 Scottish MP expense receipts (2022 to 2026)"
            text="Search every line-by-line expense claim filed by Scotland's 57 MPs from 2022 to 2026 (iPhones, IKEA, DFS, hotels, taxis, family flights, PR firms):"
            path={PATH}
            label="Share this lookup tool"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame className="pt-4">
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
            <Callout>
              <ExplainText>
                <p className="font-[640] text-[var(--ink)] mb-1.5">
                  How the rules let this happen (and why so much is still hidden)
                </p>
                <p className="text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  Every receipt in this tool was approved and paid by IPSA under Parliament&apos;s
                  own expenses framework. Nobody here broke the rules: the rules themselves allow
                  MPs earning £98,599 a year (up from £93,904 in 2025/26) to bill taxpayers for
                  second home council tax, energy bills, drain cleaning, family flights, car
                  parking, taxis, PR consultants and printed annual reports.
                </p>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  You will also notice two things IPSA still hides: thousands of claims are lumped
                  together as <strong>&ldquo;Aggregated costs&rdquo;</strong> with no supplier
                  listed, and many line items contain <strong>[***]</strong> where IPSA redacted
                  who was paid. That is why every receipt card has a one-click button to email the
                  MP and ask them to explain what the money bought.
                </p>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                  <strong>Staff travel is kept separate.</strong> IPSA files trips by an MP&apos;s
                  staff under the MP&apos;s name, but they are not the MP&apos;s own hotels or taxis.
                  They are left out of every list, total and ranking unless you tick &ldquo;Include
                  travel by the MP&apos;s staff&rdquo;.
                </p>
              </ExplainText>
            </Callout>
          </div>
        </ContentFrame>
      </Page>

      <CTA
        title="Want to see how your own MP compares?"
        body="Enter your Scottish postcode to see your MP's full 2025/26 expenses, private donations, foreign trips and plain English voting record side by side."
        href="/email-your-mp-and-msp"
        cta="Find my MP by postcode"
        secondaryHref="/mp-expenses-scotland"
        secondaryCta="All 57 Scottish MPs ranked"
      />
    </>
  );
}
