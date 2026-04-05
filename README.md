<p align="center">
  <h1 align="center">Forma</h1>
  <p align="center"><em>Website quality, reproducible.</em></p>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version 1.0.0">
</p>

**Contract-first CSS design system for teams that care about taste.**

Forma gives you a complete component library, a strict semantic token contract, and a build system that refuses to compile if your theme is missing a single required token. Same components, infinite themes. One quality bar.

---

## Why Forma

Every site ends up different. Different navs, different card styles, different spacing — even when built by the same team, even when using the same framework.

The problem isn't CSS. The problem is that design decisions live in components instead of in a contract.

**Forma's answer:** one contract, one component library, infinite themes.

The key principle: **semantic tokens only.** `--text-primary`, not `--purple-500`. Themes swap the meaning, not the component. Your card doesn't know what color it is — it just knows it lives on `--surface-elevated` with `--text-primary` text. The theme decides the rest.

---

## What's Inside

- **Core:** CSS reset, 32-level spacing scale, typography system, layout primitives, 12 component categories
- **3 starter themes:** Dusk (dark/purple), Graphite (dark/mono), Ivory (light/warm) — all using OKLCH color space with semantic tokens
- **Contract validation:** your build fails if a theme is missing required tokens. Not a warning — a failure.
- **Single-file output:** `forma-dusk.css` — one `<link>`, done.

### Components

Nav · Hero · Button · Card · Form · Badge · Feature Grid · Testimonials · Pricing · FAQ · Footer · Section

Every component works identically across all themes without modification. Swap the stylesheet, everything adapts.

---

## Quick Start

### CDN (fastest)

```html
<!-- Pick your theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cryptocana/forma@main/build/forma-dusk.css">
```

Other themes:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cryptocana/forma@main/build/forma-graphite.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cryptocana/forma@main/build/forma-ivory.css">
```

### Local

```bash
git clone https://github.com/cryptocana/forma.git
```

Link the compiled CSS:

```html
<link rel="stylesheet" href="build/forma-dusk.css">
```

### Use it

```html
<nav class="nav">
  <div class="nav__logo">Brand</div>
  <button class="btn btn--primary">Action</button>
</nav>

<section class="section">
  <div class="container">
    <div class="grid grid--3">
      <div class="card">
        <h3 class="card__title">Title</h3>
        <p class="card__description">Description.</p>
      </div>
    </div>
  </div>
</section>
```

Switch themes by swapping the stylesheet. Same HTML, completely different look.

---

## Themes

### Dusk
Dark, confident, premium. Purple accent on near-black surfaces. For tech products, agencies, crypto.

### Graphite
Dark, minimal, editorial. Monochrome brutalism. Content-first. For documentation, blogs, portfolios.

### Ivory
Light, warm, literary. Cream base with amber accents. For magazines, editorial sites, personal brands.

All three themes use the OKLCH color space for perceptually uniform color decisions.

---

## TASTE.md — Design Intent as Code

Every theme ships with a `TASTE.md` file. This isn't a style guide. It's not a README. It's a document that explains **why** every design decision exists — what it's protecting, what breaks if you change it.

```markdown
# Dusk — Taste Notes

## Brand Voice
Moody. Confident. Premium without arrogance. Like walking into
a well-designed cocktail bar — dim lighting, everything intentional,
nothing screaming for attention.

## Forbidden Moves
- ❌ No neon or saturated colors outside the accent
- ❌ No white backgrounds anywhere — even overlays stay dark
- ❌ No gradient backgrounds on sections — keep surfaces flat
```

TASTE.md is machine-readable design intent. It tells AI tools, junior developers, and future-you what the guardrails are — not just the values, but the *reasons*.

**Theme TASTE files:**
- [Dusk TASTE.md](themes/dusk/TASTE.md)
- [Graphite TASTE.md](themes/graphite/TASTE.md)
- [Ivory TASTE.md](themes/ivory/TASTE.md)

---

## The Contract

At the heart of Forma is `contract.json` — the list of semantic tokens every theme **must** implement.

### Token Categories

| Category | Tokens | Purpose |
|----------|--------|---------|
| **Surfaces** | `surface-primary`, `surface-elevated`, `surface-sunken`, `surface-overlay` | Background layers |
| **Text** | `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverse` | Typography colors |
| **Borders** | `border-subtle`, `border-default`, `border-strong`, `border-focus` | Edge definition |
| **Accents** | `accent-primary`, `accent-primary-hover`, `accent-primary-active`, `accent-text` | Brand color + states |
| **States** | `state-hover`, `state-active`, `state-focus` | Interaction feedback |
| **Feedback** | `feedback-success`, `feedback-warning`, `feedback-danger`, `feedback-info` | System messages |
| **CTA** | `cta-bg`, `cta-text`, `cta-hover` | Call-to-action buttons |
| **Shadows** | `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-glow` | Elevation + depth |

**31 required tokens.** If your theme is missing even one, the build fails. Not a warning — a failure. This is how you guarantee that every theme produces a complete, functional design system.

```bash
node builder/validate.js
```

```
🔍 Validating Forma themes against contract...
✓ Contract loaded: 31 required tokens

