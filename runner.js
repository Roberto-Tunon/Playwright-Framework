const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * MASTER RUNNER - QA AUTOMATION (ROBERTO EDITION)
 * DAY 4: AUTOMATION, HISTORY & FULL TRANSLATIONS
 */

const CONFIG_PATH = path.resolve(__dirname, 'config.json');
const DASHBOARD_PATH = path.resolve(__dirname, 'dashboard.html');
const PLAYWRIGHT_BIN = path.resolve(__dirname, 'node_modules/.bin/playwright');
const RESULTS_DIR = path.join(__dirname, 'allure-results');
const REPORT_DIR = path.join(__dirname, 'allure-report');

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

(async () => {
    console.log(`\n🚀 BATCH START | ${executionQueue.length} Tests in queue...`);

    for (let i = 0; i < executionQueue.length; i++) {
        const test = executionQueue[i];
        const start = Date.now();
        console.log(`\n[${i + 1}/${executionQueue.length}] >>> Executing: ${test.country} - ${test.pay}`);

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
        });
    }

    // 3. PREPARE STATISTICS AND TRANSLATIONS
    const totalDurationSec = Math.floor((Date.now() - sessionStart) / 1000);
    
    // Dictionaries for the "pretty" Dashboard
    const countryNames = {
        AT: 'Austria', DE: 'Germany', CH: 'Switzerland', SE: 'Sweden', 
        CZ: 'Czech Republic', HR: 'Croatia', SK: 'Slovakia', 
        HU: 'Hungary', RO: 'Romania', SI: 'Slovenia'
    };

    const paymentNames = {
        CC: 'Credit Card',
        PP: 'PayPal',
        KL: 'Klarna Play Later',
        BI: 'Billie',
        ON: 'Online Banking',
        AP: 'Apple Pay',
        GP: 'Google Pay',
        KN: 'Klarna Pay Now',
        KO: 'Klarna Pay OverTime',
        SW: 'Swish',
        TW: 'Twint',
        DEL: 'On Delivery'
    };

    // ✅ NEW: Lucide icons per payment method
    const paymentIcons = {
        CC: 'credit-card',
        PP: 'wallet',

        // Klarna variants
        KL: 'zap',
        KN: 'zap',
        KO: 'zap',

        BI: 'receipt',       // or 'file-text'
        ON: 'landmark',
        AP: 'apple',
        GP: 'smartphone',
        SW: 'waves',         // if you prefer: 'radio' or 'signal'
        TW: 'qr-code',
        DEL: 'truck'
    };

    const reportStats = {
        lastDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        totalDuration: `${Math.floor(totalDurationSec / 60)}m ${totalDurationSec % 60}s`,
        sync_status: "OK"
    };

    const countries = [...new Set(testResults.map((t) => t.country))];
    const marketData = countries.map((code) => {
        const group = testResults.filter((r) => r.country === code);
        return {
            id: code,
            country: countryNames[code] || code, // Long name
            flag: getCountryFlag(code),
            rail: String(group[0]?.rail ?? '').toUpperCase(),
            status: group.some((r) => r.status === 'failed') ? 'Incident' : 'Operational',
            lastRun: new Date().toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            reportLink: `allure-report/index.html#behaviors?search=${code}`,
            payments: group.map((r) => ({
                name: paymentNames[r.pay] || r.pay, // Payment with long name
                status: r.status,
                time: r.duration,
                icon: paymentIcons[r.pay] || 'credit-card' // ✅ NEW
            })),
        };
    });

    // 4. UPDATE DASHBOARD HTML
    updateDashboardFile(marketData, reportStats);
    
    // 5. GENERATE ALLURE WITH HISTORY
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
    
    // Inject data into Dashboard variables
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
