//  Manera de rellenar los campos cuando elegimos como método de envío: Self PickUp
//  Con Data-purpose no funciona

async function fillSELFDeliveryForm(page, datosvar, datosrail) {           
      await page.locator('//*[@name="paymentAddress.email"]').fill(datosvar.user);
      await page.locator('//*[@name="paymentAddress.phone"]').fill(datosrail.Phone); 
      await page.locator('//*[@name="paymentAddress.streetname"]').fill(datosvar.address);
      await page.locator('//*[@name="paymentAddress.streetnumber"]').fill(datosvar.nummer);
      await page.locator('//*[@name="paymentAddress.firstName"]').fill(datosvar.name);
      await page.locator('//*[@name="paymentAddress.lastName"]').fill(datosvar.surname);
      await page.locator('//*[@name="paymentAddress.postalCode"]').fill(datosrail.PostalCode);
      await page.locator('//*[@name="paymentAddress.town"]').fill(datosrail.City);
      await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
  }
  
  module.exports = { fillSELFDeliveryForm };  



