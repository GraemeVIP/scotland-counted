"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Sign-up for The Count, one email when the data changes.
 *
 * Wired for Web3Forms: the address is POSTed to api.web3forms.com,
 * which forwards it to the site owner's inbox. No key configured means
 * the form renders nothing, so an unwired control never ships. The
 * botcheck field is Web3Forms' honeypot: humans never see it, and a
 * submission that fills it is discarded.
 */
export default function NewsletterSignup({
  variant = "panel",
}: {
  variant?: "panel" | "footer" | "feature";
}) {
  const [email, setEmail] = useState("");
  const [bot, setBot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (!site.web3formsKey) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject: "New subscriber, The Count",
          from_name: site.name,
          email: email.trim(),
          botcheck: bot,
        }),
      });
      const data = await res.json();
      setState(data.success ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  const compact = variant === "footer";
  const feature = variant === "feature";

  if (state === "done") {
    return (
      <p
        className={
          compact
            ? "text-[15px] leading-[1.55] opacity-80 max-w-[34ch]"
            : feature
              ? "max-w-[46ch] text-[16px] leading-[1.6] text-white"
            : "text-[16px] leading-[1.6] text-[var(--ink-2)] max-w-[46ch]"
        }
        role="status"
      >
        <strong className={compact || feature ? "" : "text-[var(--ink)]"}>You&apos;re on the list.</strong>{" "}
        Expect one email when the data changes, a few times a year, and nothing else. Reply
        &ldquo;stop&rdquo; to any of them to leave.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={compact ? "max-w-[340px]" : feature ? "w-full" : "max-w-[480px]"}
    >
      {!compact && (
        <p className={feature ? "ui mb-4 text-[17px] font-[720]" : "ui mb-3 text-[15px] font-[680]"}>
          One email when the data changes
        </p>
      )}
      <div
        className={
          feature
            ? "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
            : "flex items-stretch gap-2"
        }
      >
        {/* Honeypot: hidden from people, tempting to bots. */}
        <input
          type="text"
          name="botcheck"
          value={bot}
          onChange={(e) => setBot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Your email address"
          className={
            compact
              ? "ui flex-1 min-w-0 bg-transparent border border-current/30 focus:border-current px-3.5 py-2.5 text-[15px] outline-none placeholder:opacity-50 transition-colors"
              : feature
                ? "ui min-h-[54px] min-w-0 w-full border border-white/20 bg-white px-4 py-3 text-[16px] text-[var(--deep)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-white focus:ring-4 focus:ring-white/15"
              : "ui flex-1 min-w-0 bg-[var(--paper)] border border-[var(--rule-strong)] focus:border-[var(--brand)] px-3.5 py-3 text-[15px] outline-none transition-colors"
          }
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={
            compact
              ? "btn btn-on-deep !px-4 !py-2.5 !text-[15px] shrink-0 disabled:opacity-60"
              : feature
                ? "btn btn-on-deep min-w-[116px] justify-center !px-6 disabled:opacity-60"
              : "btn btn-primary shrink-0 disabled:opacity-60"
          }
        >
          {state === "sending" ? "Joining…" : "Join"}
        </button>
      </div>
      <p
        className={
          compact
            ? "text-[15px] leading-[1.5] opacity-55 mt-2.5"
            : feature
              ? "mt-3 max-w-[54ch] text-[15px] leading-[1.55] text-[#cbd3e2]"
            : "text-[15px] leading-[1.55] text-[var(--muted)] mt-2.5 max-w-[52ch]"
        }
      >
        {state === "error"
          ? "That didn't send, try again in a moment, or use the RSS feed instead."
          : "A few emails a year, when the figures update. Your address is forwarded to me by Web3Forms, used for nothing else, and never shared."}
      </p>
    </form>
  );
}
