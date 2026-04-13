import { Page } from '@playwright/test';
import { DatosVar, DatosRail } from '../../tests/constantes';

export async function fillDeliveryFormCompany(page: Page, datosvar: DatosVar, datosrail: DatosRail): Promise<void> {

  await page.locator('[data-purpose="form.input.deliveryAddress.email.field"]').fill(datosvar.user);
  await page.locator('[data-purpose="form.input.deliveryAddress.phone.field"]').fill(datosrail.Phone ?? '');
  await page.locator('[data-purpose="form.input.deliveryAddress.streetname.field"]').fill(datosvar.address);
  await page.locator('[data-purpose="form.input.deliveryAddress.streetnumber.field"]').fill(datosvar.nummer);
  await page.locator('[data-purpose="form.input.deliveryAddress.firstName.field"]').fill(datosvar.name);
  await page.locator('[data-purpose="form.input.deliveryAddress.lastName.field"]').fill(datosvar.surname);
  await page.locator('[data-purpose="form.input.deliveryAddress.postalCode.field"]').fill(datosrail.PostalCode ?? '');
  await page.locator('[data-purpose="form.input.deliveryAddress.town.field"]').fill(datosrail.City ?? '');

  await page.locator('label >> text=Ich möchte als Firma bezahlen').click();

  await page.locator('[data-purpose="form.input.paymentAddress.companyName.field"]').fill(datosrail.BillieName ?? '');
  await page.locator('[data-purpose="form.input.paymentAddress.salesTaxNumbers[0].field"]').fill(datosrail.BillieUID ?? '');

  await page.locator('label >> text=Ich habe eine abweichende Rechnungsadresse').click();

  await page.locator('[data-purpose="form.input.paymentAddress.email.field"]').fill(datosvar.user);
  await page.locator('[data-purpose="form.input.paymentAddress.phone.field"]').fill(datosrail.Phone2 ?? '');
  await page.locator('[data-purpose="form.input.paymentAddress.streetname.field"]').fill(datosvar.address);
  await page.locator('[data-purpose="form.input.paymentAddress.streetnumber.field"]').fill(datosvar.nummer);
  await page.locator('[data-purpose="form.input.paymentAddress.firstName.field"]').fill(datosvar.name);
  await page.locator('[data-purpose="form.input.paymentAddress.lastName.field"]').fill(datosvar.surname);
  await page.locator('[data-purpose="form.input.paymentAddress.postalCode.field"]').fill(datosrail.PostalCode2 ?? '');
  await page.locator('[data-purpose="form.input.paymentAddress.town.field"]').fill(datosrail.City2 ?? '');

  await page.locator('[data-purpose="checkout.addressForms.button.submit"]').click();
}