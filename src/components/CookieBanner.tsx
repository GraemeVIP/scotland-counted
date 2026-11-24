"use client";

import Link from "@/components/IntentLink";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_EVENT,
  choiceFromFlags,
  flagsFromChoice,
  openCookieSettings,
  readCookieChoice,
  saveCookieChoice,
  type CookieChoice,
} from "@/lib/consent";

export function CookieSettingsButton({
  className = "",
  children = "Cookie settings",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={className}
    >
      {children}
    </button>
  );
}

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getConsentSnapshot(): CookieChoice | "skip" | null {
  if (window.location.pathname.startsWith("/review-moderation/")) return "skip";
  return readCookieChoice();
}

function getServerConsentSnapshot(): CookieChoice | "skip" | null {
  return "skip";
}

function PreferenceSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
        checked
          ? "border-[#0b57d0] bg-[#0b57d0]"
          : "border-[var(--rule-strong)] bg-[var(--paper-3)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5.5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/**
 * Official two-layer privacy notice over a frosted transparent backdrop.
 *
 * The primary view pairs friendly "Agree and continue" wording with a clear
 * view of the article behind the glass. Clicking "More options" opens the full
 * legal disclosure with granular switches placed at the bottom.
 */
export default function CookieBanner() {
  const pathname = usePathname() || "/";
  const stored = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const [manualOpen, setManualOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [clarityOn, setClarityOn] = useState(false);
  const [ga4On, setGa4On] = useState(false);

  const isPrivacyPage = pathname === "/privacy";
  const open =
    stored !== "skip" && (manualOpen || (stored === null && !isPrivacyPage));

  useEffect(() => {
    const onOpenSettings = () => {
      const current = flagsFromChoice(readCookieChoice());
      setClarityOn(current.clarity);
      setGa4On(current.ga4);
      setManaging(false);
      setManualOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpenSettings);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && manualOpen) {
        setManualOpen(false);
        setManaging(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, manualOpen]);

  if (!open) return null;

  function choose(choice: CookieChoice) {
    saveCookieChoice(choice);
    setManualOpen(false);
    setManaging(false);
  }

  return (
    <aside
      aria-label="Privacy notice"
      className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(4,17,47,0.42)] p-4 backdrop-blur-[2px]"
    >
      <div
        className={`w-full overflow-hidden rounded-[var(--r-m)] border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink)] ${
          managing ? "max-w-[540px]" : "max-w-[460px]"
        }`}
        style={{ boxShadow: "var(--shadow-3)" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] bg-[var(--surface-2)] px-6 py-3.5">
          <BrandLogo tone="adaptive" height={24} />
          <span className="ui text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--muted)]">
            Privacy notice
          </span>
        </div>

        {!managing ? (
          <div className="p-6">
            <p className="ui text-[20px] font-[720] leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
              We value your privacy
            </p>
            <p className="mt-2.5 text-[14.5px] leading-[1.55] text-[var(--ink-2)]">
              Scotland Counted is free, independent public data with no advertising. We use cookies
              to count visits, see which guides help people most, and fix broken pages. Nothing is
              ever sold.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="ui inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[var(--r-pill)] bg-[#0b57d0] px-6 py-3 text-[15.5px] font-[650] text-white shadow-sm transition-colors hover:bg-[#0a4bb5]"
              >
                Agree and continue
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3 px-1">
              <button
                type="button"
                onClick={() => setManaging(true)}
                className="ui inline-flex min-h-[44px] cursor-pointer items-center gap-1 py-2 text-[13.5px] font-[550] text-[var(--muted)] underline decoration-[var(--rule-strong)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
              >
                More options
              </button>
              <Link
                href="/privacy"
                onClick={() => {
                  setManualOpen(false);
                  setManaging(false);
                }}
                className="ui inline-flex min-h-[44px] items-center py-2 text-[13.5px] font-[500] text-[var(--muted)] underline decoration-[var(--rule-strong)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
              >
                Privacy policy
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-h-[78vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="ui text-[18px] font-[700] leading-[1.25] text-[var(--ink)]">
                Privacy and measurement terms
              </p>
              <button
                type="button"
                onClick={() => setManaging(false)}
                className="ui inline-flex min-h-[36px] cursor-pointer items-center px-2 text-[13.5px] font-[550] text-[var(--action-text)] hover:underline"
              >
                Back
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="ui inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-[var(--r-pill)] bg-[#0b57d0] px-5 py-2.5 text-[15px] font-[650] text-white shadow-sm transition-colors hover:bg-[#0a4bb5]"
              >
                Agree and continue
              </button>
            </div>

            <div className="mt-5 space-y-3 text-[13.5px] leading-[1.6] text-[var(--ink-2)]">
              <p>
                <strong className="text-[var(--ink)]">1. Purpose and legal basis.</strong>{" "}
                Scotland Counted operates as an independent, non-commercial public data publication.
                Under the Privacy and Electronic Communications Regulations (PECR) and UK GDPR,
                essential browser storage required to operate interactive calculators, postcode
                lookups, display preferences, and consent records is active without optional
                permissions. Optional analytics and session continuity storage rely on your explicit
                consent.
              </p>
              <p>
                <strong className="text-[var(--ink)]">2. Audience measurement (Google Analytics).</strong>{" "}
                When enabled, Google Analytics records page paths, referral origins, coarse device
                and browser metadata, and aggregated engagement events. IP anonymisation and data
                redaction apply, and no advertising signals, remarketing lists, or cross-site
                profiling identifiers are enabled. Event retention is restricted to platform
                defaults for statistical reporting.
              </p>
              <p>
                <strong className="text-[var(--ink)]">3. Page usability diagnostics (Microsoft Clarity).</strong>{" "}
                When enabled, Microsoft Clarity stores first-party session identifiers (_clck and
                _clsk) to link consecutive page requests within a single visit and across return
                visits. This allows us to identify broken links, layout shifts, and unreadable
                sections. All private input fields including postcodes, salary figures, and draft
                correspondence remain masked on your device before transmission.
              </p>
              <p>
                <strong className="text-[var(--ink)]">4. Retention, transfers, and withdrawal.</strong>{" "}
                Measurement providers process aggregated telemetry in accordance with UK adequacy and
                standard contractual safeguards. Scotland Counted does not operate mailing lists,
                user accounts, or behavioural advertising networks, and never sells or brokers
                visitor records. You may review or withdraw optional storage permissions at any
                time via the Cookie settings control in the site footer or on the{" "}
                <Link
                  href="/privacy"
                  onClick={() => {
                    setManualOpen(false);
                    setManaging(false);
                  }}
                  className="underline decoration-[var(--rule-strong)] underline-offset-4 text-[var(--ink)]"
                >
                  privacy policy page
                </Link>
                .
              </p>
            </div>

            <div className="mt-6 border-t border-[var(--rule)] pt-5">
              <p className="ui text-[14.5px] font-[650] text-[var(--ink)]">
                Optional storage switches
              </p>
              <p className="mt-1 text-[13px] leading-[1.45] text-[var(--muted)]">
                Adjust individual permissions below, then confirm with Save preferences.
              </p>

              <div className="mt-3 divide-y divide-[var(--rule)] rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)]">
                <details className="px-4 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                    <span className="ui text-[14px] font-[620] text-[var(--ink)]">
                      Strictly necessary storage
                    </span>
                    <span className="ui text-[12.5px] font-[600] text-[var(--good-text)]">
                      Always active
                    </span>
                  </summary>
                  <p className="mt-2 text-[13px] leading-[1.5] text-[var(--ink-2)]">
                    Stores your privacy selection, light or dark theme preference, and temporary
                    tab handoff data between postcode lookups and the letter builder.
                  </p>
                </details>

                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <details className="min-w-0 flex-1">
                      <summary className="ui cursor-pointer list-none text-[14px] font-[620] text-[var(--ink)]">
                        Usability and bug checks (Microsoft Clarity)
                      </summary>
                      <p className="mt-2 text-[13px] leading-[1.5] text-[var(--ink-2)]">
                        Maintains a single session across pages to spot layout faults and dead
                        clicks. Form entries remain masked.
                      </p>
                    </details>
                    <PreferenceSwitch
                      checked={clarityOn}
                      onChange={setClarityOn}
                      label="Usability and bug checks"
                    />
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <details className="min-w-0 flex-1">
                      <summary className="ui cursor-pointer list-none text-[14px] font-[620] text-[var(--ink)]">
                        Visit counts (Google Analytics)
                      </summary>
                      <p className="mt-2 text-[13px] leading-[1.5] text-[var(--ink-2)]">
                        Measures page popularity and search referrers without advertising or
                        personal profiles.
                      </p>
                    </details>
                    <PreferenceSwitch
                      checked={ga4On}
                      onChange={setGa4On}
                      label="Visit counts"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    choose(choiceFromFlags({ clarity: clarityOn, ga4: ga4On }))
                  }
                  className="ui inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-[var(--r-pill)] border border-[var(--rule-strong)] bg-[var(--surface)] px-5 py-2 text-[14px] font-[580] text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
