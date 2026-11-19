"""Install the 'for everyone' homepage at / and move the retiree design to /home-retirees. Usage: python3 apply.py <app/src>"""
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
    ("import HomeCalm from './pages/HomeCalm'\n", "import HomeCalm from './pages/HomeCalm'\nimport HomeModern from './pages/HomeModern'\n"),
    ('<Route path="/" element={<HomeCalm />} />', '<Route path="/" element={<HomeModern />} />\n        <Route path="/home-retirees" element={<HomeCalm />} />'),
])
edit("pages/HomeCalm.tsx", [(" The previous design stays at /home-classic.", " Lives at /home-retirees; the main homepage (/) is HomeModern, the first design is /home-classic.")])

new = {
    "Pensions made clear for every Nigerian": ["Fansho a fayyace ga kowane ɗan Najeriya", "Owó ìfẹ̀yìntì tí ó yé gbogbo ọmọ Nàìjíríà", "Ezumike nka doro anya nye onye Naịjirịa ọ bụla"],
    "every Nigerian": ["kowane ɗan Najeriya", "gbogbo ọmọ Nàìjíríà", "onye Naịjirịa ọ bụla"],
    "Tell us who you are and we’ll show you the services people like you use most.": [
        "Faɗa mana kai wane ne, za mu nuna maka ayyukan da mutane kamarka suka fi amfani da su.",
        "Sọ ẹni tí o jẹ́ fún wa, a ó sì fi àwọn iṣẹ́ tí àwọn èèyàn bí ìwọ ń lò jù hàn ọ́.",
        "Gwa anyị onye ị bụ, anyị ga-egosi gị ọrụ ndị dị ka gị na-ejikarị."],
    "Alerts": ["Faɗakarwa", "Ìkìlọ̀", "Ọkwa ịdọ aka na ntị"],
    "Important alerts": ["Muhimman faɗakarwa", "Àwọn ìkìlọ̀ pàtàkì", "Ọkwa ịdọ aka na ntị dị mkpa"],
    "alerts": ["faɗakarwa", "ìkìlọ̀", "Ọkwa ịdọ aka na ntị"],
    "Deadlines and changes that may affect you. The bell at the top of every page keeps these too.": [
        "Wa'adi da sauye-sauyen da za su iya shafarka. Kararrawar da ke saman kowane shafi ma tana ajiye su.",
        "Àwọn ọjọ́ ìgbẹ̀yìn àti àyípadà tó lè kàn ọ́. Agogo tó wà lókè ojú ewé kọ̀ọ̀kan náà ń tọ́jú wọn.",
        "Oge njedebe na mgbanwe nwere ike imetụta gị. Mgbịrịgba dị n'elu peeji ọ bụla na-echekwakwa ha."],
    "Regulatory updates": ["Sabbin ƙa'idoji", "Àwọn ìlànà tuntun", "Mmelite ụkpụrụ"],
    "Latest circulars and guidelines": ["Sabbin sanarwoyin hukuma da jagorori", "Àwọn ìkéde ìjọba àti ìtọ́sọ́nà tuntun", "Ọkwa gọọmentị na ntuziaka kacha ọhụrụ"],
    "circulars": ["sanarwoyin hukuma", "ìkéde ìjọba", "Ọkwa gọọmentị"],
    "Read each one online or download the signed PDF. Every item shows its date, type and who it applies to.": [
        "Karanta kowanne ta intanet ko sauke PDF ɗin da aka sa wa hannu. Kowanne yana nuna kwanan wata, nau'i da wanda ya shafa.",
        "Ka ọ̀kọ̀ọ̀kan lórí ayélujára tàbí gba PDF tí a buwọ́lù sílẹ̀. Ọ̀kọ̀ọ̀kan ń fi ọjọ́, irú àti àwọn tó kàn hàn.",
        "Gụọ nke ọ bụla n'ịntanetị ma ọ bụ budata PDF a bịanyere aka. Nke ọ bụla na-egosi ụbọchị, ụdị na ndị ọ metụtara."],
    "Search every regulation, guideline, circular and code by type, year or subject.": [
        "Bincika kowace ƙa'ida, jagora, sanarwa da kundi ta nau'i, shekara ko batu.",
        "Wá gbogbo ìlànà, ìtọ́sọ́nà, ìkéde àti kóòdù nípa irú, ọdún tàbí kókó.",
        "Chọọ ụkpụrụ, ntuziaka, ọkwa na koodu ọ bụla site n'ụdị, afọ ma ọ bụ isiokwu."],
    "Open the library": ["Buɗe ɗakin ajiya", "Ṣí ilé ìkàwé", "Mepee ọba akwụkwọ"],
    "Read the full Act online": ["Karanta cikakkiyar Dokar ta intanet", "Ka gbogbo Òfin náà lórí ayélujára", "Gụọ Iwu ahụ dum n'ịntanetị"],
    "Not sure which one? Compare the portals": ["Ba ka da tabbas? Kwatanta kafofin", "O kò dá ọ lójú? Fi àwọn ojú òpó wéra", "Ị maghị nke ị ga-eji? Tụnyere ọnụ ụzọ ịntanetị"],
    "News and events": ["Labarai da taruka", "Ìròyìn àti ayẹyẹ", "Akụkọ na mmemme"],
    "What’s happening at PenCom": ["Abin da ke faruwa a PenCom", "Ohun tó ń ṣẹlẹ̀ ní PenCom", "Ihe na-eme na PenCom"],
    "Industry figures": ["Alƙaluman masana'antu", "Nọ́ńbà ilé-iṣẹ́", "Ọnụọgụgụ ụlọ ọrụ"],
    "The pension industry at a glance": ["Masana'antar fansho a taƙaice", "Ilé-iṣẹ́ owó ìfẹ̀yìntì ní ṣókí", "Ụlọ ọrụ ezumike nka na nchịkọta"],
    "Approved figures from PenCom’s published industry reports. Each one shows the date it refers to.": [
        "Alƙaluman da aka amince da su daga rahotannin masana'antu na PenCom. Kowanne yana nuna ranar da ya shafa.",
        "Nọ́ńbà tí a fọwọ́ sí láti inú ìròyìn ilé-iṣẹ́ PenCom. Ọ̀kọ̀ọ̀kan ń fi ọjọ́ tó tọ́ka sí hàn.",
        "Ọnụọgụgụ a kwadoro site n'akụkọ ụlọ ọrụ PenCom bipụtara. Nke ọ bụla na-egosi ụbọchị ọ metụtara."],
    "Source: PenCom industry reports": ["Tushe: rahotannin masana'antu na PenCom", "Orísun: ìròyìn ilé-iṣẹ́ PenCom", "Isi mmalite: akụkọ ụlọ ọrụ PenCom"],
    "Read the Q1 2026 report": ["Karanta rahoton Q1 2026", "Ka ìròyìn Q1 2026", "Gụọ akụkọ Q1 2026"],
    "See industry performance": ["Duba ayyukan masana'antu", "Wo iṣẹ́ ilé-iṣẹ́", "Lee arụmọrụ ụlọ ọrụ"],
    "Questions and how to reach us": ["Tambayoyi da yadda za ka same mu", "Ìbéèrè àti bí o ṣe lè kàn sí wa", "Ajụjụ na otú ị ga-esi kpọtụrụ anyị"],
    "reach us": ["same mu", "kàn sí wa", "kpọtụrụ anyị"],
}
for i, lang in enumerate(["ha", "yo", "ig"]):
    p = src / f"i18n/dict/{lang}.ts"
    s = p.read_text()
    add = "".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v[i], ensure_ascii=False)},\n" for k, v in new.items() if json.dumps(k, ensure_ascii=False) + ":" not in s)
    if add:
        j = s.rindex("};")
        s = s[:j] + "\n  /* Homepage for everyone */\n" + add + s[j:]
        p.write_text(s)
    print("ok dict", lang)
