async function fillKlarna(page, mode, datosrail,rail) {
       
    if (mode === 'KO') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit.submit"]').click(); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.locator('//button[@id="signInWithBankIdButton"]').click();        
        await page.locator('//button[@data-testid="pick-plan"]').click();        
        await page.locator('//button[@id="buy_button"]').click();

    } else if (mode === 'KL') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount.submit"]').click(); 

        if (rail === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        }        

        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove);
        await page.locator('//button[@id="onContinue"]').click();
        await page.locator('//input[@id="otp_field"]').fill('234570');
        await page.locator('//button[@id="buy_button"]').click(); 

    } else if (mode === 'KN') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort.submit"]').click();   
        
        if (rail === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        }   

        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click(); 
        await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove);
        await page.locator('//button[@id="onContinue"]').click();
        await page.locator('//input[@id="otp_field"]').fill('234570');
        await page.locator('(//input[@id="banktransferkob_kp.1__label"])[1]').click();
        await page.locator('//button[@data-testid="pick-plan"]').click();        
        await page.locator('//button[@id="buy_button"]').click();        
    }

  
}
  
module.exports = { fillKlarna };