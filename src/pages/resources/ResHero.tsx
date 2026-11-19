import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronRight, FileText, HelpCircle, Search, Sparkles, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridBackdrop, ease } from "@/pages/about/primitives";
import { faqs, glossary, guides } from "./data";
import { publications } from "./publications";

type Hit = { label: string; kind: "Guide" | "Question" | "Term" | "Publication"; go: () => void };

export default function ResHero({
  openGuide,
  openFaq,
  openTerm,
  findPublication,
}: {
  openGuide: (id: string) => void;
  openFaq: (q: string) => void;
  openTerm: (term: string) => void;
  findPublication: (q: string) => void;
}) {
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState("");

  // Typewriter cycling through real questions (pauses under reduced motion).
  const sample = faqs[qi % faqs.length].q;
  useEffect(() => {
    if (reduce) {
      setTyped(sample);
      return;
    }
    let i = 0;
    setTyped("");
    const t = window.setInterval(() => {
      i += 1;
      setTyped(sample.slice(0, i));
      if (i >= sample.length) window.clearInterval(t);
    }, 32);
    // Stops after four questions so nothing keeps moving on its own (WCAG 2.2.2).
    const next = qi < 3 ? window.setTimeout(() => setQi((x) => x + 1), sample.length * 32 + 3200) : undefined;
    return () => {
      window.clearInterval(t);
      window.clearTimeout(next);
    };
  }, [qi, sample, reduce]);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const m = (s: string) => s.toLowerCase().includes(term);
    return [
      ...guides.filter((g) => m(g.title) || m(g.intro)).map((g) => ({ label: g.title, kind: "Guide" as const, go: () => openGuide(g.id) })),
      ...glossary.filter((g) => m(g.term) || m(g.full ?? "")).map((g) => ({ label: g.full ? `${g.term} – ${g.full}` : g.term, kind: "Term" as const, go: () => openTerm(g.term) })),
      ...faqs.filter((f) => m(f.q) || m(f.a)).map((f) => ({ label: f.q, kind: "Question" as const, go: () => openFaq(f.q) })),
      ...publications.filter((p) => m(p.title)).slice(0, 4).map((p) => ({ label: p.title, kind: "Publication" as const, go: () => findPublication(p.title) })),
    ].slice(0, 8);
  }, [q, openGuide, openFaq, openTerm, findPublication]);

  const icon = { Guide: BookOpen, Question: HelpCircle, Term: Type, Publication: FileText };

  return (
    <section aria-labelledby="res-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21]/50 blur-[150px]" />
      <div aria-hidden="true" className="absolute right-0 top-1/2 -z-10 h-80 w-80 rounded-full bg-[#CB9615]/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-medium text-white">Resources</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A] backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Knowledge base
            </motion.span>
            <motion.h1
              id="res-title"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]"
            >
              Understand your pension, <span className="bg-gradient-to-r from-[#F4D27A] to-[#CB9615] bg-clip-text text-transparent">step by step</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/75"
            >
              Plain-language guides you can read, listen to or print, answers to common questions, a glossary of pension
              terms, and every report and form we publish.
            </motion.p>

            {/* Knowledge search */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="relative mt-8 max-w-xl"
            >
              <label htmlFor="kb-q" className="sr-only">Search guides, questions, terms and publications</label>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 text-gray-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] focus-within:ring-4 focus-within:ring-[#F4D27A]/40">
                <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                <input
                  id="kb-q"
                  role="combobox"
                  aria-expanded={focus && hits.length > 0}
                  aria-controls="kb-results"
                  autoComplete="off"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onBlur={() => window.setTimeout(() => setFocus(false), 150)}
                  placeholder="Search “annuity”, “transfer”, “quarterly report”…"
                  className="min-h-14 w-full bg-transparent text-base placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <AnimatePresence>
                {focus && q.trim().length > 1 && (
                  <motion.ul
                    id="kb-results"
                    role="listbox"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 text-gray-900 shadow-2xl"
                  >
                    {hits.length === 0 && <li className="px-3 py-4 text-sm text-gray-500">No matches yet. Try one word, like “PIN” or “benefits”.</li>}
                    {hits.map((h) => {
                      const I = icon[h.kind];
                      return (
                        <li key={h.kind + h.label} role="option" aria-selected={false}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              h.go();
                              setFocus(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-[#E8F5E9]"
                          >
                            <I className="h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                            <span className="flex-1 font-medium">{h.label}</span>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h.kind}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
              <p className="sr-only" aria-live="polite">{focus && q.trim().length > 1 ? `${hits.length} results` : ""}</p>
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-2">
              {guides.slice(0, 4).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => openGuide(g.id)}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/90 transition hover:border-[#F4D27A]/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                >
                  {g.title}
                </button>
              ))}
            </div>
          </div>

          {/* "People ask" typewriter card */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30, rotate: reduce ? 0 : 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
              <span aria-hidden="true" className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#F4D27A]/70 to-transparent" />
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F4D27A] opacity-75 [animation-iteration-count:3]" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#F4D27A]" /></span>
                People often ask
              </p>
              <button
                type="button"
                onClick={() => openFaq(sample)}
                className="group mt-4 block min-h-[5.5rem] w-full text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                <span className="sr-only">{sample}</span>
                <span aria-hidden="true" className="text-2xl font-bold leading-snug">
                  {typed}
                  <span className={cn("ml-0.5 inline-block h-6 w-0.5 translate-y-1 bg-[#F4D27A]", !reduce && "animate-pulse")} />
                </span>
                <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#F4D27A]">
                  See the answer
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
                {[
                  { n: guides.length, l: "guides" },
                  { n: faqs.length, l: "answers" },
                  { n: publications.length, l: "publications" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-2xl font-black text-white">{s.n}</p>
                    <p className="text-xs text-white/55">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
