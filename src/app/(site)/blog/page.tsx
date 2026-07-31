import Link from "next/link";
import { Page, PageHeader } from "@/components/Blocks";
import NewsletterSignup from "@/components/NewsletterSignup";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { postsByDate, POST_COUNT } from "@/lib/data/posts";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Explained in plain English",
  description:
    "Short, clear answers to the questions people actually ask about poverty in Scotland — what the numbers mean, who decides what, and how to do something about it.",
  path: "/blog",
});

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TOPIC_COLOR: Record<string, string> = {
  "How it works": "var(--brand)",
  "The numbers": "var(--scotland)",
  "Take action": "var(--action)",
};

export default function Blog() {
  const all = postsByDate();
  const [lead, ...rest] = all;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Explained", path: "/blog" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${site.name} — explained in plain English`,
          url: `${site.url}/blog`,
          blogPost: all.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            url: `${site.url}/blog/${p.slug}`,
          })),
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Explained"
          title="Poverty in Scotland, in plain English"
          lede="Short answers to the questions people actually ask. No jargon, no assumed knowledge, and every number sourced. If something here is still unclear, that is our fault and we want to know."
        />

        <p className="ui text-[15px] text-[var(--muted)] mt-6">
          {POST_COUNT} {POST_COUNT === 1 ? "article" : "articles"}
        </p>

        {lead && (
          <Link
            href={`/blog/${lead.slug}`}
            className="group block mt-6 rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--action)] p-6 sm:p-9 no-underline"
            style={{ boxShadow: "var(--shadow-2)" }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className="ui text-[15px] font-[750]"
                style={{ color: TOPIC_COLOR[lead.topic] }}
              >
                {lead.topic}
              </span>
              <span className="text-[15px] text-[var(--muted)]">
                {fmtDate(lead.date)} · {lead.readingMinutes} min read
              </span>
            </div>
            <h2 className="text-[30px] sm:text-[38px] font-[750] leading-[1.12] mt-3 max-w-[22ch] text-[var(--ink)] group-hover:text-[var(--action)] transition-colors">
              {lead.title}
            </h2>
            <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] mt-4 max-w-[58ch]">
              {lead.standfirst}
            </p>
            <span className="ui text-[16px] font-[700] text-[var(--action)] inline-block mt-5">
              Read this <span aria-hidden="true">→</span>
            </span>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 no-underline hover:border-[var(--rule-strong)] transition-colors"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <span
                  className="ui text-[15px] font-[750]"
                  style={{ color: TOPIC_COLOR[p.topic] }}
                >
                  {p.topic}
                </span>
                <h2 className="text-[22px] font-[720] leading-[1.25] mt-2 text-[var(--ink)] group-hover:text-[var(--action)] transition-colors">
                  {p.title}
                </h2>
                <p className="text-[16.5px] leading-[1.55] text-[var(--ink-2)] mt-2.5">
                  {p.standfirst}
                </p>
                <p className="text-[15px] text-[var(--muted)] mt-3.5">
                  {fmtDate(p.date)} · {p.readingMinutes} min read
                </p>
              </Link>
            ))}
          </div>
        )}

        <section className="pt-16">
          <div className="rounded-[var(--r-m)] bg-[var(--surface-2)] border border-[var(--rule)] p-6 sm:p-8">
            <h2 className="h2 mb-2">Get the next one</h2>
            <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[58ch] mb-5">
              We publish when the official figures change, and when something is worth explaining
              properly. No spam, and you can leave whenever you like.
            </p>
            {site.web3formsKey ? (
              <NewsletterSignup />
            ) : (
              <p className="text-[16px] text-[var(--ink-2)]">
                <Link href="/updates">Follow the public log</Link> for every data change.
              </p>
            )}
          </div>
        </section>
      </Page>
    </>
  );
}
