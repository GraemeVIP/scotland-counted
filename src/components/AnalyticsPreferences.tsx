"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { CONSENT_KEY, CONSENT_EVENT, CONSENT_SETTINGS_EVENT, readAnalyticsConsent } from "@/lib/analyticsConsent";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => { window.removeEventListener(CONSENT_EVENT, onChange); window.removeEventListener("storage", onChange); };
}
function snapshot() {
  if (location.hostname !== new URL(site.url).hostname || location.pathname.startsWith("/review-moderation") || location.pathname.startsWith("/embed")) return "hidden";
  return readAnalyticsConsent();
}

export function AnalyticsSettingsButton() {
  return <button type="button" className="underline underline-offset-4 text-[15px]" onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))}>Analytics preferences</button>;
}

export default function AnalyticsPreferences() {
  const choice = useSyncExternalStore(subscribe, snapshot, () => "hidden");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(CONSENT_SETTINGS_EVENT, show);
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, show);
  }, []);
  if (choice === "hidden" || (!open && choice !== "unset") || (!site.analytics.ga4 && !site.analytics.clarity)) return null;

  function choose(value: "accepted" | "rejected") {
    const wasAccepted = readAnalyticsConsent() === "accepted";
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice: value, at: Date.now() })); }
    catch { /* Without storage the tools stay off. */ }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setOpen(false);
    if (wasAccepted && value === "rejected") {
      // Reload ends running recorder code as well as blocking future loads.
      for (const part of document.cookie.split(";")) {
        const name = part.split("=")[0].trim();
        if (!/^(_ga($|_)|_clck$|_clsk$)/.test(name)) continue;
        for (const domain of ["", `; domain=${location.hostname}`, `; domain=.${location.hostname}`]) {
          document.cookie = `${name}=; max-age=0; path=/${domain}; SameSite=Lax`;
        }
      }
      location.reload();
    }
  }

  return <section aria-label="Optional analytics" className="fixed inset-x-0 bottom-0 z-[70] border-t-2 border-[var(--ink)] bg-[var(--paper)] p-4 shadow-[var(--shadow-3)] no-print">
    <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3">
      <div className="min-w-0 flex-1 basis-[320px] text-[15px] leading-relaxed">
        <p className="font-bold">Help improve Scotland Counted?</p>
        <p>Optional Google Analytics and Microsoft Clarity measure visits and how pages are used. All tools work without them. Your choice is saved for 90 days. <Link href="/privacy">Privacy details</Link>.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-ghost" onClick={() => choose("rejected")}>Reject analytics</button>
        <button type="button" className="btn btn-ghost" onClick={() => choose("accepted")}>Allow analytics</button>
        {open && choice !== "unset" && <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>}
      </div>
    </div>
  </section>;
}
