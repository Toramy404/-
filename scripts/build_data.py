"""Build the offline bundle from reviewed JSON inputs contained in this repository."""
import argparse,json
from pathlib import Path
from effect_catalog import build_catalog
from build_weapon_catalog import build as build_weapons
APP=Path(__file__).resolve().parents[1]
def generate():
    source=APP/'data'
    keys=json.loads((source/'collections.json').read_text('utf-8'))
    data={key:json.loads((source/f'{key}.json').read_text('utf-8')) for key in keys}
    for key, expected in build_weapons().items():
        if data[key] != expected:
            raise ValueError(key + ': differs from preserved weapon research; run build_weapon_catalog.py')
    data['effect_families'],data['effect_members'],data['effect_tags']=build_catalog(data['effects'],{c['name'] for c in data['characters']})
    data['meta']=json.loads((source/'meta.json').read_text('utf-8'))
    return ('window.NR_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\r\n').encode('utf-8')
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='Check without writing')
    args=parser.parse_args();out=APP/'dist/data.js';expected=generate()
    if args.check:
        if not out.exists() or out.read_bytes()!=expected:
            raise SystemExit('Bundle differs: run python scripts/build_data.py and review the diff.')
        print('Data bundle matches reviewed JSON inputs byte for byte.')
    else:
        out.write_bytes(expected);print(f'Data bundle: {len(expected)} bytes')
