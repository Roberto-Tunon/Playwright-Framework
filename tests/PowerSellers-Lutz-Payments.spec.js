const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillMKPDeliveryForm } = require('../utils/fillMKPDeliveryForm');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');


test('Lutz Special Payments', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const pay  = process.env.PAY || 'default';
    let rail;

    if ((pay === "SW") || (pay === "KO")) {
        rail = "SE";   
      } else if (pay === "ON") {
        rail = "CZ";
      } else if (pay === "TW") {
        rail = "CH";
      }  else {
        throw new Error(`Unsupported payment method: ${pay}`);
    }
    
    const datosrail = ObtenerDatos(rail);    

    console.log(`Parámetros recibido: ${rail} - ${pay}`);
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);
    await page.pause();        

    await AcceptCookies(page, datosrail);    
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing/products/delivery`);   
    
    await page.locator('[data-purpose="checkout.addtocart"]').click();    
    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
   
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillMKPDeliveryForm(page, datosvar, datosrail);    

    if (pay === "SW") {        
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen.submit"]').click();
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "KO") {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit.submit"]').click(); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.locator('//button[@id="signInWithBankIdButton"]').click();        
        await page.locator('//button[@data-testid="pick-plan"]').click();        
        await page.locator('//button[@id="buy_button"]').click();   
    }   
        
    await page.pause();
    
});