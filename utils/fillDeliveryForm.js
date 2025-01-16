async function fillDeliveryForm(page, datosvar, datosrail) {
    await page.locator('[data-purpose="form.input.paymentAddress.email.field"]').fill(datosvar.ecoemail);
          await page.locator('[data-purpose="form.input.paymentAddress.phone.field"]').fill(datosrail.Phone); 
          await page.locator('[data-purpose="form.input.paymentAddress.firstName.field"]').fill(datosvar.name);
          await page.locator('[data-purpose="form.input.paymentAddress.lastName.field"]').fill(datosvar.surname);
          await page.locator('[data-purpose="form.input.paymentAddress.streetname.field"]').fill(datosvar.address);
          await page.locator('[data-purpose="form.input.paymentAddress.streetnumber.field"]').fill(datosvar.nummer);
          await page.locator('[data-purpose="form.input.paymentAddress.postalCode.field"]').fill(datosrail.PostalCode);
          await page.locator('[data-purpose="form.input.paymentAddress.town.field"]').fill(datosrail.City);
          await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
  }
  
  module.exports = { fillDeliveryForm };  