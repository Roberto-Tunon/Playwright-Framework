const { test, expect } = require('@playwright/test');
const { constantes } = require('../constantes');
const { PayQC, datosvar } = require('../constantes');
const { fillDeliveryForm } = require('../../utils/fillDeliveryForm');
const { fillCreditCard } = require('../../utils/fillCreditCard');
const { fillSSO } = require('../../utils/fillSSO');
const { AcceptCookies } = require('../../utils/AcceptCookies');
const { ObtenerDatos } = require('../../utils/ObtenerDatos');
const { fillKlarna } = require('../../utils/fillKlarna');


test('Marketplace shopping for Lutz AT and DE', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = process.env.COUNTRY || 'default';
    const mode = process.env.MODE || 'default';
    const pay  = process.env.PAY || 'default';
    const datosrail = ObtenerDatos(rail);    

    console.log(`Parámetros recibido: ${rail} - ${mode} - ${pay}`);

    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);

    await page.pause();        

    await AcceptCookies(page, datosrail);
    if (mode !== "1P") {
       
        await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing//products/standardDeliveryMarketplaceProduct`);
        await page.locator('[data-purpose="checkout.addtocart"]').click();
    } 
    
    if (mode !== "3P") {
        await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing/products/delivery`);                
        await page.locator('[data-purpose="checkout.addtocart"]').click();
    }

    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
   
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryForm(page, datosvar, datosrail);    

    if (pay === "CC") {        
        await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();
        await fillCreditCard(page, PayQC, datosrail);
        if (rail === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        } 
        await page.waitForLoadState('networkidle'); 
        await page.screenshot({ path: 'tests/Screenshots/Payment1.png', fullPage: true });   
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "PP") {
        await page.locator('[data-purpose="checkout.paymentOptions.paypal"]').click();       
        await page.pause();

    } else if (["KL", "KN"].includes(pay)) {
        await fillKlarna(page, pay, datosrail, rail); 

    }  else {
        throw new Error(`Unsupported payment method: ${pay}`);
    }
    await page.waitForLoadState('networkidle'); 
    if (["KL", "SW"].includes(pay)) {
        await page.waitForTimeout(6500); 
    }  
    await page.screenshot({ path: 'tests/Screenshots/Final-Order.png' });    
    await page.pause();
    
});