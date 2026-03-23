import { test, Browser, BrowserContext, Page } from "@playwright/test";
import { epic, feature, story, description, tag, parameter } from "allure-js-commons";
import { AcceptCookiesLogin } from "../utils/AcceptCookiesLogin";
import { loginUserIDP } from "../utils/loginUserIDP";
import { OpenPage } from "../utils/OpenPage";
import { datosvar } from "./constantes";
import { ObtenerDatos } from "../utils/ObtenerDatos";

test("Shopping with logged user Riverty", async ({ browser }: { browser: Browser }) => {

  const context: BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const cod_country: string = process.env.COUNTRY ?? "default";
  const rail: string = process.env.RAIL ?? "default";
  const datosrail = ObtenerDatos(cod_country);
  const mode: string = process.env.MODE ?? "1P";

  await epic(rail);
  await feature(cod_country);
  await story("Riverty");
  await tag(cod_country);
  await parameter("Rail", process.env.RAIL ?? "");
  await description(`E2E Test for ${rail}-${cod_country}`);

  await OpenPage(page, datosvar, datosrail, rail, cod_country, mode);

  await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
  await page.getByRole("link", { name: "Anmelden" }).click();
  await page.waitForTimeout(2000);
  await AcceptCookiesLogin(page, datosrail);

  await loginUserIDP(page, datosvar);

  await page.locator('[data-purpose="form.input.voucherCode.field"]').fill(`TEST-LZ-${rail}-1`);
  await page.waitForTimeout(1000);
  await page.locator('[data-purpose="checkout.voucherForm.button.submit"]').click();

  await page.locator('[data-purpose="cart.button.submit.bottom"]').click();

  await page.locator('[data-purpose="checkout.paymentOptions.riverty"]').click();
  await page.locator('[data-purpose="form.input.birthdate.field"]').fill("24.01.1980");
  await page.locator('[data-purpose="checkout.paymentOptions.riverty.submit"]').click();

  if (cod_country === "AT") {
    await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `tests/Screenshots/Payment-Riverty-${rail}-${cod_country}.png`, fullPage: true });

  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `tests/Screenshots/Final-Order-Riverty-${rail}-${cod_country}.png` });

  await page.pause();
  await context.close();
});