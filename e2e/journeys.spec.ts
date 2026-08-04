import { test, expect, type Page } from "@playwright/test";

/*
 * The things a reader actually does here, driven in a real browser.
 *
 * These run in Chromium and WebKit. Anything that depends on a live
 * Parliament API is stubbed, because a QA suite that fails when somebody
 * else's server is slow teaches you to ignore it.
 */

const LOOKUP = {
  postcode: "G12 8QQ",
  council: { name: "Glasgow City", slug: "glasgow-city" },
  mp: {
    role: "MP",
    name: "Test MP",
    party: "Test Party",
    constituency: "Glasgow North",
    email: "test.mp@parliament.test",
    profileUrl: "https://parliament.test/mp",
  },
  msp: null as unknown,
  constituencyMsp: {
    role: "MSP",
    representationType: "constituency",
    name: "Test MSP",
    party: "Test Party",
    constituency: "Glasgow Kelvin",
    email: "test.msp@parliament.test",
    profileUrl: "https://parliament.test/msp",
  },
  regionalMsps: [],
  holyrood: {
    constituency: "Glasgow Kelvin",
    region: "Glasgow",
    source: { name: "Test", url: "https://parliament.test" },
  },
};
LOOKUP.msp = LOOKUP.constituencyMsp;

async function stubLookup(page: Page) {
  await page.route("**/api/representatives", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(LOOKUP),
    });
  });
}

test.describe("the postcode journey", () => {
  test("resolves to people and to shareable local pages", async ({ page }) => {
    await stubLookup(page);
    await page.goto("/representatives");

    await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").fill("G12 8QQ");
    await page.getByRole("button", { name: "Show my representatives" }).click();

    await expect(page.getByRole("heading", { name: "Your representatives" })).toBeVisible();
    await expect(page.getByText("Test MP")).toBeVisible();

    const local = page.getByRole("heading", { name: "Everything else about your area" });
    await expect(local).toBeVisible();

    for (const href of [
      "/areas/glasgow-city",
      "/councils/glasgow-city",
      "/council-tax-bands-scotland/glasgow-city",
      "/constituencies/glasgow-north",
    ]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("never puts the postcode in the URL, in history, or in storage", async ({ page }) => {
    await stubLookup(page);
    await page.goto("/representatives");
    await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").fill("G12 8QQ");
    await page.getByRole("button", { name: "Show my representatives" }).click();
    await expect(
      page.getByRole("heading", { name: "Everything else about your area" })
    ).toBeVisible();

    expect(page.url()).not.toMatch(/G12|8QQ/i);
    const stored = await page.evaluate(() => ({
      local: JSON.stringify(localStorage),
      session: JSON.stringify(sessionStorage),
    }));
    expect(stored.local).not.toMatch(/G12\s?8QQ/i);
    expect(stored.session).not.toMatch(/G12\s?8QQ/i);
  });

  test("a real request is a POST, so the postcode cannot reach a log", async ({ page }) => {
    const methods: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/representatives")) methods.push(r.method());
      // Nothing anywhere should carry a postcode in a URL.
      expect(r.url()).not.toMatch(/postcode=/i);
    });
    await stubLookup(page);
    await page.goto("/representatives");
    await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").fill("G12 8QQ");
    await page.getByRole("button", { name: "Show my representatives" }).click();
    await expect(
      page.getByRole("heading", { name: "Everything else about your area" })
    ).toBeVisible();
    expect(methods).toEqual(["POST"]);
  });

  test("a bad postcode says so instead of failing silently", async ({ page }) => {
    await page.goto("/representatives");
    await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").fill("NOT A POSTCODE");
    await page.getByRole("button", { name: "Show my representatives" }).click();
    /*
     * Named, not just any alert: Next.js ships a route announcer that is also
     * role="alert", so an unqualified match finds two and tells you nothing
     * about whether the reader was actually told anything.
     */
    await expect(page.getByRole("alert").filter({ hasText: /postcode/i })).toBeVisible();
  });
});

test.describe("the calculators", () => {
  test("take-home pay works from the keyboard alone and updates", async ({ page }) => {
    await page.goto("/take-home-pay-calculator-scotland");

    const salary = page.locator("#salary");
    await salary.fill("30000");
    await expect(page.getByText("You take home")).toBeVisible();

    const firstResult = await page.locator(".display-stat").first().innerText();
    expect(firstResult).toMatch(/[£\d]/);

    await salary.fill("60000");
    await expect
      .poll(async () => page.locator(".display-stat").first().innerText())
      .not.toBe(firstResult);
  });

  test("the calculator is browser-only: the figures never leave the page", async ({
    page,
  }) => {
    /*
     * The claim on the page is that the sum is worked out in the browser and
     * the numbers are not sent anywhere. Asserting "no request at all" would
     * be asserting something else, and would fail on the analytics tag that
     * loads on every page. So this watches for the salary itself, in any URL
     * or any request body, which is the thing actually promised.
     */
    const SALARY = "42500";
    const leaks: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes(SALARY)) leaks.push(`url: ${r.url()}`);
      const body = r.postData();
      if (body && body.includes(SALARY)) leaks.push(`body: ${r.url()}`);
    });
    await page.goto("/take-home-pay-calculator-scotland");
    await page.locator("#salary").fill(SALARY);
    await expect(page.getByText("You take home")).toBeVisible();
    await page.waitForTimeout(1200);
    expect(leaks, leaks.join("\n")).toEqual([]);
  });

  test("council tax lookup accepts a postcode and stays private", async ({ page }) => {
    await page.route("**/api/postcode-area", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          postcode: "G12 8QQ",
          council: { name: "Glasgow City", slug: "glasgow-city" },
        }),
      });
    });
    await page.goto("/council-tax-bands-scotland");
    await page.locator("#ct-postcode").fill("G12 8QQ");
    await page.locator("#ct-postcode").press("Enter");
    await expect(page.getByText(/Glasgow City/).first()).toBeVisible();
    expect(page.url()).not.toMatch(/G12|8QQ/i);
  });
});

