const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Configuración de rutas (Deduce que el server está en /dashboard y los tests en la raíz)
const ROOT_DIR = path.join(__dirname, '..'); 
const REPORT_DIR = path.join(ROOT_DIR, 'playwright-report');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const HISTORY_PATH = path.join(__dirname, 'history.json');

app.use('/reports', express.static(REPORT_DIR));

// --- HELPERS ---
const getConfig = () => {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (e) { return { shops: [], countries: [], payments: [] }; }
};

const getHistory = () => {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
    } catch (e) { return []; }
};

const saveHistory = (history) => {
    // Guardamos los últimos 50 para no saturar el JSON
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history.slice(0, 50), null, 2));
};

// --- API ENDPOINTS ---

app.get('/config', (req, res) => res.json(getConfig()));
app.get('/history', (req, res) => res.json(getHistory()));

// Endpoint para borrar registros seleccionados
app.post('/delete-history', (req, res) => {
    const { ids } = req.body;
    let history = getHistory();
    const filtered = history.filter(item => !ids.includes(item.id));
    saveHistory(filtered);
    res.json({ success: true, history: filtered });
});

app.post('/run-test', (req, res) => {
    const { shop, country, paymentId } = req.body;
    const config = getConfig();
    const paymentInfo = config.payments.find(p => p.id === paymentId);

    if (!paymentInfo) return res.status(400).json({ error: "Config error" });

    const envVars = {
        ...process.env,
        RAIL: shop,
        COUNTRY: country.toUpperCase(),
        PAY: paymentInfo.payCode || '',
        MODE: '1P'
    };

    const command = `npx playwright test ${paymentInfo.spec} --reporter=html --project chromium`;
    const startTime = Date.now();

    console.log(`\n🚀 [ROBERTO TUÑON - ENGINE]`);
    console.log(`Executing: ${shop} | ${country} | ${paymentId}`);

    exec(command, { 
        env: envVars, 
        cwd: ROOT_DIR,
        maxBuffer: 1024 * 1024 * 10, // 10MB para logs extensos
        timeout: 60000               // 1 Minuto máximo de ejecución
    }, (error, stdout, stderr) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
        
        let status = error ? 'FAILED' : 'PASSED';
        let terminalOutput = (stdout || '') + (stderr || '');

        if (error && error.killed) {
            terminalOutput += "\n\n⚠️ SYSTEM_ALERTA: EXECUTION_TIMEOUT_REACHED (60s)";
        }

        // Creamos el registro con un ID único para el borrado
        const newRun = { 
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            shop, 
            country, 
            paymentId, 
            status, 
            duration, 
            date: new Date().toLocaleString() 
        };

        const history = [newRun, ...getHistory()];
        saveHistory(history);

        res.json({
            output: terminalOutput,
            history: history
        });
    });
});

app.listen(PORT, () => {
    console.log(`\n-----------------------------------------`);
    console.log(`💎 XXXLUTZ AUTOMATION DASHBOARD`);
    console.log(`👤 Author: Roberto Tuñon`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    console.log(`-----------------------------------------\n`);
});