

-------------------------------------
-- Install latest Playwright version
npm i -D @playwright/test@latest

-- Version
npm list @playwright/test

-- Create Project from scratch
npm init playwright@latest

------------
-- INTERFAZ
------------
- node run-test.mjs

---------------------------------
-- Scripts para varias ejecuciones
---------------------------------
- Scripts/Paypal-Lutz.sh
- Scripts/Credit-Lutz.sh

- PAY:
    PP  -> Paypal
    CC  -> Credit Card    
    KN  -> Klarna Pay Now (Sofortüberweisung (Bank transfer))
    KO  -> Klarna OverTime
    SW  -> Swish
    TW  -> Twint
    ON  -> OnLine Banking
    KL  -> Klarna Play Later (Kauf auf Rechnung)
    KN  -> Klarna Play Now
    DEL -> On Delivery

------------
-- PAYPAL --
------------
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-PayPal.spec.js --project chromium --headed 

-----------------
-- CREDIT CARD --
-----------------
- RAIL=xxxlutz COUNTRY=RO MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=moemax COUNTRY=AT MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.js --project chromium --headed 

---------------------
-- CREDIT CARD 3DS --
---------------------
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Credit-3DS.spec.js --project chromium --headed 

----------------------
-- SPECIAL PAYMENTS --
----------------------
- PAY=KO npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- PAY=SW npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- PAY=TW npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- PAY=ON npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- PAY=DEL npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- PAY=KL npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- PAY=KN npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 

-----------------
-- RO Split IT --
-----------------
- RAIL=xxxlutz COUNTRY=RO npx playwright test tests/E2E-Lutz-SplitIT.spec.js --project chromium --headed 

--------------------------
-- RS Lesnina CorvusPay --
--------------------------
- npx playwright test tests/E2E-Lutz-RS.spec.js --project chromium --headed 
  
--------------------------
-- Billie --
--------------------------
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Billie.spec.js --project chromium --headed 

--------------------------
-- Riverty --
--------------------------
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Riverty-logged.spec.js --project chromium --headed 
-------------------------


For code generator:
---------------

- npx playwright codegen 

