// Gera assets/img/og-tecnofag-guard.png (1200x630) a partir de tools/og.html, com Chrome headless.
// Uso: node tools/gerar-og.js        (o Chrome é sempre encerrado no final, mesmo com erro)
"use strict";
const { spawn } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const raiz = path.join(__dirname, "..");
const saida = path.join(raiz, "assets", "img", "og-faguital.png");
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "tg-og-"));
const port = 9300 + Math.floor(Math.random() * 90);
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${perfil}`, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });
const fim = c => { try { matarChrome(); } catch (e) { /* já saiu */ } setTimeout(() => { try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) { /* ok */ } process.exit(c); }, 400); };
setTimeout(() => { console.error("TIMEOUT"); fim(3); }, 60000);
// No Windows o Chrome headless se desvincula do processo aberto pelo node (nem ch.kill nem taskkill /T o alcançam):
// encerra todo chrome.exe cuja linha de comando contém a pasta de perfil EXCLUSIVA deste teste (nunca o Chrome do usuário).
function matarChrome() {
  try { ch.kill(); } catch (e) { /* já saiu */ }
  if (process.platform !== "win32") return;
  const marca = require("path").basename(perfil);
  require("child_process").spawnSync("powershell.exe", ["-NoProfile", "-Command",
    "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'chrome.exe' -and $_.CommandLine -like '*" + marca + "*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
    { stdio: "ignore", timeout: 30000 });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let alvos; for (let i = 0; i < 150; i++) { try { alvos = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
  const ws = new WebSocket(alvos.find(x => x.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const pend = new Map(); ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await send("Page.enable");
  await send("Page.navigate", { url: "file:///" + path.join(__dirname, "og.html").replace(/\\/g, "/") });
  await sleep(1500);
  const r = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  fs.writeFileSync(saida, Buffer.from(r.result.data, "base64"));
  console.log("gerado:", saida, fs.statSync(saida).size, "bytes");
  fim(0);
})().catch(e => { console.error(e); fim(1); });
