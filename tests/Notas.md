For executing:
---------------

- npx playwright test tests/Deployment/Newsletter.spec.js --project chromium --headed

-------------------------------------
-------------------------------------
-- Install latest Playwright version
npm i -D @playwright/test@latest

-- Version
npm list @playwright/test

-- Create Project from scratch
npm init playwright@latest

-------------------------------------
-------------------------------------



------------
-- PAYPAL --
------------
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/PowerSellers-Lutz-PayPal.spec.js --project chromium --headed 

-----------------
-- CREDIT CARD --
-----------------
- RAIL=moemax COUNTRY=AT npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=DE npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=moemax COUNTRY=DE npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=CZ npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=CH npx playwright test tests/PowerSellers-Lutz-Credit.spec.js --project chromium --headed 
  
----------------------
-- SPECIAL PAYMENTS --
----------------------
- PAY=KO npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=SW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=TW npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=ON npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=DEL npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=KL npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 
- PAY=KN npx playwright test tests/PowerSellers-Lutz-Payments.spec.js --project chromium --headed 

-----------------
-- RO Split IT --
-----------------
- npx playwright test tests/PowerSellers-Lutz-SplitIT.spec.js --project chromium --headed 

--------------------------
-- RS Lesnina CorvusPay --
--------------------------
- npx playwright test tests/PowerSellers-Lutz-RS.spec.js --project chromium --headed 
  
--------------------------
-- Billie --
--------------------------
- COUNTRY=AT npx playwright test tests/PowerSellers-Lutz-Billie.spec.js --project chromium --headed 

--------------------------
-- Riverty --
--------------------------
- COUNTRY=DE npx playwright test tests/PowerSellers-Lutz-Riverty-logged.spec.js --project chromium --headed 
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

