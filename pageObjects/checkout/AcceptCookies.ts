import { Page } from '@playwright/test';
import { DatosRail } from '../../tests/constantes';
 
export async function AcceptCookies(page: Page, datos: DatosRail): Promise<void> {
 
  const acceptCookiesButton = page.locator('[data-purpose="cookieBar.button.accept"]');
  try {
    await acceptCookiesButton.waitFor({ state: 'visible', timeout: 3000 });
    await acceptCookiesButton.click();
  } catch {
    // El banner de cookies no apareció, continuamos
  }
    
  const modal = page.locator('[data-purpose="modal.body"]');
  try {
    await modal.waitFor({ state: 'visible', timeout: 3000 });
    await modal.locator('button').click();
  } catch {
    // El modal no apareció, continuamos
  }
}