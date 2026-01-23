const { fillDeliveryForm } = require('./fillDeliveryForm');
const { fillSELFDeliveryForm } = require('./fillSELFDeliveryForm');

async function DeliveryOption(page, datosvar, datosrail) {

    const deliverySelect = page.locator('select[data-purpose="deliveryOptions.select.deliveryOption.select.value"]');
    const selfServiceOption = deliverySelect.locator('option[value="SELF_SERVICE"]');

    if (await selfServiceOption.count() > 0) {
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
        await page.locator('#SELF_SERVICE').click();

        await page.getByTestId('locationPicker.button').click();
        await page.locator('[data-purpose="locationFinder.input.field"]').fill(datosrail.PostalCode);
        await page.getByRole('button', { name: datosrail.City}).click();    
        await page.locator('[data-purpose="availability.changeSubsidiary.confirm"]').click();

        await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
        await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();

        await fillSELFDeliveryForm(page, datosvar, datosrail); 

    } else {
        console.log('⚠️ SELF_SERVICE not found. Selecting first option if possible...');

        try {
        await page.locator('[data-purpose="deliveryOptions.select.deliveryOption"]').click({ timeout: 2000 });
        await page.locator('#POSTAGE').click({ timeout: 2000 });
        } catch (e) {
        console.log('ℹ️ Delivery option combo not available. Continuing to login modal...');
        }

        await page.locator('[data-purpose="cart.button.login.modal.bottom"]').click();
        await page.locator('[data-purpose="login.modal.button.submit.guest"]').click();
        await fillDeliveryForm(page, datosvar, datosrail);

    }
}

module.exports = { DeliveryOption };