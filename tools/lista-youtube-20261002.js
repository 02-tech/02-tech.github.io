// Lista "Também no YouTube": só faixas que NÃO estão no player (evita duplicidade). Idempotente.
// Se todas estiverem no player, a lista e o rótulo saem; o canal continua em "Sinais abertos".
"use strict";
const fs = require("fs"), path = require("path");
const f = path.join(__dirname, "..", "index.html");
let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const NO_PLAYER = ["aMKex25x9Wc", "HusfN6ER2yA", "20ijWtJQz5E", "LsmdTp2iFqc", "uoc-Bu7vBGg", "JxyhuCwVrlY", "BOqqmfuUO_o", "JAnVp5H33qg"];
s = s.split("\n").filter((l) => !(l.includes('class="faixa-num"') && NO_PLAYER.some((id) => l.includes("watch?v=" + id)))).join("\n");
let n = 0;
s = s.replace(/<li><span class="faixa-num">\d\d<\/span>/g, () => '<li><span class="faixa-num">' + String(++n).padStart(2, "0") + "</span>");
if (n === 0) {
  const ini = s.indexOf('        <p class="faixas-rotulo reveal">');
  const fimTag = "        </ol>\n";
  const fim = ini >= 0 ? s.indexOf(fimTag, ini) : -1;
  if (ini >= 0 && fim >= 0) s = s.slice(0, ini) + s.slice(fim + fimTag.length);
}
fs.writeFileSync(f, s);
console.log("faixas só no YouTube:", n);
