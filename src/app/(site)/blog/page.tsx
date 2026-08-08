import Link from "next/link";
import { Page, ContentFrame, PageHeader } from "@/components/Blocks";
import NewsletterSignup from "@/components/NewsletterSignup";
import AuthorBio from "@/components/AuthorBio";
import BlogList from "./BlogList";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { postsByDate } from "@/lib/data/posts";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Scotland Counted Explained | Poverty Evidence Hub",
  description:
    "Browse every Scotland Counted explainer on poverty, money, bills and political responsibility. Get the plain-English answer first, then check every source.",
  path: "/blog",
  type: "website",
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
          name: `${site.name} | Explained in Plain English`,
          url: `${site.url}/blog`,
          blogPost: all.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            dateModified: p.updated ?? p.date,
            image: `${site.url}${p.image.src}`,
            articleSection: p.category,
            keywords: p.tags.join(", "),
            author: { "@id": `${site.url}/#author` },
            url: `${site.url}/blog/${p.slug}`,
          })),
        }}
      />

      <Page>
        <PageHeader
          eyebrow="Explained · the evidence hub"
          title="Scotland Counted explained"
          lede="Start with the answer in ordinary words. Then open the figures, dates and original sources if you want to check the work. No political knowledge assumed."
        />

        <ContentFrame>
          <BlogList posts={all} />

        <AuthorBio className="mt-16" />

        <section className="pt-16">
          <div className="rounded-[var(--r-m)] bg-[var(--surface-2)] border border-[var(--rule)] p-6 sm:p-8">
            <h2 className="h2 mb-2">Get the next one</h2>
            <p className="text-[17px] text-[var(--ink-2)] leading-[1.6] max-w-[58ch] mb-5">
              I publish when the official figures change, and when something is worth explaining
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
        </ContentFrame>
      </Page>
    </>
  );
}
