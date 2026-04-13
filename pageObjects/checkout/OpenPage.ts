import { Page } from '@playwright/test';
import { DatosVar, DatosRail } from '../../tests/constantes';
import { fillSSO } from '../auth/fillSSO';
import { AcceptCookies } from './AcceptCookies';

export async function OpenPage(
  page: Page,
  datosvar: DatosVar,
  datosrail: DatosRail,
  rail: string,
  cod_country: string,
  mode: string
): Promise<void> {

  await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/`);

  // await fillSSO(page, datosvar);
  // await page.pause();

  await page.waitForTimeout(1000);
  await AcceptCookies(page, datosrail);

  if (mode !== '1P') {
    try {
      await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing//products/standardDeliveryMarketplaceProduct`);
      await page.locator('[data-purpose="checkout.addtocart"]').click();
      await page.waitForTimeout(1000);
    } catch (e) {
      throw new Error(`No Marketplace product for Country: ${cod_country}`);
    }
  }

  if (mode !== '3P') {
    if (['SE', 'HU', 'SI', 'CZ'].includes(cod_country)) {
      await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/delivery`);
      await page.locator('[data-purpose="checkout.addtocart"]').click();
    } else {
      await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/deliveryassembly`);
      await page.locator('[data-purpose="checkout.addtocart"]').click();
    }
  }

  await page.locator('[data-purpose="sidebar.button.submit"]').click();
}