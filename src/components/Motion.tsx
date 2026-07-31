"use client";

import { useEffect, useRef, useState } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fires once when the element first scrolls into view. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, seen };
}

/**
 * Counts a number up when it enters view. The final value is rendered
 * server-side, so the real figure is always in the HTML for search
 * engines and for anyone without JavaScript.
 */
export function CountUp({
  value,
  decimals = 1,
  prefix = "",
  suffix = "",
  duration = 1300,
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, seen } = useInView<HTMLSpanElement>();
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!seen) return;
    if (reduced()) return;
    let raf = 0;
    const start = performance.now();
    const from = value * 0.35;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutExpo — fast off the mark, settles precisely
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(from + (value - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(null);
    };
    raf = requestAnimationFrame(tick);
    // If the tab is backgrounded mid-count, rAF stops and the figure
    // would freeze part-way. Timers still run, so snap to the truth.
    const settle = setTimeout(() => setN(null), duration + 700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [seen, value, duration]);

  const shown = n === null ? value : n;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/** A thin progress bar showing how far through the page the reader is. */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="progress no-print"
      style={{ width: "100%", transform: `scaleX(${p})` }}
      aria-hidden="true"
    />
  );
}

/**
 * A hundred figures, of which `filled` are highlighted. The oldest and
 * plainest way to show a proportion, and the one people read fastest.
 */
export function Pictogram({
  filled,
  total = 100,
  columns = 20,
  label,
}: {
  filled: number;
  total?: number;
  columns?: number;
  label: string;
}) {
  const { ref, seen } = useInView<HTMLDivElement>("0px");

  /**
   * Starts at the true value, so the correct proportion is in the HTML
   * even if the animation never runs — a background tab suspends
   * requestAnimationFrame, and a chart that silently shows zero would
   * be worse than no animation at all.
   */
  const [lit, setLit] = useState(filled);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduced()) return;
    setLit(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || !seen) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setLit(Math.round(filled * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLit(filled);
    };
    raf = requestAnimationFrame(tick);
    // Timers still fire when rAF is suspended, so the figure always lands.
    const settle = setTimeout(() => setLit(filled), dur + 900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [armed, seen, filled]);

  const rows = Math.ceil(total / columns);
  const cw = 10;
  const ch = 22;

  return (
    <div ref={ref} role="img" aria-label={label}>
      <svg
        viewBox={`0 0 ${columns * cw} ${rows * ch}`}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {Array.from({ length: total }, (_, i) => {
          const col = i % columns;
          const row = Math.floor(i / columns);
          const x = col * cw + cw / 2;
          const y = row * ch + 2;
          const on = i < lit;
          return (
            <g
              key={i}
              className="pict"
              style={{
                fill: on ? "var(--action)" : "var(--rule-strong)",
                opacity: on ? 1 : 0.6,
              }}
            >
              <circle cx={x} cy={y + 3.4} r={2.9} />
              <path
                d={`M${x - 3.3} ${y + 8}
                   a3.3 3.3 0 0 1 6.6 0
                   l0 6.2
                   a0.9 0.9 0 0 1 -1.8 0
                   l0 -3.6
                   l-0.7 0 l0 8.4
                   a1 1 0 0 1 -2 0 l0 -5 l-0.8 0 l0 5
                   a1 1 0 0 1 -2 0 l0 -8.4 l-0.7 0 l0 3.6
                   a0.9 0.9 0 0 1 -1.8 0 z`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
