async function fillCZDeliveryForm(page, datosvar, datosrail) {
        await page.locator('//input[@name="deliveryAddress.email"]').fill(datosvar.ecoemail);
        await page.locator('//input[@name="deliveryAddress.phone"]').fill(datosDE.Phone);
        await page.locator('//input[@name="deliveryAddress.firstName"]').fill(datosvar.name);
        await page.locator('//input[@name="deliveryAddress.lastName"]').fill(datosvar.surname);
        await page.locator('//input[@name="deliveryAddress.streetname"]').fill(datosvar.address);
        await page.locator('//input[@name="deliveryAddress.streetnumber"]').fill(datosvar.nummer);
        await page.locator('//input[@name="deliveryAddress.postalCode"]').fill(datosrail.PostalCode);
        await page.locator('//input[@name="deliveryAddress.town"]').fill(datosrail.City);
        await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
  }
  
  module.exports = { fillCZDeliveryForm };  

