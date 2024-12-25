const { test, expect } = require('@playwright/test');

const { datosvar, datosDE, datosCZ } = require('./constantes');

test.describe.serial('Shopping DE-CZ', () => {
    ['cz','de'].forEach((rail) => {

    test(`Shopping for ${rail}`, async ({ browser }) => {

        const context = await browser.newContext({
          ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos
        });
        const page = await context.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });
    
        // Accept cookies    
        await page.goto(`https://www.xxxlutz.${rail}`);
        await page.waitForTimeout(3000);  // 3 seconds pause
    
        // Verifica si el botón de aceptar cookies está presente y haz clic si existe
        const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
        if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
        };

        if (rail === 'de') {
            await page.goto(`https://www.xxxlutz.${rail}/c/restaurant`);
          } else if (rail === 'cz') {
            await page.goto(`https://www.xxxlutz.${rail}/c/xxxl-restaurace`);
          }  
        
        if (rail === 'de') {
          await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosDE.DEProduct);
        } else if (rail === 'cz') {
          await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosCZ.CZProduct);
        }
        await page.locator('[data-purpose="header.searchBar.button.submit"]').click();         
        await page.locator('[data-testid="favourites.unchecked"]').first().click();  

        if (rail === 'de') {
          await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
        } else if (rail === 'cz') {
          await page.locator('[data-purpose="onewayexpander.button"]').click();          
          await page.getByRole('textbox', { name: 'E-mail' }).click();
          await page.getByRole('textbox', { name: 'E-mail' }).fill(datosvar.user);
          await page.getByRole('textbox', { name: 'Heslo' }).click();
          await page.getByRole('textbox', { name: 'Heslo' }).fill(datosvar.pwd);
          await page.getByRole('button', { name: 'Přihlásit se' }).click();                   
        }    
       
        await page.locator('[data-purpose="checkout.addtocart"]').click();
        await page.locator('[data-purpose="sidebar.button.cancel"]').click();
        

        await page.locator('[data-purpose="wxs.header.actions.favourites"]').click();
        const texto = await page.locator('[data-purpose="product.productNumber"]').textContent();
                
        if (rail === 'de') {
          await expect(texto.includes(datosDE.DEProduct)).toBeTruthy();
        } else if (rail === 'cz') {  
          await expect(texto.includes(datosCZ.CZProduct)).toBeTruthy();
        }

        await page.locator('[data-purpose="wxs.header.actions.cart"]').click();        

        if (rail === 'de') {             
          await page.getByText('PostversandPostversandSelbstabholung').click();  
          await page.getByText('Selbstabholung').click();
          await page.getByTestId('locationPicker.button').click();
          await page.getByPlaceholder('PLZ/Ort').fill(datosDE.DEPostalCode);
          await page.getByRole('button', { name: datosDE.DECity}).click();
          await page.getByLabel('dialog').getByRole('button', { name: 'Filiale wählen' }).click();
          await page.locator('//button[@data-purpose="cart.button.login.modal.bottom"]').click();
          await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
          

        } else if (rail === 'cz') {
          
          /*
          await page.getByText('Osobní odběrBalíková přepravaOsobní odběr').click();
          await page.getByRole('option', { name: 'Osobní odběr' }).click();
          

          await page.getByText('Osobní odběr').nth(0).click();
          await page.getByRole('option', { name: 'Osobní odběr' }).locator('div').click();
          */

          await page.getByTestId('locationPicker.button').click();
          await page.getByPlaceholder('PSČ/město').fill(datosCZ.CZPostalCode);
          await page.getByRole('button', { name: datosCZ.CZCity}).click();
          await page.getByLabel('dialog').getByRole('button', { name: 'Zvolit pobočku' }).click();
          

          await page.locator('//a[@data-purpose="cart.button.submit.bottom"]').click();          
        }

        if (rail === 'de') {
          await page.locator('[data-purpose="form.input.paymentAddress.email.field"]').fill(datosvar.ecoemail);
          await page.locator('[data-purpose="form.input.paymentAddress.phone.field"]').fill(datosDE.DEPhone); 
          await page.locator('[data-purpose="form.input.paymentAddress.firstName.field"]').fill(datosvar.name);
          await page.locator('[data-purpose="form.input.paymentAddress.lastName.field"]').fill(datosvar.surname);
          await page.locator('[data-purpose="form.input.paymentAddress.streetname.field"]').fill(datosvar.address);
          await page.locator('[data-purpose="form.input.paymentAddress.streetnumber.field"]').fill(datosvar.nummer);
          await page.locator('[data-purpose="form.input.paymentAddress.postalCode.field"]').fill(datosDE.DEPostalCode);
          await page.locator('[data-purpose="form.input.paymentAddress.town.field"]').fill(datosDE.DECity);

          await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
          await page.getByRole('heading', { name: 'Sicher bestellen in 3' }).click();
        }  

        await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

        if (rail === 'de') {
          const frameLocator1 = page.frameLocator('iframe[title="Iframe für Kartennummer"]');
          const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
          await cardNumberInput.fill(datosvar.cardnumber);
        }
        else if (rail === 'cz') {  
          const frameLocator1 = page.frameLocator('iframe[title="Iframe pro číslo karty"]');
          const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
          await cardNumberInput.fill(datosvar.cardnumber);
        }          

        if (rail === 'de') {
          const frameLocator2 = page.frameLocator('iframe[title="Iframe für Ablaufdatum"]');
          const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
          await cardDateInput.fill(datosvar.carddate);
        }
        else if (rail === 'cz') {  
          const frameLocator2 = page.frameLocator('iframe[title="Iframe pro datum vypršení platnosti"]');
          const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
          await cardDateInput.fill(datosvar.carddate);
        }        

        if (rail === 'de') {
          const frameLocator3 = page.frameLocator('iframe[title="Iframe für Sicherheitscode"]');
          const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
          await cardcvvInput.fill(datosvar.cardcvv);
        }
        else if (rail === 'cz') {
          const frameLocator3 = page.frameLocator('iframe[title="Iframe pro bezpečnostní kód"]');
          const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
          await cardcvvInput.fill(datosvar.cardcvv);
        }

        await page.locator('[data-testid="holderName"]').fill(datosvar.cardholder);

        await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();

        if (rail === 'de') {
          await page.locator('//span[normalize-space()="Kommentar hinzufügen (optional)"]').click();
          await page.locator('[data-purpose="form.input.userComment.field"]').fill(datosDE.DEMessage);
        } else if (rail === 'cz') {
          await page.locator('(//span[contains(text(),"Komentář")])[1]').click();  
          await page.locator('[data-purpose="form.input.userComment.field"]').fill(datosCZ.CZMessage);
        }
          
        await page.pause();

        await context.close();
        
    });

  });
});