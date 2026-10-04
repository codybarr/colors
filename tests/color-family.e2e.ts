import { expect, test } from "@playwright/test";

for (const width of [1440, 375]) {
  test(`updates family labels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
    const hex = page.getByLabel("Hex color value");
    for (const [value, family] of [
      ["0000FF", "Blue"],
      ["800080", "Purple"],
      ["FF0000", "Red"],
      ["008000", "Green"],
      ["00FFFF", "Cyan — mostly blue"],
      ["008080", "Teal — mostly green"],
    ]) {
      await hex.fill(value);
      await expect(page.getByTestId("selected-color-family")).toHaveText(
        `Color family: ${family}`,
      );
      await expect(page.getByTestId("selected-color-family")).toBeVisible();
      await expect(
        page
          .locator('[aria-live="polite"][aria-atomic="true"]')
          .filter({ hasText: "Selected color:" }),
      ).toContainText(`color family: ${family}`);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}

test("classifies the selected color independently of its named-color match", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await page.getByLabel("Hex color value").fill("6040D0");
  await expect(page.getByTestId("selected-color-family")).toHaveText(
    "Color family: Purple",
  );
  await expect(page.getByTestId("match-color-family")).toHaveText(
    "Color family: Blue",
  );
  await page.getByRole("button", { name: "Use named color" }).click();
  await expect(page.getByTestId("selected-color-family")).toHaveText(
    "Color family: Blue",
  );
  await expect(page.getByText("Exact match", { exact: true })).toBeVisible();
});

test("identifies saved swatches on hover and keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await page
    .locator('[data-scope="color-picker"][data-part="trigger"]')
    .click();
  const swatches = page.locator('[data-part="swatch-trigger"]');
  const swatch = swatches.first();
  const label = await swatch.getAttribute("aria-label");
  expect(label).toMatch(/Choose .+ \(#[0-9A-F]{6}\), .+/);
  const family = label!.split(", ").at(-1)!;
  await swatch.hover();
  await expect(page.getByTestId("saved-color-family")).toContainText(
    `Color family: ${family}`,
  );
  await page.mouse.move(0, 0);
  await swatch.focus();
  await expect(page.getByTestId("saved-color-family")).toContainText(
    `Color family: ${family}`,
  );
  await swatch.press("Enter");
  await expect(page.getByTestId("selected-color-family")).toHaveText(
    `Color family: ${family}`,
  );
});

test("renders family labels without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL!);
  await expect(page.getByTestId("selected-color-family")).toContainText(
    "Color family:",
  );
  await expect(page.getByTestId("match-color-family")).toHaveText(
    await page.getByTestId("selected-color-family").innerText(),
  );
  await context.close();
});
