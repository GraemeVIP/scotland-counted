import { notFound } from "next/navigation";
import AuthorBio from "@/components/AuthorBio";
import { Page, ContentFrame, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import {
  getPostCategory,
  isPostCategoryIndexable,
  postCategories,
  postsInCategory,
  type PostCategorySlug,
} from "@/lib/data/posts";
import { site } from "@/lib/site";
import BlogList from "../../BlogList";

const CATEGORY_SEO = {
  "money-and-bills": {
    title: "Money and Bills in Scotland: Plain-English Guides",
    h1: "Money and bills in Scotland",
    description:
      "Plain-English guides to wages, benefits, council tax, rent, food and energy in Scotland, with short answers first and exact sources underneath.",
  },
  "poverty-explained": {
    title: "Poverty in Scotland Explained",
    h1: "Poverty in Scotland explained",
    description:
      "Plain-English answers to what poverty means in Scotland, how it is measured, why housing costs matter and what the official statistics show.",
  },
  "take-action": {
    title: "Contact Your MP or MSP: Guides and Tools",
    h1: "Contact your MP or MSP",
    description:
      "Plain-English guides and free tools for finding your MP and MSP, writing a focused email and understanding what happens after you press send.",
  },
  "politics-explained": {
    title: "Scottish Politics Explained: Timelines and Primary Sources",
    h1: "Scottish politics explained",
    description:
      "Long-form, plain-English timelines of Scottish political stories, with allegations, official records and court findings clearly separated.",
  },
} as const;

export function generateStaticParams() {
  return postCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const { category: slug } = await props.params;
  const category = getPostCategory(slug);
  if (!category) return {};

  const seo = CATEGORY_SEO[category.slug];
  const indexable = isPostCategoryIndexable(category.slug);

  return {
    ...meta({
      title: seo.title,
      description: seo.description,
      path: `/blog/category/${category.slug}`,
      type: "website",
    }),
    ...(!indexable ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BlogCategory(props: { params: Promise<{ category: string }> }) {
  const { category: slug } = await props.params;
  const category = getPostCategory(slug);
  if (!category) notFound();

  const categoryPosts = postsInCategory(category.slug);
  const seo = CATEGORY_SEO[category.slug];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Explained", path: "/blog" },
          { name: category.name, path: `/blog/category/${category.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${seo.h1} | ${site.name}`,
          description: seo.description,
          url: `${site.url}/blog/category/${category.slug}`,
          hasPart: categoryPosts.map((post) => ({
            "@type": "Article",
            headline: post.title,
            url: `${site.url}/blog/${post.slug}`,
          })),
        }}
      />

      <Page>
        <PageHeader eyebrow="Explained" title={seo.h1} lede={seo.description} />
        <ContentFrame>
          <BlogList
            posts={categoryPosts}
            activeCategory={category.slug as PostCategorySlug}
            showFeatured={false}
          />
          <AuthorBio className="mt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
