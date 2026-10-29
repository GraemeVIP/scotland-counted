import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import ArticleToc from "@/components/ArticleToc";
import AuthorBio from "@/components/AuthorBio";
import { Page } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { getPost, getPostCategory, relatedPosts } from "@/lib/data/posts";
import { sourcesById, type Source } from "@/lib/data/sources";
import { postBodies } from "@/content/posts";
import Faq from "@/components/Faq";
import QuickAnswer from "@/components/QuickAnswer";
import { postPath } from "@/lib/routeMap";
import ComparePromo from "@/components/ComparePromo";

/**
 * Posts that end with a pointer to the compare tool, and the area each one is
 * about (null for national pieces). Every poverty explainer gets one too.
 */
const COMPARE_POSTS: Record<string, string | null> = {
  "crime-rate-glasgow": "glasgow-city",
  "life-expectancy-glasgow": "glasgow-city",
  "unemployment-scotland": null,
  "best-performing-councils-scotland": null,
  "why-is-the-cost-of-living-so-high": null,
  "drug-deaths-scotland-deprivation": null,
  "east-vs-west-dunbartonshire": "west-dunbartonshire",
};

export function postMetadata(slug: string) {
  const post = getPost(slug);
  if (!post) return {};
  return meta({
    title: post.seoTitle ?? post.title,
    description: post.description,
    path: postPath(slug),
    type: "article",
    published: post.date,
    modified: post.updated ?? post.date,
    image: post.shareImage?.src,
    imageAlt: post.shareImage ? post.image?.alt : undefined,
    imageWidth: post.shareImage?.width,
    imageHeight: post.shareImage?.height,
    imageType: post.shareImage?.type,
    ownImage: !post.shareImage,
  });
}

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PostView({ slug }: { slug: string }) {
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
          { name: post.title, path: postPath(post.slug) },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: post.title,
          description: post.description,
          path: postPath(post.slug),
          published: post.date,
          modified: post.updated ?? post.date,
          image: post.image?.src,
          section: category?.name,
          keywords: post.tags,
        })}
      />
      {post.faq.length > 0 && <JsonLd data={faqJsonLd(post.faq)} />}

      <Page>
        <article className="max-w-[1240px] mx-auto">
          <div className="pt-8 sm:pt-12 max-w-[1120px] mx-auto">
            <Link href="/blog" className="ui inline-flex items-center gap-2 text-[14.5px] font-[540] text-[var(--muted)] hover:text-[var(--ink)]">
              <span aria-hidden="true">←</span> All guides and explainers
            </Link>
          </div>

          <header className="mt-8 max-w-[1120px] mx-auto">
            <Link href={`/blog/category/${post.category}`} className="chip no-underline">
              {category?.name}
            </Link>
            <h1 className="h1 mt-5 max-w-[20ch] text-[clamp(38px,5.4vw,76px)]">
              {post.title}
            </h1>
            <p className="lede mt-6 max-w-[62ch]">{post.standfirst}</p>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-5 border-t border-[var(--rule)]">
              <div className="grid gap-2">
                <p className="text-[15px] text-[var(--muted)]">
                  By <Link href="/about" className="font-[580] text-[var(--ink-2)]">Graeme</Link>
                  {" · "}Published {fmtDate(post.date)} · {post.readingMinutes} min read
                </p>
                {/* Freshness, shown to readers and given to search engines as dateModified. */}
                <p className="ui inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] font-[560] text-[var(--ink-2)]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--good-text)" strokeWidth="2.6" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  <span>
                    Last updated <time dateTime={post.updated ?? post.date}>{fmtDate(post.updated ?? post.date)}</time>
                  </span>
                  {post.checked && (
                    <span className="text-[var(--muted)] font-[500]">
                      · Figures checked <time dateTime={post.checked}>{fmtDate(post.checked)}</time>
                    </span>
                  )}
                </p>
              </div>
              <SharePage title={post.title} text={post.description} label="Share this page" />
            </div>
          </header>

          {post.quickAnswer && (
            <QuickAnswer answer={post.quickAnswer} className="mt-9 sm:mt-11 max-w-[1120px] mx-auto" />
          )}

          {post.image && (
            <EditorialImage
              src={post.image.src}
              alt={post.image.alt}
              caption={post.image.caption}
              aspect={post.image.aspect ?? "wide"}
              objectPosition={post.image.objectPosition}
              creditLabel={post.image.creditLabel}
              loading="eager"
              className="mt-9 sm:mt-11 max-w-[1240px] mx-auto"
              sizes="(min-width: 1536px) 1240px, (min-width: 1024px) calc(100vw - 112px), calc(100vw - 40px)"
            />
          )}

          <div className="grid gap-x-12 xl:gap-x-20 gap-y-8 lg:grid-cols-[minmax(0,760px)_minmax(240px,280px)] mt-10 sm:mt-12 max-w-[1120px] mx-auto">
            <ArticleToc items={post.toc} />
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <Body />
            </div>
          </div>
        </article>

        {(COMPARE_POSTS[post.slug] !== undefined || post.category === "poverty-explained") && (
          <div className="pt-14 max-w-[1120px] mx-auto">
            <ComparePromo slug={COMPARE_POSTS[post.slug] ?? undefined} />
          </div>
        )}

        {post.faq.length > 0 && (
          <section className="pt-14 max-w-[1120px] mx-auto" aria-labelledby="article-questions">
            <Faq items={post.faq} id="article-questions" kicker="Quick answers" />
          </section>
        )}

        {cited.length > 0 && (
          <section className="pt-12 max-w-[940px] mx-auto" aria-labelledby="article-sources">
            <details className="group rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] overflow-hidden">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 sm:px-6 py-5 hover:bg-[var(--surface-2)]">
                <span>
                  <span className="label block mb-1">Proof and further detail</span>
                  <span id="article-sources" className="text-[20px] font-[600] text-[var(--ink)]">
                    Open the {cited.length} original {cited.length === 1 ? "source" : "sources"}
                  </span>
                </span>
                <span aria-hidden="true" className="text-[24px] text-[var(--brand)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <ol className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
                {cited.map((source, index) => (
                  <li key={source.id} className="px-5 sm:px-6 py-4 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                    <span className="tnum text-[var(--muted)] mr-2">{String(index + 1).padStart(2, "0")}</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-[580] text-[var(--ink)]">
                      {source.title}
                    </a>{" "}
, {source.publisher}. {source.used}
                    {source.derivation && (
                      <span className="block mt-1 text-[15px] text-[var(--muted)]">
                        How I used it: {source.derivation}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        )}

        <AuthorBio className="mt-14 max-w-[1040px] mx-auto" />

        {related.length > 0 && (
          <section className="pt-14 max-w-[1120px] mx-auto" aria-labelledby="read-next-heading">
            <p className="label mb-2">Keep going</p>
            <h2 id="read-next-heading" className="h2 mb-6">Read next</h2>
            <div className="grid gap-5 sm:grid-cols-2">
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
