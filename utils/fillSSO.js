// utils/fillSSO.js
async function fillSSO(page, datosvar) {

    await page.getByRole('link', { name: 'XXXLutz SSO' }).click();
    await page.locator('//input[@id="userNameInput"]').fill(datosvar.SSOuser);
    await page.locator('//input[@id="passwordInput"]').fill(datosvar.SSOpwd);
    await page.locator('//span[@id="submitButton"]').click();
  }
  
  module.exports = { fillSSO };  