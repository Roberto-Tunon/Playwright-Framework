async function fillKlarna(page, pay, datosrail,rail) {
       
    if (pay === 'KO') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sliceit.submit"]').click(); 
        await page.waitForLoadState('networkidle'); 
        await page.screenshot({ path: 'tests/Screenshots/Payment.png', fullPage: true }); 

        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.locator('//button[@id="signInWithBankIdButton"]').click();        
        await page.locator('//button[@data-testid="pick-plan"]').click();        
        await page.locator('//button[@id="buy_button"]').click();

    } else if (pay === 'KL') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_onaccount.submit"]').click(); 

        if (datosrail.Country === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        }  
        await page.waitForLoadState('networkidle');       
        await page.screenshot({ path: 'tests/Screenshots/Payment1.png', fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click();
        await page.waitForLoadState('networkidle');  
        await page.waitForTimeout(10000); 
        if (datosrail.Country === "SE") {
            await page.locator('//button[@id="signInWithBankIdButton"]').click();        
            await page.waitForLoadState('networkidle'); 
            await page.locator('//button[@id="buy_button"]').click();
        } else {
            await page.locator('//input[@id="phone"]').fill(datosrail.MKPPhoneApprove);
            await page.locator('//button[@id="onContinue"]').click();
            await page.locator('//input[@id="otp_field"]').fill('234570');
            await page.locator('//button[@id="buy_button"]').click(); 
        }

    } else if (pay === 'KN') {
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort"]').click();
        await page.locator('[data-purpose="checkout.paymentOptions.klarna_sofort.submit"]').click();   
        
        if (datosrail.Country === "AT") {
            await page.locator('[data-purpose="form.checkbox.termsAndConditions"] + span').first().click();       
        }   
        await page.waitForLoadState('networkidle'); 
        await page.screenshot({ path: `tests/Screenshots/Payment-${pay}-${rail}-${datosrail.Country}.png`, fullPage: true }); 
        await page.locator('[data-purpose="checkout.summary.button.submit"]').first().click(); 
        await page.waitForTimeout(10000); 
        if (datosrail.Country === "SE") {
            await page.locator('//button[@id="signInWithBankIdButton"]').click();        
            await page.waitForLoadState('networkidle'); 
            await page.locator('//button[@id="buy_button"]').click();
        } else {
            await page.waitForTimeout(1000);
            //await page.locator('//input[@id="phonePasskey"]').fill(datosrail.MKPPhoneApprove);
            await page.getByLabel('Handynummer').fill(datosrail.MKPPhoneApprove);

            await page.locator('//button[@id="onContinue"]').click();
            await page.locator('//input[@id="otp_field"]').fill('234570');    
            
            const selector = '//input[@id="banktransferkob_kp.0__label"]';
            const checkbox = page.locator(selector);
            
            try {
                await checkbox.waitFor({ state: 'visible', timeout: 3000 });
                if (await checkbox.isEnabled()) {
                    await checkbox.check();
                    await page.locator('//button[@data-testid="pick-plan"]').click();
                }
            } catch (e) {
                console.log('ℹ Payment plan checkbox not visible');
            }

            await page.locator('//button[@id="buy_button"]').click();  
            
            await page.waitForTimeout(3000); 

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
}
  
module.exports = { fillKlarna };