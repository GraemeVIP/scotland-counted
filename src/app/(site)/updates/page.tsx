import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { changelog } from "@/lib/data/changelog";
import NewsletterSignup from "@/components/NewsletterSignup";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "What changed",
  description:
    `Every data refresh, new section and correction on ${site.name}, in one public log — with an RSS feed. The site's news is the data's news.`,
  path: "/updates",
});

const KIND: Record<string, { label: string; cls: string }> = {
  data: { label: "Data refresh", cls: "text-[var(--brand)]" },
  feature: { label: "New on the site", cls: "text-[var(--good-text)]" },
  correction: { label: "Correction", cls: "text-[var(--bad-text)]" },
  analysis: { label: "Analysis", cls: "text-[var(--action)]" },
};

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Updates() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Updates", path: "/updates" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="The public log"
          title="What changed"
          lede="Every new figure, new page and correction is dated here. Out-of-work benefit figures change monthly. Child poverty and pay normally change once a year."
        >
          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-5">
            {site.web3formsKey ? (
              <NewsletterSignup />
            ) : (
              <p className="text-[15px] text-[var(--ink-2)] max-w-[46ch]">
                The email list opens with the first data refresh after launch.
              </p>
            )}
            <a
              href="/feed.xml"
              className="ui inline-flex items-center gap-2 text-[15px] font-[620] text-[var(--brand)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-current pb-1"
            >
              Or subscribe by RSS
            </a>
          </div>
        </PageHeader>

        <ContentFrame>
          <div className="max-w-[820px] mx-auto">
          {changelog.map((e, i) => (
            <article
              key={`${e.date}-${i}`}
              className="grid gap-x-10 gap-y-2 sm:grid-cols-[150px_minmax(0,1fr)] py-7 border-b border-[var(--rule)]"
            >
              <div>
                <time dateTime={e.date} className="ui text-[15px] text-[var(--muted)] block">
                  {fmtDate(e.date)}
                </time>
                <span
                  className={`ui text-[15px] font-[680] ${KIND[e.kind].cls}`}
                >
                  {KIND[e.kind].label}
                </span>
              </div>
              <div>
                <h2 className="h3 mb-2">
                  {e.href ? (
                    <Link href={e.href} className="hover:text-[var(--brand)] transition-colors">
                      {e.title}
                    </Link>
                  ) : (
                    e.title
                  )}
                </h2>
                <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.6]">{e.body}</p>
              </div>
            </article>
          ))}
        </div>

        <Col className="pt-12 mx-auto">
          <p className="text-[15px] text-[var(--ink-2)]">
            Corrections get their own permanent record on{" "}
            <Link href="/corrections">the corrections page</Link> as well as an entry here.
          </p>
        </Col>
        </ContentFrame>
      </Page>
    </>
  );
}
