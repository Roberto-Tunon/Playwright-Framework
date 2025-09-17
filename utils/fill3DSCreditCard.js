async function fill3DSCreditCard(page, PayData, datosrail) {
   
   const frameLocator1 = page.frameLocator(`iframe[title="${datosrail.FrameNumber}"]`);
   const cardNumberInput = frameLocator1.locator('#encryptedCardNumber');
   await cardNumberInput.fill(PayData.threedsnumber);
   
   const frameLocator2 = page.frameLocator(`iframe[title="${datosrail.FrameDate}"]`);
   const cardDateInput = frameLocator2.locator('#encryptedExpiryDate');
   await cardDateInput.fill(PayData.carddate);
   
   const frameLocator3 = page.frameLocator(`iframe[title="${datosrail.FrameCVV}"]`);
   const cardcvvInput = frameLocator3.locator('#encryptedSecurityCode');
   await cardcvvInput.fill(PayData.cardcvv);
   
   await page.locator('[data-testid="holderName"]').fill(PayData.cardholder); 
   await page.locator('[data-purpose="checkout.paymentOptions.creditcard.submit"]').click();
}
  
module.exports = { fill3DSCreditCard };