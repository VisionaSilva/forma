# Forma Agent Protocol

> Rules for AI agents building websites with Forma.

## Core Principle

**Agents declare intent. Forma enforces execution.**

Agents never write HTML, CSS, or markup directly. They write a `site.json` manifest describing what they want. The compiler handles the rest.

---

## What Agents Can Do

1. **Write a manifest** — Create or modify `site.json` with pages, blocks, content, theme selection
2. **Select blocks** — Choose from the block library by `id`
3. **Set block props** — Configure each block with title, description, items, etc.
4. **Choose a theme** — Set the `theme` field to any available theme name
5. **Set site-level config** — Goal, audience, traffic type, primary CTA
6. **Run the compiler** — `node compile.site.js site.json dist/`
7. **Run the judge** — `node judge.js site.json` to validate before shipping

## What Agents Cannot Do

1. **Write raw HTML** — All markup comes from the block library
2. **Add inline styles** — All styling comes from theme tokens
3. **Invent class names** — All classes are predefined in blocks
4. **Modify block templates** — Blocks are immutable; agents configure, not edit
5. **Skip validation** — Every build must pass the Forma Judge
6. **Use hardcoded values** — No hex colors, no px values, no font names
7. **Override the token contract** — 31 tokens are required per theme, no exceptions

---

## Manifest Structure

```json
{
  "forma_version": "2.0.0",
  "site": {
    "name": "Site Name",
    "domain": "example.com",
    "description": "SEO description"
  },
  "theme": "bone-and-ink",
  "goal": "lead_generation",
  "audience": "b2b_buyers",
  "traffic": "cold",
  "primaryCTA": {
    "text": "Get Started",
    "href": "/contact"
  },
  "globals": {
    "nav": [
      { "text": "Page", "href": "/page" }
    ]
  },
  "pages": {
    "index": {
      "title": "Page Title",
      "description": "Meta description for SEO",
      "blocks": [
        { "id": "nav" },
        { "id": "hero", "title": "...", "subtitle": "..." },
        { "id": "feature-grid", "variant": "3col", "..." : "..." },
        { "id": "footer" }
      ]
    }
  }
}
```

---

## Block Library (32 blocks)

### Layout & Navigation
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `nav` | Site navigation | `cta_text`, `cta_href` |
| `footer` | Site footer | `brand_name`, `legal_text` |
| `banner` | Top announcement bar | `text`, `link_text`, `link_href` |
| `divider` | Section break | `label` |

### Hero & Introduction
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `hero` | Page hero section | `eyebrow`, `title`, `subtitle`, `cta_primary_text`, `cta_primary_href`, `cta_secondary_text`, `cta_secondary_href`, `variant` |
| `founder-note` | Personal letter | `eyebrow`, `paragraphs[]`, `name`, `role` |

### Features & Product
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `feature-grid` | 3 or 6 feature cards | `section_eyebrow`, `section_title`, `feature_N_title`, `feature_N_description`, `icon_N` |
| `feature-spotlight` | Alternating image/text | `eyebrow`, `title`, `spotlights[]` with `heading`, `description` |
| `bento-grid` | Asymmetric content grid | `eyebrow`, `title`, cards with `title`, `desc`, `stat` |
| `system-diagram` | Architecture flow | `eyebrow`, `title`, `nodes[]`, `details[]` |

### Trust & Proof
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `trust-bar` | Compact credential strip | `label`, `items[]` with `name`, `icon` |
| `logo-wall` | Partner/client logos | `eyebrow`, `title`, `partners[]` |
| `testimonials` | Customer quotes | `section_eyebrow`, `section_title`, `testimonial_N_quote/name/role` |
| `case-study` | Results with metrics | `company`, `industry`, `metrics[]`, `quote`, `before`, `after` |
| `stats` | Number highlights | `stat_N_number`, `stat_N_suffix`, `stat_N_label` |

### Conversion & Decision
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `cta` | Call to action section | `eyebrow`, `title`, `subtitle`, `cta_primary_text`, `cta_primary_href` |
| `conversion-panel` | Aggressive single CTA | `title`, `bullets[]`, `cta_text`, `cta_href` |
| `comparison` | Us vs them table | `title`, `columns[]`, `rows[]` |
| `problem-solution` | Pain vs resolution | `problems[]`, `solutions[]` |
| `faq` | Accordion Q&A | `eyebrow`, `title`, `questions[]` with `q`, `a` |
| `guarantee` | Risk reversal | `title`, `statement`, `details` |
| `pricing` | Pricing tiers | `tiers[]` with `name`, `price`, `features[]` |

