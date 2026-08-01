import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import type { Direction } from "@/lib/data/indicators";
import Reveal from "@/components/Reveal";
import { CountUp } from "@/components/Motion";

/* ============================================================
   Containers
   ============================================================ */

/** Shared content frame. Full-bleed sections opt out explicitly below. */
export function Page({ children }: { children: ReactNode }) {
  // 1,232px includes the desktop gutters (56px each), leaving the same
  // 1,120px reading frame used by PageHeader and ContentFrame. Keeping the
  // outer and inner frames separate lets the mobile gutters stay fluid.
  return <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">{children}</div>;
}

/**
 * One shared desktop frame for editorial content, cards and supporting panels.
 *
 * `PageHeader` centres itself on the same 1120px measure, so anything that does
 * not use this frame sits noticeably further left than the header rule above
 * it. `as` exists so a page section can keep its own element and still line up.
 */
export function ContentFrame({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <Tag className={`max-w-[1120px] mx-auto ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** A reading column. Prose stays narrow even when the page is wide. */
export function Col({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[640px] prose ${className}`}>{children}</div>;
}

/**
 * Two-column: argument on the left, supporting material on the right.
 *
 * The aside used to sit in a narrow margin as a print-style sidenote, which
 * left it doing nothing on a phone — it simply dropped underneath. It now
 * takes a real share of the width so it reads as a second element rather than
 * a footnote, and the columns are closer in weight.
 */
export function Split({
  children,
  aside,
  className = "",
}: {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-x-12 gap-y-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start ${className}`}>
      <div className="prose">{children}</div>
      {aside && <div className="lg:pt-1.5">{aside}</div>}
    </div>
  );
}

/** Breaks out of the page container to the full viewport width. */
export function FullBleed({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative left-1/2 -ml-[50vw] w-screen ${className}`}>
      {children}
    </div>
  );
}

/* ============================================================
   Page furniture
   ============================================================ */

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  stat,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
  /** Optional big number pinned to the right of the header. */
  stat?: { value: string; label: string; tone?: "bad" | "good" | "neutral" };
}) {
  const tone =
    stat?.tone === "bad"
      ? "text-[var(--bad)]"
      : stat?.tone === "good"
        ? "text-[var(--good)]"
        : "text-[var(--brand)]";

  return (
    <header className="pt-10 sm:pt-14 pb-8 sm:pb-10">
      <div
        className={`max-w-[1120px] mx-auto ${
          stat
            ? "grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] items-end"
            : ""
        }`}
      >
        <div>
          {eyebrow && <p className="label mb-6">{eyebrow}</p>}
          <h1 className="h1 max-w-[17ch] mb-5">{title}</h1>
          {lede && <div className="lede max-w-[54ch]">{lede}</div>}
          {children}
        </div>

        {stat && (
          <div className="min-w-0 max-w-[340px] lg:pb-2 lg:border-l lg:border-[var(--rule)] lg:pl-12">
            <div className={`figure-num whitespace-nowrap text-[clamp(56px,6.5vw,96px)] ${tone}`}>
              {(() => {
                const m = stat.value.match(/^(£?)(\d+(?:\.\d+)?)(%?)$/);
                if (!m) return stat.value;
                const dp = m[2].includes(".") ? m[2].split(".")[1].length : 0;
                return (
                  <CountUp value={parseFloat(m[2])} decimals={dp} prefix={m[1]} suffix={m[3]} />
                );
              })()}
            </div>
            <p className="text-[15px] leading-[1.5] text-[var(--ink-2)] mt-5">{stat.label}</p>
          </div>
        )}
      </div>
      <div className="mt-8 sm:mt-10 max-w-[1120px] mx-auto border-t-2 border-[var(--ink)]" />
    </header>
  );
}

const DIR: Record<Direction, { cls: string; glyph: string; label: string }> = {
  worsening: { cls: "text-[var(--bad-text)]", glyph: "▲", label: "Getting worse" },
  improving: { cls: "text-[var(--good-text)]", glyph: "▼", label: "Getting better" },
  stalled: { cls: "text-[var(--flat-text)]", glyph: "■", label: "Stalled" },
};

