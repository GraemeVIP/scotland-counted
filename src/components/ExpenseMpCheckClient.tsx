"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export type MpCheckStory = { slug: string; stat: string; hook: string };
export type MspCheckStory = MpCheckStory & { name: string; href: string };

type Found = { name: string; party: string; constituency: string; memberId: number };
type Msp = { name?: string; memberId?: number };

/**
 * "Is your MP on the list?" Postcode in, the reader's own MP out, then the
 * answer that keeps them reading: their MP's own story if we wrote one, and
 * every bill that MP sent taxpayers either way.
 *
 * Uses the same /api/representatives lookup and the same analytics events as
 * FindMpClaims, so the numbers in GA4 and Clarity stay comparable. The
 * postcode only ever goes in a POST body, never the URL or storage.
 */
export default function ExpenseMpCheckClient({
  currentSlug,
  seats,
  stories,
  mspStories,
  title = "Is your MP on the list?",
  intro = "Type your postcode. See if your MP has a story here, and every bill they sent taxpayers.",
  framed = true,
}: {
  currentSlug?: string;
  /** Parliament member id to the seat slug used across the site. */
  seats: Record<number, string>;
  /** Seat slug to that MP's own story. */
  stories: Record<string, MpCheckStory>;
  /** Lower case MSP name to that MSP's own story. */
  mspStories: Record<string, MspCheckStory>;
  title?: string;
  intro?: string;
  framed?: boolean;
}) {
  const inputId = useId();
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [error, setError] = useState("");
  const [mp, setMp] = useState<Found | null>(null);
  const [msps, setMsps] = useState<Msp[]>([]);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) return;
    setState("loading");
    setError("");
    setMp(null);
    setMsps([]);
    try {
      const res = await fetch("/api/representatives", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: value }),
      });
      const data = (await res.json()) as {
        mp?: Found;
        constituencyMsp?: Msp;
        regionalMsps?: Msp[];
        error?: string;
      };
      if (!res.ok || !data.mp) throw new Error(data.error || "We could not find that postcode.");
      setMp(data.mp);
      setMsps([data.constituencyMsp, ...(data.regionalMsps ?? [])].filter((m): m is Msp => Boolean(m)));
      setState("found");
      trackEvent("mp_claims_lookup_success", { mp_name: data.mp.name, constituency: data.mp.constituency });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The postcode search is not working just now.");
      setState("error");
      trackEvent("mp_claims_lookup_error");
    }
  }

  const seat = mp ? seats[mp.memberId] : undefined;
  const story = seat ? stories[seat] : undefined;
  const mspStory = msps
    .map((m) => (m.name ? mspStories[m.name.toLowerCase()] : undefined))
    .find((s): s is MspCheckStory => Boolean(s));
  const click = () => mp && trackEvent("mp_claims_view_click", { mp_name: mp.name, constituency: mp.constituency });

  const storyLink = (s: MpCheckStory) =>
    s.slug === currentSlug ? (
      <span className="font-[620]">You are reading it now.</span>
    ) : (
      <Link href={`/blog/${s.slug}`} onClick={click} className="font-[650]">
        <span className="figure-num tnum text-[var(--bad-text)]">{s.stat}</span> {s.hook} →
      </Link>
    );

  const body = (
    <>
      <p className="ui text-[20px] font-[700] leading-[1.25] text-[var(--ink)] sm:text-[22px]">{title}</p>
      <p className="ui mt-1 mb-3 text-[15.5px] leading-[1.5] text-[var(--ink-2)]">{intro}</p>
      <form onSubmit={find} className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          Your postcode
        </label>
        <input
          id={inputId}
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Your postcode, e.g. G12 8QQ"
          autoComplete="postal-code"
          className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-3 text-[16px] uppercase text-[var(--ink)] placeholder:normal-case placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-wash)] sm:max-w-[280px]"
        />
        <button type="submit" className="btn btn-primary justify-center" disabled={state === "loading"}>
          {state === "loading" ? "Checking…" : "Check my MP"}
        </button>
      </form>

      {state === "error" && (
        <p className="ui mt-2.5 text-[14.5px] text-[var(--bad-text)]" role="alert">
          {error}
        </p>
      )}

      {state === "found" && mp && (
        <div className="ui mt-4 space-y-2.5 text-[16px] leading-[1.5] text-[var(--ink)]" aria-live="polite">
          {seat ? (
            <>
              <p>
                Your MP is{" "}
                <Link href={`/representatives/mps/${seat}`} className="font-[700]">
                  {mp.name}
                </Link>{" "}
                ({mp.party}, {mp.constituency}).
              </p>
              {story ? (
                <p>
                  <strong>Yes, {mp.name} is on the list.</strong> {storyLink(story)}
                </p>
              ) : (
                <p>
                  No story on {mp.name} yet. But every bill is public, and you can read the lot.
                </p>
              )}
              {mspStory && (
                <p>
                  One of your MSPs is on the list too:{" "}
                  <Link href={mspStory.href} className="font-[650]">
                    {mspStory.name}
                  </Link>
                  . {storyLink(mspStory)}
                </p>
              )}
              <Link
                href={`/mp-expenses-scotland/search?mp=${seat}`}
                onClick={click}
                className="btn btn-primary mt-1 justify-center"
              >
                See every bill {mp.name} claimed <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <p className="text-[15px] text-[var(--ink-2)]">
              That postcode is outside Scotland. We cover Scotland&apos;s 57 MPs.
            </p>
          )}
        </div>
      )}
    </>
  );

  if (!framed) return <div>{body}</div>;
  return (
    <aside
      aria-label="Check your own MP"
      className="not-prose my-8 rounded-[var(--r-m)] border-2 border-[var(--brand)] bg-[var(--surface)] p-5 sm:p-6"
    >
      {body}
    </aside>
  );
}
