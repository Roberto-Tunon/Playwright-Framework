const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { OpenPage } = require('../utils/OpenPage');

test('Shopping with Split IT', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Overrides the global timeout just for this specific test
    test.setTimeout(100000);
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const datosrail = ObtenerDatos(cod_country); 
    const mode = process.env.MODE || '1P'; 
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);
    
    await page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]').click();  
    await page.keyboard.press('ArrowUp'); // Baja a la primera opción
    await page.keyboard.press('Enter'); // Selecciona la opción activa
    const firstOption = page.locator('[role="option"]').first();   
    
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryForm(page, datosvar, datosrail);     

    // await page.locator('[data-purpose="checkout.paymentOptions."]').click();   
    const splititRadio = page.locator('input[data-purpose="checkout.paymentMode.radiobutton."]').first();
    await splititRadio.check({ force: true });
    await page.locator('[data-purpose="checkout.paymentOptions.default.submit"]').first().click(); 

    if (["AT", "SI"].includes(cod_country)){
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();      
    }
      
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-SplitIT-${rail}-${cod_country}.png`, fullPage: true }); 
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();   
    
    await page.waitForLoadState('networkidle'); 

    await page.locator('[name="CardNumber"]').fill(PayQC.cardnumber);
    await page.locator('[name="ExpDate"]').fill(PayQC.carddate);
    await page.locator('[name="CardCvv"]').fill(PayQC.cardcvv);
    await page.locator('#id-agree-terms').check();
    await page.waitForTimeout(500); 
    await page.locator('[qa-id="pay-button"]').click();

    await page.waitForTimeout(10000);
    await page.screenshot({ path: `tests/Screenshots/Final-Order-SplitIT-${rail}-${cod_country}.png` });   
    await page.pause();
    
});