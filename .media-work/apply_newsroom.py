import json, os, shutil
W='.media-work/newsroom'
os.makedirs('src/pages/newsroom', exist_ok=True)
shutil.copyfile(f'{W}/data.ts','src/pages/newsroom/data.ts')
shutil.copyfile(f'{W}/parts.tsx','src/pages/newsroom/parts.tsx')
shutil.copyfile(f'{W}/NewsCatalog.tsx','src/pages/NewsCatalog.tsx')

p='src/App.tsx'; a=open(p).read()
old='        <Route path="/news" element={<Navigate to={{ pathname: "/connect", hash: "news" }} replace />} />\n'
if old in a:
    a=a.replace(old,'        <Route path="/news" element={<NewsCatalog />} />\n')
    a=a.replace("import Article from './pages/news/Article'","import Article from './pages/news/Article'\nimport NewsCatalog from './pages/NewsCatalog'",1)
    open(p,'w').write(a)
assert 'element={<NewsCatalog />}' in open(p).read()

for f in ['src/pages/homemodern/Sections.tsx','src/pages/Chronicles.tsx','src/pages/homecalm/Sections.tsx','src/pages/homeminimal/Sections.tsx','src/pages/Media.tsx','src/pages/home/Stories.tsx','src/pages/homeshowcase/Sections.tsx']:
    s=open(f).read(); n=s.count('"/connect#news"'); s=s.replace('"/connect#news"','"/news"'); open(f,'w').write(s); print(f,n)

p='src/pages/connect/Sections.tsx'; s=open(p).read()
old='<p className="mt-4 text-xs text-gray-500">News items are placeholders until the newsroom is connected to the CMS.</p>'
if old in s:
    s=s.replace(old,'''<div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-500">News items are placeholders until the newsroom is connected to the CMS.</p>
          <Link to="/news" className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 font-semibold text-white transition hover:bg-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
            Open the newsroom
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>''')
    open(p,'w').write(s); print('connect ok')

