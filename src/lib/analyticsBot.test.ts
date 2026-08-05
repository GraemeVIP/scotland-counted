import { test } from "node:test";
import assert from "node:assert/strict";
import { isLikelyAutomatedUserAgent } from "./analyticsBot.ts";

test("recognises crawlers and common browser automation", () => {
  for (const userAgent of [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Google-InspectionTool/1.0",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "facebookexternalhit/1.1",
    "Mozilla/5.0 HeadlessChrome/138.0.0.0 Safari/537.36",
    "Mozilla/5.0 Chrome-Lighthouse",
    "python-requests/2.32.0",
  ]) {
    assert.equal(isLikelyAutomatedUserAgent(userAgent), true, userAgent);
  }
});

test("allows normal browser user agents", () => {
  for (const userAgent of [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Version/18.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
  ]) {
    assert.equal(isLikelyAutomatedUserAgent(userAgent), false, userAgent);
  }
});
