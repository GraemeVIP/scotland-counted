import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import {
  getPostCategory,
  postCategories,
  posts as allPosts,
  type Post,
  type PostCategorySlug,
} from "@/lib/data/posts";

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogList({
  posts,
  activeCategory,
  showFeatured = true,
}: {
  posts: Post[];
  activeCategory?: PostCategorySlug;
  showFeatured?: boolean;
}) {
  // The index passes postsByDate(), so the first post is always the newest.
  // There is deliberately no manual featured flag that can leave an older
  // article pinned above a newer one.
  const featured = showFeatured ? posts[0] : undefined;
  const remaining = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;
  const featuredCategory = featured ? getPostCategory(featured.category) : undefined;

  return (
    <>
      <nav className="flex flex-wrap items-center gap-2 mt-7" aria-label="Article categories">
        <Link
          href="/blog"
          aria-current={!activeCategory ? "page" : undefined}
          className={`ui min-h-11 inline-flex items-center px-4 py-2 rounded-[var(--r-pill)] text-[15px] font-[680] border no-underline transition-colors ${
            !activeCategory
              ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
              : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--rule-strong)] hover:border-[var(--brand)]"
          }`}
        >
          All articles <span className="ml-2 tnum opacity-60">{allPosts.length}</span>
        </Link>
        {postCategories.map((category) => {
          const active = activeCategory === category.slug;
          return (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              aria-current={active ? "page" : undefined}
              className={`ui min-h-11 inline-flex items-center px-4 py-2 rounded-[var(--r-pill)] text-[15px] font-[680] border no-underline transition-colors ${
                active
                  ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                  : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--rule-strong)] hover:border-[var(--brand)]"
              }`}
            >
              {category.name}
              <span className="ml-2 tnum opacity-60">
                {allPosts.filter((post) => post.category === category.slug).length}
              </span>
            </Link>
          );
        })}
      </nav>

      {featured && (
        <section className="pt-9" aria-labelledby="featured-story">
          <p className="label mb-4">Latest</p>
          <article className="group overflow-hidden rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--deep)] text-[var(--deep-ink)]">
            <Link
              href={`/blog/${featured.slug}`}
              className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] no-underline"
            >
              <div className="relative min-h-[300px] sm:min-h-[410px] lg:min-h-[500px] overflow-hidden">
                <Image
                  src={featured.image.src}
                  alt={featured.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ objectPosition: featured.image.objectPosition ?? "center" }}
                />
              </div>
              <div className="p-6 sm:p-9 lg:p-11 flex flex-col justify-center">
                {/* This card sits on --deep, so it needs the dark-background
                    variant. The light one drops to 2.77:1 here for politics. */}
                <p
                  className="ui text-[15px] font-[760]"
                  style={{ color: featuredCategory?.colorOnDark ?? "#ff8b75" }}
                >
                  {featuredCategory?.name}
                </p>
                <h2
                  id="featured-story"
                  className="text-[31px] sm:text-[42px] font-[800] leading-[1.05] tracking-[-0.03em] mt-3 max-w-[18ch]"
                >
                  {featured.title}
                </h2>
                <p className="text-[18px] leading-[1.55] opacity-78 mt-5 max-w-[48ch]">
                  {featured.standfirst}
                </p>
                <p className="text-[15px] opacity-62 mt-6">
                  {fmtDate(featured.updated ?? featured.date)} · {featured.readingMinutes} min read
                </p>
                <p className="ui text-[16px] font-[720] mt-7 text-[var(--deep-ink)]">
                  Read the full story <span aria-hidden="true">→</span>
                </p>
              </div>
            </Link>
          </article>
        </section>
      )}

      <section className="pt-12" aria-labelledby="article-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="label mb-2">Read and check</p>
            <h2 id="article-list-heading" className="h2">
              {activeCategory ? getPostCategory(activeCategory)?.name : "Latest explainers"}
            </h2>
          </div>
          <p className="ui text-[15px] text-[var(--muted)]">
            {remaining.length} {remaining.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {remaining.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {remaining.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-[17px] text-[var(--ink-2)]">More articles are being checked now.</p>
        )}
      </section>
    </>
  );
}