📦 DUSK
  ✅ All 31 required tokens present

📦 GRAPHITE
  ✅ All 31 required tokens present

📦 IVORY
  ✅ All 31 required tokens present

✅ All themes validated successfully!
```

---

## Adding a Custom Theme

1. Copy an existing theme folder:

```bash
cp -r themes/dusk themes/my-theme
```

2. Edit `themes/my-theme/theme.json` — set your token values (all OKLCH):

```json
{
  "name": "My Theme",
  "tokens": {
    "surface-primary": "oklch(0.15 0.010 270)",
    "text-primary": "oklch(0.95 0.005 270)",
    "accent-primary": "oklch(0.75 0.18 200)"
  }
}
```

3. Write a `TASTE.md` explaining your design decisions.

4. Validate:

```bash
node builder/validate.js
```

5. Compile:

```bash
node builder/compile.js
```

Your theme is now at `build/forma-my-theme.css`. One file. One import. Done.

---

## Architecture

```
forma/
├── core/                  — Reset, tokens, layout, components
│   ├── reset.css         — Modern CSS reset
│   ├── tokens.css        — Non-color design tokens (spacing, type, radius, motion)
│   ├── layout.css        — Container, grid, section primitives
│   └── components.css    — All 12 component categories
├── themes/               — Color themes (semantic tokens only)
│   ├── dusk/            — theme.json + TASTE.md
│   ├── graphite/        — theme.json + TASTE.md
│   └── ivory/           — theme.json + TASTE.md
├── build/               — Compiled single-file CSS per theme
├── builder/             — validate.js + compile.js
├── previews/            — Demo HTML: all-components + landing page
└── contract.json        — The semantic token contract
```

### Rules

- ❌ No hardcoded colors in components — only semantic tokens
- ❌ No inline styles in previews
- ❌ No external CSS dependencies
- ✅ Components never change between themes — only colors change
- ✅ Same HTML works across all themes without modification
- ✅ Layout tokens live in core, not in themes

---

## Browser Support

Chrome/Edge 90+ · Firefox 88+ · Safari 15+ · iOS Safari 15+ · Chrome Android 90+

Uses modern CSS: `:has()`, CSS Grid, CSS Custom Properties, `oklch()` color space.

---

## Forma × Visiona Silva

**Forma** is the engine — the contract, the components, the build system.

**[Visiona Silva](https://visionasilva.com)** is the designer behind the taste — the one who decides what "good" looks like and encodes it into TASTE.md files, token decisions, and opinionated design systems.

Forma ships with 3 starter themes. Premium themes and custom design systems are available at [visionasilva.com](https://visionasilva.com).

---

## Philosophy

Website quality shouldn't depend on luck or individual taste. It should depend on systems.

Forma separates the concerns that matter:
- **Core** — structure, layout, components (unchanging)
- **Tokens** — non-color design values shared across all themes
- **Themes** — color decisions (swappable, contractually enforced)

The result: consistent quality across infinite visual directions. One contract. One component library. Website quality, reproducible.

---

## License

[MIT](LICENSE) — use freely in any project, commercial or personal.

---

**Built with intention.** ✨

---

## Forma v2 — Block Library & Site Manifests

**New:** Forma v2 introduces a composable block library + site.json manifests for rapid site generation.

### What's New

**Block Library** (`blocks/`)
- 10 production-ready HTML blocks: Nav, Hero, Feature Grid, Trust Bar, Testimonials, Pricing, CTA, Team, Stats, Footer
- Each block is a semantic HTML partial (no `<html>` wrapper) using Forma tokens
- Variants system: hero supports `centered` or `split` layout, feature-grid supports `2col`/`3col`/`4col`, etc.
- Built-in scroll animations: `data-animate="fade-up"` on all blocks
- Zero dependencies — pure CSS + HTML

**Site Manifest** (`site.json`)
- Machine-readable site structure in JSON
- Defines: theme, goal (lead_generation / product_sales / brand_awareness / content / portfolio), audience, traffic
- Pages are composable from blocks
- Global nav and footer configured once, shared across all pages

**Forma Judge** (`builder/judge.js`)
- Node.js validator for site.json manifests
- Enforces JSON Schema validation
- Enforces goal-based rules (e.g., `product_sales` goal requires pricing block, all goals need hero on index)
- Checks block composition and required fields
- Output: ✅ PASS / ❌ FAIL / ⚠️ WARN with final summary

```bash
node builder/judge.js examples/mra.site.json
```

### Using Blocks

Blocks are semantic HTML partials. Use them as-is or customize with your content:

```html
<!-- Import form Cloudflare R2, local dir, or copy inline -->
<link rel="stylesheet" href="build/forma-dusk.css">

