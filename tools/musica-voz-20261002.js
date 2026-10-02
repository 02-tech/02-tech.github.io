// Música com a voz de Guilherme (2026-10-02, pedido: "Apenas faça"). Idempotente.
// Fonte: só o que ele mesmo publicou nas descrições e letras do canal youtube.com/@faguital.
// Curadoria: trechos de superação, identidade e legado; versos pesados ficam fora do site (continuam no YouTube).
// Uso: node tools/musica-voz-20261002.js
"use strict";
const fs = require("fs"), path = require("path");
const f = path.join(__dirname, "..", "index.html");
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const YT = "https://www.youtube.com/@faguital";
const v = id => `https://www.youtube.com/watch?v=${id}`;
const FAIXAS = [
  ["PESSOAS", "2021 · 2026", "“Vários anos passaram e vários sonhos ficaram.”", v("JAnVp5H33qg")],
  ["ESSE NÃO É VOCÊ", "Nasceu de um sonho", "“Nem toda queda é fim.”", v("uoc-Bu7vBGg")],
  ["CÉU NÃO É O LIMITE", "Rap", "“Autoconfiança é a base, tristeza é só fase.”", v("JxyhuCwVrlY")],
  ["BARULHO", "Boom Bap sujo", "“Cê ouve, mas cê escuta?”", v("LsmdTp2iFqc")],
  ["PALÁCIO DE FERRUGEM", "Poesia Boom Bap", "", v("BOqqmfuUO_o")],
  ["OLHA QUEM EU ME TORNEI", "Rap nacional", "", v("HusfN6ER2yA")],
  ["PERGUNTAS QUE FICARAM", "Rap", "“Eu nunca quis ser eterno.”", v("20ijWtJQz5E")]
];
const itens = FAIXAS.map(([t, g, frase, u], i) =>
  `          <li><span class="faixa-num">${String(i + 1).padStart(2, "0")}</span><span class="faixa-corpo"><a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>${frase ? `<q>${frase.replace(/[“”]/g, "")}</q>` : ""}</span><small>${g}</small></li>`).join("\n");

const NOVA = `    <section class="musica section-shell" id="musica" aria-labelledby="titulo-musica">
      <p class="section-number reveal">05 · MÚSICA</p>
      <div class="musica-grid">
        <div class="reveal">
          <h2 id="titulo-musica">Rima, poesia<br><span>e barulho.</span></h2>
          <blockquote class="musica-lema"><p>Essa música não nasceu hoje. A ideia continua a mesma. A forma evoluiu.</p></blockquote>
          <p class="musica-texto">Em 2021, “Pessoas” nasceu como desabafo, uma poesia realista de quem dizia não ser cantor, mas usava a música para passar o próprio pensamento sobre a vida. Em 2026 começou uma nova fase: letras guardadas por anos ganharam voz, em rap e poesia no estilo Boom Bap, com letra e direção de FAGUITAL e produção independente.</p>
          <p class="musica-texto">Disciplina, identidade, as madrugadas e o legado atravessam as faixas. Todas estão no <a href="${YT}" target="_blank" rel="noopener noreferrer">canal oficial no YouTube</a>.</p>
        </div>
        <ol class="faixas reveal">
${itens}
        </ol>
      </div>
      <p class="musica-legado reveal">“Eu nunca quis ser eterno. Mas talvez algumas ideias consigam ir mais longe do que nós.” <span>FAGUITAL, em Perguntas Que Ficaram</span></p>
    </section>
`;
const ini = s.indexOf('    <section class="musica section-shell" id="musica"');
const fim = s.indexOf("    </section>\n", ini);
if (ini < 0 || fim < 0) throw new Error("seção de música não encontrada");
const atual = s.slice(ini, fim + "    </section>\n".length);
if (atual !== NOVA) { s = s.slice(0, ini) + NOVA + s.slice(fim + "    </section>\n".length); fs.writeFileSync(f, s); console.log("index.html: música atualizada"); }
else console.log("index.html: sem mudança");

const css = path.join(__dirname, "..", "styles.css");
let c = fs.readFileSync(css, "utf8");
if (!c.includes("/* 2026-10-02: música com a voz de Guilherme */")) {
  c += `/* 2026-10-02: música com a voz de Guilherme */
.musica-lema{margin:30px 0 0;padding:6px 0 6px 20px;border-left:2px solid var(--cyan)}
.musica-lema p{margin:0;color:#e2e7e9;font-size:clamp(1.05rem,1.8vw,1.3rem);line-height:1.5;font-style:italic}
.musica-texto+.musica-texto{margin-top:16px}
.faixa-corpo{display:flex;flex-direction:column;gap:6px;min-width:0}
.faixa-corpo q{color:#9aa7ad;font-size:.9rem;font-style:italic;quotes:"“" "”"}
.musica-legado{max-width:850px;margin:80px auto 0;text-align:center;color:#c8d0d3;font-size:1.15rem;line-height:1.8}
.musica-legado span{display:block;margin-top:10px;font:.58rem monospace;letter-spacing:.12em;color:#6f7c82;text-transform:uppercase}
`;
  fs.writeFileSync(css, c);
  console.log("styles.css: estilos da voz");
}
