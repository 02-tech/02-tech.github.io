// Identidade digital unificada (2026-10-02, pedido de Guilherme): um único grafo de entidades para Google e IAs.
// Mesmos @id nos três sites: Person https://faguital.com.br/#person, Organization https://imperialvolt.com/#organization,
// Project https://tecnofagguard.com.br/#tecnofag-guard. Cada fato tem respaldo em texto visível de algum dos sites.
// Também gera llms.txt e humans.txt, títulos e descrições estratégicos e um bloco de perguntas visível na página Sobre.
// Idempotente. Uso: node tools/entidade-20261002.js
"use strict";
const fs = require("fs"), path = require("path");
const RAIZ = "C:/Users/FAGUITAL/PROJETOS";
const FG = RAIZ + "/6_SITES/faguital.com.br", TG = RAIZ + "/6_SITES/tecnofagguard.com.br", IV = RAIZ + "/IMPERIAL_VOLT/imperialvolt.com";
const P = "https://faguital.com.br/#person", O = "https://imperialvolt.com/#organization", T = "https://tecnofagguard.com.br/#tecnofag-guard";

const DESCRICAO = "Guilherme Carvalho de Andrade, conhecido como FAGUITAL, é um prototipador, empreendedor e artista brasileiro de Petrópolis (RJ). Ex-militar condecorado do Exército Brasileiro (infantaria, comunicações e montanha), fundador e dono da Imperial Volt e criador do TECNOFAG GUARD, ecossistema de identificação digital com pedido de patente de invenção depositado no INPI e marca concedida. Também é rapper e poeta, com produção independente de rap e poesia Boom Bap.";
const SAMEAS = ["https://www.instagram.com/faguital/", "https://www.facebook.com/faguital", "https://www.youtube.com/@faguital", "https://github.com/02-tech"];
const SABERES = ["Prototipagem", "Identificação digital", "Hardware", "Software", "Inteligência artificial", "Automação", "Eletrônica",
  "Desenvolvimento de sites", "Desenvolvimento de aplicativos", "Sistemas web", "Impressão 3D", "Propriedade intelectual", "Empreendedorismo",
  "Rap nacional", "Boom Bap", "Poesia", "Composição musical", "Infantaria", "Comunicações militares", "Montanhismo"];

const pessoaCompleta = {
  "@type": "Person", "@id": P,
  "name": "Guilherme Carvalho de Andrade",
  "alternateName": ["FAGUITAL", "Gui Carvalho", "Guilherme Carvalho", "@faguital"],
  "givenName": "Guilherme", "familyName": "Carvalho de Andrade",
  "url": "https://faguital.com.br/",
  "description": DESCRICAO,
  "jobTitle": ["Fundador da Imperial Volt", "Criador do TECNOFAG GUARD", "Prototipador", "Rapper e poeta"],
  "worksFor": { "@id": O },
  "nationality": { "@type": "Country", "name": "Brasil" },
  "homeLocation": { "@type": "Place", "name": "Petrópolis, Rio de Janeiro, Brasil" },
  "award": "Diploma Ao Mérito, Exército Brasileiro",
  "hasOccupation": [
    { "@type": "Occupation", "name": "Prototipador e criador de protocolos tecnológicos", "description": "Desenvolvimento de protótipos, hardware, software, automações e tecnologias aplicadas." },
    { "@type": "Occupation", "name": "Empreendedor", "description": "Fundador e dono da Imperial Volt; criador do TECNOFAG GUARD." },
    { "@type": "Occupation", "name": "Rapper e poeta", "description": "Rap e poesia no estilo Boom Bap, com letra e direção próprias e produção independente." }
  ],
  "knowsAbout": SABERES,
  "sameAs": SAMEAS
};
const pessoaResumo = { "@type": "Person", "@id": P, "name": "Guilherme Carvalho de Andrade", "alternateName": ["FAGUITAL", "Gui Carvalho"], "url": "https://faguital.com.br/", "sameAs": SAMEAS };
const empresa = {
  "@type": "Organization", "@id": O, "name": "Imperial Volt", "url": "https://imperialvolt.com/",
  "description": "Empresa de Petrópolis (RJ) com atendimento remoto: criação de sites, sistemas web, aplicativos, automações, impressão 3D e soluções sob medida.",
  "email": "contato.imperialvolt@gmail.com", "taxID": "60.179.279/0001-44",
  "founder": { "@id": P },
  "address": { "@type": "PostalAddress", "addressLocality": "Petrópolis", "addressRegion": "RJ", "addressCountry": "BR" },
  "areaServed": ["Petrópolis - RJ", "Atendimento remoto"],
  "knowsAbout": ["Criação de sites", "Sistemas web", "Aplicativos", "Automação", "Impressão 3D", "Inteligência artificial"],
  "sameAs": ["https://www.instagram.com/imperialvolt"]
};
const projetoResumo = { "@type": "Project", "@id": T, "name": "TECNOFAG GUARD", "alternateName": "TECNOFAG GUARD®", "url": "https://tecnofagguard.com.br/",
  "description": "Ecossistema brasileiro de identificação digital criado por Guilherme Carvalho de Andrade (FAGUITAL), com pedido de patente de invenção depositado no INPI e marca concedida.",
  "founder": { "@id": P } };

