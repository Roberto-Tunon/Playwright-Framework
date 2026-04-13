import { Page } from '@playwright/test';
import { DatosVar } from '../../tests/constantes';

export async function fillSSO(page: Page, datosvar: DatosVar): Promise<void> {
  await page.getByRole('link', { name: 'XXXLutz SSO' }).click();
  await page.locator('//input[@id="userNameInput"]').fill(datosvar.SSOuser);
  await page.locator('//input[@id="passwordInput"]').fill(datosvar.SSOpwd);
  await page.locator('//span[@id="submitButton"]').click();
}