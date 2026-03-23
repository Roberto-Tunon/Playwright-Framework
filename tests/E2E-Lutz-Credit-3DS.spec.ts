import { test, Browser, BrowserContext, Page } from "@playwright/test";
import { fill3DSCreditCard } from "../utils/fill3DSCreditCard";
import { fillDeliveryFormCompany } from "../utils/fillDeliveryFormCompany";
import { OpenPage } from "../utils/OpenPage";
import { datosvar, PayQC } from "./constantes";
import { ObtenerDatos } from "../utils/ObtenerDatos";

test("Shopping with 3DS Credit Card", async ({ browser }: { browser: Browser }) => {

  const context: BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const cod_country: string = process.env.COUNTRY ?? "default";
  const rail: string = process.env.RAIL ?? "default";
  const datosrail = ObtenerDatos(cod_country);
  const mode: string = process.env.MODE ?? "1P";

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
  await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

  await fillDeliveryFormCompany(page, datosvar, datosrail);

  await page.locator('[data-purpose="checkout.paymentOptions.creditcard"]').click();
  await fill3DSCreditCard(page, PayQC, datosrail);

  if (cod_country === "AT") {
    await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `tests/Screenshots/Payment-3DS-Credit-${rail}-${cod_country}.png`, fullPage: true });

  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
  await page.waitForTimeout(2000);

  // Esperar a que el iframe aparezca y completar la verificación 3DS
  const frame = page.frameLocator('iframe[name="threeDSIframe"]');
  await frame.getByPlaceholder("enter the word 'password'").fill("password");
  await frame.getByRole("button", { name: "OK" }).click();

  await page.waitForTimeout(3000);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-3DS-Credit-${rail}-${cod_country}.png` });

  await page.pause();
  await context.close();
});