# Recon — manus.im

## URL
https://manus.im/

## Arquitetura
Next.js (paths `/_next/static/media/`). Single-page landing. No backend clone needed.

## Seções (top → bottom)

### 1. Announcement Bar
- Full-width strip acima do header
- Texto: "Manus is now part of Meta — bringing AI to businesses worldwide"
- Link para `/team`
- Background escuro provável, texto claro

### 2. Header / Navigation
- Layout: flexbox row, logo left, nav center, utilities right
- Logo: anchor vazio duplicado (desktop + mobile variants)
- Nav center: "Features", "Solutions", "Resources"
- Utilities right: "Events", "Business", "Pricing" + "Sign inSign up" (provavelmente dois botões adjacentes)
- Sticky no scroll
- Mobile: menu colapsável (strings duplicadas no source)

### 3. Hero / Prompt Section
- Layout: centered, single-column
- H1: "What can I do for you?"
- Abaixo: flex-wrap row de pills arredondadas:
  - "Create slides"
  - "Build website"
  - "Develop desktop apps"
  - "Design"
  - "More"
- Tipografia grande e bold
- Padding vertical generoso

### 4. Manifesto / Tagline Block
- Layout: centered, narrow container
- H2: "Less structure, more intelligence."
- Ampla whitespace acima/abaixo
- Display size grande (~32–40px)

### 5. Footer Mega-Grid
- Layout: multi-column grid, ~4–7 colunas desktop, stack mobile
- Colunas:
  - Product: Pricing, Docs, API, Team plan...
  - Resources: Docs, API...
  - Community
  - Compare
  - Download
  - Business
  - Company: Careers...
- Tipografia pequena (~14px)

### 6. Sub-Footer / Legal
- Layout: horizontal bar
- Social icons: LinkedIn, X, YouTube, Instagram, TikTok
- Language selector: "English"
- Copyright: "© 2026 Meta"
- Tagline: "Manus: Hands On AI"

## Sistema Visual (inferido)

### Typography
- Sans-serif (provavelmente Geist/Inter/System)
- H1: 48–64px bold
- H2: 32–40px
- Body/footer: 14–16px regular

### Cores
- Monochrome de alto contraste
- Fundo branco/claro
- Texto escuro (#111 ou similar)
- Accents mínimos

### Layout
- Containers centered com gutters largos
- Espaçamento vertical generoso entre seções
- Grid flexível no footer

### Interações
- Pills do hero: hover states prováveis
- Header sticky
- Mobile menu toggle
- Links de footer

## Assets Públicos
- Logo Manus (light + dark variants inferidas)
- Ícones sociais (SVG provável)
- Ícones de seta/dropdown no nav

## Responsividade
- Duplicated header strings = mobile menu
- Footer grid colapsa em mobile
- Pills hero provavelmente wrap em telas pequenas
