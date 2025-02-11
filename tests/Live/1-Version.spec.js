const { test, expect } = require('@playwright/test');

const { datosvar } = require('../constantes');

test('Version',  async ({ browser }) => {
  
  const context = await browser.newContext({
    ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
  });
  const page = await context.newPage();
  
  await page.goto('https://www.xxxlutz.at/version');
  await expect( await page.locator("body pre")).toContainText(datosvar.version);
  await page.waitForTimeout(2000);  // 2 seconds pause

  await context.close();  
  
});