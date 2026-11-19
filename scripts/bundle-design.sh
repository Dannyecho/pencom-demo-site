#!/usr/bin/env bash
# Rebuild a design version that sits beside this app (../v2, ../v3, …) and copy it into public/<name>,
# where the main site serves it at ./<name>/index.html.
#   bash scripts/bundle-design.sh v2 "Design option A (v2)"
#   bash scripts/bundle-design.sh v3 "Design option B (v3)"
# Uses this app's node_modules (the projects share their packages), builds in a temporary folder so the
# version's own repository is never changed, and adds a "Main site" link back to this site.
set -euo pipefail

NAME="${1:?Usage: bundle-design.sh <folder> "<label>"}"
LABEL="${2:-$NAME}"
APP="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$APP/../$NAME"
TMP="$(mktemp -d)"
OUT="$TMP/dist"
trap 'rm -rf "$TMP"' EXIT

[ -d "$SRC/src" ] || { echo "Cannot find the v2 project at $SRC"; exit 1; }

mkdir -p "$TMP/v2"
(cd "$SRC" && tar cf - --exclude=.git --exclude=node_modules --exclude=dist .) | (cd "$TMP/v2" && tar xf -)
ln -s "$APP/node_modules" "$TMP/v2/node_modules"

# Link back to the main site, fixed at the bottom centre of every v2 page.
python3 - "$TMP/v2/index.html" "$LABEL" <<'PY'
import sys, html
p, label = sys.argv[1], html.escape(sys.argv[2]); s = open(p).read()
pill = '''    <a href="../index.html#/" id="main-site-link" aria-label="Back to the main PenCom site"
       style="position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(10,74,19,.92);color:#fff;font:600 13px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;text-decoration:none;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);backdrop-filter:blur(6px)"
       onfocus="this.style.outline='3px solid #FFD84D';this.style.outlineOffset='2px'" onblur="this.style.outline='none'">
      <span aria-hidden="true">&larr;</span> Main site
      <span style="opacity:.75;font-weight:500">· LABEL</span>
    </a>
'''.replace("LABEL", label)
if 'main-site-link' not in s:
    s = s.replace('    <div id="root"></div>\n', '    <div id="root"></div>\n' + pill, 1)
s = s.replace('<title>PenCom | National Pension Commission</title>', f'<title>PenCom | {label}</title>', 1)
open(p, 'w').write(s)
PY

(cd "$TMP/v2" && node node_modules/vite/bin/vite.js build --outDir "$OUT" --emptyOutDir --logLevel warn)

rm -rf "$APP/public/$NAME"
mkdir -p "$APP/public/$NAME"
cp -r "$OUT/." "$APP/public/$NAME/"
echo "$NAME copied to public/$NAME — open ./$NAME/index.html on the main site."
