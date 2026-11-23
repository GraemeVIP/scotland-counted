import { Page, ContentFrame, CompactHeader } from "@/components/Blocks";
import AuthorBio from "@/components/AuthorBio";
import BlogList from "./BlogList";
import { JsonLd, meta } from "@/lib/seo";
import { postsByDate } from "@/lib/data/posts";
import { site } from "@/lib/site";
import { postPath } from "@/lib/routeMap";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionStarters from "@/components/SectionStarters";

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
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Explainers", path: "/blog" },
        ]} />
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
        <CompactHeader
          eyebrow="Explained · the evidence hub"
          title="Scotland Counted explained"
          lede="Investigations and plain English explainers. Every figure links to its original source, so you can check the work."
        />

        <ContentFrame>
          <SectionStarters section="all" className="mb-8" />
          <BlogList posts={all} />

        <AuthorBio className="mt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
