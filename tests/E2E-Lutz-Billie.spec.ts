import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { fillDeliveryFormCompany } from "../utils/fillDeliveryFormCompany";
import { OpenPage } from "../utils/OpenPage";
import { datosvar } from "./constantes";
import { ObtenerDatos } from "../utils/ObtenerDatos";

const testTitle = `[${process.env.COUNTRY ?? "N/A"}] ${process.env.RAIL} - Payment: ${process.env.PAY ?? "Billie"} (${process.env.MODE})`;

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
  await story("Billie");
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");
  await description(`E2E Test for ${rail}-${cod_country}`);

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
  await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

  await fillDeliveryFormCompany(page, datosvar, datosrail);

  await page.locator('[data-purpose="checkout.paymentOptions.klarna_b2b"]').click();
  await page.locator('[data-purpose="checkout.paymentOptions.klarna_b2b.submit"]').click();

  if (cod_country === "AT") {
    await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `tests/Screenshots/Payment-Billie-${rail}-${cod_country}.png`, fullPage: true });

  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
  await page.waitForTimeout(2000);
  
  await page.click("#buy-button__text");
  await page.waitForTimeout(2000);

  await page.waitForSelector("#klarna-hpp-instance-fullscreen");

  const billieFrame = page
    .frameLocator("#klarna-hpp-instance-fullscreen")
    .frameLocator("#b2binvoice_billie-fullscreen-iframe");

  await billieFrame.locator("#entity_type").selectOption({ value: "limited_company" });
  await expect(billieFrame.locator("#entity_type")).toHaveValue("limited_company");
  await billieFrame.locator('[data-test="legal-form-step.cta"]').click();

  const billieFrame2 = page
    .frameLocator("#klarna-hpp-instance-fullscreen")
    .frameLocator("#b2binvoice_billie-fullscreen-iframe");

  await billieFrame2.locator('[data-test="company-name"]').fill(datosrail.BillieName ?? "");
  await billieFrame2.locator('[data-test="street"]').fill(datosrail.BillieStreet ?? "");
  await billieFrame2.locator('[data-test="number"]').fill(datosrail.BillieNumber ?? "");
  await billieFrame2.locator('[data-test="postal_code"]').fill(datosrail.BilliePostalCode ?? "");
  await billieFrame2.locator('[data-test="city"]').fill(datosrail.BillieCity ?? "");
  await billieFrame2.locator('[data-test="company-details-cta"]').click();

  await page.waitForTimeout(1000);
  const billieFrame3 = page
    .frameLocator("#klarna-hpp-instance-fullscreen")
    .frameLocator("#b2binvoice_billie-fullscreen-iframe");
  await billieFrame3.locator('[data-test="close-CTA"]').click();

  await page.waitForTimeout(10000);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-Billie-${rail}-${cod_country}.png` });
  await page.pause();
  await context.close();
});