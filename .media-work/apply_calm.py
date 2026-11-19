"""Install the retiree-friendly homepage. Usage: python3 apply.py <app/src>"""
import json, pathlib, sys

src = pathlib.Path(sys.argv[1])


def edit(rel, pairs):
    p = src / rel
    s = p.read_text()
    for old, new in pairs:
        if old not in s and new in s:
            continue
        assert s.count(old) == 1, f"{rel}: {s.count(old)} matches for {old[:70]!r}"
        s = s.replace(old, new)
    p.write_text(s)
    print("ok", rel)


edit("App.tsx", [
    ("import Home from './pages/Home'\n", "import Home from './pages/Home'\nimport HomeCalm from './pages/HomeCalm'\n"),
    ('<Route path="/" element={<Home />} />', '<Route path="/" element={<HomeCalm />} />\n        <Route path="/home-classic" element={<Home />} />'),
])

edit("components/layout/Layout.tsx", [
    ('import LanguageNotice from "@/components/LanguageNotice";\n', 'import LanguageNotice from "@/components/LanguageNotice";\nimport { applyTextSize, readTextSize } from "@/lib/textSize";\n'),
    ("  // New page without an anchor", "  // The reader's chosen text size applies on every page.\n  useEffect(() => applyTextSize(readTextSize()), []);\n\n  // New page without an anchor"),
])

