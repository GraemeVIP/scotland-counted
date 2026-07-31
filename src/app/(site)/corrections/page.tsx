import Link from "next/link";
import { Page, Col, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Corrections",
  description:
    "How to report an error on this site, and a public log of every correction made. A record that quietly edits itself is not a record.",
  path: "/corrections",
});

/** Add an entry here whenever a published figure changes. */
const LOG: { date: string; page: string; change: string }[] = [];

export default function Corrections() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Corrections", path: "/corrections" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="Accuracy"
          title="Corrections"
          lede="This site argues that politicians should be held to published figures. That obligation runs in both directions, so every correction is logged in public rather than quietly edited."
        />

        <Col className="pt-11">
          <h2 className="h2 mb-4">Report an error</h2>
          <p>
            <Link href="/contact?reason=error">Use the contact form</Link> with the page, the
            figure and what you believe it should be. If you can point at the source, better
            still.
          </p>
          <p>
            Errors of fact are fixed as soon as they are confirmed, and logged below. Differences
            of interpretation are worth having too — if you think a figure is right but the
            conclusion drawn from it is not, say so and we will publish the challenge.
          </p>
        </Col>

        <section className="pt-12">
          <h2 className="h2 mb-5">Correction log</h2>
          {LOG.length === 0 ? (
            <div className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-6 max-w-[640px]">
              <p className="text-[15.5px] text-[var(--ink-2)]">
                No corrections yet. This site published in {site.dataUpdated}. When the first
                correction is made it will appear here with the date, the page and what changed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full max-w-[860px] border-collapse text-[15px]">
                <thead>
                  <tr>
                    {["Date", "Page", "What changed"].map((h) => (
                      <th
                        key={h}
                        className="ui text-[12.5px] font-[680] text-[var(--muted)] text-left pr-4 pb-2.5 border-b border-[var(--rule)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOG.map((l, i) => (
                    <tr key={i}>
                      <td className="pr-4 py-3 border-b border-[var(--rule)] ui text-[13.5px] whitespace-nowrap">
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
            Separately from errors, there are things the data genuinely cannot support. Those are
            listed on the <Link href="/methods">methods page</Link> and are not corrections — they
            are the boundary of what any of these figures can be used to claim.
          </p>
        </Col>
      </Page>
    </>
  );
}
