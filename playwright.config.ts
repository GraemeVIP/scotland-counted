import { defineConfig, devices } from "@playwright/test";

/*
 * Browser QA for the journeys that matter.
 *
 * Everything else in this repository is checked without a browser: types,
 * unit tests, a proxy check over real sockets, an indexability crawl of all
 * 410 sitemap URLs. None of that can tell you whether the mobile menu traps
 * focus, whether a calculator is reachable from the keyboard, or whether a
 * page scrolls sideways on a 390px phone. That is what this is for.
 *
 * The server is a production build, not the dev server. Dev serves different
 * HTML, skips the real chunking and is the one build nobody visits.
 */
const PORT = 3311;
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    /*
     * WebKit stands in for Safari. It is the same engine family and catches
     * the usual Safari-only breakages, but it is WebKit on macOS, not iOS
     * Safari: no real touch, no software keyboard, no iOS viewport quirks.
     * docs/browser-qa.md lists what still needs a real handset.
     */
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
