// utils/AcceptCookies.js
async function AcceptCookies(page, datos) {

    await page.waitForTimeout(1000);  // 1 second pause
      
    // Verifica si el botón de aceptar cookies está presente y haz click si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }

    await page.waitForTimeout(1000);  // 1 second pause

    const acceptModalButton = await page.locator(`//span[contains(text(),"${datos.Cookiebutton}")]`).nth(1);
    if (await acceptModalButton.isVisible()) {
    await acceptModalButton.click();
    };

    await page.waitForTimeout(2000);  // 2 seconds pause
  }
  
  module.exports = { AcceptCookies };  