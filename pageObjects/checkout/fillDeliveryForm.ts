import { Page } from '@playwright/test';
import { DatosVar, DatosRail } from '../../tests/constantes';
import { Logger } from '../logger';

export async function fillDeliveryForm(page: Page, datosvar: DatosVar, datosrail: DatosRail): Promise<void> {
  Logger.step('Fill Delivery Form');

  await page.waitForTimeout(2000);

  Logger.debug('Filling email field');
  await page.locator('input[name$="Address.email"]').fill(datosvar.user);
  
  Logger.debug('Filling phone field');
  await page.locator('input[name$="Address.phone"]').fill(datosrail.Phone ?? '');
  
  Logger.debug('Filling address fields');
  await page.locator('input[name$="Address.streetname"]').fill(datosvar.address);
  await page.locator('input[name$="Address.streetnumber"]').fill(datosvar.nummer);
  await page.locator('input[name$="Address.firstName"]').fill(datosvar.name);
  await page.locator('input[name$="Address.lastName"]').fill(datosvar.surname);

  if (datosrail.Country === 'RO') {
    Logger.debug('Handling RO country-specific fields');
    await page.click('[data-purpose="postalCodeDistrictLocality.region"]');
    await page.click('role=option >> text=Bucuresti');
    await page.locator('[data-purpose="postalCodeDistrictLocality.town"]').click();
    await page.locator('[role="option"][id="Bucuresti (Sectorul 5)"]').click();
  } else {
    if (datosrail.Country === 'HU') {
      Logger.debug('Handling HU country-specific gender field');
      await page.click('[data-purpose="form.select.deliveryAddress.gender"]');
      await page.click('role=option >> text=Úr');
    }
    Logger.debug('Filling postal code and city fields');
    await page.locator('input[name$="Address.postalCode"]').fill(datosrail.PostalCode ?? '');
    await page.locator('input[name$="Address.town"]').fill(datosrail.City ?? '');
  }

  Logger.debug('Waiting for submit button to be visible and enabled');
  const submitButton = page.locator('[data-purpose="checkout.addressForms.button.submit"]');
  
  try {
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    Logger.debug('Submit button is visible');
    
    // Wait for button to be enabled
    await submitButton.evaluate((el: HTMLElement) => {
      const button = el as HTMLButtonElement;
      return !button.disabled;
    });
    Logger.debug('Submit button is enabled');
    
    await submitButton.click();
    Logger.success('Delivery form submitted');
  } catch (error) {
    Logger.error(`Failed to submit delivery form: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}