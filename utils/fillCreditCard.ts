import { Page } from '@playwright/test';
import { PayData, DatosRail } from '../tests/constantes';

export async function fillCreditCard(page: Page, payData: PayData, datosrail: DatosRail): Promise<void> {

  const frameLocator1 = page.frameLocator(`iframe[title="${datosrail.FrameNumber}"]`);
  const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
  await cardNumberInput.fill(payData.cardnumber);

  const frameLocator2 = page.frameLocator(`iframe[title="${datosrail.FrameDate}"]`);
  const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
  await cardDateInput.fill(payData.carddate);

  const frameLocator3 = page.frameLocator(`iframe[title="${datosrail.FrameCVV}"]`);
  const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
  await cardcvvInput.fill(payData.cardcvv);

  await page.locator('[data-testid="holderName"]').fill(payData.cardholder);
  await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
}