import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { DeliveryOption } from "../utils/DeliveryOption";
import { fillDeliveryForm } from "../utils/fillDeliveryForm";
import { fillKlarna } from "../utils/fillKlarna";
import { OpenPage } from "../utils/OpenPage";
import { datosvar } from "./constantes";
import { ObtenerDatos } from "../utils/ObtenerDatos";

const testTitle = `[${process.env.COUNTRY ?? "N/A"}] ${process.env.RAIL} - Payment: ${process.env.PAY ?? "CreditCard"} (${process.env.MODE})`;

test(testTitle, async ({ browser }: { browser: Browser }) => {

  test.setTimeout(100000);

  const context: BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const pay: string = process.env.PAY ?? "default";  
  const cod_country: string = process.env.COUNTRY ?? "default";
  const rail: string = process.env.RAIL ?? "default";
  const mode: string = process.env.MODE ?? "1P";
  const datosrail = ObtenerDatos(cod_country);

  await epic(rail);
  await feature(cod_country);
  await story(pay);
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");
  await parameter("Pay", process.env.PAY ?? "");

  console.log(`Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}, Mode: ${mode}, Pay: ${pay}`);
  await description(`E2E Test for Country: ${cod_country.toUpperCase()} - Rail: ${rail.toUpperCase()} - Mode: ${mode.toUpperCase()} - Pay: ${pay.toUpperCase()}`);

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  if (pay === "ON") {
    const button = page.getByTestId("locationPicker.button");
    if ((await button.isVisible()) && (await button.count() > 0)) {
      console.log("✅ Botón clickeado.");
      await button.click();
      await page.getByPlaceholder("PSČ/město").fill(datosrail.PostalCode ?? "");
      await page.getByRole("button", { name: datosrail.City }).click();
      await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();
      await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
      await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
      await fillDeliveryForm(page, datosvar, datosrail);
    } else {
      console.log("🚫 El botón no está visible, no se hizo clic.");
    }
  } else {
    await DeliveryOption(page, datosvar, datosrail, pay);
  }

  if (pay === "SW") {
    await page.locator('[data-purpose="checkout.paymentOptions.swish_adyen.submit"]').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

  } else if (pay === "DEL") {
    await page.locator('[data-purpose^="checkout.paymentOptions.ondelivery"]').click();
    await page.locator('[data-purpose^="checkout.paymentOptions.ondelivery"][data-purpose$=".submit"]').click();
    await page.waitForTimeout(2000);
    if (["AT", "SI", "HR", "RS"].includes(cod_country)) {
      await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
    }
    await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

  } else if (["KO", "KL", "KN"].includes(pay)) {
    await fillKlarna(page, pay, datosrail, rail);

  } else if (pay === "TW") {
    await page.locator('[data-purpose="checkout.paymentOptions.twint"]').click();
    await page.locator('[data-purpose="checkout.paymentOptions.twint.submit"]').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
    await page.waitForSelector("button[value='authorised']", { state: "visible" });
    await page.click("button[value='authorised']");

  } else if (pay === "ON") {
    await page.locator('[data-purpose="checkout.paymentOptions.onlineBanking_CZ"]').click();
    await page.click('[data-purpose="checkout.payment.onlinebanking.select.select.value"]');
    await page.click('text="Česká spořitelna"');
    await page.locator('[data-purpose="checkout.paymentOptions.onlineBanking_CZ.submit"]').click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${cod_country}.png`, fullPage: true });
    await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

    const continueButton = page.getByRole("button", { name: "Pokračovat" });
    await expect(continueButton).toBeVisible({ timeout: 8000 });
    await continueButton.click();

    await page.click('input#formSubmit[value="Positive authorization"]');
    await page.click('input#formSubmit[value="Continue"]');
  }

  if (["SW", "KO", "KL", "KN"].includes(pay)) {
    await page.waitForTimeout(6500);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-${pay}-${rail}-${cod_country}.png` });
  await page.pause();
  await context.close();
});