const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillSELFDeliveryForm } = require('../utils/fillSELFDeliveryForm');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');


test('Shopping with Credit Card', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const datosrail = ObtenerDatos(cod_country);    

    console.log(`Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}`);
    
    await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);

    await page.pause();        

    await AcceptCookies(page, datosrail);
    await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/deliveryselfservice`);      
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();    


    try {
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
        await page.locator('#SELF_SERVICE').click();

        await page.getByTestId('locationPicker.button').click();
        await page.locator('[data-purpose="locationFinder.input.field"]').fill(datosrail.PostalCode);
        await page.getByRole('button', { name: datosrail.City}).click();    
        await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();

        await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
        await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
        await fillSELFDeliveryForm(page, datosvar, datosrail);   

    } catch (e) {
  
        await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
        await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
        await fillDeliveryForm(page, datosvar, datosrail);   
    }

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

    await fillCreditCard(page, PayQC, datosrail);
    
    try {
        if (rail === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click({ timeout: 2000 });       
        } 
    } catch (e) {
    }  

    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Credit-${rail}-${cod_country}.png`, fullPage: true });  

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForTimeout(3000);  // 3 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Credit-${rail}-${cod_country}.png` });

    await page.pause();
    
});