<!-- Nav block (from blocks/nav.html) -->
<header class="nav-block" role="banner">
  <nav class="nav container" aria-label="Main navigation">
    <!-- nav content -->
  </nav>
</header>

<!-- Hero block (from blocks/hero.html) -->
<section class="section hero hero--centered" aria-label="Hero">
  <div class="container">
    <!-- hero content -->
  </div>
</section>
```

Each block uses only:
- Forma token variables (`--text-primary`, `--surface-elevated`, `--accent-primary`, etc.)
- Semantic HTML5 elements
- Responsive design via CSS Grid and media queries
- No external dependencies
- No inline styles or hardcoded colors

### Building a Site with Forma v2

#### 1. Create a `site.json` manifest

```json
{
  "forma_version": "2.0.0",
  "site": {
    "name": "My Company",
    "domain": "example.com"
  },
  "theme": "graphite",
  "goal": "lead_generation",
  "audience": "b2b_buyers",
  "traffic": "cold",
  "primaryCTA": {
    "text": "Get Started",
    "href": "/signup"
  },
  "globals": {
    "nav": [
      { "text": "Features", "href": "/features" },
      { "text": "Pricing", "href": "/pricing" },
      { "text": "About", "href": "/about" },
      { "text": "Contact", "href": "/contact" }
    ],
    "footer": {
      "brand_name": "My Company",
      "legal_text": "© 2026 My Company. All rights reserved."
    }
  },
  "pages": {
    "index": {
      "title": "Home",
      "blocks": [
        { "id": "nav", "logo_text": "My Co", "cta_text": "Get Started", "cta_href": "/signup" },
        { "id": "hero", "variant": "centered", "title": "...", "cta_primary_text": "...", "cta_primary_href": "..." },
        { "id": "feature-grid", "variant": "3col", "section_title": "Features", ... },
        { "id": "cta", "variant": "centered", "title": "Ready?", ... },
        { "id": "footer", "brand_name": "My Co", ... }
      ]
    }
  }
}
```

#### 2. Validate with Forma Judge

```bash
node builder/judge.js my-site.site.json
```

Validator checks:
- ✅ JSON Schema passes (forma_version, required fields, enum values)
- ✅ Goal-based rules (lead_generation needs CTA, product_sales needs pricing)
- ✅ Completeness (all goals need hero on index, nav/footer required)
- ✅ Block composition (valid block types, variants, required fields)

#### 3. Generate pages

Use the site.json to generate HTML pages. Each page composition comes from the manifest.

Example page structure for lead_generation goal:
```
index:
  - nav
  - hero (centered)
  - trust-bar (logos)
  - feature-grid (3col)
  - testimonials (2col)
  - cta (centered)
  - footer
```

### Block Reference

| Block | Variants | Use Case |
|-------|----------|----------|
| **nav** | default | Sticky top navigation |
| **hero** | centered, split | Page headline + CTA |
| **trust-bar** | default | Logo strip or social proof |
| **feature-grid** | 2col, 3col, 4col | Feature showcase |
| **testimonials** | default | Customer quotes (2col grid) |
| **pricing** | default | 3-tier pricing table |
| **cta** | centered, full-width | Call-to-action section |
| **team** | default | Team member cards |
| **stats** | default | Key metrics (3-4 items) |
| **footer** | default | Multi-column footer |

See `blocks/` directory for full HTML and variant documentation.

### Example: MRA Limited

See `examples/mra.site.json` for a complete, production-ready site manifest:
- **Goal:** lead_generation (requires CTA)
- **Theme:** graphite (dark/mono)
- **Audience:** b2b_buyers
- **Pages:** index, about, pricing, contact
- **Block composition:** fully configured with real content

Validate the example:
```bash
node builder/judge.js examples/mra.site.json
```

### Schema & Validation

**site.schema.json** (JSON Schema Draft 7)
- Defines the complete structure of site.json
- Enforces: forma_version, site metadata, theme (dusk/graphite/ivory), goal (5 options), audience, traffic, globals, pages
- Used by judge.js for schema validation
- Extensible: add new themes, goals, or page types by updating the schema

**blocks.json** (Block Registry)
- Machine-readable registry of all available blocks
- For each block: name, description, category, variants, required tokens, required/optional fields
- Used by judge.js to validate block usage and field requirements

---

## Design Philosophy: Token-First

Forma v2 extends the original v1 token-first philosophy:

1. **Semantic Tokens Only** — No hardcoded colors in blocks. Use `--text-primary`, `--accent-primary`, `--surface-elevated`
2. **Theme Independence** — Same HTML works across all themes (dusk/graphite/ivory) without modification
3. **Composable Blocks** — Assemble pages from blocks. Each block is self-contained, reusable, tested
4. **Manifest-Driven** — site.json is the single source of truth. Goals, audiences, and page structure are declarative
5. **Contractual Validation** — Judge enforces the contract. Missing required fields? Build fails. Wrong block for your goal? Judge warns you.

---
