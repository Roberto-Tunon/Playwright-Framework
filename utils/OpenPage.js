const { fillSSO } = require('./fillSSO');
const { AcceptCookies } = require('./AcceptCookies');

async function OpenPage(page, datosvar, datosrail, rail, cod_country) {

    console.log(`Params: Country: ${cod_country}, Rail: ${rail.toUpperCase()}`);
    
    await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/`);   
    
    await fillSSO(page, datosvar);
    await page.pause();        
    await AcceptCookies(page, datosrail);

    await page.goto(`https://${rail}-${cod_country}.qa.xxxl-dev.at/api/${cod_country}/testing/products/deliveryselfservice`);      
    await page.locator('[data-purpose="checkout.addtocart"]').click();
    await page.locator('[data-purpose="sidebar.button.submit"]').click();    
}
  
module.exports = { OpenPage };