D={
"News and updates from PenCom":("Labarai da sabbin bayanai daga PenCom","Ìròyìn àti ìmúdójúìwọ̀n láti PenCom","Akụkọ na mmelite sitere na PenCom"),
"Newsroom":("Ɗakin labarai","Yàrá ìròyìn","Ụlọ akụkọ"),
"Press releases, statements, reports and media coverage from the National Pension Commission, newest first.":("Sanarwoyin manema labarai, bayanai, rahotanni da labaran kafofin watsa labarai daga Hukumar Fansho ta Ƙasa, sabbi a gaba.","Àwọn ìkéde fún oníròyìn, ọ̀rọ̀ ìkéde, ìròyìn àti àgbéjáde oníròyìn láti ọ̀dọ̀ Àjọ Owó Ìfẹ̀yìntì ti Orílẹ̀-èdè, tuntun ló kọ́kọ́.","Ọkwa nye ndị nta akụkọ, nkwupụta, akụkọ na mkpuchi mgbasa ozi sitere na National Pension Commission, ndị ọhụrụ na mbụ."),
"Search the news":("Bincika labarai","Wá nínú ìròyìn","Chọọ n'akụkọ"),
"Search the news, e.g. “Pencare” or “report”":("Bincika labarai, misali “Pencare” ko “rahoto”","Wá ìròyìn, fún àpẹẹrẹ “Pencare” tàbí “ìròyìn”","Chọọ akụkọ, dịka “Pencare” ma ọ bụ “akụkọ”"),
"Clear search":("Share bincike","Pa ìwádìí rẹ́","Hichapụ ọchụchọ"),
"Stories":("Labarai","Ìtàn","Akụkọ"),
"Media reports":("Rahotannin kafofin watsa labarai","Ìròyìn oníròyìn","Akụkọ mgbasa ozi"),
"Photos":("Hotuna","Àwòrán","Foto"),
"Top story":("Babban labari","Ìròyìn pàtàkì","Akụkọ kachasị"),
"Read the story":("Karanta labarin","Ka ìtàn náà","Gụọ akụkọ a"),
"Watch the report":("Kalli rahoton","Wo ìròyìn náà","Lelee akụkọ a"),
"All news":("Dukkan labarai","Gbogbo ìròyìn","Akụkọ niile"),
"Browse every story":("Duba kowane labari","Wo gbogbo ìtàn","Lelee akụkọ ọ bụla"),
"every story":("kowane labari","gbogbo ìtàn","akụkọ ọ bụla"),
"Filter by type or year, or search. Your choices stay in the page address, so you can share the view.":("Tace ta nau'i ko shekara, ko ka bincika. Zaɓinka na nan a adireshin shafin, don haka za ka iya raba shi.","Ṣàlẹ̀ nípa irú tàbí ọdún, tàbí wá. Àṣàyàn rẹ máa wà nínú àdírẹ́sì ojú-ìwé, kí o lè pín in.","Họchaa site n'ụdị ma ọ bụ afọ, ma ọ bụ chọọ. Nhọrọ gị na-anọ n'adreesị ibe a, ka ị nwee ike ịkesa ya."),
"Type of news":("Nau'in labari","Irú ìròyìn","Ụdị akụkọ"),
"All":("Duka","Gbogbo","Niile"),
"Press releases":("Sanarwoyin manema labarai","Ìkéde fún oníròyìn","Ọkwa nye ndị nta akụkọ"),
"Statements":("Bayanai","Ọ̀rọ̀ ìkéde","Nkwupụta"),
"Speeches":("Jawabai","Ọ̀rọ̀ àsọyé","Okwu"),
"Events":("Taruka","Ìṣẹ̀lẹ̀","Mmemme"),
"Reports":("Rahotanni","Ìròyìn","Akụkọ"),
"Regulation":("Ka'ida","Ìlànà","Iwu"),
"Media coverage":("Labaran kafofin watsa labarai","Àgbéjáde oníròyìn","Mkpuchi mgbasa ozi"),
"Press release":("Sanarwa ga manema labarai","Ìkéde fún oníròyìn","Ọkwa nye ndị nta akụkọ"),
"Statement":("Bayani","Ọ̀rọ̀ ìkéde","Nkwupụta"),
"Speech":("Jawabi","Ọ̀rọ̀ àsọyé","Okwu"),
"Event":("Taro","Ìṣẹ̀lẹ̀","Mmemme"),
"Year":("Shekara","Ọdún","Afọ"),
"All years":("Dukkan shekaru","Gbogbo ọdún","Afọ niile"),
"Sort":("Jera","Tò","Hazie"),
"Newest first":("Sabbi a gaba","Tuntun ló kọ́kọ́","Ndị ọhụrụ na mbụ"),
"Oldest first":("Tsofaffi a gaba","Àtijọ́ ló kọ́kọ́","Ndị ochie na mbụ"),
"Layout":("Tsari","Ìtò","Nhazi"),
"Cards":("Katuna","Káàdì","Kaadị"),
"List":("Jeri","Àkójọ","Ndepụta"),
"Showing {n} of {total} items":("Ana nuna {n} cikin {total}","Ń fi {n} hàn nínú {total}","Na-egosi {n} n'ime {total}"),
"for “{q}”":("don “{q}”","fún “{q}”","maka “{q}”"),
"Clear filters":("Share matatun","Pa àṣàlẹ̀ rẹ́","Hichapụ nhọcha"),
"Share":("Raba","Pín","Kesaa"),
"Link copied":("An kwafi mahaɗa","A ti da ìsopọ̀ kọ","E depụtala njikọ"),
"No news matches your search":("Babu labarin da ya dace da bincikenka","Kò sí ìròyìn tó bá ìwádìí rẹ mu","Enweghị akụkọ dabara ọchụchọ gị"),
"Try a different word, choose another year, or look in the regulatory library for circulars and guidelines.":("Gwada wata kalma, zaɓi wata shekara, ko duba ɗakin karatu na ka'idoji don sanarwoyi da jagorori.","Gbìyànjú ọ̀rọ̀ mìíràn, yan ọdún mìíràn, tàbí wo ilé-ìkàwé ìlànà fún àwọn ìkéde àti ìtọ́sọ́nà.","Nwaa okwu ọzọ, họrọ afọ ọzọ, ma ọ bụ lelee ọbá akwụkwọ iwu maka akwụkwọ ozi na ntuziaka."),
"Open the library":("Buɗe ɗakin karatu","Ṣí ilé-ìkàwé","Mepee ọbá akwụkwọ"),
"Show more news":("Nuna ƙarin labarai","Fi ìròyìn sí i hàn","Gosi akụkọ ndị ọzọ"),
"News items are drafts until the newsroom is connected to the CMS. Items scheduled for a later date appear automatically on that date.":("Labaran daftari ne har sai an haɗa ɗakin labarai da CMS. Abubuwan da aka tsara don wata rana za su bayyana kai tsaye a wannan rana.","Àwọn ìròyìn jẹ́ àkọ̀pẹ̀ títí a ó fi so yàrá ìròyìn mọ́ CMS. Àwọn tí a ṣètò fún ọjọ́ mìíràn yóò fara hàn fúnra wọn ní ọjọ́ náà.","Akụkọ ndị a bụ nseta ruo mgbe ejikọrọ ụlọ akụkọ na CMS. Ihe ahaziri maka ụbọchị ọzọ ga-apụta onwe ya n'ụbọchị ahụ."),
"Pictures from our events":("Hotuna daga tarukanmu","Àwòrán láti inú ìṣẹ̀lẹ̀ wa","Foto sitere na mmemme anyị"),
"our events":("tarukanmu","ìṣẹ̀lẹ̀ wa","mmemme anyị"),
"Briefings, visits, campaigns and training, captioned so everyone can follow.":("Taron manema labarai, ziyara, gangami da horo, tare da bayanin hoto don kowa ya fahimta.","Ìpàdé oníròyìn, àbẹ̀wò, ìpolongo àti ìdánilẹ́kọ̀ọ́, pẹ̀lú àkọlé kí gbogbo ènìyàn lè tẹ̀lé.","Nzukọ ndị nta akụkọ, nleta, mgbasa na ọzụzụ, nwere nkọwa ka onye ọ bụla ghọta."),
"All photos and videos":("Dukkan hotuna da bidiyo","Gbogbo àwòrán àti fídíò","Foto na vidiyo niile"),
"{n} photos":("Hotuna {n}","Àwòrán {n}","Foto {n}"),
"Media desk":("Teburin manema labarai","Tábìlì oníròyìn","Tebụl mgbasa ozi"),
"For journalists and researchers":("Ga 'yan jarida da masu bincike","Fún àwọn oníròyìn àti olùwádìí","Maka ndị nta akụkọ na ndị nchọpụta"),
"researchers":("masu bincike","olùwádìí","ndị nchọpụta"),
"Ask Corporate Communications for interviews, comments or official figures. Only trust news shared on our verified accounts.":("Nemi Sashen Hulɗa da Jama'a don hira, sharhi ko alƙaluma na hukuma. Ka amince da labaran da aka raba a shafukanmu da aka tabbatar kawai.","Béèrè lọ́wọ́ Ẹ̀ka Ìbánisọ̀rọ̀ fún ìfọ̀rọ̀wánilẹ́nuwò, èrò tàbí ìṣirò ìjọba. Gbẹ́kẹ̀lé ìròyìn tí a pín lórí àwọn àkọọ́lẹ̀ wa tí a ti jẹ́rìí nìkan.","Jụọ Ngalaba Mkparịta Ụka maka mkparịta ụka, nkwupụta ma ọ bụ ọnụọgụ gọọmentị. Tụkwasị obi naanị n'akụkọ e kesara na akaụntụ anyị ekwenyere."),
"Press enquiries":("Tambayoyin manema labarai","Ìbéèrè oníròyìn","Ajụjụ ndị nta akụkọ"),
"Corporate Communications Department":("Sashen Hulɗa da Jama'a","Ẹ̀ka Ìbánisọ̀rọ̀ Ilé-iṣẹ́","Ngalaba Mkparịta Ụka"),
"Verified accounts":("Shafukan da aka tabbatar","Àwọn àkọọ́lẹ̀ tí a jẹ́rìí","Akaụntụ ekwenyere"),
"Data and documents":("Bayanai da takardu","Dátà àti ìwé","Data na akwụkwọ"),
"Industry figures and charts":("Alƙaluman masana'antu da zane-zane","Ìṣirò ilé-iṣẹ́ àti àwòrán àtẹ","Ọnụọgụ ụlọ ọrụ na eserese"),
"Reports and publications":("Rahotanni da wallafe-wallafe","Ìròyìn àti àtẹ̀jáde","Akụkọ na mbipụta"),
"Circulars and regulations":("Sanarwoyi da ka'idoji","Ìkéde àti ìlànà","Akwụkwọ ozi na iwu"),
"Open the newsroom":("Buɗe ɗakin labarai","Ṣí yàrá ìròyìn","Mepee ụlọ akụkọ"),
"News":("Labarai","Ìròyìn","Akụkọ"),
}
for i,l in enumerate(['ha','yo','ig']):
    q=f'src/i18n/dict/{l}.ts';t=open(q).read();add=''
    for k,v in D.items():
        if json.dumps(k,ensure_ascii=False)+':' not in t:
            add+=f'  {json.dumps(k,ensure_ascii=False)}: {json.dumps(v[i],ensure_ascii=False)},\n'
    j=t.rindex('};');t=t[:j]+'  /* ── News catalogue ── */\n'+add+t[j:];open(q,'w').write(t);print(l,add.count('\n'))
print('ok')
