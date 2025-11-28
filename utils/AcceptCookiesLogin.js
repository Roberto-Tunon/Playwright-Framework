// utils/AcceptCookies.js
async function AcceptCookiesLogin(page, datos) {

    await page.waitForTimeout(500);  // 0.5 seconds pause
      
    // Verifica si el botón de aceptar cookies está presente y haz click si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }
   
  }
  
  module.exports = { AcceptCookiesLogin };  