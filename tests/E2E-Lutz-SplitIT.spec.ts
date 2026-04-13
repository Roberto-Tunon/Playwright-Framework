import { test, Browser, BrowserContext, Page } from "@playwright/test";
import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { fillDeliveryForm } from "../pageObjects/checkout/fillDeliveryForm";
import { OpenPage } from "../pageObjects/checkout/OpenPage";
import { datosvar, PayQC } from "./constantes";
import { ObtenerDatos } from "../pageObjects/ObtenerDatos";

const testTitle = `[${process.env.COUNTRY ?? "N/A"}] ${process.env.RAIL} - Payment: ${process.env.PAY ?? "SplitIT"} (${process.env.MODE})`;

test(testTitle, async ({ browser }: { browser: Browser }) => {

  test.setTimeout(100000);

  const context: BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const cod_country: string = process.env.COUNTRY ?? "default";
  const rail: string = process.env.RAIL ?? "default";
  const mode: string = process.env.MODE ?? "1P";
  const datosrail = ObtenerDatos(cod_country);

  await epic(rail);
  await feature(cod_country);
  await story("SplitIT");
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");
  await description(`E2E Test for ${rail}-${cod_country}`);

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  await page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]').click();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");

  await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
  await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

  await fillDeliveryForm(page, datosvar, datosrail);

  const splititRadio = page.locator('input[data-purpose="checkout.paymentMode.radiobutton."]').first();
  await splititRadio.check({ force: true });
  await page.locator('[data-purpose="checkout.paymentOptions.default.submit"]').first().click();

  if (["AT", "SI"].includes(cod_country)) {
    await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `tests/Screenshots/Payment-SplitIT-${rail}-${cod_country}.png`, fullPage: true });
  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

  await page.waitForLoadState("networkidle");

  await page.locator('[name="CardNumber"]').fill(PayQC.cardnumber);
  await page.locator('[name="ExpDate"]').fill(PayQC.carddate);
  await page.locator('[name="CardCvv"]').fill(PayQC.cardcvv);
  await page.locator("#id-agree-terms").check();
  await page.waitForTimeout(500);
  await page.locator('[qa-id="pay-button"]').click();

  await page.waitForTimeout(10000);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-SplitIT-${rail}-${cod_country}.png` });
  await page.pause();
  await context.close();
});