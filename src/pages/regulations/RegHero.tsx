import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, FileText, Scale, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, GridBackdrop, ease } from "@/pages/about/primitives";
import { library } from "./library";
import { fmtDate, latest, typeStyle } from "./search";

const counts = (["Regulation", "Guideline", "Circular", "Framework"] as const).map((t) => ({
  t,
  n: library.filter((d) => d.type === t).length,
}));

export default function RegHero({ onSearch, onOpen }: { onSearch: (q: string) => void; onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stackY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const [fan, setFan] = useState(false);

  return (
    <section ref={ref} aria-labelledby="reg-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21]/50 blur-[150px]" />
      <div aria-hidden="true" className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#CB9615]/20 blur-[120px]" />
      <Scale aria-hidden="true" className="absolute -right-16 top-10 -z-10 h-[420px] w-[420px] text-white/[0.03]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-white/60">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-white">Regulations and compliance</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A] backdrop-blur"
            >
              <Scale className="h-3.5 w-3.5" aria-hidden="true" />
              Regulatory library
            </motion.span>
            <motion.h1
              id="reg-title"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]"
            >
              Regulations and{" "}
              <span className="bg-gradient-to-r from-[#F4D27A] to-[#CB9615] bg-clip-text text-transparent">compliance</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/75"
            >
              Every regulation, guideline, framework and circular issued under the Pension Reform Act, in one place.
              Search by title, subject or abbreviation, and download the official signed document.
            </motion.p>

            <motion.form
              role="search"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(q);
              }}
              className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl bg-white p-2 pl-4 text-gray-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] focus-within:ring-4 focus-within:ring-[#F4D27A]/40"
            >
              <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
              <label htmlFor="reg-hero-q" className="sr-only">Search the regulatory library</label>
              <input
                id="reg-hero-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. “RSA transfer”, “investment”, “PPP”"
                className="min-h-12 w-full bg-transparent text-base placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-12 shrink-0 rounded-xl bg-[#117F21] px-5 font-semibold text-white transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                Search
              </button>
            </motion.form>

            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {counts.map((c, i) => (
                <motion.li
                  key={c.t}
                  initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 + i * 0.08, ease }}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                >
                  <CountUp value={String(c.n)} className="text-3xl font-black" />
                  <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
                    <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", typeStyle[c.t].dot)} />
                    {c.t}s
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Floating stack of the latest documents */}
          <motion.div style={{ y: stackY }} className="relative hidden h-[420px] lg:col-span-5 lg:block">
            <p className="absolute -top-8 left-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Latest issued</p>
            <ul onPointerEnter={() => setFan(true)} onPointerLeave={() => setFan(false)} className="relative h-full">
              {latest.slice(0, 3).map((d, i) => {
                const base = [
                  { x: 0, y: 0, r: -4 },
                  { x: 28, y: 46, r: 2 },
                  { x: 56, y: 92, r: 6 },
                ][i];
                const fanned = [
                  { x: -20, y: -10, r: -8 },
                  { x: 40, y: 110, r: 0 },
                  { x: 90, y: 230, r: 7 },
                ][i];
                const p = fan && !reduce ? fanned : base;
                return (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, y: 80, rotate: 0 }}
                    animate={{ opacity: 1, x: p.x, y: p.y, rotate: p.r }}
                    transition={{ type: "spring", stiffness: 140, damping: 18, delay: fan ? 0 : 0.5 + i * 0.12 }}
                    style={{ zIndex: 3 - i }}
                    className="absolute left-0 top-0 w-[88%]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(d.id)}
                      className="block w-full rounded-2xl border border-white/60 bg-white p-5 text-left text-gray-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                    >
                      <span className="flex items-center justify-between">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider", typeStyle[d.type].chip)}>
                          {d.type}
                        </span>
                        <span className="font-mono text-xs text-gray-400">{fmtDate(d.date)}</span>
                      </span>
                      <span className="mt-3 flex gap-3">
                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                        <span className="line-clamp-2 font-semibold leading-snug">{d.title}</span>
                      </span>
                      <span aria-hidden="true" className="mt-4 block space-y-1.5">
                        <span className="block h-1.5 w-full rounded-full bg-gray-100" />
                        <span className="block h-1.5 w-4/5 rounded-full bg-gray-100" />
                        <span className="block h-1.5 w-3/5 rounded-full bg-gray-100" />
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
