async function loginUserIDP(page, datosvar) {

    await page.locator('[data-purpose="accounts.app.email.input.field"]').fill(datosvar.email);
    await page.locator('[data-purpose="accounts.app.password.input.field"]').fill(datosvar.pwd);
    await page.locator('[data-purpose="accounts.app.login.button.submit"]').click();    
}
  
module.exports = { loginUserIDP };