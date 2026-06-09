# Component Spec — Hero / Prompt Section

## Nome
Hero Prompt

## Estrutura DOM
```
section.hero-prompt
  div.container
    h1 → "What can I do for you?"
    div.pills-row
      button.pill → "Create slides"
      button.pill → "Build website"
      button.pill → "Develop desktop apps"
      button.pill → "Design"
      button.pill → "More"
```

## Layout
- Single column, centered
- Padding vertical grande: ~120–160px top, ~80px bottom
- Container max-width: ~720px para o H1, ~900px para pills

## Estilos
- H1: 48–64px, weight 700, line-height 1.1, color #111
- Pills: inline-flex, border-radius 9999px (full rounded)
  - Border: 1px solid #e5e5e5
  - Padding: ~10px 20px
  - Fonte: 14–15px, weight 500
  - Background: transparent ou #fafafa
  - Hover: background escurece levemente
- Gap entre pills: ~12px

## Interações
- Pills clicáveis (provavelmente triggeram exemplos de prompt)
- Hover state suave
