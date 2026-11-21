"use client";

import { useState } from "react";

type Mp = { name: string; party: string; constituency: string; email: string };

/**
 * Postcode in, MP found, ready written email out. The body may contain
 * "[MP's name]", which is replaced with the MP's real name once found.
 */
export default function FindMpEmail({ subject, body }: { subject: string; body: string }) {
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [error, setError] = useState("");
  const [mp, setMp] = useState<Mp | null>(null);
  const [copied, setCopied] = useState(false);

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
      const data = (await res.json()) as { mp?: Mp; error?: string };
      if (!res.ok || !data.mp) throw new Error(data.error || "We could not find that postcode.");
      setMp(data.mp);
      setState("found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The postcode search is not working just now.");
      setState("error");
    }
  }

  const text = mp ? body.replaceAll("[MP's name]", mp.name) : body;
  const mailto = mp
    ? `mailto:${mp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    : "";

  async function copy() {
    if (!mp) return;
    const all = `To: ${mp.email}\nSubject: ${subject}\n\n${text}`;
    try {
      await navigator.clipboard.writeText(all);
    } catch {
      const area = document.createElement("textarea");
      area.value = all;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div>
      <form onSubmit={find} className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="find-mp-postcode" className="sr-only">
          Your postcode
        </label>
        <input
          id="find-mp-postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Your postcode, e.g. G12 8QQ"
          autoComplete="postal-code"
          className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-2.5 text-[16px] uppercase text-[var(--ink)] placeholder:normal-case placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-wash)] sm:max-w-[260px]"
        />
        <button type="submit" className="btn btn-primary justify-center" disabled={state === "loading"}>
          {state === "loading" ? "Finding…" : "Find my MP"}
        </button>
      </form>

      {state === "error" && (
        <p className="ui mt-2.5 text-[14.5px] text-[var(--bad-text)]" role="alert">
          {error}
        </p>
      )}

      {state === "found" && mp && (
        <div className="mt-4" aria-live="polite">
          <p className="ui flex items-center gap-2 text-[16px] text-[var(--ink)]">
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--good-text)] text-[13px] font-[700] text-white"
            >
              ✓
            </span>
            Your MP is <strong>{mp.name}</strong> ({mp.party}, {mp.constituency})
          </p>
          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
            <a href={mailto} className="btn btn-primary justify-center text-center">
              Open email to {mp.name}
            </a>
            <button type="button" onClick={copy} className="btn btn-ghost justify-center">
              {copied ? "Copied ✓" : "Copy the email"}
            </button>
          </div>
          <p className="ui mt-2.5 text-[14px] leading-[1.5] text-[var(--ink-2)]">
            Opens in your phone or computer&apos;s email app with {mp.name}&apos;s address filled in.
            Nothing happens? Tap <strong>Copy the email</strong> and paste it into Gmail, Outlook or
            any email. Add your name and postcode before you send.
          </p>
        </div>
      )}
    </div>
  );
}
