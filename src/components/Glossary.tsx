"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { getTerm } from "@/lib/data/glossary";

/**
 * An inline term the reader can tap for a plain explanation.
 * Keyboard accessible, dismissable with Escape or an outside click,
 * and it repositions itself to stay on screen.
 */
export function G({ t, children }: { t: string; children: ReactNode }) {
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
        </span>
      )}
    </>
  );
}

/*
 * The site has two audiences: a reader who needs the short answer and a
 * reader who wants to check the method.  The short answer should still be
 * available when a post uses a technical word without an author remembering
 * to add a manual <G>.  This list deliberately contains terms that benefit
 * from help; ordinary words and proper names are left alone.
 */
const AUTO_GLOSSARY_IDS = [
  "ahc",
  "pp",
  "relative-poverty",
  "scp",
  "claimant",
  "claimant-count",
  "uc",
  "aps",
  "simd",
  "median",
  "constituency",
  "ward",
  "interim",
  "equivalised",
  "real-terms",
  "workres",
  "jobs-density",
  "freeze",
  "tcl",
  "lha",
  "lha-acronym",
  "dhp",
  "persistent",
  "saleleaseback",
  "reserved",
  "devolved",
  "dwp",
  "ons",
  "hmrc",
  "ofgem",
  "obr",
  "nao",
  "minimum-income-standard",
  "living-wage",
  "in-work-poverty",
  "work-allowance",
  "taper",
  "health-element",
  "absolute-poverty",
  "inflation",
  "eligible",
  "eligibility",
  "entitlement",
  "discretionary",
  "gross-pay",
  "net-pay",
  "national-insurance",
  "paye",
  "ashe",
  "housing-element",
  "benefit-cap",
  "bedroom-tax",
  "standing-charge",
  "kilowatt-hour",
  "kwh",
  "price-cap",
  "tax-code",
  "salary-sacrifice",
  "relief-at-source",
  "net-earnings",
  "gross-salary",
  "material-deprivation",
  "fiscal-drag",
  "settlement",
  "forecast",
  "allocation",
  "underspend",
  "estimate",
  "outcome",
  "milestone",
  "division",
  "motion",
  "qualifying",
  "means-tested",
  "arrears",
  "tariff",
  "council-tax-reduction",
  "water-charges-reduction",
  "benchmark",
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

const autoTerms = AUTO_GLOSSARY_IDS.flatMap((id) => {
  const term = getTerm(id);
  return term ? [term] : [];
}).sort((a, b) => b.term.length - a.term.length);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const termPatternSource = (value: string) => escapeRegex(value).replace(/\s+/g, "[\\s-]+");
const normaliseTermText = (value: string) => value.toLowerCase().replace(/[\s-]+/g, " ").trim();
const autoTermPattern = autoTerms.length
  ? new RegExp(`\\b(${autoTerms.map((term) => termPatternSource(term.term)).join("|")})\\b`, "gi")
  : null;

function annotateString(value: string, keyPrefix: string): ReactNode {
  if (!autoTermPattern || !value.trim()) return value;

  return value.split(autoTermPattern).map((part, index) => {
    const term = autoTerms.find((candidate) => normaliseTermText(candidate.term) === normaliseTermText(part));
    return term ? (
      <G key={`${keyPrefix}-${term.id}-${index}`} t={term.id}>
        {part}
      </G>
    ) : (
      part
    );
  });
}

function annotateNode(node: ReactNode, keyPrefix: string): ReactNode {
  if (typeof node === "string") return annotateString(node, keyPrefix);
  if (Array.isArray(node)) {
    return node.map((child, index) => annotateNode(child, `${keyPrefix}-${index}`));
  }
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<{
    children?: ReactNode;
    href?: string;
    role?: string;
    onClick?: unknown;
    "aria-hidden"?: boolean | "true";
  }>;
  const props = element.props;
  // Never put a button inside a link or another button. Existing glossary
  // terms are already explained, so wrapping them again would be noisy.
  if (
    element.type === G ||
    [
      "a",
      "button",
      "label",
      "select",
      "option",
      "textarea",
      "input",
      "code",
      "pre",
      "script",
      "style",
      "svg",
      "summary",
    ].includes(String(element.type)) ||
    typeof props.href === "string" ||
    typeof props.onClick === "function" ||
    props.role === "button" ||
    props.role === "option" ||
    props["aria-hidden"] === true ||
    props["aria-hidden"] === "true" ||
    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(String(element.type))
  ) {
    return node;
  }
  if (!("children" in props)) return node;

  return cloneElement(element, {
    children: annotateNode(props.children, keyPrefix),
  });
}

/**
 * Adds an in-context explanation to technical words in shared prose blocks.
 * Authors can still use <G> when a particular term needs a deliberate label.
 */
export function ExplainText({ children }: { children: ReactNode }) {
  return <>{annotateNode(children, "glossary")}</>;
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

/** Adds plain-English help to the technical words used on council pages. */
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
