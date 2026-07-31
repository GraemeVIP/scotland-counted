import type { ReactNode } from "react";

/** The card every chart sits in: title, source line, legend, chart, caption. */
export default function Figure({
  title,
  sub,
  legend,
  children,
  caption,
  table,
  technical,
  className = "",
}: {
  title: string;
  sub: string;
  legend?: { name: string; colorVar: string }[];
  children: ReactNode;
  caption?: ReactNode;
  table?: ReactNode;
  technical?: string[];
  className?: string;
}) {
  return (
    <figure
      className={`bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-4 sm:p-5 pb-3 ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      <p className="text-[16px] font-[620] tracking-[-0.01em] mb-0.5">{title}</p>
      <p className="font-mono text-[11.5px] tracking-[0.04em] text-[var(--muted)] leading-[1.5]">
        {sub}
      </p>

      {legend && legend.length > 0 && (
        <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 mt-3 mb-1">
          {legend.map((l) => (
            <span key={l.name} className="inline-flex items-center gap-2 text-[13.5px] text-[var(--ink-2)]">
              <span
                className="w-[15px] h-[3px] rounded-sm shrink-0"
                style={{ background: `var(${l.colorVar})` }}
              />
              {l.name}
            </span>
          ))}
        </div>
      )}

      {children}

      {table && (
        <details className="mt-2.5">
          <summary className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer py-1 w-fit">
            Show data table
          </summary>
          <div className="overflow-x-auto mt-2.5">{table}</div>
        </details>
      )}

      {caption && (
        <figcaption className="font-mono text-[11.5px] leading-[1.55] text-[var(--muted)] mt-3 pt-2.5 border-t border-[var(--rule)] max-w-[78ch]">
          {caption}
        </figcaption>
      )}

      {technical && technical.length > 0 && (
        <details className="border-t border-[var(--rule)] mt-4 pt-1">
          <summary className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer py-2.5 w-fit">
            The technical detail
          </summary>
          <div className="text-[15px] text-[var(--ink-2)] pb-2 space-y-3">
            {technical.map((t, i) => (
              <p key={i} className="max-w-[68ch]">
                {t}
              </p>
            ))}
          </div>
        </details>
      )}
    </figure>
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
    <table className="border-collapse text-[13px] tnum min-w-full">
      <thead>
        <tr>
          {head.map((h) => (
            <th
              key={h}
              className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--muted)] font-normal text-right first:text-left pr-3 pb-1.5 border-b border-[var(--rule)] whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td
                key={j}
                className="text-right first:text-left pr-3 py-1 border-b border-[var(--rule)] whitespace-nowrap"
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
