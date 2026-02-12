const { fillDeliveryForm } = require('./fillDeliveryForm');

async function AddtoCart(page, datosvar, datosrail) {
    await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
    await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
    await fillDeliveryForm(page, datosvar, datosrail);
     
}    

async function DeliveryOption(page, datosvar, datosrail, pay) {           

    const deliveryDropdown = page.locator('div[data-purpose="deliveryOptions.select.deliveryOption"] [role="combobox"]');
    const isDropdownVisible = await deliveryDropdown.isVisible({ timeout: 2000 }).catch(() => false);
    let selfServiceOption = null;

    if (isDropdownVisible) {

        console.log('ℹ️ Delivery option searching Self Service');

        await page.locator('div#SELF_SERVICE').waitFor({ state: 'attached', timeout: 5000 });
        //Locate the specific Self Service option using its ID
        selfServiceOption = page.locator('div#SELF_SERVICE[role="option"]');          

        if (await selfServiceOption.count() > 0 && pay !== 'DEL') {
            console.log('✅ Self Service (Click & Collect) found. Selecting...');
            // Open the flyout/dropdown menu
            await deliveryDropdown.click();        
            // Wait for the option to be visible and click it      
            await selfServiceOption.waitFor({ state: 'visible' });
            await selfServiceOption.click();

            await page.getByTestId('locationPicker.button').click();
            await page.locator('[data-purpose="locationFinder.input.field"]').fill(datosrail.PostalCode);
            await page.getByRole('button', { name: datosrail.City}).click();    
            await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();

            await AddtoCart(page, datosvar, datosrail);            

        } else {
            console.log('⚠️ SELF_SERVICE not found. Selecting first option if possible...');

            try {
            await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
            await page.locator('#POSTAGE').click({ timeout: 2000 });
            } catch (e) {
            console.log('ℹ️ Delivery option combo not available. Continuing to login modal...');
            }
            await AddtoCart(page, datosvar, datosrail);           
        }       
    } else {
         await AddtoCart(page, datosvar, datosrail);         
    }   
}

module.exports = { DeliveryOption };