import sys, json
designs = sys.argv[1] == "designs"
homes = [
  ("Main homepage", "/", "For everyone: audience picker, search and a compact slider"),
  ("Showcase", "/home-showcase", "Cinematic banner, expanding audience cards and spotlight effects"),
  ("Full-width slider", "/home-showcase2", "Large photo slider with alerts floating over it"),
  ("For retirees", "/home-retirees", "Large type, labelled controls and fewer choices"),
  ("Minimal", "/home-minimal", "Quiet layout with lots of white space"),
  ("Classic", "/home-classic", "The earlier full-width slider design"),
] if designs else [
  ("Main homepage", "/", "Large photo slider with alerts floating over it"),
  ("For everyone", "/home-showcase2", "Audience picker, search and a compact slider"),
]
links = "\n".join(f'            {{ label: {json.dumps(l)}, href: {json.dumps(h)}, note: {json.dumps(n)} }},' for l,h,n in homes)
match = ", ".join(json.dumps(h) for _,h,_ in homes)

p='src/lib/data.ts'; s=open(p).read()
old='''  {
    label: "Home",
    href: "/",
    icon: "Home",
    description: "Official homepage",
  },'''
assert old in s, "home item"
s=s.replace(old,f'''  {{
    label: "Home",
    href: "/",
    icon: "Home",
    description: "Official homepage",
    // Every homepage design, so reviewers can compare them. "Home" stays highlighted on each.
    match: [{match}],
    megaMenu: {{
      columns: [
        {{
          title: "Homepage designs",
          links: [
{links}
          ],
        }},
      ],
    }},
  }},''',1)
open(p,'w').write(s)

p='src/components/layout/Header.tsx'; s=open(p).read()
R=[
# active state: also on the item's other pages (Home designs)
('''                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === item.href''','''                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === item.href || item.match?.includes(location.pathname)'''),
# dropdown sized to its number of columns; a single column sits under its item, not centred
('''                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                      >
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 min-w-[640px]">
                          <div className="grid grid-cols-3 gap-6">''','''                        className={`absolute top-full pt-2 ${item.megaMenu.columns.length === 1 ? "left-0" : "left-1/2 -translate-x-1/2"}`}
                      >
                        <div className={`bg-white rounded-xl shadow-xl border border-gray-100 ${item.megaMenu.columns.length === 1 ? "p-3 w-[22rem]" : "p-6 min-w-[640px]"}`}>
                          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${item.megaMenu.columns.length}, minmax(0, 1fr))` }}>'''),
('''                                      <Link
                                        to={link.href}
                                        className="text-sm text-gray-600 hover:text-[#117F21] hover:bg-[#F5F5F5] rounded-md px-2 py-1.5 block transition-colors"
                                      >
                                        {link.label}
                                      </Link>''','''                                      <Link
                                        to={link.href}
                                        aria-current={location.pathname === link.href ? "page" : undefined}
                                        className={`text-sm rounded-md px-2 py-1.5 block transition-colors ${
                                          location.pathname === link.href ? "bg-[#E8F5E9] text-[#117F21]" : "text-gray-600 hover:text-[#117F21] hover:bg-[#F5F5F5]"
                                        }`}
                                      >
                                        <span className={(link as { note?: string }).note ? "font-semibold" : undefined}>{link.label}</span>
                                        {(link as { note?: string }).note && (
                                          <span className="mt-0.5 block text-xs font-normal leading-snug text-gray-500">{(link as { note?: string }).note}</span>
                                        )}
                                      </Link>'''),
# mobile: active state + show every link when the item has a single column
('''                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.href''','''                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.href || item.match?.includes(location.pathname)'''),
('''                        col.links.slice(0, 3).map((link) => (
                          <Link
                            key={link.label}
                            to={link.href}
                            className="block px-3 py-2 text-sm text-gray-500 hover:text-[#117F21] rounded-md"
                          >''','''                        col.links.slice(0, item.megaMenu!.columns.length === 1 ? undefined : 3).map((link) => (
                          <Link
                            key={link.label}
                            to={link.href}
                            aria-current={location.pathname === link.href ? "page" : undefined}
                            className={`block px-3 py-2 text-sm rounded-md ${location.pathname === link.href ? "font-semibold text-[#117F21]" : "text-gray-500 hover:text-[#117F21]"}`}
                          >'''),
]
for a,b in R:
    assert a in s, a[:80]; s=s.replace(a,b,1)
