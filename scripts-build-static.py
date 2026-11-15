"""Build a zero-dependency deployable site from locally emitted TypeScript JS.
This is a fallback artifact helper. `npm run build` remains the canonical build.
"""
from pathlib import Path
import shutil,re
p=Path(__file__).parent
src=p/'.ts-build'
out=p/'static-preview'
if out.exists():shutil.rmtree(out)
(out/'assets').mkdir(parents=True)
html=(p/'index.html').read_text().replace('src="/src/main.ts"','src="./assets/main.js"').replace('</head>','<link rel="stylesheet" href="./assets/style.css" />\n  </head>')
(out/'index.html').write_text(html)
for path in src.glob('*.js'):
    js=path.read_text()
    js=re.sub(r'^import\s+[\'\"]\.\/style\.css[\'\"];?\s*$', '', js, flags=re.M)
    js=re.sub(r'(from\s+[\'\"]\./[^\'\"]+)([\'\"])',r'\1.js\2',js)
    (out/'assets'/path.name).write_text(js)
shutil.copyfile(p/'src'/'style.css',out/'assets'/'style.css')
print('Static preview built:',out)