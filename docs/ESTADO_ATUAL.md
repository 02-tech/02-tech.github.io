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

## 2026-10-02: trilha ao entrar

- O Trágico e Grandioso toca ao abrir o site; se o navegador bloquear som automático (padrão em Chrome/Safari/celular), começa no primeiro toque, clique ou tecla. Botão fixo no canto inferior direito ("Silenciar"/"Ouvir") com barras animadas; a escolha de silenciar fica salva no navegador (localStorage). Testado com política bloqueada e liberada, 0 erros.

## 2026-10-02: player completo com letra sincronizada

- Player na seção Música (substituiu o destaque): 12 faixas com áudio hospedado em `assets/audio/` (MP3 128 a 160 kbps, sem metadados extras, 48 MB), botão Baixar em cada uma, troca de faixa, avanço automático para a próxima, e O Trágico e Grandioso tocando ao entrar.
- Letra sincronizada estilo Spotify: `assets/letras/*.json` gerados por `tools/alinhar-letras.py` (faster-whisper "small" local + alinhamento global da letra oficial às palavras transcritas). 12/12 músicas com letra; 99% dos versos casados direto no áudio. O verso cantado fica em destaque, o painel rola sozinho e tocar num verso pula a música para ele.
- Correção do autoplay: o navegador só libera som após gesto completo (touchend/click/keydown/pointerup); antes o código tentava no pointerdown/touchstart, por isso não tocava no celular.
- Lista "Também no YouTube" retirada: todas as faixas do canal estão no player; o canal segue em Sinais abertos.
- Céu Não é o Limite: esta gravação começa em "Sei quem me fez cair"; os 14 primeiros versos da descrição do YouTube ficaram fora do player.
- Teste local de áudio exige servidor com Range (206): `node tools/servidor-local.js 8851` (o http.server do Python não serve trechos e impede avançar o áudio).

## 2026-10-02: identidade digital unificada

- Grafo JSON-LD único nos três sites: Person `https://faguital.com.br/#person` (Guilherme Carvalho de Andrade, FAGUITAL), Organization `https://imperialvolt.com/#organization` (founder = a pessoa, CNPJ), Project `https://tecnofagguard.com.br/#tecnofag-guard` (founder = a pessoa), MusicPlaylist com as 12 faixas, FAQPage na página Sobre com 5 perguntas visíveis. Gerador: `tools/entidade-20261002.js` (idempotente; mexe nos três repositórios).
- Títulos e descrições com termos estratégicos (prototipador, empreendedor, Petrópolis, fundador da Imperial Volt, criador do TECNOFAG GUARD, rapper e poeta); bio visível ganhou "fundador e dono da Imperial Volt" e "criador do TECNOFAG GUARD" com links.
- `llms.txt` nos três sites (leitura por IAs), `humans.txt` atualizado/criado, sitemaps com lastmod 2026-10-02.
- Pendente fora do meu alcance: Google Search Console (verificar os três domínios, enviar os sitemaps e pedir reindexação de faguital.com.br e /sobre.html).

## 2026-10-02: compartilhamento e IndexNow

