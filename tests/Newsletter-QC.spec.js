const { test, expect } = require('@playwright/test');

const { datosvar } = require('./constantes');

    test('Newsletter for DE', async ({ browser }) => {
        
    const context = await browser.newContext({
      ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
    });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Accept cookies    
    await page.goto(`https://xxxlutz-de.qc.xxxl-dev.at/`);     

    await page.getByRole('link', { name: 'XXXLutz SSO' }).click();
    await page.locator('//input[@id="userNameInput"]').fill(datosvar.SSOuser);
    await page.locator('//input[@id="passwordInput"]').fill("Utrecht25");

    await page.locator('//span[@id="submitButton"]').click();

    await page.pause();    

    await page.waitForTimeout(3000);  // 3 seconds pause

    // Verifica si el botón de aceptar cookies está presente y haz click si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }

    await page.goto(`https://xxxlutz-de.qc.xxxl-dev.at/c/newsletter`);
    await page.locator('[data-purpose="newsletter.email.field"]').fill(datosvar.email);  
        
    await page.locator('[data-purpose="newsletter.submit"]').click();  
    await page.waitForTimeout(2000);  // 2 seconds pause

    const news = await page.locator('//p[@class="_cIxBXCYmFqpdJ_I_ _goQEqe32Xrdy5z07 _XOhT6tl2Sqoxynhm _nkIEAS1Uhtzp2e3q"]').textContent(); 
    await expect(news.includes('Herzlich Willkommen!')).toBeTruthy();
    
    await context.close();
    
    });

 