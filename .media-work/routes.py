import sys, pathlib
root = pathlib.Path(sys.argv[1]); fails=[]
def edit(rel, pairs):
    p=root/rel; s=p.read_text()
    for a,b in pairs:
        if a not in s: fails.append(f"{rel}: {a[:60]}")
        s=s.replace(a,b,1)
    p.write_text(s)
edit("App.tsx",[("import Chronicles from './pages/Chronicles'","import Chronicles from './pages/Chronicles'\nimport Media from './pages/Media'"),
 ('        <Route path="/chronicles" element={<Chronicles />} />','        <Route path="/chronicles" element={<Chronicles />} />\n        <Route path="/media" element={<Media />} />')])
edit("components/layout/Footer.tsx",[('    { label: "PenCom Chronicles", href: "/chronicles" },','    { label: "PenCom Chronicles", href: "/chronicles" },\n    { label: "Photos and videos", href: "/media" },')])
edit("pages/connect/Sections.tsx",[
 ('  { k: "Photos", icon: ImageIcon },','  { k: "Photos", icon: ImageIcon, to: "/media#photos" },'),
 ('  { k: "Videos", icon: Video },','  { k: "Videos", icon: Video, to: "/media#videos" },'),
 ('''              <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700">
                <m.icon className="h-4 w-4 text-[#117F21]" aria-hidden="true" /> {m.k}
              </span>''','''              {"to" in m && m.to ? (
                <Link to={m.to} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#117F21]/40 bg-[#E8F5E9] px-4 text-sm font-semibold text-[#0A4A13] transition hover:bg-[#117F21] hover:text-white">
                  <m.icon className="h-4 w-4" aria-hidden="true" /> {m.k} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700">
                  <m.icon className="h-4 w-4 text-[#117F21]" aria-hidden="true" /> {m.k}
                </span>
              )}'''),
])
print("FAILS", fails) if fails else print("ok")
