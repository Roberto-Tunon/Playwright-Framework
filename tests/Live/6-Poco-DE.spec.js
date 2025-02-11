const { test, expect } = require('@playwright/test');
const { datosvar, datosDE, PayLive } = require('../constantes');

test('Poco DE', async ({ browser }) => {
    const context = await browser.newContext({
        ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
    });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
  
    await page.goto('https://www.poco.de/');
    await page.waitForTimeout(3000);  // 3 seconds pause
    
    // Verifica si el botón de aceptar cookies está presente y haz clic si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
    };

    await page.locator('[data-purpose="newsletter.email.field"]').first().fill(datosvar.email);
    await page.locator('(//button[@type="submit"])[2]').click();

    await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosvar.Pocoproduct);
    await page.getByRole('link', { name: 'Bormioli Longdrinkbecher' }).click();
    await page.locator('button').filter({ hasText: 'In den Warenkorb' }).click();
    await page.getByLabel('Zum Warenkorb').click();

    await page.getByText('PaketversandPaketversandSelbstabholung').click();
    await page.getByText('Selbstabholung').click();

    await page.getByTestId('locationPicker.button').click();
    await page.getByPlaceholder('PLZ/Ort').fill(datosDE.PostalCode);
    await page.getByRole('button', { name: datosDE.City}).click();
    await page.getByLabel('dialog').getByRole('button', { name: 'Filiale wählen' }).click();
    
    await page.locator('//a[@data-purpose="cart.button.submit.bottom"]').click();
    await page.locator('[data-purpose="form.input.paymentAddress.email.field"]').fill(datosvar.ecoemail);
    await page.locator('[data-purpose="form.input.paymentAddress.phone.field"]').fill(datosDE.Phone); 

    await page.getByText('Anrede *').click();
    await page.getByRole('option', { name: 'Herr' }).click();

    await page.locator('[data-purpose="form.input.paymentAddress.firstName.field"]').fill(datosvar.name);
    await page.locator('[data-purpose="form.input.paymentAddress.lastName.field"]').fill(datosvar.surname);
    await page.locator('[data-purpose="form.input.paymentAddress.streetname.field"]').fill(datosvar.address);
    await page.locator('[data-purpose="form.input.paymentAddress.streetnumber.field"]').fill(datosvar.nummer);
    await page.locator('[data-purpose="form.input.paymentAddress.postalCode.field"]').fill(datosDE.PostalCode);
    await page.locator('[data-purpose="form.input.paymentAddress.town.field"]').fill(datosDE.City);   
    await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
    
    await page.pause();

    const frameLocator1 = page.frameLocator('iframe[title="Iframe für Kartennummer"]');
    const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
    await cardNumberInput.fill(PayLive.cardnumber);

    const frameLocator2 = page.frameLocator('iframe[title="Iframe für Ablaufdatum"]');
    const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
    await cardDateInput.fill(PayLive.carddate);

    const frameLocator3 = page.frameLocator('iframe[title="Iframe für Sicherheitscode"]');
    const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
    await cardcvvInput.fill(PayLive.cardcvv);

    await page.locator('[data-testid="holderName"]').fill(PayLive.cardholder);

    await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
          
    await page.pause();      

    await context.close();
});
