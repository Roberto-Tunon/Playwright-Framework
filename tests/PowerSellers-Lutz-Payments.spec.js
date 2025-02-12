const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillMKPDeliveryForm } = require('../utils/fillMKPDeliveryForm');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillKlarna } = require('../utils/fillKlarna');
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

    if (["SW", "KO"].includes(pay)) {
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
   
    
    if (rail === "CZ") {        
          await page.getByTestId('locationPicker.button').click();
          await page.getByPlaceholder('PSČ/město').fill(datosrail.PostalCode);
          await page.getByRole('button', { name: datosrail.City}).click();
          await page.getByLabel('dialog').getByRole('button', { name: 'Zvolit pobočku' }).click();  
      }

    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await page.locator('[data-purpose="form.input.deliveryAddress.email.field"]').fill('hola@dddd.com');

    await fillMKPDeliveryForm(page, datosvar, datosrail);    

    if (pay === "SW") {        
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen.submit"]').click();
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "KO") {
        await fillKlarna(page, pay, datosrail, rail);         

    } else if (pay === "TW") {
        await page.locator('[data-purpose="checkout.paymentOptions.twint"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.twint.submit"]').click();
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.waitForSelector("button[value='authorised']", { state: "visible" });
        await page.click("button[value='authorised']");  

    } else if (pay === "ON") {
        await page.locator('[data-purpose="checkout.paymentOptions.onlineBanking_CZ"]').click();
        
        // Primero, abre el menú desplegable haciendo clic en el <span>
        await page.click('[data-purpose="checkout.payment.onlinebanking.select.select.value"]');
        // Luego, selecciona la opción "Česká spořitelna"
        await page.click('text="Česká spořitelna"');

        await page.locator('[data-purpose="checkout.paymentOptions.onlineBanking_CZ.submit"]').click();
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

        await page.waitForSelector('input[name="submit"][value="Pokračovat"]', { state: 'visible' });
        await page.click('input[name="submit"][value="Pokračovat"]');

        await page.click('input#formSubmit[value="Positive authorization"]');
        await page.click('input#formSubmit[value="Continue"]');

    }       
        
    await page.pause();
    
});