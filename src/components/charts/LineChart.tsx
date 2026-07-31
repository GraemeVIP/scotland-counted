"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type LineSeries = {
  name: string;
  colorVar: string;
  data: number[];
};

type Props = {
  x: string[];
  series: LineSeries[];
  yMin: number;
  yMax: number;
  yTicks: number[];
  /** Prefix or suffix applied to axis ticks and tooltip values. */
  unit?: string;
  decimals?: number;
  /** Shade the area between the first two series. */
  gapBand?: boolean;
  /** Index from which the data is unreliable; drawn dotted and shaded. */
  provisionalFrom?: number;
  provisionalLabel?: string;
  /** Extra tooltip row, e.g. a headcount. Serialisable so it can cross the server/client boundary. */
  extra?: { label: string; values: string[] };
  ariaLabel: string;
};

function readVar(name: string) {
  if (typeof window === "undefined") return "#888";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}

export default function LineChart({
  x,
  series,
  yMin,
  yMax,
  yTicks,
  unit = "",
  decimals = 1,
  gapBand = false,
  provisionalFrom,
  provisionalLabel = "unreliable",
  extra,
  ariaLabel,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [themeTick, setThemeTick] = useState(0);
  const [drawn, setDrawn] = useState(false);
  /** Once the draw-in has had its moment, drop the dash entirely so a
   *  suspended transition can never leave a line invisible. */
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(() => setW(host.clientWidth));
    ro.observe(host);
    setW(host.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(host);
    // Safety net: a chart must never stay invisible because an
    // animation did not run. Timers fire even when rAF is suspended.
    const settle = setTimeout(() => setDrawn(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(settle);
    };
  }, [w]);

  useEffect(() => {
    if (!drawn) return;
    const t = setTimeout(() => setSettled(true), 1900);
    return () => clearTimeout(t);
  }, [drawn]);

  useEffect(() => {
    const bump = () => setThemeTick((t) => t + 1);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", bump);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      mq.removeEventListener("change", bump);
      mo.disconnect();
    };
  }, []);

  const fmt = useCallback(
    (v: number) => (unit === "£" ? `£${v.toFixed(decimals)}` : `${v.toFixed(decimals)}${unit}`),
    [unit, decimals]
  );

  if (!w) return <div ref={hostRef} className="min-h-[240px]" />;

  const narrow = w < 500;
  const h = Math.max(230, Math.min(360, Math.round(w * (narrow ? 0.72 : 0.5))));
  const m = { t: 14, r: narrow ? 10 : 48, b: 30, l: narrow ? 38 : 46 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const n = x.length;

  const grid = readVar("--grid");
  const baseline = readVar("--baseline");
  const muted = readVar("--muted");
  const surface = readVar("--surface");
  const ink = readVar("--ink");
  const rule = readVar("--rule");
  void themeTick;

  const X = (i: number) => m.l + (n === 1 ? iw / 2 : (iw * i) / (n - 1));
  const Y = (v: number) => m.t + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const pf = provisionalFrom !== undefined && provisionalFrom < n - 1 ? provisionalFrom : -1;
  const labelAt = pf >= 0 ? pf : n - 1;

  const step = narrow ? Math.ceil(n / 4) : Math.ceil(n / 9);
  const xTickIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i % step !== 0 && i !== n - 1) continue;
    if (i !== n - 1 && n - 1 - i < step * 0.6) continue;
    xTickIdx.push(i);
  }

  /** Length of a path segment, so the draw-in animation has a dash to run. */
  function pathLength(s: LineSeries, from: number, to: number) {
    let total = 0;
    for (let i = from; i < to; i++) {
      total += Math.hypot(X(i + 1) - X(i), Y(s.data[i + 1]) - Y(s.data[i]));
    }
    return Math.ceil(total) + 8;
  }

  function path(s: LineSeries, from: number, to: number) {
    let d = "";
    for (let i = from; i <= to; i++) d += `${i === from ? "M" : "L"}${X(i)} ${Y(s.data[i])}`;
    return d;
  }

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * w;
    const idx = Math.max(0, Math.min(n - 1, Math.round(((px - m.l) / iw) * (n - 1))));
    setHover(idx);
  }

  return (
    <div ref={hostRef} className="relative mt-1.5">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label={ariaLabel}
        className="block w-full h-auto touch-pan-y"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={m.l}
              x2={m.l + iw}
              y1={Y(t)}
              y2={Y(t)}
              stroke={t === yMin ? baseline : grid}
              strokeWidth={1}
            />
            <text
              x={m.l - 7}
              y={Y(t) + 4}
              textAnchor="end"
              fill={muted}
              fontSize={narrow ? 10 : 11}
              fontFamily="var(--font-mono)"
            >
              {unit === "£" ? `£${t}` : `${t}${unit}`}
            </text>
          </g>
        ))}

        {xTickIdx.map((i) => (
          <text
            key={i}
            x={X(i)}
            y={h - 10}
            textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
            fill={muted}
            fontSize={narrow ? 10 : 11}
            fontFamily="var(--font-mono)"
          >
            {x[i]}
          </text>
        ))}

        {gapBand && series.length >= 2 && (
          <polygon
            points={[
              ...series[0].data.map((v, i) => `${X(i)},${Y(v)}`),
              ...series[1].data.map((v, i) => `${X(n - 1 - i)},${Y(series[1].data[n - 1 - i])}`),
            ].join(" ")}
            fill={readVar(series[0].colorVar)}
            opacity={0.09}
          />
        )}

        {pf >= 0 && (
          <>
            <rect
              x={X(pf)}
              y={m.t}
              width={m.l + iw - X(pf)}
              height={ih}
              fill={muted}
              opacity={0.08}
            />
            {!narrow && (
              <text
                x={X(pf) + 5}
                y={m.t + 11}
                fill={muted}
                fontSize={10.5}
                fontFamily="var(--font-mono)"
              >
                {provisionalLabel}
              </text>
            )}
          </>
        )}

        {series.map((s) => {
          const col = readVar(s.colorVar);
          return (
            <g key={s.name}>
              {pf >= 0 ? (
                <>
                  <path
                    d={path(s, 0, pf)}
                    fill="none"
                    stroke={col}
                    strokeWidth={2.25}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className={settled ? undefined : `draw ${drawn ? "in" : ""}`}
                    style={settled ? undefined : { ["--len" as string]: pathLength(s, 0, pf) }}
                  />
                  <path
                    d={path(s, pf, n - 1)}
                    fill="none"
                    stroke={col}
                    strokeWidth={2.25}
                    strokeDasharray="2 4"
                    opacity={drawn ? 0.55 : 0}
                    strokeLinecap="round"
                    style={{ transition: "opacity 0.6s 1.1s" }}
                  />
                </>
              ) : (
                <path
                  d={path(s, 0, n - 1)}
                  fill="none"
                  stroke={col}
                  strokeWidth={2.25}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={settled ? undefined : `draw ${drawn ? "in" : ""}`}
                  style={settled ? undefined : { ["--len" as string]: pathLength(s, 0, n - 1) }}
                />
              )}
              <g
                style={{
                  opacity: drawn ? 1 : 0,
                  transition: "opacity 0.5s 1.2s",
                }}
              >
                <circle cx={X(labelAt)} cy={Y(s.data[labelAt])} r={5.5} fill={surface} />
                <circle cx={X(labelAt)} cy={Y(s.data[labelAt])} r={4} fill={col} />
                {!narrow && (
                  <text
                    x={pf >= 0 ? X(labelAt) - 9 : X(labelAt) + 9}
                    y={Y(s.data[labelAt]) + 4}
                    textAnchor={pf >= 0 ? "end" : "start"}
                    fill={ink}
                    fontSize={13}
                    fontWeight={700}
                    fontFamily="var(--font-sans)"
                  >
                    {s.data[labelAt].toFixed(decimals)}
                  </text>
                )}
              </g>
            </g>
          );
        })}

        {hover !== null && (
          <>
            <line x1={X(hover)} x2={X(hover)} y1={m.t} y2={m.t + ih} stroke={baseline} strokeWidth={1} />
            {series.map((s) => (
              <g key={`h-${s.name}`}>
                <circle cx={X(hover)} cy={Y(s.data[hover])} r={6} fill={surface} />
                <circle cx={X(hover)} cy={Y(s.data[hover])} r={4.5} fill={readVar(s.colorVar)} />
              </g>
            ))}
          </>
        )}
      </svg>

      {hover !== null && (() => {
        const pct = (X(hover) / w) * 100;
        const flip = pct > 58;
        return (
        <div
          className="glossbox pointer-events-none"
          style={{
            top: `${(m.t / h) * 100}%`,
            left: flip ? undefined : `calc(${pct}% + 14px)`,
            right: flip ? `calc(${100 - pct}% + 14px)` : undefined,
            minWidth: 150,
            maxWidth: 230,
          }}
          role="status"
        >
          <div className="ui text-[11px] uppercase tracking-[0.1em] font-[620] text-[var(--muted)] mb-1.5">
            {x[hover]}
          </div>
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-2 whitespace-nowrap">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: readVar(s.colorVar) }}
              />
              <span className="text-[13px]">{s.name}</span>
              <b className="ml-auto tnum text-[13px] font-semibold text-[var(--ink)]">
                {fmt(s.data[hover])}
              </b>
            </div>
          ))}
          {extra && extra.values[hover] !== undefined && (
            <div
              className="flex items-center gap-2 mt-1.5 pt-1.5 text-[12px] text-[var(--muted)]"
              style={{ borderTop: `1px solid ${rule}` }}
            >
              {extra.label}
              <b className="ml-auto tnum">{extra.values[hover]}</b>
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}
