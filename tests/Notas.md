For executing:
---------------

- npx playwright test tests/Deployment/Newsletter.spec.js --project chromium --headed

- npx playwright test tests/1-Version.spec.js --project chromium --headed
- npx playwright test tests/2-Newsletter-DE-CZ.spec.js --project chromium --headed
- npx playwright test tests/3-LutzCard-DE-CZ.spec.js --project chromium --headed
- npx playwright test tests/4-ContactCenter-DE-CZ.spec.js --project chromium --headed
- npx playwright test tests/5-Shopping-DE-CZ.spec.js --project chromium --headed
- npx playwright test tests/6-Poco-DE.spec.js --project chromium --headed  

Powersellers
---------------

- PARAM=QC npx playwright test tests/PowerSellers-PayPal.spec.js --project chromium --headed 
- PARAM=QC npx playwright test tests/PowerSellers-Credit.spec.js --project chromium --headed 
- COUNTRY=CH npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 

For code generator:
---------------

- npx playwright codegen

