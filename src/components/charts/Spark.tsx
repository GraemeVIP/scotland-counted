"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A sparkline for index cards: the whole series in miniature, drawing
 * itself in as the card scrolls into view. Decorative reinforcement of
 * the card text, so it is hidden from assistive tech, the real chart
 * with a data table lives one click away.
 */
export default function Spark({
  data,
  colorVar = "--glasgow",
  height = 44,
}: {
  data: number[];
  colorVar?: string;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const show = window.setTimeout(() => {
        setDrawn(true);
        setSettled(true);
      }, 0);
      return () => window.clearTimeout(show);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    // Correct-by-default: timers fire even when rAF and IO are suspended.
    const a = setTimeout(() => setDrawn(true), 2200);
    const b = setTimeout(() => setSettled(true), 3600);
    return () => {
      io.disconnect();
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (!drawn) return;
    const t = setTimeout(() => setSettled(true), 1300);
    return () => clearTimeout(t);
  }, [drawn]);

  const W = 220;
  const H = 52;
  const pad = 5;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const X = (i: number) => pad + ((W - pad * 2) * i) / (data.length - 1);
  const Y = (v: number) => H - pad - ((v - min) / span) * (H - pad * 2);

  let d = "";
  let len = 0;
  for (let i = 0; i < data.length; i++) {
    d += `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(data[i]).toFixed(1)}`;
    if (i) len += Math.hypot(X(i) - X(i - 1), Y(data[i]) - Y(data[i - 1]));
  }
  len = Math.ceil(len) + 6;

  return (
    <div ref={ref} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} className="block">
        <line
          x1={pad}
          x2={W - pad}
          y1={H - pad}
          y2={H - pad}
          stroke="var(--rule)"
          strokeWidth={1}
        />
        <path
          d={d}
          fill="none"
          stroke={`var(${colorVar})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={settled ? undefined : `draw ${drawn ? "in" : ""}`}
          style={settled ? undefined : { ["--len" as string]: len }}
        />
        <circle
          cx={X(data.length - 1)}
          cy={Y(data[data.length - 1])}
          r={3}
          fill={`var(${colorVar})`}
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.4s 1.2s" }}
        />
      </svg>
    </div>
  );
}
