const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { AcceptCookiesLogin } = require('../utils/AcceptCookiesLogin');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { loginUserIDP } = require('../utils/loginUserIDP');


test('Shopping with logged user Riverty', async ({ browser }) => {

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

    if (rail === "AT") {
        await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Riverty-${rail}.png`, fullPage: true });  

    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    
    await page.waitForTimeout(5000);  // 5 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Riverty-${rail}.png`});

    await page.pause();
    
});