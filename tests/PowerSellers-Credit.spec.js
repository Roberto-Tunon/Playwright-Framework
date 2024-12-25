const { test, expect } = require('@playwright/test');
const { datosvar, datosDE, PayQC } = require('./constantes');
const { fillDeliveryForm } = require('./utils/fillDeliveryForm');

test('Shopping', async ({ browser }) => {

    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
      });
      const page = await context.newPage();
      await page.setViewportSize({ width: 1920, height: 1080 });
    
    const param = process.env.PARAM || 'default';
    console.log(`Parámetro recibido: ${param}`);

    if (param === 'QC') {
        await page.goto(`https://xxxlutz-de.qc.xxxl-dev.at/`);   
        
        await page.getByRole('link', { name: 'XXXLutz SSO' }).click();
        await page.locator('//input[@id="userNameInput"]').fill(datosvar.SSOuser);
        await page.locator('//input[@id="passwordInput"]').fill(datosvar.SSOpwd);

        await page.locator('//span[@id="submitButton"]').click();

        await page.pause();        

    } else {
        await page.goto(`https://www.xxxlutz.de/`);     
    }
    
    await page.waitForTimeout(3000);  // 3 seconds pause
      
    // Verifica si el botón de aceptar cookies está presente y haz click si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }

    await page.waitForTimeout(1000);  // 1 second pause

    const acceptModalButton = await page.locator('//span[contains(text(),"Weiter einkaufen")]').nth(1);
    if (await acceptModalButton.isVisible()) {
    await acceptModalButton.click();
    };

    await page.waitForTimeout(2000);  // 2 seconds pause
  
    await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosDE.DEProduct);
    await page.locator('[data-purpose="header.searchBar.button.submit"]').click();
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

    /*

    await page.locator('//input[@name="deliveryAddress.email"]').fill(datosvar.ecoemail);
    await page.locator('//input[@name="deliveryAddress.phone"]').fill(datosDE.DEPhone); 
    await page.locator('//input[@name="deliveryAddress.firstName"]').fill(datosvar.name);
    await page.locator('//input[@name="deliveryAddress.lastName"]').fill(datosvar.surname);
    await page.locator('//input[@name="deliveryAddress.streetname"]').fill(datosvar.address);
    await page.locator('//input[@name="deliveryAddress.streetnumber"]').fill(datosvar.nummer);
    await page.locator('//input[@name="deliveryAddress.postalCode"]').fill(datosDE.DEPostalCode);
    await page.locator('//input[@name="deliveryAddress.town"]').fill(datosDE.DECity);
    await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
    */

    await fillDeliveryForm(page, datosvar, datosDE);

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();
    
    const frameLocator1 = page.frameLocator('iframe[title="Iframe für Kartennummer"]');
    const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
    await cardNumberInput.fill(PayQC.cardnumber);

    const frameLocator2 = page.frameLocator('iframe[title="Iframe für Ablaufdatum"]');
    const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
    await cardDateInput.fill(PayQC.carddate);

    const frameLocator3 = page.frameLocator('iframe[title="Iframe für Sicherheitscode"]');
    const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
    await cardcvvInput.fill(PayQC.cardcvv);

    await page.locator('[data-testid="holderName"]').fill(PayQC.cardholder);
    await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
    

    await page.waitForTimeout(2000);  // 2 seconds pause

    await page.pause();
    
});