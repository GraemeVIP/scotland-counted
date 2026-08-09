"use client";

import { useEffect, useState } from "react";
import type { ModerationSubmission } from "@/lib/mspReviewsDb";

export default function ModerationPanel({ id }: { id: string }) {
  const [token, setToken] = useState("");
  const [submission, setSubmission] = useState<ModerationSubmission | null>(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "saving" | "approved" | "rejected" | "error">("loading");
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const secret = fragment.get("token") ?? "";
    window.history.replaceState(null, "", window.location.pathname);
    queueMicrotask(() => {
      if (!secret) {
        setMessage("The private token is missing from this moderation link.");
        setState("error");
        return;
      }
      setToken(secret);
      fetch("/api/msp-review-moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token: secret, action: "view" }),
      })
        .then(async (response) => ({ ok: response.ok, data: await response.json() }))
        .then(({ ok, data }) => {
          if (!ok) throw new Error(data.error || "This review could not be loaded.");
          setSubmission(data.submission);
          setTitle(data.submission.title);
          setStory(data.submission.body);
          setDisplayName(data.submission.display_name);
          setState("ready");
        })
        .catch((error: Error) => {
          setMessage(error.message);
          setState("error");
        });
    });
  }, [id]);

  async function decide(action: "approve" | "reject") {
    setPendingAction(action);
    setState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/msp-review-moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, action, title, story, displayName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "The decision could not be saved.");
        setPendingAction(null);
        setState("ready");
        return;
      }
      setState(action === "approve" ? "approved" : "rejected");
    } catch {
      setMessage("The connection failed. Nothing was changed; try the decision again.");
      setPendingAction(null);
      setState("ready");
    }
  }

  if (state === "loading") return <p className="ui text-[17px]">Loading the private submission…</p>;
  if (state === "approved" || state === "rejected") {
    return <div role="status" className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[4px] border-t-[var(--good)] bg-[var(--surface)] p-7"><h1 className="h2 mb-3">Review {state}.</h1><p className="text-[16px] text-[var(--ink-2)]">This one-time link has now expired.{state === "approved" ? " The public page will update within about one minute." : " Nothing was published."}</p></div>;
  }
  if (state === "error" || !submission) return <div role="alert" className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-7"><h1 className="h3 mb-3">This link cannot be used.</h1><p className="text-[16px] text-[var(--ink-2)]">{message}</p></div>;

  const field = "w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3.5 py-3 text-[16px] outline-none focus:border-[var(--brand)]";
  return (
    <div>
      <p className="kicker mb-3 text-[var(--action)]">Private moderation</p>
      <h1 className="h1 mb-5">Review the submission</h1>
      <div className="mb-7 rounded-[var(--r-s)] bg-[var(--surface-2)] p-5 text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
        <p><strong className="text-[var(--ink)]">{submission.msp_name}</strong> · {submission.rating} out of 5 · {submission.relationship}</p>
        {submission.interaction_month && <p className="mt-2">Approximate interaction: <strong className="text-[var(--ink)]">{new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${submission.interaction_month}T00:00:00Z`))}</strong></p>}
        <p className="mt-2">Follow-up permission: <strong className="text-[var(--ink)]">{submission.follow_up_opt_in ? "Yes" : "No"}</strong>{submission.follow_up_opt_in && submission.email ? ` · ${submission.email}` : ""}</p>
      </div>
      <div className="grid gap-5">
        <label><span className="ui mb-2 block text-[15px] font-[700]">Published name</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={field} /></label>
        <label><span className="ui mb-2 block text-[15px] font-[700]">Headline</span><input value={title} onChange={(event) => setTitle(event.target.value)} className={field} /></label>
        <label><span className="ui mb-2 block text-[15px] font-[700]">Account</span><textarea rows={12} value={story} onChange={(event) => setStory(event.target.value)} className={`${field} resize-y font-sans`} /></label>
        {message && <p role="alert" className="rounded-[var(--r-s)] border border-[var(--bad)] bg-[var(--surface)] p-4 text-[15.5px] font-[700] leading-[1.5] text-[var(--bad-text)]">{message}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" disabled={state === "saving"} onClick={() => decide("approve")} className="btn btn-primary justify-center">{pendingAction === "approve" ? "Approving…" : "Approve and publish"}</button>
          <button type="button" disabled={state === "saving"} onClick={() => decide("reject")} className="btn btn-ghost justify-center">{pendingAction === "reject" ? "Rejecting…" : "Reject"}</button>
        </div>
        <p className="text-[15px] leading-[1.5] text-[var(--muted)]">Approving publishes the edited name, rating, headline and account. The reviewer&apos;s email is never published. This link expires after either decision.</p>
      </div>
    </div>
  );
}
