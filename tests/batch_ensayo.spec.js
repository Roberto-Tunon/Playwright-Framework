const { test } = require('@playwright/test');
const { execSync } = require('child_process');
const combinaciones = require('../ensayo.json');

for (const conf of combinaciones) {
  test(`Batch: ${conf.rail} - ${conf.country} - ${conf.pay}`, async ({ page }) => {
    // Seteamos las variables de entorno que tu lógica ya sabe leer
    process.env.RAIL = conf.rail;
    process.env.COUNTRY = conf.country;
    process.env.MODE = conf.mode;
    if (conf.pay) process.env.PAY = conf.pay;

    // Importamos y ejecutamos tu lógica directamente
    // Nota: Aquí lo ideal es que tu archivo .spec.js use process.env
    // Playwright ejecutará este bloque para cada línea del JSON
    await page.goto(`https://www.google.com`); // Placeholder para asegurar que arranca
    
    // Para el ensayo, lanzamos el comando tal cual lo hace tu runner pero en headless
    const command = `RAIL=${conf.rail} COUNTRY=${conf.country} MODE=${conf.mode} PAY=${conf.pay} npx playwright test ${conf.file} --project chromium`;
    
    console.log(`🚀 Lanzando sub-proceso: ${conf.country}`);
    execSync(command, { stdio: 'inherit' });
  });
}