import re, sys, pathlib

root = pathlib.Path(sys.argv[1])
fails = []

def edit(rel, pairs, regex=False):
    p = root / rel
    s = p.read_text()
    for old, new in pairs:
        if regex:
            s2, n = re.subn(old, new, s, flags=re.S)
        else:
            n = s.count(old)
            s2 = s.replace(old, new)
        if n == 0:
            fails.append(f"{rel}: {old[:70]!r}")
        s = s2
    p.write_text(s)

# A. Routes
edit("App.tsx", [
    ("import { Routes, Route } from 'react-router'", "import { Routes, Route, Navigate } from 'react-router'"),
    ("import Performance from './pages/Performance'", "import Performance from './pages/Performance'\nimport Article from './pages/news/Article'\nimport NotFound from './pages/NotFound'"),
    ('        <Route path="/performance" element={<Performance />} />',
     '        <Route path="/performance" element={<Performance />} />\n'
     '        <Route path="/news" element={<Navigate to={{ pathname: "/connect", hash: "news" }} replace />} />\n'
     '        <Route path="/news/:slug" element={<Article />} />\n'
     '        <Route path="*" element={<NotFound />} />'),
])

# B. Layout: scroll to top on page change; "#chat" opens the assistant from any page
edit("components/layout/Layout.tsx", [
    ('import { Outlet, useLocation } from "react-router";', 'import { useEffect } from "react";\nimport { Outlet, useLocation, useNavigate } from "react-router";'),
    ('  const isHome = location.pathname === "/";',
     '  const isHome = location.pathname === "/";\n'
     '  const navigate = useNavigate();\n'
     '  const { pathname, hash, search } = location;\n\n'
     '  // New page without an anchor: start at the top (pages with an anchor scroll themselves).\n'
     '  useEffect(() => {\n'
     '    if (!hash) window.scrollTo({ top: 0 });\n'
     '    // eslint-disable-next-line react-hooks/exhaustive-deps\n'
     '  }, [pathname]);\n\n'
     '  // Any link ending in #chat (menus, slides, quick links) opens the PenCom Assistant.\n'
     '  useEffect(() => {\n'
     '    if (hash !== "#chat") return;\n'
     '    const t = window.setTimeout(() => document.getElementById("chat-trigger")?.click(), 150);\n'
     '    navigate({ pathname, search }, { replace: true, preventScrollReset: true });\n'
     '    return () => window.clearTimeout(t);\n'
     '  }, [hash, pathname, search, navigate]);'),
])

# C. Navigation data: news comes from the newsroom; menu links point at real sections
edit("lib/data.ts", [
    (r"export const latestNews = \[.*?\n\];\n", 'export { news as latestNews } from "@/pages/news/data";\n'),
], regex=True)
edit("lib/data.ts", [
    ('href: "/services#uncredited"', 'href: "/services#complaint"'),
    ('href: "/services#remittance"', 'href: "/services#portals"'),
    ('href: "/services#pencap"', 'href: "/services#portals"'),
    ('href: "/services#guides"', 'href: "/resources#guides"'),
    ('href: "/operators#pfa-downloads"', 'href: "/resources#downloads"'),
    ('href: "/operators#pfc-downloads"', 'href: "/resources#downloads"'),
    ('href: "/operators#rsa-summary"', 'href: "/performance"'),
    ('href: "/resources#circulars"', 'href: "/regulations?type=Circular#library"'),
    ('href: "/resources#presentations"', 'href: "/resources#learning"'),
    ('href: "/resources#seminars"', 'href: "/resources#learning"'),
])

# D. Services: old anchors still land somewhere useful
edit("pages/services/data.ts", [
    ('export const anchorAlias: Record<string, string> = { micro: "ppp", "rsa-transfer": "rsa-transfer" };',
     'export const anchorAlias: Record<string, string> = { micro: "ppp", "rsa-transfer": "rsa-transfer", uncredited: "complaint", remittance: "portals", pencap: "portals", ehub: "portals" };'),
])

