import os, re, shutil
S=os.path.expanduser('~/mnt/pencom/Pencom_Website_2/app/src')
T=os.path.expanduser('~/mnt/Designs/Pencom_Website_2/app/src')
assert os.path.exists(f'{T}/components/ReportGovBadge.tsx')
# alert card (unused elsewhere in this copy) -> compact version
shutil.copyfile(f'{S}/components/AlertBanner.tsx', f'{T}/components/AlertBanner.tsx')
# slider: separate file so /home-classic keeps its own hero
shutil.copyfile(f'{S}/pages/home/HomeHero.tsx', f'{T}/pages/home/HomeHeroShowcase2.tsx')
s=open(f'{S}/pages/Home.tsx').read()
s=s.replace('import HomeHero from "./home/HomeHero";','import HomeHero from "./home/HomeHeroShowcase2";')
assert 'HomeHeroShowcase2' in s
s=s.replace('export default function Home()','export default function HomeShowcase2()')
s=s.replace(' * Home — redesigned.',' * Home, "showcase 2" (/home-showcase2): the full-width slider homepage from the ~/Projects/pencom copy,\n * with the alert card floating over the slider (a one-line bar on phones).\n * Home — redesigned.',1)
open(f'{T}/pages/HomeShowcase2.tsx','w').write(s)
p=f'{T}/App.tsx'; a=open(p).read()
if 'HomeShowcase2' not in a:
    a=a.replace("import HomeShowcase from './pages/HomeShowcase'","import HomeShowcase from './pages/HomeShowcase'\nimport HomeShowcase2 from './pages/HomeShowcase2'",1)
    a=a.replace('        <Route path="/home-showcase" element={<HomeShowcase />} />\n','        <Route path="/home-showcase" element={<HomeShowcase />} />\n        <Route path="/home-showcase2" element={<HomeShowcase2 />} />\n',1)
    assert 'path="/home-showcase2"' in a and 'import HomeShowcase2' in a
    open(p,'w').write(a)
p=f'{T}/components/layout/Layout.tsx'; a=open(p).read()
if '"/home-showcase2"' not in a:
    a=a.replace('"/home-showcase", ','"/home-showcase", "/home-showcase2", ',1)
    assert '"/home-showcase2"' in a
    open(p,'w').write(a)
line=re.compile(r'^\s+("(?:[^"\\]|\\.)*")\s*:\s*(".*"),\s*$')
for l in ['ha','yo','ig']:
    src=open(f'{S}/i18n/dict/{l}.ts').read().splitlines()
    p=f'{T}/i18n/dict/{l}.ts'; t=open(p).read()
    have=set(m.group(1) for m in (line.match(x) for x in t.splitlines()) if m)
    add=[]
    for x in src:
        m=line.match(x)
        if m and m.group(1) not in have:
            add.append(f'  {m.group(1)}: {m.group(2)},'); have.add(m.group(1))
    if add:
        i=t.rindex('};'); t=t[:i]+'  /* ── Home, showcase 2 (from ~/Projects/pencom) ── */\n'+'\n'.join(add)+'\n'+t[i:]
        open(p,'w').write(t)
    print(l,len(add))
print('ok')
