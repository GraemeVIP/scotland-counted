"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPostCategory, type Post } from "@/lib/data/posts";

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * A manually controlled editorial rail. It deliberately does not autoplay:
 * the reader owns the pace, while snap points, a live card scale and the
 * progress rail make the interaction feel more like a magazine than a grid.
 */
export default function BlogCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(posts.length > 1);

  const syncControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrevious(track.scrollLeft > 8);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;

        const index = cardRefs.current.indexOf(mostVisible.target as HTMLElement);
        if (index >= 0) setActive(index);
      },
      { root: track, threshold: [0.45, 0.65, 0.85] },
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    const onScroll = () => requestAnimationFrame(syncControls);
    track.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(syncControls);

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", onScroll);
    };
  }, [posts.length, syncControls]);

  const move = (direction: -1 | 1) => {
    const nextIndex = Math.max(0, Math.min(posts.length - 1, active + direction));
    const card = cardRefs.current[nextIndex];
    if (!card) return;

    setActive(nextIndex);
    trackRef.current?.scrollTo({
      left: card.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section className="border-y border-[var(--rule)] bg-[var(--paper-2)] py-10 sm:py-12" aria-labelledby="more-to-explore">
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[680px]">
            <p className="kicker mb-2 text-[var(--brand)]">Read, check, understand</p>
            <h2 id="more-to-explore" className="display-stat text-[clamp(32px,3.8vw,50px)] max-w-[18ch]">
              Something useful to read
            </h2>
            <p className="mt-3 max-w-[54ch] text-[16px] leading-[1.5] text-[var(--ink-2)]">
              Plain-English explainers, practical guides and source-linked investigations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <Link href="/blog" className="ui text-[15px] font-[760] text-[var(--brand)] no-underline transition-colors hover:text-[var(--action)]">
              See all {posts.length} explainers <span aria-hidden="true">→</span>
            </Link>
            <div className="flex items-center gap-3" aria-label="Article carousel controls">
              <span className="ui mr-1 text-[14px] font-[700] text-[var(--muted)]" aria-live="polite">
                {active + 1} / {posts.length}
              </span>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[22px] leading-none text-[var(--ink)] transition-colors hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => move(-1)}
                disabled={!canPrevious}
                aria-label="Previous article"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--ink)] bg-[var(--ink)] text-[22px] leading-none text-white transition-colors hover:bg-[var(--brand)] hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => move(1)}
                disabled={!canNext}
                aria-label="Next article"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="blog-carousel-viewport relative mt-7 min-w-0 max-w-full">
          <div
            ref={trackRef}
            className="blog-carousel-track flex min-w-0 max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 pr-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Scotland Counted explainers and investigations"
          >
            {posts.map((post, index) => {
            const category = getPostCategory(post.category);
            const isActive = index === active;

            return (
              <article
                key={post.slug}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className={`group snap-start overflow-hidden rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)] transition-[transform,opacity,box-shadow] duration-500 ease-[var(--ease)] motion-reduce:transition-none ${
                  isActive
                    ? "scale-100 opacity-100 shadow-[var(--shadow-3)]"
                    : "scale-[0.97] opacity-65 shadow-[var(--shadow-1)]"
                }`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${posts.length}: ${post.title}`}
                style={{ flex: "0 0 min(450px, 82vw)" }}
              >
                <Link href={`/blog/${post.slug}`} className="block no-underline">
                  <div className="relative aspect-[1.9/1] overflow-hidden bg-[var(--deep)]">
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(min-width: 1024px) 450px, 82vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      style={{ objectPosition: post.image.objectPosition ?? "center" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,18,34,0.92)] via-[rgba(12,18,34,0.12)] to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                      <p className="ui text-[15px] font-[760] text-white" style={{ color: category?.color ?? "var(--action)" }}>
                        {category?.name ?? "Explained"}
                      </p>
                      <h3 className="mt-2 max-w-[18ch] text-[25px] font-[820] leading-[1.08] tracking-[-0.025em] text-white sm:text-[29px]">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="blog-carousel-excerpt text-[15px] leading-[1.45] text-[var(--ink-2)]">
                      {post.standfirst}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="ui text-[14px] font-[650] text-[var(--muted)]">
                        {fmtDate(post.updated ?? post.date)} · {post.readingMinutes} min read
                      </p>
                      <span className="ui text-[14px] font-[760] text-[var(--brand)] transition-colors group-hover:text-[var(--action)]">
                        Read it <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
            })}
          </div>
          <div className="blog-carousel-edge-hint pointer-events-none absolute right-0 top-0 hidden h-full w-16 items-center justify-end bg-gradient-to-l from-[var(--paper-2)] via-[color-mix(in_srgb,var(--paper-2)_75%,transparent)] to-transparent pr-1 sm:flex" aria-hidden="true">
            <span className="rounded-full bg-[var(--surface)] px-2 py-1 text-[18px] text-[var(--brand)] shadow-[var(--shadow-1)]">→</span>
          </div>
        </div>

        <p className="ui mt-2 flex items-center gap-2 text-[14px] font-[650] text-[var(--muted)] sm:hidden">
          Swipe to browse <span aria-hidden="true" className="text-[var(--brand)]">→</span>
        </p>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--rule)]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-500 ease-[var(--ease)] motion-reduce:transition-none"
            style={{ width: `${((active + 1) / Math.max(posts.length, 1)) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
