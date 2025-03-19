For executing:
---------------

- npx playwright test tests/Deployment/Newsletter.spec.js --project chromium --headed

Powersellers
---------------

- COUNTRY=AT npx playwright test tests/PowerSellers-PayPal.spec.js --project chromium --headed 

  
- COUNTRY=CH npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=AT npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=DE npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=CZ npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 


- PAY=KO npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=SW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=TW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=ON npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=DEL npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 

-------------------------
Executions:
PAY=KO  -> OK  Klarna OverTime
PAY=SW  -> OK  Swish
PAY=TW  -> OK  Twint
PAY=ON  -> OK  OnLine Banking
PAY=DEL        On Delivery



For code generator:
---------------

- npx playwright codegen 

