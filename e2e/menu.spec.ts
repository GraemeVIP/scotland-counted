import { test, expect, type Page } from "@playwright/test";

/*
 * The browse panel has to fit on the screen it is drawn on.
 *
 * It renders inside the sticky header, so it travels with it. When the
 * content was taller than the room below the bar there was nothing to
 * scroll: the page moved and the panel moved with it, so the bottom simply
 * sat off screen. Measured at 1440x900 the panel was 1495px tall against
 * 832px of room, and 663px of it, two whole sections and every link in them,
 * could not be reached by any means.
 *
 * No existing test caught it. Every link was in the DOM, every href was
 * right, and axe has nothing to say about a thing that is rendered but
 * unreachable. It needed measuring at a real viewport height.
 *
 * The desktop panel is xl-only, so every width here is at least 1280.
 */

const HEIGHTS = [640, 720, 900, 1080];

async function openPanel(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Everything on this site" }).click();
  const panel = page.locator("#browse-panel");
  await expect(panel).toBeVisible();
  return panel;
}

for (const height of HEIGHTS) {
  test(`the browse panel fits and stays reachable at 1440x${height}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
    await page.setViewportSize({ width: 1440, height });
    const panel = await openPanel(page);

    const geometry = await panel.evaluate((el) => {
      const scroller = el.querySelector<HTMLElement>(".overflow-y-auto")!;
      const footer = el.lastElementChild!.getBoundingClientRect();
      const p = el.getBoundingClientRect();
      return {
        panelBottom: Math.round(p.bottom),
        viewport: window.innerHeight,
        scrollRange: Math.round(scroller.scrollHeight - scroller.clientHeight),
        footerBottom: Math.round(footer.bottom),
        footerTop: Math.round(footer.top),
      };
    });

    // Nothing hangs off the bottom of the screen.
    expect(
      geometry.panelBottom,
      `the panel runs ${geometry.panelBottom - geometry.viewport}px past the viewport`,
    ).toBeLessThanOrEqual(geometry.viewport);

    // The footer strip, which carries the escape hatch, is always on screen.
    expect(geometry.footerTop).toBeGreaterThanOrEqual(0);
    expect(geometry.footerBottom).toBeLessThanOrEqual(geometry.viewport);
    await expect(panel.getByRole("link", { name: /every page on this site/i })).toBeVisible();
  });
}

test("every link in the panel can be reached by scrolling inside it", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
  await page.setViewportSize({ width: 1440, height: 720 });
  const panel = await openPanel(page);

  const unreachable = await panel.evaluate(async (el) => {
    const scroller = el.querySelector<HTMLElement>(".overflow-y-auto")!;
    const links = [...scroller.querySelectorAll("a")];
    const missed: string[] = [];

    for (const link of links) {
      link.scrollIntoView({ block: "nearest" });
      await new Promise((r) => requestAnimationFrame(r));
      const r = link.getBoundingClientRect();
      const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.height > 0;
      if (!onScreen) missed.push(link.textContent?.trim().slice(0, 40) ?? "(unnamed)");
    }
    return { missed, total: links.length };
  });

  expect(unreachable.total, "the panel has no links, so this proves nothing").toBeGreaterThan(20);
  expect(
    unreachable.missed,
    `links that cannot be brought on screen:\n  ${unreachable.missed.join("\n  ")}`,
  ).toEqual([]);
});

test("scrolling the panel does not scroll the page behind it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
  await page.setViewportSize({ width: 1440, height: 720 });
  const panel = await openPanel(page);

  const result = await panel.evaluate(async (el) => {
    const scroller = el.querySelector<HTMLElement>(".overflow-y-auto")!;
    const pageBefore = window.scrollY;
    scroller.scrollTop = scroller.scrollHeight;
    await new Promise((r) => setTimeout(r, 200));
    return {
      scrolledInside: scroller.scrollTop > 0,
      pageMoved: window.scrollY !== pageBefore,
    };
  });

  expect(result.scrolledInside, "the panel did not scroll internally").toBe(true);
  expect(result.pageMoved, "scrolling the menu moved the page behind it").toBe(false);
});

test("the header bar and the panel agree on where the header ends", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPanel(page);

  /*
   * The panel's height budget is 100dvh minus --header-h. If that token ever
   * stops matching the real bar, the panel is either short or overflows
   * again, and the failure is silent. This checks the token against the
   * measurement rather than trusting it.
   */
  const agree = await page.evaluate(() => {
    const token = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-h")
      .trim();
    const panelTop = document.querySelector("#browse-panel")!.getBoundingClientRect().top;
    return { token, panelTop: Math.round(panelTop) };
  });

  expect(agree.token).toBe("68px");
  expect(
    agree.panelTop,
    "--header-h no longer matches the height of the bar above the panel",
  ).toBe(parseInt(agree.token, 10));
});
