"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type MspOption = { memberId: number; name: string; area: string; slug: string };

export default function MspReviewForm({
  msps,
  initialSlug,
  latestInteractionMonth,
}: {
  msps: MspOption[];
  initialSlug?: string;
  latestInteractionMonth: string;
}) {
  const initial = msps.find((msp) => msp.slug === initialSlug) ?? msps[0];
  const [memberId, setMemberId] = useState(String(initial.memberId));
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [interactionDate, setInteractionDate] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [followUpOptIn, setFollowUpOptIn] = useState(false);
  const [relationship, setRelationship] = useState("constituent");
  const [permission, setPermission] = useState(false);
  const [firsthand, setFirsthand] = useState(false);
  const [bot, setBot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selected = msps.find((msp) => String(msp.memberId) === memberId) ?? initial;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending" || rating < 1 || !firsthand || !permission) return;
    setState("sending");
    setErrorMessage("");
    const eventParams = {
      form_location: initialSlug ? "msp_profile" : "review_hub",
    };
    trackEvent("msp_review_submit_started", eventParams);

    try {
      const response = await fetch("/api/msp-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          memberId: selected.memberId,
          mspSlug: selected.slug,
          displayName: displayName.trim(),
          email: email.trim(),
          followUpOptIn,
          rating,
          title: title.trim(),
          story: story.trim(),
          interactionDate,
          relationship,
          firsthand,
          permission,
          botcheck: bot,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        trackEvent("msp_review_submit_error", { ...eventParams, http_status: response.status });
        setErrorMessage(data.error || "The review could not be saved.");
        setState("error");
        return;
      }
      trackEvent("msp_review_submitted", eventParams);
      setState("done");
      window.location.assign(data.confirmationPath || `/msp-reviews/submitted?msp=${encodeURIComponent(selected.slug)}`);
    } catch {
      trackEvent("msp_review_submit_error", { ...eventParams, failure_stage: "network" });
      setErrorMessage("The review could not be saved because the connection failed.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[4px] border-t-[var(--good)] bg-[var(--surface)] p-7 sm:p-9">
        <h2 className="h3 mb-3">Your review is in the moderation queue.</h2>
        <p className="max-w-[58ch] text-[16px] leading-[1.65] text-[var(--ink-2)]">
          It is not public yet. Reviews are published only after the moderation checks are complete.{followUpOptIn ? " You may be contacted if the account could support a fuller public-interest story." : " No contact details were collected."}
        </p>
      </div>
    );
  }

  const field = "ui w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3.5 py-3 text-[15px] outline-none focus:border-[var(--brand)]";

  return (
    <form action="/api/msp-reviews" method="post" onSubmit={submit} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8" style={{ boxShadow: "var(--shadow-2)" }}>
      <input name="botcheck" type="text" value={bot} onChange={(event) => setBot(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid gap-5">
        <label>
          <span className="ui mb-2 block text-[15px] font-[700]">Which MSP did you deal with?</span>
          <select name="memberId" value={memberId} onChange={(event) => setMemberId(event.target.value)} className={field}>
            {msps.map((msp) => <option key={msp.memberId} value={msp.memberId}>{msp.name} · {msp.area}</option>)}
          </select>
        </label>

        <fieldset>
          <legend className="ui mb-2 block text-[15px] font-[700]">Your rating</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className={`ui cursor-pointer rounded-full border px-4 py-2.5 text-[15px] font-[700] ${rating === value ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--rule-strong)] bg-[var(--paper)]"}`}>
                <input required type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} className="sr-only" />
                {value} {value === 1 ? "star" : "stars"}
              </label>
            ))}
          </div>
          {rating === 0 && <p className="ui mt-2 text-[15px] text-[var(--muted)]">Choose one rating.</p>}
        </fieldset>

        <label>
          <span className="ui mb-2 block text-[15px] font-[700]">Short headline</span>
          <input name="title" required minLength={8} maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} className={field} placeholder="For example: I waited three months for a reply" />
        </label>

        <label>
          <span className="ui mb-2 block text-[15px] font-[700]">What happened?</span>
          <span className="mb-2 block text-[15px] leading-[1.5] text-[var(--ink-2)]">Describe what you asked for, what the office did, the outcome and roughly when it happened. Do not name caseworkers, children or other private people.</span>
          <textarea name="story" required minLength={80} maxLength={4000} rows={9} value={story} onChange={(event) => setStory(event.target.value)} className={`${field} resize-y font-sans text-[15.5px]`} />
          <span className="ui mt-1.5 block text-[15px] text-[var(--muted)]">{story.length}/4,000 characters</span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <span className="ui mb-2 block text-[15px] font-[700]">When did you contact them?</span>
            <input name="interactionDate" type="month" max={latestInteractionMonth} value={interactionDate} onChange={(event) => setInteractionDate(event.target.value)} className={field} />
          </label>
          <label>
            <span className="ui mb-2 block text-[15px] font-[700]">How were you affected?</span>
            <select name="relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} className={field}>
              <option value="constituent">I contacted them about my own situation</option>
              <option value="family advocate">I contacted them for a family member I help</option>
              <option value="community advocate">I contacted them through a local group or service</option>
            </select>
          </label>
        </div>

        <label>
          <span className="ui mb-2 block text-[15px] font-[700]">Name shown with the review</span>
          <input name="displayName" required minLength={2} maxLength={70} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={field} placeholder="First name and initial is fine" />
        </label>

        <label className="flex gap-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-5 text-[15.5px] leading-[1.55]">
          <input
            name="followUpOptIn"
            value="true"
            type="checkbox"
            aria-controls={followUpOptIn ? "msp-review-follow-up-email" : undefined}
            aria-expanded={followUpOptIn}
            checked={followUpOptIn}
            onChange={(event) => {
              setFollowUpOptIn(event.target.checked);
              if (!event.target.checked) setEmail("");
            }}
            className="mt-1 h-5 w-5 shrink-0"
          />
          <span><strong>I am open to being contacted about this account.</strong> If it is particularly important to the public, Scotland Counted may ask for more detail and discuss whether it could become a fuller article. Leave this unticked and no email is needed.</span>
        </label>

        {followUpOptIn && (
          <label id="msp-review-follow-up-email" className="rounded-[var(--r-s)] border border-[var(--brand)] bg-[var(--brand-wash)] p-5">
            <span className="ui mb-2 block text-[15px] font-[700]">Where may Scotland Counted contact you?</span>
            <input name="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={field} autoComplete="email" />
            <span className="mt-1.5 block text-[15px] leading-[1.5] text-[var(--muted)]">Used only for this possible follow-up and never shown publicly.</span>
          </label>
        )}

        <div className="grid gap-3 rounded-[var(--r-s)] bg-[var(--surface-2)] p-5">
          <label className="flex gap-3 text-[15.5px] leading-[1.55]">
            <input name="firsthand" value="true" required type="checkbox" checked={firsthand} onChange={(event) => setFirsthand(event.target.checked)} className="mt-1 h-5 w-5 shrink-0" />
            <span>I confirm this describes a real interaction that directly affected me, someone I support or a community I represented.</span>
          </label>
          <label className="flex gap-3 text-[15.5px] leading-[1.55]">
            <input name="permission" value="true" required type="checkbox" checked={permission} onChange={(event) => setPermission(event.target.checked)} className="mt-1 h-5 w-5 shrink-0" />
            <span>I confirm the account is accurate and give permission for an edited version to be published after moderation.</span>
          </label>
        </div>

        <button type="submit" disabled={state === "sending" || rating === 0} className="btn btn-primary justify-center disabled:opacity-60">
          {state === "sending" ? "Sending for review…" : "Submit review for moderation"}
        </button>
        <p aria-live="polite" role={state === "error" ? "alert" : undefined} className={`text-[15px] leading-[1.55] ${state === "error" ? "font-[700] text-[var(--bad-text)]" : "text-[var(--muted)]"}`}>
          {state === "error" ? `${errorMessage} Your answers are still on this page, so you can correct anything and try again.` : "Nothing is published automatically. Submissions that are party-political attacks, hearsay, discriminatory, threatening or unrelated to a real interaction are rejected."}
        </p>
      </div>
    </form>
  );
}
