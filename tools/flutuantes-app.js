
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

  const abrir = (sim) => { painel.hidden = !sim; orbe.setAttribute("aria-expanded", sim ? "true" : "false"); if (sim) { const a = painel.querySelector("a"); if (a) a.focus(); } };
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
