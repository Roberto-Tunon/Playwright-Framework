import {
  epic,
  feature,
  story,
  description,
  tag,
  parameter,
} from "allure-js-commons";
import { DeliveryOption } from "../utils/DeliveryOption";
import { test, Browser, BrowserContext, Page } from "@playwright/test";
import { PayQC, datosvar } from "./constantes";
import { fillCreditCard } from "../utils/fillCreditCard";
import { ObtenerDatos } from "../utils/ObtenerDatos";
import { OpenPage } from "../utils/OpenPage";

// Helper to format the test title dynamically
const testTitle = `[${process.env.COUNTRY ?? "N/A"}] ${process.env.RAIL} - Payment: ${process.env.PAY ?? "CreditCard"} (${process.env.MODE})`;

test(testTitle, async ({ browser }: { browser: Browser }) => {
  const context: BrowserContext = await browser.newContext({
    ignoreHTTPSErrors: true, // Ignora los errores de certificados no válidos
  });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Overrides the global timeout just for this specific test
  test.setTimeout(80000);

  const cod_country: string = process.env.COUNTRY ?? "default";
  const rail: string = process.env.RAIL ?? "default";
  const mode: string = process.env.MODE ?? "1P";
  const datosrail = ObtenerDatos(cod_country);

  await epic(rail);
  await feature(cod_country);
  await story("Credit Card");

  console.log(
    `Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}, Mode: ${mode}, Pay: Credit card`,
  );
  await description(
    `E2E Test for Country:${cod_country.toUpperCase()} - Rail:${rail.toUpperCase()} - Mode:${mode.toUpperCase()} - Mode: Credit card`,
  );
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  await DeliveryOption(page, datosvar, datosrail, "CC");

  await page
    .locator('[data-purpose="checkout.paymentOptions.creditcard"]')
    .click();

  await fillCreditCard(page, PayQC, datosrail);

  if (
    ["AT", "SI", "HR", "HU"].includes(cod_country) &&
    (rail === "xxxlutz" || rail === "xxxlesnina")
  ) {
    await page
      .locator('[data-purpose="form.checkbox.termsAndConditions"] + span')
      .first()
      .click({ timeout: 2000 });
  }

  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `tests/Screenshots/Payment-Credit-${rail}-${cod_country}.png`,
    fullPage: true,
  });

  await page
    .locator('[data-purpose="checkout.summary.button.submit"]')
    .first()
    .click();
  await page.waitForTimeout(5000); // 5 seconds pause
  await page.screenshot({
    path: `tests/Screenshots/Final-Order-Credit-${rail}-${cod_country}.png`,
  });

  await page.pause();
});
