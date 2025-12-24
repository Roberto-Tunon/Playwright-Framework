// tests/auth.spec.js
const { test } = require('@playwright/test');

test('SSO Session Capture', async ({ page }) => {
  
  // 1. Navigate to the QA environment
  await page.goto('https://xxxlutz-at.qa.xxxl-dev.at/');

  console.log('---------------------------------------------------------');
  console.log('   STEPS TO CAPTURE THE SESSION:');
  console.log('   1. Enter your email/username and password.');
  console.log('   2. Complete the Authenticator (MFA) verification.');
  console.log('   3. Once you reach the Home page (Dashboard), click');
  console.log('      the "RESUME" button (▶️ icon) in the Inspector.');
  console.log('---------------------------------------------------------');

  // 2. DYNAMIC PAUSE: 
  // This line opens the Playwright Inspector, giving you full 
  // manual control over the mouse and keyboard.
  await page.pause();

  // 3. AUTOMATIC STORAGE:
  // The script will only proceed to this line once you click "Resume".
  await page.context().storageState({ path: 'auth.json' });
  
  console.log('✅ Session successfully saved to auth.json!');
});