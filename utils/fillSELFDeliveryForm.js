//  Manera de rellenar los campos cuando elegimos como método de envío: Self PickUp
//  Con Data-purpose no funciona

async function fillSELFDeliveryForm(page, datosvar, datosrail) {     
    
      await page.locator('//*[@name="paymentAddress.email"]').fill(datosvar.user);
      await page.locator('//*[@name="paymentAddress.phone"]').fill(datosrail.Phone); 
      await page.locator('//*[@name="paymentAddress.streetname"]').fill(datosvar.address);
      await page.locator('//*[@name="paymentAddress.streetnumber"]').fill(datosvar.nummer);
      await page.locator('//*[@name="paymentAddress.firstName"]').fill(datosvar.name);
      await page.locator('//*[@name="paymentAddress.lastName"]').fill(datosvar.surname);
          
     if (datosrail.Country === 'RO'){ 

       await page.click('[data-purpose="postalCodeDistrictLocality.region"]');
       await page.click('role=option >> text=Bucuresti');
       await page.locator('[data-purpose="postalCodeDistrictLocality.town"]').click();
       await page.locator('[role="option"][id="Bucuresti (Sectorul 5)"]').click();
     
     } else{
       await page.locator('//*[@name="paymentAddress.postalCode"]').fill(datosrail.PostalCode);
       await page.locator('//*[@name="paymentAddress.town"]').fill(datosrail.City);
     }  
    
     await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
  }
  
  module.exports = { fillSELFDeliveryForm };  



