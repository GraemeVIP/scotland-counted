"use client";

import Image from "next/image";
import { useId, useState } from "react";

export type CompareShot = {
  src: string;
  alt: string;
  /** Short name shown on the picture, e.g. "Causeway's template". */
  label: string;
  /** The real web address, shown in a little address bar above the picture. */
  url: string;
};

/**
 * Two screenshots of the same size, compared two ways: drag a line across to
 * reveal one over the other, or see them next to each other. Built for people
 * who have never used a "slide to compare" before, so the buttons say exactly
 * what they do.
 */
export default function RevealCompare({
  left,
  right,
  width,
  height,
  title,
  caption,
}: {
  left: CompareShot;
  right: CompareShot;
  width: number;
  height: number;
  title: string;
  caption?: string;
}) {
  const id = useId();
  const [mode, setMode] = useState<"slide" | "side">("slide");
  const [pos, setPos] = useState(50);

  return (
    <figure className="my-8 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule-strong)] bg-[var(--surface)]">
      <div className="border-b border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3">
        <p className="ui text-[16px] font-[700] leading-[1.35] text-[var(--ink)]">{title}</p>
        <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="How to compare">
          <button
            type="button"
            onClick={() => setMode("slide")}
            aria-pressed={mode === "slide"}
            className={`btn ${mode === "slide" ? "btn-primary" : "btn-ghost"} min-h-[40px] px-3.5 text-[14.5px]`}
          >
            Slide to compare
          </button>
          <button
            type="button"
            onClick={() => setMode("side")}
            aria-pressed={mode === "side"}
            className={`btn ${mode === "side" ? "btn-primary" : "btn-ghost"} min-h-[40px] px-3.5 text-[14.5px]`}
          >
            Side by side
          </button>
        </div>
      </div>

      {mode === "slide" ? (
        <div className="px-3 py-4 sm:px-6">
          <div className="mx-auto max-w-[420px]">
            <AddressBar left={left} right={right} pos={pos} />
            <div
              className="relative select-none overflow-hidden rounded-b-[12px] border border-t-0 border-[var(--rule-strong)]"
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              <Image
                src={right.src}
                alt={right.alt}
                width={width}
                height={height}
                sizes="420px"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                aria-hidden={pos === 0}
              >
                <Image
                  src={left.src}
                  alt={left.alt}
                  width={width}
                  height={height}
                  sizes="420px"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
              <Tag side="left" text={left.label} />
              <Tag side="right" text={right.label} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[var(--bad-text)]"
                style={{ left: `${pos}%` }}
              >
                <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-[var(--bad-text)] text-[18px] font-[800] text-white shadow-lg">
                  ⇆
                </span>
              </div>
              <label htmlFor={`${id}-range`} className="sr-only">
                Drag to compare {left.label} with {right.label}
              </label>
              <input
                id={`${id}-range`}
                type="range"
                min={0}
                max={100}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPos(100)}
                className="btn btn-ghost min-h-[40px] justify-center px-2 text-[14px]"
              >
                Show {left.label}
              </button>
              <button
                type="button"
                onClick={() => setPos(0)}
                className="btn btn-ghost min-h-[40px] justify-center px-2 text-[14px]"
              >
                Show {right.label}
              </button>
            </div>
            <p className="ui mt-2 text-center text-[13.5px] text-[var(--ink-2)]">
              Drag the red line left and right, or tap a button.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-2 py-4 sm:gap-4 sm:px-6">
          {[left, right].map((shot) => (
            <div key={shot.src}>
              <p className="ui mb-1.5 text-[13px] font-[700] text-[var(--ink)] sm:text-[14.5px]">
                {shot.label}
              </p>
              <p className="ui mb-1.5 break-all rounded-[6px] leading-snug bg-[var(--surface-2)] px-2 py-1 text-[11px] text-[var(--ink-2)] sm:text-[12.5px]">
                {shot.url}
              </p>
              <Image
                src={shot.src}
                alt={shot.alt}
                width={width}
                height={height}
                sizes="(min-width: 640px) 340px, 48vw"
                className="h-auto w-full rounded-[8px] border border-[var(--rule-strong)]"
              />
            </div>
          ))}
        </div>
      )}

      {caption && (
        <figcaption className="ui border-t border-[var(--rule)] px-4 py-3 text-[14px] leading-[1.5] text-[var(--ink-2)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Tag({ side, text }: { side: "left" | "right"; text: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-3 ${side === "left" ? "left-3" : "right-3"} max-w-[45%] rounded-full bg-black/75 px-2.5 py-1 text-[12.5px] font-[700] leading-tight text-white`}
    >
      {text}
    </span>
  );
}

function AddressBar({ left, right, pos }: { left: CompareShot; right: CompareShot; pos: number }) {
  // Show the address of whichever picture covers more of the frame.
  const shot = pos >= 50 ? left : right;
  return (
    <div className="ui flex items-center gap-2 rounded-t-[12px] border border-[var(--rule-strong)] bg-[var(--surface-2)] px-3 py-2">
      <span aria-hidden="true" className="flex gap-1">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </span>
      <span className="min-w-0 flex-1 break-all rounded-[6px] leading-snug bg-[var(--surface)] px-2 py-1 text-[12.5px] text-[var(--ink-2)]">
        {shot.url}
      </span>
    </div>
  );
}
