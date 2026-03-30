import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to XXXLutz with stealthy headers...');
    // Add extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'de-AT,de;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    await page.goto('https://www.xxxlutz.at', { waitUntil: 'networkidle', timeout: 90000 });

    // Wait for the cookie consent button to appear and click it
    // Usually, these buttons have IDs like 'onetrust-accept-btn-handler' or similar
    console.log('Looking for cookie consent button...');
    const acceptButton = page.locator('button:has-text("Alle akzeptieren"), #onetrust-accept-btn-handler');
    
    if (await acceptButton.isVisible({ timeout: 10000 })) {
      await acceptButton.click();
      console.log('Cookies accepted.');
    } else {
      console.log('Cookie consent button not found or already accepted.');
    }

    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Take a screenshot to verify
    await page.screenshot({ path: 'xxxlutz_home.png' });
    console.log('Screenshot saved as xxxlutz_home.png');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
