

-------------------------------------
-- Install latest Playwright version
npm i -D @playwright/test@latest

-- Version
npm list @playwright/test

-- Create Project from scratch
npm init playwright@latest

------------------------------------
-- INTERFAZ PARA SSO Y EJECUCIONES LOCALES
------------------------------------
- node run-test.mjs
-
----------------------------------
-- INTERFAZ PARA BATCH Y DASHBOARD
----------------------------------
- node runner.js
- 
--------------------
-- TRACEO DE ERRORES
--------------------
- npx playwright show-trace test-results/**/trace.zip

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
    KL  -> Klarna Play Later (Kauf auf Rechnung)
    SW  -> Swish
    TW  -> Twint
    ON  -> OnLine Banking       
    DEL -> On Delivery (Per Nachname/Cash on Delivery/Pago contra reembolso)

------------
-- MKP --
------------ 

- COUNTRY=DE MODE=3P PAY=KN npx playwright test tests/MKP/E2E-Lutz-MKP.spec.js --project chromium --headed --debug
- COUNTRY=DE MODE=2P PAY=KL npx playwright test tests/MKP/E2E-Lutz-MKP.spec.js --project chromium --headed 
  
------------
-- PAYPAL --
------------
- RAIL=xxxlutz COUNTRY=DE MODE=1P npx playwright test tests/E2E-Lutz-PayPal.spec.js --project chromium --headed 
- RAIL=moemax COUNTRY=DE MODE=1P npx playwright test tests/E2E-Lutz-PayPal.spec.js --project chromium --headed 

-----------------
-- CREDIT CARD --
-----------------
- RAIL=xxxlutz COUNTRY=AT MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=xxxlesnina COUNTRY=HR MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.js --project chromium --headed 
- RAIL=moemax COUNTRY=AT MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.js --project chromium --headed 

---------------------
-- CREDIT CARD 3DS --
---------------------
- RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Credit-3DS.spec.js --project chromium --headed 

----------------------
-- SPECIAL PAYMENTS --
----------------------
- PAY=KO npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=SE MODE=1P PAY=SW npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=CH MODE=1P PAY=TW npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=CZ MODE=1P PAY=ON npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=CZ MODE=1P PAY=DEL npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=AT MODE=1P PAY=KL npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 
- RAIL=xxxlutz COUNTRY=AT MODE=1P PAY=KN npx playwright test tests/E2E-Lutz-Payments.spec.js --project chromium --headed 

-----------------
-- Split IT --
-----------------
- RAIL=xxxlutz COUNTRY=RO npx playwright test tests/E2E-Lutz-SplitIT.spec.js --project chromium --headed 
- RAIL=xxxlesnina COUNTRY=SI MODE=1P PAY=SP npx playwright test tests/E2E-Lutz-SplitIT.spec.js --project chromium --headed 

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

