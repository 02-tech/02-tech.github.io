// Seção "Escritos" (2026-10-02): curadoria de poesias do Instagram @faguital, transcritas das capturas
// que o próprio Guilherme enviou. Só textos de tempo, atitude, disciplina e recomeço; textos pesados ficam fora.
// Travessões do original trocados por vírgula/ponto (preferência de Guilherme). Idempotente.
// Uso: node tools/escritos-20261002.js
"use strict";
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
const IG = "https://www.instagram.com/faguital/";
const ESCRITOS = [
  ["Esperei pelo tempo certo e tudo o que consegui foi menos tempo.", "2021"],
  ["Com base no tempo, nada mudará, é a sua atitude que transformará a areia do deserto em um lindo mar, mas tome cuidado para não se afogar.", "2021"],
  ["E cada erro é um passo dado ao aprendizado. (...) Diversas vezes tentei e em poucas consegui, mas de todas eu sei, eu nunca desisti!", "Mundo Sonoro · 2021"],
  ["As rimas que escrevia sozinho no escuro serviam de luz para um jovem confuso.", "2024"],
  ["De um lado, as ideias pedem vida. Frases imploram para existir. Mas do outro… a rotina pesa. E quase sempre, é ela quem vence. Mesmo assim… a mente insiste em sonhar.", "Entre dois mundos"],
  ["É fácil parecer corajoso quando nada te abala. Difícil é sentir o peso… e continuar.", "FAGUITAL"],
  ["Se for pra cair, que seja no fundo do poço, porque de lá não tem mais queda, só impulso.", "FAGUITAL"]
];
const cards = ESCRITOS.map(([t, ref]) =>
  `          <figure class="escrito"><blockquote><p>${t}</p></blockquote><figcaption>${ref}</figcaption></figure>`).join("\n");
const SECAO = `    <section class="escritos section-shell" id="escritos" aria-labelledby="titulo-escritos">
      <p class="section-number reveal">06 · ESCRITOS</p>
      <div class="escritos-topo reveal">
        <h2 id="titulo-escritos">Poesia em sintonia<br><span>com o progresso.</span></h2>
        <div>
          <p class="escritos-guia">“Não vivendo a ilusão, vivo o que eu quero, que é muita poesia em sintonia com o progresso.”</p>
          <p class="escritos-texto">Desde 2021, FAGUITAL publica poesia no <a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a>: textos curtos sobre tempo, queda, disciplina e recomeço, assinados com o código de barras FaGuiTal.</p>
        </div>
      </div>
      <div class="escritos-grid reveal">
${cards}
      </div>
    </section>

`;
const f = path.join(raiz, "index.html");
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const ini = s.indexOf('    <section class="escritos section-shell"');
if (ini >= 0) { const fim = s.indexOf("    </section>\n\n", ini) + "    </section>\n\n".length; s = s.slice(0, ini) + SECAO + s.slice(fim); }
else {
  const anc = '    <section class="contact section-shell" id="contato">';
  if (!s.includes(anc)) throw new Error("âncora de contato não encontrada");
  s = s.replace(anc, SECAO + anc);
}
s = s.replace('<p class="section-number reveal">06 · SINAIS ABERTOS</p>', '<p class="section-number reveal">07 · SINAIS ABERTOS</p>');
fs.writeFileSync(f, s);
console.log("index.html: seção Escritos aplicada");

const css = path.join(raiz, "styles.css");
let c = fs.readFileSync(css, "utf8");
if (!c.includes("/* 2026-10-02: escritos */")) {
  c += `/* 2026-10-02: escritos */
.escritos-topo{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:end;margin-top:50px}
.escritos h2{font-size:clamp(2.7rem,5vw,5.8rem);line-height:.92;letter-spacing:-.065em;margin:0;font-weight:600}
.escritos h2 span{font-style:normal;color:transparent;-webkit-text-stroke:1px rgba(242,246,247,.5)}
.escritos-guia{margin:0;padding-left:20px;border-left:2px solid var(--cyan);color:#e2e7e9;font-size:clamp(1.05rem,1.8vw,1.3rem);line-height:1.5;font-style:italic}
.escritos-texto{color:var(--muted);line-height:1.8;margin:24px 0 0}
.escritos-texto a{color:var(--cyan);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
.escritos-grid{columns:3 280px;column-gap:16px;margin-top:70px}
.escrito{break-inside:avoid;margin:0 0 16px;padding:26px 24px 20px;border:1px solid var(--line);background:linear-gradient(160deg,rgba(60,242,228,.05),rgba(7,10,14,.85))}
.escrito blockquote{margin:0}
.escrito p{margin:0;color:#dfe5e7;font-size:1.02rem;line-height:1.65}
.escrito figcaption{margin-top:16px;font:.56rem Consolas,"Courier New",monospace;letter-spacing:.18em;text-transform:uppercase;color:#76838a}
@media (max-width:900px){.escritos-topo{grid-template-columns:1fr;gap:30px}.escritos h2{font-size:2.65rem}}
`;
  fs.writeFileSync(css, c);
  console.log("styles.css: estilos dos escritos");
}
