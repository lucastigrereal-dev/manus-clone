# Component Spec — Header

## Nome
Header / Navigation

## Estrutura DOM
```
header[sticky]
  div.announcement-bar
    a → "Manus is now part of Meta — bringing AI to businesses worldwide"
  nav.header-nav
    div.nav-left
      a.logo (×2: desktop + mobile)
    div.nav-center
      ul.nav-links
        li → Features
        li → Solutions
        li → Resources
    div.nav-right
      a → Events
      a → Business
      a → Pricing
      div.auth
        a → Sign in
        a → Sign up
```

## Layout
- Flexbox row, `justify-content: space-between`, `align-items: center`
- Altura ~64–72px
- Padding horizontal ~24–48px
- `position: sticky`, `top: 0`, `z-index: 50`
- Background: branco/opaco com possível blur/backdrop

## Estilos
- Logo: largura ~100–120px
- Nav center: gap ~32px entre links
- Nav right: gap ~16–24px
- Auth: "Sign in" texto + "Sign up" botão outline ou filled
- Tipografia nav: 14–15px medium, cor escura
- Announcement bar: fundo escuro (~#0a0a0a), texto branco/cinza claro, altura ~40px, fonte 13–14px

## Mobile
- Nav center e right colapsam em menu hamburger
- Logo permanece visível
- Menu drawer slide from right
