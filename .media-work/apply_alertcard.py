import json,re
p='src/pages/homemodern/Hero.tsx';s=open(p).read()
if 'AlertBanner' not in s:
    s=s.replace('import { cn } from "@/lib/utils";','import AlertBanner from "@/components/AlertBanner";\nimport { cn } from "@/lib/utils";',1)
    a='        {/* words on a solid card, never on the busy photo */}'
    assert a in s
    s=s.replace(a,'        {/* alerts float over the slide, below the progress bar */}\n        <AlertBanner className="inset-x-3 top-16 sm:inset-x-4" />\n\n'+a,1)
    open(p,'w').write(s)
p='src/pages/HomeModern.tsx';s=open(p).read()
s=s.replace('        <Alerts />\n','')
s=s.replace('import { Alerts, Circulars,','import { Circulars,')
s=s.replace('(3) important alerts →','(3) important alerts (floating card over the slider, plus the header bell) →')
open(p,'w').write(s)
p='src/pages/homemodern/Sections.tsx';s=open(p).read()
for a,b in [('02','01'),('03','02'),('04','03'),('05','04'),('06','05')]:
    s=s.replace(f'n="{a}"',f'n="{b}"',1)
open(p,'w').write(s)
D={'ha':"Faɗakarwar da aka rufe na nan a cikin ƙararrawa a saman shafi.",'yo':"Àwọn ìkìlọ̀ tí o ti pa dé ṣì wà nínú agogo ní òkè ojú-ìwé.",'ig':"Ọkwa ndị emechiri ka dị na mgbịrịgba dị n'elu ibe a."}
k="Closed alerts stay in the bell at the top of the page."
for l,v in D.items():
    p=f'src/i18n/dict/{l}.ts';s=open(p).read()
    if json.dumps(k)+':' not in s:
        i=s.rindex('};');s=s[:i]+f'  {json.dumps(k)}: {json.dumps(v,ensure_ascii=False)},\n'+s[i:];open(p,'w').write(s)
print('ok')
