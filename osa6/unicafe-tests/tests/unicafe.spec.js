import { test, expect } from "@playwright/test"

const statRow = (page, label) =>
  page
    .locator("tr", {
      has: page.getByRole("cell", { name: label, exact: true }),
    })
    .locator("td")
    .nth(1)

test.describe("Unicafe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("renders the title and feedback buttons", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Unicafe" })).toBeVisible()
    await expect(page.getByRole("button", { name: "good" })).toBeVisible()
    await expect(page.getByRole("button", { name: "neutral" })).toBeVisible()
    await expect(page.getByRole("button", { name: "bad" })).toBeVisible()
  })

  test("shows all statistics at zero before any feedback", async ({ page }) => {
    await expect(statRow(page, "good")).toHaveText("0")
    await expect(statRow(page, "neutral")).toHaveText("0")
    await expect(statRow(page, "bad")).toHaveText("0")
    await expect(statRow(page, "all")).toHaveText("0")
    await expect(statRow(page, "average")).toHaveText("0")
    await expect(statRow(page, "positive")).toHaveText("0 %")
  })

  test("clicking good increments good and all", async ({ page }) => {
    await page.getByRole("button", { name: "good" }).click()

    await expect(statRow(page, "good")).toHaveText("1")
    await expect(statRow(page, "all")).toHaveText("1")
  })

  test("clicking neutral increments neutral and all", async ({ page }) => {
    await page.getByRole("button", { name: "neutral" }).click()

    await expect(statRow(page, "neutral")).toHaveText("1")
    await expect(statRow(page, "all")).toHaveText("1")
  })

  test("clicking bad increments bad and all", async ({ page }) => {
    await page.getByRole("button", { name: "bad" }).click()

    await expect(statRow(page, "bad")).toHaveText("1")
    await expect(statRow(page, "all")).toHaveText("1")
  })

  test("computes average and positive percentage across multiple clicks", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "good" }).click()
    await page.getByRole("button", { name: "good" }).click()
    await page.getByRole("button", { name: "neutral" }).click()
    await page.getByRole("button", { name: "bad" }).click()

    await expect(statRow(page, "good")).toHaveText("2")
    await expect(statRow(page, "neutral")).toHaveText("1")
    await expect(statRow(page, "bad")).toHaveText("1")
    await expect(statRow(page, "all")).toHaveText("4")
    await expect(statRow(page, "average")).toHaveText("0.25")
    await expect(statRow(page, "positive")).toHaveText("50 %")
  })
})
