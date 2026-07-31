"use client";

import { useEffect, useRef, useState } from "react";

export type DumbbellRow = {
  name: string;
  slug?: string;
  from: number;
  to: number;
  highlight?: boolean;
};

function readVar(name: string) {
  if (typeof window === "undefined") return "#888";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}

/**
 * Every council area on one axis, drawn as a "then and now" barbell.
 * The whole point is that no area is cherry-picked: all 32 are shown.
 */
export default function Dumbbell({
  rows,
  xMin = 10,
  xMax = 38,
  ticks = [10, 15, 20, 25, 30, 35],
  fromLabel,
  toLabel,
  onSelect,
}: {
  rows: DumbbellRow[];
  xMin?: number;
  xMax?: number;
  ticks?: number[];
  fromLabel: string;
  toLabel: string;
  onSelect?: (slug: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(() => setW(host.clientWidth));
    ro.observe(host);
    setW(host.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", bump);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      mq.removeEventListener("change", bump);
      mo.disconnect();
    };
  }, []);

  if (!w) return <div ref={hostRef} className="min-h-[400px]" />;

  const narrow = w < 520;
  const labelW = narrow ? 118 : 168;
  const rowH = narrow ? 17 : 19;
  const m = { t: 26, r: narrow ? 14 : 54, b: 26, l: labelW };
  const h = m.t + rows.length * rowH + m.b;
  const iw = w - m.l - m.r;
  const X = (v: number) => m.l + ((v - xMin) / (xMax - xMin)) * iw;

  const grid = readVar("--grid");
  const muted = readVar("--muted");
  const surface = readVar("--surface");
  const ink = readVar("--ink");
  const cOld = readVar("--scotland");
  const cNew = readVar("--glasgow");

  return (
    <div ref={hostRef} className="relative mt-1.5">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label={`Every Scottish council area, showing child poverty in ${fromLabel} and ${toLabel}.`}
        className="block w-full h-auto"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={X(t)} x2={X(t)} y1={m.t - 6} y2={m.t + rows.length * rowH} stroke={grid} strokeWidth={1} />
            <text x={X(t)} y={12} textAnchor="middle" fill={muted} fontSize={narrow ? 10 : 11} fontFamily="var(--font-mono)">
              {t}%
            </text>
          </g>
        ))}

        {rows.map((r, i) => {
          const y = m.t + i * rowH + rowH / 2;
          const hi = r.highlight || hover === i;
          const rose = r.to > r.from;
          return (
            <g key={r.name}>
              <text
                x={labelW - 12}
                y={y + 4}
                textAnchor="end"
                fill={hi ? ink : readVar("--ink-2")}
                fontSize={narrow ? 10.5 : 12}
                fontWeight={hi ? 640 : 400}
              >
                {r.name}
              </text>
              <line
                x1={X(r.from)}
                x2={X(r.to)}
                y1={y}
                y2={y}
                stroke={rose ? cNew : muted}
                strokeWidth={hi ? 3 : 2}
                opacity={hi ? 1 : 0.5}
                strokeLinecap="round"
              />
              <circle cx={X(r.from)} cy={y} r={5.5} fill={surface} />
              <circle cx={X(r.from)} cy={y} r={4} fill={cOld} />
              <circle cx={X(r.to)} cy={y} r={5.5} fill={surface} />
              <circle cx={X(r.to)} cy={y} r={4} fill={cNew} />
              {!narrow && (
                <text
                  x={w - 6}
                  y={y + 4}
                  textAnchor="end"
                  fill={hi ? ink : muted}
                  fontSize={11.5}
                  fontWeight={hi ? 620 : 400}
                  fontFamily="var(--font-mono)"
                >
                  {r.to.toFixed(1)}%
                </text>
              )}
              <rect
                x={0}
                y={y - rowH / 2}
                width={w}
                height={rowH}
                fill="transparent"
                style={{ cursor: r.slug && onSelect ? "pointer" : "default" }}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onClick={() => r.slug && onSelect?.(r.slug)}
              />
            </g>
          );
        })}

        <circle cx={m.l + 4} cy={h - 11} r={4.5} fill={cOld} />
        <text x={m.l + 13} y={h - 7} fill={readVar("--ink-2")} fontSize={narrow ? 10.5 : 11.5} fontFamily="var(--font-mono)">
          {fromLabel}
        </text>
        <circle cx={m.l + (narrow ? 78 : 86)} cy={h - 11} r={4.5} fill={cNew} />
        <text x={m.l + (narrow ? 87 : 95)} y={h - 7} fill={readVar("--ink-2")} fontSize={narrow ? 10.5 : 11.5} fontFamily="var(--font-mono)">
          {toLabel}
        </text>
      </svg>

      {hover !== null && (
        <div
          className="glossbox pointer-events-none"
          style={{
            top: Math.max(2, m.t + hover * rowH - 46),
            left: Math.min(w - 190, X(Math.max(rows[hover].from, rows[hover].to)) + 16),
            minWidth: 168,
          }}
          role="status"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--muted)] mb-1.5">
            {rows[hover].name}
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cOld }} />
            {fromLabel}
            <b className="ml-auto tnum text-[var(--ink)]">{rows[hover].from.toFixed(1)}%</b>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cNew }} />
            {toLabel}
            <b className="ml-auto tnum text-[var(--ink)]">{rows[hover].to.toFixed(1)}%</b>
          </div>
          <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-[var(--rule)] text-[12px] text-[var(--muted)]">
            Change
            <b className="ml-auto tnum">
              {rows[hover].to - rows[hover].from >= 0 ? "+" : ""}
              {(rows[hover].to - rows[hover].from).toFixed(1)} pp
            </b>
          </div>
        </div>
      )}
    </div>
  );
}
