# FORMA COFFEE — Demo QR Menu

Independent multilingual café menu demonstrator by RYBKA. **This is a fictional café and all dishes/prices are illustrative.**

## Tech

- Vite + TypeScript + vanilla DOM/CSS — no runtime frameworks
- Georgian / English / Russian language selection
- Mobile-first Warm Editorial visual system
- Four categories / 15 dishes / search / sidebar / detail dialog
- Static site suitable for GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Quality checks

```bash
npm run build
npm test
```

## Deploy to GitHub Pages

1. Connect this repository in Cloudflare Workers & Pages.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Use a free `*.pages.dev` subdomain.

No authentication, API keys or database are needed.

## Current limitations

- **v0.3.0 demonstration:** 15 generated food photographs, search by dish name only, multilingual descriptions and ingredients.
- Prices, ingredients, translations and allergen markings are **demonstration data**, not verified information from a real establishment.
- QR graphic, Cloudflare deployment and real-device Safari QA have **not** been completed.
- Static menu is edited in `src/data.ts`; an owner admin is not included.
- Google Fonts require a connection; sans-serif/system fallbacks are available.

## Ownership / reuse

Prototype developed for RYBKA; this repo is a self-contained demo. Reusable modules may be extracted into a separate internal Menu Kit after stabilization. No open-source license has been granted.

More details: [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Demo photography

The 15 food images under `public/images/` were generated for this fictional demo. They are illustrative and do not depict actual products sold by a real café.