const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fill3DSCreditCard } = require('../utils/fill3DSCreditCard');
const { fillDeliveryFormCompany } = require('../utils/fillDeliveryFormCompany');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');


test('Shopping with Billie', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = process.env.COUNTRY || 'default';
    const datosrail = ObtenerDatos(rail);    

    console.log(`Parámetro recibido: ${rail}`);
    
    await page.goto(`https://xxxlutz-${rail}.qa.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);

    await page.pause();        

    await AcceptCookies(page, datosrail);
    await page.goto(`https://xxxlutz-${rail}.qa.xxxl-dev.at/api/${rail}/testing/products/deliveryselfservice`);      
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryFormCompany(page, datosvar, datosrail);     

    await page.locator('[data-purpose="checkout.paymentOptions.klarna_b2b"]').click();
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_b2b.submit"]').click();

    if (rail === "AT") {
        await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Billie-${rail}.png`, fullPage: true });  

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
    
    await billieFrame2.locator('[data-test="company-name"]').fill('Theta Electronics Gold GmbH');
    await billieFrame2.locator('[data-test="street"]').fill('Fichtenstraße');
    await billieFrame2.locator('[data-test="number"]').fill('9');    
    await billieFrame2.locator('[data-test="postal_code"]').fill('6364');
    await billieFrame2.locator('[data-test="city"]').fill('Brixen im Thale');

    await billieFrame2.locator('[data-test="company-details-cta"]').click();
    
    await page.waitForTimeout(1000);  // 1 second pause
    const billieFrame3 = page.frameLocator('#klarna-hpp-instance-fullscreen').frameLocator('#b2binvoice_billie-fullscreen-iframe');
    await billieFrame3.locator('[data-test="close-CTA"]').click();

    
    await page.waitForTimeout(10000);  // 10 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Billie-${rail}.png` });

    await page.pause();
    
});