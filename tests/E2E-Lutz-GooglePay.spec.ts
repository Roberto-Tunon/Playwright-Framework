import { test, Browser, BrowserContext, Page } from "@playwright/test";
import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { DeliveryOption, OpenPage, ObtenerDatos } from "../pageObjects";
import { datosvar } from "./constantes";

const testTitle = `[${process.env.COUNTRY ?? "N/A"}] ${process.env.RAIL} - Payment: ${process.env.PAY ?? "GooglePay"} (${process.env.MODE})`;

test(testTitle, async ({ browser }: { browser: Browser }) => {

  test.setTimeout(80000);

  const context: BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const cod_country: string = process.env.COUNTRY ?? "default";
  const rail: string = process.env.RAIL ?? "default";
  const mode: string = process.env.MODE ?? "1P";
  const datosrail = ObtenerDatos(cod_country);

  await epic(rail);
  await feature(cod_country);
  await story("Google Pay");
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");
  await description(`E2E Test for ${rail}-${cod_country}`);

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  await DeliveryOption(page, datosvar, datosrail, "GP");

  await page.locator('[data-purpose="checkout.paymentOptions.googlepay"]').click();
  await page.locator('[data-purpose="checkout.paymentOptions.googlepay.submit"]').click();

  if (["AT", "SI", "HR", "HU"].includes(cod_country) && rail === "xxxlutz") {
    await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click({ timeout: 2000 });
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `tests/Screenshots/Payment-GooglePay-${rail}-${cod_country}.png`, fullPage: true });

  const gpayButton = page.locator("#gpay-button-online-api-id");
  await gpayButton.waitFor({ state: "visible", timeout: 10000 });
  await gpayButton.click();

  // TODO: gpayWindow is not defined in the original — needs to be captured as a popup
  // const gpayWindow = await context.waitForEvent('page');
  // await gpayWindow.getByRole('button').filter({ hasText: 'Pay' }).click();

  await page.waitForTimeout(6000);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-GooglePay-${rail}-${cod_country}.png` });

  await page.pause();
  await context.close();
});