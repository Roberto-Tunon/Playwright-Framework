const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * MASTER RUNNER - QA AUTOMATION (ROBERTO EDITION)
 * Adds: payment icons, country+rail cards, state.json (lastSeenAt, stale)
 */

const CONFIG_PATH = path.resolve(__dirname, 'config.json');
const DASHBOARD_PATH = path.resolve(__dirname, 'dashboard.html');
const PLAYWRIGHT_BIN = path.resolve(__dirname, 'node_modules/.bin/playwright');
const RESULTS_DIR = path.join(__dirname, 'allure-results');
const REPORT_DIR = path.join(__dirname, 'allure-report');
const STATE_PATH = path.resolve(__dirname, 'state.json');

const sessionStart = Date.now();

// 1. INITIAL VALIDATIONS
if (!fs.existsSync(CONFIG_PATH)) { console.error('❌ config.json not found!'); process.exit(1); }
if (!fs.existsSync(PLAYWRIGHT_BIN)) { console.error('❌ Playwright not found! Run: npm i'); process.exit(1); }

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const { permanentRuns = [], randomPool = [] } = config;

// 2. TEST SELECTION (4 FIXED + 4 RANDOM)
const selectedRandom = [...randomPool].sort(() => 0.5 - Math.random()).slice(0, 4);
const executionQueue = [...permanentRuns, ...selectedRandom];
const testResults = [];

// --- STATIC DICTS ---
const countryNames = {
  AT: 'Austria', DE: 'Germany', CH: 'Switzerland', SE: 'Sweden',
  CZ: 'Czech Republic', HR: 'Croatia', SK: 'Slovakia',
  HU: 'Hungary', RO: 'Romania', SI: 'Slovenia'
};

const paymentNames = {
  CC: 'Credit Card',
  PP: 'PayPal',
  KL: 'Klarna Pay Later',
  BI: 'Billie',
  ON: 'Online Banking',
  AP: 'Apple Pay',
  GP: 'Google Pay',
  KN: 'Klarna Pay Now',
  KO: 'Klarna Pay OverTime',
  SW: 'Swish',
  TW: 'Twint',
  DEL: 'On Delivery',
  SP: 'SplitIT',

};

// ✅ Lucide icons per payment method
const paymentIcons = {
  CC: 'credit-card',
  PP: 'wallet',
  KL: 'zap',
  KN: 'zap',
  KO: 'zap',
  BI: 'receipt',
  ON: 'landmark',
  AP: 'apple',
  GP: 'smartphone',
  SW: 'radio',
  TW: 'qr-code',
  DEL: 'truck',
  SP: 'divide',
};

(async () => {
  console.log(`\n🚀 BATCH START | ${executionQueue.length} Tests in queue...`);

  for (let i = 0; i < executionQueue.length; i++) {
    const test = executionQueue[i];
    const start = Date.now();
    console.log(`\n[${i + 1}/${executionQueue.length}] >>> Executing: ${test.country} - ${test.pay} (${test.rail})`);

    let status = 'passed';
    try {
      await runPlaywrightOnce(test);
      console.log(`✅ Result: PASSED`);
    } catch (err) {
      status = 'failed';
      console.log(`❌ Result: FAILED (Continuing...)`);
    }

    testResults.push({
      ...test,
      status,
      duration: Math.floor((Date.now() - start) / 1000) + 's',
      executedAt: new Date().toISOString()
    });
  }

  const totalDurationSec = Math.floor((Date.now() - sessionStart) / 1000);

  const reportStats = {
    lastDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    totalDuration: `${Math.floor(totalDurationSec / 60)}m ${totalDurationSec % 60}s`,
    sync_status: "OK"
  };

  // ---- STATE (last seen / stale) ----
  const state = readState();

  // Keys are per "country|rail|pay"
  const todayKey = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Update state with current executions
  for (const r of testResults) {
    const railKey = String(r.rail || '').toUpperCase();
    const key = `${r.country}|${railKey}|${r.pay}`;
    state[key] = {
      lastSeenAt: r.executedAt,
      lastStatus: r.status,
      lastDuration: r.duration,
      lastRunDay: todayKey
    };
  }

  writeState(state);

  // ---- BUILD marketData as country+rail cards ----
const groupsToday = groupBy(testResults, (r) => `${r.country}|${String(r.rail || '').toUpperCase()}`);

// ✅ NEW: collect all country|rail combos from TODAY + STATE
const combos = new Set(Object.keys(groupsToday));
for (const key of Object.keys(state)) {
  const [c, r] = key.split('|');
  if (c && r) combos.add(`${c}|${r}`);
}

// helper: does this combo have executions today?
const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

function comboRanToday(countryCode, rail) {
  // if ANY payment in this combo has lastRunDay == today in state, consider it ran today
  for (const [k, v] of Object.entries(state)) {
    const [c, r] = k.split('|');
    if (c === countryCode && r === rail && v?.lastRunDay === today) return true;
  }
  return false;
}

// helper: get latest timestamp for combo from state (for cards that didn't run today)
function latestSeenForCombo(countryCode, rail) {
  let latest = null;
  for (const [k, v] of Object.entries(state)) {
    const [c, r] = k.split('|');
    if (c !== countryCode || r !== rail) continue;
    const t = v?.lastSeenAt ? new Date(v.lastSeenAt).getTime() : null;
    if (t && (!latest || t > latest)) latest = t;
  }
  return latest ? new Date(latest).toISOString() : null;
}

const marketData = Array.from(combos).map((groupKey) => {
  const [countryCode, rail] = groupKey.split('|');
  const rowsToday = groupsToday[groupKey] || [];

  // payments that ran today
  const paymentsToday = rowsToday.map((r) => ({
    code: r.pay,
    name: paymentNames[r.pay] || r.pay,
    status: r.status,
    time: r.duration,
    icon: paymentIcons[r.pay] || 'credit-card',
    lastSeenAt: r.executedAt,
    isStale: false,
  }));

  const ranPays = new Set(rowsToday.map(r => r.pay));

  // payments from state for this combo
  const paymentsFromState = [];
  for (const [k, v] of Object.entries(state)) {
    const [c, r, pay] = k.split('|');
    if (c !== countryCode || r !== rail) continue;

    // if it ran today, skip if already present
    if (ranPays.has(pay)) continue;

    paymentsFromState.push({
      code: pay,
      name: paymentNames[pay] || pay,
      status: v?.lastStatus || 'passed',
      time: v?.lastDuration || '--',
      icon: paymentIcons[pay] || 'credit-card',
      lastSeenAt: v?.lastSeenAt || null,
      isStale: true,
    });
  }

  // final payments list
  const payments = [...paymentsToday, ...paymentsFromState];

  // card status:
  // - if ran today: Incident if any failed today else Operational
  // - if NOT ran today: derive status from last statuses (so it still shows something meaningful)
  const ranToday = rowsToday.length > 0 || comboRanToday(countryCode, rail);

  let status = 'Operational';
  if (ranToday) {
    status = rowsToday.some(r => r.status === 'failed') ? 'Incident' : 'Operational';
  } else {
    // no executions today: "Operational" if last known are all passed, otherwise "Incident"
    const anyFailed = paymentsFromState.some(p => p.status === 'failed');
    status = anyFailed ? 'Incident' : 'Operational';
  }

  // lastRun:
  // - if ran today: now (full datetime)
  // - else: latest lastSeenAt from state (pretty)
  let lastRun = new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  if (!ranToday) {
    const iso = latestSeenForCombo(countryCode, rail);
    lastRun = iso
      ? new Date(iso).toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
      : '--';
  }

  // report link
  const reportLink = `allure-report/index.html#behaviors?search=${countryCode}%20${encodeURIComponent(rail)}`;

  return {
    id: `${countryCode}-${rail}`,
    countryCode,
    country: countryNames[countryCode] || countryCode,
    flag: getCountryFlag(countryCode),
    rail,
    status,
    lastRun,
    reportLink,
    payments
  };
})
.sort((a, b) => (a.countryCode + a.rail).localeCompare(b.countryCode + b.rail));


  updateDashboardFile(marketData, reportStats);
  generateAllureReport();

})().catch((e) => console.error('❌ Critical Error:', e));

