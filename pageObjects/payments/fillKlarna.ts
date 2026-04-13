import { Page, Frame } from '@playwright/test';
import { DatosRail } from '../../tests/constantes';

export async function fillKlarna(
  page: Page,
  pay: string,
  datosrail: DatosRail,
  rail: string
): Promise<void> {
  if (pay === 'KO') {
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit"]').click();
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit.submit"]').click();

    if (datosrail.Country === 'AT') {
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
    }
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `tests/Screenshots/Payment-${pay}-${rail}-${datosrail.Country}.png`,
      fullPage: true,
    });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove ?? '');
    await page.locator('//button[@id="onContinue"]').click();
    await page.locator('//input[@id="otp_field"]').fill('234570');

    const planButton = page.getByTestId('confirm-and-pay');
    if (
      ['AT', 'DE'].includes(datosrail.Country ?? '') ||
      (await planButton.isVisible())
    ) {
      await planButton.click();
    }
  } else if (pay === 'KL') {
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount"]').click();
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount.submit"]').click();

    if (datosrail.Country === 'AT') {
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
    }
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `tests/Screenshots/Payment-${pay}-${rail}-${datosrail.Country}.png`,
      fullPage: true,
    });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000);

    if (datosrail.Country === 'SE') {
      await page.locator('//button[@id="signInWithBankIdButton"]').click();
      await page.waitForLoadState('networkidle');
      await page.locator('//button[@id="buy_button"]').click();
    } else {
      await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove ?? '');
      await page.locator('//button[@id="onContinue"]').click();
      await page.locator('//input[@id="otp_field"]').fill('234570');
      await page.locator('//button[@id="buy_button"]').click();
    }
  } else if (pay === 'KN') {
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort"]').click();
    await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort.submit"]').click();

    if (datosrail.Country === 'AT') {
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
    }
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `tests/Screenshots/Payment-${pay}-${rail}-${datosrail.Country}.png`,
      fullPage: true,
    });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForTimeout(10000);

    if (datosrail.Country === 'SE') {
      await page.locator('//button[@id="signInWithBankIdButton"]').click();
      await page.waitForLoadState('networkidle');
      await page.locator('//button[@data-testid="pick-plan"]').click();
      await page.locator('//button[@id="buy_button"]').click();
    } else {
      await page.waitForTimeout(1000);
      await page.getByLabel('Handynummer').fill(datosrail.MKPPhoneApprove ?? '');
      await page.locator('//button[@id="onContinue"]').click();
      await page.locator('//input[@id="otp_field"]').fill('234570');

      const planButton = page.getByTestId('pick-plan');
      if (
        ['AT', 'DE'].includes(datosrail.Country ?? '') ||
        (await planButton.isVisible())
      ) {
        await planButton.click();
      }

      const checkbox = page.locator('//input[@id="banktransferkob_kp.0__label"]');
      try {
        await checkbox.waitFor({ state: 'visible', timeout: 3000 });
        if (await checkbox.isEnabled()) {
          await checkbox.check();
          await page.locator('//button[@data-testid="pick-plan"]').click();
        }
      } catch (e) {
        console.log('Payment plan checkbox not visible');
      }

      await page.locator('//button[@id="buy_button"]').click();
      await page.waitForTimeout(3000);

      const klarnaUrl = 'https://x.klarnacdn.net/xs2a/widget-app/v1/index.html';
      const frame = page.frames().find((f: Frame) => f.url().includes(klarnaUrl));

      if (!frame) {
        throw new Error('Klarna XS2A frame not found');
      }

      await frame.locator('//input[@id="bias.apis.forms.elements.UsernameElement"]').fill('34567');
      await frame.locator('//input[@id="bias.apis.forms.elements.PasswordElement"]').fill('245677');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    }
  }
}