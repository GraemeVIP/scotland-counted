import Link from "next/link";
import type { ReactNode } from "react";
import type { Direction } from "@/lib/data/indicators";

/** Page shell: consistent width and rhythm on every route. */
export function Page({ children }: { children: ReactNode }) {
  return <div className="max-w-[1180px] mx-auto px-4 sm:px-6">{children}</div>;
}

/** A reading column. Prose stays narrow even when charts go wide. */
export function Col({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[660px] prose ${className}`}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="pt-12 sm:pt-16 pb-8 border-b border-[var(--rule)]">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="h1 max-w-[17ch] mb-5">{title}</h1>
      {lede && <div className="lede max-w-[58ch]">{lede}</div>}
      {children}
    </header>
  );
}

const DIR_STYLE: Record<Direction, { cls: string; glyph: string; label: string }> = {
  worsening: { cls: "text-[var(--bad)]", glyph: "▲", label: "Worsening" },
  improving: { cls: "text-[var(--good)]", glyph: "▼", label: "Improving" },
  stalled: { cls: "text-[var(--flat)]", glyph: "■", label: "Stalled" },
};

export function DirectionChip({ direction }: { direction: Direction }) {
  const d = DIR_STYLE[direction];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] px-2 py-1 border rounded-[2px] whitespace-nowrap ${d.cls}`}
      style={{ borderColor: "currentColor" }}
    >
      <span aria-hidden="true" className="text-[12px] leading-none">
        {d.glyph}
      </span>
      {d.label}
    </span>
  );
}

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
    <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] [grid-template-columns:repeat(auto-fit,minmax(196px,1fr))]">
      {stats.map((s) => {
        const inner = (
          <>
            <div className="font-mono text-[11px] uppercase tracking-[0.07em] text-[var(--muted)] leading-[1.45] mb-3 sm:min-h-[2.9em]">
              {s.label}
            </div>
            <div
              className={`text-[30px] font-[640] tracking-[-0.028em] leading-none ${
                s.direction === "worsening" ? "text-[var(--bad)]" : "text-[var(--good)]"
              }`}
            >
              {s.value}
            </div>
            <div className="font-mono text-[12.5px] text-[var(--ink-2)] mt-2.5">
              {s.from} <span className="text-[var(--muted)] px-1">→</span> {s.to}
              <span className="text-[var(--muted)]"> · {s.period}</span>
            </div>
          </>
        );
        return s.href ? (
          <Link
            key={s.label}
            href={s.href}
            className="bg-[var(--ground)] px-5 pt-5 pb-6 hover:bg-[var(--surface-2)] transition-colors"
          >
            {inner}
          </Link>
        ) : (
          <div key={s.label} className="bg-[var(--ground)] px-5 pt-5 pb-6">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div
      className="border-l-[3px] border-[var(--glasgow)] rounded-r-[3px] px-5 py-4 my-6 prose"
      style={{ background: "var(--glasgow-wash)" }}
    >
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
    <section className="mt-16 bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-7 sm:p-9" style={{ boxShadow: "var(--shadow)" }}>
      <h2 className="h2 mb-3 max-w-[20ch]">{title}</h2>
      <p className="text-[var(--ink-2)] max-w-[58ch] mb-6">{body}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-[var(--glasgow)] text-white px-5 py-3 rounded-[3px] font-[580] text-[15.5px] hover:opacity-90 transition-opacity"
        >
          {cta}
          <span aria-hidden="true">→</span>
        </Link>
        {secondaryHref && secondaryCta && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 border border-[var(--baseline)] px-5 py-3 rounded-[3px] font-[580] text-[15.5px] hover:border-[var(--ink)] transition-colors"
          >
            {secondaryCta}
          </Link>
        )}
      </div>
    </section>
  );
}

export function SectionHead({
  title,
  direction,
  id,
}: {
  title: string;
  direction?: Direction;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2 mb-3.5">
      <h2 id={id} className="h2">
        {title}
      </h2>
      {direction && <DirectionChip direction={direction} />}
    </div>
  );
}
