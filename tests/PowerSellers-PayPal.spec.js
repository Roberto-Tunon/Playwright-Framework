const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { fillSSO } = require('../utils/fillSSO');
const { AcceptCookies } = require('../utils/AcceptCookies');
const { ObtenerDatos } = require('../utils/ObtenerDatos');

test('Shopping with PayPal', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const rail = process.env.COUNTRY || 'default';
    console.log(`Parámetro recibido: ${rail}`);

    const datosrail = ObtenerDatos(rail);   
    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/`);   
   
    await fillSSO(page, datosvar);
 
    await page.pause();        
    
    // await AcceptCookies(page, datosrail);

    await page.goto(`https://xxxlutz-${rail}.qc.xxxl-dev.at/api/${rail}/testing/products/delivery`);     
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryForm(page, datosvar, datosrail);

    await page.locator('[data-purpose="checkout.paymentOptions.paypal"]').first().click(); 
    await page.locator('[data-purpose="checkout.paymentOptions.paypal.submit"]').click();
    if (rail === "AT") {
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();      
    }
    await page.screenshot({ path: 'tests/Screenshots/Payment2.png', fullPage: true }); 
    await page.getByTestId('step-content').locator('a[href="#widerrufsbelehrung"]').click();
    await page.locator('//button[@aria-label="Schließen"]').click(); 
      
    await page.keyboard.press('Tab');    
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1000);  // 1 second pause
        
    const [popup] = await Promise.all([
    page.waitForEvent('popup'), // Espera la ventana emergente    
    page.keyboard.press('Enter')
    ]);

    await popup.waitForLoadState(); // Espera que la página cargue completamente

    // Ingresar email de PayPal
    await popup.fill('input#email', 'too-buyer@xxxlutz.at');
    await popup.click('button#btnNext');

    // Ingresar contraseña
    await popup.fill('input#password', 'xxxlutz12345');
    await popup.click('button#btnLogin');

    // Confirmar el pago
    await popup.getByTestId('submit-button-initial').click();
    
    await page.waitForLoadState('networkidle'); 
    await page.waitForTimeout(1000);  // 1 second pause
    await page.screenshot({ path: 'tests/Screenshots/Final-Order.png' });    
    await page.pause();    
});