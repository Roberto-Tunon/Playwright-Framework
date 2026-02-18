// server.js
"use strict";

const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

/* ===========================
   PATHS
   =========================== */

const ROOT_DIR = path.join(__dirname, "..");
const REPORT_DIR = path.join(ROOT_DIR, "playwright-report");
const CONFIG_PATH = path.join(__dirname, "config.json");

// WSL path (as provided)
const HISTORY_PATH = "/home/robe/WKSPC_2/FE-Deployment-Regression/dashboard/history.json";

app.use("/reports", express.static(REPORT_DIR));

/* ===========================
   HELPERS
   =========================== */

async function readJsonSafe(filePath, fallback) {
  try {
    const raw = await fsp.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function getConfig() {
  const cfg = await readJsonSafe(CONFIG_PATH, { shops: [], countries: [], payments: [] });
  cfg.shops = Array.isArray(cfg.shops) ? cfg.shops : [];
  cfg.countries = Array.isArray(cfg.countries) ? cfg.countries : [];
  cfg.payments = Array.isArray(cfg.payments) ? cfg.payments : [];
  return cfg;
}

async function getHistory() {
  const hist = await readJsonSafe(HISTORY_PATH, []);
  return Array.isArray(hist) ? hist : [];
}

let historyWriteQueue = Promise.resolve();
function saveHistoryQueued(history) {
  historyWriteQueue = historyWriteQueue.then(async () => {
    const trimmed = history.slice(0, 50);
    const tmp = `${HISTORY_PATH}.tmp`;
    await fsp.writeFile(tmp, JSON.stringify(trimmed, null, 2), "utf8");
    await fsp.rename(tmp, HISTORY_PATH);
  }).catch(async (e) => {
    try { await fsp.unlink(`${HISTORY_PATH}.tmp`); } catch {}
    console.error("❌ saveHistoryQueued error:", e);
  });

  return historyWriteQueue;
}

function makeRunId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowLocalString() {
  return new Date().toLocaleString();
}

function stripAnsi(input) {
  if (!input) return "";
  return String(input).replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

function sanitizeSimple(input, maxLen = 80) {
  const s = String(input || "").trim();
  if (!s) return "";
  return s.replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, maxLen);
}

/* ===========================
   RUN MANAGEMENT (STOP)
   =========================== */

let activeChild = null;
let activeRunId = null;

function runPlaywright({ args, env, cwd, timeoutMs }) {
  return new Promise((resolve) => {
    const child = spawn("npx", args, { cwd, env, shell: false });

    activeChild = child;

    let killedByTimeout = false;
    let out = "";

    const append = (chunk) => {
      out += chunk;
      if (out.length > 5_000_000) out = out.slice(-5_000_000);
    };

    child.stdout.on("data", (b) => append(b.toString("utf8")));
    child.stderr.on("data", (b) => append(b.toString("utf8")));

    const timer = setTimeout(() => {
      killedByTimeout = true;
      try { child.kill("SIGKILL"); } catch {}
    }, timeoutMs);

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: 1, killedByTimeout, output: out + `\n\nSPAWN_ERROR: ${err.message}` });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, killedByTimeout, output: out });
    });
  });
}

/* ===========================
   API
   =========================== */

app.get("/config", async (req, res) => {
  res.json(await getConfig());
});

app.get("/history", async (req, res) => {
  res.json(await getHistory());
});

app.post("/delete-history", async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const idSet = new Set(ids.map(String));

    const history = await getHistory();
    const filtered = history.filter(item => !idSet.has(String(item.id)));

    await saveHistoryQueued(filtered);
    res.json({ success: true, history: filtered });
  } catch (e) {
    console.error("❌ /delete-history error:", e);
    res.status(500).json({ error: "Failed to delete history" });
  }
});

