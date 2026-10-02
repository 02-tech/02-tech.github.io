// Servidor local de teste com suporte a Range (206), como o GitHub Pages; necessário para testar o avanço do áudio.
// Uso: node tools/servidor-local.js [porta]   (padrão 8851)
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
const porta = +process.argv[2] || 8851;
const tipos = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".mp3": "audio/mpeg", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(raiz, p);
  if (!f.startsWith(raiz) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("404"); }
  const tam = fs.statSync(f).size, tipo = tipos[path.extname(f)] || "application/octet-stream";
  const r = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (r) {
    const ini = r[1] ? +r[1] : 0, fim = r[2] ? Math.min(+r[2], tam - 1) : tam - 1;
    res.writeHead(206, { "Content-Type": tipo, "Content-Range": `bytes ${ini}-${fim}/${tam}`, "Accept-Ranges": "bytes", "Content-Length": fim - ini + 1 });
    return fs.createReadStream(f, { start: ini, end: fim }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": tipo, "Accept-Ranges": "bytes", "Content-Length": tam });
  fs.createReadStream(f).pipe(res);
}).listen(porta, "127.0.0.1", () => console.log("servindo em http://127.0.0.1:" + porta + "/"));
