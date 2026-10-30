import { test, expect, type Page } from "@playwright/test";

/*
 * The section menus have to fit on the screen they are drawn on.
 *
 * Each section in the header (Money, Benefits and the rest) opens its own
 * panel under the bar. The panel travels with the sticky header, so scrolling
 * the page cannot reveal the bottom of it: if it is taller than the room below
 * the bar, it has to stop at the bottom of the screen and scroll inside
 * itself. The old single browse panel once ran 663px off the bottom of a
 * 1440x900 screen, two whole sections of links that nothing could reach, and
 * no other test noticed. It needed measuring at real screen heights.
 *
 * At ordinary laptop heights every panel fits without scrolling. 480 stands
 * for a short window, or a laptop zoomed in, where the panels have to scroll.
 *
 * The desktop menus are xl only, so every width here is at least 1280.
 */

const SHORT = 480;
const HEIGHTS = [SHORT, 640, 720, 900, 1080];

/** Every section button in the header, so a new section is checked without editing this file. */
function sectionButtons(page: Page) {
  return page.getByRole("navigation", { name: "Main" }).locator('button[aria-controls="hub-panel"]');
}

async function openSection(page: Page, index: number) {
  const button = sectionButtons(page).nth(index);
  const name = (await button.textContent())?.trim() ?? "";
  await button.click();
  const panel = page.locator("#hub-panel");
  await expect(panel).toHaveAttribute("aria-label", `${name} menu`);
  return { panel, name };
}

for (const height of HEIGHTS) {
  test(`every section menu fits and stays reachable at 1440x${height}`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
    await page.setViewportSize({ width: 1440, height });
    await page.goto("/");
    const sections = await sectionButtons(page).count();
    expect(sections, "the header has no section buttons, so this proves nothing").toBeGreaterThan(0);

    for (let i = 0; i < sections; i++) {
      const { panel, name } = await openSection(page, i);
      const geometry = await panel.evaluate((el) => {
        const footer = el.lastElementChild!.getBoundingClientRect();
        return {
          panelBottom: Math.round(el.getBoundingClientRect().bottom),
          viewport: window.innerHeight,
          footerTop: Math.round(footer.top),
          footerBottom: Math.round(footer.bottom),
        };
      });

      // Nothing hangs off the bottom of the screen.
      expect(
        geometry.panelBottom,
        `${name}: the panel runs ${geometry.panelBottom - geometry.viewport}px past the screen`,
      ).toBeLessThanOrEqual(geometry.viewport);

      // The bottom strip, which carries the way out to every page, is always on screen.
      expect(geometry.footerTop, `${name}: the bottom strip is off the top`).toBeGreaterThanOrEqual(0);
      expect(geometry.footerBottom, `${name}: the bottom strip is off the bottom`).toBeLessThanOrEqual(
        geometry.viewport,
      );
      await expect(panel.getByRole("link", { name: /every page on the site/i })).toBeVisible();
    }
  });
}

test("every link in every section menu can be reached on a short screen", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
  await page.setViewportSize({ width: 1440, height: SHORT });
  await page.goto("/");
  const sections = await sectionButtons(page).count();

  for (let i = 0; i < sections; i++) {
    const { panel, name } = await openSection(page, i);
    const result = await panel.evaluate(async (el) => {
      const links = [...el.querySelectorAll("a")];
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

    expect(result.total, `${name}: the menu has no links, so this proves nothing`).toBeGreaterThan(5);
    expect(
      result.missed,
      `${name}: links that cannot be brought on screen:\n  ${result.missed.join("\n  ")}`,
    ).toEqual([]);
  }
});

test("scrolling inside a section menu does not scroll the page behind it", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
  await page.setViewportSize({ width: 1440, height: SHORT });
  await page.goto("/");
  const { panel, name } = await openSection(page, 0);
  const scroller = panel.locator(".overflow-y-auto");

  const range = await scroller.evaluate((el) => el.scrollHeight - el.clientHeight);
  expect(range, `${name}: the menu does not need to scroll at ${SHORT}px, so this proves nothing`).toBeGreaterThan(0);

  // A real mouse wheel, because only a real scroll can spill over onto the page.
  const box = (await scroller.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 400);

  await expect
    .poll(() => scroller.evaluate((el) => el.scrollTop), { message: "the menu did not scroll inside" })
    .toBeGreaterThan(0);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY), "scrolling the menu moved the page behind it").toBe(0);
});

test("the header height setting matches the real header", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "layout maths does not vary by engine");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const { panel } = await openSection(page, 0);

  /*
   * A panel's height limit is the screen height minus --header-h. If that
   * token ever stops matching the real header, a panel is either cut short or
   * runs off the screen again, and the failure is silent. This checks the
   * token against the measurement rather than trusting it.
   */
  const measured = await panel.evaluate((el) => {
    const header = document.querySelector('nav[aria-label="Main"]')!.closest("header")!;
    return {
      token: getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim(),
      headerBottom: Math.round(header.getBoundingClientRect().bottom),
      panelTop: Math.round(el.getBoundingClientRect().top),
    };
  });

  expect(measured.token, "--header-h no longer matches the height of the header").toBe(
    `${measured.headerBottom}px`,
  );
  expect(measured.panelTop, "the panel overlaps the header").toBeGreaterThanOrEqual(measured.headerBottom);
});
