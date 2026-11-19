import sys, pathlib
root = pathlib.Path(sys.argv[1]); fails=[]
def edit(rel, pairs):
    p=root/rel; s=p.read_text()
    for a,b in pairs:
        if a not in s: fails.append(f"{rel}: {a[:60]}")
        s=s.replace(a,b,1)
    p.write_text(s)
edit("App.tsx",[("import NotFound from './pages/NotFound'","import NotFound from './pages/NotFound'\nimport Chronicles from './pages/Chronicles'"),
 ('        <Route path="/news/:slug" element={<Article />} />','        <Route path="/news/:slug" element={<Article />} />\n        <Route path="/chronicles" element={<Chronicles />} />\n        <Route path="/resources/chronicles" element={<Navigate to="/chronicles" replace />} />')])
edit("lib/data.ts",[('            { label: "General Publications", href: "/resources#general" },','            { label: "General Publications", href: "/resources#general" },\n            { label: "PenCom Chronicles", href: "/chronicles" },')])
edit("components/layout/Footer.tsx",[('    { label: "Publications", href: "/resources#publications" },','    { label: "Publications", href: "/resources#publications" },\n    { label: "PenCom Chronicles", href: "/chronicles" },')])
print("FAILS", fails) if fails else print("ok")
