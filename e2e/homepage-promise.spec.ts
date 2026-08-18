import { test, expect, type Page } from "@playwright/test";

/*
 * Does the homepage do what the homepage says?
 *
 * The hero promises figures for your area, what the council spends, what you
 * keep from your pay and who controls each of it. The form under it used to
 * go straight to the email composer, so the reader was told about four things
 * and shown the fifth. Nothing was broken in a way any existing test could
 * see: the code was right and the sentence above it was not.
 *
 * These tests hold the journey to the promise. The Parliament lookup is
 * stubbed so they do not go red when somebody else's server is slow; the real
 * API is exercised by npm run check:reps.
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
  regionalMsps: [
    {
      role: "MSP",
      representationType: "regional",
      name: "Test Regional MSP",
      party: "Test Party",
      constituency: "Glasgow",
      email: "regional@parliament.test",
      profileUrl: "https://parliament.test/regional",
    },
  ],
  holyrood: {
    constituency: "Glasgow Kelvin",
    region: "Glasgow",
    source: { name: "Scottish Parliament Open Data", url: "https://data.parliament.scot", checkedAt: "2026-08-02T13:25:11.081Z" },
  },
};
LOOKUP.msp = LOOKUP.constituencyMsp;

async function stub(page: Page, body: unknown = LOOKUP, status = 200) {
  await page.route("**/api/representatives", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }),
  );
}

async function lookUp(page: Page, postcode = "G12 8QQ") {
  await page.goto("/");
  await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").fill(postcode);
  await page.getByRole("button", { name: "Check my area" }).click();
}

test("the homepage still promises local information", async ({ page }) => {
  /*
   * The guard against fixing this the wrong way round. An earlier attempt
   * weakened the hero to match the old behaviour, which would have undone the
   * repositioning. The promise is correct; the journey had to meet it.
   */
  await page.goto("/");
  const lede = (
    await page.locator("main p").filter({ hasText: /postcode/i }).first().innerText()
  ).toLowerCase();

  expect(lede, "the hero stopped promising local figures").toMatch(
    /figures for your area|your area, your council/,
  );
  expect(lede).toMatch(/council/);

  // And the CTA names the first thing the reader gets, not the last.
  await expect(page.getByRole("button", { name: "Check my area" })).toBeVisible();
});

test("a valid postcode shows the local result first", async ({ page }) => {
  await stub(page);
  await lookUp(page);

  const result = page.getByTestId("local-result");
  await expect(result).toBeVisible();
  await expect(page.getByTestId("local-council")).toHaveText("Glasgow City");

  // Still on the homepage. Nothing navigated on the reader's behalf.
  await expect(page).toHaveURL(/\/$/);
});

test("the visitor is not taken to the email composer automatically", async ({ page }) => {
  await stub(page);
  await lookUp(page);
  await expect(page.getByTestId("local-result")).toBeVisible();

  // Give any stray navigation a chance to happen before asserting it did not.
  await page.waitForTimeout(1200);
  await expect(page).not.toHaveURL(/email-your-mp-and-msp/);
  await expect(page.getByTestId("write-email")).toBeVisible();
});

test("the raw postcode never appears in the URL", async ({ page }) => {
  const seen: string[] = [];
  page.on("framenavigated", () => seen.push(page.url()));
  page.on("request", (r) => {
    expect(r.url(), "a postcode reached a request URL").not.toMatch(/G12\s*8QQ|G128QQ/i);
  });

  await stub(page);
  await lookUp(page);
  await expect(page.getByTestId("local-result")).toBeVisible();

  expect(page.url()).not.toMatch(/G12|8QQ/i);
  for (const url of seen) expect(url).not.toMatch(/G12|8QQ/i);
});

test("the result identifies the resolved council and both representatives", async ({ page }) => {
  await stub(page);
  await lookUp(page);

  const result = page.getByTestId("local-result");
  await expect(result).toContainText("Glasgow City");
  await expect(result).toContainText("Test MP");
  await expect(result).toContainText("Glasgow North");
  await expect(result).toContainText("Test MSP");
  await expect(result).toContainText("Glasgow Kelvin");

  // Regional MSPs are present, behind a disclosure rather than dumped inline.
  await expect(result.getByText(/regional MSPs/i)).toBeVisible();

  // Freshness, so the reader knows how old the names are.
  await expect(result).toContainText(/checked 2 August 2026/i);
});

test("the local result carries the figures the hero promises", async ({ page }) => {
  await stub(page);
  await lookUp(page);
  const result = page.getByTestId("local-result");

  // Area figures, council money, who decides, and a route to pay and tax.
  await expect(result).toContainText("in poverty after housing costs");
  await expect(result).toContainText(/council said it was short|left over/);
  await expect(result).toContainText(/decided at\s+Westminster/);
  await expect(result.locator('a[href="/areas/glasgow-city"]')).toBeVisible();
  await expect(result.locator('a[href="/councils/glasgow-city"]')).toBeVisible();
  await expect(
    result.locator('a[href="/council-tax-bands-scotland/glasgow-city"]'),
  ).toBeVisible();
  await expect(
    result.locator('a[href="/take-home-pay-calculator-scotland"]'),
  ).toBeVisible();
  await expect(result.locator('a[href="/who-decides"]')).toBeVisible();
});

test("the email action is still there, and only runs when asked", async ({ page }) => {
  await stub(page);
  await lookUp(page);
  await expect(page.getByTestId("local-result")).toBeVisible();

  await page.getByTestId("write-email").click();
  await expect(page).toHaveURL(/email-your-mp-and-msp/);
  expect(page.url(), "the postcode was carried in the URL").not.toMatch(/G12|8QQ/i);
});

test("an invalid postcode gives a useful error and no result", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").fill("NOT A POSTCODE");
  await page.getByRole("button", { name: "Check my area" }).click();

  const alert = page.getByRole("alert").filter({ hasText: /postcode/i });
  await expect(alert).toBeVisible();
  await expect(page.getByTestId("local-result")).toBeHidden();
});

test("an unsupported postcode is explained rather than swallowed", async ({ page }) => {
  // A real English postcode: valid shape, outside the data this site covers.
  await stub(page, { error: "That postcode is not in Scotland." }, 400);
  await lookUp(page, "SW1A 1AA");

  // Filtered: Next ships a route announcer that is also role="alert".
  await expect(
    page.getByRole("alert").filter({ hasText: /Scotland/i }),
  ).toContainText(/not in Scotland/i);
  await expect(page.getByTestId("local-result")).toBeHidden();
});

test("the whole journey works from the keyboard alone", async ({ page }) => {
  await stub(page);
  await page.goto("/");

  await page.getByPlaceholder("Your postcode, e.g. G12 8QQ").focus();
  await page.keyboard.type("G12 8QQ");
  await page.keyboard.press("Enter");

  const result = page.getByTestId("local-result");
  await expect(result).toBeVisible();
  // Focus moves to the answer, so a screen reader lands on it rather than
  // being left at the form with the result somewhere below.
  await expect(result).toBeFocused();
});

test("the result works at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stub(page);
  await lookUp(page);

  const result = page.getByTestId("local-result");
  await expect(result).toBeVisible();
  await expect(page.getByTestId("local-council")).toHaveText("Glasgow City");

  // The answer must not push the page sideways on a phone.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, "the local result causes sideways scroll at 390px").toBeLessThanOrEqual(1);
});

test("the header keeps a direct route to the email tool", async ({ page }) => {
  await page.goto("/");
  const direct = page.locator('header a[href="/email-your-mp-and-msp"]');
  await expect(direct.first()).toHaveText(/email your mp/i);
});
