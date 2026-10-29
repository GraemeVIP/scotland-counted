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
import { postPath } from "@/lib/routeMap";
import CoverArt from "@/components/CoverArt";

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
  // The index passes postsByDate(), so the first photographed post is always
  // the newest one. There is deliberately no manual featured flag that can
  // leave an older article pinned above a newer one.
  //
  // Quick answer guides have no photograph. Mixed into the grid by date, a
  // batch of them pushes every photographed piece below the fold, so they get
  // their own compact list underneath instead.
  const stories = posts.filter((post) => post.image && !post.guideImage);
  const guides = posts.filter((post) => !post.image || post.guideImage);
  const featured = showFeatured ? stories[0] : undefined;
  const remaining = featured ? stories.filter((post) => post.slug !== featured.slug) : stories;
  const featuredCategory = featured ? getPostCategory(featured.category) : undefined;

  return (
    <>
      <nav className="flex flex-wrap items-center gap-2 mt-7" aria-label="Article categories">
        <Link
          href="/blog"
          aria-current={!activeCategory ? "page" : undefined}
          className={`ui min-h-11 inline-flex items-center px-4 py-2 rounded-[var(--r-pill)] text-[15px] font-[560] border no-underline transition-colors ${
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
              className={`ui min-h-11 inline-flex items-center px-4 py-2 rounded-[var(--r-pill)] text-[15px] font-[560] border no-underline transition-colors ${
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
              href={postPath(featured.slug)}
              className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] no-underline"
            >
              <div className="relative min-h-[300px] sm:min-h-[410px] lg:min-h-[500px] overflow-hidden">
                {featured.image ? (
                  <Image
                    src={featured.image.cardSrc ?? featured.image.src}
                    alt={featured.image.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: featured.image.objectPosition ?? "center" }}
                  />
                ) : (
                  <CoverArt label="Guide" title={featured.title} className="absolute inset-0" />
                )}
              </div>
              <div className="p-6 sm:p-9 lg:p-11 flex flex-col justify-center">
                {/* This card sits on --deep, so it needs the dark-background
                    variant. The light one drops to 2.77:1 here for politics. */}
                <p
                  className="ui text-[15px] font-[620]"
                  style={{ color: featuredCategory?.colorOnDark ?? "#ff8b75" }}
                >
                  {featuredCategory?.name}
                </p>
                <h2
                  id="featured-story"
                  className="text-[31px] sm:text-[42px] font-[640] leading-[1.05] tracking-[-0.03em] mt-3 max-w-[18ch]"
                >
                  {featured.title}
                </h2>
                <p className="text-[18px] leading-[1.55] opacity-78 mt-5 max-w-[48ch]">
                  {featured.standfirst}
                </p>
                <p className="text-[15px] opacity-62 mt-6">
                  {fmtDate(featured.updated ?? featured.date)} · {featured.readingMinutes} min read
                </p>
                <p className="ui text-[16px] font-[600] mt-7 text-[var(--deep-ink)]">
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
          guides.length === 0 && (
            <p className="text-[17px] text-[var(--ink-2)]">More articles are being checked now.</p>
          )
        )}
      </section>

      {guides.length > 0 && <GuideList guides={guides} grouped={!activeCategory} />}
    </>
  );
}

/**
 * The quick answer guides as a compact, scannable list: the question people
 * searched, the answer figure, and a link. Grouped by section on the main
 * index so twenty guides read as a reference shelf rather than a wall.
 */
function GuideList({ guides, grouped }: { guides: Post[]; grouped: boolean }) {
  const groups = grouped
    ? postCategories
        .map((category) => ({ category, items: guides.filter((post) => post.category === category.slug) }))
        .filter((group) => group.items.length > 0)
    : [{ category: undefined, items: guides }];

  return (
    <section className="pt-14" aria-labelledby="guide-list-heading">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="label mb-2">Answer first</p>
          <h2 id="guide-list-heading" className="h2">
            Quick answer guides
          </h2>
        </div>
        <p className="ui text-[15px] text-[var(--muted)]">
          {guides.length} {guides.length === 1 ? "guide" : "guides"}
        </p>
      </div>
      <div className="grid gap-10">
        {groups.map(({ category, items }) => (
          <div key={category?.slug ?? "all"}>
            {category && (
              <h3 className="ui text-[15px] font-[620] mb-3" style={{ color: category.color }}>
                {category.name}
              </h3>
            )}
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((post) => (
                <li key={post.slug} className="min-w-0">
                  <Link
                    href={postPath(post.slug)}
                    className="tile group flex h-full flex-col gap-2 p-5 no-underline"
                  >
                    {post.image && (
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--r-s)]">
                        <Image src={post.image.src} alt={post.image.alt} fill sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                      </div>
                    )}
                    <span className="text-[17.5px] font-[600] leading-[1.3] text-[var(--ink)] group-hover:text-[var(--action-text)] transition-colors">
                      {post.title}
                    </span>
                    {post.quickAnswer?.value && (
                      <span className="ui text-[15px] text-[var(--ink-2)]">
                        <span className="font-[620] text-[var(--action-text)] tnum">{post.quickAnswer.value}</span>
                        {post.quickAnswer.unit ? ` ${post.quickAnswer.unit}` : ""}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
