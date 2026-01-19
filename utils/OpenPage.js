const { fillSSO } = require('./fillSSO');
const { AcceptCookies } = require('./AcceptCookies');

async function OpenPage(page, datosvar, datosrail, rail, cod_country, mode) {

    console.log(`Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}, Mode: ${mode}`);
    
    await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/`);   
    
    // await fillSSO(page, datosvar);
    // await page.pause();   

    await page.waitForTimeout(2000); 
    await AcceptCookies(page, datosrail);   

    if (mode !== "1P") {      
       try {         
         await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing//products/standardDeliveryMarketplaceProduct`);
         await page.locator('[data-purpose="checkout.addtocart"]').click();       
       } catch (e) {
           throw new Error(`No Marketplace product for Country: ${cod_country}`);   
       } 
    } 
    
    if (mode !== "3P") {
        if (["SE", "HU", "SI"].includes(cod_country)){
            await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/delivery`);                
            await page.locator('[data-purpose="checkout.addtocart"]').click();
        } else {
            await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/mailableselfservice`);                
            await page.locator('[data-purpose="checkout.addtocart"]').click();
        }    
    }
    await page.locator('[data-purpose="sidebar.button.submit"]').click(); 
}
  
module.exports = { OpenPage };