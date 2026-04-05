#!/usr/bin/env python3
"""Add pipeline, before-after, and code-preview blocks to index page."""
import json

path = '/Users/canaclawdbot/.openclaw/workspace/projects/forma/examples/demo.site.json'

with open(path) as f:
    data = json.load(f)

# Rebuild index page blocks in the right order
# Hero -> Pipeline -> Before/After -> Trust Bar -> Features -> Code Preview -> Stats -> Testimonials -> CTA -> Footer
index_blocks = data['pages']['index']['blocks']

# Extract existing blocks by id
blocks_by_id = {}
for b in index_blocks:
    blocks_by_id[b['id']] = b

# New block order
new_order = [
    blocks_by_id.get('nav', {"id": "nav", "cta_text": "GitHub", "cta_href": "https://github.com/VisionaSilva/forma"}),
    blocks_by_id.get('hero'),
    {"id": "pipeline"},  # NEW
    {"id": "before-after"},  # NEW
    blocks_by_id.get('trust-bar'),
    blocks_by_id.get('feature-grid'),
    {"id": "code-preview"},  # NEW
    blocks_by_id.get('stats'),
    blocks_by_id.get('testimonials'),
    blocks_by_id.get('cta'),
    blocks_by_id.get('footer'),
]

# Filter None
new_order = [b for b in new_order if b is not None]

data['pages']['index']['blocks'] = new_order

with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Index page now has {len(new_order)} blocks")
for b in new_order:
    print(f"  - {b['id']}")
