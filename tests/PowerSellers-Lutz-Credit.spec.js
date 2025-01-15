const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryFormQC } = require('../utils/fillDeliveryFormQC');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');


test('Shopping with Credit Card', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = process.env.COUNTRY || 'default';
    const datosrail = ObtenerDatos(rail);    

    console.log(`Parámetro recibido: ${rail}`);
    
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);

    await page.pause();        

    await AcceptCookies(page, datosrail);
  
    await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosrail.Product);
    await page.locator('[data-purpose="header.searchBar.button.submit"]').click();
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();
    await page.locator('[data-purpose="entry.counter.increase"]').click();

    // Seleccionar el combo box por su selector
    const comboBox = page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]');
    await comboBox.click();    
    await page.locator('#SELF_SERVICE').click();


    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryFormQC(page, datosvar, datosrail);

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

    await fillCreditCard(page, PayQC, 'de')    

    await page.waitForTimeout(2000);  // 2 seconds pause

    await page.pause();
    
});