### Process & Education
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `process` | Timeline steps | `eyebrow`, `title`, `steps[]` with `title`, `desc` |
| `pipeline` | Horizontal flow | `steps[]` with `number`, `label`, `desc` |

### Forms & Capture
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `contact-form` | Contact form | `eyebrow`, `title`, `fields[]` |
| `lead-magnet` | Email capture | `eyebrow`, `title`, `subtitle`, `cta_text` |

### Content & Media
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `video-embed` | Video with caption | `eyebrow`, `title`, `video_url`, `caption` |
| `before-after` | Code comparison | `before_code`, `after_code` |
| `code-preview` | Manifest showcase | `eyebrow`, `title`, `code` |
| `changelog` | Update timeline | `entries[]` with `date`, `version`, `title`, `desc`, `tag` |

### Team & People
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `team` | Team member grid | `members[]` with `name`, `role`, `bio` |

### Integrations
| Block | Purpose | Key Props |
|-------|---------|-----------|
| `integrations` | Compatible tools | `eyebrow`, `title`, `tools[]` with `name`, `desc` |

---

## Multi-Agent Workflow

```
Agent 1 (Builder)     → Writes site.json manifest
Agent 2 (Designer)    → Selects theme, reviews TASTE.md
Agent 3 (QA)          → Runs Forma Judge, validates output
Agent 4 (Deployer)    → Compiles and deploys static HTML
```

### Coordination Rules

1. **All agents read from the same manifest** — No side channels, no shared context needed
2. **Builder owns the manifest** — Only one agent writes to site.json at a time
3. **Designer picks the theme** — Reads TASTE.md to understand design intent before selecting
4. **QA validates, never fixes** — If Judge fails, QA reports back; Builder fixes
5. **Deployer is read-only** — Compiles and deploys, never modifies the manifest

---

## Goal-Based Validation

The Forma Judge validates not just structure, but intent.

| Goal | Required Blocks | Rules |
|------|-----------------|-------|
| `lead_generation` | hero, cta, contact-form or lead-magnet | Must have at least 2 CTAs, must include trust element |
| `product_launch` | hero, feature-grid, pricing, cta | Must include comparison or before-after |
| `brand_awareness` | hero, feature-grid, testimonials | Must include trust-bar or logo-wall |
| `information` | hero, feature-grid | Must include process or faq |
| `portfolio` | hero, feature-grid, case-study | Must include testimonials or stats |

---

## Token Contract

Every theme must define exactly 31 semantic tokens:

### Colors (12)
`--text-primary`, `--text-secondary`, `--text-muted`, `--surface-primary`, `--surface-secondary`, `--accent-primary`, `--border-default`, `--border-subtle`, `--cta-bg`, `--cta-text`, `--cta-hover-bg`, `--cta-hover-text`

### Typography (6)
`--font-sans`, `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`

### Spacing (8)
`--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8`, `--space-10`, `--space-12`, `--space-16`, `--space-20`

### Shape (3)
`--radius-sm`, `--radius-md`, `--radius-lg`

### Effects (2)
`--shadow-glow`, `--shadow-lg`

Missing any token = build failure. No exceptions.

---

## Available Themes

| Theme | Vibe | Best For |
|-------|------|----------|
| `bone-and-ink` | Swiss minimal, light, typographic | Design tools, agencies, portfolios |
| `dusk` | Dark warm, sophisticated | SaaS, AI products, premium brands |
| `graphite` | Dark cool, editorial | B2B, enterprise, technical products |
| `ivory` | Light clean, professional | Consulting, services, corporate |
| `terminal-green` | Hacker aesthetic, green-on-black | Dev tools, CLI products, crypto |

---

## Quick Start for Agents

```bash
# 1. Clone
git clone https://github.com/VisionaSilva/forma.git
cd forma

# 2. Write your manifest
# Edit examples/demo.site.json or create a new one

# 3. Compile
node builder/compile.js              # Build theme CSS
node builder/compile.site.js site.json dist/   # Compile pages

# 4. Validate
node builder/judge.js site.json      # Run the judge

# 5. Deploy
# Output is static HTML — deploy anywhere
```

---

## Rules Summary

1. Agents declare intent via `site.json` — never write markup
2. 32 blocks cover 90%+ of marketing sites
3. 5 themes with full token contracts
4. Forma Judge validates structure AND intent
5. Multi-agent coordination through manifest — no shared context needed
6. Missing tokens = build failure
7. Missing required blocks (per goal) = judge failure
8. Every block is responsive, accessible, and theme-agnostic

**Forma is the constraint layer that makes agent-built websites deterministic, consistent, and professional.**
