const { test, expect } = require('@playwright/test');

const { datosvar, datosDE, datosCZ } = require('./constantes');

test.describe.serial('Contact Center DE-CZ', () => {
    ['de', 'cz'].forEach((rail) => {

    test(`Contact Center for ${rail}`, async ({ browser }) => {
        const context = await browser.newContext({
          ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
        });
        const page = await context.newPage();

        await page.setViewportSize({ width: 1920, height: 1080 });
    
        // Accept cookies    
        await page.goto(`https://www.xxxlutz.${rail}`);
        await page.waitForTimeout(4000);  // 4 seconds pause
    
        // Verifica si el botón de aceptar cookies está presente y haz clic si existe
        const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
        if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
        };
        
        if (rail === 'de') {
          await page.goto(`https://www.xxxlutz.${rail}/kontaktcenter`);
        } else if (rail === 'cz') {
          await page.goto(`https://www.xxxlutz.${rail}/kontaktnicentrum`);
        }  

        if (rail === 'de') {
          await page.locator('label').filter({ hasText: 'einem Filialeinkauf' }).locator('span').nth(1).click();
        } else if (rail === 'cz') {
          await page.locator('label').filter({ hasText: 'nákupu na pobočce' }).locator('span').nth(1).click();
        }

        await page.locator('[data-purpose="contactcenter.subject.submit"]').click();
        await page.locator('[data-purpose="form.input.orderCode.field"]').fill('1877089501');    
        await page.locator('[data-purpose="form.select.gender.select.value"]').click();

        if (rail === 'de') {
          await page.getByRole('option', { name: 'Herr' }).click();
        } else if (rail === 'cz') {
          await page.getByRole('option', { name: 'Pan' }).first().click();
        }  
        await page.locator('[data-purpose="form.input.firstName.field"]').fill(datosvar.name);
        await page.locator('[data-purpose="form.input.lastName.field"]').fill(datosvar.surname);
        await page.locator('[data-purpose="form.input.email.field"]').fill(datosvar.email);

        if (rail === 'de') {
          await page.locator('[data-purpose="form.input.phone.field"]').fill(datosDE.DEPhone);
          await page.locator('[data-purpose="form.input.postalCode.field"]').fill(datosDE.DEPostalCode);
          await page.locator('[data-purpose="form.input.town.field"]').fill(datosDE.DECity);
            
        } else if (rail === 'cz') {
          await page.locator('[data-purpose="form.input.phone.field"]').fill(datosCZ.CZPhone);
          await page.locator('[data-purpose="form.input.postalCode.field"]').fill(datosCZ.CZPostalCode);
          await page.locator('[data-purpose="form.input.town.field"]').fill(datosCZ.CZCity);
        }

        await page.locator('[data-purpose="contactcenter.contactdata.submit"]').click();        
        await page.waitForTimeout(2000);  // 2 seconds pause
    
        await page.locator('[data-purpose="contactcenter.messageandfiles.select.subsidiary.select.value"]').click();

        if (rail === 'de') {
          await page.getByRole('option', { name: 'XXXLutz Augsburg' }).click();
        } else if (rail === 'cz') {
          await page.getByRole('option', { name: 'XXXLutz Brno' }).click();
        }      
        await page.locator('[data-purpose="form.input.message.field"]').fill(datosvar.message);
        await page.locator('[data-purpose="contactcenter.messageandfiles.submit"]').click();
        await page.locator('[data-purpose="contactcenter.summary.submit"]').click();

        if (rail === 'de') {
          await page.locator('div').filter({ hasText: 'Vielen Dank für Ihre Anfrage' });
        } else if (rail === 'cz') {
          await page.locator('div').filter({ hasText: 'Děkujeme za Váš dotaz' });
        }
    
        await page.waitForTimeout(2000);  // 2 seconds pause

        await context.close();
        
    });

  });
});    
  