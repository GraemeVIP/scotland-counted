"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Found = { name: string; party: string; constituency: string; memberId: number };

/**
 * Postcode in, the reader's own MP out, with one big button to that MP's
 * claims. `slugs` maps each MP's Parliament id to their page on this site.
 */
export default function FindMpClaims({ slugs }: { slugs: Record<number, string> }) {
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [error, setError] = useState("");
  const [mp, setMp] = useState<Found | null>(null);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) return;
    setState("loading");
    setError("");
    setMp(null);
    try {
      const res = await fetch("/api/representatives", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: value }),
      });
      const data = (await res.json()) as { mp?: Found; error?: string };
      if (!res.ok || !data.mp) throw new Error(data.error || "We could not find that postcode.");
      setMp(data.mp);
      setState("found");
      trackEvent("mp_claims_lookup_success", { mp_name: data.mp.name, constituency: data.mp.constituency });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The postcode search is not working just now.");
      setState("error");
      trackEvent("mp_claims_lookup_error");
    }
  }

  const slug = mp ? slugs[mp.memberId] : undefined;

  return (
    <div>
      <form onSubmit={find} className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="find-mp-claims-postcode" className="sr-only">
          Your postcode
        </label>
        <input
          id="find-mp-claims-postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Your postcode, e.g. G12 8QQ"
          autoComplete="postal-code"
          className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-3 text-[16px] uppercase text-[var(--ink)] placeholder:normal-case placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-wash)] sm:max-w-[280px]"
        />
        <button type="submit" className="btn btn-primary justify-center" disabled={state === "loading"}>
          {state === "loading" ? "Finding…" : "Show my MP's claims"}
        </button>
      </form>

      {state === "error" && (
        <p className="ui mt-2.5 text-[14.5px] text-[var(--bad-text)]" role="alert">
          {error}
        </p>
      )}

      {state === "found" && mp && (
        <div className="mt-4" aria-live="polite">
          <p className="ui text-[16px] text-[var(--ink)]">
            Your MP is <strong>{mp.name}</strong> ({mp.party}, {mp.constituency}).
          </p>
          {slug ? (
            <Link
              href={`/representatives/mps/${slug}#donations-and-interests`}
              onClick={() => trackEvent("mp_claims_view_click", { mp_name: mp.name, constituency: mp.constituency })}
              className="btn btn-primary mt-3 justify-center"
            >
              See what {mp.name} claimed <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <p className="ui mt-2 text-[14.5px] text-[var(--ink-2)]">
              That postcode is outside Scotland. This page covers Scotland&apos;s 57 MPs.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
