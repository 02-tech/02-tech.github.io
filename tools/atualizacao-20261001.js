// Atualização do site pessoal faguital.com.br (2026-10-01, pedido de Guilherme). Idempotente.
// - nome completo (Guilherme Carvalho de Andrade), igual ao site oficial do TECNOFAG GUARD;
// - trajetória militar: infantaria, comunicações e montanha;
// - TECNOFAG GUARD apresentado só com informação pública, com link para tecnofagguard.com.br;
// - Imperial Volt como outra empresa de Guilherme (nome clicável, sem botão "Conhecer");
// - SIGILO: removidas as menções a NFC/sensores/objetos conectados, que, ao lado do TECNOFAG GUARD,
//   permitiriam deduzir o mecanismo do projeto (inclusive nomes de classes visíveis no código-fonte);
// - travessões trocados por pontuação natural nos textos públicos;
// - correção do texto "FREQUÊNCIA ATIVA" cortado dentro do hexágono no celular.
// Uso: node tools/atualizacao-20261001.js
"use strict";
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
const TG = '<a href="https://tecnofagguard.com.br/" rel="noopener">TECNOFAG GUARD®</a>';
const IV = '<a href="https://imperialvolt.com/" rel="noopener">Imperial Volt</a>';
const NOME = "Guilherme Carvalho de Andrade";

function editar(arquivo, trocas) {
  const f = path.join(raiz, arquivo);
  let s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  let n = 0;
  for (const [de, para] of trocas) {
    if (de instanceof RegExp) { const antes = s; s = s.replace(de, para); if (s !== antes) n++; continue; }
    if (s.includes(de)) { s = s.split(de).join(para); n++; continue; }
    if (s.includes(para)) continue;
    throw new Error(`${arquivo}: trecho não encontrado: ${de.slice(0, 90)}`);
  }
  fs.writeFileSync(f, s);
  console.log(`${arquivo}: ${n} trocas`);
}

// JSON-LD da pessoa (mesmo conteúdo nas duas páginas)
const pessoa = [
  [/"name": "Guilherme Carvalho",(\s*)"givenName": "Guilherme",(\s*)"familyName": "Carvalho",(\s*)"alternateName": \["Gui Carvalho", "FAGUITAL", "@faguital"\],/g,
   `"name": "${NOME}",$1"givenName": "Guilherme",$2"familyName": "Carvalho de Andrade",$3"alternateName": ["Guilherme Carvalho", "Gui Carvalho", "FAGUITAL", "@faguital"],`],
  [/"description": "Petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador, criador de protocolos e desenvolvedor de tecnologias aplicadas\. É a pessoa e identidade artística por trás de FAGUITAL\."/g,
   '"description": "Petropolitano, ex-militar condecorado do Exército Brasileiro (infantaria, comunicações e montanha), prototipador, criador de protocolos e criador do TECNOFAG GUARD. É a pessoa e identidade artística por trás de FAGUITAL."'],
  [/"knowsAbout": \["Tecnologia", "Inteligência artificial", "Automação", "Eletrônica", "NFC", "Interfaces de voz", "Prototipagem", "Criação digital"\],/g,
   '"knowsAbout": ["Tecnologia", "Inteligência artificial", "Automação", "Eletrônica", "Identificação digital", "Interfaces de voz", "Prototipagem", "Criação digital"],'],
  // seções numeradas e marca sem travessão
  [/(\d\d) — ([A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+)<\/p>/g, "$1 · $2</p>"],
  [/aria-label="FAGUITAL — ([^"]*)"/g, 'aria-label="FAGUITAL, $1"'],
  [/<meta name="author" content="Guilherme Carvalho — FAGUITAL">/, `<meta name="author" content="${NOME} (FAGUITAL)">`]
];

