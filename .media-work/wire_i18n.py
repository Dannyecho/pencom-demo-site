"""Wire the language engine into the app. Usage: python3 wire_i18n.py <app/src>"""
import pathlib, sys

src = pathlib.Path(sys.argv[1])


def edit(rel, pairs):
    p = src / rel
    s = p.read_text()
    for old, new in pairs:
        if new in s and old not in s:
            continue  # already applied
        assert s.count(old) == 1, f"{rel}: expected one match for {old[:60]!r}, found {s.count(old)}"
        s = s.replace(old, new)
    p.write_text(s)
    print("ok", rel)


edit("main.tsx", [
    ("import App from './App.tsx'\n", "import App from './App.tsx'\nimport { I18nProvider } from './i18n/I18nProvider'\n"),
    ("    <HashRouter>\n      <App />\n    </HashRouter>", "    <I18nProvider>\n      <HashRouter>\n        <App />\n      </HashRouter>\n    </I18nProvider>"),
])

edit("components/layout/Layout.tsx", [
    ('import QuickLinks from "@/components/QuickLinks";\n', 'import QuickLinks from "@/components/QuickLinks";\nimport LanguageNotice from "@/components/LanguageNotice";\n'),
    ("        <Outlet />\n", "        <LanguageNotice />\n        <Outlet />\n"),
])

edit("components/layout/Header.tsx", [
    ('import { navItems } from "@/lib/data";\n', 'import { navItems } from "@/lib/data";\nimport LanguageSwitcher from "@/components/LanguageSwitcher";\n'),
    ('<Phone className="w-3 h-3" /> 09-4611300\n            </Link>',
     '<Phone className="w-3 h-3" aria-hidden="true" /> <span className="hidden sm:inline">09-4611300</span><span className="sr-only sm:hidden">09-4611300</span>\n            </Link>\n            <LanguageSwitcher />'),
])

edit("pages/home/HomeHero.tsx", [
    ('import LanguageSwitcher from "@/components/LanguageSwitcher";\n', 'import { useI18n } from "@/i18n/context";\n'),
    ("          <ReportGovBadge />\n          <LanguageSwitcher />\n", "          <ReportGovBadge />\n"),
    ("export default function HomeHero() {\n", "export default function HomeHero() {\n  const { t, lang } = useI18n();\n"),
    ("if (user) setAnnounce(`Slide ${n + 1} of ${slides.length}: ${slides[n].title}`);",
     'if (user) setAnnounce(t("Slide {n} of {total}: {title}", { n: n + 1, total: slides.length, title: t(slides[n].title) }));'),
    ('<h2 className="mt-6 text-[2.5rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem]">\n                    {slide.title.split(" ")',
     '<h2 data-i18n-done={lang !== "en" ? "" : undefined} className="mt-6 text-[2.5rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem]">\n                    {t(slide.title).split(" ")'),
])

edit("pages/about/primitives.tsx", [
    ('import { cn } from "@/lib/utils";\n', 'import { cn } from "@/lib/utils";\nimport { useI18n } from "@/i18n/context";\n'),
    ('  const [before, after] = highlight ? title.split(highlight) : [title, ""];\n',
     '  const { t, lang } = useI18n();\n'
     '  // Translate the whole heading, then find the translated highlight inside it.\n'
     '  const T = t(title);\n'
     '  const H = highlight ? t(highlight) : undefined;\n'
     '  const hl = H && T.includes(H) ? H : undefined;\n'
     '  const [before, after] = hl ? T.split(hl) : [T, ""];\n'
     '  const done = lang !== "en" && T !== title ? "" : undefined;\n'),
    ("      <h2\n        id={id}\n", "      <h2\n        id={id}\n        data-i18n-done={done}\n"),
    ("        {highlight && (\n          <span", "        {hl && (\n          <span"),
    ("            {highlight}\n          </span>", "            {hl}\n          </span>"),
])

edit("pages/home/Figures.tsx", [
    ('import { assetGrowth, figures, latestRegulations, notices } from "./data";\n',
     'import { assetGrowth, figures, latestRegulations, notices } from "./data";\nimport { useI18n } from "@/i18n/context";\n'),
    ("export function IndustryFigures() {\n", "export function IndustryFigures() {\n  const { t } = useI18n();\n"),
    ('              Pension assets grew from ₦{assetGrowth[0].value} trillion in {assetGrowth[0].label} to ₦{assetGrowth[1].value} trillion in{" "}\n              {assetGrowth[1].label}.\n',
     '              {t("Pension assets grew from ₦{a} trillion in {b} to ₦{c} trillion in {d}.", { a: assetGrowth[0].value, b: assetGrowth[0].label, c: assetGrowth[1].value, d: assetGrowth[1].label })}\n'),
])

edit("pages/resources/FaqGlossary.tsx", [
    ('import { faqCats, faqs, glossary } from "./data";\n', 'import { faqCats, faqs, glossary } from "./data";\nimport { useI18n } from "@/i18n/context";\n'),
    ("  const [cat, setCat] = useState<string>(\"All\");\n", "  const { t } = useI18n();\n  const [cat, setCat] = useState<string>(\"All\");\n"),
    ('<p className="sr-only" aria-live="polite">{list.length} questions shown</p>', '<p className="sr-only" aria-live="polite">{t("{n} questions shown", { n: list.length })}</p>'),
    ("  const [letter, setLetter] = useState(\"All\");\n", "  const { t } = useI18n();\n  const [letter, setLetter] = useState(\"All\");\n"),
    ('{on ? `${g.term}: ${g.def}` : `${g.term}${g.full ? `, ${g.full}` : ""}. Show meaning`}',
     '{on ? `${g.term}: ${t(g.def)}` : `${g.term}${g.full ? `, ${g.full}` : ""}. ${t("Show meaning")}`}'),
])

css = src / "index.css"
s = css.read_text()
if "i18n-swap" not in s:
    s += """
/* Language switch: a short cross-fade so readers see the page change language (skipped with reduced motion). */
@media (prefers-reduced-motion: no-preference) {
  html.i18n-swap #main-content,
  html.i18n-swap header nav,
  html.i18n-swap footer {
    animation: i18n-swap 0.5s ease-out;
  }
}
@keyframes i18n-swap {
  0% { opacity: 0.25; filter: blur(4px); }
  100% { opacity: 1; filter: blur(0); }
}
"""
    css.write_text(s)
    print("ok index.css")
