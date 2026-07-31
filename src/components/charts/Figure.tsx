import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import EmbedButton from "@/components/charts/EmbedButton";

/** The card every chart sits in: title, source line, legend, chart, caption. */
export default function Figure({
  n,
  title,
  sub,
  legend,
  children,
  caption,
  table,
  technical,
  embedSlug,
  className = "",
}: {
  /** Figure number, shown in the corner. Real information, not decoration. */
  n?: number;
  title: string;
  sub: string;
  legend?: { name: string; colorVar: string }[];
  children: ReactNode;
  caption?: ReactNode;
  table?: ReactNode;
  technical?: string[];
  /** When set, offers a copyable iframe snippet for /embed/[slug]. */
  embedSlug?: string;
  className?: string;
}) {
  return (
    <Reveal>
      <figure
        className={`relative bg-[var(--surface)] border border-[var(--rule)] p-5 sm:p-8 pb-4 ${className}`}
        style={{ boxShadow: "var(--shadow-1)" }}
      >
        <div className="flex items-start justify-between gap-6 mb-1">
          <p className="h4 max-w-[46ch]">{title}</p>
          {n !== undefined && (
            <span
              className="label label-quiet shrink-0 pt-1 text-[11px]"
              aria-hidden="true"
            >
              Fig. {String(n).padStart(2, "0")}
            </span>
          )}
        </div>
        <p className="datum text-[11.5px] text-[var(--muted)] leading-[1.55] max-w-[80ch]">
          {sub}
        </p>

        {legend && legend.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 mb-1">
            {legend.map((l) => (
              <span
                key={l.name}
                className="ui inline-flex items-center gap-2.5 text-[13px] font-[520] text-[var(--ink-2)]"
              >
                <span
                  className="w-[16px] h-[3px] shrink-0"
                  style={{ background: `var(${l.colorVar})` }}
                />
                {l.name}
              </span>
            ))}
          </div>
        )}

        {children}

        {table && (
          <details className="mt-4 group">
            <summary className="label label-quiet hover:text-[var(--brand)] cursor-pointer py-2 w-fit list-none flex items-center gap-2 text-[11px]">
              <span className="transition-transform group-open:rotate-90" aria-hidden="true">
                ▸
              </span>
              Show the numbers
            </summary>
            <div className="overflow-x-auto mt-3">{table}</div>
          </details>
        )}

        {caption && (
          <figcaption className="text-[14.5px] leading-[1.6] text-[var(--ink-2)] mt-5 pt-4 border-t border-[var(--rule)] max-w-[74ch]">
            {caption}
          </figcaption>
        )}

        {embedSlug && (
          <div className="border-t border-[var(--rule)] mt-4 pt-1">
            <EmbedButton slug={embedSlug} title={title} />
          </div>
        )}

        {technical && technical.length > 0 && (
          <details className="border-t border-[var(--rule)] mt-4 group">
            <summary className="label label-quiet hover:text-[var(--brand)] cursor-pointer py-4 w-fit list-none flex items-center gap-2 text-[11px]">
              <span className="transition-transform group-open:rotate-90" aria-hidden="true">
                ▸
              </span>
              The technical detail
            </summary>
            <div className="text-[15px] text-[var(--ink-2)] pb-3 space-y-3.5">
              {technical.map((t, i) => (
                <p key={i} className="max-w-[72ch] leading-[1.6]">
                  {t}
                </p>
              ))}
            </div>
          </details>
        )}
      </figure>
    </Reveal>
  );
}

/** A plain data table used inside Figure's disclosure. */
export function DataTable({
  head,
  rows,
}: {
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="border-collapse text-[13px] tnum min-w-full font-mono">
      <thead>
        <tr>
          {head.map((h) => (
            <th
              key={h}
              className="text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)] font-semibold text-right first:text-left pr-4 pb-2 border-b border-[var(--rule-strong)] whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-[var(--surface-2)]">
            {r.map((c, j) => (
              <td
                key={j}
                className="text-right first:text-left pr-4 py-1.5 border-b border-[var(--rule)] whitespace-nowrap"
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
