import Link from "next/link";
import { Page, PageHeader } from "@/components/Blocks";
import NewsletterSignup from "@/components/NewsletterSignup";
import AuthorBio from "@/components/AuthorBio";
import BlogList from "./BlogList";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { postsByDate } from "@/lib/data/posts";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Explained in plain English",
  description:
    "Short, clear answers to the questions people actually ask about poverty in Scotland — what the numbers mean, who decides what, and how to do something about it.",
  path: "/blog",
});

export default function Blog() {
  const all = postsByDate();

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

        <BlogList posts={all} />

        <AuthorBio className="mt-16" />

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
