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

    // Overrides the global timeout just for this specific test
    test.setTimeout(80000);
    
    const cod_country = process.env.COUNTRY || 'default';
    const rail = process.env.RAIL || 'default';
    const datosrail = ObtenerDatos(cod_country); 
    const mode = process.env.MODE || '1P';
   
    await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

    const deliverySelect = page.locator('select[data-purpose="deliveryOptions.select.deliveryOption.select.value"]');
    const selfServiceOption = deliverySelect.locator('option[value="SELF_SERVICE"]');    

    if (await selfServiceOption.count() > 0) {
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
        await page.locator('#SELF_SERVICE').click();

        await page.getByTestId('locationPicker.button').click();
        await page.locator('[data-purpose="locationFinder.input.field"]').fill(datosrail.PostalCode);
        await page.getByRole('button', { name: datosrail.City}).click();    
        await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();

        await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
        await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

        await fillSELFDeliveryForm(page, datosvar, datosrail); 

    } else {
        console.log('⚠️ SELF_SERVICE not found. Selecting the first available option...');  
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
        await page.locator('#POSTAGE').click();       
        await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
        await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
        await fillDeliveryForm(page, datosvar, datosrail);
    }

    await page.locator('[data-purpose="checkout.paymentOptions.paypal"]').first().click(); 
    await page.locator('[data-purpose="checkout.paymentOptions.paypal.submit"]').click();

    if (["AT", "SI", "HR"].includes(cod_country)){
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();      
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: `tests/Screenshots/Payment-Paypal-${rail}-${cod_country}.png`, fullPage: true });     
    await page.waitForTimeout(1000);
    
    const link = page.locator('a[href*="widerrufsbelehrung"],a[href="#oou"],a[href="#koepvillkor"], a[href="#preklic"]');
    await link.focus();

    await page.waitForTimeout(1000);                     
      
    await page.keyboard.press('Tab');        
    await page.keyboard.press('Enter');
    await page.waitForTimeout(6000);  
    
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
    if (!loginFrame) throw new Error('❌ PayPal login Iframe not found');

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

    console.log('✅ PayPal Login completed');

    // Confirmar el pago
    await popup.getByTestId('submit-button-initial').click();
    
    // await page.waitForLoadState('networkidle'); 
    await page.waitForTimeout(6000);  // 6 seconds pause
    await page.screenshot({ path: `tests/Screenshots/Final-Order-Paypal-${rail}-${cod_country}.png` });    
    await page.pause();    
});