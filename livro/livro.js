(() => {
  "use strict";

  /*
   * ATUALIZAÇÃO EDITORIAL
   * Este é o único limite manual do leitor público. Ele representa quantas
   * entradas com status "written" do arquivo-fonte entram nesta edição.
   * Ao concluir novas folhas em fonte-essencia-v1.6.html, aumente este número.
   */
  const WRITTEN_PAGE_LIMIT = 197;

  const app = document.getElementById("livro-app");
  if (!app) return;

  const stage = document.getElementById("livro-stage");
  const volume = document.getElementById("livro-volume");
  const leaf = document.getElementById("livro-folha");
  const prev = document.getElementById("livro-prev");
  const next = document.getElementById("livro-next");
  const current = document.getElementById("livro-current");
  const status = document.getElementById("livro-status");
  const full = document.getElementById("livro-fullscreen");
  const close = document.getElementById("livro-close");
  const error = document.getElementById("livro-error");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let pages = [];
  let position = 0;
  let turning = false;
  let touchStart = null;

  const INTRODUCTION = [
    { kind: "introduction", roman: "APRESENTAÇÃO", sectionTitle: "Introdução", chapter: "A Essência de FAGUITAL", num: null, text: "Meu nome é Guilherme Carvalho de Andrade. FAGUITAL é a assinatura que escolhi para o que penso, escrevo, canto e construo.\n\nEstas páginas não foram feitas para simplificar quem eu sou. Elas registram o caminho de alguém que aprendeu cedo que nem tudo se explica, se escolhe ou se controla. O que estava ao meu alcance era observar por dentro, trabalhar, insistir e construir o que ainda não existia." },
    { kind: "introduction", roman: "APRESENTAÇÃO", sectionTitle: "Por que escrevi", chapter: "A Essência de FAGUITAL", num: null, text: "Uma apresentação curta não comporta uma vida feita de trabalho, disciplina, projetos, música, relações e perguntas difíceis. Este livro comporta. Aqui estão a criança que desmontava objetos, o homem que decidiu aprender o que não dominava e a mente que não aceita resposta rasa.\n\nNo Exército Brasileiro recebi o Diploma Ao Mérito como consequência de cumprir o que devia ser feito. Sem vaidade e sem falsa modéstia: resultado exige postura, repetição e responsabilidade. Tempo e atrito mostram o caráter de cada um; o meu dever era fazer a minha parte. O restante desta história segue a mesma lógica." },
    { kind: "introduction", roman: "APRESENTAÇÃO", sectionTitle: "Como seguir", chapter: "A Essência de FAGUITAL", num: null, text: "Você vai encontrar memórias, poesias e reflexões. Não procure uma versão polida, dócil ou definitiva. Há contradições, decisões, acertos, falhas e ambições que não cabem numa frase de apresentação.\n\nLeia na ordem se quiser acompanhar a formação dessa visão. Pare onde uma ideia exigir mais tempo. O que não se resolve de uma vez pede tempo; o que depende de mim recebe trabalho. O que está aqui não pede concordância: pede atenção." }
  ];

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function extractBook(source) {
    const match = source.match(/const BOOK=(\{[\s\S]*?\});\s*const \$=/);
    if (!match) throw new Error("Estrutura BOOK não encontrada");
    return JSON.parse(match[1]);
  }

  function coverHTML() {
    return `<p class="livro-capa-topo">UMA OBRA DE FAGUITAL</p>
      <div class="livro-capa-centro"><span class="livro-selo" aria-hidden="true"></span><h3>A Essência<br>de FAGUITAL</h3><p>Histórias, poesias e reflexões</p></div>
      <div><strong>FAGUITAL</strong><small>EDIÇÃO DIGITAL · 2026</small></div>`;
  }

  function pageHTML(page) {
    const poemClass = page.kind === "poem" ? " livro-poema" : "";
    const title = page.sectionTitle ? `<h4>${escapeHTML(page.sectionTitle)}</h4>` : "";
    return `<div class="livro-pagina-topo"><span>A ESSÊNCIA DE FAGUITAL</span><span>${escapeHTML(page.roman)}</span></div>
      <div class="livro-pagina-corpo">${title}<p class="${poemClass.trim()}">${escapeHTML(page.text)}</p></div>
      <div class="livro-pagina-rodape"><span>${escapeHTML(page.chapter)}</span><b>${page.num === null ? "" : String(page.num).padStart(3, "0")}</b></div>`;
  }

  function constructionHTML() {
    return `<div class="livro-pagina-topo"><span>A ESSÊNCIA DE FAGUITAL</span><span>EM CURSO</span></div>
      <div class="livro-construcao"><span aria-hidden="true">✦</span><p>PRÓXIMA PÁGINA</p><h3>Em construção.</h3><div></div><small>O livro cresce com o tempo. Novas folhas serão acrescentadas a esta edição.</small></div>
      <div class="livro-pagina-rodape"><span>Uma obra viva</span><b>…</b></div>`;
  }

  function render() {
    const isCover = position === 0;
    const isConstruction = position === pages.length + 1;
    leaf.className = `livro-folha${isCover ? " livro-capa" : ""}${isConstruction ? " livro-folha-construcao" : ""}`;
    leaf.innerHTML = isCover ? coverHTML() : isConstruction ? constructionHTML() : pageHTML(pages[position - 1]);
    current.textContent = isCover ? "Capa" : isConstruction ? "Próxima página" : pages[position - 1].kind === "introduction" ? "Apresentação" : `Página ${pages[position - 1].num} / 369`;
    status.textContent = isCover ? "Livro fechado" : isConstruction ? "Em construção" : `${position} de ${pages.length} páginas escritas`;
    prev.disabled = isCover || turning;
    next.disabled = isConstruction || turning;
  }

  function turn(step) {
    if (turning) return;
    const target = Math.max(0, Math.min(pages.length + 1, position + step));
    if (target === position) return;
    position = target;
    if (reducedMotion.matches) {
      render();
      return;
    }
    turning = true;
    volume.classList.remove("virando-frente", "virando-volta");
    void volume.offsetWidth;
    volume.classList.add(step > 0 ? "virando-frente" : "virando-volta");
    window.setTimeout(() => {
      render();
      volume.classList.remove("virando-frente", "virando-volta");
      turning = false;
    }, 260);
  }

  function setReadingMode(active) {
    app.classList.toggle("livro-reading", active);
    document.body.classList.toggle("livro-reading-open", active);
    full.hidden = active;
    close.hidden = !active;
    if (active) close.focus();
  }

  async function openReadingMode() {
    setReadingMode(true);
    try {
      if (app.requestFullscreen) await app.requestFullscreen();
    } catch {
      // O modo fixo continua disponível quando a API de tela cheia é bloqueada.
    }
  }

  async function closeReadingMode() {
    if (document.fullscreenElement === app) {
      try { await document.exitFullscreen(); } catch { /* modo fixo será encerrado abaixo */ }
    }
    setReadingMode(false);
  }

  prev.addEventListener("click", () => turn(-1));
  next.addEventListener("click", () => turn(1));
  full.addEventListener("click", openReadingMode);
  close.addEventListener("click", closeReadingMode);
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && app.classList.contains("livro-reading")) setReadingMode(false);
  });
  document.addEventListener("keydown", (event) => {
    if (!app.classList.contains("livro-reading")) return;
    if (event.key === "Escape" && !document.fullscreenElement) closeReadingMode();
    if (event.key === "ArrowRight") turn(1);
    if (event.key === "ArrowLeft") turn(-1);
  });

  stage.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  stage.addEventListener("touchend", (event) => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= 52 && Math.abs(dx) > Math.abs(dy) * 1.6) turn(dx < 0 ? 1 : -1);
  }, { passive: true });
  stage.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });

  fetch(app.dataset.source)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((source) => {
      const book = extractBook(source);
      const writtenPages = book.pages.filter((page) => page.status === "written").slice(0, WRITTEN_PAGE_LIMIT);
      pages = [...INTRODUCTION, ...writtenPages];
      if (!pages.length) throw new Error("Nenhuma página escrita encontrada");
      next.disabled = false;
      render();
    })
    .catch(() => {
      next.disabled = true;
      error.hidden = false;
    });
})();
