import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { fillDeliveryForm, fillSSO, ObtenerDatos } from "../pageObjects";

test("Shopping on Lesnina RS", async ({ browser }: { browser: Browser }) => {

  const context: BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const rail = "RS";
  const datosrail = ObtenerDatos(rail);

  await page.goto(`https://xxxlesnina-${rail}.qa.xxxl-dev.at/`);

  await fillSSO(page, datosvar);
  await page.pause();

  // await AcceptCookies(page, datosrail);
  await page.goto(`https://xxxlesnina-${rail}.qa.xxxl-dev.at/api/${rail}/testing/products/delivery`);
  await page.locator('[data-purpose="checkout.addtocart"]').click();
  await page.locator('[data-purpose="sidebar.button.submit"]').click();

  await page.locator('[data-purpose="deliveryOptions.select.deliveryOption.select.value"]').click();
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");

  await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
  await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

  await fillDeliveryForm(page, datosvar, datosrail);

  await page.locator('[data-purpose="checkout.paymentOptions.null"]').click();
  await page.locator('[data-purpose="checkout.paymentOptions.null.submit"]').first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tests/Screenshots/Payment.png", fullPage: true });
  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

  await page.waitForLoadState("networkidle");

  await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();
  await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();

  await page.waitForTimeout(2000);
  await page.screenshot({ path: "tests/Screenshots/Final-Order.png" });
  await page.pause();
  await context.close();
});