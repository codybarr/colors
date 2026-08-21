import { expect, test } from "@playwright/test";

test("shows the deterministic selected color and its named-color match", async ({
	page,
}) => {
	await page.goto("/");

	await expect(page.getByLabel("Selected color")).toHaveValue("#2563eb");
	await expect(page.getByText("#2563EB", { exact: true })).toBeVisible();
	await expect(page.getByText("rgb(37 99 235)", { exact: true })).toBeVisible();
	await expect(page.getByText("Epic Blue", { exact: true })).toBeVisible();
	await expect(page.locator("main")).not.toHaveClass(/exact-match/);
});

test("updates the selected color representations from the native picker", async ({
	page,
}) => {
	await page.goto("/");
	await expect(page.locator('main[data-hydrated="true"]')).toBeVisible();
	await page.getByLabel("Selected color", { exact: true }).fill("#ff0000");

	await expect(page.getByText("#FF0000", { exact: true })).toBeVisible();
	await expect(page.getByText("rgb(255 0 0)", { exact: true })).toBeVisible();
	await expect(page.locator("main")).toHaveAttribute(
		"style",
		/--selected-color: #FF0000/,
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

	await page.getByRole("button", { name: "Switch to match" }).click();
	await expect(page.getByLabel("Selected color")).toHaveValue("#0066ee");
	await expect(page.getByText("Exact named-color match")).toBeVisible();
	await expect(page.locator("main")).toHaveClass(/exact-match/);
	await expect(page.locator('[aria-live="polite"]')).toContainText(
		"Epic Blue, #0066EE",
	);
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
	await expect(page.getByText("#2563EB", { exact: true })).toBeVisible();
	await context.close();
});
