const { test, expect } = require('@playwright/test');

const { datosvar, datosDE, datosCZ } = require('./constantes');

test.describe.serial('Lutz Card DE-CZ', () => {
    ['de', 'cz'].forEach((rail) => {

    test(`Lutz Card for ${rail}`, async ({ browser }) => {
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
        }
        if (rail === 'de') {
            await page.goto(`https://www.xxxlutz.${rail}/kundenkarte`);
        } else if (rail === 'cz') {
            await page.goto(`https://www.xxxlutz.${rail}/customercard`);
        }       
        await page.locator('[data-purpose="form.input.firstname.field"]').fill(datosvar.name);
        await page.locator('[data-purpose="form.input.lastname.field"]').fill(datosvar.surname);  
        await page.locator('[data-purpose="customerCard.register.nameStep"]').click();  
        await page.locator('[data-purpose="form.input.street.field"]').fill(datosvar.address);
        await page.locator('[data-purpose="form.input.streetNumber.field"]').fill(datosvar.nummer); 

        if (rail === 'de') {
            await page.locator('[data-purpose="form.input.postalcode.field"]').fill(datosDE.PostalCode); 
            await page.locator('[data-purpose="form.input.town.field"]').fill(datosDE.City);
            await page.locator('[data-purpose="form.input.phone.field"]').fill(datosDE.Phone);  
        } else if (rail === 'cz') {
            await page.locator('[data-purpose="form.input.postalcode.field"]').fill(datosCZ.PostalCode); 
            await page.locator('[data-purpose="form.input.town.field"]').fill(datosCZ.City);
            await page.locator('[data-purpose="form.input.phone.field"]').fill(datosCZ.Phone);  
        }

        await page.locator('[data-purpose="customerCard.register.addressStep"]').click();
        await page.locator('[data-purpose="form.input.dateOfBirth.field"]').fill(datosvar.birthdate);  
        await page.locator('[data-purpose="form.input.email.field"]').fill(datosvar.email);

        if (rail === 'de') {
          await page.locator('(//span[@class="_wtLhIv9TUUp1hWW9 _NMwHaEOrMMmEA5PW"])[2]').click();
        }
        await page.locator('[data-purpose="customerCard.register.emailStep"]').click();  
        
        if (rail === 'de') {
          const texto = await page.locator('//h1[normalize-space()="Fast geschafft!"]').textContent();        
          await expect(texto.includes('Fast geschafft!')).toBeTruthy();
        } else if (rail === 'cz') {
            const texto = await page.locator('//h1[contains(text(),"Téměř hotovo!")]').textContent();        
            await expect(texto.includes('Téměř hotovo!')).toBeTruthy();
        }  
        
        await page.waitForTimeout(1000);  // 1 second pause

        await context.close();
        
    });

  });
});  