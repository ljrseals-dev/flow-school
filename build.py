#!/usr/bin/env python3
"""Builds dist/flowschool.html (artifact body) and index.html (standalone) from src/. No network."""
import re, pathlib
root = pathlib.Path(__file__).parent
js = '\n'.join((root/'src/js'/f).read_text() for f in ['core.js','music.js','content.js','bot.js'])
def safe(s): return s.replace('</script', '<\\/script').replace('<!--', '<\\!--')
dsp_src = (root.parent/'blowtorch/src/blowtorch.body.html').read_text() if (root.parent/'blowtorch/src/blowtorch.body.html').exists() else (root/'src/dsp.js').read_text()
if '// <DSP>' in dsp_src:
    dsp = dsp_src[dsp_src.index('// <DSP>'):dsp_src.index('// </DSP>')]
    (root/'src/dsp.js').write_text(dsp)
else: dsp = dsp_src
body = (root/'src/app.body.html').read_text().replace('/*__ENGINE__*/', safe(js)).replace('/*__DSP__*/', safe(dsp))
(root/'dist').mkdir(exist_ok=True); (root/'dist/flowschool.html').write_text(body)
title = re.search(r'<title>(.*?)</title>', body).group(1)
(root/'index.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style></head><body>' + body + '</body></html>')
print('built', len(body)//1024, 'KB')
