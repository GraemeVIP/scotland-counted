import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import ArticleToc from "@/components/ArticleToc";
import AuthorBio from "@/components/AuthorBio";
import { Page } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { posts, getPost, getPostCategory, relatedPosts } from "@/lib/data/posts";
import { sourcesById, type Source } from "@/lib/data/sources";
import { postBodies } from "@/content/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return meta({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    type: "article",
    published: post.date,
    modified: post.updated ?? post.date,
    image: post.image.src,
    keywords: post.tags,
  });
}

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getPost(slug);
  const Body = postBodies[slug];
  if (!post || !Body) notFound();

  const category = getPostCategory(post.category);
  const related = relatedPosts(slug);
  const cited = post.sourceIds
    .map((id) => sourcesById[id])
    .filter((source): source is Source => Boolean(source));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Explained", path: "/blog" },
          { name: category?.name ?? "Article", path: `/blog/category/${post.category}` },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          published: post.date,
          modified: post.updated ?? post.date,
          image: post.image.src,
          section: category?.name,
          keywords: post.tags,
        })}
      />
      {post.faq.length > 0 && <JsonLd data={faqJsonLd(post.faq)} />}

      <Page>
        <article>
          <div className="pt-7 sm:pt-10">
            <Link href="/blog" className="ui text-[15px] font-[700]">
              <span aria-hidden="true">←</span> All explainers
            </Link>
          </div>

          <header className="mt-7 max-w-[1120px]">
            <Link
              href={`/blog/category/${post.category}`}
              className="ui text-[15px] font-[760] no-underline hover:underline"
              style={{ color: category?.color }}
            >
              {category?.name}
            </Link>
            <h1 className="text-[38px] sm:text-[58px] lg:text-[70px] font-[820] leading-[0.98] tracking-[-0.04em] mt-3 text-[var(--ink)] max-w-[22ch] text-balance">
              {post.title}
            </h1>
            <p className="text-[20px] sm:text-[23px] leading-[1.5] text-[var(--ink-2)] mt-6 max-w-[65ch]">
              {post.standfirst}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-7 pt-5 border-t border-[var(--rule)]">
              <p className="text-[15px] text-[var(--muted)]">
                By <Link href="/about" className="font-[700] text-[var(--ink-2)]">Graeme</Link>
                {" · "}{fmtDate(post.date)} · {post.readingMinutes} min read
                {post.updated && post.updated !== post.date && (
                  <> · checked {fmtDate(post.updated)}</>
                )}
              </p>
              <SharePage title={post.title} text={post.description} label="Share this article" />
            </div>
          </header>

          <EditorialImage
            src={post.image.src}
            alt={post.image.alt}
            caption={post.image.caption}
            aspect="wide"
            objectPosition={post.image.objectPosition}
            className="mt-9 sm:mt-11 max-w-[1240px]"
            sizes="(min-width: 1536px) 1240px, (min-width: 1024px) calc(100vw - 112px), calc(100vw - 40px)"
          />

          <div className="grid gap-x-12 xl:gap-x-20 gap-y-8 lg:grid-cols-[minmax(0,760px)_minmax(240px,280px)] mt-10 sm:mt-12">
            <ArticleToc items={post.toc} />
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <Body />
            </div>
          </div>
        </article>

        {post.faq.length > 0 && (
          <section className="pt-14" aria-labelledby="article-questions">
            <p className="label mb-2">Quick answers</p>
            <h2 id="article-questions" className="h2 mb-6">Questions people ask</h2>
            <div className="grid gap-4 lg:grid-cols-2 max-w-[1040px]">
              {post.faq.map((item) => (
                <div key={item.q} className="rounded-[var(--r-s)] bg-[var(--surface-2)] border border-[var(--rule)] p-5 sm:p-6">
                  <h3 className="h3 mb-2">{item.q}</h3>
                  <p className="text-[16px] text-[var(--ink-2)] leading-[1.6]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {cited.length > 0 && (
          <section className="pt-12 max-w-[940px]" aria-labelledby="article-sources">
            <details className="group rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] overflow-hidden">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 sm:px-6 py-5 hover:bg-[var(--surface-2)]">
                <span>
                  <span className="label block mb-1">Proof and further detail</span>
                  <span id="article-sources" className="text-[20px] font-[750] text-[var(--ink)]">
                    Open the {cited.length} original {cited.length === 1 ? "source" : "sources"}
                  </span>
                </span>
                <span aria-hidden="true" className="text-[24px] text-[var(--brand)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <ol className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
                {cited.map((source, index) => (
                  <li key={source.id} className="px-5 sm:px-6 py-4 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                    <span className="tnum text-[var(--muted)] mr-2">{String(index + 1).padStart(2, "0")}</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-[700] text-[var(--ink)]">
                      {source.title}
                    </a>{" "}
                    — {source.publisher}. {source.used}
                    {source.derivation && (
                      <span className="block mt-1 text-[15px] text-[var(--muted)]">
                        How we used it: {source.derivation}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        )}

        <AuthorBio className="mt-14 max-w-[1040px]" />

        {related.length > 0 && (
          <section className="pt-14" aria-labelledby="read-next-heading">
            <p className="label mb-2">Keep going</p>
            <h2 id="read-next-heading" className="h2 mb-6">Read next</h2>
            <div className="grid gap-5 sm:grid-cols-2 max-w-[940px]">
              {related.map((item) => (
                <ArticleCard key={item.slug} post={item} heading="h3" />
              ))}
            </div>
          </section>
        )}
      </Page>
    </>
  );
}
