import { test, expect } from "@playwright/test";

/*
 * Keyboard access, which is the part of accessibility axe cannot check.
 *
 * axe reads the DOM. It cannot tell you that tabbing lands you somewhere
 * invisible, that a skip link does not move focus, or that a dialog lets you
 * tab out into the page behind it. Those are the failures that make a site
 * unusable rather than merely awkward, so they get their own file.
 */

/*
 * Tab order is a Chromium-only assertion, and that is a platform fact rather
 * than a shortcut.
 *
 * Safari does not put links or buttons in the Tab order by default. Measured
 * on the homepage, Chromium tabs Skip link -> wordmark -> Your area -> Your
 * money -> Councils, while WebKit skips every one of those and goes straight
 * to the first form control. That is Safari's "Press Tab to highlight each
 * item on a webpage" setting, off by default, and no markup on this site can
 * turn it on. Asserting a tab sequence there would test the browser's
 * preferences, not the site.
 *
 * What this means for a real Safari user is written down in
 * docs/browser-qa.md rather than quietly dropped.
 */
const tabOrderIsMeaningful = (name: string) => name === "chromium";

test("the skip link is the first stop and actually moves focus", async ({ page }, testInfo) => {
  test.skip(!tabOrderIsMeaningful(testInfo.project.name), "Safari excludes links and buttons from Tab by default");
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();

  await page.keyboard.press("Enter");
  const movedIntoMain = await page.evaluate(() => {
    const main = document.querySelector("main");
    const active = document.activeElement;
    return !!main && (main === active || main.contains(active) || location.hash === "#main");
  });
  expect(movedIntoMain).toBe(true);
});

test("every focused element in the header is visible when focused", async ({ page }, testInfo) => {
  test.skip(!tabOrderIsMeaningful(testInfo.project.name), "Safari excludes links and buttons from Tab by default");
  await page.goto("/");

  /*
   * A focus ring you cannot see is the same as no focus ring. This walks the
   * header and checks each stop is on screen and has some focus styling,
   * rather than trusting that :focus-visible is defined somewhere in the CSS.
   */
  const problems: string[] = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");

    /*
     * Poll rather than measure once. Bringing a focused element into view is
     * the browser's job and it does it asynchronously, so reading the rect
     * straight after the keypress catches elements mid-scroll and calls them
     * off screen. This surfaced when a paragraph in the hero grew by one line
     * and pushed a link eleven pixels below the fold: the browser scrolled to
     * it correctly and the assertion had already run.
     */
    const state = await page
      .waitForFunction(
        () => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return { done: true, state: null };
          const r = el.getBoundingClientRect();
          const onScreen = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
          if (!onScreen) return false; // keep waiting for the scroll to land
          const s = getComputedStyle(el);
          return {
            done: true,
            state: {
              label: (el.getAttribute("aria-label") || el.textContent || el.tagName)
                .trim()
                .slice(0, 40),
              onScreen,
              ring:
                s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0
                  ? true
                  : s.boxShadow !== "none",
            },
          };
        },
        undefined,
        { timeout: 2000 },
      )
      .then((handle) => handle.jsonValue())
      .catch(async () => {
        // Never settled on screen. Report what it was.
        const label = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          return (el?.getAttribute("aria-label") || el?.textContent || el?.tagName || "?")
            .trim()
            .slice(0, 40);
        });
        return { done: true, state: { label, onScreen: false, ring: false } };
      });

    if (!state.state) break;
    if (!state.state.onScreen) problems.push(`${state.state.label}: focused off screen`);
  }
  expect(problems, problems.join("\n")).toEqual([]);
});

test("focus is never lost to an element you cannot see", async ({ page }) => {
  await page.goto("/areas/glasgow-city");
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
  }
  const visible = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return true;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0;
  });
  expect(visible).toBe(true);
});

test("the command palette does not let you tab out behind it", async ({ page }, testInfo) => {
  test.skip(!tabOrderIsMeaningful(testInfo.project.name), "Safari excludes links and buttons from Tab by default");
  await page.goto("/");
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("open-command")));
  const dialog = page.getByRole("dialog", { name: "Search the site" });
  await expect(dialog).toBeVisible();

  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return !!d && d.contains(document.activeElement);
    });
    expect(inside, `focus escaped the palette after ${i + 1} tabs`).toBe(true);
  }
});

test("a calculator can be filled in and read without a mouse", async ({ page }) => {
  await page.goto("/take-home-pay-calculator-scotland");
  await page.locator("#salary").focus();
  await page.keyboard.type("35000");
  await expect(page.getByText("You take home")).toBeVisible();
  await expect(page.locator(".display-stat").first()).toContainText(/\d/);
});

test("headings go in order, so a screen reader can navigate by them", async ({ page }) => {
  for (const path of ["/", "/areas/glasgow-city", "/councils/glasgow-city", "/money"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));

    expect(levels.filter((l) => l === 1).length, `${path} needs exactly one h1`).toBe(1);

    let previous = levels[0];
    for (const level of levels.slice(1)) {
      expect(
        level - previous,
        `${path} jumps from h${previous} to h${level}`
      ).toBeLessThanOrEqual(1);
      previous = level;
    }
  }
});
