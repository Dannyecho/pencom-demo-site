import sys, pathlib, re
root = pathlib.Path(sys.argv[1]); fails = []
def edit(rel, pairs):
    p = root / rel; s = p.read_text()
    for a, b in pairs:
        if a not in s: fails.append(f"{rel}: {a[:70]}")
        s = s.replace(a, b, 1)
    p.write_text(s)

edit("App.tsx", [
    ("import Media from './pages/Media'", "import Media from './pages/Media'\nimport ServiceCharter from './pages/ServiceCharter'\nimport PensionAct from './pages/PensionAct'\nimport RegDocPage from './pages/RegDocPage'\nimport ReportPage from './pages/ReportPage'\nimport FormsChecklists from './pages/FormsChecklists'"),
    ('        <Route path="/media" element={<Media />} />',
     '        <Route path="/media" element={<Media />} />\n'
     '        <Route path="/about/service-charter" element={<ServiceCharter />} />\n'
     '        <Route path="/regulations/pension-reform-act" element={<PensionAct />} />\n'
     '        <Route path="/regulations/doc/:id" element={<RegDocPage />} />\n'
     '        <Route path="/resources/reports/q1-2026" element={<ReportPage />} />\n'
     '        <Route path="/resources/forms-and-checklists" element={<FormsChecklists />} />'),
])
edit("pages/about/Charter.tsx", [('                  to="/resources#publications"\n', '                  to="/about/service-charter"\n')])
edit("pages/regulations/Sections.tsx", [(
    '              <p className="text-2xl font-black text-[#F4D27A]">1 July 2014</p>\n            </div>\n          </motion.div>',
    '              <p className="text-2xl font-black text-[#F4D27A]">1 July 2014</p>\n            </div>\n            <Link to="/regulations/pension-reform-act" className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">Read the full Act →</Link>\n          </motion.div>')])
edit("pages/resources/Library.tsx", [
    ('import { BookOpen, Download,', 'import { Link } from "react-router";\nimport { BookOpen, Download,'),
    ('        <SectionHeading id="pub-title" eyebrow="Publications" title="Reports on the pension industry" highlight="pension industry" intro={`${publications.length} reports and publications, from monthly figures to annual reports. Every one is the official PDF.`} />',
     '        <SectionHeading id="pub-title" eyebrow="Publications" title="Reports on the pension industry" highlight="pension industry" intro={`${publications.length} reports and publications, from monthly figures to annual reports. Every one is the official PDF.`} />\n'
     '        <Link to="/resources/reports/q1-2026" className="group mt-8 flex flex-col justify-between gap-3 rounded-3xl bg-gradient-to-r from-[#04240A] to-[#117F21] p-6 text-white transition hover:shadow-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D] sm:flex-row sm:items-center">\n'
     '          <span><span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">New · Read online</span><span className="mt-1 block text-lg font-bold">Q1 2026 Quarterly Industry Report</span><span className="block text-sm text-white/70">The dashboard, the Director-General’s read and the priorities for Q2, as a web page.</span></span>\n'
     '          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#CB9615] px-4 py-2.5 font-semibold text-[#1A1206]">Read the report <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>\n'
     '        </Link>'),
])
edit("pages/regulations/DocDrawer.tsx", [
    ('import { useState } from "react";', 'import { useState } from "react";\nimport { Link } from "react-router";'),
    ('              <div className="mt-6 flex flex-wrap gap-2">\n                <a\n                  href={d.pdf}',
     '              <div className="mt-6 flex flex-wrap gap-2">\n                <Link to={`/regulations/doc/${d.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#0A4A13] hover:bg-[#F4D27A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">Open full page</Link>\n                <a\n                  href={d.pdf}'),
])
edit("lib/data.ts", [
    ('{ label: "Service Charter", href: "/about#charter" }', '{ label: "Service Charter", href: "/about/service-charter" }'),
    ('{ label: "Pension Reform Act", href: "/regulations" }', '{ label: "Pension Reform Act", href: "/regulations/pension-reform-act" }'),
    ('            { label: "Downloads Center", href: "/resources#downloads" },', '            { label: "Forms & Checklists", href: "/resources/forms-and-checklists" },\n            { label: "Downloads Center", href: "/resources#downloads" },'),
])
edit("components/layout/Footer.tsx", [
    ('{ label: "Service Charter", href: "/about#charter" }', '{ label: "Service Charter", href: "/about/service-charter" }'),
    ('    { label: "Downloads", href: "/resources#downloads" },', '    { label: "Downloads", href: "/resources#downloads" },\n    { label: "Forms and checklists", href: "/resources/forms-and-checklists" },'),
])
print("FAILS", fails) if fails else print("ok")
