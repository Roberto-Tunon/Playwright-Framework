import { test, Browser, BrowserContext, Page } from "@playwright/test";
import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { DeliveryOption } from "../pageObjects/checkout/DeliveryOption";
import { fillCreditCard } from "../pageObjects/payments/fillCreditCard";
import { OpenPage } from "../pageObjects/checkout/OpenPage";
import { datosvar, PayQC } from "./constantes";
import { ObtenerDatos } from "../pageObjects/ObtenerDatos";

const testTitle = `[${process.env.COUNTRY ?? "N/A"}] ${process.env.RAIL} - Payment: ${process.env.PAY ?? "CreditCard"} (${process.env.MODE})`;

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
  await story("Credit Card");
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");
  await description(`E2E Test for Country: ${cod_country.toUpperCase()} - Rail: ${rail.toUpperCase()} - Mode: ${mode.toUpperCase()} - Pay: Credit card`);
  console.log(`Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}, Mode: ${mode}, Pay: Credit card`);

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);
  await DeliveryOption(page, datosvar, datosrail, "CC");

  await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();
  await fillCreditCard(page, PayQC, datosrail);

  if (["AT", "SI", "HR", "HU"].includes(cod_country) && (rail === "xxxlutz" || rail === "xxxlesnina")) {
    await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click({ timeout: 2000 });
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `tests/Screenshots/Payment-Credit-${rail}-${cod_country}.png`, fullPage: true });

  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-Credit-${rail}-${cod_country}.png` });

  await page.pause();
  await context.close();
});