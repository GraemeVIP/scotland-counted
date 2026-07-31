import Link from "next/link";
import type { ReactNode } from "react";
import type { Direction } from "@/lib/data/indicators";
import Reveal from "@/components/Reveal";
import { CountUp } from "@/components/Motion";

/* ============================================================
   Containers
   ============================================================ */

/** Full page width. Wide enough for data, with real margins. */
export function Page({ children }: { children: ReactNode }) {
  return <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">{children}</div>;
}

/** A reading column. Prose stays narrow even when the page is wide. */
export function Col({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[640px] prose ${className}`}>{children}</div>;
}

/**
 * Editorial two-column: argument on the left, supporting material in the
 * margin. Collapses to one column below lg.
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
    <div className={`grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] ${className}`}>
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
    <div className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`}>
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
    <header className="pt-14 sm:pt-24 pb-10 sm:pb-14">
      <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto] items-end">
        <div>
          {eyebrow && <p className="label mb-6">{eyebrow}</p>}
          <h1 className="h1 max-w-[15ch] mb-7">{title}</h1>
          {lede && <div className="lede max-w-[54ch]">{lede}</div>}
          {children}
        </div>

        {stat && (
          <div className="lg:pb-2 lg:border-l lg:border-[var(--rule)] lg:pl-12 max-w-[340px]">
            <div className={`figure-num text-[clamp(64px,8vw,110px)] ${tone}`}>
              {(() => {
                const m = stat.value.match(/^(£?)(\d+(?:\.\d+)?)(%?)$/);
                if (!m) return stat.value;
                const dp = m[2].includes(".") ? m[2].split(".")[1].length : 0;
                return (
                  <CountUp value={parseFloat(m[2])} decimals={dp} prefix={m[1]} suffix={m[3]} />
                );
              })()}
            </div>
            <p className="text-[14.5px] leading-[1.5] text-[var(--ink-2)] mt-5">{stat.label}</p>
          </div>
        )}
      </div>
      <div className="mt-12 sm:mt-16 border-t-2 border-[var(--ink)]" />
    </header>
  );
}

const DIR: Record<Direction, { cls: string; glyph: string; label: string }> = {
  worsening: { cls: "text-[var(--bad)]", glyph: "▲", label: "Getting worse" },
  improving: { cls: "text-[var(--good)]", glyph: "▼", label: "Getting better" },
  stalled: { cls: "text-[var(--flat)]", glyph: "■", label: "Stalled" },
};

export function DirectionChip({ direction }: { direction: Direction }) {
  const d = DIR[direction];
  return (
    <span
      className={`ui inline-flex items-center gap-2 rounded-full text-[13px] font-[640] px-3.5 py-1.5 border whitespace-nowrap ${d.cls}`}
      style={{ borderColor: "currentColor" }}
    >
      <span aria-hidden="true" className="text-[10px] leading-none">
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
      className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-l-[5px] border-l-[var(--action)] px-6 sm:px-8 py-6 max-w-[760px]"
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      <p className="ui text-[13.5px] font-[750] text-[var(--action)] mb-3">In short</p>
      <div className="ui text-[17.5px] sm:text-[18.5px] leading-[1.6] font-[460] space-y-2 [&_strong]:font-[700]">
        {children}
      </div>
      {expert && (
        <p className="ui mt-5 pt-4 border-t border-[var(--rule)] text-[13.5px] text-[var(--ink-2)]">
          <span className="font-[680]">For journalists and researchers:</span>{" "}
          <Link href="/data" className="underline underline-offset-2 decoration-[var(--rule-strong)] hover:decoration-[var(--brand)]">
            the data
          </Link>
          {" · "}
          <Link href="/methods" className="underline underline-offset-2 decoration-[var(--rule-strong)] hover:decoration-[var(--brand)]">
            methods
          </Link>
          {" · "}
          <Link href="/press" className="underline underline-offset-2 decoration-[var(--rule-strong)] hover:decoration-[var(--brand)]">
            press kit and embeds
          </Link>
        </p>
      )}
    </div>
  );
}

/**
 * A numbered section marker. The number is real information — these are
 * the report's figures, in order — not decoration.
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
    <div className={`grid gap-x-8 sm:grid-cols-[auto_minmax(0,1fr)] items-start ${className}`}>
      {n !== undefined && (
        <div
          className="figure-num text-[clamp(40px,5vw,64px)] text-[var(--action)] opacity-30 select-none hidden sm:block"
          aria-hidden="true"
        >
          {String(n).padStart(2, "0")}
        </div>
      )}
      <div>
        {eyebrow && <p className="label mb-3">{eyebrow}</p>}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
          <h2 id={id} className="h2 max-w-[22ch]">
            {title}
          </h2>
          {direction && <DirectionChip direction={direction} />}
        </div>
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
            <div className="label label-quiet leading-[1.5] mb-5 sm:min-h-[3em]">{s.label}</div>
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
            <div className="datum text-[12.5px] text-[var(--ink-2)] mt-4">
              {s.from} <span className="text-[var(--muted)] px-0.5">→</span> {s.to}
            </div>
            <div className="datum text-[11.5px] text-[var(--muted)] mt-1">{s.period}</div>
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
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <Reveal>
            <p className="display text-[clamp(26px,3.6vw,46px)] max-w-[19ch] font-[750]">
              {children}
            </p>
            {attribution && (
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-55 mt-8">
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
    <FullBleed className="mt-20 sm:mt-28">
      <div className="bg-[var(--deep)] text-[var(--deep-ink)] py-18 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="h2 mb-4 max-w-[18ch]">{title}</h2>
              <p className="opacity-80 max-w-[54ch] text-[17.5px] leading-[1.55]">{body}</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
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
