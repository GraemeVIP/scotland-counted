import { site } from "./site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Sends a custom conversion event to GA4 if configured and loaded.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    site.analytics.ga4
  ) {
    window.gtag("event", eventName, params);
  }
}