export function DirectionChip({ direction }: { direction: Direction }) {
  const d = DIR[direction];
  return (
    <span
      className={`ui inline-flex items-center gap-2 rounded-full text-[15px] font-[680] px-3.5 py-2 border whitespace-nowrap ${d.cls}`}
      style={{ borderColor: "currentColor" }}
    >
      <span aria-hidden="true" className="text-[15px] leading-none">
        {d.glyph}
      </span>
      {d.label}
    </span>
  );
}

/* ============================================================
   The two-audience layer
   ============================================================ */

/**
 * The plain-English opening every heavy page leads with. Short
 * sentences, no jargon, sans type — written for a reader who does not
 * do charts. The footer of the same panel is the clearly-marked door
 * for the other audience, so both know where they are.
 */
export function InShort({
  children,
  expert = true,
}: {
  children: ReactNode;
  expert?: boolean;
}) {
  return (
    <div
      className={`mx-auto rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-l-[5px] border-l-[var(--action)] px-6 sm:px-8 py-6 ${expert ? "max-w-[1120px]" : "max-w-[760px]"}`}
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      <div className={expert ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-9" : ""}>
        <div>
          <p className="ui text-[15px] font-[750] text-[var(--action)] mb-3">What this means</p>
          <div className="ui text-[18px] sm:text-[19px] leading-[1.55] font-[480] space-y-2.5 [&_strong]:font-[750]">
            {children}
          </div>
        </div>
        {expert && (
          <aside className="border-t border-[var(--rule)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="ui text-[15px] font-[750] text-[var(--ink)] mb-3">Want to check the proof?</p>
            <div className="grid gap-2.5 ui text-[15px] leading-[1.45] text-[var(--ink-2)]">
              <Link href="/data" className="font-[650] hover:text-[var(--brand)]">
                Exact data →
              </Link>
              <Link href="/methods" className="font-[650] hover:text-[var(--brand)]">
                How it was counted →
              </Link>
              <Link href="/press" className="font-[650] hover:text-[var(--brand)]">
                Press downloads →
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/** Keeps precise figures easy to reach without making them the first hurdle. */
export function EvidenceDetails({
  children,
  summary = "See the exact figures and sources",
  className = "",
}: {
  children: ReactNode;
  summary?: string;
  className?: string;
}) {
  return (
    <details
      className={`group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] ${className}`}
    >
      <summary className="ui min-h-12 cursor-pointer list-none flex items-center gap-3 px-5 py-3 text-[16px] font-[700] text-[var(--brand)] hover:bg-[var(--surface-2)]">
        <span className="transition-transform group-open:rotate-90" aria-hidden="true">
          ▸
        </span>
        {summary}
      </summary>
      <div className="border-t border-[var(--rule)] px-5 py-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
        {children}
      </div>
    </details>
  );
}

/**
 * A section marker.
 *
 * This used to print a huge ghosted "01" in the margin beside every heading.
 * That is report furniture: it tells the reader they are working through a
 * numbered document rather than using a site. The number is kept in the markup
 * for anyone who wants to cite a section, but it is now a small inline tag
 * rather than the largest thing on the row, and the heading itself carries the
 * weight.
 */
export function SectionHead({
  n,
  eyebrow,
  title,
  direction,
  id,
  className = "",
}: {
  n?: number;
  eyebrow?: string;
  title: string;
  direction?: Direction;
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {(eyebrow || n !== undefined) && (
        <p className="kicker mb-3 flex items-center gap-2.5 text-[var(--brand)]">
          {n !== undefined && (
            <span className="tnum text-[var(--muted)]">{String(n).padStart(2, "0")}</span>
          )}
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
        <h2
          id={id}
          className="display-stat text-[clamp(28px,3.4vw,44px)] max-w-[20ch]"
        >
          {title}
        </h2>
        {direction && <DirectionChip direction={direction} />}
      </div>
    </div>
  );
}

/* ============================================================
   Data furniture
   ============================================================ */

export function StatStrip({
  stats,
}: {
  stats: {
    label: string;
    value: string;
    from: string;
    to: string;
    period: string;
    direction: Direction;
    href?: string;
  }[];
}) {
  return (
    <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
      {stats.map((s, i) => {
        const num = parseFloat(s.value.replace(/[^0-9.]/g, ""));
        const suffix = s.value.replace(/^[0-9.]+/, "");
        const dp = s.value.includes(".") ? 1 : 0;
        const inner = (
          <>
            <div className="ui text-[15px] font-[650] text-[var(--ink-2)] leading-[1.45] mb-5 sm:min-h-[3em]">
              {s.label}
            </div>
            <div
              className={`figure-num text-[46px] ${
                s.direction === "worsening" ? "text-[var(--bad)]" : "text-[var(--ink)]"
              }`}
            >
              {Number.isFinite(num) ? (
                <CountUp value={num} decimals={dp} suffix={suffix} />
              ) : (
                s.value
              )}
            </div>
            <div className="ui text-[15px] text-[var(--ink-2)] mt-4 tnum">
              was {s.from}, now {s.to}
            </div>
            <div className="ui text-[15px] text-[var(--muted)] mt-0.5 tnum">
              {s.period.replace("→", "to")}
            </div>
          </>
        );
        return s.href ? (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-[var(--paper)] px-6 pt-7 pb-8 hover:bg-[var(--surface)] transition-colors relative"
          >
            {inner}
            <span
              aria-hidden="true"
              className="absolute top-6 right-6 text-[var(--muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            >
              →
            </span>
            <span className="sr-only">Read more about {s.label}</span>
            <span className="sr-only">{i}</span>
          </Link>
        ) : (
          <div key={s.label} className="bg-[var(--paper)] px-6 pt-7 pb-8">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** A margin note beside the argument — a fact that supports the paragraph. */
export function Note({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <aside className="border-l-[3px] border-[var(--brand)] pl-6 py-1 max-w-[350px]">
      <p className="label mb-2">{label}</p>
      {value && <p className="figure-num text-[38px] text-[var(--ink)] mb-2">{value}</p>}
      {children && (
        <div className="text-[15px] leading-[1.55] text-[var(--ink-2)]">{children}</div>
      )}
    </aside>
  );
}

/** A full-width inverted slab. Used for the one line that matters most. */
export function Slab({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <FullBleed className="my-16 sm:my-24">
      <div className="bg-[var(--deep)] text-[var(--deep-ink)] py-20 sm:py-28">
        <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">
          <Reveal>
            <p className="display text-[clamp(26px,3.6vw,46px)] max-w-[19ch] font-[750]">
              {children}
            </p>
            {attribution && (
              <p className="ui text-[15px] opacity-70 mt-8">
                {attribution}
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </FullBleed>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--r-s)] border-l-[4px] border-[var(--action)] bg-[var(--surface-2)] px-6 py-5 my-8 prose max-w-[680px]">
      {children}
    </div>
  );
}

export function CTA({
  title,
  body,
  href,
  cta,
  secondaryHref,
  secondaryCta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  secondaryHref?: string;
  secondaryCta?: string;
}) {
  return (
    <FullBleed className="mt-20 -mb-24 sm:mt-28">
      <div className="bg-[var(--deep)] text-[var(--deep-ink)] py-16 sm:py-20">
        <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)] lg:items-center">
            <div>
              <h2 className="h2 mb-4 max-w-[18ch]">{title}</h2>
              <p className="opacity-80 max-w-[54ch] text-[17.5px] leading-[1.55]">{body}</p>
            </div>
            <div className="rounded-[var(--r-m)] border border-white/15 bg-white/[0.055] p-5 sm:p-6">
              <p className="kicker mb-4 text-[var(--action)]">One simple next step</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={href}
                  className="btn btn-primary"
                >
                  {cta}
                  <span aria-hidden="true">→</span>
                </Link>
                {secondaryHref && secondaryCta && (
                  <Link
                    href={secondaryHref}
                    className="btn border-current/35 text-current hover:bg-white/10"
                  >
                    {secondaryCta}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullBleed>
  );
}

/** A link card used in grids. */
export function Card({
  href,
  eyebrow,
  title,
  body,
  meta,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  meta?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-7 sm:p-8 transition-all duration-300 hover:border-[var(--brand)] hover:-translate-y-1 hover:shadow-[var(--shadow-2)]"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="label">{eyebrow}</p>
        {meta}
      </div>
      <h3 className="h3 mb-3 group-hover:text-[var(--brand)] transition-colors">{title}</h3>
      <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{body}</p>
      <span
        aria-hidden="true"
        className="mt-7 text-[var(--action)] text-[18px] group-hover:translate-x-1.5 transition-transform"
      >
        →
      </span>
    </Link>
  );
}

export { Reveal };
