import { Page } from '@playwright/test';
import { DatosRail } from '../../tests/constantes';

export async function AcceptCookiesLogin(page: Page, datos: DatosRail): Promise<void> {
  
const acceptCookiesButton = page.locator('[data-purpose="cookieBar.button.accept"]');

  try {
      await acceptCookiesButton.waitFor({ state: 'visible', timeout: 3000 });
      await acceptCookiesButton.click();
  } catch {
    // No modal window, go on
  }

}