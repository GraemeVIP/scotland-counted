export const CONSENT_KEY = "sc-analytics-consent-v1";
export const CONSENT_EVENT = "sc-analytics-consent";
export const CONSENT_SETTINGS_EVENT = "sc-analytics-settings";
export const CONSENT_MAX_AGE = 90 * 24 * 60 * 60 * 1000;
export type AnalyticsConsent = "accepted" | "rejected" | "unset";

export function parseAnalyticsConsent(raw: string | null, now = Date.now()): AnalyticsConsent {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || !["accepted", "rejected"].includes(value.choice) ||
        typeof value.at !== "number" || value.at > now || now - value.at >= CONSENT_MAX_AGE) return "unset";
    return value.choice;
  } catch { return "unset"; }
}

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unset";
  try { return parseAnalyticsConsent(localStorage.getItem(CONSENT_KEY)); }
  catch { return "unset"; }
}

export function analyticsAllowed(hostname: string, canonicalHost: string, choice: AnalyticsConsent) {
  return hostname === canonicalHost && choice === "accepted";
}
