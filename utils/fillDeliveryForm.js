// utils/fillDeliveryForm.js
async function fillDeliveryForm(page, datosvar, datosDE) {
    await page.locator('//input[@name="deliveryAddress.email"]').fill(datosvar.ecoemail);
    await page.locator('//input[@name="deliveryAddress.phone"]').fill(datosDE.DEPhone);
    await page.locator('//input[@name="deliveryAddress.firstName"]').fill(datosvar.name);
    await page.locator('//input[@name="deliveryAddress.lastName"]').fill(datosvar.surname);
    await page.locator('//input[@name="deliveryAddress.streetname"]').fill(datosvar.address);
    await page.locator('//input[@name="deliveryAddress.streetnumber"]').fill(datosvar.nummer);
    await page.locator('//input[@name="deliveryAddress.postalCode"]').fill(datosDE.DEPostalCode);
    await page.locator('//input[@name="deliveryAddress.town"]').fill(datosDE.DECity);
    await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
  }
  
  module.exports = { fillDeliveryForm };
  