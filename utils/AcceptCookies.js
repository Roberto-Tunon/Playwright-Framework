// utils/AcceptCookies.js
async function AcceptCookies(page, datos) {

    await page.waitForTimeout(500);  // 1 second pause
      
    // Verifica si el botón de aceptar cookies está presente y haz click si existe
    const acceptCookiesButton = await page.locator('[data-purpose="cookieBar.button.accept"]');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }

    await page.waitForTimeout(500);  // 0.5 second pause

    // await page.getByRole('button', { name: datos.Cookiebutton }).click();

    const modal = page.locator('[data-purpose="modal.body"]');
    const button = modal.locator('button');
    await button.waitFor({ state: 'visible' });
    await button.click();
   
  }
  
  module.exports = { AcceptCookies };  