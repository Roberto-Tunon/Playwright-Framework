const { test, expect } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayQC, datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { OpenPage } = require('../utils/OpenPage');

test('Shopping with PayPal', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const datosrail = ObtenerDatos(cod_country); 
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country);

    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    await fillDeliveryForm(page, datosvar, datosrail);

    await page.locator('[data-purpose="checkout.paymentOptions.paypal"]').first().click(); 
    await page.locator('[data-purpose="checkout.paymentOptions.paypal.submit"]').click();

    if (cod_country === "AT") {
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();      
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Paypal-${rail}-${cod_country}.png`, fullPage: true });     
    await page.waitForTimeout(1000);
    
    const widerrufLink = page.getByTestId('step-content').locator('a[href="#widerrufsbelehrung"]');
    const isFocused = await widerrufLink.evaluate(el => el === document.activeElement);

    if (!isFocused) {
      await widerrufLink.focus();
    }

    await page.waitForTimeout(1500);                     
      
    await page.keyboard.press('Tab');        
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);  
    
    // Esperar la ventana de PayPal (popup)
    let popup;
    for (let i = 0; i < 10; i++) {
      const pages = page.context().pages();
      popup = pages.find(p => p.url().includes('paypal.com') && p !== page);
      if (popup) break;
      await page.waitForTimeout(500);
    }
    if (!popup) throw new Error('❌ No se detectó ninguna ventana de PayPal');

    // Esperar el iframe que contiene el campo de email
    let loginFrame;
    for (let i = 0; i < 20; i++) {
      for (const f of popup.frames()) {
        const emailInput = f.locator('input#email');
        if (await emailInput.count() > 0) {
          loginFrame = f;
          //console.log(`✅ Se encontró el iframe con input#email (URL: ${f.url()})`);
          break;
        }
      }
      if (loginFrame) break;
      await page.waitForTimeout(500);
    }
    if (!loginFrame) throw new Error('❌ No se encontró el iframe del login de PayPal');

    // --- Paso 1: rellenar email ---
    const emailInput = loginFrame.locator('input#email');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.click({ force: true });
    await emailInput.fill('too-buyer@xxxlutz.at');

    // --- Paso 2: clic en botón "Siguiente" ---
    const btnNext = loginFrame.locator('button#btnNext');
    await btnNext.waitFor({ state: 'visible', timeout: 5000 });
    await btnNext.click({ force: true });

    // --- Paso 3: esperar el campo de contraseña ---
    const passwordInput = loginFrame.locator('input#password');
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await passwordInput.click({ force: true });
    await passwordInput.fill('xxxlutz12345');

    // --- Paso 4: clic en botón "Iniciar sesión" ---
    const btnLogin = loginFrame.locator('button#btnLogin');
    await btnLogin.waitFor({ state: 'visible', timeout: 5000 });
    await btnLogin.click({ force: true });

    console.log('✅ Login de PayPal completado');

    // Confirmar el pago
    await popup.getByTestId('submit-button-initial').click();
    
    await page.waitForLoadState('networkidle'); 
    await page.waitForTimeout(7000);  // 7 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Paypal-${rail}-${cod_country}.png` });    
    await page.pause();    
});