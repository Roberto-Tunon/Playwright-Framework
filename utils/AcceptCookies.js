// utils/AcceptCookies.js
async function AcceptCookies(page, datos) {

    await page.waitForTimeout(500);  // 1 second pause
      
    // Verifica si el botón de aceptar cookies está presente y haz click si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }

    await page.waitForTimeout(500);  // 0.5 second pause

    await page.getByRole('button', { name: datos.Cookiebutton }).click();

   /*
   
    const acceptModalButton = await page.locator(`//span[contains(text(),"${datos.Cookiebutton}")]`).nth(1);
    if (await acceptModalButton.isVisible()) {
        await acceptModalButton.click();    
    };
   */
  }
  
  module.exports = { AcceptCookies };  