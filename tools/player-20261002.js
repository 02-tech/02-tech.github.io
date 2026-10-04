// Player de músicas (2026-10-02): substitui o destaque de O Trágico e Grandioso por um player com playlist,
// download, letra sincronizada e trilha ao entrar. Idempotente. Uso: node tools/player-20261002.js
"use strict";
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
const FAIXAS = [
  ["o-tragico-e-grandioso", "O Trágico e Grandioso", "Boom Bap · 2:35", true],
  ["perguntas-que-ficaram", "Perguntas Que Ficaram", "Rap · 5:45", true],
  ["preco", "Preço", "Rap · inédita", true],
  ["mente-blindada", "Mente Blindada (Prontos pra Arena)", "Trap · inédita", true],
  ["ceu-nao-e-o-limite", "Céu Não é o Limite", "Rap · 3:30", true],
  ["esse-nao-e-voce", "Esse Não É Você", "Nasceu de um sonho · 5:20", true],
  ["miragem-virou-paisagem", "Miragem Virou Paisagem", "Rap · 6:00", true],
  ["olha-quem-eu-me-tornei", "Olha Quem Eu Me Tornei", "Rap nacional · 5:12", true],
  ["palacio-de-ferrugem", "Palácio de Ferrugem", "Poesia Boom Bap · 4:59", true],
  ["pessoas-parte-2", "Pessoas (Parte 2)", "Rap · 2:27", true],
  ["barulho", "Barulho", "Boom Bap sujo · 3:21", true],
  ["no-escuro", "No Escuro", "Boom Bap · inédita", true]
];

// ---------- HTML ----------
let s = fs.readFileSync(path.join(raiz, "index.html"), "utf8").replace(/\r\n/g, "\n");
const lis = FAIXAS.map(([id, t, g, l], i) => `              <li class="pl-item${i === 0 ? " ativa" : ""}" data-src="assets/audio/${id}.mp3"${l ? ` data-letra="assets/letras/${id}.json"` : ""} data-titulo="${t}" data-id="${id}">
                <button class="pl-tocar" type="button" aria-label="Tocar ${t}"><span class="pl-num">${String(i + 1).padStart(2, "0")}</span><span class="pl-nome">${t}</span><small>${g}</small></button>
                <a class="pl-baixar" href="assets/audio/${id}.mp3" download aria-label="Baixar ${t} (MP3)">Baixar</a>
              </li>`).join("\n");
const BLOCO = `        <div class="player reveal" id="player" aria-label="Player de músicas de FAGUITAL">
          <div class="player-topo">
            <span class="player-rotulo">OUÇA E BAIXE · TOCANDO AGORA</span>
            <div class="player-titulo-linha">
              <strong class="player-titulo" id="player-titulo">O Trágico e Grandioso</strong>
              <button class="player-compartilhar" id="player-compartilhar" type="button" aria-label="Compartilhar esta música"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8 15.7 6.3M8.3 13.2l7.4 4.5"/></svg><span>Compartilhar</span></button>
            </div>
            <audio id="trilha" controls preload="auto" src="assets/audio/o-tragico-e-grandioso.mp3">Seu navegador não toca áudio. <a href="assets/audio/o-tragico-e-grandioso.mp3" download>Baixar a faixa</a>.</audio>
          </div>
          <div class="letra-viva" id="letra-viva" aria-label="Letra sincronizada">
            <p class="letra-aviso">A letra acompanha a música enquanto ela toca.</p>
          </div>
          <p class="playlist-rotulo">${FAIXAS.length} músicas · role a lista para ver todas</p>
          <ol class="playlist" id="playlist">
${lis}
          </ol>
        </div>
`;
let ini = s.indexOf('        <figure class="faixa-destaque reveal" id="tragico-e-grandioso">');
if (ini >= 0) {
  const fim = s.indexOf("        </figure>\n", ini) + "        </figure>\n".length;
  s = s.slice(0, ini) + BLOCO + s.slice(fim);
} else {
  ini = s.indexOf('        <div class="player reveal" id="player"');
  if (ini < 0) throw new Error("bloco de destaque/player não encontrado");
  const fim = s.indexOf("        </div>\n", s.indexOf('</ol>', ini)) + "        </div>\n".length;
  s = s.slice(0, ini) + BLOCO + s.slice(fim);
}
fs.writeFileSync(path.join(raiz, "index.html"), s);

// ---------- JS ----------
let j = fs.readFileSync(path.join(raiz, "app.js"), "utf8");
for (const m of ["// 2026-10-02: trilha ao entrar", "// 2026-10-02: player de músicas"]) {
  const k = j.indexOf(m); if (k >= 0) j = j.slice(0, k).trimEnd() + "\n";
}
j += fs.readFileSync(path.join(__dirname, "player-app.js"), "utf8") + fs.readFileSync(path.join(__dirname, "flutuantes-app.js"), "utf8");
fs.writeFileSync(path.join(raiz, "app.js"), j);

// ---------- CSS ----------
let c = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");
const MARCA = "/* 2026-10-02: player */";
const k = c.indexOf(MARCA); if (k >= 0) c = c.slice(0, k);
c += MARCA + "\n" + fs.readFileSync(path.join(__dirname, "player.css"), "utf8") + fs.readFileSync(path.join(__dirname, "flutuantes.css"), "utf8");
fs.writeFileSync(path.join(raiz, "styles.css"), c);
// ---------- página de link de cada música (prévia própria no WhatsApp; leva ao player com a música escolhida) ----------
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
for (const [id, t, g2, l] of FAIXAS) {
  let trecho = "";
  if (l) {
    const linhas = JSON.parse(fs.readFileSync(path.join(raiz, "assets", "letras", id + ".json"), "utf8")).linhas || [];
    for (const x of linhas) { if ((trecho + " " + x.texto).trim().length > 110) break; trecho = (trecho + " " + x.texto).trim(); }
  }
  const url = "https://faguital.com.br/musica/" + id + "/";
  const destino = "/?musica=" + id + "#player";
  const desc = (trecho ? "“" + trecho + "” " : "") + "Ouça " + t + ", de FAGUITAL.";
  const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)} · FAGUITAL</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://faguital.com.br/">
<meta property="og:type" content="music.song">
<meta property="og:title" content="${esc(t)} · FAGUITAL">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="FAGUITAL">
<meta property="og:locale" content="pt_BR">
<meta property="og:image" content="https://faguital.com.br/assets/img/og-faguital.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${destino}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>location.replace("${destino}");</script>
</head>
<body style="background:#05070b;color:#e6ecee;font-family:system-ui,sans-serif;padding:24px">
<p><a href="${destino}" style="color:#3cf2e4">Ouvir ${esc(t)}, de FAGUITAL</a></p>
</body>
</html>
`;
  fs.mkdirSync(path.join(raiz, "musica", id), { recursive: true });
  fs.writeFileSync(path.join(raiz, "musica", id, "index.html"), pagina);
}
console.log("player aplicado:", FAIXAS.length, "faixas (com páginas de compartilhamento)");
