import type { ReactNode } from "react";
import { ExplainText } from "@/components/Glossary";

/**
 * The questions block, in one place.
 *
 * There were four different treatments of the same thing across the site — a
 * hairline rule on the area pages, a heavy rule on the constituency and policy
 * pages, tinted cards inside blog posts, and accordions on the home page. The
 * lightest of them read as unfinished: bare text under a faint line, with a
 * ragged hole wherever the count was odd and a two-column grid left one cell
 * empty.
 *
 * This is one card treatment, numbered so the eye has a rhythm to follow, and
 * an odd last question stretches across both columns rather than leaving a gap.
 *
 * Presentational only. Pages emit their own FAQPage structured data, because
 * the answers usually need to be in the schema whether or not this renders.
 */

export type FaqItem = { q: string; a: ReactNode };

export default function Faq({
  items,
  title = "Questions people ask",
  kicker = "Straight answers",
  id = "questions",
  className = "",
}: {
  items: FaqItem[];
  title?: string;
  kicker?: string;
  id?: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  const odd = items.length % 2 === 1;

  return (
    <section className={className} aria-labelledby={id}>
      {kicker && <p className="kicker mb-3 text-[var(--brand)]">{kicker}</p>}
      <h2 id={id} className="display-stat text-[clamp(28px,3.4vw,44px)] max-w-[20ch]">
        {title}
      </h2>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={typeof item.q === "string" ? item.q : i}
            className={`flex gap-4 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5 sm:px-6 sm:py-6 ${
              odd && i === items.length - 1 ? "lg:col-span-2" : ""
            }`}
            style={{ boxShadow: "var(--shadow-1)" }}
          >
            <span
              aria-hidden="true"
              className="ui tnum shrink-0 text-[14px] font-[750] leading-[1.6] text-[var(--brand)]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-[18px] font-[740] leading-[1.3] sm:text-[19px]">{item.q}</h3>
              <div className="mt-2.5 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
                <ExplainText>{item.a}</ExplainText>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