# E. Operators: menu anchors pick the right directory tab; downloads/summary live elsewhere
edit("pages/Operators.tsx", [
    ('import { useEffect } from "react";', 'import { useEffect } from "react";\nimport { useNavigate } from "react-router";'),
    ('''    const target = ["pfas", "pfcs", "cpfas"].includes(id) ? "directory" : id;''',
     '''    if (id === "pfa-downloads" || id === "pfc-downloads") return void navigate("/resources#downloads", { replace: true });
    if (id === "rsa-summary") return void navigate("/performance", { replace: true });
    const target = id in tabFor ? "directory" : id;'''),
    ('  }, [hash, reduce]);', '  }, [hash, reduce, navigate]);'),
    ('  const reduce = useReducedMotion();\n', '  const reduce = useReducedMotion();\n  const navigate = useNavigate();\n  const tabHint = tabFor[hash.replace(/^#/, "")] ?? null;\n', ),
    ('      <Directory onOpen={open} />', '      <Directory onOpen={open} tabHint={tabHint} />'),
    ('export default function Operators() {', 'const tabFor: Record<string, "PFA" | "PFC" | "CPFA" | "Related"> = { pfas: "PFA", "pfa-addresses": "PFA", pfcs: "PFC", cpfas: "CPFA", penop: "Related", ptad: "Related", related: "Related" };\n\nexport default function Operators() {'),
])
edit("pages/operators/Directory.tsx", [
    ('import { useMemo, useState } from "react";', 'import { useEffect, useMemo, useState } from "react";'),
    ('export default function Directory({ onOpen }: { onOpen: (id: string) => void }) {\n  const [tab, setTab] = useState<Tab>("PFA");',
     'export default function Directory({ onOpen, tabHint }: { onOpen: (id: string) => void; tabHint?: Tab | null }) {\n  const [tab, setTab] = useState<Tab>(tabHint ?? "PFA");\n  useEffect(() => {\n    if (tabHint) setTab(tabHint);\n  }, [tabHint]);'),
])

# F. Resources: report-type anchors open the right publications tab
edit("pages/Resources.tsx", [
    ('''    if (id) {
      const t = go(id);''',
     '''    const pubTab: Record<string, string> = { "annual-reports": "annual report", "monthly-reports": "monthly", "quarterly-reports": "quarterly", general: "other" };
    if (id in pubTab) {
      setPubHint(pubTab[id]);
      const t = go("publications");
      return () => window.clearTimeout(t);
    }
    if (id === "presentations" || id === "seminars") {
      const t = go("learning");
      return () => window.clearTimeout(t);
    }
    if (id) {
      const t = go(id);'''),
])
edit("pages/resources/Library.tsx", [
    ('highlight && /annual report/i.test(highlight) ? "Annual reports" : highlight && /monthly/i.test(highlight) ? "Monthly reports" : "Quarterly reports",',
     'highlight && /annual report/i.test(highlight) ? "Annual reports" : highlight && /monthly/i.test(highlight) ? "Monthly reports" : highlight && /^other$/i.test(highlight) ? "Other publications" : "Quarterly reports",'),
])

# G. Footer
edit("components/layout/Footer.tsx", [
    (r'<a\s+href="/mobile"(.*?)</a>', r'<Link\n                  to="/mobile"\1</Link>'),
], regex=True)
edit("components/layout/Footer.tsx", [
    ('href: "/resources#circulars"', 'href: "/regulations?type=Circular#library"'),
    ('<Link to="/resources" className="text-xs text-white/50 hover:text-white transition-colors">\n              Privacy Policy',
     '<Link to="/regulations#policies" className="text-xs text-white/50 hover:text-white transition-colors">\n              Privacy Policy'),
])

# H. Cookie banner
edit("components/CookieConsent.tsx", [
    (r'<a\s+href="#"(.*?)</a>', r'<Link\n                        to="/regulations#policies"\1</Link>'),
], regex=True)
cc = (root / "components/CookieConsent.tsx").read_text()
if 'from "react-router"' not in cc and "from 'react-router'" not in cc:
    (root / "components/CookieConsent.tsx").write_text('import { Link } from "react-router";\n' + cc)

# I. Home news
edit("pages/home/Stories.tsx", [
    ('import { latestNews } from "@/lib/data";', 'import { latestNews } from "@/lib/data";\nimport { newsPath } from "@/pages/news/data";'),
    ('  const [lead, ...rest] = latestNews;', '  const [lead, ...rest] = latestNews.slice(0, 3);'),
    ('            to="/connect"\n            className="group inline-flex min-h-11 w-fit', '            to="/connect#news"\n            className="group inline-flex min-h-11 w-fit'),
    ('              to="/connect"\n              className="group relative block h-full min-h-[420px]', '              to={newsPath(lead)}\n              className="group relative block h-full min-h-[420px]'),
    ('                  to="/connect"\n                  className="group flex h-full gap-5', '                  to={newsPath(n)}\n                  className="group flex h-full gap-5'),
])

# J. Connect newsroom
edit("pages/connect/Sections.tsx", [
    ('import { latestNews } from "@/lib/data";', 'import { latestNews } from "@/lib/data";\nimport { newsPath } from "@/pages/news/data";'),
    ('  const [lead, ...rest] = latestNews;', '  const [lead, ...rest] = latestNews.slice(0, 4);'),
    ('<Link to="/connect" className="group relative block h-full min-h-[380px]', '<Link to={newsPath(lead)} className="group relative block h-full min-h-[380px]'),
    ('<Link to="/connect" className="group flex h-full gap-4', '<Link to={newsPath(n)} className="group flex h-full gap-4'),
])

print("FAILS:" if fails else "all edits applied")
for f in fails:
    print(" ", f)
