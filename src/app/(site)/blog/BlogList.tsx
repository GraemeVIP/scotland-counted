"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/data/posts";

const TOPIC_COLOR: Record<string, string> = {
  "How it works": "var(--brand)",
  "The numbers": "var(--scotland)",
  "Take action": "var(--action)",
};

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * The article list, filterable by topic.
 *
 * Filtering happens in the browser over an already-rendered list, so every
 * article is still in the HTML for search engines and for anyone without
 * JavaScript — the filter only hides what is already there.
 */
export default function BlogList({ posts }: { posts: Post[] }) {
  const [topic, setTopic] = useState<string>("All");

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.topic)))],
    [posts]
  );
  const shown = topic === "All" ? posts : posts.filter((p) => p.topic === topic);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mt-7" role="group" aria-label="Filter articles by topic">
        {topics.map((t) => {
          const active = t === topic;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={active}
              className={`ui min-h-11 px-4 py-2 rounded-[var(--r-pill)] text-[15px] font-[650] border transition-colors ${
                active
                  ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                  : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--rule-strong)] hover:border-[var(--brand)]"
              }`}
            >
              {t}
              {t !== "All" && (
                <span className="ml-2 tnum opacity-60">
                  {posts.filter((p) => p.topic === t).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="ui text-[15px] text-[var(--muted)] mt-4" aria-live="polite">
        {shown.length} {shown.length === 1 ? "article" : "articles"}
        {topic !== "All" && ` in ${topic}`}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {shown.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 no-underline hover:border-[var(--rule-strong)] transition-colors"
            style={{ boxShadow: "var(--shadow-1)" }}
          >
            <span className="ui text-[15px] font-[750]" style={{ color: TOPIC_COLOR[p.topic] }}>
              {p.topic}
            </span>
            <h2 className="text-[22px] font-[720] leading-[1.25] mt-2 text-[var(--ink)] group-hover:text-[var(--action)] transition-colors">
              {p.title}
            </h2>
            <p className="text-[16.5px] leading-[1.55] text-[var(--ink-2)] mt-2.5">
              {p.standfirst}
            </p>
            <p className="text-[15px] text-[var(--muted)] mt-3.5">
              {fmtDate(p.date)} · {p.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
