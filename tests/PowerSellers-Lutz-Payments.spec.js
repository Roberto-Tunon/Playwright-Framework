const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillSELFDeliveryForm } = require('../utils/fillSELFDeliveryForm');
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

    if (["SW", "KO", "KL", "KN"].includes(pay)) {
        rail = "SE";   
      } else if (["ON", "DEL"].includes(pay)) {
        rail = "CZ";
      } else if (pay === "TW") {
        rail = "CH";
      }  else {
        throw new Error(`Unsupported payment method: ${pay}`);
    }
    
    const datosrail = ObtenerDatos(rail);    

    console.log(`Parámetros recibidos: ${rail} - ${pay}`);
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);
    await page.pause();        

    await AcceptCookies(page, datosrail);    
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing/products/delivery`);   
    
    await page.locator('[data-purpose="checkout.addtocart"]').click();    
    await page.locator('[data-purpose="sidebar.button.submit"]').click();   
    
    if (pay === "ON") {  
      const button = await page.getByTestId('locationPicker.button'); 
      
      console.log('Visible:', await button.isVisible());
      console.log('Habilitado:', await button.isEnabled());

      if ((await button.isVisible()) && (await button.count() > 0)) {
            await button.click();
            console.log("✅ Botón clickeado.");
            await page.getByPlaceholder('PSČ/město').fill(datosrail.PostalCode);
            await page.getByRole('button', { name: datosrail.City}).click();
            await page.getByLabel('dialog').getByRole('button', { name: 'Zvolit pobočku' }).click(); 
      } else {
        console.log("🚫 El botón no está visible, no se hizo clic.");
      }    
    } else if (pay === "DEL") {
        // Seleccionar el combo box por su selector
        //const comboBox = page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]');
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]').click();  
        await page.keyboard.press('ArrowUp'); // Baja a la primera opción
        await page.keyboard.press('Enter'); // Selecciona la opción activa
        const firstOption = page.locator('[role="option"]').first();        
    }  
    
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    //if (rail === "CZ") {
    if (pay === "ON") {
      await fillSELFDeliveryForm(page, datosvar, datosrail);  
    } else {    
      await fillDeliveryForm(page, datosvar, datosrail);
    }    

    if (pay === "SW") {        
        //await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen.submit"]').click();
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: 'tests/Screenshots/Payment.png', fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "DEL") {
        await page.locator('[data-purpose="checkout.paymentOptions.ondelivery"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.ondelivery.submit"]').click();
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: 'tests/Screenshots/Payment.png', fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click(); 

    } else if (["KO", "KL", "KN"].includes(pay)) {
        await fillKlarna(page, pay, datosrail, rail);         

    } else if (pay === "TW") {
        await page.locator('[data-purpose="checkout.paymentOptions.twint"]').click(); 
               
        await page.locator('[data-purpose="checkout.paymentOptions.twint.submit"]').click();
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: 'tests/Screenshots/Payment.png', fullPage: true }); 

        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.waitForSelector("button[value='authorised']", { state: "visible" });
        await page.click("button[value='authorised']");  

    } else if (pay === "ON") {
        await page.locator('[data-purpose="checkout.paymentOptions.onlineBanking_CZ"]').click();
        
        // Primero, abre el menú desplegable haciendo clic en el <span>
        await page.click('[data-purpose="checkout.payment.onlinebanking.select.select.value"]');
        // Luego, selecciona la opción "Česká spořitelna"
        await page.click('text="Česká spořitelna"');
        await page.screenshot({ path: 'tests/Screenshots/Payment.png', fullPage: true }); 

        await page.locator('[data-purpose="checkout.paymentOptions.onlineBanking_CZ.submit"]').click();
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

        await page.waitForSelector('input[name="submit"][value="Pokračovat"]', { state: 'visible' });
        await page.click('input[name="submit"][value="Pokračovat"]');

        await page.click('input#formSubmit[value="Positive authorization"]');
        await page.click('input#formSubmit[value="Continue"]');

    }
    await page.waitForLoadState('networkidle'); 
    if (["SW", "KO", "KL", "KN"].includes(pay)) {
      await page.waitForTimeout(6500); 
    }  
    await page.screenshot({ path: 'tests/Screenshots/Final-Order.png' });    
    await page.pause();
    
});