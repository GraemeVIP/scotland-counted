import { Page, ContentFrame, PageHeader } from "@/components/Blocks";
import AuthorBio from "@/components/AuthorBio";
import BlogList from "./BlogList";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { postsByDate } from "@/lib/data/posts";
import { site } from "@/lib/site";
import { postPath } from "@/lib/routeMap";

export const metadata = meta({
  title: "Scotland Counted Explained | Poverty Evidence Hub",
  description:
    "Browse every Scotland Counted explainer on poverty, money, bills and political responsibility. Get the plain English answer first, then check every source.",
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
            image: p.image ? `${site.url}${p.image.src}` : undefined,
            articleSection: p.category,
            keywords: p.tags.join(", "),
            author: { "@id": `${site.url}/#org` },
            url: `${site.url}${postPath(p.slug)}`,
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
        </ContentFrame>
      </Page>
    </>
  );
}
