# Evidence-Based Skin & Aging

A reference, not marketing. Sixteen pages on skin aging, skincare ingredients, devices, cosmetic procedures, and longevity — every recommendation rated by independent clinical evidence quality, not popularity, price, or marketing presence.

**[→ Live site](https://YOUR-USERNAME.github.io/evidence-based-skin-aging/)** *(update this link after your first deploy — see [Deployment](#deployment) below)*

---

## What this is

This site evaluates skincare and anti-aging interventions the way a clinical reference would: every ingredient, device, procedure, and lifestyle factor is rated on **evidence quality** (a tiered hierarchy from clinical guidelines down to marketing claims), with **effect size, safety, and cost tracked as separate, adjacent ratings** — never blended into one score. A "well-proven small effect" and an "unproven big claim" should never look the same, and on this site they don't.

A few things that came out of building it this way:

- **Daily sunscreen is the single best-evidenced intervention on the entire site** — stronger than any topical, device, or procedure — backed by a real 903-person, 4.5-year randomized controlled trial (see *Lifestyle*).
- Several heavily marketed categories (microcurrent devices, thread lifts, certain supplements) rate lower than their popularity would suggest once checked against independent literature — and a few unglamorous, inexpensive habits rate higher than premium procedures.
- Where the evidence is genuinely inconsistent (e.g., alcohol's effect on skin aging) or a field admits its own technique is understudied (e.g., PDO thread lifts), the site says so directly instead of forcing a confident verdict.

## Pages

| Page | Covers |
|---|---|
| Home | Orientation, evidence-rating philosophy, "where should I start" tool |
| The Science of Aging | Intrinsic/extrinsic aging, collagen/elastin, glycation, oxidative stress, senescence, genetics vs. lifestyle |
| Lifestyle | Sun exposure, sleep, smoking/vaping, alcohol, tattoo care |
| Exercise & Body Composition | Resistance training and skin, loose skin after weight loss, GLP-1 considerations |
| Nutrition & Supplements | Omega-3, probiotics, zinc, vitamin D, collagen peptides, creatine, copper |
| Skincare Ingredients | Retinoids, vitamin C, niacinamide, AHAs/BHAs, peptides, exosomes, and more — 17 actives reviewed |
| Device Therapy | LED/red light, RF microneedling, microcurrent, HIFU — what's independently evidenced vs. manufacturer-funded |
| Cosmetic Procedures | Botulinum toxin, fillers, PRP, thread lifts, facelifts, body contouring |
| Hyperpigmentation | Melasma, PIH, friction-related darkening, acanthosis nigricans |
| Skin Through the Decades | Practical guidance by decade, 20s through 60+ |
| Age, Genetics & Skin Type | Fitzpatrick scale (and its real limitations), pigmentation genetics, procedure selection by skin type |
| Products Guide | Curated product recommendations by category, with budget/premium pairings |
| Myths vs Facts | Direct verdicts on commonly-asked claims |
| Build Your Routine | Five tiered routines (Beginner → Premium), interactive |
| Cost vs Benefit Calculator | Every intervention ranked by evidence-to-cost ratio |
| Glossary & Evidence Key | The rating system and recurring terminology, defined once |

## How this was built

This project followed a staged process: architecture (sitemap, page specs) → evidence standards (tier hierarchy, conflict-resolution rules, the multi-axis rating system) → editorial style guide → page-by-page research and drafting, with every clinical claim traced to a real, checkable source rather than generated from memory. The full methodology documents and per-page drafts (including open editorial questions raised during drafting) are preserved in [`/docs`](./docs) for anyone who wants to see the process behind the content, not just the output.

This is **not** a substitute for medical advice. Pages discussing procedures, prescriptions, or anything with real risk carry explicit disclaimers directing readers to a licensed provider.

## Tech stack

- React 18 + Vite
- No external CSS framework — design system (color, type, spacing) is defined inline as JS constants at the top of `src/App.jsx`
- No backend, no database, no tracking — this is a static site

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Deployment

This repo is pre-configured to deploy to **GitHub Pages** automatically via GitHub Actions on every push to `main`.

### One-time setup

1. Push this repo to GitHub.
2. In your repo, go to **Settings → Pages**, and under "Build and deployment," set **Source** to **GitHub Actions**.
3. Open `vite.config.js` and confirm the `base` path matches your actual repo name:
   ```js
   base: '/your-repo-name/',
   ```
   (If you're deploying to a custom domain or a user/org root page instead of a project page, set `base: '/'` instead.)
4. Push to `main` — the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically. Check the **Actions** tab for progress.
5. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

### Manual deploy (alternative)

If you'd rather not use GitHub Actions:

```bash
npm install
npm run deploy
```

This uses the `gh-pages` package (already in `devDependencies`) to build and push the `dist/` folder to a `gh-pages` branch directly.

### Deploying elsewhere (Vercel, Netlify, Cloudflare Pages)

This is a standard Vite app — any static host will work. Build command: `npm run build`. Output directory: `dist`. If deploying to a platform that serves from the domain root (most of them), change `base: '/evidence-based-skin-aging/'` to `base: '/'` in `vite.config.js` first.

## Content maintenance

A few pages are explicitly flagged in their own content as needing more frequent revisiting than the rest of the site:

- **Products Guide** — specific product prices and formulations change; treat listed prices as directional, not exact.
- **Cost vs Benefit Calculator** — cost bands should be re-checked periodically against Products Guide.

Every other page is built from peer-reviewed literature and is more durable, but evidence in this field evolves — pages are written to be revisited, not treated as permanently settled.

## License

Content and code in this repository are provided for educational purposes. See [`LICENSE`](./LICENSE) for terms.
