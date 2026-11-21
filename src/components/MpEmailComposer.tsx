"use client";

import { useEffect, useState } from "react";
import type { EmailIssue } from "@/lib/mpEmails";
import { trackEvent } from "@/lib/analytics";

/**
 * Pick an issue, read the email, then open it in a mail app or copy it.
 * Other parts of the page can link to #ask-<issue id> to preselect an issue.
 */
export default function MpEmailComposer({
  name,
  email,
  issues,
}: {
  name: string;
  email: string;
  issues: EmailIssue[];
}) {
  const [issueId, setIssueId] = useState(issues[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const issue = issues.find((i) => i.id === issueId) ?? issues[0];

  useEffect(() => {
    const pick = () => {
      const m = window.location.hash.match(/^#ask-(.+)$/);
      if (m && issues.some((i) => i.id === m[1])) setIssueId(m[1]);
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [issues]);

  if (!issue) return null;

  const mailto = `mailto:${email}?subject=${encodeURIComponent(issue.subject)}&body=${encodeURIComponent(issue.body)}`;

  async function copy() {
    trackEvent("mp_email_copied", { mp_name: name, email_issue: issue.id });
    const text = `To: ${email}\nSubject: ${issue.subject}\n\n${issue.body}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div id="write-to-your-mp">
      {issues.map((i) => (
        <span key={i.id} id={`ask-${i.id}`} className="block" aria-hidden="true" />
      ))}
      <label htmlFor="email-issue" className="ui block text-[17px] font-[660] text-[var(--ink)]">
        Email {name} in one minute
      </label>
      <p className="ui mt-1 text-[14.5px] text-[var(--ink-2)]">Pick what you want to ask:</p>
      <select
        id="email-issue"
        value={issue.id}
        onChange={(e) => {
          setIssueId(e.target.value);
          setCopied(false);
        }}
        className="mt-2 w-full rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-2.5 text-[16px] text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-wash)]"
      >
        {issues.map((i) => (
          <option key={i.id} value={i.id}>
            {i.label}
          </option>
        ))}
      </select>

      <div className="mt-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3">
        <p className="ui text-[13px] text-[var(--muted)]">
          <strong className="text-[var(--ink-2)]">To:</strong> {email}
        </p>
        <p className="ui mt-0.5 text-[13px] text-[var(--muted)]">
          <strong className="text-[var(--ink-2)]">Subject:</strong> {issue.subject}
        </p>
        <p className="mt-2.5 max-h-[220px] overflow-y-auto whitespace-pre-line border-t border-[var(--rule)] pt-2.5 text-[15px] leading-[1.55] text-[var(--ink)]">
          {issue.body}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
        <a
          href={mailto}
          onClick={() => trackEvent("mp_email_opened", { mp_name: name, email_issue: issue.id })}
          className="btn btn-primary justify-center text-center"
        >
          Open in my email app
        </a>
        <button
          type="button"
          onClick={copy}
          className="btn btn-ghost justify-center text-center"
          aria-live="polite"
        >
          {copied ? "Copied ✓" : "Copy the email"}
        </button>
      </div>
      <p className="ui mt-2.5 text-[14px] leading-[1.5] text-[var(--ink-2)]">
        Opens in your phone or computer&apos;s email app. Nothing happens? Tap{" "}
        <strong>Copy the email</strong> and paste it into Gmail, Outlook or any email. Add your
        name and postcode before you send.
      </p>
    </div>
  );
}
