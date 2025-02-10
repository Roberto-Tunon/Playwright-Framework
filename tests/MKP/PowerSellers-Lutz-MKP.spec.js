const { test, expect } = require('@playwright/test');
const { constantes } = require('../constantes');
const { PayQC, datosvar } = require('../constantes');
const { fillMKPDeliveryForm } = require('../../utils/fillMKPDeliveryForm');
const { fillCreditCard } = require('../../utils/fillCreditCard');
const { fillSSO } = require('../../utils/fillSSO');
const { AcceptCookies } = require('../../utils/AcceptCookies');
const { ObtenerDatos } = require('../../utils/ObtenerDatos');


test('Marketplace shopping with Credit Card', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = process.env.COUNTRY || 'default';
    const mode = process.env.MODE || 'default';
    const pay  = process.env.PAY || 'default';
    const datosrail = ObtenerDatos(rail);    

    console.log(`Parámetros recibido: ${rail} - ${mode} - ${pay}`);
    
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);

    await page.pause();        

    await AcceptCookies(page, datosrail);
    if (mode !== "1P") {
        if (rail === "AT") {
            await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/p/${datosrail.MKPProduct}`);
        } else {
            await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing//products/standardDeliveryMarketplaceProduct`);           
        }
        await page.locator('[data-purpose="checkout.addtocart"]').click();
    } 
    
    if (mode !== "3P") {
        await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosrail.Product);
        await page.locator('[data-purpose="header.searchBar.button.submit"]').click();
        await page.locator('[data-purpose="checkout.addtocart"]').click();
    }

    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
   
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillMKPDeliveryForm(page, datosvar, datosrail);    

    if (pay === "CC") {        
        await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();
        await fillCreditCard(page, PayQC, rail);
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    } else if (pay === "PP") {
        await page.locator('[data-purpose="checkout.paymentOptions.paypal"]').click();
        await page.pause();

    } else if (pay === "KL") {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount.submit"]').click();   
     
        if (rail === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        }        
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

        await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove);
        await page.locator('//button[@id="onContinue"]').click();
        await page.locator('//input[@id="otp_field"]').fill(datosvar.Klarna);
        await page.locator('//button[@id="buy_button"]').click();


    } else if (pay === "KN") {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort.submit"]').click();   
        
        if (rail === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        }
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click(); 
        
        await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove);
        await page.locator('//button[@id="onContinue"]').click();
        await page.locator('//input[@id="otp_field"]').fill(datosvar.Klarna);
        await page.locator('//button[@data-testid="pick-plan"]').click();
        await page.locator('//button[@id="buy_button"]').click();        

    } else {
        throw new Error(`Unsupported payment method: ${pay}`);
    }
  
    await page.pause();
    
});