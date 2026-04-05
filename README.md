# Forma

**The agent-native web framework.**

Forma is a constraint engine for AI agents building websites. Agents declare intent in a JSON manifest. Forma enforces design consistency, validates output, and compiles production-ready static HTML.

32 blocks. 5 themes. 31 semantic tokens. One manifest. Zero hallucinated markup.

---

## The Problem

AI agents generate broken websites:
- **Hallucinated CSS** — agents invent class names that don't exist
- **Design drift** — page 1 uses 16px text, page 3 uses 14px, nothing matches
- **Context collapse** — two agents working on the same site lose each other's decisions

The fix isn't better prompts. It's better structure.

## The Solution

Forma gives agents a contract to work within:

```
Agent Intent → site.json → Compiler → Static HTML → Forma Judge ✓
```

1. **Write a manifest** — One `site.json` file. Pages, blocks, content, theme, goal.
2. **Compile** — Blocks pulled, tokens applied, content injected. Static HTML out.
3. **Validate** — Forma Judge checks structure AND intent. Missing a CTA on a lead-gen page? Build fails.

---

## Quick Start

```bash
git clone https://github.com/VisionaSilva/forma.git
cd forma

# Compile the demo site
node builder/compile.js
node builder/compile.site.js examples/demo.site.json dist/demo

# Open dist/demo/index.html
```

---

## 32 Blocks

Every block is token-based, responsive, and works across all 5 themes automatically.

**Layout:** nav, footer, banner, divider
**Hero:** hero, founder-note
**Features:** feature-grid, feature-spotlight, bento-grid, system-diagram
**Trust:** trust-bar, logo-wall, testimonials, case-study, stats
**Conversion:** cta, conversion-panel, comparison, problem-solution, faq, guarantee, pricing
**Process:** process, pipeline
**Forms:** contact-form, lead-magnet
**Media:** video-embed, before-after, code-preview, changelog
**Team:** team, integrations

[Full block reference →](AGENT-PROTOCOL.md)

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

---

## Token Contract

31 semantic tokens define every theme. Miss one and the build breaks.

Colors, typography, spacing, shape, effects — all enforced. No hardcoded hex. No magic numbers. No drift.

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

[Read the Agent Protocol →](AGENT-PROTOCOL.md)

---

## Goal-Based Validation

The Forma Judge validates intent, not just structure:

- **Lead generation** → must have CTA + contact form + trust element
- **Product launch** → must have features + pricing + comparison
- **Brand awareness** → must have testimonials + trust bar
- **Portfolio** → must have case studies + stats

Missing required blocks for your stated goal = build failure.

---

## Live Example

- [Forma Demo](https://forma-demo.fly.dev) — this framework's own marketing site, built with Forma

---

## TASTE.md

Every theme ships with a `TASTE.md` — design rationale in machine-readable form. Agents don't just follow rules. They understand *why* the rules exist.

```
# TASTE.md — Bone and Ink

## Core Principle
Typography IS the design. If you need decoration, the type isn't working hard enough.

## Rules
- No border radius (except functional indicators)
- No shadows
- No gradients
- Body text: 16px, 1.7 line height
- Only two weights: 400 (body) and 800 (headlines)
```

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
