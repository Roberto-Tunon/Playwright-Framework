const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillSELFDeliveryForm } = require('../utils/fillSELFDeliveryForm');
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
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing/products/delivery`);   
    // await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosrail.Product);
    // await page.locator('[data-purpose="header.searchBar.button.submit"]').click();
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
   
    await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click();
    await page.locator('#SELF_SERVICE').click();

    await page.getByTestId('locationPicker.button').click();
    await page.locator('[data-purpose="locationSearch.input.field"]').fill(datosrail.PostalCode);
    await page.getByRole('button', { name: datosrail.City}).click();    
    await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();     


    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillSELFDeliveryForm(page, datosvar, datosrail);     

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

    await fillCreditCard(page, PayQC, rail);

    if (rail === "AT") {
        await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
    }

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();      

    await page.pause();
    
});