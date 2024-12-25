const { test, expect } = require('@playwright/test');

const { datosvar } = require('./constantes');

test.describe.serial('Newsletter DE-CZ', () => {
    ['de', 'cz'].forEach((rail) => {

    test(`Newsletter for ${rail}`, async ({ browser }) => {
        const context = await browser.newContext({
            ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
        });
        const page = await context.newPage();
        
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Accept cookies    
        await page.goto(`https://www.xxxlutz.${rail}`);
        await page.waitForTimeout(4000);  // 4 seconds pause

        // Verifica si el botón de aceptar cookies está presente y haz click si existe
        const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
        if (await acceptCookiesButton.isVisible()) {
            await acceptCookiesButton.click();
        }
        
        await page.goto(`https://www.xxxlutz.${rail}/c/newsletter`);
        await page.locator('[data-purpose="newsletter.email.field"]').fill(datosvar.email);  
            
        await page.waitForTimeout(1000);  // 1 second pause

        await page.locator('[data-purpose="newsletter.submit"]').click();  
        await page.waitForTimeout(2000);  // 2 seconds pause

        const news = await page.locator('//p[@class="_cIxBXCYmFqpdJ_I_ _goQEqe32Xrdy5z07 _XOhT6tl2Sqoxynhm _nkIEAS1Uhtzp2e3q"]').textContent(); 
        if (rail === 'de') {
            await expect(news.includes('Herzlich Willkommen!')).toBeTruthy();
        }
        if (rail === 'cz') {
            await expect(news.includes('Vítejte!')).toBeTruthy();
        }
        
        await context.close();
        
    });

  });
});  