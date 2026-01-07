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
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Shared settings for all the projects below. */
  use: {
    // 2. SESSION LOGIC: If auth.json exists, it loads it automatically
    storageState: fs.existsSync('auth.json') ? 'auth.json' : undefined,

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    // Recomendado: ver el navegador para interactuar si algo falla
    headless: true, 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});