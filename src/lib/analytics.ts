import { site } from "./site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a custom event to GA4, and the same event name to Microsoft Clarity,
 * if each is configured and loaded.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function" && site.analytics.ga4) {
    window.gtag("event", eventName, params);
  }
  // The same moment as a Clarity custom event, so recordings can be filtered by it.
  if (typeof window.clarity === "function" && site.analytics.clarity) {
    window.clarity("event", eventName);
  }
}
