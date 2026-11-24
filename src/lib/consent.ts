export const COOKIE_STORAGE_KEY = "sc-privacy-choice";
export const COOKIE_CONSENT_EVENT = "sc:cookie-consent";
export const COOKIE_SETTINGS_EVENT = "sc:cookie-settings";

export type CookieChoice = "accepted" | "rejected" | "clarity-only" | "ga4-only";

export type ConsentFlags = {
  clarity: boolean;
  ga4: boolean;
};

const ANALYTICS_COOKIE_EXACT = new Set(["_clck", "_clsk", "_ga"]);

/**
 * Local previews and Vercel branch URLs are testing, not public traffic.
 */
export function shouldRunAnalyticsOnHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) return false;
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    host === "0.0.0.0" ||
    /[.](local|localhost|test)$/.test(host) ||
    /[.]vercel[.]app$/.test(host)
  ) {
    return false;
  }
  return true;
}

export function choiceFromFlags(flags: ConsentFlags): CookieChoice {
  if (flags.clarity && flags.ga4) return "accepted";
  if (flags.clarity) return "clarity-only";
  if (flags.ga4) return "ga4-only";
  return "rejected";
}

export function flagsFromChoice(choice: CookieChoice | null): ConsentFlags {
  if (choice === "accepted") return { clarity: true, ga4: true };
  if (choice === "clarity-only") return { clarity: true, ga4: false };
  if (choice === "ga4-only") return { clarity: false, ga4: true };
  return { clarity: false, ga4: false };
}

export function readCookieChoice(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (
      value === "accepted" ||
      value === "rejected" ||
      value === "clarity-only" ||
      value === "ga4-only"
    ) {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}

export function analyticsCookieNamesFromHeader(
  cookieHeader: string,
  targets: { clarity: boolean; ga4: boolean } = { clarity: true, ga4: true },
): string[] {
  if (!cookieHeader) return [];
  const names: string[] = [];
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    const name = (eq === -1 ? part : part.slice(0, eq)).trim();
    if (!name) continue;
    const isClarity = name === "_clck" || name === "_clsk";
    const isGa = name === "_ga" || name.startsWith("_ga_");
    if ((targets.clarity && isClarity) || (targets.ga4 && isGa)) {
      names.push(name);
    }
  }
  return Array.from(new Set(names));
}

export function clearAnalyticsCookies(
  targets: { clarity: boolean; ga4: boolean } = { clarity: true, ga4: true },
): void {
  if (typeof document === "undefined") return;
  const fallbackNames = [
    ...(targets.clarity ? ["_clck", "_clsk"] : []),
    ...(targets.ga4 ? ["_ga"] : []),
  ];
  const names = Array.from(
    new Set([
      ...analyticsCookieNamesFromHeader(document.cookie || "", targets),
      ...fallbackNames,
    ]),
  );
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const domains = Array.from(
    new Set([
      "",
      ...(host ? [host, `.${host}`] : []),
      ...(host.endsWith("scotlandcounted.org.uk") ? [".scotlandcounted.org.uk"] : []),
    ]),
  );

  for (const name of names) {
    if (!ANALYTICS_COOKIE_EXACT.has(name) && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      const domainAttr = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/${domainAttr}; SameSite=Lax`;
    }
  }
}

export function saveCookieChoice(choice: CookieChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COOKIE_STORAGE_KEY, choice);
  } catch {
    // Private browsing or blocked storage still updates the live session.
  }
  const flags = flagsFromChoice(choice);
  if (!flags.clarity || !flags.ga4) {
    clearAnalyticsCookies({ clarity: !flags.clarity, ga4: !flags.ga4 });
  }
  window.dispatchEvent(
    new CustomEvent<{ choice: CookieChoice }>(COOKIE_CONSENT_EVENT, {
      detail: { choice },
    }),
  );
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}
