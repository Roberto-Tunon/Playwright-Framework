import { Page } from '@playwright/test';
import { DatosVar } from '../../tests/constantes';
 
export async function loginUser(page: Page, datosvar: DatosVar): Promise<void> {
  await page.locator('[data-purpose="form.input.userid.field"]').fill(datosvar.user);
  await page.locator('[data-purpose="form.input.password.field"]').fill(datosvar.pwd);
  await page.locator('[data-purpose="customerAuthentication.button.login"]').click();
}