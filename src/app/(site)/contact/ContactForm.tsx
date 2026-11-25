"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "@/components/IntentLink";
import { useSearchParams } from "next/navigation";
import {
  CONTACT_REASONS,
  getContactReason,
  type ContactReasonId,
} from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

const inputCls =
  "ui w-full min-h-12 rounded-[var(--r-s)] bg-[var(--paper)] border border-[var(--rule-strong)] px-4 py-3 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--action)] focus:outline-none transition-colors";

const errorFieldStyle = {
  borderColor: "var(--bad)",
  boxShadow: "0 0 0 3px color-mix(in srgb, var(--bad) 15%, transparent)",
};

function ReasonIcon({ id }: { id: ContactReasonId }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "charity-help":
      return (
        <svg {...props}>
          <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z" />
        </svg>
      );
    case "correction":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <circle cx="12" cy="16" r="0.6" fill="currentColor" />
        </svg>
      );
    case "tip":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "press":
      return (
        <svg {...props}>
          <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1.5" fill="currentColor" />
        </svg>
      );
    case "general":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
}

export default function ContactForm() {
  const params = useSearchParams();
  const initialReason = getContactReason(params.get("reason")).id;
  const initialPage = params.get("page") ?? "";

  const [reasonId, setReasonId] = useState<ContactReasonId>(initialReason);
  const [wantsReply, setWantsReply] = useState<boolean>(
    initialReason === "charity-help" || initialReason === "press" || initialReason === "general"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [pageUrl, setPageUrl] = useState(initialPage);
  const [timeframe, setTimeframe] = useState("");
  const [message, setMessage] = useState("");
  const [botcheck, setBotcheck] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);
  const [sent, setSent] = useState<{
    reference: string;
    reasonLabel: string;
    wantsReply: boolean;
    email: string;
  } | null>(null);

  const messageRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const orgUid = useId();
  const pageUid = useId();
  const timeUid = useId();
  const msgUid = useId();
  const emailUid = useId();
  const nameUid = useId();

  useEffect(() => {
    const r = params.get("reason");
    const p = params.get("page");
    if (r) {
      const matched = getContactReason(r).id;
      setReasonId(matched);
      setWantsReply(matched === "charity-help" || matched === "press" || matched === "general");
    }
    if (p) setPageUrl(p);
  }, [params]);

  const activeReason = getContactReason(reasonId);
  const messageChars = message.trim().length;
  const hasMessage = messageChars >= 15;
  const hasValidEmail = !wantsReply || /^\S+@\S+\.\S+$/.test(email.trim());
  const doneSteps = 1 + (hasMessage ? 1 : 0) + (hasMessage && hasValidEmail ? 1 : 0);
  const progressPct = Math.round((doneSteps / 3) * 100);

  function selectReason(id: ContactReasonId) {
    setReasonId(id);
    setError(null);
    if (id === "charity-help" || id === "press") {
      setWantsReply(true);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedMsg = message.trim();
    const trimmedEmail = email.trim();

    if (trimmedMsg.length < 15) {
      setError({ text: "Write at least 15 characters so we know how to help.", field: "message" });
      messageRef.current?.focus();
      return;
    }
    if (wantsReply && !trimmedEmail) {
      setError({ text: "Add your email address so we can reply, or choose No reply needed.", field: "email" });
      emailRef.current?.focus();
      return;
    }
    if (trimmedEmail && (trimmedEmail.length < 5 || !/^\S+@\S+\.\S+$/.test(trimmedEmail))) {
      setError({ text: "Enter a valid email address.", field: "email" });
      emailRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reasonId,
          wantsReply,
          name,
          email: trimmedEmail,
          organisation,
          pageUrl,
          timeframe,
          message: trimmedMsg,
          botcheck,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        reference?: string;
        reasonLabel?: string;
        error?: string;
        field?: string;
      } | null;

      if (!response.ok || !result?.success) {
        const msg = result?.error || "Your message could not be sent right now. Please try again shortly.";
        setError({ text: msg, field: result?.field });
        if (result?.field === "email") emailRef.current?.focus();
        if (result?.field === "message") messageRef.current?.focus();
        return;
      }

      trackEvent("contact_submitted", { reason: reasonId, wants_reply: wantsReply ? "yes" : "no" });
      setSent({
        reference: result.reference ?? "SC-SENT",
        reasonLabel: result.reasonLabel ?? activeReason.label,
        wantsReply,
        email: trimmedEmail,
      });
    } catch {
      setError({ text: "Could not reach the server. Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSent(null);
    setError(null);
    setMessage("");
    setTimeframe("");
    setPageUrl("");
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[4px] border-t-[var(--good)] bg-[var(--surface)] p-6 sm:p-9"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div
          className="inline-flex items-center gap-2 rounded-[var(--r-pill)] px-3.5 py-1.5 text-[14px] font-[620]"
          style={{
            background: "color-mix(in srgb, var(--good) 14%, var(--surface))",
            color: "var(--good-text)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
          Message sent
        </div>

        <h2 className="h3 mt-4 text-[var(--ink)]">Thank you. We have your message.</h2>
        <p className="mt-3 max-w-[54ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
          {sent.wantsReply
            ? `Your note has gone straight to the Scotland Counted desk. We will reply to ${sent.email}.`
            : "Your note has gone straight to the Scotland Counted desk. You chose no reply, so we did not keep an email address."}
        </p>

        <dl className="mt-6 grid gap-4 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 sm:grid-cols-2">
          <div>
            <dt className="kicker">Topic</dt>
            <dd className="ui mt-1 text-[16px] font-[580] text-[var(--ink)]">{sent.reasonLabel}</dd>
          </div>
          <div>
            <dt className="kicker">Reference</dt>
            <dd className="ui mt-1 font-mono text-[15px] font-[600] text-[var(--action-text)] tabular-nums">
              {sent.reference}
            </dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={resetForm} className="btn btn-primary">
            Send another message
          </button>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const hasExtraFields = activeReason.showOrganisation || activeReason.showPageUrl || activeReason.showTimeframe;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <input
        type="text"
        name="botcheck"
        value={botcheck}
        onChange={(e) => setBotcheck(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="mb-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="kicker text-[var(--action-text)]">Write to Scotland Counted</p>
          <p className="ui text-[13.5px] font-[560] text-[var(--muted)] tabular-nums">
            Step {doneSteps} of 3 ready
          </p>
        </div>
        <div
          aria-hidden="true"
          className="mt-3 h-1.5 w-full overflow-hidden rounded-[var(--r-pill)] bg-[var(--surface-2)]"
        >
          <div
            className="h-full rounded-[var(--r-pill)] bg-[var(--action)] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <fieldset>
        <legend className="kicker text-[var(--action-text)]">1. Pick a topic</legend>
        <p className="mt-1.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
          Choose what fits best. Extra fields below adjust to match.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CONTACT_REASONS.map((reason, idx) => {
            const active = reason.id === reasonId;
            const spanFull = idx === CONTACT_REASONS.length - 1;
            return (
              <button
                key={reason.id}
                type="button"
                aria-pressed={active}
                onClick={() => selectReason(reason.id)}
                className={`group flex items-start gap-3.5 rounded-[var(--r-s)] border p-4 text-left transition-all cursor-pointer ${
                  spanFull ? "sm:col-span-2" : ""
                } ${
                  active
                    ? "border-[var(--action)] bg-[var(--action-tint)]"
                    : "border-[var(--rule-strong)] bg-[var(--paper)] hover:border-[var(--action)]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors ${
                    active
                      ? "bg-[var(--action)] text-[var(--action-ink)]"
                      : "bg-[var(--surface-2)] text-[var(--ink-2)] group-hover:text-[var(--action-text)]"
                  }`}
                >
                  <ReasonIcon id={reason.id} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="ui block text-[15.5px] font-[620] leading-[1.3] text-[var(--ink)]">
                    {reason.label}
                  </span>
                  <span className="mt-1 block text-[14.5px] leading-[1.45] text-[var(--ink-2)]">
                    {reason.summary}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    active
                      ? "border-[var(--action)] bg-[var(--action)] text-[var(--action-ink)]"
                      : "border-[var(--rule-strong)] bg-transparent"
                  }`}
                >
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 border-t border-[var(--rule)] pt-7">
        <p className="kicker text-[var(--action-text)]">2. Write your note</p>

        <div className="mt-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
          {activeReason.messageHint}
        </div>

        {hasExtraFields && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {activeReason.showOrganisation && (
              <div className={activeReason.showTimeframe ? "" : "sm:col-span-2"}>
                <label htmlFor={orgUid} className="ui mb-2 block text-[15px] font-[580] text-[var(--ink)]">
                  {activeReason.organisationLabel}
                </label>
                <input
                  id={orgUid}
                  type="text"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  maxLength={120}
                  placeholder="For example, Ayrshire food bank"
                  className={inputCls}
                />
              </div>
            )}

            {activeReason.showTimeframe && (
              <div className={activeReason.showOrganisation ? "" : "sm:col-span-2"}>
                <label htmlFor={timeUid} className="ui mb-2 block text-[15px] font-[580] text-[var(--ink)]">
                  {activeReason.timeframeLabel}
                </label>
                <input
                  id={timeUid}
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  maxLength={80}
                  placeholder="For example, Friday or next month"
                  className={inputCls}
                />
              </div>
            )}

            {activeReason.showPageUrl && (
              <div className="sm:col-span-2">
                <label htmlFor={pageUid} className="ui mb-2 block text-[15px] font-[580] text-[var(--ink)]">
                  Page link or title (optional)
                </label>
                <input
                  id={pageUid}
                  type="text"
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  maxLength={300}
                  placeholder="Paste the page link or name the council"
                  className={inputCls}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label htmlFor={msgUid} className="ui text-[15px] font-[580] text-[var(--ink)]">
              Your message
            </label>
            <span className="ui text-[13.5px] text-[var(--muted)] tabular-nums">
              {messageChars} / 4000
            </span>
          </div>
          <textarea
            ref={messageRef}
            id={msgUid}
            required
            rows={5}
            maxLength={4000}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error?.field === "message") setError(null);
            }}
            placeholder="Write your question, correction or tip here..."
            className={`${inputCls} min-h-[144px] resize-y`}
            style={error?.field === "message" ? errorFieldStyle : undefined}
          />
          <p className="mt-2 text-[14px] leading-[1.45] text-[var(--muted)]">
            Please leave out private bank or case details.
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--rule)] pt-7">
        <p className="kicker text-[var(--action-text)]">3. Reply details</p>

        <div
          role="group"
          aria-label="Reply preference"
          className="mt-3 grid grid-cols-1 gap-2 rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] p-1.5 sm:grid-cols-2"
        >
          <button
            type="button"
            aria-pressed={wantsReply}
            onClick={() => {
              setWantsReply(true);
              setError(null);
            }}
            className={`ui min-h-11 rounded-[10px] px-4 py-2 text-[15px] font-[600] transition-colors cursor-pointer ${
              wantsReply
                ? "bg-[var(--action)] text-[var(--action-ink)]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)]"
            }`}
          >
            Yes, send me a reply
          </button>

          <button
            type="button"
            aria-pressed={!wantsReply}
            onClick={() => {
              setWantsReply(false);
              if (error?.field === "email") setError(null);
            }}
            className={`ui min-h-11 rounded-[10px] px-4 py-2 text-[15px] font-[600] transition-colors cursor-pointer ${
              !wantsReply
                ? "bg-[var(--action)] text-[var(--action-ink)]"
                : "text-[var(--ink-2)] hover:text-[var(--ink)]"
            }`}
          >
            No reply needed
          </button>
        </div>

        {wantsReply ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={nameUid} className="ui mb-2 block text-[15px] font-[580] text-[var(--ink)]">
                Your name (optional)
              </label>
              <input
                id={nameUid}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                placeholder="First name or full name"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor={emailUid} className="ui mb-2 block text-[15px] font-[580] text-[var(--ink)]">
                Email address
              </label>
              <input
                ref={emailRef}
                id={emailUid}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error?.field === "email") setError(null);
                }}
                maxLength={254}
                placeholder="you@example.org.uk"
                className={inputCls}
                style={error?.field === "email" ? errorFieldStyle : undefined}
              />
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] px-4 py-3 text-[15px] leading-[1.5] text-[var(--ink-2)]">
            Your message goes through without an email address. We cannot write back to you.
          </p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-[var(--r-s)] border border-[var(--bad)] px-4 py-3 text-[15px] font-[580] text-[var(--bad-text)]"
          style={{ background: "color-mix(in srgb, var(--bad) 10%, var(--surface))" }}
        >
          {error.text}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary justify-center px-7 disabled:opacity-60"
        >
          {submitting ? "Sending message..." : "Send message"}
        </button>

        <p className="ui text-[14px] text-[var(--muted)]">
          Read by our editorial team only.
        </p>
      </div>
    </form>
  );
}
