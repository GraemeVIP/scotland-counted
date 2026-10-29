import type { ReactNode } from "react";

/**
 * A plain figures table for guide pages: rates, dates, phone numbers.
 *
 * Same frame as the council tables in the long reads, so a guide and an
 * investigation look like one site. Wide tables scroll inside the frame on a
 * phone rather than pushing the page sideways.
 */
export function GuideTable({
  kicker,
  title,
  columns,
  rows,
  caption,
  align,
}: {
  kicker?: string;
  title: string;
  columns: string[];
  rows: ReactNode[][];
  caption?: ReactNode;
  /** Per column. Numbers read best right aligned. */
  align?: Array<"left" | "right">;
}) {
  const side = (i: number) => (align?.[i] === "right" ? "text-right" : "text-left");
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--rule)] pb-4">
        {kicker && <p className="ui text-[15px] font-[600] text-[var(--brand)]">{kicker}</p>}
        <h3 className="mt-1 text-[21px] font-[600] leading-[1.25]">{title}</h3>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[15.5px] tnum">
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th key={column} className={`border-b-2 border-[var(--ink)] pb-2 pr-4 last:pr-0 font-[580] ${side(i)}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`border-b border-[var(--rule)] py-2.5 pr-4 last:pr-0 align-top ${side(i)} ${i === 0 ? "font-[540]" : "text-[var(--ink-2)]"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">{caption}</figcaption>
      )}
    </figure>
  );
}
