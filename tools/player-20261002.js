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
const lis = FAIXAS.map(([id, t, g, l], i) => `              <li class="pl-item${i === 0 ? " ativa" : ""}" data-src="assets/audio/${id}.mp3"${l ? ` data-letra="assets/letras/${id}.json"` : ""} data-titulo="${t}">
                <button class="pl-tocar" type="button" aria-label="Tocar ${t}"><span class="pl-num">${String(i + 1).padStart(2, "0")}</span><span class="pl-nome">${t}</span><small>${g}</small></button>
                <a class="pl-baixar" href="assets/audio/${id}.mp3" download aria-label="Baixar ${t} (MP3)">Baixar</a>
              </li>`).join("\n");
const BLOCO = `        <div class="player reveal" id="player" aria-label="Player de músicas de FAGUITAL">
          <div class="player-topo">
            <span class="player-rotulo">OUÇA E BAIXE · TOCANDO AGORA</span>
            <strong class="player-titulo" id="player-titulo">O Trágico e Grandioso</strong>
            <audio id="trilha" controls preload="auto" src="assets/audio/o-tragico-e-grandioso.mp3">Seu navegador não toca áudio. <a href="assets/audio/o-tragico-e-grandioso.mp3" download>Baixar a faixa</a>.</audio>
          </div>
          <div class="letra-viva" id="letra-viva" aria-label="Letra sincronizada">
            <p class="letra-aviso">A letra acompanha a música enquanto ela toca.</p>
          </div>
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
console.log("player aplicado:", FAIXAS.length, "faixas");
