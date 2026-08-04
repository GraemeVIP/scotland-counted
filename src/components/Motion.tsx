"use client";

import { useEffect, useState } from "react";

/**
 * Formats a number without animating through false interim values.
 */
export function CountUp({
  value,
  decimals = 1,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {prefix}
      {value.toLocaleString("en-GB", {
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
 * The bare grid of figures, pure and controlled, no animation of its
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
            {/* Body: domed shoulders, softly squared base, reads cleanly at 10px */}
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

/** A static proportion: the picture is truthful from the first paint. */
export function Pictogram({
  filled,
  total = 100,
  columns = 20,
  label,
  litColor,
}: {
  filled: number;
  total?: number;
  columns?: number;
  label: string;
  /** Overrides the highlight colour so a pictogram can match its own stat. */
  litColor?: string;
}) {
  return (
    <div role="img" aria-label={label}>
      <PictoGrid lit={filled} total={total} columns={columns} litColor={litColor} />
    </div>
  );
}
