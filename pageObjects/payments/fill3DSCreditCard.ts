import { Page } from '@playwright/test';
import { PayData, DatosRail } from '../../tests/constantes';

export async function fill3DSCreditCard(page: Page, payData: PayData, datosrail: DatosRail): Promise<void> {

  const frameLocator1 = page.frameLocator(`iframe[title="${datosrail.FrameNumber}"]`);
  await frameLocator1.locator('#encryptedCardNumber').fill(payData.threedsnumber ?? '');

  const frameLocator2 = page.frameLocator(`iframe[title="${datosrail.FrameDate}"]`);
  await frameLocator2.locator('#encryptedExpiryDate').fill(payData.carddate);

  const frameLocator3 = page.frameLocator(`iframe[title="${datosrail.FrameCVV}"]`);
  await frameLocator3.locator('#encryptedSecurityCode').fill(payData.cardcvv);

  await page.locator('[data-testid="holderName"]').fill(payData.cardholder);
  await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
}