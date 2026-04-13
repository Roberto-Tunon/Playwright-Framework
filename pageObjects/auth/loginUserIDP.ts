import { Page } from '@playwright/test';
import { DatosVar } from '../../tests/constantes';
 
export async function loginUserIDP(page: Page, datosvar: DatosVar): Promise<void> {
  await page.locator('[data-purpose="accounts.app.email.input.field"]').fill(datosvar.email);
  await page.locator('[data-purpose="accounts.app.password.input.field"]').fill(datosvar.pwd);
  await page.locator('[data-purpose="accounts.app.login.button.submit"]').click();
}