import { Page } from '@playwright/test';
import { PayData, DatosRail } from '../../tests/constantes';
import { Logger } from '../logger';

export async function fillCreditCard(page: Page, payData: PayData, datosrail: DatosRail): Promise<void> {
  Logger.section('Filling Credit Card Payment');

  try {
    Logger.step(1, 'Enter card number');
    const frameLocator1 = page.frameLocator(`iframe[title="${datosrail.FrameNumber}"]`);
    const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
    await cardNumberInput.fill(payData.cardnumber);
    Logger.success(`Card number filled (****${payData.cardnumber.slice(-4)})`);

    Logger.step(2, 'Enter card date');
    const frameLocator2 = page.frameLocator(`iframe[title="${datosrail.FrameDate}"]`);
    const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
    await cardDateInput.fill(payData.carddate);
    Logger.success(`Expiry date filled (${payData.carddate})`);

    Logger.step(3, 'Enter CVV');
    const frameLocator3 = page.frameLocator(`iframe[title="${datosrail.FrameCVV}"]`);
    const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
    await cardcvvInput.fill(payData.cardcvv);
    Logger.success('CVV filled');

    Logger.step(4, 'Enter cardholder name');
    await page.locator('[data-testid="holderName"]').fill(payData.cardholder);
    Logger.success(`Cardholder name filled (${payData.cardholder})`);

    Logger.step(5, 'Submit payment');
    await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
    Logger.success('Payment submitted');
  } catch (error) {
    Logger.error('fillCreditCard failed', error);
    throw error;
  }
}