// --- HELPERS ---
function runPlaywrightOnce(test) {
  return new Promise((resolve, reject) => {
    const args = ['test', test.file, '--project=chromium', '--reporter=line,allure-playwright'];
    const env = { ...process.env, COUNTRY: test.country, PAY: test.pay, MODE: test.mode, RAIL: test.rail };

    const child = spawn(PLAYWRIGHT_BIN, args, { env, stdio: 'inherit', detached: true });

    const timer = setTimeout(() => {
      try { process.kill(-child.pid, 'SIGKILL'); } catch (e) {}
      reject(new Error('Timeout'));
    }, 180000);

    child.on('exit', (code) => {
      clearTimeout(timer);
      code === 0 ? resolve() : reject(new Error(`Exit ${code}`));
    });
  });
}

function updateDashboardFile(marketData, reportStats) {
  let html = fs.readFileSync(DASHBOARD_PATH, 'utf-8');

  html = html.replace(/const\s+marketData\s*=\s*\[[\s\S]*?\];/, `const marketData = ${JSON.stringify(marketData, null, 4)};`);
  html = html.replace(/const\s+reportStats\s*=\s*\{[\s\S]*?\};/, `const reportStats = ${JSON.stringify(reportStats, null, 4)};`);

  fs.writeFileSync(DASHBOARD_PATH, html, 'utf-8');
  console.log(`\n✨ DASHBOARD UPDATED: ${reportStats.lastDate} | ${reportStats.sync_status}`);
}

function generateAllureReport() {
  const HISTORY_DIR = path.join(REPORT_DIR, 'history');
  const RESULTS_HISTORY_DIR = path.join(RESULTS_DIR, 'history');

  console.log('⏳ Processing Allure history...');
  try {
    if (fs.existsSync(HISTORY_DIR)) {
      if (!fs.existsSync(RESULTS_HISTORY_DIR)) fs.mkdirSync(RESULTS_HISTORY_DIR, { recursive: true });
      fs.readdirSync(HISTORY_DIR).forEach(file => {
        fs.copyFileSync(path.join(HISTORY_DIR, file), path.join(RESULTS_HISTORY_DIR, file));
      });
    }
    execSync('npx allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });
    console.log('✅ Allure Report with history generated successfully.');
  } catch (error) {
    console.error('❌ Allure Error:', error);
  }
}

function getCountryFlag(code) {
  const flags = { AT: '🇦🇹', DE: '🇩🇪', CH: '🇨🇭', SE: '🇸🇪', CZ: '🇨🇿', HR: '🇭🇷', SK: '🇸🇰', HU: '🇭🇺', RO: '🇷🇴', SI: '🇸🇮' };
  return flags[code] || '🌐';
}

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

function readState() {
  try {
    if (!fs.existsSync(STATE_PATH)) return {};
    const raw = fs.readFileSync(STATE_PATH, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeState(state) {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('❌ Could not write state.json:', e);
  }
}
