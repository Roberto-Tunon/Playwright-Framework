
Regression
---------------
 
- COUNTRY=DE npx playwright test tests/Regression-Tests/Regression-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=AT npx playwright test tests/Regression-Tests/Regression-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=CH npx playwright test tests/Regression-Tests/Regression-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=CZ npx playwright test tests/Regression-Tests/Regression-Lutz-Credit.spec.js --project chromium --headed 
- COUNTRY=SE npx playwright test tests/Regression-Tests/Regression-Lutz-Credit.spec.js --project chromium --headed 
- 
- COUNTRY=SE Error filling credit card. Check!!!



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

