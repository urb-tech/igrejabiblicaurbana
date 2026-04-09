# CLAUDE.md — Igreja Bíblica Urbana (urbana.)

Site estático da Igreja Bíblica Urbana — comunidade cristã reformada em Vila Nova de Gaia.
URL produção: https://igrejabiblicaurbana.pt

## Arquitectura

```
src/
  pages/          → 6 páginas HTML (index, quem-somos, ministerios, recursos, eventos, dar)
  css/
    tokens.css    → variáveis CSS (cores, fontes, espaços, raios)
    base.css      → reset, tipografia global, utilitários
    components.css → todos os componentes visuais
  js/
    main.js       → fetch de nav/footer, carrossel, menu móvel
  assets/
    imagens/
      banner/     → banner-01.jpg (comunidade), banner-02.jpg (culto), banner-03.jpg (criancas)
    components/
      nav.html    → navegação reutilizável (carregada via fetch)
      footer.html → rodapé reutilizável (carregado via fetch)
```

## Identidade Visual

- **Fundo:** `#0A0A0A`   **Texto:** `#FFFFFF`   **Destaque:** `#F5C800`
- **Logótipo:** `urbana.` — ponto em amarelo `#F5C800`
- **Títulos:** Georgia, serif   **Corpo:** system-ui, sans-serif

## Dados da Igreja

- **Morada:** R. Marciano de Azuaga, 90 · 4430-999 Vila Nova de Gaia
- **Culto:** Café às 9h45 · Celebração às 10h30 (domingos)
- **IBAN:** PT50 0033 0000 4581 3961 3610 5
- **NIPC:** 518 960 048   **Estatuto:** ESNL · IPSS
- **YouTube:** @IBUPorto   **Spotify show:** 2LvjqEPmOFmng0mJpvSZbi

## Ministérios

Louvor e Som · Mídia · Acolhimento · Miúdos · Mulheres · Homens · Next · Pequenos Grupos · Instituto Bíblico Urbano

## Regras de Commit Git

**Commit separado por ficheiro** — nunca agrupar múltiplos ficheiros num único commit.

```bash
# Exemplo correcto
git add src/css/tokens.css && git commit -m "chore: adicionar tokens CSS"
git add src/css/base.css   && git commit -m "chore: adicionar base CSS"
```

## Componentes via Fetch

`nav.html` e `footer.html` são injectados via `main.js`. Cada página precisa de:
```html
<div id="nav-placeholder"></div>   <!-- no topo do <body> -->
<div id="footer-placeholder"></div> <!-- no fim do <body> -->
```
A página activa é detectada por `document.body.dataset.page` e o JS aplica `aria-current="page"`.

## SEO

- Idioma: `lang="pt-PT"`
- Schema.org: `ReligiousOrganization` em cada página
- Canonical: `https://igrejabiblicaurbana.pt/`
- Open Graph + Twitter Card completos

## Regras Gerais

- Sem frameworks CSS ou JS externas (CSS e JS nativos)
- Sem TypeScript, sem build step — ficheiros estáticos servidos directamente
- Manter este CLAUDE.md abaixo de 80 linhas
