import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { DeliveryOption } from "../utils/DeliveryOption";
const { test, expect } = require('@playwright/test');
const { datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillKlarna } = require('../utils/fillKlarna');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { OpenPage } = require('../utils/OpenPage');

// Helper to format the test title dynamically
const testTitle = `[${process.env.COUNTRY || 'N/A'}] ${process.env.RAIL} - Payment: ${process.env.PAY || 'CreditCard'} (${process.env.MODE})`;

test(testTitle, async ({ browser }) => {

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

    await epic(rail);      
    await feature(cod_country);             
    await story(pay);
    
    console.log(`Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}, Mode: ${mode}, Pay: ${pay}`);
    await description("E2E Test for Country:" + cod_country.toUpperCase() + " - Rail:"+ rail.toUpperCase() + " - Mode:" + mode.toUpperCase() + " - Mode:" + pay.toUpperCase());
    await description("E2E Test for " + rail + "-" + cod_country + "-" + pay);
    await tag(cod_country);
    await parameter("Rail", process.env.RAIL);
    await parameter("Pay", process.env.PAY);

   
    await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);    
   
    if (['ON'].includes(pay)){  
        const button = await page.getByTestId('locationPicker.button'); 
       
        if ((await button.isVisible()) && (await button.count() > 0)) {
              await button.click();
              console.log("✅ Botón clickeado.");
              await page.getByPlaceholder('PSČ/město').fill(datosrail.PostalCode);
              await page.getByRole('button', { name: datosrail.City}).click();
              await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click(); 
              await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
              await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
              await fillDeliveryForm(page, datosvar, datosrail);  
        } else {
          console.log("🚫 El botón no está visible, no se hizo clic.");
        }    
    } else {
        await DeliveryOption(page, datosvar, datosrail, pay);          
    }  
            
    if (pay === "SW") {        
        //await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen.submit"]').click();
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "DEL") {
        await page.locator('[data-purpose^="checkout.paymentOptions.ondelivery"]').click();        
        await page.locator('[data-purpose^="checkout.paymentOptions.ondelivery"][data-purpose$=".submit"]').click();
        await page.waitForTimeout(2000); 
        if (["AT", "SI", "HR", "RS"].includes(cod_country)){
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
    // await page.waitForLoadState('networkidle'); 
    if (["SW", "KO", "KL", "KN"].includes(pay)) {
      await page.waitForTimeout(6500); 
    }  
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `tests/Screenshots/Final-Order-${pay}-${rail}-${cod_country}.png` });
    await page.pause();
    
});