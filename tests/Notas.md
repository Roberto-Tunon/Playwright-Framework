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
- COUNTRY=SE npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 


- PAY=KO npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=SW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=TW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=ON npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=DEL npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=KL npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=KN npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- ------------
- RO Split IT
- npx playwright test tests/PowerSellers-Lutz-SplitIT.spec.js --project chromium --headed 

-------------------------
Executions:
PAY=KO  -> OK  Klarna OverTime
PAY=SW  -> OK  Swish
PAY=TW  -> OK  Twint
PAY=ON  -> OK  OnLine Banking
PAY=KL  -> OK  Klarna Play Later
PAY=KN  -> OK  Klarna Play Now
PAY=DEL -> OK  On Delivery



For code generator:
---------------

- npx playwright codegen 

