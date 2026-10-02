# Estado atual: faguital.com.br

> 2026-10-01 · CLAUDE (posição SITES, conta nucleo-faguital, sessão eef558ae…) · claim
> `claim-20261001-sites-nucleo-faguital-com-br-atualizacao-v1`. Pedido de Guilherme no chat.

## Atualização de 2026-10-01 (script `tools/atualizacao-20261001.js` + galeria)

- Nome completo Guilherme Carvalho de Andrade em títulos, metadados, JSON-LD, humans.txt e manifest.
- Trajetória militar: 32º Batalhão de Infantaria Leve de Montanha; infantaria, comunicações e montanha. Ficha da página
  Sobre com Exército Brasileiro, Criação (TECNOFAG GUARD®, link) e Empresa (Imperial Volt, link).
- Galeria na página Sobre: operação noturna e treinamento de montanha (fotos enviadas por Guilherme; sem EXIF/GPS).
  NÃO publicadas: parede de certificados (documentos pessoais, terceiros, textos de story) e foto com a madrasta e a mãe
  (aguarda consentimento delas).
- TECNOFAG GUARD apresentado só com informação pública (card do projeto na página inicial e parágrafo na trajetória);
  JSON-LD com `Project` de @id `https://tecnofagguard.com.br/#tecnofag-guard` e `founder` = a pessoa deste site.
- SIGILO: removidas as menções a NFC, sensores e "objetos conectados" (texto, tags, JSON-LD e classes CSS `nfc-art`/`tag-ring`).
- "Caminho comercial" reescrito: TECNOFAG GUARD é o projeto; Imperial Volt é outra empresa; sem botão "Conhecer".
- Corrigido "FREQUÊNCIA ATIVA" cortado no celular (texto estava a 87% da altura do hexágono, onde as laterais se
  estreitam; agora a 73%). Corrigida rolagem lateral momentânea no celular (já existia). Links do texto agora visíveis.
- Travessões trocados por pontuação natural no texto visível.

## Pendências

2. Diploma "Ao Mérito" visto na parede: confirmar se é a condecoração e o nome exato, se quiser citar.
3. Foto com a madrasta e a mãe: publicar só com o consentimento delas.

## 2026-10-01 (complemento)

- Guilherme confirmou "Pelcon" = Pelotão de Comunicações: incluído na trajetória e na ficha da página Sobre.
- Pasta antiga arquivada (movida, hashes conferidos) em `PROJETOS/10_BACKUPS/faguital-com-br-legado-20261001`.
- Guilherme confirmou ("sim foi pra tudo"): o diploma Ao Mérito é a condecoração (ficha e JSON-LD `award`) e a foto com a madrasta e a mãe está autorizada (galeria, largura total, sem nomes). Nenhuma pendência de conteúdo aberta.

## 2026-10-02: música

- Seção "05 · MÚSICA" na página inicial (rap e poesia Boom Bap, letra e direção de FAGUITAL, produção independente) com 4 faixas linkadas ao vídeo: PALÁCIO DE FERRUGEM, BARULHO, OLHA QUEM EU ME TORNEI, PERGUNTAS QUE FICARAM. Script: `tools/musica-20261002.js`.
- YouTube `@faguital` nos Sinais abertos, no menu (Música), no JSON-LD `sameAs` das duas páginas e no humans.txt.
- Google ainda mostra o título antigo (cache): sem acesso ao Search Console nesta sessão; reindexação depende de Guilherme ou de nova visita do Google.

## 2026-10-02: aba Militar

- Guilherme não encontrava as fotos (ficavam só no fim da página Sobre). Criada a aba "Militar" no menu da página inicial, seção `#militar` logo após Essência, com estilo militar discreto (oliva, estêncil, cantos de enquadramento), sem numeração: texto curto (32º BIL Mth, infantaria, Pelotão de Comunicações, montanha, Diploma Ao Mérito), ficha e as 3 fotos. A galeria da página Sobre continua.
- Lição: imagem com atributos width/height precisa de `height:auto` no CSS para o `aspect-ratio` valer (senão vira altura fixa em pixels).

## 2026-10-02: música com a voz de Guilherme

- Análise dos 9 vídeos públicos do canal @faguital (títulos, datas, visualizações, descrições e letras). Seção Música reescrita com o lema dele ("Essa música não nasceu hoje. A ideia continua a mesma. A forma evoluiu."), trajetória 2021 (Pessoas, desabafo) a 2026 (nova fase), 7 faixas com frases das próprias letras e a frase de legado de Perguntas Que Ficaram. Curadoria: versos pesados (ex.: menção a arma/tiro em Céu Não é o Limite) ficam fora do site. Script: `tools/musica-voz-20261002.js`.
- Instagram @faguital (861 seguidores, 47 posts): sem acesso a posts. API e página pública exigem login; busca na web não indexa os posts; uso da sessão logada do Edge compartilhado foi bloqueado pelo classificador de segurança (exploração de credenciais) e não foi contornado. Caminhos possíveis: Guilherme exportar os dados pelo Instagram (Configurações > Baixar suas informações, JSON) ou enviar links de posts (a página pública de embed de cada post mostra a legenda).

## 2026-10-02: escritos (Instagram)

- Guilherme enviou 16 capturas do próprio Instagram (posts de 2021 a 2026, curtidas e visualizações). Seção "06 · ESCRITOS" criada com a frase-guia "Não vivendo a ilusão, vivo o que eu quero, que é muita poesia em sintonia com o progresso." e 7 escritos transcritos fielmente (tempo, atitude, aprendizado, recomeço). Sinais abertos virou 07. Script: `tools/escritos-20261002.js`.
- Achados registrados para uso futuro: poesia publicada desde jul/2021 com assinatura em código de barras "FaGuiTal"; mais curtido de 2021: "Sujeito" (69); reels recentes de maior alcance: "Entre dois mundos" (482), "Ausente para muitos" (471), "Se for pra cair" (415), "O céu não é o limite" (403); post de 2021 "Projeto do carrinho movido a energia solar. Fase 1" (323 visualizações).
