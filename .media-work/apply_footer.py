import json
D={
"Site footer":("Ƙasan shafi","Ìsàlẹ̀ ojú-ìwé","Ala ibe"),
"Stay informed":("Ci gaba da samun labari","Máa gbọ́ ìròyìn","Nọgide na-anụ ozi"),
"Pension news, straight to":("Labaran fansho, kai tsaye zuwa","Ìròyìn owó ìfẹ̀yìntì, tààrà sí","Akụkọ ụgwọ ezumike, ozugbo na"),
"your inbox":("akwatin saƙonka","àpótí ìmeèlì rẹ","igbe ozi gị"),
"Circulars, deadlines and new services, about once a month. No spam, unsubscribe at any time.":("Sanarwoyi, wa'adi da sabbin ayyuka, kusan sau ɗaya a wata. Babu saƙon banza, za ka iya daina karɓa a kowane lokaci.","Àwọn ìkéde, ọjọ́ ìparí àti iṣẹ́ tuntun, ní ẹ̀ẹ̀kan lóṣù. Kò sí ìmeèlì àìnílò, o lè dáwọ́ dúró nígbàkígbà.","Akwụkwọ ozi, oge njedebe na ọrụ ọhụrụ, ihe dị ka otu ugboro n'ọnwa. Enweghị ozi efu, ị nwere ike ịkwụsị oge ọ bụla."),
"Email address":("Adireshin imel","Àdírẹ́sì ìmeèlì","Adreesị email"),
"Subscribe":("Yi rajista","Forúkọsílẹ̀","Debanye aha"),
"Thank you. Check your inbox to confirm your subscription.":("Na gode. Duba akwatin saƙonka don tabbatar da rajistarka.","O ṣeun. Wo àpótí ìmeèlì rẹ láti jẹ́rìí ìforúkọsílẹ̀ rẹ.","Daalụ. Lelee igbe ozi gị iji kwado ndebanye aha gị."),
"Get the app":("Sami manhajar","Gba áàpù náà","Nweta ngwa a"),
"Follow us":("Bi mu","Tẹ̀lé wa","Soro anyị"),
"Download on the":("Sauke a","Gbà á lórí","Budata na"),
"Get it on":("Samu a","Gbà á lórí","Nweta ya na"),
"Head office":("Babban ofis","Olú ilé-iṣẹ́","Isi ụlọ ọrụ"),
"Call us":("Kira mu","Pè wá","Kpọọ anyị"),
"Email us":("Aiko mana imel","Fi ìmeèlì ránṣẹ́ sí wa","Zitere anyị email"),
"Online services":("Ayyukan yanar gizo","Àwọn iṣẹ́ orí ayélujára","Ọrụ ịntanetị"),
"Contributions":("Gudummawa","Owó àfikún","Onyinye"),
"Retiree health cover":("Inshorar lafiya ta masu ritaya","Ìbánigbófò ìlera fún àwọn tí ó ti fẹ̀yìntì","Mkpuchi ahụike ndị lara ezumike nká"),
"Pension capital":("Jarin fansho","Olú owó ìfẹ̀yìntì","Isi ego ụgwọ ezumike"),
"Remit contributions":("Tura gudummawa","San owó àfikún","Kwụọ onyinye"),
"Back to top":("Koma sama","Padà sí òkè","Laghachi n'elu"),
"(opens in a new tab)":("(yana buɗewa a sabon shafi)","(ó ṣí sí táàbù tuntun)","(na-emepe na taabụ ọhụrụ)"),
}
for i,l in enumerate(['ha','yo','ig']):
    q=f'src/i18n/dict/{l}.ts';t=open(q).read();add=''
    for k,v in D.items():
        if json.dumps(k,ensure_ascii=False)+':' not in t:
            add+=f'  {json.dumps(k,ensure_ascii=False)}: {json.dumps(v[i],ensure_ascii=False)},\n'
    j=t.rindex('};');t=t[:j]+add+t[j:];open(q,'w').write(t);print(l,add.count('\n'))
