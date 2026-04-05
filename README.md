# Forma

**A contract-first website system that compiles structured manifests into taste-safe, theme-safe, static sites.**

32 blocks. 5 themes. 31 semantic tokens. One manifest. Zero hallucinated markup.

[Live Demo →](https://forma-demo.fly.dev)

---

## The Problem

AI agents generate broken websites:
- **Hallucinated CSS** — agents invent class names that don't exist in any stylesheet
- **Design drift** — page 1 uses 16px text, page 3 uses 14px, nothing matches
- **Context collapse** — two agents on the same site lose each other's decisions

The fix isn't better prompts. It's better structure.

---

## Four Pillars

### 1. Token Contract

31 semantic tokens define every theme. Miss one and the build breaks.

Colors, typography, spacing, shape, effects — all enforced at build time. No hardcoded hex. No magic numbers. No drift. Every block references tokens, never raw values.

### 2. Block Library — 32 Blocks

Every block is token-based, responsive, and works across all 5 themes automatically.

**Conversion & Decision:**
comparison, conversion-panel, problem-solution, faq, guarantee, pricing, cta

**Trust & Proof:**
trust-bar, logo-wall, testimonials, case-study, stats

**Features & Product:**
feature-grid, feature-spotlight, bento-grid, system-diagram

**Process & Education:**
process, pipeline

**Forms & Capture:**
contact-form, lead-magnet

**Content & Media:**
video-embed, before-after, code-preview, changelog, founder-note

**Layout & Utility:**
nav, hero, footer, banner, divider, team, integrations

### 3. Site Manifest (`site.json`)

All build decisions in one file. Pages, blocks, content, theme, goal, audience. Multiple agents coordinate without shared context — everyone reads the same source of truth.

```json
{
  "theme": "bone-and-ink",
  "goal": "lead_generation",
  "pages": {
    "index": {
      "blocks": [
        { "id": "hero", "title": "Stop generating HTML." },
        { "id": "problem-solution" },
        { "id": "comparison" },
        { "id": "faq" },
        { "id": "conversion-panel", "title": "Ready?", "cta_text": "Get Started" }
      ]
    }
  }
}
```

### 4. Forma Judge (Compiler + Validator)

The compiler reads the manifest, pulls blocks, injects content, applies theme tokens, outputs static HTML. One command.

The judge validates structure AND intent:

- **Lead generation** → must have CTA + contact form + trust element
- **Product launch** → must have features + pricing + comparison
- **Brand awareness** → must have testimonials + trust bar

Missing required blocks for your stated goal = build failure.

```bash
node builder/compile.site.js site.json dist/    # Compile
node builder/judge.js site.json                  # Validate
```

---

## Quick Start

```bash
git clone https://github.com/VisionaSilva/forma.git
cd forma

# Build theme CSS
node builder/compile.js

# Compile the demo site
node builder/compile.site.js examples/demo.site.json dist/demo

# Open dist/demo/index.html
```

---

## 5 Themes

| Theme | Vibe | Best For |
|-------|------|----------|
| `bone-and-ink` | Swiss minimal, light | Design tools, agencies |
| `dusk` | Dark warm, sophisticated | SaaS, AI products |
| `graphite` | Dark cool, editorial | B2B, enterprise |
| `ivory` | Light clean, professional | Consulting, services |
| `terminal-green` | Hacker, green-on-black | Dev tools, crypto |

Switch theme = change one line in the manifest. Every block re-themes automatically.

Each theme ships with `TASTE.md` — design rationale in machine-readable form. Agents don't just follow rules. They understand *why*.

---

## Agent Protocol

Forma is built for multi-agent workflows:

```
Builder Agent    → writes site.json
Designer Agent   → selects theme, reads TASTE.md
QA Agent         → runs Forma Judge
Deploy Agent     → compiles and ships
```

All agents read from the same manifest. No shared context needed. No coordination overhead.

[Read the full Agent Protocol →](AGENT-PROTOCOL.md)

---

## Real Example: From Manifest to Page

This is the actual `site.json` that builds [forma-demo.fly.dev](https://forma-demo.fly.dev):

```json
{
  "forma_version": "2.0.0",
  "theme": "bone-and-ink",
  "goal": "lead_generation",
  "pages": {
    "index": {
      "title": "Forma — The Design Layer of the Agent Web",
      "blocks": [
        { "id": "nav" },
        { "id": "hero", "title": "Stop generating HTML. Start declaring intent." },
        { "id": "pipeline" },
        { "id": "before-after" },
        { "id": "trust-bar", "label": "Built with Forma" },
        { "id": "feature-grid", "section_title": "Three layers. Zero guesswork." },
        { "id": "code-preview" },
        { "id": "stats" },
        { "id": "testimonials" },
        { "id": "cta", "title": "Clone it. Theme it. Ship it." },
        { "id": "footer" }
      ]
    }
  }
}
```

That manifest compiles to a complete, production-ready page. No HTML written by agents. No CSS drift. Every token enforced.

---

## Project Structure

```
forma/
├── blocks/          # 32 HTML block templates
├── themes/          # 5 theme definitions (theme.json + TASTE.md)
├── core/            # tokens.css, blocks.css, motion.css
├── builder/         # compile.js, compile.site.js, judge.js
├── examples/        # demo.site.json
├── build/           # compiled CSS per theme
└── dist/            # compiled HTML output
```

---

## Philosophy

> "AI doesn't fail because it's dumb. It fails because there are no constraints."

Forma exists because the agent web needs structure, not freedom. Freedom is what got us hallucinated CSS in the first place.

**Constraints create quality.** The token contract forces consistency. The block library prevents drift. The manifest enables coordination. The judge catches mistakes before they ship.

This is how agents should build websites.

---

## License

MIT. Free forever. Built by agents, for agents.

---

**Built by [Visiona Silva](https://github.com/VisionaSilva) + the Novaiok agent team (Carlos, Roger, Nova).**
