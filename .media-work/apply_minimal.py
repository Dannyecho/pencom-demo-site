import json, pathlib, sys
src = pathlib.Path(sys.argv[1])
def edit(rel, pairs):
    p = src / rel; s = p.read_text()
    for old, new in pairs:
        if old not in s and new in s: continue
        assert s.count(old) == 1, (rel, old[:60], s.count(old)); s = s.replace(old, new)
    p.write_text(s); print("ok", rel)
edit("App.tsx", [
    ("import HomeModern from './pages/HomeModern'\n", "import HomeModern from './pages/HomeModern'\nimport HomeMinimal from './pages/HomeMinimal'\n"),
    ('        <Route path="/home-retirees" element={<HomeCalm />} />', '        <Route path="/home-retirees" element={<HomeCalm />} />\n        <Route path="/home-minimal" element={<HomeMinimal />} />'),
])
edit("components/layout/Layout.tsx", [('["/", "/home-retirees", "/home-classic"]', '["/", "/home-retirees", "/home-minimal", "/home-classic"]')])
new = {
    "Everything about your pension, in one place.": ["Komai game da fanshonka, a wuri ɗaya.", "Gbogbo nǹkan nípa owó ìfẹ̀yìntì rẹ, ní ibì kan.", "Ihe niile gbasara ezumike nka gị, n'otu ebe."],
    "your pension": ["fanshonka", "owó ìfẹ̀yìntì rẹ", "ezumike nka gị"],
}
for i, lang in enumerate(["ha", "yo", "ig"]):
    p = src / f"i18n/dict/{lang}.ts"; s = p.read_text()
    add = "".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},\n" for k, v in new.items() if json.dumps(k, ensure_ascii=False) + ":" not in s)
    if add:
        j = s.rindex("};"); s = s[:j] + "\n  /* Minimal homepage */\n" + add + s[j:]; p.write_text(s)
    print("ok dict", lang)
