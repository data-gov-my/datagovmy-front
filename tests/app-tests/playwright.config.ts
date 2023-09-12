import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://127.0.0.1:3000";
const CI_MODE = process.env.CI;
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!CI_MODE,
  /* Retry on CI only */
  retries: CI_MODE ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI_MODE ? 1 : "50%",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    permissions: ["clipboard-read", "clipboard-write"],
    userAgent: "datagovmy-agent",
  },
  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      maxDiffPixelRatio: 0.1,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: "yarn workspace app start",
  //   url: BASE_URL,
  //   reuseExistingServer: !CI_MODE,
  // },
});
