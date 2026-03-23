import { Page } from '@playwright/test';
import { DatosRail } from '../tests/constantes';

export async function AcceptCookies(page: Page, datos: DatosRail): Promise<void> {

  await page.waitForTimeout(1000);

  const acceptCookiesButton = page.locator('[data-purpose="cookieBar.button.accept"]');
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }

  await page.waitForTimeout(1000);

  // await page.getByRole('button', { name: datos.Cookiebutton }).click();

  const modal = page.locator('[data-purpose="modal.body"]');
  if (await modal.isVisible()) {
    const button = modal.locator('button');
    await button.waitFor({ state: 'visible' });
    await button.click();
  }
}