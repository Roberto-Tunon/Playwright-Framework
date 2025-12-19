import pkg from 'enquirer';
const { Select } = pkg;
import { execSync } from 'child_process';

async function run() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '--- 🧪 PLAYWRIGHT TEST RUNNER ---');
    console.log('\x1b[36m%s\x1b[0m', '---------------------------------');

    // 1. SELECCIÓN DE MARCA (RAIL)
    const rail = await new Select({
      name: 'rail',
      message: ' Choose Rail: \n',
      symbols: { pointer: '👉', prefix: '❓' },
      choices: [
        { name: 'xxxlutz',  message: ` 🪑 🔴 XXXLutz \n` },       
        { name: 'moemax',   message: ` 🛏️  🟢 Mömax \n` },
        { name: 'moebelix', message: ` 🛋️  🔵 Möbelix \n\n` },
      ]
    }).run();

    // 2. SELECCIÓN DE PAÍS (COUNTRY)
    const country = await new Select({
      name: 'country',
      message: 'Choose Country: \n',
      symbols: { pointer: '👉', prefix: '🌐' },
      choices: [
        { name: 'AT', message: '🇦🇹 Austria' },
        { name: 'DE', message: '🇩🇪 Germany' },
        { name: 'CZ', message: '🇨🇿 Czech Republic' },
        { name: 'SK', message: '🇸🇰 Slovakia' },
        { name: 'HU', message: '🇭🇺 Hungary' },
        { name: 'HR', message: '🇭🇷 Croatia' },
        { name: 'SI', message: '🇸🇮 Slovenia \n\n' }
      ]
    }).run();

    // 3. SELECCIÓN DE MODO (MODE) - Con iconos de números
    const mode = await new Select({
      name: 'mode',
      message: 'Choose Mode: \n',
      symbols: { pointer: '👉', prefix: '🆔' },
      initial: 0, 
      choices: [
        { name: '1P', message: '1️⃣ 🅿️ \n' },
        { name: '2P', message: '2️⃣ 🅿️ \n' },
        { name: '3P', message: '3️⃣ 🅿️ \n' }
      ]
    }).run();

    // 4. SELECCIÓN DE TEST
    const testFile = await new Select({
      name: 'testFile',
      message: 'Choose Payment Method: \n',
      symbols: { pointer: '👉', prefix: '💰' },
      choices: [
        { name: 'tests/E2E-Lutz-Credit.spec.js', message: '💳 Credit Card \n' },
        { name: 'tests/E2E-Lutz-Paypal.spec.js', message: '🅿️  PayPal \n' },
        { name: 'tests/E2E-Lutz-Bank.spec.js',   message: '🏦 Klarna Pay Later' }
      ]
    }).run();

    // CONSTRUCCIÓN DEL COMANDO
    const finalMode = mode || '1P';
    const command = `RAIL=${rail} COUNTRY=${country} MODE=${finalMode} npx playwright test ${testFile} --project chromium --headed`;
    
    console.log('\n' + '─'.repeat(50));
    console.log(`🚀 EXECUTING: ${rail.toUpperCase()} | ${country} | MODE: ${finalMode}`);    
    console.log('─'.repeat(50) + '\n');
    
    execSync(command, { stdio: 'inherit' });

  } catch (err) {
    console.log('\n👋 Proceso finalizado.');
  }
}

run();