editar("index.html", [
  ...pessoa,
  [/<meta name="description" content="[^"]*">/, `<meta name="description" content="FAGUITAL é o nome artístico de ${NOME}: petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador do TECNOFAG GUARD®.">`],
  [/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="FAGUITAL | Nome artístico de ${NOME}">`],
  [/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="Conheça ${NOME}: petropolitano, ex-militar condecorado, prototipador e criador do TECNOFAG GUARD®, a pessoa por trás de FAGUITAL.">`],
  ["<title>FAGUITAL — Quem é Guilherme “Gui” Carvalho</title>", `<title>FAGUITAL | ${NOME}</title>`],
  ['"description": "Arquivo pessoal e portfólio artístico de Guilherme Carvalho."', `"description": "Arquivo pessoal e portfólio artístico de ${NOME}."`],
  ['"name": "FAGUITAL — perfil de Guilherme Carvalho"', `"name": "FAGUITAL | perfil de ${NOME}"`],
  ['"dateModified": "2026-08-10T02:34:15-03:00"', '"dateModified": "2026-10-01T18:00:00-03:00"'],
  // o projeto público criado por Guilherme, ligado à entidade do site oficial
  ['        "sameAs": [\n          "https://www.instagram.com/faguital/",\n          "https://www.facebook.com/faguital",\n          "https://github.com/02-tech"\n        ]\n      }\n    ]',
   '        "affiliation": { "@type": "Organization", "name": "Imperial Volt", "url": "https://imperialvolt.com/" },\n        "sameAs": [\n          "https://www.instagram.com/faguital/",\n          "https://www.facebook.com/faguital",\n          "https://github.com/02-tech"\n        ]\n      },\n      {\n        "@type": "Project",\n        "@id": "https://tecnofagguard.com.br/#tecnofag-guard",\n        "name": "TECNOFAG GUARD",\n        "url": "https://tecnofagguard.com.br/",\n        "description": "Ecossistema brasileiro de identificação digital criado por Guilherme Carvalho de Andrade (FAGUITAL).",\n        "founder": { "@id": "https://faguital.com.br/#person" }\n      }\n    ]'],
  // bio da página inicial
  ["<p><strong>FAGUITAL é o nome artístico de Guilherme “Gui” Carvalho</strong> — petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador de protocolos",
   `<p><strong>FAGUITAL é o nome artístico de ${NOME}</strong>, petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador de protocolos`],
  // sigilo: sem NFC/sensores
  ["<p>Eletrônica, NFC, sensores e prototipagem: o momento em que o código atravessa a tela e ocupa o espaço físico.</p>",
   "<p>Eletrônica, hardware e prototipagem: o momento em que o código atravessa a tela e ocupa o espaço físico.</p>"],
  ["territórios de fascínio — o desconhecido como impulso para imaginar.", "territórios de fascínio, com o desconhecido como impulso para imaginar."],
  // o card "Objetos conectados" vira a apresentação pública do TECNOFAG GUARD
  [`          <div class="project-top"><span>MATÉRIA & SOFTWARE</span><i>EXPERIMENTO ABERTO</i></div>
          <div class="project-art nfc-art" aria-hidden="true">
            <div class="tag-ring"><span>NFC</span></div>
            <span class="scan-line"></span>
          </div>
          <div class="project-copy">
            <p class="project-code">FRAGMENTO / 003</p>
            <h3>Objetos conectados</h3>
            <p>Estudos com NFC, eletrônica e software. Investigações sobre como objetos físicos podem carregar informação, contexto e presença.</p>
            <div class="tags"><span>NFC</span><span>PROTOTIPAGEM</span><span>INTEGRAÇÃO</span></div>
          </div>`,
   `          <div class="project-top"><span>IDENTIFICAÇÃO DIGITAL</span><i>PROJETO EM DESENVOLVIMENTO</i></div>
          <div class="project-art sinal-art" aria-hidden="true">
            <div class="anel-sinal"><span>®</span></div>
            <span class="scan-line"></span>
          </div>
          <div class="project-copy">
            <p class="project-code">PROJETO / 003</p>
            <h3>${TG}</h3>
            <p>Deste universo nasceu o TECNOFAG GUARD®, ecossistema brasileiro de identificação digital que conecta elementos do mundo físico a experiências digitais. Está em desenvolvimento, com pedido de patente de invenção depositado junto ao INPI e marca concedida.</p>
            <div class="tags"><span>IDENTIFICAÇÃO DIGITAL</span><span>HARDWARE</span><span>SOFTWARE</span></div>
          </div>`],
  ["como linguagem pessoal e visual — não como dogma ou fórmula científica, mas como convite", "como linguagem pessoal e visual: não como dogma ou fórmula científica, mas como convite"],
  ["<span>— Nikola Tesla, em entrevista publicada em 1927</span>", "<span>Nikola Tesla, em entrevista publicada em 1927</span>"],
  // caminhos: projeto próprio e outra empresa, nomes clicáveis, sem botão "Conhecer"
  [`        <div><small>CAMINHO COMERCIAL</small><p>Quando uma ideia precisa se tornar um projeto, ela encontra outro nome: Imperial Volt.</p></div>
        <div class="hero-actions">
          <a class="button button-primary" href="https://imperialvolt.com/" target="_blank" rel="noopener noreferrer">Conhecer a Imperial Volt <span>↗</span></a>
          <a class="button button-ghost"`,
   `        <div><small>CAMINHOS</small><p>Algumas ideias ganham vida própria. O ${TG} é o projeto de identificação digital que nasceu deste universo. A ${IV} é outra empresa de Guilherme, dedicada a sites, sistemas, aplicativos e soluções sob medida.</p></div>
        <div class="hero-actions">
          <a class="button button-ghost"`]
]);

