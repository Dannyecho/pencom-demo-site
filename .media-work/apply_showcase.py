import json, pathlib, sys
src = pathlib.Path(sys.argv[1])
def edit(rel, pairs):
    p = src / rel; s = p.read_text()
    for old, new in pairs:
        if old not in s and new in s: continue
        assert s.count(old) == 1, (rel, old[:60], s.count(old)); s = s.replace(old, new)
    p.write_text(s); print("ok", rel)
edit("App.tsx", [
    ("import HomeMinimal from './pages/HomeMinimal'\n", "import HomeMinimal from './pages/HomeMinimal'\nimport HomeShowcase from './pages/HomeShowcase'\n"),
    ('        <Route path="/home-minimal" element={<HomeMinimal />} />', '        <Route path="/home-minimal" element={<HomeMinimal />} />\n        <Route path="/home-showcase" element={<HomeShowcase />} />'),
])
edit("components/layout/Layout.tsx", [('["/", "/home-retirees", "/home-minimal", "/home-classic"]', '["/", "/home-retirees", "/home-minimal", "/home-showcase", "/home-classic"]')])
new = {
    "Press": ["Danna", "Tẹ", "Pịa"],
    "to search from anywhere on this page.": ["don bincika daga ko'ina a wannan shafi.", "láti wá nǹkan láti ibikíbi lójú ewé yìí.", "ịchọ ihe site n'ebe ọ bụla na peeji a."],
    "Portals": ["Kafofi", "Ojú òpó", "Ọnụ ụzọ"],
}
for i, lang in enumerate(["ha", "yo", "ig"]):
    p = src / f"i18n/dict/{lang}.ts"; s = p.read_text()
    add = "".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},\n" for k, v in new.items() if json.dumps(k, ensure_ascii=False) + ":" not in s)
    if add:
        j = s.rindex("};"); s = s[:j] + "\n  /* Showcase homepage */\n" + add + s[j:]; p.write_text(s)
    print("ok dict", lang)
