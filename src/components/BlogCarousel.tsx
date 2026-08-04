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
 * A manually controlled editorial rail. It does not autoplay: the reader owns
 * the pace.
 *
 * The scroll position is the only source of truth. An earlier version kept a
 * React "active card" index, moved it on a button press, and also let an
 * IntersectionObserver write to it, so one press advanced the readout by two,
 * and three quick presses moved two cards instead of three, because each press
 * read an index the observer was still mutating mid-animation. Here the buttons
 * only ever scroll, and everything on screen is derived from where the track
 * actually is. With one writer, nothing can disagree.
 *
 * The readout is a range rather than a single number: two or three cards are
 * visible at once on a wide screen, so "1 / 17" was never true.
 */
export default function BlogCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [range, setRange] = useState({ first: 1, last: 1 });
  const [progress, setProgress] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(posts.length > 1);

  /** Everything shown is read off the track, never written back to it. */
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth;
    setCanPrevious(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < max - 8);
    setProgress(max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 1);

    const left = track.scrollLeft;
    const right = left + track.clientWidth;
    const seen: number[] = [];
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const start = card.offsetLeft;
      const shown = Math.min(start + card.offsetWidth, right) - Math.max(start, left);
      // Counted once more than half of it is in view, so the readout matches
      // what a person would say they can see.
      if (shown > card.offsetWidth * 0.5) seen.push(index + 1);
    });
    if (seen.length) setRange({ first: seen[0], last: seen[seen.length - 1] });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [posts.length, sync]);

  /**
   * One card per press, relative to wherever the track is right now.
   *
   * scrollBy rather than scrollTo: a relative move reads the live position, so
   * presses during an in-flight animation add up instead of overwriting one
   * another. Scroll snapping then settles it onto a card edge.
   */
  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    const first = cardRefs.current[0];
    if (!track || !first) return;

    const second = cardRefs.current[1];
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;

    track.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
  };

  return (
    <section
      className="border-y border-[var(--rule)] bg-[var(--paper-2)] py-10 sm:py-12"
      aria-labelledby="more-to-explore"
    >
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[680px]">
            <p className="kicker mb-2 text-[var(--brand)]">Read, check, understand</p>
            <h2
              id="more-to-explore"
              className="display-stat text-[clamp(32px,3.8vw,50px)] max-w-[18ch]"
            >
              Something useful to read
            </h2>
            <p className="mt-3 max-w-[54ch] text-[16px] leading-[1.5] text-[var(--ink-2)]">
              Plain-English explainers, practical guides and source-linked investigations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <Link
              href="/blog"
              className="ui text-[15px] font-[760] text-[var(--brand)] no-underline transition-colors hover:text-[var(--action)]"
            >
              See all {posts.length} explainers <span aria-hidden="true">→</span>
            </Link>

            {/*
              Arrows are for pointers. On a phone the rail is swiped, and two
              44px targets beside "See all" only crowded the header with a third
              way to do the one thing swiping already does.
            */}
            <div
              className="hidden items-center gap-3 sm:flex"
              aria-label="Article carousel controls"
            >
              <span className="ui mr-1 text-[14px] font-[700] text-[var(--muted)] tnum">
                {range.first === range.last
                  ? `${range.first} of ${posts.length}`
                  : `${range.first}–${range.last} of ${posts.length}`}
              </span>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[22px] leading-none text-[var(--ink)] transition-colors hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => move(-1)}
                disabled={!canPrevious}
                aria-label="Scroll to previous articles"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--ink)] bg-[var(--ink)] text-[22px] leading-none text-white transition-colors hover:bg-[var(--brand)] hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => move(1)}
                disabled={!canNext}
                aria-label="Scroll to more articles"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="blog-carousel-viewport relative mt-7 min-w-0 max-w-full">
          <div
            ref={trackRef}
            onKeyDown={onKeyDown}
            className="blog-carousel-track flex min-w-0 max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 pr-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Scotland Counted explainers and investigations"
          >
            {posts.map((post, index) => {
              const category = getPostCategory(post.category);

              return (
                <article
                  key={post.slug}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  /*
                   * No per-card scale or dimming. Both were tied to the single
                   * "active" index, which is meaningless when two or three
                   * cards are on screen, it dimmed cards the reader was
                   * plainly looking at, and re-animated every card on every
                   * scroll. The hover lift carries the life instead.
                   */
                  className="group snap-start overflow-hidden rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-1)] transition-shadow duration-300 ease-[var(--ease)] hover:shadow-[var(--shadow-3)] motion-reduce:transition-none"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${posts.length}: ${post.title}`}
                  /*
                   * One whole card on a phone, several on a wide screen.
                   *
                   * The rail used to sit at 78vw everywhere, so a phone always
                   * showed a sliver of the next card down the right-hand edge.
                   * A slice that thin does not read as "there is more", it
                   * reads as a card that has been cut off, and it pulled the
                   * one you were meant to be reading off centre. 100% here is
                   * the width of the track, so the card fills the screen on a
                   * phone and caps at 430px once there is room for company.
                   * Swiping is signposted by the hint and the rail below.
                   */
                  style={{ flex: "0 0 min(430px, 100%)" }}
                >
                  <Link href={`/blog/${post.slug}`} className="block no-underline">
                    <div className="relative aspect-[1.9/1] overflow-hidden bg-[var(--deep)]">
                      <Image
                        src={post.image.src}
                        alt={post.image.alt}
                        fill
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(min-width: 1024px) 430px, 100vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        style={{ objectPosition: post.image.objectPosition ?? "center" }}
                      />
                      {/*
                        The scrim was 0.12 opaque at the halfway mark and clear
                        above it, fine behind a two-line title, useless behind
                        a four-line one, where the top lines sat on bare
                        photograph. It now holds opacity most of the way up, and
                        the title is capped at two lines so it cannot climb into
                        the part that is still bright.
                      */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,18,34,0.94)] via-[rgba(12,18,34,0.62)] to-[rgba(12,18,34,0.12)]" />
                      <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                        {/* The dark-background variant: these sit on a scrimmed
                            photograph, where the light-index colours fail. */}
                        <p
                          className="ui text-[15px] font-[760]"
                          style={{ color: category?.colorOnDark ?? "#ff8b75" }}
                        >
                          {category?.name ?? "Explained"}
                        </p>
                        <h3 className="blog-carousel-title mt-2 text-[23px] font-[820] leading-[1.12] tracking-[-0.025em] text-white sm:text-[27px]">
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

          {/*
            There is deliberately no edge treatment here.

            This corner held a round, shadowed → glyph on a gradient wash. The
            glyph was the worse half, pointer-events:none meant a click passed
            through it to the headline underneath and opened whichever article
            happened to be there, but the wash was not pulling its weight
            either. A card cut off by the edge of the rail already says the rail
            continues; painting the page colour over that card only makes it
            look faded or broken, and costs a card its right-hand third.
          */}
        </div>

        <p className="ui mt-2 flex items-center gap-2 text-[14px] font-[650] text-[var(--muted)] sm:hidden">
          Swipe to browse <span aria-hidden="true" className="text-[var(--brand)]">→</span>
        </p>

        {/*
          Fraction of the rail travelled, not "card N of 17". With several cards
          on screen the old sum reported a reader who could already see a fifth
          of the rail as 6% through it.
        */}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--rule)]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-200 ease-[var(--ease)] motion-reduce:transition-none"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
