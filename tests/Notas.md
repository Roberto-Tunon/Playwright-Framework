For executing:
---------------

- npx playwright test tests/Deployment/Newsletter.spec.js --project chromium --headed

Powersellers
---------------

- PARAM=AT npx playwright test tests/PowerSellers-PayPal.spec.js --project chromium --headed 
- PARAM=QC npx playwright test tests/PowerSellers-Credit.spec.js --project chromium --headed
  
- COUNTRY=CH npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=AT npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=DE npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=CZ npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 


- PAY=KO npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=SW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=TW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=ON npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 

-------------------------
Executions:
PAY=KO  -> OK
PAY=SW  -> OK
PAY=TW  -> OK
PAY=ON   Revisar CZ. No coge el email. Revisar los tests de Live.



For code generator:
---------------

- npx playwright codegen

