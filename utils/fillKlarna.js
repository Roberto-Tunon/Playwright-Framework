async function fillKlarna(page, mode, datosrail,rail) {
       
    if (mode === 'KO') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit.submit"]').click(); 
        await page.waitForLoadState('networkidle'); 
        await page.screenshot({ path: 'tests/Screenshots/Payment1.png', fullPage: true }); 

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
        await page.waitForLoadState('networkidle');       
        await page.screenshot({ path: 'tests/Screenshots/Payment1.png', fullPage: true }); 
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
        await page.waitForLoadState('networkidle'); 
        await page.screenshot({ path: 'tests/Screenshots/Payment1.png', fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click(); 
        await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove);
        await page.locator('//button[@id="onContinue"]').click();
        await page.locator('//input[@id="otp_field"]').fill('234570');        
        
        await page.locator('//input[@id="banktransferkob_kp.1__label"]').check();
        await page.locator('//button[@data-testid="pick-plan"]').click();
        await page.locator('//button[@id="buy_button"]').click();  
        
        await page.waitForTimeout(3000); // Espera un poco para asegurarte de que los frames se han cargado

        const frame = page.frames().find(f => f.url().includes('https://x.klarnacdn.net/xs2a/widget-app/v1/index.html'));
        await frame.locator('//input[@id="bias.apis.forms.elements.UsernameElement"]').fill('34567');
        await frame.locator('//input[@id="bias.apis.forms.elements.PasswordElement"]').fill('245677');
        await page.keyboard.press('Tab');  
        await page.keyboard.press('Enter'); 

        await page.waitForTimeout(3000); // Espera un poco para asegurarte de que los frames se han cargado
        //console.log('Frames encontrados:', page.frames().map(f => f.url()));
        const frame2 = page.frames().find(f => f.url().includes('https://x.klarnacdn.net/xs2a/widget-app/v1/index.html'));
        await frame2.locator('//input[@id="bias.apis.forms.elements.OtpElement"]').fill('234570');      
        await page.keyboard.press('Tab');  
        await page.keyboard.press('Enter'); 
        
    }

  
}
  
module.exports = { fillKlarna };