function trocarJsonLd(html, novoGrafo) {
  const bloco = "<script type=\"application/ld+json\">\n" + JSON.stringify({ "@context": "https://schema.org", "@graph": novoGrafo }, null, 2) + "\n  </script>";
  const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  if (!re.test(html)) throw new Error("bloco JSON-LD não encontrado");
  return html.replace(re, bloco);
}
function lerHtml(f) { return fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n"); }
function trocar(s, de, para, rot) { if (s.includes(para)) return s; if (!s.includes(de)) throw new Error(rot + ": trecho não encontrado: " + de.slice(0, 80)); return s.replace(de, para); }
function meta(s, nome, valor) { return s.replace(new RegExp(`<meta ${nome} content="[^"]*">`), `<meta ${nome} content="${valor}">`); }

// ---------- faguital.com.br ----------
{
  const f = FG + "/index.html"; let s = lerHtml(f);
  const g = JSON.parse(s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const site = g.find(n => n["@type"] === "WebSite"), perfil = g.find(n => n["@type"] === "ProfilePage");
  site.description = "Site oficial de Guilherme Carvalho de Andrade (FAGUITAL): trajetória, tecnologia, música e escritos.";
  site.alternateName = ["FAGUITAL", "Guilherme Carvalho de Andrade"];
  perfil.name = "Guilherme Carvalho de Andrade (FAGUITAL)"; perfil.dateModified = "2026-10-02T10:00:00-03:00";
  // músicas do player como gravações do artista
  const faixas = [...s.matchAll(/data-src="([^"]+)"[^>]*data-titulo="([^"]+)"/g)].map(m => ({ "@type": "MusicRecording", "name": m[2], "byArtist": { "@id": P }, "inLanguage": "pt-BR", "url": "https://faguital.com.br/#musica", "audio": { "@type": "AudioObject", "contentUrl": "https://faguital.com.br/" + m[1], "encodingFormat": "audio/mpeg" } }));
  const playlist = { "@type": "MusicPlaylist", "@id": "https://faguital.com.br/#musicas", "name": "Músicas de FAGUITAL", "description": "Rap e poesia Boom Bap de Guilherme Carvalho de Andrade (FAGUITAL), produção independente.", "author": { "@id": P }, "numTracks": faixas.length, "track": faixas };
  s = trocarJsonLd(s, [site, perfil, pessoaCompleta, empresa, projetoResumo, playlist]);
  s = s.replace(/<title>[^<]*<\/title>/, "<title>Guilherme Carvalho de Andrade (FAGUITAL) | Prototipador, empreendedor e rapper</title>");
  s = meta(s, "name=\"description\"", "Guilherme Carvalho de Andrade (FAGUITAL): prototipador e empreendedor de Petrópolis, fundador da Imperial Volt, criador do TECNOFAG GUARD®, ex-militar, rapper e poeta.");
  s = meta(s, "property=\"og:title\"", "Guilherme Carvalho de Andrade (FAGUITAL)");
  s = meta(s, "property=\"og:description\"", "Prototipador e empreendedor de Petrópolis (RJ), fundador da Imperial Volt, criador do TECNOFAG GUARD®, ex-militar condecorado, rapper e poeta.");
  s = trocar(s, "<p><strong>FAGUITAL é o nome artístico de Guilherme Carvalho de Andrade</strong>, petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador de protocolos.</p>",
    "<p><strong>FAGUITAL é o nome artístico de Guilherme Carvalho de Andrade</strong>, petropolitano, ex-militar condecorado do Exército Brasileiro, prototipador e criador de protocolos. É fundador e dono da <a href=\"https://imperialvolt.com/\" rel=\"noopener\">Imperial Volt</a>, criador do <a href=\"https://tecnofagguard.com.br/\" rel=\"noopener\">TECNOFAG GUARD®</a>, rapper e poeta.</p>", "faguital index");
  fs.writeFileSync(f, s);
}
{
  const f = FG + "/sobre.html"; let s = lerHtml(f);
  const lido = JSON.parse(s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const pagina = lido["@graph"] ? lido["@graph"].find((n) => n["@type"] === "ProfilePage") : lido;
  pagina["@id"] = "https://faguital.com.br/sobre.html#profile";
  pagina.url = "https://faguital.com.br/sobre.html";
  pagina.isPartOf = { "@id": "https://faguital.com.br/#website" };
  const perguntas = [
    ["Quem é Guilherme Carvalho de Andrade?", "Guilherme Carvalho de Andrade, conhecido como FAGUITAL, é um prototipador, empreendedor e artista de Petrópolis (RJ). É ex-militar condecorado do Exército Brasileiro, fundador e dono da Imperial Volt, criador do TECNOFAG GUARD, rapper e poeta."],
    ["Quem é FAGUITAL?", "FAGUITAL é o nome artístico de Guilherme Carvalho de Andrade, assinatura que reúne sua tecnologia, sua música e seus escritos."],
    ["Quem é o dono da Imperial Volt?", "A Imperial Volt, empresa de sites, sistemas, aplicativos, automações e impressão 3D de Petrópolis (RJ), é de Guilherme Carvalho de Andrade (FAGUITAL), seu fundador."],
    ["Quem criou o TECNOFAG GUARD?", "O TECNOFAG GUARD, ecossistema brasileiro de identificação digital com pedido de patente de invenção depositado no INPI e marca concedida, foi criado por Guilherme Carvalho de Andrade (FAGUITAL)."],
    ["Onde ouvir as músicas de FAGUITAL?", "As músicas de FAGUITAL, rap e poesia Boom Bap com produção independente, podem ser ouvidas e baixadas em faguital.com.br e estão no canal oficial do YouTube @faguital."]
  ];
  pagina.dateModified = "2026-10-02T10:00:00-03:00";
  pagina.name = "Quem é Guilherme Carvalho de Andrade (FAGUITAL)?";
  pagina.mainEntity = pessoaCompleta;
  const faq = { "@type": "FAQPage", "@id": "https://faguital.com.br/sobre.html#perguntas", "mainEntity": perguntas.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })) };
  const grafo = [Object.assign({ "@type": "ProfilePage" }, pagina, { "@context": undefined }), empresa, projetoResumo, faq];
  delete grafo[0]["@context"];
  s = trocarJsonLd(s, grafo);
  s = s.replace(/<title>[^<]*<\/title>/, "<title>Quem é Guilherme Carvalho de Andrade (FAGUITAL)? | Trajetória</title>");
  s = meta(s, "name=\"description\"", "Quem é Guilherme Carvalho de Andrade (FAGUITAL)? Ex-militar condecorado, prototipador, fundador e dono da Imperial Volt, criador do TECNOFAG GUARD®, rapper e poeta de Petrópolis.");
  if (!s.includes('id="perguntas"')) {
    const html = `
    <section class="profile-faq section-shell" id="perguntas" aria-labelledby="titulo-perguntas">
      <p class="section-number reveal">04 · EM POUCAS PALAVRAS</p>
      <h2 id="titulo-perguntas" class="reveal">Perguntas<br><span>diretas.</span></h2>
      <dl class="faq-lista reveal">
${perguntas.map(([q, a]) => `        <div><dt>${q}</dt><dd>${a}</dd></div>`).join("\n")}
      </dl>
    </section>
`;
    const anc = "\n  </main>";
    if (!s.includes(anc)) throw new Error("sobre: fim do main não encontrado");
    s = s.replace(anc, html + anc);
  }
  fs.writeFileSync(f, s);
  const c = FG + "/styles.css"; let css = fs.readFileSync(c, "utf8");
  if (!css.includes(".faq-lista")) css += `/* 2026-10-02: perguntas diretas (página Sobre) */
.profile-faq h2{font-size:clamp(2.7rem,5vw,5.8rem);line-height:.92;letter-spacing:-.065em;margin:30px 0 0;font-weight:600}
.profile-faq h2 span{font-style:normal;color:transparent;-webkit-text-stroke:1px rgba(242,246,247,.5)}
.faq-lista{margin:50px 0 0;border-top:1px solid var(--line)}
.faq-lista div{display:grid;grid-template-columns:minmax(220px,.8fr) 1.2fr;gap:30px;padding:26px 0;border-bottom:1px solid var(--line)}
.faq-lista dt{color:#e8edef;font-weight:600;font-size:1.05rem}
.faq-lista dd{margin:0;color:var(--muted);line-height:1.75}
@media (max-width:900px){.faq-lista div{grid-template-columns:1fr;gap:10px}}
`;
  fs.writeFileSync(c, css);
}

