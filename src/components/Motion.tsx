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
 * The bare grid of figures — pure and controlled, no animation of its
 * own. `lit` figures take litColor; the rest take dimColor.
 */
export function PictoGrid({
  lit,
  total = 100,
  columns = 20,
  litColor = "var(--action)",
  dimColor = "var(--rule-strong)",
  dimOpacity = 0.6,
}: {
  lit: number;
  total?: number;
  columns?: number;
  litColor?: string;
  dimColor?: string;
  dimOpacity?: number;
}) {
  const rows = Math.ceil(total / columns);
  const cw = 9.6;
  const ch = 19;

  return (
    <svg
      viewBox={`0 0 ${columns * cw} ${rows * ch}`}
      className="w-full h-auto overflow-visible"
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const x = col * cw + cw / 2;
        const y = row * ch + 1.5;
        const on = i < lit;
        return (
          <g
            key={i}
            className="pict"
            style={{ fill: on ? litColor : dimColor, opacity: on ? 1 : dimOpacity }}
          >
            {/* Head */}
            <circle cx={x} cy={y + 3} r={2.55} />
            {/* Body: domed shoulders, softly squared base — reads cleanly at 10px */}
            <path
              d={`M${x - 3.15} ${y + 15.4}
                  V${y + 10.6}
                  a3.15 3.15 0 0 1 6.3 0
                  V${y + 15.4}
                  a1.15 1.15 0 0 1 -1.15 1.15
                  h-4
                  a1.15 1.15 0 0 1 -1.15 -1.15
                  Z`}
            />
          </g>
        );
      })}
    </svg>
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
    const raf = requestAnimationFrame(() => {
      setLit(0);
      setArmed(true);
    });
    return () => cancelAnimationFrame(raf);
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

  return (
    <div ref={ref} role="img" aria-label={label}>
      <PictoGrid lit={lit} total={total} columns={columns} />
    </div>
  );
}
