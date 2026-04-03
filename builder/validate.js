#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const THEMES = ['dusk', 'graphite', 'ivory'];
const PROJECT_ROOT = path.join(__dirname, '..');

console.log('🔍 Validating Forma themes against contract...\n');

let hasErrors = false;

// Read contract
const contractPath = path.join(PROJECT_ROOT, 'contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const requiredTokens = contract.requiredTokens;

console.log(`✓ Contract loaded: ${requiredTokens.length} required tokens\n`);

// Validate each theme
THEMES.forEach(themeName => {
  const themePath = path.join(PROJECT_ROOT, 'themes', themeName, 'theme.json');
  
  if (!fs.existsSync(themePath)) {
    console.error(`❌ Theme not found: ${themePath}`);
    hasErrors = true;
    return;
  }

  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  const tokens = theme.tokens || {};
  const providedTokenNames = Object.keys(tokens);

  console.log(`📦 ${themeName.toUpperCase()}`);

  // Check for missing tokens
  const missing = requiredTokens.filter(t => !tokens.hasOwnProperty(t));
  
  if (missing.length > 0) {
    console.error(`  ❌ Missing ${missing.length} tokens:`);
    missing.forEach(t => console.error(`     - --${t}`));
    hasErrors = true;
  } else {
    console.log(`  ✅ All ${requiredTokens.length} required tokens present`);
  }

  // Check for extra tokens (informational)
  const extra = providedTokenNames.filter(t => !requiredTokens.includes(t));
  if (extra.length > 0) {
    console.log(`  ℹ️  ${extra.length} extra tokens: ${extra.join(', ')}`);
  }

  console.log('');
});

if (hasErrors) {
  console.error('\n❌ Validation failed. Fix the errors above and try again.');
  process.exit(1);
} else {
  console.log('✅ All themes validated successfully!\n');
  process.exit(0);
}
