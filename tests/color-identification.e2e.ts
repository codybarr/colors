import { expect, test } from "@playwright/test";

test("shows the deterministic selected color and its named-color match", async ({
	page,
}) => {
	await page.goto("/");

	await expect(page.getByLabel("Selected color", { exact: true })).toHaveValue(
		"#2563eb",
	);
	await expect(page.getByLabel("Hex color value")).toHaveValue("#2563EB");
	await expect(page.getByLabel("RGB color value")).toHaveValue(
		"rgb(37 99 235)",
	);
	await expect(page.getByLabel("Selected color", { exact: true })).toHaveCSS(
		"border-top-width",
		"2px",
	);
	await expect(page.getByText("Epic Blue", { exact: true })).toBeVisible();
	await expect(page.locator("main")).not.toHaveClass(/exact-match/);
});

test("updates the selected color representations from the native picker", async ({
	page,
}) => {
	await page.goto("/");
	await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
	await page.getByLabel("Selected color", { exact: true }).fill("#ff0000");

	await expect(page.getByLabel("Hex color value")).toHaveValue("#FF0000");
	await expect(page.getByLabel("RGB color value")).toHaveValue(
		"rgb(255 0 0)",
	);
	await expect(page.locator("main")).toHaveAttribute(
		"style",
		/--selected-color: #FF0000/,
	);
});

test("updates the selected color and match from RGB and OKLCH representation inputs", async ({
	page,
}) => {
	await page.goto("/");
	const rgb = page.getByLabel("RGB color value");
	await rgb.fill("rgb(36 100 235)");

	await expect(page.getByLabel("Hex color value")).toHaveValue("#2464EB");
	await expect(rgb).toHaveValue("rgb(36 100 235)");
	await expect(page.locator("main")).not.toHaveClass(/exact-match/);
	await expect(page.locator("main")).toHaveCSS(
		"background-image",
		/linear-gradient\(/,
	);

	await page
		.getByLabel("OKLCH color value")
		.fill("oklch(62.8% 0.2577 29.23)");
	await expect(page.getByLabel("Hex color value")).toHaveValue("#FF0000");
});

test("copies a color representation", async ({ page }) => {
	await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/");
	await page.getByRole("button", { name: "Copy hex value" }).click();

	await expect(page.locator(".copy-announcement")).toHaveText(
		"Hex value copied.",
	);
	await expect(page.evaluate(() => navigator.clipboard.readText())).resolves.toBe(
		"#2563EB",
	);
});

test("uses a black foreground for a light selected color", async ({ page }) => {
	await page.goto("/");
	const selectedColorValue = page.getByLabel("Selected color value");
	await selectedColorValue.fill("#FFFFFF");

	await expect(selectedColorValue).toHaveCSS("color", "rgb(0, 0, 0)");
	await expect(page.getByLabel("Hex color value")).toHaveCSS(
		"color",
		"rgb(0, 0, 0)",
	);

	await selectedColorValue.fill("#000000");
	await expect(selectedColorValue).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(page.getByLabel("Hex color value")).toHaveCSS(
		"color",
		"rgb(255, 255, 255)",
	);
});

test("switches the selected color to the named-color match and announces it", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Switch to match" }).focus();
	await expect(
		page.getByRole("button", { name: "Switch to match" }),
	).toBeFocused();

	await page.getByRole("button", { name: "Switch to match" }).press("Enter");
	await expect(page.getByLabel("Selected color", { exact: true })).toHaveValue(
		"#0066ee",
	);
	await expect(page.getByText("Exact named-color match")).toBeVisible();
	await expect(page.locator("main")).toHaveClass(/exact-match/);
	await expect(page.locator(".match-announcement")).toContainText(
		"Epic Blue, #0066EE",
	);

	await page.goto("/");
	await page.getByRole("button", { name: "Switch to match" }).click();
	await expect(page.getByText("Exact named-color match")).toBeVisible();
});

test("keeps the match area stable when switching to an exact named-color match", async ({
	page,
}) => {
	await page.goto("/");
	const match = page.locator(".match");
	const unmatchedHeight = await match.evaluate((element) => element.clientHeight);

	await page.getByRole("button", { name: "Switch to match" }).click();
	await expect(page.getByText("Exact named-color match")).toBeVisible();
	await expect(match).toHaveJSProperty("clientHeight", unmatchedHeight);
});

test("retains the stable initial color and explains the JavaScript requirement without JavaScript", async ({
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
	await expect(page.getByLabel("Hex color value")).toHaveValue("#2563EB");
	await context.close();
});
