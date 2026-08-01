import Link from "next/link";
import { Page, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { SECTIONS } from "@/lib/data/navigation";
import { councilsByLevel } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { posts } from "@/lib/data/posts";
import { indicators } from "@/lib/data/indicators";

export const metadata = meta({
  title: "Every page on this site",
  description:
    "The whole of Scotland Counted in one place — every council area, every MP area, every explainer and every source. Nothing is hidden behind a menu.",
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
          lede="There is a lot here, so this page lists all of it. If you only want one thing, it is almost certainly your own area — that is the first list below."
        />

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
            <div className="grid gap-3 sm:grid-cols-2 max-w-[900px]">
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
              { slug: "life-expectancy", name: "Life expectancy" },
              { slug: "neighbourhoods", name: "Neighbourhoods" },
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
      </Page>
    </>
  );
}
