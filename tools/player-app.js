
// 2026-10-02: player de músicas (ouvir, trocar, baixar) com letra sincronizada e trilha ao entrar.
// O navegador só libera som após um gesto completo (soltar o dedo, clique ou tecla); rolar a página não conta.
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
  try { mudo = localStorage.getItem(CHAVE) === "mudo"; } catch (e) { /* sem armazenamento */ }
  audio.volume = 0.6;
  const salvar = () => { try { localStorage.setItem(CHAVE, mudo ? "mudo" : "som"); } catch (e) { /* ok */ } };
  const tocando = () => !audio.paused && !audio.muted;

  const atualizar = () => {
    if (botao) {
      botao.hidden = false;
      botao.setAttribute("aria-pressed", tocando() ? "true" : "false");
      botao.querySelector(".som-texto").textContent = tocando() ? "Silenciar" : "Ouvir";
      botao.setAttribute("aria-label", tocando() ? "Silenciar a música" : "Ouvir a música");
      botao.classList.toggle("tocando", tocando());
    }
    itens.forEach((li, i) => li.classList.toggle("tocando", i === atual && tocando()));
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
    painel.scrollTo({ top: el.offsetTop - painel.clientHeight / 2 + el.offsetHeight / 2, behavior: suave ? "smooth" : "auto" });
  };

  const selecionar = (i, tocar) => {
    atual = (i + itens.length) % itens.length;
    const li = itens[atual];
    itens.forEach((x) => x.classList.toggle("ativa", x === li));
    if (audio.getAttribute("src") !== li.dataset.src) { audio.src = li.dataset.src; carregarLetra(li.dataset.letra); }
    if (titulo) titulo.textContent = li.dataset.titulo;
    if (tocar) { mudo = false; salvar(); audio.muted = false; audio.play().catch(() => {}); }
    atualizar();
  };

  itens.forEach((li, i) => li.querySelector(".pl-tocar").addEventListener("click", () => {
    if (i === atual && tocando()) { audio.pause(); return; }
    selecionar(i, true);
  }));
  if (painel) painel.addEventListener("click", (e) => {
    const l = e.target.closest(".letra-linha");
    if (!l || !linhas[+l.dataset.i]) return;
    audio.currentTime = linhas[+l.dataset.i].t;
    if (audio.paused) audio.play().catch(() => {});
  });
  audio.addEventListener("timeupdate", sincronizar);
  audio.addEventListener("seeked", () => { ativa = -2; sincronizar(); });
  audio.addEventListener("ended", () => selecionar(atual + 1, true));
  audio.addEventListener("play", () => { mudo = false; salvar(); atualizar(); });
  audio.addEventListener("pause", () => { if (!audio.ended && !document.hidden) { mudo = true; salvar(); } atualizar(); });
  audio.addEventListener("volumechange", atualizar);

  // trilha ao entrar: tenta já; se o navegador bloquear, toca no primeiro gesto completo
  const gestos = ["click", "touchend", "keydown", "pointerup"];
  const tirarGestos = () => gestos.forEach((g) => document.removeEventListener(g, noGesto, true));
  function noGesto(e) {
    tirarGestos();
    if (e.target && e.target.closest && e.target.closest("#som-botao, #player")) return;
    if (!mudo && audio.paused) audio.play().catch(() => {});
  }
  if (botao) botao.addEventListener("click", () => {
    tirarGestos();
    if (tocando()) audio.pause(); else { audio.muted = false; audio.play().catch(() => {}); }
  });

  carregarLetra(itens[0].dataset.letra);
  atualizar();
  if (!mudo) audio.play().then(atualizar, () => gestos.forEach((g) => document.addEventListener(g, noGesto, { capture: true, passive: true })));
})();
