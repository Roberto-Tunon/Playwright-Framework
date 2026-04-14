import { Page } from '@playwright/test';
import { DatosVar, DatosRail } from '../../tests/constantes';
import { fillDeliveryForm } from './fillDeliveryForm';

type PayCode = 'DEL' | 'KN' | 'KL' | 'CC' | string;

async function AddtoCart(page: Page, datosvar: DatosVar, datosrail: DatosRail): Promise<void> {
  await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
  await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
  await fillDeliveryForm(page, datosvar, datosrail);
}

export async function DeliveryOption(page: Page, datosvar: DatosVar, datosrail: DatosRail, pay: PayCode): Promise<void> {

  const deliveryDropdown = page.locator('div[data-purpose="deliveryOptions.select.deliveryOption"] [role="combobox"]');
  const isDropdownVisible = false; // TODO: Temporary fix - web issue, skip dropdown logic
  let selfServiceOption = null;

  if (isDropdownVisible) {

    console.log('ℹ️ Delivery option searching Self Service');

    await page.locator('div#SELF_SERVICE').waitFor({ state: 'attached', timeout: 5000 });
    selfServiceOption = page.locator('div#SELF_SERVICE[role="option"]');

    if (await selfServiceOption.count() > 0 && !['DEL', 'KN', 'KL'].includes(pay)) {
      console.log('✅ Self Service (Click & Collect) found. Selecting...');
      await deliveryDropdown.click();
      await selfServiceOption.waitFor({ state: 'visible' });
      await selfServiceOption.click();

      await page.getByTestId('locationPicker.button').click();
      await page.locator('[data-purpose="locationFinder.input.field"]').fill(datosrail.PostalCode ?? '');
      await page.getByRole('button', { name: datosrail.City }).click();
      await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();

      await AddtoCart(page, datosvar, datosrail);

    } else {
      console.log('⚠️ SELF_SERVICE not found. Selecting first option if possible...');

      try {
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
        await page.locator('#DELIVERY').click({ timeout: 2000 });
      } catch (e) {
        console.log('ℹ️ Delivery option combo not available. Continuing to login modal...');
      }
      await AddtoCart(page, datosvar, datosrail);
    }

  } else {
    await AddtoCart(page, datosvar, datosrail);
  }
}