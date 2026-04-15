
> Install latest Playwright version
```bash
npm i -D @playwright/test@latest
``` 

> Version
```bash
npm list @playwright/test
```

> Create Project from scratch
```bash
npm init playwright@latest
```

> Interfaz para SSO y ejecuciones locales
```bash
node run-test.mjs

npm run prepare-secret
Go to GitHub and update secret AUTH_JSON
```

> Interfaz para batch y dashboard de Allure
```bash
node runner.js

# Ver ayuda
node runner.js --help

# Ejecución por defecto (8 + 4 random)
node runner.js

# Suites predefinidas
node runner.js --suite=Regression   # 8 tests
node runner.js --suite=Smoke        # 2 tests
node runner.js --suite=Sanity       # 4 tests

# Suites dinámicas (filtro por pago/país)
node runner.js --suite=CreditCard
node runner.js --suite=PayPal
node runner.js --suite=Klarna
node runner.js --suite=Austria
node runner.js --suite=Germany
```

> Dashboard local de ejecuciones
- (First logging to SSO)
```bash
cd dashboard && node server.js
```

> Traceo de Errores
```bash
npx playwright show-trace test-results/**/trace.zip
```

> Scripts para varias ejecuciones
Scripts/Paypal-Lutz.sh
Scripts/Credit-Lutz.sh

> PAY:
    PP  -> Paypal
    CC  -> Credit Card    
    KN  -> Klarna Pay Now (Sofortüberweisung (Bank transfer))
    KO  -> Klarna OverTime
    KL  -> Klarna Play Later (Kauf auf Rechnung)
    GP  -> Google Pay
    SW  -> Swish
    TW  -> Twint
    ON  -> OnLine Banking       
    DEL -> On Delivery (Per Nachname/Cash on Delivery/Pago contra reembolso)

> MKP
```bash
COUNTRY=DE MODE=3P PAY=KN npx playwright test tests/MKP/E2E-Lutz-MKP.spec.ts --project chromium --headed --debug
```

```bash
COUNTRY=DE MODE=2P PAY=KL npx playwright test tests/MKP/E2E-Lutz-MKP.spec.ts --project chromium --headed
```
  

> PAYPAL
```bash
RAIL=xxxlutz COUNTRY=DE MODE=1P npx playwright test tests/E2E-Lutz-PayPal.spec.ts --project chromium --headed
```

```bash
RAIL=moemax COUNTRY=DE MODE=1P npx playwright test tests/E2E-Lutz-PayPal.spec.ts --project chromium --headed
``` 

> CREDIT CARD
```bash
RAIL=xxxlutz COUNTRY=AT MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlesnina COUNTRY=HR MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.ts --project chromium --headed
```

```bash
RAIL=moemax COUNTRY=AT MODE=1P npx playwright test tests/E2E-Lutz-Credit.spec.ts --project chromium --headed
``` 

> CREDIT CARD 3DS
```bash
RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Credit-3DS.spec.ts --project chromium --headed
``` 

> SPECIAL PAYMENTS
```bash
RAIL=xxxlutz COUNTRY=SE MODE=1P PAY=SW npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlutz COUNTRY=CH MODE=1P PAY=TW npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlutz COUNTRY=CZ MODE=1P PAY=ON npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlutz COUNTRY=CZ MODE=1P PAY=DEL npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlutz COUNTRY=AT MODE=1P PAY=KL npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlutz COUNTRY=AT MODE=1P PAY=KN npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlesnina COUNTRY=SI MODE=1P PAY=DEL npx playwright test tests/E2E-Lutz-Payments.spec.ts --project chromium --headed
``` 

> SplitIT
```bash
RAIL=xxxlutz COUNTRY=RO npx playwright test tests/E2E-Lutz-SplitIT.spec.ts --project chromium --headed
```

```bash
RAIL=xxxlesnina COUNTRY=SI MODE=1P PAY=SP npx playwright test tests/E2E-Lutz-SplitIT.spec.ts --project chromium --headed
``` 

> RS Lesnina CorvusPay 
```bash
npx playwright test tests/E2E-Lutz-RS.spec.ts --project chromium --headed
``` 
  
> Billie
```bash
RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Billie.spec.ts --project chromium --headed
``` 

> Riverty 
```bash
RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-Riverty-logged.spec.ts --project chromium --headed
``` 

> Google Pay
```bash
RAIL=xxxlutz COUNTRY=AT npx playwright test tests/E2E-Lutz-GooglePay.spec.ts --project chromium --headed
``` 

> Code generator
```bash
npx playwright codegen
``` 

