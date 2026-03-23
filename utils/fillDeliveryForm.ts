import { Page } from '@playwright/test';
import { DatosVar, DatosRail } from '../tests/constantes';

export async function fillDeliveryForm(page: Page, datosvar: DatosVar, datosrail: DatosRail): Promise<void> {

  await page.waitForTimeout(2000);

  await page.locator('input[name$="Address.email"]').fill(datosvar.user);
  await page.locator('input[name$="Address.phone"]').fill(datosrail.Phone ?? '');
  await page.locator('input[name$="Address.streetname"]').fill(datosvar.address);
  await page.locator('input[name$="Address.streetnumber"]').fill(datosvar.nummer);
  await page.locator('input[name$="Address.firstName"]').fill(datosvar.name);
  await page.locator('input[name$="Address.lastName"]').fill(datosvar.surname);

  if (datosrail.Country === 'RO') {
    await page.click('[data-purpose="postalCodeDistrictLocality.region"]');
    await page.click('role=option >> text=Bucuresti');
    await page.locator('[data-purpose="postalCodeDistrictLocality.town"]').click();
    await page.locator('[role="option"][id="Bucuresti (Sectorul 5)"]').click();
  } else {
    if (datosrail.Country === 'HU') {
      await page.click('[data-purpose="form.select.deliveryAddress.gender"]');
      await page.click('role=option >> text=Úr');
    }
    await page.locator('input[name$="Address.postalCode"]').fill(datosrail.PostalCode ?? '');
    await page.locator('input[name$="Address.town"]').fill(datosrail.City ?? '');
  }

  await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
}