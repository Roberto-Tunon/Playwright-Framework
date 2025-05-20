Powersellers Marketplace
-------------------------

- COUNTRY:
    AT 
    DE

- MODE:
    1P (Lutz Products)
    2P (Lutz and MKP)
    3P (MKP Products)

- PAY:
    PP (Paypal)
    CC (Credit Card)
    KL (Klarna Pay Later -> Kauf auf Rechnung)
    KN (Klarna Pay Now -> Sofortüberweisung (Bank transfer))

-------------------------    

- COUNTRY=DE MODE=3P PAY=KN npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed --debug
- COUNTRY=DE MODE=2P PAY=KL npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=AT MODE=2P PAY=KL npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=AT MODE=1P PAY=KN npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=DE MODE=1P PAY=CC npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=AT MODE=2P PAY=CC npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=DE MODE=1P PAY=KL npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=DE MODE=1P PAY=KN npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 
- COUNTRY=SE MODE=1P PAY=KN npx playwright test tests/MKP/PowerSellers-Lutz-MKP.spec.js --project chromium --headed 


-------------------------
Executions:
COUNTRY=DE MODE=3P PAY=KL  -> OK
COUNTRY=AT MODE=3P PAY=KL  -> OK 
COUNTRY=DE MODE=1P PAY=CC  -> OK 
COUNTRY=DE MODE=3P PAY=KN  -> OK 
COUNTRY=AT MODE=3P PAY=KN  -> OK 
COUNTRY=DE MODE=2P PAY=KL  -> OK
COUNTRY=AT MODE=2P PAY=KL  -> OK
COUNTRY=AT MODE=2P PAY=CC  -> OK

