import { step, description, label, tag, parameter } from "allure-js-commons";
import { DeliveryOption } from "../utils/DeliveryOption";
const { test, expect } = require('@playwright/test');
const { PayQC, datosvar } = require('./constantes');
const { fillCreditCard } = require('../utils/fillCreditCard');
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
    test.setTimeout(80000);

    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const mode = process.env.MODE || '1P';
    const datosrail = ObtenerDatos(cod_country);

    await description("E2E Test for " + process.env.COUNTRY);
    await tag(process.env.COUNTRY);
    await parameter("Mode", process.env.MODE);
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);
        
    await DeliveryOption(page, datosvar, datosrail);

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

    await fillCreditCard(page, PayQC, datosrail);
    
    if (["AT", "SI", "HR", "HU"].includes(cod_country) && rail === "xxxlutz") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click({ timeout: 2000 });       
    } 
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Credit-${rail}-${cod_country}.png`, fullPage: true });  

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForTimeout(6000);  // 3 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Credit-${rail}-${cod_country}.png` });

    await page.pause();
    
});