"use client";

import { useEffect, useRef, useState } from "react";
import { getTerm } from "@/lib/data/glossary";

/**
 * An inline term the reader can tap for a plain explanation.
 * Keyboard accessible, dismissable with Escape or an outside click,
 * and it repositions itself to stay on screen.
 */
export function G({ t, children }: { t: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeDelayRef = useRef<number | null>(null);
  const openedByClickRef = useRef(false);
  const term = getTerm(t);

  function cancelClose() {
    if (closeDelayRef.current !== null) {
      window.clearTimeout(closeDelayRef.current);
      closeDelayRef.current = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeDelayRef.current = window.setTimeout(() => setOpen(false), 220);
  }

  function openFromHover() {
    openedByClickRef.current = false;
    cancelClose();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function place() {
      const btn = btnRef.current;
      const box = boxRef.current;
      if (!btn || !box) return;
      const r = btn.getBoundingClientRect();
      const bw = box.offsetWidth;
      const bh = box.offsetHeight;
      let left = r.left + window.scrollX;
      const maxLeft = window.scrollX + document.documentElement.clientWidth - bw - 12;
      if (left > maxLeft) left = maxLeft;
      if (left < window.scrollX + 12) left = window.scrollX + 12;
      let top = r.bottom + window.scrollY + 8;
      if (r.bottom + bh + 16 > window.innerHeight && r.top > bh + 16) {
        top = r.top + window.scrollY - bh - 8;
      }
      setPos({ top, left });
    }
    place();
    const focusTimer = openedByClickRef.current
      ? window.setTimeout(() => closeRef.current?.focus(), 0)
      : null;
    openedByClickRef.current = false;
    const close = () => {
      cancelClose();
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      if (focusTimer !== null) window.clearTimeout(focusTimer);
      cancelClose();
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close);
    };
  }, [open]);

  if (!term) return <>{children}</>;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="gl"
        aria-expanded={open}
        aria-controls={open ? `glossary-${term.id}` : undefined}
        aria-haspopup="dialog"
        onMouseEnter={openFromHover}
        onMouseLeave={scheduleClose}
        aria-label={`${typeof children === "string" ? children : term.term} — what this means`}
        onClick={(e) => {
          e.stopPropagation();
          openedByClickRef.current = true;
          cancelClose();
          setOpen((o) => !o);
        }}
      >
        {children}
      </button>
      {open && (
        <span
          ref={boxRef}
          id={`glossary-${term.id}`}
          role="dialog"
          aria-labelledby={`glossary-${term.id}-title`}
          aria-describedby={`glossary-${term.id}-description`}
          className="glossbox"
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            className="absolute top-1.5 right-2 text-[var(--muted)] hover:text-[var(--ink)] text-[17px] leading-none p-1"
            onClick={() => {
              setOpen(false);
              btnRef.current?.focus();
            }}
          >
            &times;
          </button>
          <span id={`glossary-${term.id}-title`} className="ui block text-[15px] font-[680] text-[var(--brand)] mb-1.5">
            {term.term}
          </span>
          <span id={`glossary-${term.id}-description`} className="block text-[var(--ink)]">{term.def}</span>
          {term.tech && (
            <span className="mt-2.5 block border-t border-[var(--rule)] pt-2.5 text-[15px]">
              {term.tech}
            </span>
          )}
        </span>
      )}
    </>
  );
}

const COUNCIL_TERM_IDS = [
  "budget-gap",
  "shortfall",
  "projected",
  "outturn",
  "reserves",
  "overspend",
  "best-value",
  "transformation",
  "service-target",
  "funding-allocation",
  "provisional",
  "capital-programme",
  "revenue-budget",
  "regulator",
  "audit-finding",
  "independent-scrutiny",
  "commitment",
  "medium-term-financial-plan",
  "performance-framework",
  "denominator",
  "statutory-duty",
  "systemic-failure",
  "strategic-plan",
  "financial-outlook",
  "service-reform",
  "capital-plan",
  "general-fund",
  "cumulative",
  "like-for-like",
  "primary-source",
] as const;

const councilTerms = COUNCIL_TERM_IDS.flatMap((id) => {
  const term = getTerm(id);
  return term ? [term] : [];
});

const councilTermPattern = new RegExp(
  "\\b(" + councilTerms.map((term) => term.term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|") + ")\\b",
  "gi",
);

/** Adds plain-English help to the technical words used on council pages. */
export function PlainText({ text }: { text: string }) {
  if (!text) return null;

  return (
    <>
      {text.split(councilTermPattern).map((part, index) => {
        const term = councilTerms.find((candidate) => candidate.term.toLowerCase() === part.toLowerCase());
        return term ? (
          <G key={term.id + "-" + index} t={term.id}>
            {part}
          </G>
        ) : (
          part
        );
      })}
    </>
  );
}