open(p,'w').write(s)

T={"Homepage designs":("Zane-zanen shafin farko","Àwọn àpẹẹrẹ ojú-ìwé àkọ́kọ́","Nhazi ibe mbụ"),
"Main homepage":("Babban shafin farko","Ojú-ìwé àkọ́kọ́ pàtàkì","Isi ibe mbụ"),
"Showcase":("Nuni","Àfihàn","Ngosipụta"),
"Full-width slider":("Hotuna masu faɗi","Àwòrán gbígbòòrò","Foto sara mbara"),
"For retirees":("Don masu ritaya","Fún àwọn tí ó ti fẹ̀yìntì","Maka ndị lara ezumike nká"),
"Minimal":("Mai sauƙi","Ìrọ̀rùn","Dị mfe"),
"Classic":("Na da","Ti àtijọ́","Ochie"),
"For everyone":("Don kowa","Fún gbogbo ènìyàn","Maka onye ọ bụla"),
"For everyone: audience picker, search and a compact slider":("Don kowa: zaɓin masu amfani, bincike da ƙaramin hoto mai juyawa","Fún gbogbo ènìyàn: àṣàyàn olùlò, ìwádìí àti àwòrán kékeré","Maka onye ọ bụla: nhọrọ ndị ọrụ, ọchụchọ na obere foto"),
"Cinematic banner, expanding audience cards and spotlight effects":("Babban hoto, katunan masu amfani masu faɗaɗa da tasirin haske","Àwòrán ńlá, káàdì olùlò tó ń fẹ̀ àti ìmọ́lẹ̀ àfihàn","Nnukwu foto, kaadị ndị ọrụ na-agbasa na mmetụta ọkụ"),
"Large photo slider with alerts floating over it":("Babban hoto mai juyawa tare da faɗakarwa a samansa","Àwòrán ńlá tó ń yí pẹ̀lú ìkìlọ̀ lórí rẹ̀","Nnukwu foto na-agbanwe nwere ọkwa n'elu ya"),
"Large type, labelled controls and fewer choices":("Babban rubutu, maɓallai masu suna da ƙarancin zaɓi","Ọ̀rọ̀ ńlá, bọ́tìnnì pẹ̀lú orúkọ àti àṣàyàn díẹ̀","Mkpụrụedemede buru ibu, njikwa nwere aha na nhọrọ ole na ole"),
"Quiet layout with lots of white space":("Tsari mai natsuwa da sarari mai yawa","Ìtò píparọ́rọ́ pẹ̀lú àyè púpọ̀","Nhazi dị jụụ nwere ọtụtụ oghere"),
"The earlier full-width slider design":("Zanen farko mai hoto mai faɗi","Àpẹẹrẹ àtijọ́ pẹ̀lú àwòrán gbígbòòrò","Nhazi mbụ nwere foto sara mbara"),
"Audience picker, search and a compact slider":("Zaɓin masu amfani, bincike da ƙaramin hoto mai juyawa","Àṣàyàn olùlò, ìwádìí àti àwòrán kékeré","Nhọrọ ndị ọrụ, ọchụchọ na obere foto"),
}
for i,l in enumerate(['ha','yo','ig']):
    q=f'src/i18n/dict/{l}.ts';t=open(q).read();add=''
    for k,v in T.items():
        if json.dumps(k,ensure_ascii=False)+':' not in t:
            add+=f'  {json.dumps(k,ensure_ascii=False)}: {json.dumps(v[i],ensure_ascii=False)},\n'
    j=t.rindex('};');t=t[:j]+'  /* ── Home menu ── */\n'+add+t[j:];open(q,'w').write(t)
print('ok')
