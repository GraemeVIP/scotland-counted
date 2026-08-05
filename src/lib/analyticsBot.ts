/**
 * User-agent fragments that identify crawlers and common browser automation.
 * These visitors may still read the public site; they simply do not start the
 * client-side analytics libraries.
 */
export const ANALYTICS_BOT_PATTERN =
  /(?:bot|crawler|spider|crawling|headless|lighthouse|pagespeed|inspectiontool|slurp|facebookexternalhit|bingpreview|python-requests|curl|wget|httpclient|uptimerobot)/i;

export function isLikelyAutomatedUserAgent(userAgent: string) {
  return ANALYTICS_BOT_PATTERN.test(userAgent);
}
