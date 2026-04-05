# FORMA v2 — Product Direction Brief
**April 2026**

---

## 1. What Forma Is Today

Forma is a contract-first CSS design system. It ships a strict semantic token contract (31 required tokens), a production component library, and three themes — Dusk, Graphite, and Ivory. Every theme includes a TASTE.md file: machine-readable design intent that explains not just what every decision is, but why it exists.

The contract is enforced at build time. If a theme is missing a single token, the build fails. Not a warning — a failure.

**The core innovation: Taste as a hard constraint, not a suggestion.** Every other design system makes consistency optional. Forma makes inconsistency impossible.

Forma v1 is live, open-source, and already being used to build production sites. The foundation is stable. What comes next is a system built on top of it.

---

## 2. The Problem We're Solving

Forma v1 solves the design consistency problem. It does not solve the build problem.

Every time an agent builds a site with Forma today, it writes raw HTML from scratch. It reinvents the nav, the hero, the card grid — every single time. On multi-page builds, decisions drift. The agent forgets the font weight it used on page 2 by the time it reaches page 4. The output is inconsistent even when the tokens are correct.

This is not a Forma-specific failure. It is the structural failure mode of every agent-driven build workflow today:

- **Context collapse** — agents lose coherence across files and decisions as context grows
- **Hallucinated APIs** — without a schema to anchor against, component APIs get invented rather than referenced
- **State drift** — decisions made early in a session do not persist to later pages or agents
- **No feedback loop** — agents cannot verify their own visual output without a render feedback loop

Forma v2 addresses all four. Not through prompting, but through architecture.

---

## 3. What We're Building: Forma v2

Forma v2 is a three-layer system. Each layer stands alone and compounds with the others. Layer 1 already exists. Layers 2 and 3 are what we build next.

### Layer 1 — Foundation (Shipped)

The token contract, semantic CSS, three themes, TASTE.md, and build-time validation. This is Forma today. It does not change — it becomes the substrate everything else runs on.

### Layer 2 — Block Library (Building Next)

A finite library of pre-built, token-compliant HTML sections. Hero, feature grid, pricing table, testimonials, CTA, nav, footer — each block is a standalone, composable unit that works correctly with any Forma theme out of the box.

Agents stop writing HTML from scratch. They select blocks, fill content slots, and move on. No hallucinated class names. No reinvented spacing. Every block is already contract-compliant by design — because every block is authored against the token contract, not assembled by an agent guessing at it.

| Block | Description |
|---|---|
| hero | Full-width opener with headline, subheadline, CTA, and optional image |
| feature-grid | 2 or 3-column benefits layout with icon, heading, body per item |
| trust-bar | Logo strip or social proof bar, responsive |
| pricing | Tier cards with feature lists, highlight support, CTA per tier |
| testimonials | Quote cards with attribution, configurable count and layout |
| cta | Full-width conversion section with heading and primary action |
| nav | Sticky or static navigation with logo, links, and optional CTA |
| footer | Multi-column footer with link groups, legal line, and social icons |

**Design principle:** The block library is not a component kit. It is a contract. Every block is a known quantity — tested, validated, and guaranteed to render correctly with any Forma theme.

### Layer 3 — Agent Protocol (The Big Vision)

A `site.json` manifest schema that captures every build decision in a structured, persistent file. Agents declare intent. Forma's compiler assembles pages from blocks. A validation layer checks output against the manifest and the TASTE.md of the active theme.

---

## 4. The Manifest: A Closer Look

**The manifest is the most important idea in Forma v2.**

A `site.json` file is the single source of truth for a build. It captures: which theme is active, which pages exist, which blocks appear on each page, what content fills each block, and what constraints apply. Every agent working on the site reads from it and writes to it. No agent makes a decision that isn't recorded here.

```json
{
  "forma_version": "2.0",
  "site": "MRA Limited",
  "theme": "graphite",
  "meta": {
    "tone": "professional",
    "audience": "industrial B2B",
    "primary_cta": "Request a Quote"
  },
  "pages": ["index", "linecards", "about", "team", "contact"],
  "globals": {
    "nav": {
      "links": ["Manufacturers", "Services", "Territories", "About", "Team"],
      "cta": { "label": "Request a Quote", "href": "/contact" }
    }
  },
  "blocks": {
    "index": [
      { "block": "hero", "headline": "Industrial Distribution Done Right", "subheadline": "30 years of manufacturer relationships.", "cta": "Request a Quote" },
      { "block": "trust-bar", "logos": ["manufacturer-a", "manufacturer-b"] },
      { "block": "feature-grid", "layout": "3col", "items": 3 },
      { "block": "cta", "headline": "Ready to talk?" }
    ],
    "about": [
      { "block": "hero", "variant": "compact" },
      { "block": "testimonials", "count": 3 }
    ]
  },
  "constraints": {
    "max_blocks_per_page": 6,
    "required_blocks": ["nav", "footer"],
    "tone_guard": true
  }
}
```