// ---------- tecnofagguard.com.br ----------
{
  const f = TG + "/index.html"; let s = lerHtml(f);
  const g = JSON.parse(s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const proj = g.find(n => n["@type"] === "Project");
  proj.founder = { "@id": P };
  const outros = g.filter(n => !["Person", "Organization"].includes(n["@type"]));
  const novo = JSON.parse(JSON.stringify(outros).split("https://tecnofagguard.com.br/#faguital").join(P).split("https://tecnofagguard.com.br/#imperial-volt").join(O));
  s = trocarJsonLd(s, [...novo, Object.assign({}, pessoaResumo, { "jobTitle": ["Criador do TECNOFAG GUARD", "Fundador da Imperial Volt"], "worksFor": { "@id": O } }), { "@type": "Organization", "@id": O, "name": "Imperial Volt", "url": "https://imperialvolt.com/", "founder": { "@id": P } }]);
  fs.writeFileSync(f, s);
}

// ---------- imperialvolt.com (só dados estruturados e rodapé) ----------
{
  const f = IV + "/index.html"; let s = lerHtml(f);
  const atual = JSON.parse(s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const emp = Object.assign({}, empresa, { "email": atual.email || empresa.email, "areaServed": atual.areaServed || empresa.areaServed });
  const site = { "@type": "WebSite", "@id": "https://imperialvolt.com/#website", "url": "https://imperialvolt.com/", "name": "Imperial Volt", "inLanguage": "pt-BR", "publisher": { "@id": O } };
  s = trocarJsonLd(s, [site, emp, pessoaResumo, projetoResumo]);
  s = trocar(s, '<a class="site-footer__maker" href="https://faguital.com.br" target="_blank" rel="noopener">Desenvolvido por FAGUITAL</a>',
    '<a class="site-footer__maker" href="https://faguital.com.br" target="_blank" rel="noopener">Uma empresa de Guilherme Carvalho de Andrade (FAGUITAL)</a>', "imperialvolt rodapé");
  fs.writeFileSync(f, s);
}

// ---------- llms.txt e humans.txt ----------
const LLMS = {
  [FG]: `# Guilherme Carvalho de Andrade (FAGUITAL)

> ${DESCRICAO}

Site oficial pessoal: https://faguital.com.br/

## Identidade
- Nome completo: Guilherme Carvalho de Andrade
- Nome artístico: FAGUITAL (também Gui Carvalho, @faguital)
- Origem: Petrópolis, Rio de Janeiro, Brasil
- Exército Brasileiro: ex-militar condecorado (Diploma Ao Mérito); 32º Batalhão de Infantaria Leve de Montanha; infantaria, Pelotão de Comunicações e montanha

## Empresas e projetos
- [Imperial Volt](https://imperialvolt.com/): empresa fundada e de propriedade de Guilherme Carvalho de Andrade (CNPJ 60.179.279/0001-44). Sites, sistemas web, aplicativos, automações e impressão 3D, em Petrópolis (RJ) e atendimento remoto.
- [TECNOFAG GUARD](https://tecnofagguard.com.br/): ecossistema brasileiro de identificação digital criado por ele. Em desenvolvimento, com pedido de patente de invenção depositado no INPI e marca concedida.

## Música e escritos
- Rap e poesia Boom Bap, com letra e direção próprias e produção independente. Músicas para ouvir e baixar, com letra sincronizada: https://faguital.com.br/#musica
- Faixas: O Trágico e Grandioso, Perguntas Que Ficaram, Preço, Mente Blindada (Prontos pra Arena), Céu Não é o Limite, Esse Não É Você, Miragem Virou Paisagem, Olha Quem Eu Me Tornei, Palácio de Ferrugem, Pessoas, Barulho, No Escuro.
- Poesia publicada desde 2021: https://faguital.com.br/#escritos

## Perfis oficiais
- Instagram: https://www.instagram.com/faguital/
- YouTube: https://www.youtube.com/@faguital
- Facebook: https://www.facebook.com/faguital
- GitHub: https://github.com/02-tech

## Páginas
- [Quem é Guilherme Carvalho de Andrade (FAGUITAL)?](https://faguital.com.br/sobre.html)
`,
  [TG]: `# TECNOFAG GUARD®

> Ecossistema brasileiro de identificação digital que conecta elementos do mundo físico a experiências digitais por meio da integração entre hardware e software. Criado por Guilherme Carvalho de Andrade (FAGUITAL). Em desenvolvimento, com pedido de patente de invenção depositado no INPI e marca concedida.

Site oficial: https://tecnofagguard.com.br/

- Criador: [Guilherme Carvalho de Andrade (FAGUITAL)](https://faguital.com.br/)
- Origem: Brasil (ideia em 2023, estudos desde 2019 e 2020)
- Parcerias e propostas comerciais: estrutura da [Imperial Volt](https://imperialvolt.com/), empresa do criador
- Informações técnicas são reservadas; informações públicas estão disponíveis neste site.
- Instagram oficial: https://www.instagram.com/tecnofagguard.com.br/
`,
  [IV]: `# Imperial Volt

> Empresa de Petrópolis (RJ), com atendimento remoto, que cria sites, sistemas web, aplicativos, automações, impressão 3D e soluções sob medida. CNPJ 60.179.279/0001-44.

Site oficial: https://imperialvolt.com/

- Fundador e dono: [Guilherme Carvalho de Andrade (FAGUITAL)](https://faguital.com.br/)
- Também do mesmo criador: [TECNOFAG GUARD](https://tecnofagguard.com.br/), ecossistema de identificação digital
- Contato: contato.imperialvolt@gmail.com
- Instagram: https://www.instagram.com/imperialvolt
`
};
for (const [raiz, txt] of Object.entries(LLMS)) fs.writeFileSync(raiz + "/llms.txt", txt);
const HUMANS = `/* EQUIPE */
Fundador: Guilherme Carvalho de Andrade (FAGUITAL)
Site: https://faguital.com.br/
Localização: Petrópolis, Rio de Janeiro, Brasil

/* ECOSSISTEMA */
Imperial Volt: https://imperialvolt.com/
TECNOFAG GUARD: https://tecnofagguard.com.br/
`;
for (const raiz of [TG, IV]) fs.writeFileSync(raiz + "/humans.txt", HUMANS);
{
  const h = FG + "/humans.txt"; let s = fs.readFileSync(h, "utf8");
  if (!s.includes("Imperial Volt")) s += "\nFundador e dono da Imperial Volt: https://imperialvolt.com/\nCriador do TECNOFAG GUARD: https://tecnofagguard.com.br/\n";
  fs.writeFileSync(h, s);
}
// sitemaps: data de hoje
for (const raiz of [FG, TG, IV]) {
  const f = raiz + "/sitemap.xml"; let s = fs.readFileSync(f, "utf8");
  if (s.includes("<lastmod>")) s = s.replace(/<lastmod>[^<]*<\/lastmod>/g, "<lastmod>2026-10-02</lastmod>");
  else s = s.replace(/(<loc>[^<]*<\/loc>)/g, "$1\n    <lastmod>2026-10-02</lastmod>");
  fs.writeFileSync(f, s);
}
console.log("identidade aplicada nos três sites");
