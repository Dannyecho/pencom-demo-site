"""Header notices bell replaces the slider alert card. Usage: python3 apply.py <app/src>"""
import json, pathlib, sys

src = pathlib.Path(sys.argv[1])


def edit(rel, pairs):
    p = src / rel
    s = p.read_text()
    for old, new in pairs:
        assert s.count(old) == 1, f"{rel}: {s.count(old)} matches for {old[:70]!r}"
        s = s.replace(old, new)
    p.write_text(s)
    print("ok", rel)


edit("components/layout/Header.tsx", [
    ('import LanguageSwitcher from "@/components/LanguageSwitcher";\n',
     'import LanguageSwitcher from "@/components/LanguageSwitcher";\nimport NoticesBell from "@/components/NoticesBell";\n'),
    ('            <div className="flex items-center gap-2">\n              <Link\n                to="/services"',
     '            <div className="flex items-center gap-2">\n              <NoticesBell />\n              <Link\n                to="/services"'),
])

edit("pages/home/HomeHero.tsx", [
    ('import AlertBanner from "@/components/AlertBanner";\n', ""),
    ("        {/* Alerts float over the top of the photo */}\n        <AlertBanner />\n\n", ""),
    ("px-4 pb-24 pt-48 sm:min-h-[660px] sm:pt-44", "px-4 pb-24 pt-28 sm:min-h-[660px] sm:pt-28"),
    (" * Site alerts float over the top of the slider; search sits in its own band below it.",
     " * Site notices live in the header bell (NoticesBell); search sits in its own band below the slider."),
])

new = {
    "Notices, {n} unread": ["Sanarwoyi, {n} ba a karanta ba", "Ìkéde, {n} tí a kò tíì kà", "Ọkwa, {n} a gụbeghị"],
    "{n} unread": ["{n} ba a karanta ba", "{n} tí a kò tíì kà", "{n} a gụbeghị"],
    "You're up to date": ["Ka gama karanta komai", "O ti ka gbogbo rẹ̀", "Ị gụchaala ihe niile"],
    "Mark all as read": ["Yi alama duk an karanta", "Sàmì gbogbo rẹ̀ pé a ti kà á", "Kaa ha niile dịka agụrụ"],
    "Mark as read": ["Yi alama an karanta", "Sàmì pé a ti kà á", "Kaa ya dịka agụrụ"],
    "New": ["Sabo", "Tuntun", "Ọhụrụ"],
    "Dismiss notice": ["Rufe sanarwa", "Pa ìkéde dé", "Mechie ọkwa"],
    "No notices right now": ["Babu sanarwa a yanzu", "Kò sí ìkéde báyìí", "Enweghị ọkwa ugbu a"],
    "Show dismissed notices": ["Nuna sanarwoyin da aka rufe", "Fi àwọn ìkéde tí a pa dé hàn", "Gosi ọkwa e mechiri emechi"],
}
for i, lang in enumerate(["ha", "yo", "ig"]):
    p = src / f"i18n/dict/{lang}.ts"
    s = p.read_text()
    add = "".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},\n" for k, v in new.items() if json.dumps(k, ensure_ascii=False) + ":" not in s)
    if add:
        j = s.rindex("};")
        s = s[:j] + "\n  /* Header notices bell */\n" + add + s[j:]
        p.write_text(s)
    print("ok dict", lang)
