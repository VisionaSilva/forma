#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Auto-discover themes from themes/ directory
const THEMES_DIR = path.join(__dirname, '..', 'themes');
const THEMES = fs.readdirSync(THEMES_DIR).filter(d => 
  fs.statSync(path.join(THEMES_DIR, d)).isDirectory() && 
  fs.existsSync(path.join(THEMES_DIR, d, 'theme.json'))
);
const PROJECT_ROOT = path.join(__dirname, '..');

console.log('🏗️  Building Forma compiled CSS files...\n');

// Read core files
const resetCSS = fs.readFileSync(path.join(PROJECT_ROOT, 'core', 'reset.css'), 'utf8');
const tokensCSS = fs.readFileSync(path.join(PROJECT_ROOT, 'core', 'tokens.css'), 'utf8');
const layoutCSS = fs.readFileSync(path.join(PROJECT_ROOT, 'core', 'layout.css'), 'utf8');
const componentsCSS = fs.readFileSync(path.join(PROJECT_ROOT, 'core', 'blocks.css'), 'utf8');

THEMES.forEach(themeName => {
  // Read theme.json
  const themePath = path.join(PROJECT_ROOT, 'themes', themeName, 'theme.json');
  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  const tokens = theme.tokens || {};

  // Build CSS variables block from theme.json
  let themeVariables = ':root {\n';
  
  Object.entries(tokens).forEach(([key, value]) => {
    themeVariables += `  --${key}: ${value};\n`;
  });

  themeVariables += '}\n\n';

  // Concatenate: theme variables first, then core files
  const fullCSS = themeVariables + resetCSS + '\n\n' + tokensCSS + '\n\n' + layoutCSS + '\n\n' + componentsCSS;

  // Write to build/
  const outputPath = path.join(PROJECT_ROOT, 'build', `forma-${themeName}.css`);
  fs.writeFileSync(outputPath, fullCSS);

  const fileSizeKb = (fullCSS.length / 1024).toFixed(1);
  console.log(`✅ ${themeName.toUpperCase()}: ${outputPath} (${fileSizeKb}KB)`);
});

console.log('\n✅ Build complete!\n');
