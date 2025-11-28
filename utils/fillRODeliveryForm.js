async function fillRODeliveryForm(page, datosvar, datosrail) {      
    
      await page.waitForTimeout(2000);  // 2 seconds pause
      
      await page.locator('[data-purpose="form.input.deliveryAddress.email.field"]').fill(datosvar.user);
      await page.locator('[data-purpose="form.input.deliveryAddress.phone.field"]').fill(datosrail.Phone); 
      await page.locator('[data-purpose="form.input.deliveryAddress.streetname.field"]').fill(datosvar.address);  
      await page.locator('[data-purpose="form.input.deliveryAddress.streetnumber.field"]').fill(datosvar.nummer);
      await page.locator('[data-purpose="form.input.deliveryAddress.firstName.field"]').fill(datosvar.name);
      await page.locator('[data-purpose="form.input.deliveryAddress.lastName.field"]').fill(datosvar.surname);
      
      await page.click('[data-purpose="postalCodeDistrictLocality.region.select.value"]');
      await page.click('role=option >> text=Bucuresti');
      await page.locator('[data-purpose="postalCodeDistrictLocality.town.select.value"]').click();
      await page.locator('[role="option"][id="Bucuresti (Sectorul 5)"]').click();

      await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();      
      
  }
  
  module.exports = { fillRODeliveryForm };  

