import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ChevronRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { CountUp, GridBackdrop, ease } from "@/pages/about/primitives";
import { operators, typeInfo } from "./data";

const norm = (s: string) => s.toLowerCase().replace(/\b(limited|ltd|plc|nig|nigeria|the)\b|[^a-z0-9]/g, "");

/** "Is this company licensed?" — a quick check against the register (DES-30 fraud warnings). */
function VerifyCard({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();
  const term = norm(q);
  const matches = useMemo(() => (term.length < 3 ? [] : operators.filter((o) => norm(o.name).includes(term))), [term]);
  const state = term.length < 3 ? "idle" : matches.length ? "found" : "none";

  return (
    <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
      <span aria-hidden="true" className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#F4D27A]/70 to-transparent" />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4D27A]/15 text-[#F4D27A]">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Is this company licensed?</h2>
          <p className="text-sm text-white/65">Check a name before you hand over your details.</p>
        </div>
      </div>
      <label htmlFor="verify-q" className="sr-only">Company name</label>
      <input
        id="verify-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        placeholder="Type a company name"
        className="mt-5 min-h-14 w-full rounded-2xl bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#F4D27A]/40"
      />
      <div className="mt-4 min-h-[6.5rem]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {state === "idle" && (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-white/55">
              Type at least three letters. We check the names on PenCom’s register of {operators.length} licensed operators.
            </motion.p>
          )}
          {state === "found" && (
            <motion.ul key="found" initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease }} className="space-y-2">
              {matches.slice(0, 3).map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => onOpen(m.id)} className="flex w-full items-center gap-3 rounded-2xl bg-[#117F21]/40 px-4 py-3 text-left ring-1 ring-[#2E913D] transition hover:bg-[#117F21]/60 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                    <BadgeCheck className="h-5 w-5 shrink-0 text-[#B9F0C2]" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="block font-semibold">{m.name}</span>
                      <span className="block text-xs text-white/70">Licensed {typeInfo[m.type].label}</span>
                    </span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
          {state === "none" && (
            <motion.div key="none" initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease }} className="flex gap-3 rounded-2xl bg-[#B52026]/25 px-4 py-3 ring-1 ring-[#B52026]/60">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#FFB3B8]" aria-hidden="true" />
              <p className="text-sm">
                <strong className="block">Not on PenCom’s register.</strong>
                Only licensed operators may manage pension funds. Check the spelling, or{" "}
                <Link to="/connect#report" className="font-semibold underline underline-offset-2">report it to PenCom</Link>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OpsHero({ onOpen }: { onOpen: (id: string) => void }) {
  const reduce = useReducedMotion();
  const counts = (["PFA", "PFC", "CPFA"] as const).map((t) => ({ t, n: operators.filter((o) => o.type === t).length }));
  return (
    <section aria-labelledby="ops-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21]/50 blur-[150px]" />
      <div aria-hidden="true" className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#CB9615]/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-medium text-white">Pension operators</li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A] backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Licensed by PenCom
            </motion.span>
            <motion.h1 id="ops-title" initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }} className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              The companies that look after <span className="bg-gradient-to-r from-[#F4D27A] to-[#CB9615] bg-clip-text text-transparent">your pension</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease }} className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Find, compare and contact every Pension Fund Administrator, Pension Fund Custodian and Closed Pension Fund
              Administrator licensed by the Commission.
            </motion.p>
            <ul className="mt-10 grid grid-cols-3 gap-3">
              {counts.map((c, i) => (
                <motion.li key={c.t} initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 + i * 0.08, ease }} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <CountUp value={String(c.n)} className="text-4xl font-black" />
                  <p className="mt-1 text-sm text-white/70">
                    <abbr title={typeInfo[c.t].plural} className="no-underline">{typeInfo[c.t].short}</abbr>
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div initial={{ opacity: 0, y: reduce ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease }} className="lg:col-span-5">
            <VerifyCard onOpen={onOpen} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
