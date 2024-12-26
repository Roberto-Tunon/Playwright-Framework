async function fillCreditCard(page, PayData, rail) {
   
    if (rail === 'de') {
            const frameLocator1 = page.frameLocator('iframe[title="Iframe für Kartennummer"]');
            const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
            await cardNumberInput.fill(PayData.cardnumber);
    }
    else if (rail === 'cz') {  
            const frameLocator1 = page.frameLocator('iframe[title="Iframe pro číslo karty"]');
            const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
            await cardNumberInput.fill(PayData.cardnumber);
    }          

    if (rail === 'de') {
            const frameLocator2 = page.frameLocator('iframe[title="Iframe für Ablaufdatum"]');
            const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
            await cardDateInput.fill(PayData.carddate);
    }
    else if (rail === 'cz') {  
            const frameLocator2 = page.frameLocator('iframe[title="Iframe pro datum vypršení platnosti"]');
            const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
            await cardDateInput.fill(PayData.carddate);
    }        

    if (rail === 'de') {
            const frameLocator3 = page.frameLocator('iframe[title="Iframe für Sicherheitscode"]');
            const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
            await cardcvvInput.fill(PayData.cardcvv);
    }
    else if (rail === 'cz') {
            const frameLocator3 = page.frameLocator('iframe[title="Iframe pro bezpečnostní kód"]');
            const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
            await cardcvvInput.fill(PayData.cardcvv);
    }

    await page.locator('[data-testid="holderName"]').fill(PayData.cardholder); 
    await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
}
  
module.exports = { fillCreditCard };