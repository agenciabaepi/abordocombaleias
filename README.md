# Abordo com Baleias — Landing Page

Landing page institucional e comercial da temporada de baleias para **abordocombaleias.com.br**.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **GSAP** (animações e ScrollTrigger)
- **CSS Modules** (estilos por componente)

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Estrutura

- `src/app/` — layout, página principal e estilos globais
- `src/components/` — Header, Hero, Experience, Diferenciais, Season, CTA, Footer
- `src/components/SectionReveal.tsx` — wrapper com animação de entrada via GSAP ScrollTrigger
- **Season** — bloco `.visual` preparado para futuras animações de fundo controladas por scroll

## Design

- Identidade: branco + azul **#003C88**
- Tipografia: Cormorant Garamond (títulos), Plus Jakarta Sans (corpo)
- Layout responsivo; transições e animações suaves com GSAP

## Configuração

- **Contatos**: edite `src/config/contact.ts` com e-mail e telefone reais; o CTA usa esses dados automaticamente.

## Evolução futura

- Animações de fundo mais imersivas no bloco **Season** (`.visual`, `.visualBg`)
