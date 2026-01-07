import { step, description, label, tag, parameter } from "allure-js-commons";
const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryFormCompany } = require('../utils/fillDeliveryFormCompany');
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
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const mode = process.env.MODE || '1P';
    const datosrail = ObtenerDatos(cod_country);  
    
    await description("E2E Test for " + process.env.COUNTRY);
    await tag(process.env.COUNTRY);
    await parameter("Mode", process.env.MODE);
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);    
    
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryFormCompany(page, datosvar, datosrail);     

    await page.locator('[data-purpose="checkout.paymentOptions.klarna_b2b"]').click();
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_b2b.submit"]').click();

    if (cod_country === "AT") {
        await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Billie-${rail}-${cod_country}.png`, fullPage: true });  

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForTimeout(2000);  // 2 seconds pause
    

    // Seguir desarrollando aquí. Cuando aparece la pantalla de Billie

    await page.click('#buy-button__text');
    await page.waitForTimeout(2000);  // 2 seconds pause

    // Espera al iframe fullscreen
    await page.waitForSelector('#klarna-hpp-instance-fullscreen');

    // Localiza el iframe interno "billie"
    const billieFrame = page.frameLocator('#klarna-hpp-instance-fullscreen').frameLocator('#b2binvoice_billie-fullscreen-iframe');

    // Selecciona la 2ª opción (GmbH)
    await billieFrame.locator('#entity_type').selectOption({ value: 'limited_company' });

    // Verifica que quedó seleccionada
    await expect(billieFrame.locator('#entity_type')).toHaveValue('limited_company');

    await billieFrame.locator('[data-test="legal-form-step.cta"]').click();

    const billieFrame2 = page.frameLocator('#klarna-hpp-instance-fullscreen').frameLocator('#b2binvoice_billie-fullscreen-iframe');
    
    await billieFrame2.locator('[data-test="company-name"]').fill(datosrail.BillieName);
    await billieFrame2.locator('[data-test="street"]').fill(datosrail.BillieStreet);
    await billieFrame2.locator('[data-test="number"]').fill(datosrail.BillieNumber);    
    await billieFrame2.locator('[data-test="postal_code"]').fill(datosrail.BilliePostalCode);
    await billieFrame2.locator('[data-test="city"]').fill(datosrail.BillieCity);

    await billieFrame2.locator('[data-test="company-details-cta"]').click();
    
    await page.waitForTimeout(1000);  // 1 second pause
    const billieFrame3 = page.frameLocator('#klarna-hpp-instance-fullscreen').frameLocator('#b2binvoice_billie-fullscreen-iframe');
    await billieFrame3.locator('[data-test="close-CTA"]').click();

    
    await page.waitForTimeout(10000);  // 10 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Billie-${rail}-${cod_country}.png` });

    await page.pause();
    
});