- Imagem de compartilhamento `assets/img/og-faguital.png` (1200x630, tipográfica; `tools/og.html` + `tools/gerar-og.js`) nas duas páginas (og:image e twitter:card).
- IndexNow (Bing, Yandex e buscadores que usam o índice do Bing, inclusive ChatGPT/Copilot): chave `f9332cf0a33fc0f7e90bede81db78aed.txt` na raiz dos três sites; envio em 2026-10-02 respondeu 202 para faguital.com.br, tecnofagguard.com.br e imperialvolt.com. Reenviar após mudanças relevantes (POST https://api.indexnow.org/indexnow com host, key, keyLocation e urlList). O Google não usa IndexNow: para ele, só Search Console.
- Chrome atualizado (154) demora até ~9 s na primeira abertura de perfil novo: ferramentas esperam até 30 s.

## 2026-10-02: trilha ao entrar confiável

- Guilherme viu "Silenciar" sem música tocando: o estado usava "não pausado", que inclui carregando ou travado. Agora "tocando" só quando o áudio avança de fato (eventos playing/timeupdate); enquanto carrega o botão diz "Carregando…".
- O primeiro gesto em qualquer lugar da página (touchend, click, keydown, pointerup) sempre garante o som, mesmo que o navegador não tenha recusado de cara; respeita quem silenciou antes. Primeiro áudio com preload="auto".
- Testado com toque real emulado no topo da página: navegador bloqueando som (toca no 1º toque) e liberando (toca ao abrir); letra sincronizada sem rolar a página.

## 2026-10-02: molécula e navegação flutuante

- Depois que a música começa, o botão flutuante vira uma molécula (núcleo escuro tipo antimatéria, órbitas ciano girando só enquanto toca) que abre um mini player: título, anterior, tocar/pausar, próxima e atalho "Ver letra e todas as músicas". Fecha ao tocar fora ou com Esc.
- Navegação flutuante: quando o cabeçalho sai da tela, o símbolo do topo aparece no canto inferior esquerdo e abre um painel com todas as seções (Início, Essência, Quem sou, Militar, Universo, Experimentos, Música, 3·6·9, Escritos, Sinais abertos).
- Código: `tools/player-app.js`, `tools/flutuantes-app.js`, `tools/flutuantes.css`, aplicados por `tools/player-20261002.js`. Movimento reduzido desliga as animações.
- Ajustes pedidos por Guilherme (mesmo dia): molécula à direita um pouco acima do meio; navegação no canto superior esquerdo; molécula livre (7 átomos escuros ligados que se contorcem enquanto toca, parada quando pausa; laço de animação só roda tocando e com a aba visível).
- WhatsApp pessoal (24) 99275-4537 no bloco de redes, em azul-escuro neon (wa.me/5524992754537), autorizado por Guilherme.
- Só a molécula (sem o botão "Ouvir"): parada quando não toca; tocar nela inicia a música e mostra o mini painel; tocar música na lista também a faz mexer. Mini painel e painel de navegação somem sozinhos após ~5 s sem interação (no celular o hover "preso" do último toque é ignorado; foco de teclado mantém aberto).

## 2026-10-04: player com letra e lista juntas + nome da música na tela de bloqueio

- A lista de músicas rola dentro da própria caixa (rótulo "12 músicas · role a lista"); nome, controles, letra e lista cabem
  numa tela (390 e 1366). Escolher música ou troca automática no fim da faixa rola só a lista até a faixa ativa, sem mover a página.
- Media Session: tela de bloqueio/notificação mostra o nome da música (artista FAGUITAL, álbum com o nome completo) e a
  capa nítida `assets/img/capa-musica-192.png`/`-512.png` (gerada do favicon); botões anterior/próxima trocam de faixa
  (anterior volta ao início se passou de 4 s), play/pause e arrastar a barra funcionam.
- 2026-10-04 (compartilhar música por música): botão discreto ao lado do nome da música. Celular: menu de compartilhar do
  aparelho; computador: WhatsApp ou copiar link. Mensagem: verso do momento (se tocando) + "Ouça \"Música\", de FAGUITAL:" +
  link próprio `https://faguital.com.br/musica/<id>/` (páginas geradas por `tools/player-20261002.js`, `noindex`, com
  og:title/descrição da música para a prévia do WhatsApp, redirecionam para `/?musica=<id>#player`, que abre com a música escolhida).
- 2026-10-04: botão "Arquivo no GitHub" removido (pedido de Guilherme); o GitHub segue só nos dados estruturados (sameAs),
  invisível. Bloco "Caminhos" centralizado. Estilo do cartão do WhatsApp (azul neon) e grade 2x2 das redes restaurados.
- ATENÇÃO (lição): `tools/player-20261002.js` reescreve tudo em `styles.css` a partir de `/* 2026-10-02: player */`. Estilo novo
  que não seja do player vai ANTES desse marcador (o estilo do WhatsApp de 02/10 tinha ido depois e foi apagado antes de publicar).