L = ["ha", "yo", "ig"]
new = {
    "Campaign": ["Kamfen", "Ìpolongo", "Mkpọsa"],
    "Stop": ["Tsaya", "Dúró", "Kwụsị"],
    "Listen": ["Saurara", "Gbọ́", "Gee ntị"],
    "Previous": ["Na baya", "Èyí tó ṣáájú", "Nke gara aga"],
    "Next": ["Na gaba", "Èyí tó kàn", "Nke na-esote"],
    "Pause": ["Dakata", "Dá dúró", "Kwụsịtụ"],
    "Play": ["Kunna", "Bẹ̀rẹ̀", "Gbaa"],
    "Welcome": ["Barka da zuwa", "Ẹ káàbọ̀", "Nnọọ"],
    "Text size": ["Girman rubutu", "Ìtóbi lẹ́tà", "Nha mkpụrụedemede"],
    "Normal text": ["Rubutu na yau da kullum", "Lẹ́tà àṣà", "Mkpụrụedemede nkịtị"],
    "Large text": ["Babban rubutu", "Lẹ́tà ńlá", "Mkpụrụedemede buru ibu"],
    "Largest text": ["Rubutu mafi girma", "Lẹ́tà tó tóbi jù", "Mkpụrụedemede kacha ibu"],
    "Type what you are looking for": ["Rubuta abin da kake nema", "Kọ ohun tí ò ń wá", "Dee ihe ị na-achọ"],
    "Open": ["Buɗe", "Ṣí i", "Mepee"],
    "Not retired yet? I am…": ["Ba ka yi ritaya ba tukuna? Ni ne…", "O kò tíì fẹ̀yìntì? Èmi ni…", "Ị lagheghị ezumike nka? Abụ m…"],
    "Still working": ["Har yanzu ina aiki", "Mo ṣì ń ṣiṣẹ́", "M ka na-arụ ọrụ"],
    "What would you like to do today?": ["Me kake son yi yau?", "Kí lo fẹ́ ṣe lónìí?", "Gịnị ka ị ga-achọ ime taa?"],
    "today": ["yau", "lónìí", "taa"],
    "Get my retirement benefits": ["Karɓi haƙƙoƙin ritayata", "Gba owó ìfẹ̀yìntì mi", "Nweta ego ezumike nka m"],
    "What to prepare and how you will be paid.": ["Abin da za ka shirya da yadda za a biya ka.", "Ohun tí o máa pèsè àti bí wọ́n ṣe máa sanwó fún ọ.", "Ihe ị ga-akwadebe na otú a ga-esi kwụọ gị."],
    "Health cover for retirees under the scheme.": ["Inshorar lafiya ga masu ritaya ƙarƙashin tsarin.", "Ìbánigbófò ìlera fún àwọn tó ti fẹ̀yìntì lábẹ́ ètò náà.", "Mkpuchi ahụike maka ndị lara ezumike nka n'okpuru atụmatụ ahụ."],
    "Find my PFA": ["Nemo PFA ɗina", "Wá PFA mi", "Chọta PFA m"],
    "The company that keeps and pays your pension.": ["Kamfanin da ke riƙe da biyan fanshonka.", "Ilé-iṣẹ́ tó ń tọ́jú tí ó sì ń san owó ìfẹ̀yìntì rẹ.", "Ụlọ ọrụ na-echekwa ma na-akwụ ego ezumike nka gị."],
    "Documents I need": ["Takardun da nake bukata", "Àwọn ìwé tí mo nílò", "Akwụkwọ m chọrọ"],
    "Simple checklists you can print.": ["Jerin abubuwa masu sauƙi da za ka iya bugawa.", "Àkójọ tó rọrùn tí o lè tẹ̀ jáde.", "Ndepụta dị mfe ị nwere ike ibipụta."],
    "Find an office near me": ["Nemo ofishi kusa da ni", "Wá ọ́fíìsì tó súnmọ́ mi", "Chọta ọfịs dị m nso"],
    "Addresses and phone numbers of our offices.": ["Adireshi da lambobin wayar ofisoshinmu.", "Àdírẹ́sì àti nọ́ńbà fóònù àwọn ọ́fíìsì wa.", "Adreesị na nọmba ekwentị nke ọfịs anyị."],
    "Tell us about a problem with your pension.": ["Faɗa mana matsalar da kake da ita game da fanshonka.", "Sọ fún wa nípa ìṣòro owó ìfẹ̀yìntì rẹ.", "Gwa anyị maka nsogbu gbasara ezumike nka gị."],
    "An older man with a younger relative": ["Wani dattijo tare da wata 'yar uwarsa matashiya", "Àgbàlagbà ọkùnrin kan pẹ̀lú ìbátan rẹ̀ tó kéré", "Agadi nwoke na onye ikwu ya nke tọrọ ntakịrị"],
    "PenCom staff will never ask for your RSA PIN, password or bank details.": ["Ma'aikatan PenCom ba za su taɓa neman RSA PIN, kalmar sirri ko bayanan bankinka ba.", "Òṣìṣẹ́ PenCom kò ní béèrè RSA PIN, ọ̀rọ̀ aṣínà tàbí àlàyé ilé ìfowópamọ́ rẹ láéláé.", "Ndị ọrụ PenCom agaghị arịọ RSA PIN gị, okwuntughe ma ọ bụ nkọwa ụlọ akụ gị."],
    "For retirees": ["Ga masu ritaya", "Fún àwọn tó ti fẹ̀yìntì", "Maka ndị lara ezumike nka"],
    "Getting your pension in three steps": ["Karɓar fanshonka a matakai uku", "Gbígba owó ìfẹ̀yìntì rẹ ní ìgbésẹ̀ mẹ́ta", "Inweta ego ezumike nka gị n'ụzọ atọ"],
    "three steps": ["matakai uku", "ìgbésẹ̀ mẹ́ta", "ụzọ atọ"],
    "Step {n}": ["Mataki na {n}", "Ìgbésẹ̀ {n}", "Nzọụkwụ {n}"],
    "A regular amount through your PFA (programmed withdrawal), or an income for life from an insurer (annuity).": [
        "Adadi na yau da kullum ta hannun PFA ɗinka (programmed withdrawal), ko kuɗin shiga na rayuwa daga kamfanin inshora (annuity).",
        "Iye kan déédéé nípasẹ̀ PFA rẹ (programmed withdrawal), tàbí owó tí ń wọlé títí ayé láti ilé-iṣẹ́ ìbánigbófò (annuity).",
        "Ego oge niile site n'aka PFA gị (programmed withdrawal), ma ọ bụ ego na-abata ruo ndụ gị niile site n'ụlọ ọrụ mkpuchi (annuity)."],
    "Your PFA pays into your bank account. If there are delays, contact your PFA first, then PenCom.": [
        "PFA ɗinka zai biya cikin asusun bankinka. Idan aka samu jinkiri, tuntuɓi PFA ɗinka da farko, sannan PenCom.",
        "PFA rẹ yóò san owó sínú àkáǹtì ilé ìfowópamọ́ rẹ. Tí ìdádúró bá wà, kàn sí PFA rẹ kọ́kọ́, lẹ́yìn náà PenCom.",
        "PFA gị ga-akwụ ego n'akaụntụ ụlọ akụ gị. Ọ bụrụ na igbu oge adị, buru ụzọ kpọtụrụ PFA gị, mgbe ahụ PenCom."],
    "Read the full guide": ["Karanta cikakken jagora", "Ka ìtọ́sọ́nà kíkún", "Gụọ ntuziaka zuru ezu"],
    "Important notices": ["Muhimman sanarwoyi", "Àwọn ìkéde pàtàkì", "Ọkwa dị mkpa"],
    "Latest news from PenCom": ["Sabbin labarai daga PenCom", "Ìròyìn tuntun láti PenCom", "Akụkọ ọhụrụ sitere na PenCom"],
    "All news": ["Duk labarai", "Gbogbo ìròyìn", "Akụkọ niile"],
    "Read more": ["Ƙara karantawa", "Kà sí i", "Gụkwuo"],
    "Email us": ["Aiko mana da imel", "Fi ímeèlì ránṣẹ́ sí wa", "Zitere anyị email"],
    "Visit an office": ["Ziyarci ofishi", "Ṣèbẹ̀wò sí ọ́fíìsì", "Bịa n'ọfịs"],
    "Head office in Abuja and offices in every zone": ["Babban ofishi a Abuja da ofisoshi a kowace shiyya", "Olú ọ́fíìsì ní Abuja àti ọ́fíìsì ní gbogbo ẹkùn", "Isi ọfịs n'Abuja na ọfịs na mpaghara ọ bụla"],
    "Quick answers in plain language": ["Amsoshi cikin sauri da harshe mai sauƙi", "Ìdáhùn kíákíá ní èdè tó rọrùn", "Azịza ngwa ngwa n'asụsụ dị mfe"],
    "We are here to help": ["Muna nan don taimaka maka", "A wà níbí láti ràn ọ́ lọ́wọ́", "Anyị nọ ebe a inyere gị aka"],
    "help": ["taimaka maka", "ràn ọ́ lọ́wọ́", "inyere gị aka"],
}
for i, lang in enumerate(L):
    p = src / f"i18n/dict/{lang}.ts"
    s = p.read_text()
    add = "".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},\n" for k, v in new.items() if json.dumps(k, ensure_ascii=False) + ":" not in s)
    if add:
        j = s.rindex("};")
        s = s[:j] + "\n  /* Homepage, retiree-friendly design */\n" + add + s[j:]
        p.write_text(s)
    print("ok dict", lang)
