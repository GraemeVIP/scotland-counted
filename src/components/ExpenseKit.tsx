import type { ReactNode } from "react";
import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "@/components/IntentLink";
import { ExplainText } from "@/components/ExplainServer";

/* ------------------------------------------------------------------ */
/* Faces                                                               */
/* ------------------------------------------------------------------ */

function nameSlug(value: string) {
  return value
    .replace(/^(dr|sir|dame|rt hon)\.?\s+/i, "")
    .replace(/\s+(mp|msp)$/i, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The official photo for a politician, worked out from their profile link:
 * MPs by constituency, MSPs by name. Returns undefined when there is no photo.
 */
export function photoFor(name: string, href?: string): string | undefined {
  if (!href) return undefined;
  let rel: string | undefined;
  const mp = href.match(/\/representatives\/mps\/([a-z0-9-]+)/);
  if (mp) rel = `/images/representatives/mps/${mp[1]}.jpg`;
  else if (href.includes("/representatives/msps/")) rel = `/images/representatives/msps/${nameSlug(name)}.jpg`;
  if (!rel) return undefined;
  return existsSync(path.join(process.cwd(), "public", rel)) ? rel : undefined;
}

/** A round face photo. Renders nothing when there is no photo for the person. */
export function Face({ name, href, size = 56 }: { name: string; href?: string; size?: number }) {
  const src = photoFor(name, href);
  if (!src) return null;
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full bg-[var(--surface-2)] shadow-[0_0_0_1px_var(--rule-strong)]"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}

/**
 * Shared look for the expenses investigations (MPs and MSPs).
 *
 * Built for readers who scan: a 30 second version up top, big numbers that
 * jump to their section, "Finding 1 of 5" tags, bar charts instead of dense
 * tables, party colour dots, and exact claim wording set out like a receipt.
 * Every block uses the site's colour tokens, so it works in light and dark.
 */

/* ------------------------------------------------------------------ */
/* Parties                                                             */
/* ------------------------------------------------------------------ */

export type PartyKey =
  | "SNP"
  | "Labour"
  | "Conservative"
  | "Greens"
  | "Lib Dem"
  | "Reform UK"
  | "Independent"
  | "Alba";

export const PARTY: Record<PartyKey, { label: string; colour: string }> = {
  SNP: { label: "SNP", colour: "#f2c200" },
  Labour: { label: "Labour", colour: "#e4003b" },
  Conservative: { label: "Conservative", colour: "#0087dc" },
  Greens: { label: "Greens", colour: "#02a95b" },
  "Lib Dem": { label: "Lib Dem", colour: "#faa61a" },
  "Reform UK": { label: "Reform UK", colour: "#12b6cf" },
  Independent: { label: "Independent", colour: "#8a93a3" },
  Alba: { label: "Alba", colour: "#005eb8" },
};

/** Best guess at a party key from a full party name ("Scottish National Party"). */
export function partyKey(name: string): PartyKey {
  if (/scottish national|\bsnp\b/i.test(name)) return "SNP";
  if (/labour/i.test(name)) return "Labour";
  if (/conservative|tory/i.test(name)) return "Conservative";
  if (/green/i.test(name)) return "Greens";
  if (/liberal|lib dem/i.test(name)) return "Lib Dem";
  if (/reform/i.test(name)) return "Reform UK";
  if (/alba/i.test(name)) return "Alba";
  return "Independent";
}

export const gbp = (n: number, pence = true) =>
  `£${n.toLocaleString("en-GB", {
    minimumFractionDigits: pence ? 2 : 0,
    maximumFractionDigits: pence ? 2 : 0,
  })}`;

export function Dot({ p }: { p: PartyKey }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
      style={{ background: PARTY[p].colour }}
    />
  );
}

/** A party name with its colour dot. `label` overrides the short name. */
export function Party({ p, note, label }: { p: PartyKey; note?: string; label?: string }) {
  return (
    <span className="ui inline-flex flex-wrap items-center gap-x-1.5 text-[13.5px] font-[560] text-[var(--ink-2)]">
      <Dot p={p} />
      <span className="whitespace-nowrap">{label ?? PARTY[p].label}</span>
      {note && <span className="font-[480] text-[var(--muted)]">· {note}</span>}
    </span>
  );
}

/**
 * A name (linked when there is a page for it) with the party underneath.
 * `face` adds a small photo on the left.
 */
export function Who({
  name,
  href,
  p,
  note,
  face = false,
}: {
  name: string;
  href?: string;
  p: PartyKey;
  note?: string;
  face?: boolean;
}) {
  const inner = (
    <span className="flex min-w-0 flex-col gap-0.5">
      {href ? (
        <Link href={href} className="font-[620]">
          {name}
        </Link>
      ) : (
        <span className="font-[620] text-[var(--ink)]">{name}</span>
      )}
      <Party p={p} note={note} />
    </span>
  );
  if (!face) return inner;
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Face name={name} href={href} size={40} />
      {inner}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page furniture                                                      */
/* ------------------------------------------------------------------ */

/** "The 30 second version": short lines, one number each, for scanners. */
export function QuickTake({
  title = "The 30 second version",
  items,
}: {
  title?: string;
  items: ReactNode[];
}) {
  return (
    <div className="not-prose my-7 rounded-[var(--r-m)] border border-[var(--rule)] border-t-[4px] border-t-[var(--action)] bg-[var(--action-tint)] px-5 py-5 sm:px-7 sm:py-6">
      <p className="ui text-[14px] font-[680] uppercase tracking-[0.07em] text-[var(--action-text)]">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="ui flex gap-3 text-[17px] leading-[1.5] text-[var(--ink)] [&_strong]:font-[680]">
            <span
              aria-hidden="true"
              className="mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--action)] text-[12px] font-[700] text-[var(--action-ink)]"
            >
              {i + 1}
            </span>
            <span>
              <ExplainText>{it}</ExplainText>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Big number cards, each a jump link to its section. */
export function Headlines({
  items,
  label = "The headline findings",
}: {
  items: { value: string; label: string; href: string; cta?: string }[];
  label?: string;
}) {
  const cardClass =
    "group tile flex flex-col gap-3 border-t-[3px] border-t-[var(--bad)] p-5 no-underline transition-colors hover:bg-[var(--surface-2)]";
  return (
    <nav aria-label={label} className="not-prose my-8 grid gap-3 sm:grid-cols-2">
      {items.map((it) => {
        const inner = (
          <>
            <span className="figure-num text-[38px] leading-none text-[var(--bad-text)]">{it.value}</span>
            <span className="ui flex-1 text-[15.5px] leading-[1.45] text-[var(--ink-2)]">{it.label}</span>
            <span className="ui text-[14px] font-[620] text-[var(--action-text)]">
              {it.cta ?? "See the receipts"}{" "}
              <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </>
        );
        return it.href.startsWith("#") ? (
          <a key={it.href + it.value} href={it.href} className={cardClass}>
            {inner}
          </a>
        ) : (
          <Link key={it.href + it.value} href={it.href} className={cardClass}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}

/** Section heading with a "Finding 1 of 5" tag above it. */
export function Finding({
  n,
  of,
  id,
  children,
}: {
  n: number;
  of: number;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-10">
      <p className="ui mb-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--action-tint)] px-3 py-1 text-[13.5px] font-[640] text-[var(--action-text)]">
        <span className="tnum">Finding {n}</span>
        <span className="font-[500] text-[var(--ink-2)]">of {of}</span>
      </p>
      <h2 id={id} className="h2 scroll-mt-28">
        {children}
      </h2>
    </div>
  );
}

/** A framed chart block in the same style as GuideTable. */
export function ChartFrame({
  kicker,
  title,
  children,
  caption,
  legend,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  caption?: ReactNode;
  legend?: ReactNode;
}) {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--rule)] pb-4">
        <p className="ui text-[15px] font-[600] text-[var(--brand)]">{kicker}</p>
        <h3 className="mt-1 text-[21px] font-[600] leading-[1.25]">{title}</h3>
        {legend && (
          <div className="ui mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] text-[var(--ink-2)]">{legend}</div>
        )}
      </div>
      <div className="mt-5">{children}</div>
      {caption && <figcaption className="mt-5 text-[15px] leading-[1.6] text-[var(--ink-2)]">{caption}</figcaption>}
    </figure>
  );
}

export function Swatch({ colour, children }: { colour: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="inline-block h-3 w-5 rounded-sm" style={{ background: colour }} />
      {children}
    </span>
  );
}

/** One horizontal bar with its value on the right. */
export function Bar({
  value,
  max,
  colour = "var(--bad)",
  label,
}: {
  value: number;
  max: number;
  colour?: string;
  label: string;
}) {
  const pct = Math.min(100, Math.max((value / max) * 100, value > 0 ? 1.5 : 0));
  return (
    <div className="flex items-center gap-3">
      <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)] ring-1 ring-inset ring-[var(--rule)]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colour }} />
      </div>
      <span className="ui tnum w-[92px] shrink-0 text-right text-[14.5px] font-[620] text-[var(--ink)]">{label}</span>
    </div>
  );
}

export type RankRow = {
  key: string;
  who: ReactNode;
  side?: ReactNode;
  value: number;
  label: string;
  colour?: string;
  detail?: ReactNode;
  /** Draws the row with a soft highlight. */
  highlight?: boolean;
};

/** A numbered ranking with a bar per row. */
export function RankList({ rows, max }: { rows: RankRow[]; max?: number }) {
  const top = max ?? Math.max(...rows.map((r) => r.value));
  return (
    <ol className="divide-y divide-[var(--rule)]">
      {rows.map((r, i) => (
        <li
          key={r.key}
          className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${r.highlight ? "rounded-[var(--r-s)] bg-[var(--surface-2)] px-3 first:pt-3 last:pb-3" : ""}`}
        >
          <span className="figure-num tnum w-7 shrink-0 text-[20px] leading-[1.2] text-[var(--muted)]">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              {r.who}
              {r.side && <span className="ui text-[13.5px] text-[var(--muted)]">{r.side}</span>}
            </div>
            <div className="mt-2">
              <Bar value={r.value} max={top} colour={r.colour} label={r.label} />
            </div>
            {r.detail && <p className="ui mt-1.5 text-[14px] leading-[1.45] text-[var(--ink-2)]">{r.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Claim lines set out like a printed receipt, wording exactly as published. */
export function Receipt({
  heading,
  lines,
  footer = "Wording exactly as published.",
  total,
  person,
}: {
  heading: string;
  lines: { what: string; amount: string; meta?: string }[];
  footer?: string;
  total?: { label: string; amount: string };
  /** Whose claim this is: shown with their face above the receipt. */
  person?: CasePerson;
}) {
  return (
    <div className="not-prose my-7 rounded-[var(--r-s)] border border-dashed border-[var(--rule-strong)] bg-[var(--surface)] px-5 py-5 sm:px-6">
      {person && (
        <div className="mb-4 flex items-center gap-3 border-b border-[var(--rule)] pb-4">
          <Face name={person.name} href={person.href} size={48} />
          <div className="min-w-0">
            <p className="text-[19px] font-[680] leading-[1.2]">
              {person.href ? (
                <Link href={person.href} className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-[var(--action)]">
                  {person.name}
                </Link>
              ) : (
                <span className="text-[var(--ink)]">{person.name}</span>
              )}
            </p>
            <p className="mt-0.5">
              <Party p={person.p} note={person.place} />
            </p>
          </div>
        </div>
      )}
      <p className="ui text-[13.5px] font-[640] uppercase tracking-[0.06em] text-[var(--ink-2)]">{heading}</p>
      <div className="mt-3 divide-y divide-dashed divide-[var(--rule-strong)] font-[family-name:var(--font-mono)]">
        {lines.map((l, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 py-2.5">
            <span className="min-w-0">
              {l.meta && <span className="block text-[13px] text-[var(--ink-2)]">{l.meta}</span>}
              <span className="block text-[15.5px] leading-[1.45] text-[var(--ink)]">&ldquo;{l.what}&rdquo;</span>
            </span>
            <span className="tnum shrink-0 text-[16px] font-[650] text-[var(--bad-text)]">{l.amount}</span>
          </div>
        ))}
        {total && (
          <div className="flex items-baseline justify-between gap-4 border-t-2 border-solid border-[var(--ink)] py-2.5">
            <span className="text-[14.5px] font-[700] uppercase tracking-[0.04em] text-[var(--ink)]">{total.label}</span>
            <span className="tnum shrink-0 text-[17px] font-[700] text-[var(--bad-text)]">{total.amount}</span>
          </div>
        )}
      </div>
      {footer && <p className="mt-3 text-[12.5px] text-[var(--muted)]">{footer}</p>}
    </div>
  );
}

export type CasePerson = {
  name: string;
  href?: string;
  p: PartyKey;
  /** Seat, region or role shown after the party. */
  place?: string;
};

/**
 * A case file card: who it is about, in big type, with the figure beside it.
 * Always pass `people` when the card is about named politicians, so a reader
 * scanning the page can see whose case it is without reading the paragraph.
 */
export function CaseCard({
  kicker = "Case file",
  figure,
  people,
  children,
}: {
  kicker?: string;
  figure: string;
  people?: CasePerson[];
  children: ReactNode;
}) {
  return (
    <div className="not-prose my-6 rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] border-l-[var(--bad)] bg-[var(--surface)] px-5 py-6 sm:px-7">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p className="ui text-[13px] font-[660] uppercase tracking-[0.06em] text-[var(--muted)]">{kicker}</p>
          {people?.length ? (
            <div className="mt-1.5 space-y-2">
              {people.map((person) => (
                <div key={person.name} className="flex items-center gap-3.5">
                  <Face name={person.name} href={person.href} size={60} />
                  <div className="min-w-0">
                  <p className="text-[23px] font-[680] leading-[1.15] sm:text-[25px]">
                    {person.href ? (
                      <Link href={person.href} className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-[var(--action)]">
                        {person.name}
                      </Link>
                    ) : (
                      <span className="text-[var(--ink)]">{person.name}</span>
                    )}
                  </p>
                  <p className="mt-1">
                    <Party p={person.p} note={person.place} />
                  </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <p className="figure-num shrink-0 text-[34px] leading-none text-[var(--bad-text)]">{figure}</p>
      </div>
      <div className="mt-4 space-y-3 text-[17px] leading-[1.65] text-[var(--ink-2)]">
        <ExplainText>{children}</ExplainText>
      </div>
    </div>
  );
}

/** A row of two or three plain number tiles. `hot` marks the shocking one. */
export function Tiles({ items }: { items: { value: ReactNode; label: string; hot?: boolean }[] }) {
  return (
    <div className={`not-prose my-8 grid gap-3 ${items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {items.map((t) => (
        <div key={t.label} className={`tile p-5 ${t.hot ? "border-t-[3px] border-t-[var(--bad)]" : ""}`}>
          <p
            className={`figure-num text-[34px] leading-none ${t.hot ? "text-[var(--bad-text)]" : "text-[var(--ink)]"}`}
          >
            {t.value}
          </p>
          <p className="ui mt-2 text-[15px] leading-[1.45] text-[var(--ink-2)]">{t.label}</p>
        </div>
      ))}
    </div>
  );
}

/** A list of boxed points, each led by a party colour dot. */
export function PartyList({ items }: { items: { p: PartyKey; key?: string; children: ReactNode }[] }) {
  return (
    <ul className="not-prose space-y-3">
      {items.map((it, i) => (
        <li
          key={it.key ?? `${it.p}-${i}`}
          className="flex gap-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 text-[17px] leading-[1.6] text-[var(--ink-2)]"
        >
          <span className="pt-[7px]">
            <Dot p={it.p} />
          </span>
          <span>
            <ExplainText>{it.children}</ExplainText>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Boxed points without parties: short, one idea each, easy to scan. */
export function PointList({ items }: { items: { title: ReactNode; children: ReactNode; key?: string }[] }) {
  return (
    <ul className="not-prose space-y-3">
      {items.map((it, i) => (
        <li
          key={it.key ?? i}
          className="rounded-[var(--r-s)] border border-[var(--rule)] border-l-[4px] border-l-[var(--action)] bg-[var(--surface)] px-4 py-3.5 sm:px-5"
        >
          <p className="ui text-[16.5px] font-[660] leading-[1.4] text-[var(--ink)]">{it.title}</p>
          <div className="mt-1.5 text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            <ExplainText>{it.children}</ExplainText>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Open and close panel for long lists and full tables. */
export function Expand({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group tile not-prose my-7 overflow-hidden">
      <summary className="ui flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-[640] text-[var(--action-text)] transition-colors hover:bg-[var(--surface-2)] sm:px-6 [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] transition-transform duration-200 group-open:rotate-180"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="border-t border-[var(--rule)] p-5 sm:p-6">{children}</div>
    </details>
  );
}

/**
 * A bold dark panel for the most outrageous single claims, so they cannot be
 * missed while scrolling: face and linked name, the amount in big red, one
 * plain line saying what taxpayers paid for, and IPSA's own wording.
 */
export function Spotlight({
  person,
  kicker,
  amount,
  headline,
  lines,
  children,
}: {
  person?: CasePerson;
  /** Small caps line above the headline, e.g. the date. */
  kicker?: string;
  amount: string;
  /** One short sentence: what the public paid for. */
  headline: ReactNode;
  /** IPSA's exact wording for each claim line. */
  lines?: { what: string; amount: string; meta?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="not-prose my-10 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] border-l-[6px] border-l-[var(--bad)] bg-[color-mix(in_srgb,var(--bad)_5%,var(--surface))] text-[var(--ink)] shadow-[0_14px_34px_-26px_rgba(10,16,34,0.45)]">
      {person && (
        <div className="flex items-center gap-3 border-b border-[var(--rule)] px-6 py-4 sm:px-8">
          <Face name={person.name} href={person.href} size={44} />
          <p className="ui text-[15px] font-[620] leading-[1.35]">
            {person.href ? (
              <Link href={person.href} className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-[var(--action)]">
                {person.name}
              </Link>
            ) : (
              person.name
            )}
            <span className="text-[var(--muted)]">
              {" "}
              · {PARTY[person.p].label}
              {person.place ? ` · ${person.place}` : ""}
            </span>
          </p>
        </div>
      )}
      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {kicker && (
          <p className="ui text-[13px] font-[660] uppercase tracking-[0.07em] text-[var(--muted)]">{kicker}</p>
        )}
        <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-2">
          <p className="figure-num tnum text-[48px] leading-none text-[var(--bad-text)] sm:text-[56px]">{amount}</p>
          <p className="max-w-[30ch] pb-1 text-[22px] font-[700] leading-[1.2] text-[var(--ink)] sm:text-[26px]">{headline}</p>
        </div>
        {lines && lines.length > 0 && (
          <ul className="mt-6 divide-y divide-[var(--rule)] rounded-[var(--r-s)] bg-[var(--surface)] ring-1 ring-[var(--rule)]">
            {lines.map((l, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <span className="min-w-0">
                  {l.meta && <span className="ui block text-[13px] text-[var(--muted)]">{l.meta}</span>}
                  <span className="block font-[family-name:var(--font-mono)] text-[15px] leading-[1.45] text-[var(--ink)]">
                    &ldquo;{l.what}&rdquo;
                  </span>
                </span>
                <span className="tnum shrink-0 text-[16px] font-[650] text-[var(--bad-text)]">{l.amount}</span>
              </li>
            ))}
          </ul>
        )}
        {children && <div className="mt-5 space-y-3 text-[17px] leading-[1.55] text-[var(--ink-2)]">{children}</div>}
      </div>
    </section>
  );
}