test.describe("the command palette", () => {
  test("opens with the keyboard, searches, and closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog", { name: "Search the site" });
    await expect(dialog).toBeVisible();

    // Focus must be inside, or a keyboard user is typing into the page behind.
    await expect(dialog.getByRole("combobox", { name: "Search" })).toBeFocused();

    /*
     * Results are combobox options, not anchors: they are buttons that route
     * on click, with aria-activedescendant tracking the highlighted one.
     */
    await page.keyboard.type("Glasgow");
    await expect(dialog.getByRole("option").first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("takes you somewhere real", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("open-command")));
    const dialog = page.getByRole("dialog", { name: "Search the site" });
    await dialog.getByRole("combobox", { name: "Search" }).fill("Glasgow");

    const first = dialog.getByRole("option").first();
    await expect(first).toBeVisible();
    await first.click();

    // It routed somewhere, closed behind itself, and did not land on a 404.
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).not.toContainText(
      /does not exist/i
    );
  });
});

test.describe("the mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, holds focus, closes on Escape and returns focus", async ({ page }, testInfo) => {
    await page.goto("/");
    const opener = page.getByRole("button", { name: "Menu" });
    await opener.click();

    const close = page.getByRole("button", { name: "Close the menu" });
    await expect(close).toBeVisible();

    /*
     * Focus must land inside the sheet, not stay on the burger behind it.
     * Scoped by id: [aria-label="Main"] also matches the desktop nav, which
     * is display:none at this width but still in the DOM, and matching that
     * one made this assertion pass while the real thing was broken.
     */
    const focusInsideSheet = await page.evaluate(() => {
      const sheet = document.querySelector("#mobile-nav");
      return !!sheet && sheet.contains(document.activeElement);
    });
    expect(focusInsideSheet, "opening the menu left focus behind it").toBe(true);

    await page.keyboard.press("Escape");
    await expect(close).toBeHidden();

    /*
     * On close, focus goes back to whatever had it. In Chromium that is the
     * burger. WebKit never focuses a button on click in the first place, so
     * there is nothing to give it back to and the best that can be asserted
     * is that focus is not stranded inside a sheet that no longer exists.
     */
    if (testInfo.project.name === "chromium") {
      await expect(opener).toBeFocused();
    } else {
      const stranded = await page.evaluate(() => {
        const active = document.activeElement;
        return !!active && !document.body.contains(active);
      });
      expect(stranded, "focus was left on a removed element").toBe(false);
    }
  });

  test("its links go somewhere", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    /*
     * The sheet lists SECTIONS, not the header's PRIMARY, so the label here
     * is the fuller one. Scoped to the sheet because the footer sitting
     * behind it has its own link to the same page.
     */
    const link = page
      .locator("#mobile-nav")
      .getByRole("link", { name: "All 32 council records" })
      .first();
    await link.click();
    await expect(page).toHaveURL(/\/councils$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("downloads and embeds", () => {
  test("every published dataset actually serves a CSV", async ({ page, request }) => {
    await page.goto("/data");
    const hrefs = await page.locator('a[href$=".csv"]').evaluateAll((links) =>
      links.map((l) => (l as HTMLAnchorElement).getAttribute("href")!)
    );
    expect(hrefs.length).toBeGreaterThan(3);

    for (const href of [...new Set(hrefs)]) {
      const response = await request.get(href);
      expect(response.status(), `${href} did not serve`).toBe(200);
      const type = response.headers()["content-type"] ?? "";
      expect(type, `${href} is not served as CSV`).toMatch(/csv|text\/plain|octet-stream/);
      const body = await response.text();
      expect(body.split("\n").length, `${href} has no rows`).toBeGreaterThan(2);
    }
  });

  test("an embed renders on its own and says it can be framed", async ({ page, request }) => {
    const response = await request.get("/embed/child-poverty");
    if (response.status() === 404) test.skip(true, "no embed at this path");
    expect(response.status()).toBe(200);
    expect(response.headers()["x-frame-options"]).toBeUndefined();
    await page.goto("/embed/child-poverty");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("theme and motion", () => {
  test("the toggle switches theme and the choice survives a reload", async ({ page }) => {
    await page.goto("/");
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.getByRole("button", { name: "Switch between light and dark" }).click();
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.dataset.theme))
      .not.toBe(before);

    const chosen = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(chosen);
  });

  test("reduced motion is respected, not merely declared", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    /*
     * Every animation and transition should be effectively instant. A site
     * that ignores this setting can make somebody physically unwell, and it
     * is one media query to honour.
     */
    const moving = await page.evaluate(() => {
      const offenders: string[] = [];
      for (const el of Array.from(document.querySelectorAll("*")).slice(0, 2500)) {
        const s = getComputedStyle(el);
        const seconds = (v: string) =>
          Math.max(0, ...v.split(",").map((p) => parseFloat(p) || 0));
        const total =
          seconds(s.animationDuration) + seconds(s.transitionDuration);
        if (total > 0.12) offenders.push(`${el.tagName}.${el.className}`.slice(0, 90));
      }
      return offenders;
    });
    expect(moving, `still animating under reduced motion:\n  ${moving.join("\n  ")}`).toEqual(
      []
    );
  });
});

test.describe("the 404", () => {
  test("returns 404, says so, and offers a way back", async ({ page }) => {
    const response = await page.goto("/no-such-page-anywhere");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/does not exist/i);
    const home = page.locator('a[href="/"]').first();
    await expect(home).toBeVisible();
  });
});
