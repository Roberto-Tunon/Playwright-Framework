async function fillDeliveryForm(page, datosvar, datosrail) {       
    await page.locator('[data-purpose="form.input.deliveryAddress.email.field"]').fill(datosvar.user);
    await page.locator('[data-purpose="form.input.deliveryAddress.phone.field"]').fill(datosrail.Phone); 
    await page.locator('[data-purpose="form.input.deliveryAddress.streetname.field"]').fill(datosvar.address);  
    await page.locator('[data-purpose="form.input.deliveryAddress.streetnumber.field"]').fill(datosvar.nummer);
    await page.locator('[data-purpose="form.input.deliveryAddress.firstName.field"]').fill(datosvar.name);
    await page.locator('[data-purpose="form.input.deliveryAddress.lastName.field"]').fill(datosvar.surname);
    await page.locator('[data-purpose="form.input.deliveryAddress.postalCode.field"]').fill(datosrail.PostalCode);
    await page.locator('[data-purpose="form.input.deliveryAddress.town.field"]').fill(datosrail.City);
    await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
  }
  
  module.exports = { fillDeliveryForm };  