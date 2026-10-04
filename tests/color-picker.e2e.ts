import { expect, test } from "@playwright/test";

async function openPicker(page: import("@playwright/test").Page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(test.info().project.use.baseURL ?? "http://localhost:4173/");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await page.getByLabel("Hex color value").fill("696159");
  await page
    .locator('[data-scope="color-picker"][data-part="trigger"]')
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("keeps overlapping page helper text behind the picker", async ({
  page,
}) => {
  await openPicker(page);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const panel = document.querySelector(
          '[data-scope="color-picker"][data-part="content"]',
        )!;
        const bounds = panel.getBoundingClientRect();
        const helpers = [
          ...document.querySelectorAll(
            '[aria-label="Color representations"] p',
          ),
        ];
        const overlapping = helpers.flatMap((helper) => {
          const rect = helper.getBoundingClientRect();
          const left = Math.max(rect.left, bounds.left);
          const right = Math.min(rect.right, bounds.right);
          const y = rect.top + rect.height / 2;
          return left < right && y > bounds.top && y < bounds.bottom
            ? [panel.contains(document.elementFromPoint((left + right) / 2, y))]
            : [];
        });
        return overlapping.length > 0 && overlapping.every(Boolean);
      }),
    )
    .toBe(true);
});

test("centers the hue track and thumb vertically", async ({ page }) => {
  await openPicker(page);
  const track = await page
    .locator('[data-part="channel-slider-track"]')
    .boundingBox();
  const thumb = await page.getByRole("slider", { name: "hue" }).boundingBox();
  expect(track).not.toBeNull();
  expect(thumb).not.toBeNull();
  expect(
    Math.abs(track!.y + track!.height / 2 - thumb!.y - thumb!.height / 2),
  ).toBeLessThan(1);
});
