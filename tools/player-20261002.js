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
const COMPLETAS = new Set(["perguntas-que-ficaram", "preco", "mente-blindada", "esse-nao-e-voce"]);
const PESADOS = /morr|morte|morto|arma|tiro|bala|colaps|desabar|desmoron|caix[aã]o|sangue|suicid|fome|frio|desfaz|afogad/i;
const DESTAQUES = {};

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
        <p class="musica-paginas">Leia os <a href="/frases/">trechos em destaque</a> e as páginas indexáveis das músicas: ${FAIXAS.map(([id, t]) => `<a href="/musica/${id}/">${t}</a>`).join(" · ")}.</p>
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
// ---------- páginas indexáveis de cada música, mantendo o link próprio usado no WhatsApp ----------
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escJson = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
const dados = new Map();
for (const [id, t, g2, l] of FAIXAS) {
  const linhas = JSON.parse(fs.readFileSync(path.join(raiz, "assets", "letras", id + ".json"), "utf8")).linhas || [];
  const permitidas = linhas.filter((x) => !PESADOS.test(x.texto));
  const destaques = (DESTAQUES[id] || permitidas.slice(0, 4).map((x) => x.texto)).filter(Boolean);
  const letraCompleta = COMPLETAS.has(id) ? linhas.map((x) => x.texto) : null;
  const trecho = destaques.join(" ").slice(0, 180);
  const url = "https://faguital.com.br/musica/" + id + "/";
  const destino = "/?musica=" + id + "#player";
  const desc = (trecho ? "“" + trecho + "” " : "") + "Ouça " + t + ", de FAGUITAL.";
  const textoLetra = letraCompleta ? `<section class="letra-publicada"><h2>Letra</h2>${letraCompleta.map((x) => `<p>${esc(x)}</p>`).join("\n")}</section>` : `<section class="letra-publicada"><h2>Trechos em destaque</h2>${destaques.map((x) => `<blockquote>${esc(x)}</blockquote>`).join("\n")}<p class="nota-curadoria">Esta página publica apenas trechos selecionados da letra.</p></section>`;
  const schema = {"@context":"https://schema.org","@graph":[{"@type":"MusicComposition","@id":url+"#composition","name":t,"composer":{"@id":"https://faguital.com.br/#person"},"lyrics":letraCompleta ? {"@type":"CreativeWork","text":letraCompleta.join("\n")} : {"@type":"CreativeWork","text":destaques.join("\n")},"inLanguage":"pt-BR"},{"@type":"MusicRecording","@id":url+"#recording","name":t,"byArtist":{"@id":"https://faguital.com.br/#person"},"recordingOf":{"@id":url+"#composition"},"url":url,"audio":{"@type":"AudioObject","contentUrl":"https://faguital.com.br/assets/audio/"+id+".mp3","encodingFormat":"audio/mpeg"}}]};
  dados.set(id, { id, t, url, destaques, completa: !!letraCompleta });
  const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)} · FAGUITAL (letra)</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<meta property="og:type" content="music.song">
<meta property="og:title" content="${esc(t)} · FAGUITAL (letra)">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="FAGUITAL">
<meta property="og:locale" content="pt_BR">
<meta property="og:image" content="https://faguital.com.br/assets/img/og-faguital.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${escJson(schema)}</script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
<body style="background:#05070b;color:#e6ecee;font-family:system-ui,sans-serif;padding:24px">
<main class="pagina-musica"><p><a href="/" style="color:#3cf2e4">FAGUITAL</a></p><h1>${esc(t)} · FAGUITAL</h1><p>${esc(g2)}</p>${textoLetra}<p><a href="${destino}" style="color:#3cf2e4">Ouvir no player</a> · <a href="https://www.youtube.com/@faguital" style="color:#3cf2e4">YouTube oficial</a></p></main>
</body>
</html>
`;
  fs.mkdirSync(path.join(raiz, "musica", id), { recursive: true });
  fs.writeFileSync(path.join(raiz, "musica", id, "index.html"), pagina);
}
const frases = [...dados.values()].flatMap((d) => d.destaques.map((texto) => ({ texto, titulo: d.t, url: d.url })));
const frasesSchema = {"@context":"https://schema.org","@type":"CollectionPage","name":"Trechos de músicas de FAGUITAL","url":"https://faguital.com.br/frases/","mainEntity":frases.map((f) => ({"@type":"Quotation",text:f.texto,isPartOf:{"@type":"MusicRecording",name:f.titulo,url:f.url}}))};
fs.mkdirSync(path.join(raiz, "frases"), { recursive: true });
fs.writeFileSync(path.join(raiz, "frases", "index.html"), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Trechos de músicas · FAGUITAL</title><meta name="description" content="Trechos em destaque das músicas de FAGUITAL, ligados às suas páginas."><link rel="canonical" href="https://faguital.com.br/frases/"><script type="application/ld+json">${escJson(frasesSchema)}</script></head><body style="background:#05070b;color:#e6ecee;font-family:system-ui,sans-serif;padding:24px"><main class="pagina-musica"><p><a href="/" style="color:#3cf2e4">FAGUITAL</a></p><h1>Trechos de músicas</h1>${frases.map((f) => `<article><blockquote>${esc(f.texto)}</blockquote><p><a href="${f.url}" style="color:#3cf2e4">${esc(f.titulo)} · letra</a></p></article>`).join("\n")}</main></body></html>`);
const urls = ["/", "/sobre.html", "/frases/", ...FAIXAS.map(([id]) => "/musica/" + id + "/")];
fs.writeFileSync(path.join(raiz, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>https://faguital.com.br${u}</loc><lastmod>2026-10-12</lastmod></url>`).join("\n")}\n</urlset>\n`);
let llms = fs.readFileSync(path.join(raiz, "llms.txt"), "utf8").replace(/\n## Trechos → música[\s\S]*?(?=\n##|$)/, "");
llms += `\n## Trechos → música\n- Índice de trechos: https://faguital.com.br/frases/\n${frases.map((f) => `- “${f.texto}” → ${f.titulo}: ${f.url}`).join("\n")}\n`;
fs.writeFileSync(path.join(raiz, "llms.txt"), llms);
console.log("player aplicado:", FAIXAS.length, "faixas (com páginas de compartilhamento)");
