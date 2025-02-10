async function loginUser(page, datosvar) {

    await page.locator('[data-purpose="form.input.userid.field"]').fill(datosvar.user);
    await page.locator('[data-purpose="form.input.password.field"]').fill(datosvar.pwd);
    await page.locator('[data-purpose="customerAuthentication.button.login"]').click();    
}
  
module.exports = { loginUser };