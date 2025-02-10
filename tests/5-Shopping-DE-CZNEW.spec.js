const { test, expect, chromium } = require('@playwright/test');
const { constantes } = require('./constantes');
const { PayLive, datosvar } = require('./constantes');
const { fillDeliveryForm } = require('../utils/fillDeliveryForm');
const { fillCreditCard } = require('../utils/fillCreditCard');
const { loginUser } = require('../utils/loginUser');
const { ObtenerDatos } = require('../utils/ObtenerDatos');
const { AcceptCookies } = require('../utils/AcceptCookies');


test.describe.serial('Shopping DE-CZ', () => {
    ['cz','de'].forEach((rail) => {

    test(`Shopping for ${rail}`, async () => {

        const browser = await chromium.launch({ headless: false, 
          executablePath: '/usr/bin/google-chrome' });
        const context = await browser.newContext({
          ignoreHTTPSErrors: true  // Ignora los errores de certificados no válidos          
        });
        const page = await context.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        console.log(`Parámetro recibido: ${rail}`);
        const datosrail = ObtenerDatos(rail.toUpperCase());  
        
        if (rail === 'de') {
            await page.goto(`https://www.xxxlutz.${rail}/c/restaurant`);
        } else if (rail === 'cz') {
            await page.goto(`https://www.xxxlutz.${rail}/c/xxxl-restaurace`);
        }
        
        await AcceptCookies(page, datosrail);
               
        await page.locator('[data-purpose="header.searchBar.input.field"]').fill(datosrail.Product);
       
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
                
        await expect(texto.includes(datosrail.Product)).toBeTruthy();       
        await page.locator('[data-purpose="wxs.header.actions.cart"]').click();        
        
        await page.getByTestId('locationPicker.button').click();
        await page.locator('[data-purpose="locationSearch.input.field"]').fill(datosrail.PostalCode);
        await page.getByRole('button', { name: datosrail.City}).click();    
        await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();
        
        await page.locator('[data-purpose="cart.button.submit.bottom"]').click();
        
        if (rail === 'de') {
          await fillDeliveryForm(page, datosvar, datosDE);          
          await page.getByRole('heading', { name: 'Sicher bestellen in 3' }).click();
        }  

        await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();

        await fillCreditCard(page, PayLive, rail.toUpperCase())          

        if (rail === 'de') {
          await page.locator('//span[normalize-space()="Kommentar hinzufügen (optional)"]').click();
          await page.locator('[data-purpose="form.input.userComment.field"]').fill(datosrail.Message);
        } else if (rail === 'cz') {
          await page.locator('(//span[contains(text(),"Komentář")])[1]').click();  
          await page.locator('[data-purpose="form.input.userComment.field"]').fill(datosrail.Message);
        }
          
        await page.pause();

        await context.close();
        
    });

  });
});