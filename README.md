# ToonPop — bold figures, louder culture

A polished e-commerce landing page for a designer toy brand, featuring a full character collection, animated hero section, cart drawer with toast feedback, and customer reviews — built with React, TypeScript, Vite, Tailwind CSS v4, and GSAP.

---

## Features

- **Hero section** — GSAP-animated entrance with grain texture overlay
- **Marquee** — infinite scrolling brand strip
- **Collection** — four character cards (Blaze, Moss, Candy, Focus) with add-to-cart
- **Cart drawer** — slide-in panel with quantity controls and live totals
- **Toast notifications** — non-blocking feedback on cart actions
- **Reviews** — customer quote carousel
- **Join / Newsletter** — email capture with toast confirmation
- **Scroll progress bar** — fixed reading indicator at the top
- **Craft section** — brand story / product quality callout
- **Footer** — links and secondary CTAs

## Tech Stack

| Tool | Version |
|------|---------|
| React | 18 |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | 4 |
| GSAP | 3 |
| Lucide React | 0.515 |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx       # Top nav with cart icon + count
│   ├── ProgressBar.tsx  # Scroll progress indicator
│   ├── Hero.tsx         # Animated landing hero
│   ├── Marquee.tsx      # Infinite scrolling strip
│   ├── Collection.tsx   # Product cards grid
│   ├── Craft.tsx        # Brand story section
│   ├── Reviews.tsx      # Customer testimonials
│   ├── Join.tsx         # Newsletter sign-up
│   ├── Footer.tsx       # Site footer
│   ├── CartDrawer.tsx   # Slide-in cart panel
│   ├── Toast.tsx        # Notification toasts
│   └── Grain.tsx        # SVG grain texture overlay
├── data.ts              # Characters, reviews, and stats
├── App.tsx              # Root component & state
└── main.tsx             # Entry point
```
