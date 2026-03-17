// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const fs = require('fs'); // <--- 1. Importamos el sistema de archivos de Node

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI and local */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
 reporter: [
    ['html'], 
    ['allure-playwright', { outputFolder: 'allure-results' }]
    ],

    /* Shared settings for all the projects below. */
    use: {
      // --- SESSION LOGIC ---
      // Automatically loads session from auth.json if it exists to bypass SSO/Login
      storageState: fs.existsSync('auth.json') ? 'auth.json' : undefined,

      // --- EXECUTION SETTINGS ---
      headless: true, // Run in background for CI/CD and batch execution

      // --- ARTIFACTS & DEBUGGING ---
      // Collect trace only when retrying a failed test to save resources
      //trace: 'on-first-retry',
      
      // Capture screenshots only on failure to provide evidence in Allure reports
      screenshot: 'only-on-failure', 
      
      // Keep video recordings only for failed tests to analyze the root cause
      video: 'retain-on-failure',
      viewport: { width: 1920, height: 1080 }, // Forzamos resolución FullHD     
      trace: 'retain-on-failure',
      actionTimeout: 15000,
    },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
});