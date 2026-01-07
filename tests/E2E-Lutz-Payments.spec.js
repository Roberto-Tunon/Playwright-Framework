const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillSELFDeliveryForm } = require('../utils/fillSELFDeliveryForm');
const { fillKlarna } = require('../utils/fillKlarna');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { OpenPage } = require('../utils/OpenPage');


test('Lutz Special Payments', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Overrides the global timeout just for this specific test
    test.setTimeout(100000);

    const pay  = process.env.PAY || 'default';
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const mode = process.env.MODE || '1P';
    const datosrail = ObtenerDatos(cod_country);   
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);    
    
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
    
    if (pay === "ON") {
      await fillSELFDeliveryForm(page, datosvar, datosrail);  
    } else {    
      await fillDeliveryForm(page, datosvar, datosrail);
    }    

    if (pay === "SW") {        
        //await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen.submit"]').click();
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "DEL") {
        await page.locator('[data-purpose^="checkout.paymentOptions.ondelivery"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.ondelivery.submit"], [data-purpose="checkout.paymentOptions.ondelivery_ro.submit"]').click();
        await page.waitForTimeout(2000); 
        if (["AT", "SI"].includes(cod_country)){
          await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();      
        }
        await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click(); 

    } else if (["KO", "KL", "KN"].includes(pay)) {
        await fillKlarna(page, pay, datosrail, rail);         

    } else if (pay === "TW") {
        await page.locator('[data-purpose="checkout.paymentOptions.twint"]').click(); 
               
        await page.locator('[data-purpose="checkout.paymentOptions.twint.submit"]').click();
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true }); 

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
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

        const continueButton = page.getByRole('button', { name: 'Pokračovat' });
        await expect(continueButton).toBeVisible({ timeout: 8000 });
        await continueButton.click();

        await page.click('input#formSubmit[value="Positive authorization"]');
        await page.click('input#formSubmit[value="Continue"]');

    }
    await page.waitForLoadState('networkidle'); 
    if (["SW", "KO", "KL", "KN"].includes(pay)) {
      await page.waitForTimeout(6500); 
    }  
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `tests/Screenshots/Final-Order-${pay}-${rail}-${cod_country}.png` });
    await page.pause();
    
});