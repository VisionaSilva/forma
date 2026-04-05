#!/usr/bin/env node
/**
 * Forma Site Compiler
 * Usage: node builder/compile.site.js <site.json> <output-dir>
 * Assembles pages from blocks based on site.json manifest.
 */

const fs = require('fs');
const path = require('path');

const manifestPath = process.argv[2];
const outputDir = process.argv[3] || 'dist';

if (!manifestPath) {
  console.error('Usage: node builder/compile.site.js <site.json> [output-dir]');
  process.exit(1);
}

const FORMA_ROOT = path.join(__dirname, '..');
const BLOCKS_DIR = path.join(FORMA_ROOT, 'blocks');
const BUILD_DIR = path.join(FORMA_ROOT, 'build');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const theme = manifest.theme || 'graphite';

// Read compiled theme CSS
const themeCSS = fs.readFileSync(path.join(BUILD_DIR, `forma-${theme}.css`), 'utf8');
const motionCSS = fs.readFileSync(path.join(FORMA_ROOT, 'core', 'motion.css'), 'utf8');
const blocksCSS = fs.readFileSync(path.join(FORMA_ROOT, 'core', 'blocks.css'), 'utf8');

// Read block HTML
function readBlock(blockId) {
  const blockPath = path.join(BLOCKS_DIR, `${blockId}.html`);
  if (!fs.existsSync(blockPath)) {
    console.warn(`⚠️  Block not found: ${blockId}`);
    return `<!-- Block: ${blockId} not found -->`;
  }
  return fs.readFileSync(blockPath, 'utf8');
}

