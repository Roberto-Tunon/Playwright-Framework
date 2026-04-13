import { Page } from '@playwright/test';
import { DatosVar } from '../../tests/constantes';
import { Logger } from '../logger';
 
export async function loginUser(page: Page, datosvar: DatosVar): Promise<void> {
  Logger.section('User Authentication');

  try {
    Logger.step(1, 'Enter email/username');
    await page.locator('[data-purpose="form.input.userid.field"]').fill(datosvar.user);
    Logger.success(`Email entered (${datosvar.user})`);

    Logger.step(2, 'Enter password');
    await page.locator('[data-purpose="form.input.password.field"]').fill(datosvar.pwd);
    Logger.success('Password entered');

    Logger.step(3, 'Click login button');
    await page.locator('[data-purpose="customerAuthentication.button.login"]').click();
    Logger.success('Login submitted');
  } catch (error) {
    Logger.error('loginUser failed', error);
    throw error;
  }
}