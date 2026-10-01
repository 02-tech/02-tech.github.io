# RUNBOOK: faguital.com.br

- Publicação: `git push origin main` em `02-tech/02-tech.github.io` (GitHub Pages, ~1 min). `_config.yml` exclui
  `tools/`, `docs/`, `CLAUDE.md`, `README.md` do site publicado.
- Testar: `python -m http.server 8850 --bind 127.0.0.1` e `node tools/testar-site.js http://127.0.0.1:8850/ .capturas`
  (larguras 360 a 1920 nas duas páginas, erros, texto do hexágono dentro da área útil, links TECNOFAG GUARD/Imperial Volt).
  O script encerra a árvore inteira do Chrome com `taskkill /T` (no Windows, `ch.kill()` deixa o navegador órfão).
- Fotos novas: converter para WebP (largura até 900 px, qualidade ~80) com Pillow, sem metadados, em `assets/img/`.
- Rollback: `git revert <commit>` e push.
