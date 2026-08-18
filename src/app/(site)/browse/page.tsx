import Link from "next/link";
import { Page, ContentFrame, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { SECTIONS } from "@/lib/data/navigation";
import { councilsByLevel } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { posts } from "@/lib/data/posts";
import { indicators } from "@/lib/data/indicators";
import { mps } from "@/lib/data/mps";
import { holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";

export const metadata = meta({
  title: "Every page on this site",
  description:
    "The whole of Scotland Counted in one place: every council area, MP, MSP area, explainer and source. Nothing is hidden behind a menu.",
  path: "/browse",
});

export default function Browse() {
  const councils = councilsByLevel();
  const seats = [...constituencies].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Everything", path: "/browse" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="The whole site"
          title="Everything on this site"
          lede="There is a lot here, so this page puts it into clear groups. Start with the people who represent you or your local area, then open the longer lists only when you need them."
        />

        <ContentFrame>
          <section className="pt-10">
            <h2 className="h2 mb-2">The people who represent you</h2>
            <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mb-5">
              Your postcode finds the right people automatically. You have one MP at Westminster,
              one constituency MSP and seven regional MSPs at Holyrood.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/email-your-mp-and-msp"
                className="group block rounded-[var(--r-s)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] bg-[var(--surface)] px-5 py-5 no-underline hover:border-[var(--action)] transition-colors"
              >
                <span className="ui block text-[15px] font-[750] uppercase tracking-[0.06em] text-[var(--action)]">
                  Fastest route
                </span>
                <span className="ui mt-2 block text-[19px] font-[750] text-[var(--ink)]">
                  Find everyone by postcode →
                </span>
                <span className="mt-2 block text-[15px] leading-[1.5] text-[var(--ink-2)]">
                  I find your MP and all eight MSPs, then write the focused emails for you.
                </span>
              </Link>
              <div className="grid gap-3">
                <Link
                  href="/representatives"
                  className="group block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-4 no-underline hover:border-[var(--rule-strong)] transition-colors"
                >
                  <span className="ui text-[17px] font-[720] text-[var(--ink)] group-hover:text-[var(--action)]">
                    Browse all 57 MPs →
                  </span>
                  <span className="mt-1 block text-[15px] text-[var(--ink-2)]">
                    Names, parties, contacts and ready-written emails.
                  </span>
                </Link>
                <Link
                  href="/representatives/msps"
                  className="group block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-4 no-underline hover:border-[var(--rule-strong)] transition-colors"
                >
                  <span className="ui text-[17px] font-[720] text-[var(--ink)] group-hover:text-[var(--action)]">
                    Browse all 129 MSPs →
                  </span>
                  <span className="mt-1 block text-[15px] text-[var(--ink-2)]">
                    Every constituency and every regional list.
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <details className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
                <summary className="ui cursor-pointer px-5 py-4 text-[16px] font-[720] text-[var(--ink)]">
                  Show all 57 current MPs
                </summary>
                <div className="flex flex-wrap gap-2 border-t border-[var(--rule)] px-5 py-5">
                  {mps.map((mp) => (
                    <Link
                      key={mp.constituencySlug}
                      href={`/representatives/mps/${mp.constituencySlug}`}
                      className="ui text-[15px] px-3 py-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--brand)] transition-colors no-underline"
                    >
                      {mp.name}{" "}
                      <span className="text-[var(--muted)]">· {mp.constituency}</span>
                    </Link>
                  ))}
                </div>
              </details>

              <details className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)]">
                <summary className="ui cursor-pointer px-5 py-4 text-[16px] font-[720] text-[var(--ink)]">
                  Show every MSP area
                </summary>
                <div className="border-t border-[var(--rule)] px-5 py-5">
                  <h3 className="ui text-[16px] font-[750] text-[var(--ink)]">73 constituencies</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {holyroodConstituencies.map((item) => (
                      <Link
                        key={item.constituencySlug}
                        href={`/representatives/msps/constituencies/${item.constituencySlug}`}
                        className="ui text-[15px] px-3 py-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--brand)] transition-colors no-underline"
                      >
                        {item.constituency}
                      </Link>
                    ))}
                  </div>
                  <h3 className="ui mt-6 text-[16px] font-[750] text-[var(--ink)]">8 regions</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {holyroodRegions.map((item) => (
                      <Link
                        key={item.regionSlug}
                        href={`/representatives/msps/regions/${item.regionSlug}`}
                        className="ui text-[15px] px-3 py-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--brand)] transition-colors no-underline"
                      >
                        {item.region}
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </section>

          <section className="pt-10">
            <h2 className="h2 mb-2">Your council area</h2>
            <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mb-5">
              All {councils.length} council areas in Scotland, worst rate first. Each page has ten
              years of figures for child poverty and out-of-work benefits, plus minimum-wage context
              and a clearly restricted ONS pay estimate.
            </p>
            <div className="flex flex-wrap gap-2">
              {councils.map((c) => (
                <Link
                  key={c.slug}
                  href={`/areas/${c.slug}`}
                  className="ui text-[15px] px-3 py-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--brand)] transition-colors no-underline"
                >
                  {c.name} <span className="text-[var(--muted)] tnum">{c.pcts[9]}%</span>
                </Link>
              ))}
            </div>
          </section>

        <section className="pt-12">
          <h2 className="h2 mb-2">Your MP&apos;s area</h2>
          <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mb-5">
            All {seats.length} Scottish seats, A to Z. Each page names the MP and writes the email
            for you.
          </p>
          <div className="flex flex-wrap gap-2">
            {seats.map((c) => (
              <Link
                key={c.slug}
                href={`/constituencies/${c.slug}`}
                className="ui text-[15px] px-3 py-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--brand)] transition-colors no-underline"
              >
                {c.name} <span className="text-[var(--muted)] tnum">{c.pcts[9]}%</span>
              </Link>
            ))}
          </div>
        </section>

        {SECTIONS.map((sec) => (
          <section key={sec.title} className="pt-12">
            <h2 className="h2 mb-2">{sec.title}</h2>
            <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mb-5">
              {sec.intro}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {sec.items.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="group block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-4 no-underline hover:border-[var(--rule-strong)] transition-colors"
                >
                  <span className="ui text-[16.5px] font-[680] text-[var(--ink)] group-hover:text-[var(--action)] transition-colors">
                    {n.label}
                  </span>
                  {n.blurb && (
                    <span className="block text-[15px] leading-[1.45] text-[var(--ink-2)] mt-1">
                      {n.blurb}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="pt-12">
          <h2 className="h2 mb-2">Explainers</h2>
          <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mb-5">
            Short, plain-English answers to the questions people ask most.
          </p>
          <ul className="space-y-2.5 max-w-[760px]">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-[17px]">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-12">
          <h2 className="h2 mb-2">One measure at a time</h2>
          <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[62ch] mb-5">
            Each indicator, with its full history and its source.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              ...indicators.map((i) => ({ slug: i.slug, name: i.label })),
              { slug: "glasgow-life-expectancy", name: "Life expectancy" },
              { slug: "glasgow-deprivation", name: "Neighbourhoods" },
            ].map((i) => (
              <Link
                key={i.slug}
                href={`/indicators/${i.slug}`}
                className="ui text-[15px] px-3 py-2 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--brand)] transition-colors no-underline"
              >
                {i.name}
              </Link>
            ))}
          </div>
        </section>
        </ContentFrame>
      </Page>
    </>
  );
}
