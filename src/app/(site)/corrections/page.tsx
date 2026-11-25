import Link from "@/components/IntentLink";
import { Page, ContentFrame, Col, PageHeader } from "@/components/Blocks";
import { meta } from "@/lib/seo";
import { site } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = meta({
  title: "Corrections",
  description:
    "How to report an error on this site, and a public log of every correction made. A record that quietly edits itself is not a record.",
  path: "/corrections",
});

/** Add an entry here whenever a published figure changes. */
const LOG: { date: string; page: string; change: string }[] = [
  {
    date: "1 August 2026",
    page: "Pay and council area pages",
    change:
      "The published ASHE numbers were correct, but we described the selected full time PAYE sample as a typical wage and implied that the £51 difference between two separate medians measured wages leaving Glasgow. It does not. We removed those claims, made the sample exclusions prominent, added the current minimum wage and living cost evidence, and removed the pay estimate from campaign emails.",
  },
];

export default function Corrections() {
  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Corrections", path: "/corrections" },
        ]} />

      <Page>
        <PageHeader
          eyebrow="Accuracy"
          title="Corrections"
          lede="The figures must be right. If we make a mistake, we fix it and list the change here instead of quietly hiding it."
        />

        <ContentFrame>
          <Col className="pt-11">
          <h2 className="h2 mb-4">Corrections and complaints</h2>
          <p>
            Every figure on Scotland Counted links to its source. When an official body updates a
            number or we spot a slip, we fix the page. Every change goes on the list below with the
            date.
          </p>
          <p className="mt-4">
            Think a page is unfair or missed key context? Tell us and we will look at it again.
            We aim to reply within five working days. See our{" "}
            <Link href="/about#governance">fairness and funding rules</Link>.
          </p>
          <p className="mt-4">
            <Link href="/contact?reason=correction" className="ui font-[600]">
              Report an error or raise a concern →
            </Link>
          </p>
        </Col>

        <section className="pt-12">
          <h2 className="h2 mb-5">Correction log</h2>
          {LOG.length === 0 ? (
            <div className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-6 max-w-[640px] mx-auto">
              <p className="text-[15.5px] text-[var(--ink-2)]">
                No corrections yet. This site published in {site.dataUpdated}. When the first
                correction is made it will appear here with the date, the page and what changed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr>
                    {["Date", "Page", "What changed"].map((h) => (
                      <th
                        key={h}
                        className="ui text-[15px] font-[560] text-[var(--muted)] text-left pr-4 pb-2.5 border-b border-[var(--rule)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOG.map((l, i) => (
                    <tr key={i}>
                      <td className="pr-4 py-3 border-b border-[var(--rule)] ui text-[15px] whitespace-nowrap">
                        {l.date}
                      </td>
                      <td className="pr-4 py-3 border-b border-[var(--rule)]">{l.page}</td>
                      <td className="py-3 border-b border-[var(--rule)] text-[var(--ink-2)]">
                        {l.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Col className="pt-12">
          <h2 className="h2 mb-4">Known limitations</h2>
          <p>
            Some questions cannot be answered safely by the available data. Those limits are
            listed on the <Link href="/methods">how we counted it page</Link>.
          </p>
        </Col>
        </ContentFrame>
      </Page>
    </>
  );
}
