"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { COUNCIL_SEARCH_NAMES } from "@/lib/routeMap";

const COUNCILS = Object.entries(COUNCIL_SEARCH_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

const inputClass =
  "ui w-full min-h-12 rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] px-4 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors";

type Side = { council: string; postcode: string };

const JUMP_KEY = "sc-compare-jump";

async function councilForPostcode(postcode: string) {
  const response = await fetch("/api/postcode-area", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcode }),
  });
  const result = (await response.json()) as { council?: { slug?: string }; error?: string };
  if (!response.ok || !result.council?.slug) throw new Error(result.error || "That postcode did not work.");
  return result.council.slug;
}

function SidePicker({
  label,
  colour,
  side,
  example,
  onChange,
}: {
  label: string;
  colour: string;
  side: Side;
  example: string;
  onChange: (next: Side) => void;
}) {
  const id = useId();
  return (
    <fieldset className="grid min-w-0 gap-2.5">
      <legend className="ui mb-2 flex items-center gap-2 text-[15px] font-[600] text-[var(--ink)]">
        <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full" style={{ background: colour }} />
        {label}
      </legend>
      <label htmlFor={`${id}-council`} className="sr-only">
        {label}: council area
      </label>
      <select
        id={`${id}-council`}
        value={side.council}
        onChange={(e) => onChange({ council: e.target.value, postcode: "" })}
        className={inputClass}
      >
        {COUNCILS.map(([slug, name]) => (
          <option key={slug} value={slug}>
            {name}
          </option>
        ))}
      </select>
      <label htmlFor={`${id}-postcode`} className="ui text-[13.5px] text-[var(--muted)]">
        or use a postcode
      </label>
      <input
        id={`${id}-postcode`}
        type="text"
        autoComplete="postal-code"
        data-clarity-mask="true"
        value={side.postcode}
        onChange={(e) => onChange({ ...side, postcode: e.target.value.toUpperCase() })}
        placeholder={`e.g. ${example}`}
        className={inputClass}
      />
    </fieldset>
  );
}

/**
 * Two area pickers. Each takes a council from the list or a postcode; a
 * postcode wins when both are given, because it is the more deliberate entry.
 * The result is a plain link, /compare-areas?a=…&b=…, so any comparison can be
 * shared or bookmarked and the server renders it without JavaScript.
 */
export default function AreaComparePicker({ a, b }: { a: string; b: string }) {
  const router = useRouter();
  const [left, setLeft] = useState<Side>({ council: a, postcode: "" });
  const [right, setRight] = useState<Side>({ council: b, postcode: "" });
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  // Arriving from the picker on another page (the homepage): open at the
  // result rather than above the picker. The router writes the new address
  // after this runs, so the picker leaves a note in session storage instead.
  useEffect(() => {
    let jump = false;
    try {
      jump = sessionStorage.getItem(JUMP_KEY) === "1";
    } catch {}
    if (!jump) return;
    // The note is cleared only when the jump happens: React can run this
    // twice, cancelling the first timer, and the second run must still see it.
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(JUMP_KEY);
      } catch {}
      // Instant, not the page's smooth scroll, which late loading content can interrupt.
      document.getElementById("comparison")?.scrollIntoView({ block: "start", behavior: "instant" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setState("loading");
    try {
      const [sa, sb] = await Promise.all(
        [left, right].map((s) => (s.postcode.trim() ? councilForPostcode(s.postcode.trim()) : Promise.resolve(s.council)))
      );
      setLeft({ council: sa, postcode: "" });
      setRight({ council: sb, postcode: "" });
      const onPage = document.getElementById("comparison");
      if (!onPage) {
        try {
          sessionStorage.setItem(JUMP_KEY, "1");
        } catch {}
      }
      router.push(`/compare-areas?a=${sa}&b=${sb}#comparison`, { scroll: false });
      onPage?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "That postcode did not work.");
    } finally {
      setState("idle");
    }
  }

  function swap() {
    setLeft(right);
    setRight(left);
  }

  return (
    <form onSubmit={submit} className="tile p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start">
        <SidePicker label="First area" colour="var(--brand)" side={left} example="G12 8QQ" onChange={setLeft} />
        <button
          type="button"
          onClick={swap}
          className="btn btn-ghost mx-auto h-12 w-12 justify-center rounded-full p-0 max-md:rotate-90 md:mt-8"
          aria-label="Swap the two areas"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 7h13m0 0-4-4m4 4-4 4M17 17H4m0 0 4 4m-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <SidePicker label="Second area" colour="var(--hub-area)" side={right} example="EH1 1RE" onChange={setRight} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary justify-center max-sm:w-full" disabled={state === "loading"}>
          {state === "loading" ? "Finding the areas" : "Compare these areas"} <span aria-hidden="true">→</span>
        </button>
        {error && (
          <p role="alert" className="text-[14.5px] leading-[1.45] text-[var(--bad-text)]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
