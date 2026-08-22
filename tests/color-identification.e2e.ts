import { expect, test } from "@playwright/test";

test("selects a random named color on load", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();

  const selectedHex = await page.getByLabel("Hex color value").inputValue();
  expect(selectedHex).toMatch(/^[0-9A-F]{6}$/);
  await expect(page.locator("main")).toHaveCSS("background-image", "none");
});

test("updates the selected color representations from the native picker", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  await page.getByLabel("Hex color value").fill("ff0000");

  await expect(page.getByLabel("Hex color value")).toHaveValue("FF0000");
  await expect(page.getByLabel("Red channel")).toHaveValue("255");
  await expect(page.getByLabel("Green channel")).toHaveValue("0");
  await expect(page.getByLabel("Blue channel")).toHaveValue("0");
  await expect(page.locator("main")).toHaveCSS(
    "background-color",
    "rgb(255, 0, 0)",
  );
});

test("updates the selected color from validated RGB channels", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Red channel").fill("36");
  await page.getByLabel("Green channel").fill("100");
  await page.getByLabel("Blue channel").fill("235");

  await expect(page.getByLabel("Hex color value")).toHaveValue("2464EB");
  await expect(page.locator("main")).toHaveCSS(
    "background-image",
    /linear-gradient\(/,
  );
});

test("keeps the hex prefix fixed and rejects out-of-range RGB channels", async ({
  page,
}) => {
  await page.goto("/");
  const hex = page.getByLabel("Hex color value");
  await hex.fill("#ff0000z");
  await expect(hex).toHaveValue("FF0000");

  const red = page.getByLabel("Red channel");
  const priorHex = await hex.inputValue();
  await red.fill("256");
  await expect(red).toHaveAttribute("aria-invalid", "true");
  await expect(hex).toHaveValue(priorHex);
  await red.blur();
  await expect(red).toHaveAttribute("aria-invalid", "false");
});

test("copies a color representation", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
  const selectedHex = await page.getByLabel("Hex color value").inputValue();
  await page.getByRole("button", { name: "Copy hex value" }).click();

  await expect(page.getByText("Hex value copied.")).toHaveText(
    "Hex value copied.",
  );
  await expect(
    page.evaluate(() => navigator.clipboard.readText()),
  ).resolves.toBe(`#${selectedHex}`);
});

test("uses a black foreground for a light selected color", async ({ page }) => {
  await page.goto("/");
  const selectedColorValue = page.getByLabel("Hex color value");
  await selectedColorValue.fill("FFFFFF");

  await expect(page.locator("main")).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect(page.getByLabel("Hex color value")).toHaveCSS(
    "color",
    "rgb(0, 0, 0)",
  );

  await selectedColorValue.fill("000000");
  await expect(page.locator("main")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(page.getByLabel("Hex color value")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
});

test("switches the selected color to the named-color match and announces it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Hex color value").fill("#2563EB");
  await page.getByRole("button", { name: "Switch to match" }).focus();
  await expect(
    page.getByRole("button", { name: "Switch to match" }),
  ).toBeFocused();

  await page.getByRole("button", { name: "Switch to match" }).press("Enter");
  await expect(page.getByLabel("Hex color value")).toHaveValue("0066EE");
  await expect(
    page.getByText("Named-color match", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("main")).toHaveCSS("background-image", "none");
  await expect(
    page.getByText("Named-color match: Epic Blue, #0066EE."),
  ).toBeVisible();

  await page.goto("/");
  await page.getByLabel("Hex color value").fill("#2563EB");
  await page.getByRole("button", { name: "Switch to match" }).click();
  await expect(
    page.getByText("Named-color match", { exact: true }),
  ).toBeVisible();
});

test("keeps an opaque selected-color background during the match switch", async ({
  page,
}) => {
  await page.goto("/");
  const main = page.locator("main");
  await page.getByLabel("Hex color value").fill("#2563EB");

  await expect(main).toHaveCSS("background-color", "rgb(37, 99, 235)");
  await page.getByRole("button", { name: "Switch to match" }).click();
  await expect(main).toHaveCSS("background-color", "rgb(0, 102, 238)");
});

test("keeps the match area stable when switching to an exact named-color match", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Hex color value").fill("#2563EB");
  const match = page.getByRole("region", { name: "Named-color match" });
  const unmatchedHeight = await match.evaluate(
    (element) => element.clientHeight,
  );

  await page.getByRole("button", { name: "Switch to match" }).click();
  await expect(
    page.getByText("Named-color match", { exact: true }),
  ).toBeVisible();
  await expect(match).toHaveJSProperty("clientHeight", unmatchedHeight);
});

test("renders a random named color before JavaScript runs", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  const noScriptMarkup = await page
    .locator("noscript")
    .evaluate((element) => element.innerHTML);
  expect(noScriptMarkup).toContain(
    "Interactive color identification requires JavaScript.",
  );
  await expect(page.getByLabel("Hex color value")).not.toHaveValue("#2563EB");
  await context.close();
});
