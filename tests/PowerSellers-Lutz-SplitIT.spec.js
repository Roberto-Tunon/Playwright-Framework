const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillRODeliveryForm } = require('../utils/fillRODeliveryForm');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');


test('Shopping with Split IT on Lutz RO', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = 'RO';
    const datosrail = ObtenerDatos(rail);    

    await page.goto(`https://xxxlutz-${rail}.qa.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);

    await page.pause();        

    await AcceptCookies(page, datosrail);
    await page.goto(`https://xxxlutz-${rail}.qa.xxxl-dev.at/api/${rail}/testing/products/delivery`);   
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
    
    await page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]').click();  
    await page.keyboard.press('ArrowUp'); // Baja a la primera opción
    await page.keyboard.press('Enter'); // Selecciona la opción activa
    const firstOption = page.locator('[role="option"]').first();   
    
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillRODeliveryForm(page, datosvar, datosrail);     

    await page.locator('[data-purpose="checkout.paymentOptions.null"]').click();
   
    await page.locator('[data-purpose="checkout.paymentOptions.null.submit"]').first().click();   
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/Screenshots/Payment.png', fullPage: true }); 
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();   
    
    await page.waitForLoadState('networkidle'); 

    await page.locator('[name="CardNumber"]').fill(PayQC.cardnumber);
    await page.locator('[name="ExpDate"]').fill(PayQC.carddate);
    await page.locator('[name="CardCvv"]').fill(PayQC.cardcvv);
    await page.locator('#id-agree-terms').check();
    await page.waitForTimeout(500); 
    await page.locator('[qa-id="pay-button"]').click();

    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'tests/Screenshots/Final-Order.png' });   
    await page.pause();
    
});