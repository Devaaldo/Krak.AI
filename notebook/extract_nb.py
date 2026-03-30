import json
with open('crack-detection.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)
    
for i, cell in enumerate(nb['cells']):
    ct = cell['cell_type']
    source = ''.join(cell.get('source', []))
    print(f"\n{'='*80}")
    print(f"CELL {i} ({ct.upper()})")
    print(f"{'='*80}")
    print(source)
