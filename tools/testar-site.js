// Testes do site pessoal faguital.com.br em Chrome headless (sem dependências).
// Uso: node tools/testar-site.js <urlBase> [pastaSaida]   ex.: node tools/testar-site.js http://127.0.0.1:8850/ .capturas
// O Chrome é sempre encerrado (finally, sinais e timeout global).
"use strict";
const { spawn } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const BASE = process.argv[2], OUT = process.argv[3] || ".capturas";
if (!BASE) { console.error("uso: node tools/testar-site.js <urlBase> [pastaSaida]"); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const port = 9450 + Math.floor(Math.random() * 40);
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "fg-"));
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", `--remote-debugging-port=${port}`,
  `--user-data-dir=${perfil}`, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });
let fechado = false;
const encerrar = c => { if (!fechado) { fechado = true; try { matarChrome(); } catch (e) { /* já saiu */ } }
  setTimeout(() => { try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) { /* ok */ } process.exit(c); }, 400); };
process.on("SIGINT", () => encerrar(130)); process.on("SIGTERM", () => encerrar(143));
const limite = setTimeout(() => { console.error("TIMEOUT GLOBAL"); encerrar(3); }, 5 * 60 * 1000);
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
let falhas = 0; const ok = (c, m) => { console.log((c ? "ok   " : "FALHA") + " - " + m); if (!c) falhas++; };
(async () => {
  let a; for (let i = 0; i < 60; i++) { try { a = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
  const ws = new WebSocket(a.find(x => x.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const p = new Map(); let erros = [];
  ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") erros.push("JS: " + (m.params.exceptionDetails.exception || {}).description);
    if (m.method === "Network.responseReceived" && m.params.response.status >= 400) erros.push(m.params.response.status + " " + m.params.response.url); });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result.result.value;
  await send("Runtime.enable"); await send("Network.enable"); await send("Page.enable");
  for (const pagina of ["", "sobre.html"]) {
    for (const [w, h, mob] of [[360, 800, true], [390, 844, true], [412, 915, true], [1366, 768, false], [1920, 1080, false]]) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: mob ? 2 : 1, mobile: mob });
      erros = []; await send("Page.navigate", { url: BASE + pagina });
      for (let i = 0; i < 80; i++) { if (await ev("document.readyState") === "complete") break; await sleep(150); }
      await sleep(4500);
      const ov = await ev("document.documentElement.scrollWidth - document.documentElement.clientWidth");
      ok(ov <= 0, `${pagina || "index"} ${w}x${h}: sem rolagem horizontal (${ov}px)`);
      ok(erros.length === 0, `${pagina || "index"} ${w}x${h}: 0 erros ${erros.join(" | ")}`);
      if (w === 390 || w === 1366) { const r = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(OUT, `${pagina ? "sobre" : "index"}_${w}.png`), Buffer.from(r.result.data, "base64")); }
      if (!pagina) {
        // "FREQUÊNCIA ATIVA" precisa caber no hexágono mesmo com monoespaçada larga (simula a do Android)
        const caber = await ev(`(() => { const c = document.querySelector(".core"), s = c && c.querySelector("small"); if (!s) return null;
          const medir = () => { const C = c.getBoundingClientRect(), S = s.getBoundingClientRect(); const yb = (S.bottom - C.top) / C.height; const util = C.width * (yb <= .75 ? 1 : Math.max(0, 1 - (yb - .75) / .25)); return { texto: Math.round(S.width), hex: Math.round(util), baseDoTexto: +yb.toFixed(2) }; };
          const normal = medir(); s.style.fontFamily = "'Courier New', monospace"; const largo = medir(); s.style.fontFamily = "";
          return { normal, largo }; })()`);
        ok(caber && caber.largo.texto <= caber.largo.hex - 16, `${w}: FREQUÊNCIA ATIVA cabe no hexágono ${JSON.stringify(caber)}`);
      }
    }
  }
  // links externos: os novos respondem
  await send("Page.navigate", { url: BASE + "sobre.html" }); await sleep(1500);
  const links = await ev(`[...document.querySelectorAll('a[href^="http"]')].map(a => a.href)`);
  for (const u of [...new Set(links)].filter(u => /tecnofagguard|imperialvolt/.test(u))) {
    let st = 0; try { st = (await fetch(u, { redirect: "follow" })).status; } catch (e) { st = -1; }
    ok(st === 200, `link ${u} responde ${st}`);
  }
  console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES OK");
  clearTimeout(limite); encerrar(falhas ? 1 : 0);
})().catch(e => { console.error("ERRO", e); encerrar(1); });
