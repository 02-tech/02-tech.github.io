const canvas = document.querySelector('#signal-field');
const context = canvas?.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && context) {
  let points = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(55, Math.max(24, Math.floor(width / 24)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      radius: Math.random() * 1.2 + 0.4
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    for (const point of points) {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;
      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(60, 242, 228, .55)';
      context.fill();
    }

    for (let a = 0; a < points.length; a += 1) {
      for (let b = a + 1; b < points.length; b += 1) {
        const dx = points[a].x - points[b].x;
        const dy = points[a].y - points[b].y;
        const distance = Math.hypot(dx, dy);
        if (distance < 120) {
          context.beginPath();
          context.moveTo(points[a].x, points[a].y);
          context.lineTo(points[b].x, points[b].y);
          context.strokeStyle = `rgba(60, 242, 228, ${0.08 * (1 - distance / 120)})`;
          context.stroke();
        }
      }
    }
    frame = window.requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (!reduceMotion) draw();
  else draw(), window.cancelAnimationFrame(frame);
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

const closeMenu = () => {
  navigation?.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
};

menuButton?.addEventListener('click', () => {
  const open = !navigation?.classList.contains('open');
  navigation?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => event.key === 'Escape' && closeMenu());

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

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

  // molécula: único controle flutuante. Tocar nela inicia a música e mostra o mini painel, que some sozinho
  // depois de alguns segundos sem interação (para não deixar coisa na tela).
  const jaTocou = true;
  if (botao) botao.classList.add("molecula");
  let timerMini = 0;
  const SUMIR_MS = 4500;
  const temMouse = matchMedia("(hover: hover) and (pointer: fine)").matches; // no celular o hover fica "preso" no último toque
  const mini = document.createElement("div");
  mini.className = "mini-player"; mini.id = "mini-player"; mini.hidden = true;
  mini.setAttribute("role", "dialog"); mini.setAttribute("aria-label", "Controles da música");
  mini.innerHTML = '<p class="mini-rotulo">TOCANDO AGORA</p><p class="mini-titulo" id="mini-titulo"></p>' +
    '<div class="mini-botoes"><button type="button" class="mini-ant" aria-label="Música anterior">⏮</button>' +
    '<button type="button" class="mini-play" aria-label="Pausar">⏸</button>' +
    '<button type="button" class="mini-prox" aria-label="Próxima música">⏭</button></div>' +
    '<a class="mini-letra" href="#player">Ver letra e todas as músicas</a>';
  document.body.appendChild(mini);
  const agendarSumir = () => {
    clearTimeout(timerMini);
    if (mini.hidden) return;
    timerMini = setTimeout(() => {
      // mouse em cima ou teclado lá dentro conta como "mexendo": espera mais um pouco
      if ((temMouse && mini.matches(":hover")) || mini.querySelector(":focus-visible")) return agendarSumir();
      abrirMini(false);
    }, SUMIR_MS);
  };
  const abrirMini = (abrir) => {
    mini.hidden = !abrir;
    if (botao) botao.setAttribute("aria-expanded", abrir ? "true" : "false");
    if (abrir) agendarSumir(); else clearTimeout(timerMini);
  };
  ["pointerdown", "pointermove", "keydown", "focusin", "wheel", "touchstart"].forEach((g) => mini.addEventListener(g, agendarSumir, { passive: true }));
  mini.querySelector(".mini-ant").addEventListener("click", () => { gestoUsado = true; selecionar(atual - 1, true); });
  mini.querySelector(".mini-prox").addEventListener("click", () => { gestoUsado = true; selecionar(atual + 1, true); });
  mini.querySelector(".mini-play").addEventListener("click", () => { gestoUsado = true; if (soando) audio.pause(); else tocar(); });
  mini.querySelector(".mini-letra").addEventListener("click", () => abrirMini(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mini.hidden) { abrirMini(false); if (botao) botao.focus(); } });
  document.addEventListener("click", (e) => { if (!mini.hidden && !mini.contains(e.target) && !(botao && botao.contains(e.target))) abrirMini(false); });

  const atualizar = () => {
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

  // faixa atual visível dentro da lista (rola só a lista, nunca a página)
  const mostrarNaLista = (li) => {
    if (lista.scrollHeight <= lista.clientHeight + 2) return;
    const alvo = li.offsetTop - lista.clientHeight / 3; // .playlist é position: relative
    lista.scrollTo({ top: Math.max(0, alvo), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  // tela de bloqueio e notificação: nome da música (não o título do site), artista e capa
  const atualizarMidia = (li) => {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: li.dataset.titulo,
      artist: "FAGUITAL",
      album: "Guilherme Carvalho de Andrade",
      artwork: [
        { src: "assets/img/capa-musica-192.png", sizes: "192x192", type: "image/png" },
        { src: "assets/img/capa-musica-512.png", sizes: "512x512", type: "image/png" }
      ]
    });
  };

  const selecionar = (i, comSom) => {
    atual = (i + itens.length) % itens.length;
    const li = itens[atual];
    itens.forEach((x) => x.classList.toggle("ativa", x === li));
    if (audio.getAttribute("src") !== li.dataset.src) { soando = false; ultimoTempo = -1; audio.src = li.dataset.src; carregarLetra(li.dataset.letra); }
    if (titulo) titulo.textContent = li.dataset.titulo;
    atualizarMidia(li);
    mostrarNaLista(li);
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
    // a molécula: átomos escuros ligados, sem formato fixo; enquanto toca, cada átomo se move no seu ritmo
    // (a forma se contorce); parada quando a música para. O laço só roda tocando e com a aba visível.
    if (!botao.querySelector(".molecula-svg")) {
      const ATOMOS = [ // x, y, raio, amplitude, velocidade, fase
        [40, 40, 8.5, 2.2, 0.9, 0], [22, 30, 6, 4.5, 1.3, 1.1], [58, 26, 5.5, 4.8, 1.1, 2.3],
        [26, 58, 5, 5, 1.5, 3.4], [60, 56, 6.5, 4, 1.2, 4.6], [41, 14, 4, 5.5, 1.7, 5.2], [12, 46, 3.6, 5.5, 1.9, 0.6]];
      const LIGACOES = [[0, 1], [0, 2], [0, 3], [0, 4], [2, 5], [1, 6], [3, 6], [4, 2]];
      let svg = '<svg class="molecula-svg" viewBox="0 0 80 72" aria-hidden="true"><defs><radialGradient id="mol-atomo" cx="38%" cy="32%" r="70%">' +
        '<stop offset="0" stop-color="#2a2340"/><stop offset=".55" stop-color="#07060c"/><stop offset="1" stop-color="#000"/></radialGradient></defs><g class="ligacoes">';
      LIGACOES.forEach(() => { svg += '<line/>'; });
      svg += '</g><g class="atomos">';
      ATOMOS.forEach(([x, y, r]) => { svg += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#mol-atomo)"/>'; });
      botao.insertAdjacentHTML("afterbegin", svg + "</g></svg>");
      const circ = [...botao.querySelectorAll(".atomos circle")], lin = [...botao.querySelectorAll(".ligacoes line")];
      const desenhar = (t) => {
        const pos = ATOMOS.map(([x, y, r, a, v, f]) => [
          x + Math.sin(t * v + f) * a + Math.sin(t * v * 0.37 + f * 2) * a * 0.5,
          y + Math.cos(t * v * 0.83 + f) * a + Math.sin(t * v * 0.51 + f) * a * 0.4,
          r * (1 + Math.sin(t * v * 1.7 + f) * 0.12)]);
        pos.forEach(([x, y, r], i) => { circ[i].setAttribute("cx", x.toFixed(2)); circ[i].setAttribute("cy", y.toFixed(2)); circ[i].setAttribute("r", r.toFixed(2)); });
        LIGACOES.forEach(([a, b], i) => { lin[i].setAttribute("x1", pos[a][0].toFixed(2)); lin[i].setAttribute("y1", pos[a][1].toFixed(2)); lin[i].setAttribute("x2", pos[b][0].toFixed(2)); lin[i].setAttribute("y2", pos[b][1].toFixed(2)); });
      };
      const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let quadro = 0, t0 = performance.now(), tAcum = 0;
      const laco = (agora) => {
        quadro = 0;
        if (!soando || document.hidden || reduz) return;
        tAcum += Math.min(agora - t0, 50) / 1000; t0 = agora;
        desenhar(tAcum);
        quadro = requestAnimationFrame(laco);
      };
      const animar = () => { if (!quadro && soando && !reduz && !document.hidden) { t0 = performance.now(); quadro = requestAnimationFrame(laco); } };
      desenhar(0);
      audio.addEventListener("timeupdate", animar);
      audio.addEventListener("playing", animar);
      document.addEventListener("visibilitychange", animar);
    }
    botao.addEventListener("click", () => {
      gestoUsado = true; tirarGestos();
      if (!soando && !carregando) tocar();
      abrirMini(true);
    });
  }

  carregarLetra(itens[0].dataset.letra);
  atualizarMidia(itens[0]);
  // botões da tela de bloqueio/notificação: anterior e próxima trocam de faixa
  if ("mediaSession" in navigator) {
    const acao = (nome, fn) => { try { navigator.mediaSession.setActionHandler(nome, fn); } catch (e) { /* ação não suportada */ } };
    acao("play", () => { gestoUsado = true; tocar(); });
    acao("pause", () => audio.pause());
    acao("previoustrack", () => { gestoUsado = true; if (audio.currentTime > 4) audio.currentTime = 0; else selecionar(atual - 1, true); });
    acao("nexttrack", () => { gestoUsado = true; selecionar(atual + 1, true); });
    acao("seekto", (d) => { if (d && typeof d.seekTime === "number") audio.currentTime = d.seekTime; });
  }
  atualizar();
  if (!mudo) tocar();
})();

// 2026-10-02: navegação flutuante. Ao rolar a página, o símbolo do topo vai para a lateral;
// tocar nele abre um painel rápido com as seções, de qualquer ponto do site.
(() => {
  const marca = document.querySelector(".site-header .brand-mark");
  const nav = document.getElementById("main-nav");
  if (!marca || !nav) return;
  const orbe = document.createElement("button");
  orbe.type = "button"; orbe.className = "nav-orbe"; orbe.hidden = true;
  orbe.setAttribute("aria-label", "Abrir navegação rápida"); orbe.setAttribute("aria-haspopup", "dialog"); orbe.setAttribute("aria-expanded", "false");
  orbe.innerHTML = '<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>';
  const painel = document.createElement("div");
  painel.className = "nav-painel"; painel.id = "nav-painel"; painel.hidden = true;
  painel.setAttribute("role", "dialog"); painel.setAttribute("aria-label", "Navegação rápida");
  const extras = [["#inicio", "Início"]];
  const daNav = [...nav.querySelectorAll("a")].map((a) => [a.getAttribute("href"), a.textContent.trim()]);
  const mais = [["#escritos", "Escritos"], ["#contato", "Sinais abertos"]].filter(([h]) => document.querySelector(h) && !daNav.some(([x]) => x === h));
  painel.innerHTML = '<p class="nav-painel-rotulo">FAGUITAL · NAVEGAR</p><ul>' +
    [...extras, ...daNav, ...mais].map(([h, t]) => '<li><a href="' + h + '">' + t + "</a></li>").join("") + "</ul>";
  document.body.append(orbe, painel);

  // some sozinho depois de alguns segundos sem interação, como o mini painel da música
  let timer = 0;
  const agendar = () => {
    clearTimeout(timer);
    if (painel.hidden) return;
    timer = setTimeout(() => { if (matchMedia("(hover: hover) and (pointer: fine)").matches && painel.matches(":hover")) return agendar(); abrir(false); }, 5000);
  };
  const abrir = (sim) => { painel.hidden = !sim; orbe.setAttribute("aria-expanded", sim ? "true" : "false"); if (sim) agendar(); else clearTimeout(timer); };
  ["pointerdown", "pointermove", "keydown", "focusin", "wheel", "touchstart", "scroll"].forEach((ev) => painel.addEventListener(ev, agendar, { passive: true }));
  orbe.addEventListener("click", () => abrir(painel.hidden));
  painel.addEventListener("click", (e) => { if (e.target.closest("a")) abrir(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !painel.hidden) { abrir(false); orbe.focus(); } });
  document.addEventListener("click", (e) => { if (!painel.hidden && !painel.contains(e.target) && !orbe.contains(e.target)) abrir(false); });

  // aparece quando o cabeçalho sai da tela (sem custo de CPU ao rolar)
  const cab = document.querySelector(".site-header");
  new IntersectionObserver(([e]) => {
    const fora = !e.isIntersecting;
    orbe.hidden = !fora;
    orbe.classList.toggle("visivel", fora);
    if (!fora) abrir(false);
  }).observe(cab);
})();
