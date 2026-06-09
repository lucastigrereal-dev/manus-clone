# Component Spec — Footer

## Nome
Footer Mega-Grid + Sub-Footer

## Estrutura DOM
```
footer
  div.footer-grid
    div.footer-col
      h4 → Product
      ul
        li → Pricing
        li → Docs
        li → API
        li → Team plan
    div.footer-col
      h4 → Resources
      ul
        li → Docs
        li → API
        li → ...
    div.footer-col
      h4 → Community
    div.footer-col
      h4 → Compare
    div.footer-col
      h4 → Download
    div.footer-col
      h4 → Business
    div.footer-col
      h4 → Company
      ul
        li → Careers
  div.sub-footer
    div.social-icons
      a → LinkedIn
      a → X
      a → YouTube
      a → Instagram
      a → TikTok
    div.lang-selector → "English"
    div.legal
      span → "© 2026 Meta"
      span → "Manus: Hands On AI"
```

## Layout
- Footer grid: `display: grid`, `grid-template-columns: repeat(7, 1fr)` desktop, `repeat(2, 1fr)` tablet, `1fr` mobile
- Padding: ~64px vertical
- Gap entre colunas: ~24px
- Sub-footer: flex row, `justify-content: space-between`, padding ~24px 0, border-top 1px solid #e5e5e5

## Estilos
- Footer col h4: 14px, weight 600, color #111, margin-bottom ~16px
- Footer links: 14px, weight 400, color #666, hover → #111
- Social icons: ~20px, color #666
- Legal text: 13px, color #999
- Background: #fafafa ou #f5f5f5

## Mobile
- Grid colapsa para 2 colunas depois 1
- Sub-footer empilha