app.post("/cancel-run", (req, res) => {
  if (!activeChild) return res.json({ ok: true, message: "No active run" });

  try {
    activeChild.kill("SIGKILL");
    activeChild = null;
    activeRunId = null;
    return res.json({ ok: true, message: "Killed" });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/**
 * run-test:
 * - Always: --project=chromium
 * - Timeout: 60s
 * - HTML report: only when fail (re-run with reporter=html)
 * - MODE from UI (validated): 1P/2P/3P
 */
app.post("/run-test", async (req, res) => {
  const shop = sanitizeSimple(req.body?.shop);
  const country = sanitizeSimple(req.body?.country).toLowerCase();
  const paymentId = sanitizeSimple(req.body?.paymentId);
  const headless = req.body?.headless;

  const modeRaw = String(req.body?.mode || "1P").toUpperCase();
  const mode = ["1P", "2P", "3P"].includes(modeRaw) ? modeRaw : "1P";

  if (!shop || !country || !paymentId) {
    return res.status(400).json({ error: "Missing params: shop/country/paymentId" });
  }

  const config = await getConfig();
  const paymentInfo = (config.payments || []).find(p => p.id === paymentId);

  if (!paymentInfo) {
    return res.status(400).json({ error: "Config error: Payment spec not found" });
  }

  const envVars = {
    ...process.env,
    RAIL: shop,
    COUNTRY: country.toUpperCase(),
    MODE: mode,
    PAY: paymentInfo.payCode || ""
  };

  const TIMEOUT_MS = 60000;

  const visualFlag = (headless === false) ? "--headed" : null;

  const baseArgs = [
    "playwright", "test",
    paymentInfo.spec,
    "--project=chromium",
    "--reporter=line"
  ];
  if (visualFlag) baseArgs.push(visualFlag);

  const runId = makeRunId();
  activeRunId = runId;

  const startTime = Date.now();
  console.log(`\n🚀 [ROBERTO TUÑON - ENGINE] runId=${runId}`);
  console.log(`Executing: ${shop} | ${country} | ${paymentId} | MODE=${mode}`);
  console.log(`Command: npx ${baseArgs.join(" ")}`);
  console.log(`CWD: ${ROOT_DIR}`);

  try {
    const first = await runPlaywright({
      args: baseArgs,
      env: envVars,
      cwd: ROOT_DIR,
      timeoutMs: TIMEOUT_MS
    });

    if (activeRunId !== runId) {
      return res.status(409).json({ error: "Run superseded/cancelled." });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
    const failed = first.killedByTimeout || first.code !== 0;

    let status = failed ? "FAILED" : "PASSED";
    let terminalOutput = stripAnsi(first.output);

    if (first.killedByTimeout) {
      terminalOutput += `\n\n⚠️ SYSTEM_ALERTA: EXECUTION_TIMEOUT_REACHED (${Math.round(TIMEOUT_MS/1000)}s)`;
    }

    if (failed) {
      const reportArgs = [
        "playwright", "test",
        paymentInfo.spec,
        "--project=chromium",
        "--reporter=html"
      ];
      if (visualFlag) reportArgs.push(visualFlag);

      terminalOutput += `\n\n[REPORT] Test failed. Generating HTML report...\n> npx ${reportArgs.join(" ")}`;

      const second = await runPlaywright({
        args: reportArgs,
        env: envVars,
        cwd: ROOT_DIR,
        timeoutMs: TIMEOUT_MS
      });

      terminalOutput += "\n\n[REPORT OUTPUT]\n" + stripAnsi(second.output);

      if (second.killedByTimeout) {
        terminalOutput += `\n\n⚠️ REPORT_GENERATION_TIMEOUT (${Math.round(TIMEOUT_MS/1000)}s)`;
      }
    }

    const newRun = {
      id: runId,
      shop,
      country,
      paymentId,
      mode,
      status,
      duration,
      date: nowLocalString()
    };

    const history = [newRun, ...(await getHistory())];
    await saveHistoryQueued(history);

    activeChild = null;
    activeRunId = null;

    res.json({ output: terminalOutput, history });

  } catch (e) {
    console.error("❌ /run-test error:", e);
    activeChild = null;
    activeRunId = null;
    res.status(500).json({ error: e?.message || "run-test failed" });
  }
});

/* ===========================
   START
   =========================== */

app.listen(PORT, () => {
  console.log(`\n-----------------------------------------`);
  console.log(`💎 XXXLUTZ AUTOMATION DASHBOARD`);
  console.log(`👤 Author: Roberto Tuñon`);
  console.log(`🌍 URL: http://localhost:${PORT}`);  
  console.log(`-----------------------------------------\n`);
});
