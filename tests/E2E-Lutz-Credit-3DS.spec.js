const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fill3DSCreditCard } = require('../utils/fill3DSCreditCard');
const { fillDeliveryFormCompany } = require('../utils/fillDeliveryFormCompany');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { OpenPage } = require('../utils/OpenPage');


test('Shopping with 3DS Credit Card', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const datosrail = ObtenerDatos(cod_country);   
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country);    
    
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryFormCompany(page, datosvar, datosrail);     

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

    await fill3DSCreditCard(page, PayQC, datosrail);

    if (cod_country === "AT") {
        await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-3DS-Credit-${rail}-${cod_country}.png`, fullPage: true });  

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForTimeout(2000);  // 2 seconds pause
    
    // Esperar a que el iframe aparezca
    const frame = page.frameLocator('iframe[name="threeDSIframe"]');

    // Escribir la palabra 'password'
    await frame.getByPlaceholder("enter the word 'password'").fill('password');

    // Hacer clic en el botón OK
    await frame.getByRole('button', { name: 'OK' }).click();

    await page.waitForTimeout(3000);  // 3 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-3DS-Credit-${rail}-${cod_country}.png` });

    await page.pause();
    
});