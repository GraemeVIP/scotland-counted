"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getTerm } from "@/lib/data/glossary";
import { annotateNode, normaliseTermText, termPatternSource } from "@/components/glossaryAnnotate";

/**
 * An inline term the reader can tap for a plain explanation.
 * Keyboard accessible, dismissable with Escape or an outside click,
 * and it repositions itself to stay on screen.
 */
/* Set inside a glossary term, so a term can never be wrapped in a second one. */
const InsideTerm = createContext(false);

export function G({ t, children }: { t: string; children: ReactNode }) {
  const nested = useContext(InsideTerm);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const instanceId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const closeDelayRef = useRef<number | null>(null);
  const interactionRef = useRef<"hover" | "click" | null>(null);
  const suppressFocusOpenRef = useRef(false);
  const term = getTerm(t);
  const tooltipId = `glossary-${term?.id ?? "term"}-${instanceId.replace(/:/g, "")}`;

  function cancelClose() {
    if (closeDelayRef.current !== null) {
      window.clearTimeout(closeDelayRef.current);
      closeDelayRef.current = null;
    }
  }

  function scheduleClose() {
    if (interactionRef.current === "click") return;
    cancelClose();
    closeDelayRef.current = window.setTimeout(() => {
      interactionRef.current = null;
      setOpen(false);
    }, 220);
  }

  function openFromHover() {
    if (interactionRef.current === "click") return;
    interactionRef.current = "hover";
    cancelClose();
    setOpen(true);
  }

  const closeTooltip = useCallback((restoreFocus = false) => {
    if (closeDelayRef.current !== null) {
      window.clearTimeout(closeDelayRef.current);
      closeDelayRef.current = null;
    }
    if (restoreFocus) suppressFocusOpenRef.current = true;
    interactionRef.current = null;
    setPos(null);
    setOpen(false);
  }, []);

  function openFromFocus() {
    if (suppressFocusOpenRef.current) {
      suppressFocusOpenRef.current = false;
      return;
    }
    openFromHover();
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
      let left = r.left;
      const maxLeft = window.innerWidth - bw - 12;
      if (left > maxLeft) left = maxLeft;
      if (left < 12) left = 12;
      let top = r.bottom + 8;
      if (r.bottom + bh + 16 > window.innerHeight && r.top > bh + 16) {
        top = r.top - bh - 8;
      }
      setPos({ top, left });
    }
    place();
    const close = () => {
      closeTooltip();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTooltip(true);
        btnRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        closeTooltip();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      cancelClose();
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close);
    };
  }, [closeTooltip, open]);

  if (!term || nested) return <>{children}</>;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="gl"
        aria-expanded={open}
        aria-controls={open ? tooltipId : undefined}
        aria-haspopup="dialog"
        onMouseEnter={openFromHover}
        onMouseLeave={scheduleClose}
        onFocus={openFromFocus}
        onBlur={scheduleClose}
        aria-label={`${typeof children === "string" ? children : term.term}, what this means`}
        onClick={(e) => {
          e.stopPropagation();
          cancelClose();
          if (interactionRef.current === "click") {
            closeTooltip();
            return;
          }
          interactionRef.current = "click";
          setOpen(true);
        }}
      >
        <InsideTerm.Provider value={true}>{children}</InsideTerm.Provider>
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <span
              ref={boxRef}
              id={tooltipId}
              role="dialog"
              aria-labelledby={`${tooltipId}-title`}
              aria-describedby={`${tooltipId}-description`}
              className="glossbox"
              style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute top-1.5 right-2 text-[var(--muted)] hover:text-[var(--ink)] text-[17px] leading-none p-1"
                onClick={() => {
                  closeTooltip(true);
                  btnRef.current?.focus();
                }}
              >
                &times;
              </button>
              <span id={`${tooltipId}-title`} className="ui block text-[15px] font-[560] text-[var(--brand)] mb-1.5">
                {term.term}
              </span>
              <span id={`${tooltipId}-description`} className="block text-[var(--ink)]">{term.def}</span>
            </span>,
            document.body,
          )
        : null}
    </>
  );
}

/**
 * Adds an in-context explanation to technical words in shared prose blocks.
 * Authors can still use <G> when a particular term needs a deliberate label.
 */
export function ExplainText({ children }: { children: ReactNode }) {
  return <>{annotateNode(children, "glossary", G)}</>;
}

const COUNCIL_TERM_IDS = [
  "inflation",
  "claimant-count",
  "ashe",
  "paye",
  "gross-pay",
  "net-pay",
  "national-insurance",
  "eligible",
  "eligibility",
  "entitlement",
  "discretionary",
  "housing-element",
  "benefit-cap",
  "bedroom-tax",
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
  "forecast",
  "allocation",
  "provisional",
  "capital-programme",
  "revenue-budget",
  "regulator",
  "audit-finding",
  "independent-scrutiny",
  "commitment",
  "medium-term-financial-plan",
  "performance-framework",
  "service-level",
  "accountability",
  "scrutiny",
  "statutory",
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
}).sort((a, b) => b.term.length - a.term.length);

const councilTermPattern = new RegExp(
  "\\b(" + councilTerms.map((term) => termPatternSource(term.term)).join("|") + ")\\b",
  "gi",
);

/** Adds plain English help to the technical words used on council pages. */
export function PlainText({ text }: { text: string }) {
  if (!text) return null;

  return (
    <>
      {text.split(councilTermPattern).map((part, index) => {
        const term = councilTerms.find((candidate) => normaliseTermText(candidate.term) === normaliseTermText(part));
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
