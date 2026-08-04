"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";

/**
 * The contact form. One form, a reason selector instead of a published
 * email address: the reason shapes the subject line so messages arrive
 * pre-sorted. Submissions go to Web3Forms, which forwards them to the
 * site owner's inbox; nothing is stored on the site.
 */

/*
 * Ordered by who is most likely to be writing, which is not the same as who
 * used to be catered for. Every reason here was once about the site, an
 * error, a press deadline, a data cut. Somebody who had simply read the thing
 * and had a question found nothing that fitted and had to pick "Something
 * else", which reads like being told they are an edge case.
 *
 * So the ordinary human reasons come first now. "question" is deliberately the
 * default when no reason is passed in the URL.
 */
const REASONS = [
  {
    id: "question",
    label: "I have a question about something on the site",
    subject: "Question",
    hint: "Ask it however you like. There is no wrong question, and it does not matter if you are not sure of the right words for it.",
  },
  {
    id: "help",
    label: "I am trying to work out who can help me",
    subject: "Pointing in the right direction",
    hint: "Say roughly what you are dealing with and I will point you at whoever actually handles it. I cannot give benefits or legal advice, but I can usually save you a few wrong turns.",
  },
  {
    id: "using",
    label: "I want to use this in my work",
    subject: "Using the site",
    hint: "Charity, school, union, community group, council team. Say what you are doing and what would make it easier.",
  },
  {
    id: "error",
    label: "Report an error in a figure",
    subject: "Correction reported",
    hint: "Say which page, which figure, and what you believe it should be. A link to the source you checked against is gold.",
  },
  {
    id: "press",
    label: "Press or media enquiry",
    subject: "Press enquiry",
    hint: "On a deadline? Say so in the first line and include it, the press kit at /press may already have what you need.",
  },
  {
    id: "data",
    label: "Request data in a different shape",
    subject: "Data request",
    hint: "Researchers, charities and students welcome. Say what series, what geography and what format.",
  },
  {
    id: "idea",
    label: "Suggest an improvement",
    subject: "Suggestion",
    hint: "Missing measure, confusing chart, broken link. All of it useful.",
  },
  {
    id: "other",
    label: "Something else",
    subject: "Message",
    hint: "",
  },
] as const;

type ReasonId = (typeof REASONS)[number]["id"];

export default function ContactForm() {
  const params = useSearchParams();
  // Defaults to a plain question rather than "other", arriving on a form
  // already set to the catch-all tells a reader their reason is unusual.
  const initial = (params.get("reason") as ReasonId) || "question";
  const [reason, setReason] = useState<ReasonId>(
    REASONS.some((r) => r.id === initial) ? initial : "question"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [bot, setBot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const active = REASONS.find((r) => r.id === reason)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject: `${active.subject}, ${site.name}`,
          from_name: name.trim() || `${site.name} contact form`,
          email: email.trim(),
          reason: active.label,
          message: message.trim(),
          botcheck: bot,
        }),
      });
      const data = await res.json();
      setState(data.success ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div
        className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--good)] p-7 sm:p-9 max-w-[560px]"
        style={{ boxShadow: "var(--shadow-2)" }}
        role="status"
      >
        <p className="h3 mb-3">Sent.</p>
        <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[46ch]">
          {reason === "error"
            ? "Thank you, corrections outrank everything else here. If the figure is wrong it will be fixed and logged publicly, and you will get a reply either way."
            : reason === "press"
              ? "Thanks, deadline enquiries get read first. The press kit at /press has charts and sourced lines in the meantime."
              : "Thanks for writing. Replies come from a real inbox, usually within a few days."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-8 max-w-[560px]"
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      {/* Honeypot, hidden from people, tempting to bots. */}
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

      <label className="block mb-5">
        <span className="ui block text-[15px] font-[660] mb-2">What is this about?</span>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as ReasonId)}
          className="ui w-full bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[15px] focus:border-[var(--brand)] outline-none transition-colors"
        >
          {REASONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        {active.hint && (
          <span className="block text-[15px] text-[var(--ink-2)] leading-[1.5] mt-2">
            {active.hint}
          </span>
        )}
      </label>

      <div className="grid gap-3 sm:grid-cols-2 mb-3">
        <label className="block">
          <span className="ui block text-[15px] font-[660] mb-2">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
            className="ui w-full bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[15px] focus:border-[var(--brand)] outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="ui block text-[15px] font-[660] mb-2">Your email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="So a reply can reach you"
            className="ui w-full bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[15px] focus:border-[var(--brand)] outline-none transition-colors"
          />
        </label>
      </div>

      <label className="block mb-6">
        <span className="ui block text-[15px] font-[660] mb-2">Your message</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder={
            reason === "error"
              ? "Page, figure, and what it should be…"
              : "What can I help with?"
          }
          className="w-full bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[15.5px] font-sans focus:border-[var(--brand)] outline-none transition-colors resize-y"
        />
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary w-full justify-center disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send it"}
      </button>

      <p className="text-[15px] text-[var(--muted)] leading-[1.55] mt-3.5">
        {state === "error"
          ? "That didn't send, try again in a moment."
          : "Delivered by Web3Forms straight to a real inbox. Your details are used to reply and for nothing else."}
      </p>
    </form>
  );
}
