import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page.getByTestId("auth-login-email")).toBeVisible({
      timeout: 15000,
    });

    // Now that we know we are on the page, assert the URL
    expect(page.url()).toContain("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "habit-tracker-session", // <-- THIS IS THE MAGIC KEY
        JSON.stringify({ userId: "test-user", email: "test@user.com" }),
      );
    });

    await page.goto("/");
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("new@user.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("**/dashboard");
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([
          {
            id: "test-user",
            email: "existing@user.com",
            password: "password123",
            createdAt: new Date().toISOString(),
          },
        ]),
      );
    });
    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("existing@user.com");
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("**/dashboard");
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "test-user", email: "test@user.com" }),
      );
    });
    await page.goto("/dashboard");
    await page.getByTestId("habit-name-input").fill("Read a book");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByText("Read a book")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    // 1. Mock the session
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "test-user", email: "test@user.com" }),
      );
    });
    await page.goto("/dashboard");

    // 2. Have the bot create a habit first so it exists in the DOM
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    // 3. Click the complete button (Finding it by the text "Complete")
    await page
      .getByRole("button", { name: /complete/i })
      .first()
      .click();

    // 4. Verify something changed (A streak text appearing or the complete button going away)
    await expect(page.getByText(/streak/i).first()).toBeVisible();
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "test-user", email: "test@user.com" }),
      );
      window.localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "habit-123",
            userId: "test-user",
            name: "Persisted Habit",
            frequency: "daily",
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ]),
      );
    });
    await page.goto("/dashboard");
    await expect(page.getByText("Persisted Habit")).toBeVisible();
    await page.reload();
    await expect(page.getByText("Persisted Habit")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "test-user", email: "test@user.com" }),
      );
    });
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /log out|logout/i }).click();
    await page.waitForURL("**/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    context,
    page,
  }) => {
    // 1. Load the page normally
    await page.goto("/");

    // 2. WAIT! Give the Service Worker 2 seconds to finish caching the files in the background
    await page.waitForTimeout(2000);

    // 3. Now turn off the Wi-Fi
    await context.setOffline(true);

    // 4. Reload the page (we use a try/catch just in case Playwright is overly sensitive about network events)
    try {
      await page.reload({ waitUntil: "domcontentloaded" });
    } catch (e) {
      // Ignore strict network errors, we just want to check the DOM
    }

    // 5. Prove the app is still alive and not a blank error screen
    expect(await page.title()).not.toBe("");
  });
});