// Inject content into block HTML
// Simple template: replaces placeholder text with manifest content
function injectContent(blockHtml, blockData) {
  let html = blockHtml;

  // Nav
  if (blockData.id === 'nav') {
    html = html.replace(/>Forma<\/a>/, `>${blockData.logo_text || manifest.site.name}</a>`);
    // Inject nav links from globals
    if (manifest.globals?.nav) {
      const links = manifest.globals.nav
        .map(l => `<li><a href="${l.href}">${l.text}</a></li>`)
        .join('\n      ');
      html = html.replace(
        /<li><a href="#features">Features<\/a><\/li>[\s\S]*?<\/ul>/,
        `${links}\n    </ul>`
      );
    }
    if (blockData.cta_text) {
      html = html.replace(/Get Started/g, blockData.cta_text);
      html = html.replace(/href="\/get-started"/g, `href="${blockData.cta_href || '/contact'}"`);
    }
  }

  // Hero
  if (blockData.id === 'hero') {
    if (blockData.variant) {
      html = html.replace(/data-variant="centered"/, `data-variant="${blockData.variant}"`);
    }
    if (blockData.eyebrow) html = html.replace(/Introducing Forma v2/, blockData.eyebrow);
    if (blockData.title) html = html.replace(/Build landing pages that actually convert/, blockData.title);
    if (blockData.subtitle) html = html.replace(/Composable HTML blocks with a unified token system\. Drop in, customize, ship\. No framework required\./, blockData.subtitle);
    if (blockData.cta_primary_text) {
      html = html.replace(/Get Started Free/, blockData.cta_primary_text);
      html = html.replace(/href="\/get-started" class="hero-cta-primary"/, `href="${blockData.cta_primary_href || '/contact'}" class="hero-cta-primary"`);
    }
    if (blockData.cta_secondary_text) {
      html = html.replace(/View Docs/, blockData.cta_secondary_text);
      html = html.replace(/href="\/docs"/, `href="${blockData.cta_secondary_href || '#'}"`);
    } else {
      // Remove secondary CTA if not provided
      html = html.replace(/<a href="\/docs" class="hero-cta-secondary">View Docs<\/a>/, '');
    }
  }

  // Trust bar — full content injection
  if (blockData.id === 'trust-bar') {
    if (blockData.label) html = html.replace(/Trusted by teams at/, blockData.label);
    // Replace logo items if provided
    if (blockData.items && Array.isArray(blockData.items)) {
      const logoHtml = blockData.items.map(item => 
        `<a class="trust-logo" href="${item.href || '#'}" role="listitem" aria-label="${item.name}">
          <div class="trust-logo-mark" aria-hidden="true">${item.icon || '◆'}</div>
          <span class="trust-logo-name">${item.name}</span>
        </a>`
      ).join('\n      ');
      html = html.replace(
        /<a class="trust-logo"[\s\S]*?<\/a>(?:\s*<a class="trust-logo"[\s\S]*?<\/a>)*/,
        logoHtml
      );
    }
  }

  // Feature grid
  if (blockData.id === 'feature-grid') {
    if (blockData.variant) html = html.replace(/data-variant="3col"/, `data-variant="${blockData.variant}"`);
    if (blockData.section_eyebrow) html = html.replace(/Features/, blockData.section_eyebrow);
    if (blockData.section_title) html = html.replace(/Everything you need to ship faster/, blockData.section_title);
    if (blockData.section_subtitle) html = html.replace(/Composable, accessible, and built with a design-token system that scales with your brand\./, blockData.section_subtitle);
    // Replace feature items — match by default text in block HTML
    const featureDefaults = [
      { icon: '→', title: 'Lightning Fast', desc: 'Zero-dependency HTML partials that load instantly. No bloat, no build steps required.' },
      { icon: '→', title: 'Token-Driven Design', desc: 'A unified CSS variable system means your brand flows through every block automatically.' },
      { icon: '→', title: 'Accessible by Default', desc: 'ARIA-compliant markup and semantic HTML out of the box. Built for everyone.' },
      { icon: '→', title: 'Flexible Layouts', desc: 'Multiple variants per block let you mix and match without writing custom CSS.' },
      { icon: '→', title: 'Drop-In Ready', desc: 'Works with any stack — plain HTML, React, Vue, Astro, whatever you\'re building with.' },
      { icon: '→', title: 'Dark Mode Native', desc: 'CSS token architecture makes dark mode a first-class citizen, not an afterthought.' },
    ];
    featureDefaults.forEach((defaults, i) => {
      const idx = i + 1;
      const newTitle = blockData[`feature_${idx}_title`];
      const newDesc = blockData[`feature_${idx}_description`];
      const newIcon = blockData[`icon_${idx}`];
      if (newTitle) {
        html = html.replace(new RegExp(defaults.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), newTitle);
      }
      if (newDesc) {
        html = html.replace(new RegExp(defaults.desc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), newDesc);
      }
      if (newIcon != null) {
        // Replace the icon in the corresponding feature-icon div (nth occurrence)
        html = html.replace(defaults.icon, newIcon || '');
      }
    });
  }

  // Testimonials
  if (blockData.id === 'testimonials') {
    if (blockData.section_eyebrow) html = html.replace(/Testimonials/, blockData.section_eyebrow);
    if (blockData.section_title) html = html.replace(/What our customers say/, blockData.section_title);
    if (blockData.section_subtitle) html = html.replace(/<\/h2>\s*<\/div>/, `</h2>\n      <p class="testimonials-subtitle">${blockData.section_subtitle}</p>\n    </div>`);
    // Replace testimonial 1
    if (blockData.testimonial_1_quote) {
      html = html.replace(/Forma cut our landing page build time in half.*?no design drift, ever\./, blockData.testimonial_1_quote);
      html = html.replace(/Anika Kowalski/, blockData.testimonial_1_name || 'Anika Kowalski');
      html = html.replace(/Head of Design, Orbit Labs/, `${blockData.testimonial_1_role || ''}, ${blockData.testimonial_1_company || ''}`);
      if (blockData.testimonial_1_initials) html = html.replace(/>AK</, `>${blockData.testimonial_1_initials}<`);
    }
    if (blockData.testimonial_2_quote) {
      html = html.replace(/I dropped the hero block in.*?That's wild\./, blockData.testimonial_2_quote);
      html = html.replace(/James Moreau/, blockData.testimonial_2_name || 'James Moreau');
      html = html.replace(/Founder, Vertex/, `${blockData.testimonial_2_role || ''}, ${blockData.testimonial_2_company || ''}`);
      if (blockData.testimonial_2_initials) html = html.replace(/>JM</, `>${blockData.testimonial_2_initials}<`);
    }
    if (blockData.testimonial_3_quote) {
      html = html.replace(/The accessibility defaults alone are worth it.*?Forma blocks\./, blockData.testimonial_3_quote);
      html = html.replace(/Rania Nasser/, blockData.testimonial_3_name || 'Rania Nasser');
      html = html.replace(/Engineering Lead, Strata/, `${blockData.testimonial_3_role || ''}, ${blockData.testimonial_3_company || ''}`);
      if (blockData.testimonial_3_initials) html = html.replace(/>RN</, `>${blockData.testimonial_3_initials}<`);
    }
  }

  // Stats
  if (blockData.id === 'stats') {
    if (blockData.section_title) html = html.replace(/Trusted by builders worldwide/, blockData.section_title);
    if (blockData.stat_1_number) {
      html = html.replace(/50<span class="stat-suffix">\+<\/span>/, `${blockData.stat_1_number}<span class="stat-suffix">${blockData.stat_1_suffix || ''}</span>`);
      html = html.replace(/Production-ready blocks/, blockData.stat_1_label || '');
    }
    if (blockData.stat_2_number) {
      html = html.replace(/12<span class="stat-suffix">k<\/span>/, `${blockData.stat_2_number}<span class="stat-suffix">${blockData.stat_2_suffix || ''}</span>`);
      html = html.replace(/Developers using Forma/, blockData.stat_2_label || '');
    }
    if (blockData.stat_3_number) {
      html = html.replace(/98<span class="stat-suffix">%<\/span>/, `${blockData.stat_3_number}<span class="stat-suffix">${blockData.stat_3_suffix || ''}</span>`);
      html = html.replace(/Lighthouse accessibility score/, blockData.stat_3_label || '');
    }
    if (blockData.stat_4_number) {
      html = html.replace(/4<span class="stat-suffix">x<\/span>/, `${blockData.stat_4_number}<span class="stat-suffix">${blockData.stat_4_suffix || ''}</span>`);
      html = html.replace(/Faster page builds on average/, blockData.stat_4_label || '');
    }
  }

  // CTA
  if (blockData.id === 'cta') {
    if (blockData.variant) html = html.replace(/data-variant="centered"/, `data-variant="${blockData.variant}"`);
    if (blockData.eyebrow) html = html.replace(/Get Started/, blockData.eyebrow);
    if (blockData.title) html = html.replace(/Ready to ship your next landing page\?/, blockData.title);
    if (blockData.subtitle) html = html.replace(/Join thousands of designers and engineers using Forma to build faster, better landing pages\./, blockData.subtitle);
    if (blockData.cta_primary_text) {
      html = html.replace(/Start Building Free/, blockData.cta_primary_text);
      html = html.replace(/href="\/signup"/g, `href="${blockData.cta_primary_href || '/contact'}"`);
    }
    if (blockData.cta_secondary_text) {
      html = html.replace(/Read the Docs/, blockData.cta_secondary_text);
      html = html.replace(/href="\/docs"/, `href="${blockData.cta_secondary_href || '#'}"`);
    }
  }

  // Footer
  if (blockData.id === 'footer') {
    const brandName = blockData.brand_name || manifest.globals?.footer?.brand_name || manifest.site.name;
    const legal = blockData.legal_text || manifest.globals?.footer?.legal_text || `© 2026 ${brandName}. All rights reserved.`;
    html = html.replace(/Forma/g, brandName);
    html = html.replace(/© 2026 Forma\. All rights reserved\./, legal);
  }

  return html;
}

// Build a full HTML page
function buildPage(pageKey, pageData) {
  const blocks = pageData.blocks
    .map(blockData => {
      const blockHtml = readBlock(blockData.id);
      return injectContent(blockHtml, blockData);
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.title || manifest.site.name}</title>
  <meta name="description" content="${pageData.description || ''}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${theme === 'terminal-green' 
    ? '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">'
    : theme === 'bone-and-ink'
    ? '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet">'
    : '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">'}
  <style>
${themeCSS}
${blocksCSS}
${motionCSS}

/* Token aliases — bridge block tokens to theme tokens */
:root {
  --surface-card: var(--surface-elevated);
  --radius-xl: ${theme === 'terminal-green' || theme === 'bone-and-ink' ? '0px' : '1rem'};
  --shadow-glow: ${theme === 'bone-and-ink' ? 'none' : '0 0 20px var(--accent-primary, oklch(0.85 0.005 270) / 0.15)'};
  --shadow-lg: ${theme === 'bone-and-ink' ? 'none' : '0 8px 32px oklch(0 0 0 / 0.4)'};
  ${theme === 'terminal-green' ? `
  --font-sans: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-full: 9999px;
  font-size: 14px;
  ` : theme === 'bone-and-ink' ? `
  --font-sans: 'Inter', 'Helvetica Neue', Helvetica, sans-serif;
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-full: 9999px;
  ` : ''}
}

/* Page resets */
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  padding: 0;
  background: var(--surface-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; }
a { color: inherit; }
.section { padding: var(--section-gap) var(--content-padding); }
  </style>
</head>
<body>

${blocks}

</body>
</html>`;
}

// Compile all pages
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

Object.entries(manifest.pages).forEach(([pageKey, pageData]) => {
  const filename = pageKey === 'index' ? 'index.html' : `${pageKey}.html`;
  const html = buildPage(pageKey, pageData);
  const outPath = path.join(outputDir, filename);
  fs.writeFileSync(outPath, html);
  console.log(`✅ ${filename} (${(html.length / 1024).toFixed(1)}KB)`);
});

console.log(`\n✅ Compiled ${Object.keys(manifest.pages).length} pages → ${outputDir}/`);
