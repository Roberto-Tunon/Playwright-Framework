import pkg from 'enquirer';
const { Select } = pkg;
import { execSync } from 'child_process';

async function run() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '\n--- 🧪 SMART PLAYWRIGHT RUNNER (SSO Edition) ---\n');

    // --- SESSION MANAGEMENT ---
    const action = await new Select({
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: 'run',    message: '🚀 Run Tests (using auth.json)\n' },
        { name: 'login',  message: '🔑 Login / Refresh Session (MFA)' }
      ]
    }).run();

    if (action === 'login') {
      console.log('\n🔑 Opening browser for manual login...');
      try {
        execSync('npx playwright test tests/auth.spec.js --project chromium --headed', { stdio: 'inherit' });
        console.log('\n✅ Session saved to auth.json. You can now run your tests!');
      } catch (e) {
        console.log('\n❌ Error: Login failed or the window was closed prematurely.');
      }
      return; 
    }

    // --- TEST SELECTION LOGIC ---

    // 1. RAIL SELECTION
    const rail = await new Select({
      name: 'rail',
      message: 'Choose Rail:\n --------------',      
      choices: [
           { name: 'xxxlutz',   message: ` 🪑 🔴 XXXLutz` },       
           { name: 'moemax',    message: ` 🛏️  🟢 Mömax` },
           { name: 'xxxlesnina', message: ` 🪑 🔴 XXXLesnina` },
           { name: 'moebelix',  message: ` 🛋️  🔵 Möbelix \n\n` },
      ]
    }).run();

    // 2. COUNTRY DEFINITION
    const allCountries = [
      { name: 'AT', message: '🇦🇹 Austria' },
      { name: 'DE', message: '🇩🇪 Germany' },
      { name: 'CZ', message: '🇨🇿 Czech Republic' },
      { name: 'CH', message: '🇨🇭 Switzerland' },
      { name: 'SK', message: '🇸🇰 Slovakia' },
      { name: 'SI', message: '🇸🇮 Slovenia' },
      { name: 'SE', message: '🇸🇪 Sweden' },
      { name: 'RO', message: '🇷🇴 Romania' },
      { name: 'HR', message: '🇭🇷 Croatia' },
      { name: 'HU', message: '🇭🇺 Hungary' },
      { name: 'RS', message: '🇷🇸 Serbia' }
    ];

    let availableCountries = [...allCountries];
    if (rail === 'xxxlutz') {
      // XXXLutz permite Hungría (HU) pero sigue excluyendo HR, RS, SI
      availableCountries = allCountries.filter(c => !['HR', 'RS', 'SI'].includes(c.name));
    } else if (rail === 'xxxlesnina') {
      availableCountries = allCountries.filter(c => ['HR', 'RS', 'SI'].includes(c.name));
    }

    // 3. COUNTRY SELECTION
    const country = await new Select({
      name: 'country',
      message: 'Choose Country:\n -----------------',
      choices: availableCountries
    }).run();

    // 4. PAYMENT METHODS LOGIC
    const allPayments = [
      { name: 'tests/E2E-Lutz-Credit.spec.js',   message: '💳 Credit Card',          id: 'credit' },
      { name: 'tests/E2E-Lutz-PayPal.spec.js',   message: '🅿️  PayPal',               id: 'paypal' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '🚀 Klarna Pay Now',    id: 'k_now',    payCode: 'KN' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '⏳ Klarna Pay Later',  id: 'k_later',  payCode: 'KL' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '📅 Klarna Pay Overtime', id: 'k_over',   payCode: 'KO' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '📲 Twint',             id: 'twint',    payCode: 'TW' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '🏦 Swish',             id: 'swish',    payCode: 'SW' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '🏦 Online Bank',        id: 'bank',     payCode: 'ON' },
      { name: 'tests/E2E-Lutz-Billie.spec.js',   message: '🏢 Billie',            id: 'billie' },
      { name: 'tests/E2E-Lutz-Payments.spec.js', message: '📦 On Delivery',        id: 'delivery', payCode: 'DEL' },
      { name: 'tests/E2E-Lutz-RS.spec.js',       message: '🦅 Corvus',            id: 'corvus' },
      { name: 'tests/E2E-Lutz-SplitIT.spec.js',  message: '💳 SplitIT',           id: 'splitit' }
    ];

    let filteredPayments = [];
    
    // Lógica por país
    if (country === 'HU') {
      // Solo Credit Card para Hungría
      filteredPayments = allPayments.filter(p => ['credit'].includes(p.id));
    } else if (country === 'SK') {
      // Slovakia: Añadimos Bank y Delivery a los básicos
      filteredPayments = allPayments.filter(p => ['credit', 'paypal', 'bank', 'delivery'].includes(p.id));
    } else if (country === 'RS') {
      filteredPayments = allPayments.filter(p => ['corvus', 'delivery'].includes(p.id));
    } else if (['HR', 'SI', 'RO'].includes(country)) {
      const ids = ['credit', 'paypal', 'splitit', 'delivery'];
      // Solo RS y HR (si no es Lesnina) suelen llevar Corvus. Quitamos Corvus para Lesnina Croatia.
      if (country === 'HR' && rail !== 'xxxlesnina') ids.push('corvus'); 
      filteredPayments = allPayments.filter(p => ids.includes(p.id));
    } else if (['AT', 'DE'].includes(country)) {
      const forbidden = ['corvus', 'twint', 'swish', 'bank', 'splitit', 'delivery'];
      filteredPayments = allPayments.filter(p => !forbidden.includes(p.id));
    } else if (country === 'CH') {
      filteredPayments = allPayments.filter(p => ['twint', 'credit', 'paypal', 'k_later'].includes(p.id));
    } else if (country === 'CZ') {
      filteredPayments = allPayments.filter(p => ['bank', 'delivery', 'credit', 'paypal'].includes(p.id));
    } else if (country === 'SE') {
      const seIds = ['swish', 'k_over', 'k_later', 'k_now', 'credit', 'paypal'];
      filteredPayments = allPayments.filter(p => seIds.includes(p.id));
    } else {
      filteredPayments = allPayments.filter(p => ['credit', 'paypal'].includes(p.id));
    }

    const selectedMessage = await new Select({
      name: 'payment',
      message: 'Choose Payment Method:\n ------------------------',
      choices: filteredPayments.map(p => p.message)
    }).run();

    const selectedPaymentObj = filteredPayments.find(p => p.message === selectedMessage);
    const testFile = selectedPaymentObj.name;
    const payCode = selectedPaymentObj.payCode;

    // 5. MODE SELECTION
    let mode = '1P';
    // Hungría siempre 1P, por eso no entra en el condicional de selección
    if (['AT', 'DE', 'CZ'].includes(country)) {
      mode = await new Select({
        name: 'mode',
        message: 'Choose Mode:\n --------------',
        choices: [
          { name: '1P', message: '1️⃣ 🅿️' },
          { name: '2P', message: '2️⃣ 🅿️' },
          { name: '3P', message: '3️⃣ 🅿️' }
        ]
      }).run();
    }

    // 6. FINAL COMMAND EXECUTION
    let envVars = `RAIL=${rail} COUNTRY=${country} MODE=${mode}`;
    if (payCode) envVars += ` PAY=${payCode}`;

    const command = `${envVars} npx playwright test ${testFile} --project chromium --headed`;
    
    console.log('\n' + '─'.repeat(50));
    console.log(`🚀 RUNNING: ${rail.toUpperCase()} | ${country} | ${mode}${payCode ? ` | PAY: ${payCode}` : ''}`);
    console.log('─'.repeat(50) + '\n');
    
    execSync(command, { stdio: 'inherit' });

  } catch (err) {
    console.log('\n👋 Cancelled or Error:', err.message || err);
  }
}

run();