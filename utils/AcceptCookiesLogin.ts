import { Page } from '@playwright/test';
import { DatosRail } from '../tests/constantes';

export async function AcceptCookiesLogin(page: Page, datos: DatosRail): Promise<void> {

  await page.waitForTimeout(500);

  const acceptCookiesButton = page.locator('[data-purpose="cookieBar.button.accept"]');
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}