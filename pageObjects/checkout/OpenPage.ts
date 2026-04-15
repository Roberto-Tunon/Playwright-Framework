import { Page } from '@playwright/test';
import { DatosVar, DatosRail } from '../../tests/constantes';
import { fillSSO } from '../auth/fillSSO';
import { AcceptCookies } from './AcceptCookies';
import { Logger } from '../logger';

export async function OpenPage(
  page: Page,
  datosvar: DatosVar,
  datosrail: DatosRail,
  rail: string,
  cod_country: string,
  mode: string
): Promise<void> {

  try {
    Logger.step(1, 'Navigate to store');
    await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/`);
    Logger.success('Store page loaded');

    // await fillSSO(page, datosvar);
    // await page.pause();

    await page.waitForTimeout(1000);
    Logger.step(2, 'Accept cookies');
    await AcceptCookies(page, datosrail);
    Logger.success('Cookies accepted');

    if (mode !== '1P') {
      try {
        Logger.step(3, 'Add marketplace product');
        await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing//products/standardDeliveryMarketplaceProduct`);
        await page.locator('[data-purpose="checkout.addtocart"]').click();
        await page.waitForTimeout(1000);
        Logger.success('Marketplace product added');
      } catch (e) {
        Logger.error('Failed to add marketplace product', e);
        throw new Error(`No Marketplace product for Country: ${cod_country}`);
      }
    }

    if (mode !== '3P') {
      Logger.step(4, 'Add standard product');
      if (['SE', 'HU', 'SI', 'CZ'].includes(cod_country)) {
        await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/delivery`);
        await page.locator('[data-purpose="checkout.addtocart"]').click();
      } else {
        await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/deliveryassembly`);
        await page.locator('[data-purpose="checkout.addtocart"]').click();
      }
      Logger.success('Standard product added');
    }

    Logger.step(5, 'Proceed to checkout');
    await page.locator('[data-purpose="sidebar.button.submit"]').click();
    Logger.success('Checkout initiated');
  } catch (error) {
    Logger.error('OpenPage failed', error);
    throw error;
  }
}