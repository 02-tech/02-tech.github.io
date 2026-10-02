// Música no site pessoal (2026-10-02, Guilherme: "Vamos sim"). Idempotente.
// Seção "05 · MÚSICA" (rap e poesia Boom Bap, produção independente), faixas com link direto para o vídeo,
// YouTube nos "Sinais abertos" e no JSON-LD (sameAs). Só dados que o próprio Guilherme publica no canal @faguital.
// Uso: node tools/musica-20261002.js
"use strict";
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
const YT = "https://www.youtube.com/@faguital";
const FAIXAS = [
  ["PALÁCIO DE FERRUGEM", "Poesia Boom Bap", "https://www.youtube.com/watch?v=BOqqmfuUO_o"],
  ["BARULHO", "Boom Bap sujo", "https://www.youtube.com/watch?v=LsmdTp2iFqc"],
  ["OLHA QUEM EU ME TORNEI", "Rap nacional", "https://www.youtube.com/watch?v=HusfN6ER2yA"],
  ["PERGUNTAS QUE FICARAM", "Rap", "https://www.youtube.com/watch?v=20ijWtJQz5E"]
];

function editar(arquivo, fn) {
  const f = path.join(raiz, arquivo);
  const antes = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const depois = fn(antes);
  fs.writeFileSync(f, depois);
  console.log(arquivo, antes === depois ? "sem mudança" : "atualizado");
}
const sameAs = s => s.replace(/("https:\/\/www\.facebook\.com\/faguital",)(\s*)("https:\/\/github\.com\/02-tech")/g,
  (m, a, esp, b) => m.includes("youtube") ? m : `${a}${esp}"${YT}",${esp}${b}`);
const knows = s => s.replace(/"Prototipagem", "Criação digital"\]/g, '"Prototipagem", "Criação digital", "Rap", "Poesia"]');

editar("index.html", s => {
  s = knows(sameAs(s));
  if (!s.includes('id="musica"')) {
    const itens = FAIXAS.map(([t, g, u], i) =>
      `          <li><span class="faixa-num">${String(i + 1).padStart(2, "0")}</span><a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a><small>${g}</small></li>`).join("\n");
    const secao = `    <section class="musica section-shell" id="musica" aria-labelledby="titulo-musica">
      <p class="section-number reveal">05 · MÚSICA</p>
      <div class="musica-grid">
        <div class="reveal">
          <h2 id="titulo-musica">Rima, poesia<br><span>e barulho.</span></h2>
          <p class="musica-texto">Rap e poesia no estilo Boom Bap, com letra e direção de FAGUITAL e produção independente. As faixas e os clipes saem no <a href="${YT}" target="_blank" rel="noopener noreferrer">canal oficial no YouTube</a>.</p>
        </div>
        <ol class="faixas reveal">
${itens}
        </ol>
      </div>
    </section>

`;
    const ancora = '    <section class="contact section-shell" id="contato">';
    if (!s.includes(ancora)) throw new Error("âncora da seção de contato não encontrada");
    s = s.replace(ancora, secao + ancora);
  }
  s = s.replace('<p class="section-number reveal">05 · SINAIS ABERTOS</p>', '<p class="section-number reveal">06 · SINAIS ABERTOS</p>');
  if (!s.includes('href="#musica"')) s = s.replace('      <a class="nav-cta" href="#frequencia">', '      <a href="#musica">Música</a>\n      <a class="nav-cta" href="#frequencia">');
  if (!s.includes(`href="${YT}" target="_blank" rel="me`)) {
    const card = `        <a class="social-card" href="${YT}" target="_blank" rel="me noopener noreferrer" aria-label="YouTube de FAGUITAL, arroba faguital">
          <span class="social-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path class="social-dot" d="M10 9.2v5.6l4.8-2.8z"/></svg>
          </span>
          <span class="social-name"><small>YOUTUBE</small><strong>@faguital</strong></span>
          <span class="social-arrow" aria-hidden="true">↗</span>
        </a>
`;
    const fimSociais = "      </div>\n\n      <div class=\"business-bridge reveal\">";
    if (!s.includes(fimSociais)) throw new Error("fim dos cards sociais não encontrado");
    s = s.replace(fimSociais, card + fimSociais);
  }
  return s;
});
editar("sobre.html", s => knows(sameAs(s)));
editar("humans.txt", s => s.includes("YouTube:") ? s : s.replace("GitHub: https://github.com/02-tech", `YouTube: ${YT}\nGitHub: https://github.com/02-tech`)
  .replace("Tecnologia, inteligência artificial, automação, eletrônica, criação digital e experimentação.", "Tecnologia, inteligência artificial, automação, eletrônica, criação digital, rap, poesia e experimentação."));
editar("styles.css", s => s.includes("/* 2026-10-02: música */") ? s : s + `/* 2026-10-02: música */
.musica-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-top:50px}
.musica h2{font-size:clamp(2.7rem,5vw,5.8rem)}
.musica-texto{color:var(--muted);line-height:1.8;max-width:520px;margin-top:34px}
.musica-texto a{color:var(--cyan);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
.faixas{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.faixas li{display:grid;grid-template-columns:48px 1fr auto;align-items:baseline;gap:16px;padding:24px 4px;border-bottom:1px solid var(--line)}
.faixa-num{font:.7rem Consolas,"Courier New",monospace;color:var(--cyan);letter-spacing:.14em}
.faixas a{color:#e8edef;font-size:clamp(1.05rem,2.2vw,1.45rem);font-weight:500;letter-spacing:.02em;text-decoration:none;transition:color .2s}
.faixas a:hover,.faixas a:focus-visible{color:var(--cyan);text-decoration:underline;text-underline-offset:5px}
.faixas a:focus-visible{outline:2px solid var(--cyan);outline-offset:4px}
.faixas small{font:.58rem Consolas,"Courier New",monospace;letter-spacing:.14em;text-transform:uppercase;color:#7b888e;text-align:right}
.social-links{grid-template-columns:repeat(3,1fr)}
@media (max-width:900px){.musica-grid{grid-template-columns:1fr;gap:40px}.social-links{grid-template-columns:1fr}}
@media (max-width:520px){.faixas li{grid-template-columns:36px 1fr}.faixas small{grid-column:2;text-align:left;margin-top:-8px}}
`);
