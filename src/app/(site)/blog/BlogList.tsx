import Image from "next/image";
import Link from "@/components/IntentLink";
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
  const alsoNew = featured ? stories.slice(1, 4) : [];
  const shown = new Set([featured?.slug, ...alsoNew.map((post) => post.slug)]);
  const remaining = stories.filter((post) => !shown.has(post.slug));
  const featuredCategory = featured ? getPostCategory(featured.category) : undefined;

  return (
    <>
      <nav className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0" aria-label="Article categories">
        <Link
          href="/blog"
          aria-current={!activeCategory ? "page" : undefined}
          className={`ui min-h-10 inline-flex shrink-0 items-center whitespace-nowrap px-3.5 py-1.5 rounded-[var(--r-pill)] text-[14.5px] font-[560] border no-underline transition-colors ${
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
              className={`ui min-h-10 inline-flex shrink-0 items-center whitespace-nowrap px-3.5 py-1.5 rounded-[var(--r-pill)] text-[14.5px] font-[560] border no-underline transition-colors ${
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
        <section className="mt-6" aria-labelledby="featured-story">
          <article className="group overflow-hidden rounded-[var(--r-l)] bg-[var(--deep)] text-[var(--deep-ink)]">
            <Link
              href={postPath(featured.slug)}
              className="grid no-underline lg:h-[clamp(360px,30vw,440px)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:h-full">
                {featured.image ? (
                  <Image
                    src={featured.image.cardSrc ?? featured.image.src}
                    alt={featured.image.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: featured.image.objectPosition ?? "center" }}
                  />
                ) : (
                  <CoverArt label="Guide" title={featured.title} className="absolute inset-0" />
                )}
                <span className="ui absolute left-4 top-4 rounded-[var(--r-pill)] bg-[var(--deep)]/85 px-3 py-1 text-[13px] font-[640] text-white backdrop-blur">
                  Latest
                </span>
              </div>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
                {/* Sits on --deep, so it uses the dark-background category colour. */}
                <p className="ui text-[14.5px] font-[620]" style={{ color: featuredCategory?.colorOnDark ?? "#8bb8ff" }}>
                  {featuredCategory?.name}
                </p>
                <h2
                  id="featured-story"
                  className="mt-2 text-[clamp(22px,1.85vw,30px)] font-[650] leading-[1.14] tracking-[-0.02em] group-hover:underline decoration-white/40 underline-offset-4"
                >
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-[16px] leading-[1.55] opacity-80">{featured.standfirst}</p>
                <p className="ui mt-4 text-[14px] opacity-65">
                  {fmtDate(featured.updated ?? featured.date)} · {featured.readingMinutes} min read
                </p>
              </div>
            </Link>
          </article>

          {alsoNew.length > 0 && (
            <ul aria-label="Also new" className="mt-4 grid gap-4 md:grid-cols-3">
              {alsoNew.map((post) => {
                const category = getPostCategory(post.category);
                return (
                  <li key={post.slug} className="min-w-0">
                    <Link
                      href={postPath(post.slug)}
                      className="tile group flex h-full gap-3.5 p-3.5 no-underline"
                    >
                      <div className="relative h-[78px] w-[96px] shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--paper-3)]">
                        {post.image && (
                          <Image
                            src={post.image.cardSrc ?? post.image.src}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                            style={{ objectPosition: post.image.objectPosition ?? "center" }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="ui text-[12.5px] font-[620]" style={{ color: category?.color }}>
                          {category?.name}
                        </p>
                        <p className="mt-0.5 line-clamp-4 text-[15.5px] font-[620] leading-[1.3] text-[var(--ink)] group-hover:text-[var(--action-text)] transition-colors">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <section className="pt-12" aria-labelledby="article-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="label mb-2">Read and check</p>
            <h2 id="article-list-heading" className="h2">
              {activeCategory ? `More ${getPostCategory(activeCategory)?.name.toLowerCase()}` : "More to read"}
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
