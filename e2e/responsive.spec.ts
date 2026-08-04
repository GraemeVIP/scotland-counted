import { test, expect } from "@playwright/test";

/*
 * The five widths the brief names, checked for the one failure that makes a
 * page feel broken rather than merely tight: sideways scroll.
 *
 * A phone that scrolls horizontally reads as a bug to everybody and as a
 * dead end to anyone using zoom or a screen magnifier. It is almost always a
 * single element that forgot to wrap, so the test names the element.
 */
const WIDTHS = [390, 768, 1024, 1280, 1440];

const PAGES = [
  "/",
  "/areas",
  "/areas/glasgow-city",
  "/councils/glasgow-city",
  "/money",
  "/who-decides",
  "/take-home-pay-calculator-scotland",
  "/council-tax-bands-scotland",
  "/find-my-mp-and-msp",
  "/data",
  "/blog",
];

for (const width of WIDTHS) {
  test(`nothing scrolls sideways at ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine here");
    await page.setViewportSize({ width, height: 900 });

    for (const path of PAGES) {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const overflow = await page.evaluate((viewport) => {
        const doc = document.documentElement;
        if (doc.scrollWidth <= viewport + 1) return null;

        /*
         * Name the widest offender rather than just reporting the number.
         * Anything that legitimately scrolls inside its own box is excluded,
         * because a wide table in an overflow-x container is correct.
         */
        const scrolls = (el: Element) => {
          const o = getComputedStyle(el).overflowX;
          return o === "auto" || o === "scroll";
        };
        let worst: { tag: string; width: number; right: number } | null = null;
        for (const el of Array.from(document.body.querySelectorAll("*"))) {
          if (el.closest("[data-allow-overflow]")) continue;
          let parent = el.parentElement;
          let contained = false;
          while (parent && parent !== document.body) {
            if (scrolls(parent)) { contained = true; break; }
            parent = parent.parentElement;
          }
          if (contained) continue;
          const rect = el.getBoundingClientRect();
          if (rect.right > viewport + 1 && (!worst || rect.right > worst.right)) {
            worst = {
              tag: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)}`,
              width: Math.round(rect.width),
              right: Math.round(rect.right),
            };
          }
        }
        return { scrollWidth: doc.scrollWidth, worst };
      }, width);

      expect(
        overflow,
        `${path} at ${width}px scrolls to ${overflow?.scrollWidth}px. Widest: ${JSON.stringify(overflow?.worst)}`
      ).toBeNull();
    }
  });
}

test("body text stays readable when a page is zoomed to 200%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "one engine is enough");
  /*
   * WCAG 1.4.4 wants 200% without loss of content. Emulating it as a 640px
   * viewport at 1280 CSS pixels is the standard approximation.
   */
  await page.setViewportSize({ width: 640, height: 900 });
  for (const path of ["/", "/areas/glasgow-city", "/money"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth, `${path} loses content at 200% zoom`).toBeLessThanOrEqual(641);
  }
});

test("the tap targets in the header are big enough to hit", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "one engine is enough");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  /* WCAG 2.2 AA asks for 24x24 CSS pixels. The header is the worst case. */
  const small = await page
    .locator("header a, header button")
    .evaluateAll((els) =>
      els
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) };
        })
        .filter((t) => t.w < 24 || t.h < 24)
    );
  expect(small, `tap targets under 24px: ${JSON.stringify(small)}`).toEqual([]);
});