**What this enables — and what no other framework provides:**

- **Instant orientation** — any agent joining a build mid-session reads the manifest and immediately knows the full state of the site. No context reconstruction required.
- **Pre-flight validation** — the compiler validates the manifest against the token contract and TASTE.md before generating a single line of HTML.
- **Enforced guardrails** — the `constraints` block lets teams or orchestrators define rules all agents must follow: max blocks per page, required sections, tone guardrails.
- **Audit trail** — a diff of two manifest versions shows exactly what changed between builds, which agent changed it, and why.
- **Multi-agent coordination** — multiple specialist agents can work on different pages simultaneously. The manifest is the coordination layer — not chat, not shared context.

**The key insight:** The manifest makes `site.json` the contract between agents, not between developers. It is infrastructure for machine collaboration, not human DX.

---

## 5. What Makes This Different

Every other framework approaches this problem from the developer side — better tooling, better APIs, better DX for humans who happen to use AI. Forma v2 approaches it from the agent side. That distinction is not cosmetic. It changes every design decision.

| What only Forma has | Why it matters |
|---|---|
| Build enforcement | Token contract fails the build if any design decision is missing or invalid. Taste is a hard constraint. |
| TASTE.md | Design intent is machine-readable documentation. Agents understand *why* a decision exists, not just what it is. |
| Block compliance | Every block is authored against the token contract. Contract compliance is not the agent's job. |
| Manifest protocol | site.json is the source of truth for every agent in a build. State drift is structurally impossible. |
| Multi-agent ready | The manifest is the coordination layer. Specialist agents work in parallel without shared context. |

---

## 6. Ecosystem and Adoption

Forma v2 is not just a framework. It is a proposed standard.

Token contract, block library, manifest protocol — these only become powerful at scale if other agents, teams, and toolmakers adopt the same spec. That requires an explicit ecosystem strategy.

**The Standard Play:**

- Publish the token contract spec independently of the Forma implementation. Any design system can conform to it.
- Publish the manifest schema as a versioned, open specification. Third parties can build compilers and validators against it.
- Publish TASTE.md as a format specification. Theme authors anywhere can produce machine-readable design intent in the same format.

The goal: Forma becomes the reference implementation of a spec that others adopt — the way Express is the reference implementation of Node HTTP middleware patterns.

**Adoption Phases:**

| Phase | Focus |
|---|---|
| Phase 1 (Months 1–4) | Internal proof. Build 5–10 real production sites. Validate the manifest schema under real conditions. |
| Phase 2 (Months 5–9) | Agent integrations. Ship official Forma adapters for the 2–3 most-used agent frameworks. |
| Phase 3 (Months 10–16) | Third-party blocks. Open the block library to external contributors with a validation gate. |
| Phase 4 (Month 17+) | Spec adoption. Invite other design systems to conform to the token contract spec. |

**The Block Marketplace:**

Third-party block authors submit blocks validated against the token contract before listing. No manual curation — the contract is the gatekeeper. A block either passes or it doesn't. Every block in the marketplace is guaranteed to work with every Forma theme.

- **Free tier:** community blocks, MIT licensed
- **Premium tier:** paid blocks with author revenue share
- **Enterprise tier:** private block libraries, validated but not publicly listed

The flywheel: more blocks → platform more useful → more agents → more authors → richer ecosystem. At 50 blocks, agents write almost no HTML. At 200, they write none.

**Who Forma Is For (Three Different Pitches):**

| Audience | What Forma gives them |
|---|---|
| Designers | Use the CSS library and themes. Ship consistent, beautiful sites without writing code. TASTE.md explains every decision. |
| Developers | Extend the block library, build custom themes, contribute to the marketplace. The token contract is the API. |
| Agents | Use the manifest protocol. Declare intent in site.json. Never write raw HTML again. |

---

## 7. Where This Goes

The long arc of Forma v2 is to become the standard interface between AI agents and the web — the same way SQL became the standard interface between applications and databases.

You don't need to know how a database works to query it. You don't need to know how a browser renders to build a site. Agents operating on Forma v2 don't write HTML. They declare intent. The system handles the rest.

The agent's job is to make good decisions about structure and content. Forma's job is to make those decisions correct by construction.

**The bet: Agents are already capable enough to build great websites. What they need is structure. Forma v2 provides it — at the token level, the block level, and the manifest level.**

Forma v2 is not built to make developers faster. It is built to make developers optional.

---

*Forma v2 · Product Direction Brief · April 2026*  
*Written with input from Grok, ChatGPT, Opus, and Sonnet — who independently converged on the same architecture.*
