const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');

test('Shopping with PayPal', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = process.env.PARAM || 'default';
    console.log(`Parámetro recibido: ${rail}`);

    const datosrail = ObtenerDatos(rail);
    await page.goto(`https://xxxlutz-de.qc.xxxl-dev.at/`);   
    console.log(`Parámetro recibido: ${rail}`);
    
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
   
    await fillSSO(page, datosvar);
 
    await page.pause();        
    
    await AcceptCookies(page, datosrail);
  
    await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosrail.Product);
    await page.locator('[data-purpose="header.searchBar.button.submit"]').click();
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryForm(page, datosvar, datosrail);

    await page.locator('[data-purpose="checkout.paymentOptions.paypal.submit"]').click();

    await page.waitForTimeout(2000);  // 2 seconds pause

    await page.pause();
    
});