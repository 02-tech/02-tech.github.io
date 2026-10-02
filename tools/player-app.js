
// 2026-10-02: player de músicas (ouvir, trocar, baixar) com letra sincronizada e trilha ao entrar.
// Regras (revisão após teste real de Guilherme no celular):
// - "Tocando" só conta quando o áudio está de fato avançando (eventos playing/timeupdate), nunca só porque não está pausado:
//   o navegador pode ficar "não pausado" carregando ou travado, sem som.
// - A trilha tenta tocar ao abrir; e o PRIMEIRO GESTO em qualquer lugar da página (soltar o dedo, clique ou tecla)
//   sempre garante o som, mesmo que o navegador não tenha recusado de cara. Rolar a página não conta como gesto.
// - A letra sincroniza pelo tempo do áudio, em qualquer ponto da página.
(() => {
  const audio = document.getElementById("trilha");
  const botao = document.getElementById("som-botao");
  const lista = document.getElementById("playlist");
  const titulo = document.getElementById("player-titulo");
  const painel = document.getElementById("letra-viva");
  if (!audio || !lista) return;
  const itens = [...lista.querySelectorAll(".pl-item")];
  const CHAVE = "faguital-som";
  let mudo = false, atual = 0, linhas = [], ativa = -1;
  let soando = false, carregando = false, ultimoTempo = -1, gestoUsado = false;
  try { mudo = localStorage.getItem(CHAVE) === "mudo"; } catch (e) { /* sem armazenamento */ }
  audio.volume = 0.7;
  audio.preload = "auto";
  const salvar = () => { try { localStorage.setItem(CHAVE, mudo ? "mudo" : "som"); } catch (e) { /* ok */ } };

  // mini player: depois que a música começa, o botão flutuante vira uma "molécula" que abre controles rápidos
  let jaTocou = false;
  const mini = document.createElement("div");
  mini.className = "mini-player"; mini.id = "mini-player"; mini.hidden = true;
  mini.setAttribute("role", "dialog"); mini.setAttribute("aria-label", "Controles da música");
  mini.innerHTML = '<p class="mini-rotulo">TOCANDO AGORA</p><p class="mini-titulo" id="mini-titulo"></p>' +
    '<div class="mini-botoes"><button type="button" class="mini-ant" aria-label="Música anterior">⏮</button>' +
    '<button type="button" class="mini-play" aria-label="Pausar">⏸</button>' +
    '<button type="button" class="mini-prox" aria-label="Próxima música">⏭</button></div>' +
    '<a class="mini-letra" href="#player">Ver letra e todas as músicas</a>';
  document.body.appendChild(mini);
  const abrirMini = (abrir) => {
    mini.hidden = !abrir;
    if (botao) botao.setAttribute("aria-expanded", abrir ? "true" : "false");
  };
  mini.querySelector(".mini-ant").addEventListener("click", () => { gestoUsado = true; selecionar(atual - 1, true); });
  mini.querySelector(".mini-prox").addEventListener("click", () => { gestoUsado = true; selecionar(atual + 1, true); });
  mini.querySelector(".mini-play").addEventListener("click", () => { gestoUsado = true; if (soando) audio.pause(); else tocar(); });
  mini.querySelector(".mini-letra").addEventListener("click", () => abrirMini(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mini.hidden) { abrirMini(false); if (botao) botao.focus(); } });
  document.addEventListener("click", (e) => { if (!mini.hidden && !mini.contains(e.target) && !(botao && botao.contains(e.target))) abrirMini(false); });

  const atualizar = () => {
    if (soando && !jaTocou) { jaTocou = true; if (botao) botao.classList.add("molecula"); }
    if (botao) {
      botao.hidden = false;
      const rotulo = soando ? "Silenciar" : (carregando && !audio.paused ? "Carregando…" : "Ouvir");
      botao.querySelector(".som-texto").textContent = rotulo;
      botao.classList.toggle("tocando", soando);
      if (jaTocou) {
        botao.removeAttribute("aria-pressed");
        botao.setAttribute("aria-haspopup", "dialog");
        botao.setAttribute("aria-label", "Controles da música" + (titulo ? ": " + titulo.textContent : "") + (soando ? " (tocando)" : " (pausada)"));
      } else {
        botao.setAttribute("aria-pressed", soando ? "true" : "false");
        botao.setAttribute("aria-label", soando ? "Silenciar a música" : "Ouvir a música");
      }
    }
    const mt = mini.querySelector("#mini-titulo"); if (mt && titulo) mt.textContent = titulo.textContent;
    const mp = mini.querySelector(".mini-play"); mp.textContent = soando ? "⏸" : "▶"; mp.setAttribute("aria-label", soando ? "Pausar" : "Tocar");
    itens.forEach((li, i) => li.classList.toggle("tocando", i === atual && soando));
  };

  const esc = (t) => t.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
  const carregarLetra = (url) => {
    linhas = []; ativa = -1;
    if (!painel) return;
    if (!url) { painel.innerHTML = "<p class=\"letra-aviso\">Letra sincronizada em breve.</p>"; return; }
    painel.innerHTML = "<p class=\"letra-aviso\">Carregando a letra…</p>";
    fetch(url).then((r) => r.json()).then((d) => {
      linhas = d.linhas || [];
      let ultima = null;
      painel.innerHTML = linhas.map((l, i) => {
        const quebra = ultima !== null && l.estrofe !== ultima ? " nova-estrofe" : "";
        ultima = l.estrofe;
        return "<p class=\"letra-linha" + quebra + "\" data-i=\"" + i + "\">" + esc(l.texto) + "</p>";
      }).join("");
      painel.scrollTop = 0;
      sincronizar();
    }).catch(() => { painel.innerHTML = "<p class=\"letra-aviso\">Não foi possível carregar a letra.</p>"; });
  };

  const sincronizar = () => {
    if (!linhas.length || !painel) return;
    const t = audio.currentTime + 0.2;
    let i = -1;
    for (let k = 0; k < linhas.length; k++) { if (linhas[k].t <= t) i = k; else break; }
    if (i === ativa) return;
    const antiga = painel.querySelector(".letra-linha.agora");
    if (antiga) antiga.classList.remove("agora");
    ativa = i;
    if (i < 0) return;
    const el = painel.querySelector(".letra-linha[data-i=\"" + i + "\"]");
    if (!el) return;
    el.classList.add("agora");
    const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    // rola só o painel da letra, nunca a página (funciona com o visitante em qualquer ponto do site)
    painel.scrollTo({ top: el.offsetTop - painel.clientHeight / 2 + el.offsetHeight / 2, behavior: suave ? "smooth" : "auto" });
  };

  const tocar = () => {
    mudo = false; salvar(); audio.muted = false;
    carregando = true; atualizar();
    const p = audio.play();
    return p && p.catch ? p.catch(() => { carregando = false; atualizar(); }) : Promise.resolve();
  };

  const selecionar = (i, comSom) => {
    atual = (i + itens.length) % itens.length;
    const li = itens[atual];
    itens.forEach((x) => x.classList.toggle("ativa", x === li));
    if (audio.getAttribute("src") !== li.dataset.src) { soando = false; ultimoTempo = -1; audio.src = li.dataset.src; carregarLetra(li.dataset.letra); }
    if (titulo) titulo.textContent = li.dataset.titulo;
    if (comSom) tocar(); else atualizar();
  };

  itens.forEach((li, i) => li.querySelector(".pl-tocar").addEventListener("click", () => {
    gestoUsado = true;
    if (i === atual && soando) { audio.pause(); return; }
    selecionar(i, true);
  }));
  if (painel) painel.addEventListener("click", (e) => {
    const l = e.target.closest(".letra-linha");
    if (!l || !linhas[+l.dataset.i]) return;
    audio.currentTime = linhas[+l.dataset.i].t;
    if (!soando) tocar();
  });

  // estado real da reprodução
  audio.addEventListener("playing", () => { carregando = false; atualizar(); });
  audio.addEventListener("timeupdate", () => {
    if (!audio.paused && audio.currentTime !== ultimoTempo && audio.currentTime > 0) { if (!soando) { soando = true; carregando = false; atualizar(); } }
    ultimoTempo = audio.currentTime;
    sincronizar();
  });
  audio.addEventListener("waiting", () => { if (!audio.paused) { carregando = true; atualizar(); } });
  audio.addEventListener("pause", () => {
    soando = false; carregando = false;
    if (!audio.ended && !document.hidden) { mudo = true; salvar(); }
    atualizar();
  });
  audio.addEventListener("seeked", () => { ativa = -2; sincronizar(); });
  audio.addEventListener("ended", () => { soando = false; selecionar(atual + 1, true); });
  audio.addEventListener("volumechange", () => { if (audio.muted) soando = false; atualizar(); });

  // primeiro gesto em qualquer lugar garante o som (exceto se o visitante já silenciou antes)
  const gestos = ["touchend", "click", "keydown", "pointerup"];
  const tirarGestos = () => gestos.forEach((g) => document.removeEventListener(g, noGesto, true));
  function noGesto(e) {
    if (gestoUsado) return tirarGestos();
    gestoUsado = true; tirarGestos();
    if (e.target && e.target.closest && e.target.closest("#som-botao, .pl-tocar, .pl-baixar")) return; // o próprio controle decide
    if (!mudo && !soando) tocar();
  }
  gestos.forEach((g) => document.addEventListener(g, noGesto, { capture: true, passive: true }));

  if (botao) {
    // a molécula: anéis em órbita, giram só enquanto toca
    if (!botao.querySelector(".molecula-svg")) botao.insertAdjacentHTML("afterbegin",
      '<svg class="molecula-svg" viewBox="0 0 64 64" aria-hidden="true"><g class="orbitas">' +
      '<ellipse cx="32" cy="32" rx="27" ry="10"/><ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(120 32 32)"/>' +
      '<circle class="eletron e1" cx="59" cy="32" r="2.6"/><circle class="eletron e2" cx="18.5" cy="8.6" r="2.6"/><circle class="eletron e3" cx="18.5" cy="55.4" r="2.6"/></g>' +
      '<circle class="nucleo" cx="32" cy="32" r="8"/></svg>');
    botao.addEventListener("click", () => {
      gestoUsado = true; tirarGestos();
      if (jaTocou) { abrirMini(mini.hidden); return; }
      if (soando) audio.pause(); else tocar();
    });
  }

  carregarLetra(itens[0].dataset.letra);
  atualizar();
  if (!mudo) tocar();
})();
