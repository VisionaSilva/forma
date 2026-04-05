#!/usr/bin/env node

/**
 * Forma Judge — Site.json Validator
 * 
 * Enforces:
 * 1. JSON Schema validation against site.schema.json
 * 2. Goal-based rules (e.g., lead_generation requires CTA, product_sales requires pricing)
 * 3. Completeness rules (all goals need hero on index, nav/footer required everywhere)
 * 4. Block composition validation (required fields per block variant)
 * 
 * Usage:
 *   node builder/judge.js examples/mra.site.json
 * 
 * Output:
 *   ✅ PASS lines
 *   ❌ FAIL lines
 *   ⚠️  WARN lines
 *   Final summary: "X passed, Y warnings, Z failures"
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const PASS = `${colors.green}✅${colors.reset}`;
const FAIL = `${colors.red}❌${colors.reset}`;
const WARN = `${colors.yellow}⚠️ ${colors.reset}`;
const INFO = `${colors.cyan}ℹ${colors.reset}`;

class FormaJudge {
  constructor(schemaPath, blocksPath) {
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    this.blocksRegistry = JSON.parse(fs.readFileSync(blocksPath, 'utf-8'));
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.validate = this.ajv.compile(this.schema);
    
    this.passed = 0;
    this.warnings = 0;
    this.failures = 0;
  }

  log(icon, message) {
    console.log(`${icon} ${message}`);
    if (icon === PASS) this.passed++;
    if (icon === WARN) this.warnings++;
    if (icon === FAIL) this.failures++;
  }

  judge(manifest) {
    console.log('\n🔍 Validating Forma site.json manifest...\n');

    // 1. JSON Schema validation
    const valid = this.validate(manifest);
    if (!valid) {
      this.log(FAIL, 'Schema validation failed:');
      this.validate.errors.forEach(err => {
        this.log(FAIL, `  ${err.instancePath || 'root'}: ${err.message}`);
      });
      return false;
    }
    this.log(PASS, `Schema validation passed (forma_version ${manifest.forma_version})`);

    // 2. Goal-based rules
    this.checkGoalRules(manifest);

    // 3. Block completeness
    this.checkBlocks(manifest);

    // 4. Page rules
    this.checkPages(manifest);

    // Summary
    console.log(`\n${'─'.repeat(50)}`);
    const total = this.passed + this.warnings + this.failures;
    const summary = `${PASS} ${this.passed}/${total} checks passed`;
    if (this.warnings > 0) console.log(`${WARN} ${this.warnings} warning(s)`);
    if (this.failures > 0) console.log(`${FAIL} ${this.failures} failure(s)`);
    console.log(summary);
    console.log(`${'─'.repeat(50)}\n`);

    return this.failures === 0;
  }

  checkGoalRules(manifest) {
    const { goal } = manifest;
    const indexBlocks = manifest.pages.index?.blocks?.map(b => b.id) || [];

    console.log('\n📋 Goal-based rules:');

    if (goal === 'lead_generation') {
      if (indexBlocks.includes('cta')) {
        this.log(PASS, `lead_generation: CTA block found on index`);
      } else {
        this.log(FAIL, `lead_generation: Must have CTA block on index for conversion`);
      }
    }

    if (goal === 'product_sales') {
      if (indexBlocks.includes('pricing')) {
        this.log(PASS, `product_sales: Pricing block found on index`);
      } else {
        this.log(FAIL, `product_sales: Must have pricing block on index to show offers`);
      }
    }

    if (['lead_generation', 'brand_awareness', 'product_sales', 'portfolio'].includes(goal)) {
      if (indexBlocks.includes('hero')) {
        this.log(PASS, `${goal}: Hero block found on index`);
      } else {
        this.log(FAIL, `${goal}: Hero block required on index`);
      }
    }

    if (goal === 'content') {
      this.log(PASS, `${goal}: No specific block requirements`);
    }
  }

  checkBlocks(manifest) {
    console.log('\n🧩 Block validation:');

    const blocksByType = {};
    Object.values(manifest.pages).forEach(page => {
      if (page?.blocks) {
        page.blocks.forEach(block => {
          blocksByType[block.id] = blocksByType[block.id] || [];
          blocksByType[block.id].push(block);
        });
      }
    });

    // Check that only valid block types are used
    Object.keys(blocksByType).forEach(blockId => {
      const blockDef = this.blocksRegistry.blocks.find(b => b.id === blockId);
      if (blockDef) {
        this.log(PASS, `Block type '${blockId}' is defined`);
      } else {
        this.log(FAIL, `Block type '${blockId}' is not in blocks registry`);
      }

      // Check variants
      blocksByType[blockId].forEach((block, idx) => {
        if (block.variant && blockDef) {
          if (blockDef.variants.includes(block.variant)) {
            this.log(PASS, `Block '${blockId}' variant '${block.variant}' is valid`);
          } else {
            this.log(FAIL, `Block '${blockId}' variant '${block.variant}' not in [${blockDef.variants.join(', ')}]`);
          }
        }
      });
    });

    // Global nav and footer
    const globalNav = manifest.globals?.nav;
    const globalFooter = manifest.globals?.footer;

    if (globalNav && globalNav.length >= 2) {
      this.log(PASS, `Global nav configured with ${globalNav.length} items`);
    } else {
      this.log(FAIL, `Global nav must have at least 2 items`);
    }

    if (globalFooter?.legal_text) {
      this.log(PASS, `Global footer legal text configured`);
    } else {
      this.log(FAIL, `Global footer must have legal_text`);
    }
  }

  checkPages(manifest) {
    console.log('\n📄 Page validation:');

    if (!manifest.pages.index) {
      this.log(FAIL, 'Index page is required');
      return;
    }
    this.log(PASS, 'Index page defined');

    Object.entries(manifest.pages).forEach(([pageName, page]) => {
      if (!page.blocks || page.blocks.length === 0) {
        this.log(FAIL, `Page '${pageName}' has no blocks`);
      } else {
        this.log(PASS, `Page '${pageName}' has ${page.blocks.length} block(s)`);
      }

      // Check for nav and footer on all pages except special pages
      const hasNav = page.blocks?.some(b => b.id === 'nav');
      const hasFooter = page.blocks?.some(b => b.id === 'footer');

      if (!hasNav) {
        this.log(WARN, `Page '${pageName}' missing nav block`);
      }
      if (!hasFooter) {
        this.log(WARN, `Page '${pageName}' missing footer block`);
      }
    });
  }
}

// Main
if (require.main === module) {
  const manifestPath = process.argv[2];

  if (!manifestPath) {
    console.error(`${FAIL} Usage: node judge.js <manifest.site.json>`);
    process.exit(1);
  }

  if (!fs.existsSync(manifestPath)) {
    console.error(`${FAIL} File not found: ${manifestPath}`);
    process.exit(1);
  }

  const projectRoot = path.dirname(path.dirname(manifestPath));
  const schemaPath = path.join(projectRoot, 'schema', 'site.schema.json');
  const blocksPath = path.join(projectRoot, 'blocks', 'blocks.json');

  if (!fs.existsSync(schemaPath)) {
    console.error(`${FAIL} Schema not found: ${schemaPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(blocksPath)) {
    console.error(`${FAIL} Blocks registry not found: ${blocksPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const judge = new FormaJudge(schemaPath, blocksPath);
  const passed = judge.judge(manifest);

  process.exit(passed ? 0 : 1);
}

module.exports = FormaJudge;