editar("sobre.html", [
  ...pessoa,
  [/<meta name="description" content="[^"]*">/, `<meta name="description" content="Quem é FAGUITAL? ${NOME} é petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador do TECNOFAG GUARD®.">`],
  [/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="Quem é FAGUITAL? | ${NOME}">`],
  ["<title>Quem é FAGUITAL? — Guilherme “Gui” Carvalho</title>", `<title>Quem é FAGUITAL? | ${NOME}</title>`],
  ['"name": "Quem é FAGUITAL? — Guilherme Carvalho"', `"name": "Quem é FAGUITAL? | ${NOME}"`],
  ['"description": "Página de perfil de Guilherme Carvalho, criador conhecido pelo nome artístico FAGUITAL."', `"description": "Página de perfil de ${NOME}, criador conhecido pelo nome artístico FAGUITAL."`],
  ['"dateModified": "2026-08-10T02:34:15-03:00"', '"dateModified": "2026-10-01T18:00:00-03:00"'],
  ["<p>FAGUITAL é o nome artístico de <strong>Guilherme “Gui” Carvalho</strong> — petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador de protocolos.</p>",
   `<p>FAGUITAL é o nome artístico de <strong>${NOME}</strong>, petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador de protocolos.</p>`],
  ["É a assinatura artística de Guilherme Carvalho e o nome que concentra", `É a assinatura artística de ${NOME} e o nome que concentra`],
  ["O portfólio conecta tecnologia, inteligência artificial, automação, eletrônica, voz, NFC e prototipagem a um imaginário",
   "O portfólio conecta tecnologia, inteligência artificial, automação, eletrônica, voz e prototipagem a um imaginário"],
  [`        <div><dt>Nome público</dt><dd>Guilherme “Gui” Carvalho</dd></div>
        <div><dt>Nome artístico</dt><dd>FAGUITAL</dd></div>
        <div><dt>Origem</dt><dd>Petrópolis · RJ · Brasil</dd></div>
        <div><dt>Trajetória</dt><dd>Ex-militar condecorado · Prototipador · Criador de protocolos</dd></div>`,
   `        <div><dt>Nome completo</dt><dd>${NOME}</dd></div>
        <div><dt>Nome artístico</dt><dd>FAGUITAL</dd></div>
        <div><dt>Origem</dt><dd>Petrópolis · RJ · Brasil</dd></div>
        <div><dt>Exército Brasileiro</dt><dd>Ex-militar condecorado · Infantaria · Comunicações · Montanha</dd></div>
        <div><dt>Criação</dt><dd>${TG}</dd></div>
        <div><dt>Empresa</dt><dd>${IV}</dd></div>`],
  ["<p>Petropolitano e ex-militar condecorado do Exército Brasileiro, Guilherme carrega da vida militar disciplina, método, resiliência e capacidade de agir sob responsabilidade.</p>",
   "<p>Petropolitano e ex-militar condecorado do Exército Brasileiro, Guilherme foi militar de infantaria, de comunicações e de montanha. Da vida militar carrega disciplina, método, resiliência e a capacidade de agir sob responsabilidade.</p>"],
  ["<p>Aplicativos, assistentes de voz, automações, eletrônica e objetos conectados são fragmentos de uma mesma busca — transformar pensamento em presença real sem perder o mistério que iniciou a pergunta.</p>",
   `<p>Aplicativos, assistentes de voz, automações e eletrônica são fragmentos de uma mesma busca: transformar pensamento em presença real sem perder o mistério que iniciou a pergunta.</p>
          <p>Dessa busca nasceu o ${TG}, ecossistema brasileiro de identificação digital criado por Guilherme, hoje em desenvolvimento, com pedido de patente de invenção depositado junto ao INPI e marca concedida. Em paralelo, Guilherme é dono da ${IV}, empresa de sites, sistemas, aplicativos e soluções sob medida.</p>`],
  [/Guilherme Carvalho · @faguital/g, `${NOME} · @faguital`]
]);

// estilos: classes renomeadas (sem "nfc" no código público) e hexágono com folga para o texto no celular
{
  const f = path.join(raiz, "styles.css");
  let s = fs.readFileSync(f, "utf8");
  s = s.split("nfc-art").join("sinal-art").split("tag-ring").join("anel-sinal");
  const correcao = "\n/* 2026-10-01: \"FREQUÊNCIA ATIVA\" cortado no celular (fonte monoespaçada do Android mais larga); mais folga no hexágono */\n.core{width:150px;height:150px}.core small{font-size:.5rem;letter-spacing:.08em;white-space:nowrap;margin-top:2px}\n";
  if (!s.includes("FREQUÊNCIA ATIVA\" cortado")) s += correcao;
  fs.writeFileSync(f, s);
  console.log("styles.css: classes renomeadas e hexágono corrigido");
}
// humans.txt e manifest
{
  const h = path.join(raiz, "humans.txt");
  let s = fs.readFileSync(h, "utf8");
  s = s.replace('Nome artístico de Guilherme "Gui" Carvalho.', `Nome artístico de ${NOME}.`)
       .replace("criador de protocolos e desenvolvedor de tecnologias aplicadas.", "criador de protocolos e criador do TECNOFAG GUARD (https://tecnofagguard.com.br/).");
  fs.writeFileSync(h, s);
  const m = path.join(raiz, "site.webmanifest");
  let j = fs.readFileSync(m, "utf8");
  j = j.replace('"FAGUITAL — Guilherme Carvalho"', `"FAGUITAL | ${NOME}"`).replace('"Portfólio de Guilherme Carvalho,', `"Portfólio de ${NOME},`);
  fs.writeFileSync(m, j);
  console.log("humans.txt e site.webmanifest atualizados");
}
