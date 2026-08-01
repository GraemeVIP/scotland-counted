import { notFound } from "next/navigation";
import AuthorBio from "@/components/AuthorBio";
import { Page, ContentFrame, PageHeader } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import {
  getPostCategory,
  postCategories,
  postsInCategory,
  type PostCategorySlug,
} from "@/lib/data/posts";
import { site } from "@/lib/site";
import BlogList from "../../BlogList";

export function generateStaticParams() {
  return postCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const { category: slug } = await props.params;
  const category = getPostCategory(slug);
  if (!category) return {};

  return meta({
    title: `${category.name} explained`,
    description: category.description,
    path: `/blog/category/${category.slug}`,
    type: "website",
  });
}

export default async function BlogCategory(props: { params: Promise<{ category: string }> }) {
  const { category: slug } = await props.params;
  const category = getPostCategory(slug);
  if (!category) notFound();

  const categoryPosts = postsInCategory(category.slug);

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
          name: `${category.name} — ${site.name}`,
          description: category.description,
          url: `${site.url}/blog/category/${category.slug}`,
          hasPart: categoryPosts.map((post) => ({
            "@type": "Article",
            headline: post.title,
            url: `${site.url}/blog/${post.slug}`,
          })),
        }}
      />

      <Page>
        <PageHeader eyebrow="Explained" title={category.name} lede={category.description} />
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
