import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
const { test } = require('@playwright/test');
const { datosvar } = require('./constantes');
const { AcceptCookiesLogin } = require('../utils/AcceptCookiesLogin');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { loginUserIDP } = require('../utils/loginUserIDP');
const { OpenPage } = require('../utils/OpenPage');


test('Shopping with logged user Riverty', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const datosrail = ObtenerDatos(cod_country);   

    await epic(rail);      
    await feature(cod_country);             
    await story('Riverty');

    await description("E2E Test for " + rail + "-" + cod_country);
    await tag(cod_country);
    await parameter("Rail", process.env.RAIL);
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country);

    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();

    await page.getByRole('link', { name: 'Anmelden' }).click();  
    await page.waitForTimeout(2000);
    await AcceptCookiesLogin(page, datosrail);     

    await loginUserIDP(page, datosvar);

    // await page.locator('[data-purpose="entry.counter.increase"]').first().click();
    
    await page.locator('[data-purpose="form.input.voucherCode.field"]').fill(`TEST-LZ-${rail}-1`);
    await page.waitForTimeout(1000);
    await page.locator('[data-purpose="checkout.voucherForm.button.submit"]').click();

    await page.locator('[data-purpose="cart.button.submit.bottom"]').click();    
        
    await page.locator('[data-purpose="checkout.paymentOptions.riverty"]').click();
    await page.locator('[data-purpose="form.input.birthdate.field"]').fill('24.01.1980');
    await page.locator('[data-purpose="checkout.paymentOptions.riverty.submit"]').click();

    if (cod_country === "AT") {
        await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Riverty-${rail}-${cod_country}.png`, fullPage: true });  

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    
    await page.waitForTimeout(5000);  // 5 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Riverty-${rail}-${cod_country}.png`});

    await page.pause();
    
});