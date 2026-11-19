import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeftRight, ArrowUpRight, Award, ChevronDown, ChevronRight, Sparkles, Store, UserRoundCheck } from "lucide-react";
import { GridBackdrop, Tilt, ease } from "@/pages/about/primitives";
import { journeys } from "./data";

const verbs: Record<string, string> = {
  "open-rsa": "open a Retirement Savings Account",
  "rsa-transfer": "move my RSA to another PFA",
  retirement: "get my retirement benefits",
  ppp: "save for retirement as a self-employed person",
  pcc: "get a Pension Clearance Certificate",
  enrolment: "enrol my employees",
  pencare: "join Pencare health insurance",
  complaint: "make a complaint",
};

/** "I want to …" sentence builder: pick a task, jump straight to its guided journey. */
export default function SvcHero({ onPick }: { onPick: (anchor: string) => void }) {
  const reduce = useReducedMotion();
  const [pick, setPick] = useState(journeys[1].anchor);

  return (
    <section aria-labelledby="svc-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21]/50 blur-[150px]" />
      <div aria-hidden="true" className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#CB9615]/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-medium text-white">Services</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
        <motion.span initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Pension services
        </motion.span>
        <motion.h1 id="svc-title" initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }} className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
          What do you need to do?
        </motion.h1>

        {/* Sentence builder */}
        <motion.form
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          onSubmit={(e) => {
            e.preventDefault();
            onPick(pick);
          }}
          className="mt-10 max-w-4xl rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8"
        >
          <label htmlFor="svc-pick" className="block text-2xl font-semibold leading-relaxed text-white/80 sm:text-3xl">
            I want to{" "}
            <span className="relative inline-block max-w-full align-baseline">
              <select
                id="svc-pick"
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className="max-w-full cursor-pointer appearance-none rounded-2xl border-2 border-[#F4D27A]/60 bg-[#04240A]/60 py-1 pl-4 pr-12 font-bold text-[#F4D27A] focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                {journeys.map((j) => (
                  <option key={j.anchor} value={j.anchor} className="bg-white text-base text-gray-900">
                    {verbs[j.anchor] ?? j.short}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-[#F4D27A]" aria-hidden="true" />
            </span>
          </label>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#CB9615] px-6 font-semibold text-[#1A1206] shadow-[0_10px_30px_-10px_rgba(203,150,21,0.8)] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
              Show me how
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <AnimatePresence mode="wait">
              <motion.p key={pick} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="text-sm text-white/65">
                {journeys.find((j) => j.anchor === pick)?.forWho}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.form>
        </div>

        {/* Most-used services */}
        <ul className="grid grid-cols-2 gap-4 lg:col-span-5">
          {[
            { a: "rsa-transfer", l: "Transfer your RSA", I: ArrowLeftRight, tone: "from-[#117F21] to-[#0A4A13]" },
            { a: "pcc", l: "Get a PCC", I: Award, tone: "from-[#CB9615] to-[#9A6F06]" },
            { a: "ppp", l: "Personal Pension Plan", I: Store, tone: "from-[#1F2E20] to-[#04240A]" },
            { a: "retirement", l: "Retirement benefits", I: UserRoundCheck, tone: "from-[#2E913D] to-[#117F21]" },
          ].map((t, i) => (
            <motion.li key={t.a} initial={{ opacity: 0, y: reduce ? 0 : 30, rotate: reduce ? 0 : i % 2 ? 3 : -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.7, delay: 0.35 + i * 0.1, ease }} className={i % 2 ? "translate-y-6" : ""}>
              <Tilt>
                <button type="button" onClick={() => onPick(t.a)} className={`group relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${t.tone} p-5 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]`}>
                  <t.I className="h-9 w-9 text-white/90" aria-hidden="true" />
                  <t.I className="absolute -bottom-6 -right-6 h-32 w-32 text-white/[0.07] transition-transform duration-700 group-hover:scale-110" aria-hidden="true" />
                  <span className="relative flex items-end justify-between gap-2 text-lg font-bold leading-tight">
                    {t.l}
                    <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </button>
              </Tilt>
            </motion.li>
          ))}
        </ul>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            { label: "Pension calculator", anchor: "calculator" },
            { label: "Online portals", anchor: "portals" },
            { label: "Report an employer", anchor: "complaint" },
          ].map((c) => (
            <li key={c.anchor}>
              <button type="button" onClick={() => onPick(c.anchor)} className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/90 transition hover:border-[#F4D27A]/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
