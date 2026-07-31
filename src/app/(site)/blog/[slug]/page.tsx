import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "@/components/Blocks";
import SharePage from "@/components/SharePage";
import AuthorBio from "@/components/AuthorBio";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { posts, getPost, relatedPosts } from "@/lib/data/posts";
import { sourcesById, type Source } from "@/lib/data/sources";
import { postBodies } from "@/content/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return meta({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
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

  const related = relatedPosts(slug);
  const cited = post.sourceIds
    .map((id) => sourcesById[id])
    .filter((s): s is Source => Boolean(s));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Explained", path: "/blog" },
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
        })}
      />
      {post.faq.length > 0 && <JsonLd data={faqJsonLd(post.faq)} />}

      <Page>
        <article>
          <div className="pt-2">
            <Link href="/blog" className="ui text-[15px] font-[700]">
              <span aria-hidden="true">←</span> All articles
            </Link>
          </div>

          <header className="mt-5 max-w-[30ch] sm:max-w-[26ch]">
            <p className="ui text-[15px] font-[750] text-[var(--action)]">{post.topic}</p>
            <h1 className="text-[34px] sm:text-[52px] font-[800] leading-[1.06] tracking-[-0.015em] mt-2.5 text-[var(--ink)]">
              {post.title}
            </h1>
          </header>

          <p className="text-[20px] sm:text-[22px] leading-[1.5] text-[var(--ink-2)] mt-6 max-w-[60ch]">
            {post.standfirst}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-7 pt-5 border-t border-[var(--rule)]">
            <p className="text-[15px] text-[var(--muted)]">
              {fmtDate(post.date)} · {post.readingMinutes} min read
              {post.updated && post.updated !== post.date && (
                <> · updated {fmtDate(post.updated)}</>
              )}
            </p>
            <SharePage title={post.title} text={post.description} label="Share this article" />
          </div>

          <div className="mt-10">
            <Body />
          </div>
        </article>

        {post.faq.length > 0 && (
          <section className="pt-14">
            <h2 className="h2 mb-6">Questions people ask</h2>
            <div className="grid gap-4 lg:grid-cols-2 max-w-[1000px]">
              {post.faq.map((f) => (
                <div key={f.q} className="border-t-2 border-[var(--ink)] pt-4">
                  <h3 className="h3 mb-2">{f.q}</h3>
                  <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {cited.length > 0 && (
          <section className="pt-12">
            <h2 className="label mb-4">Where these figures come from</h2>
            <ul className="space-y-2.5 max-w-[720px]">
              {cited.map((s) => (
                <li key={s.id} className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                  </a>{" "}
                  — {s.publisher}
                </li>
              ))}
            </ul>
          </section>
        )}

        <AuthorBio className="mt-14" />

        {related.length > 0 && (
          <section className="pt-14">
            <h2 className="h2 mb-6">Read next</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 no-underline hover:border-[var(--rule-strong)] transition-colors"
                >
                  <span className="ui text-[15px] font-[750] text-[var(--action)]">{p.topic}</span>
                  <p className="text-[21px] font-[720] leading-[1.25] mt-2 text-[var(--ink)] group-hover:text-[var(--action)] transition-colors">
                    {p.title}
                  </p>
                  <p className="text-[16px] leading-[1.55] text-[var(--ink-2)] mt-2.5">
                    {p.standfirst}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Page>
    </>
  );
}
