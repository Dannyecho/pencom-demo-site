import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, Landmark, ShieldAlert, Vault, UserRound, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridBackdrop, SectionHeading, ease, reveal } from "@/pages/about/primitives";
import { funds } from "./data";

/* ─────────────────────────── How the system protects your savings ─────────────────────────── */

const nodes = [
  { id: "you", icon: UserRound, title: "You and your employer", body: "At least 18% of your pay is set aside each month." },
  { id: "pfc", icon: Vault, title: "Pension Fund Custodian", body: "Receives the contributions and holds the assets in trust." },
  { id: "pfa", icon: Wallet, title: "Pension Fund Administrator", body: "Invests your savings and pays your benefits when you retire." },
];

/** A connector with a label and a dot that travels along it (pausable). */
function Connector({ label, dir, delay, playing }: { label: string; dir: "right" | "left"; delay: number; playing: boolean }) {
  return (
    <div className="absolute top-1/2 w-24 -translate-x-1/2 -translate-y-1/2" style={{ left: dir === "right" ? "33.333%" : "66.666%" }}>
      <p className="absolute bottom-full left-1/2 mb-2 w-36 -translate-x-1/2 text-center text-xs font-semibold text-white/70">{label}</p>
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay, ease }} className={cn("relative h-0.5 bg-white/30", dir === "right" ? "origin-left" : "origin-right")}>
        <span aria-hidden="true" className={cn("absolute top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-y-transparent", dir === "right" ? "-right-1 border-l-[8px] border-l-white/60" : "-left-1 border-r-[8px] border-r-white/60")} />
        {playing && (
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#F4D27A] shadow-[0_0_12px_rgba(244,210,122,0.9)]"
            initial={{ left: dir === "right" ? "0%" : "100%" }}
            animate={{ left: dir === "right" ? ["0%", "100%"] : ["100%", "0%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = !reduce && !paused;
  return (
    <section id="how" aria-labelledby="how-title" className="relative isolate scroll-mt-40 overflow-hidden bg-[#04240A] py-20 text-white sm:py-28">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -right-32 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-[#117F21]/40 blur-[150px]" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading id="how-title" dark eyebrow="How it works" title="Three safeguards around your savings" highlight="Three safeguards" intro="The company that invests your money never holds it. A separate custodian keeps the assets, and PenCom supervises both." />
          {!reduce && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="inline-flex min-h-11 w-fit items-center rounded-xl border border-white/20 px-4 text-sm font-semibold transition hover:border-[#F4D27A] hover:text-[#F4D27A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
              {paused ? "Play animation" : "Pause animation"}
            </button>
          )}
        </div>

        {/* Desktop diagram */}
        <div aria-hidden="true" className="mt-14 hidden lg:block">
          {/* PenCom on top, supervising all three */}
          <motion.div initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }} className="mx-auto w-72 rounded-2xl border border-[#F4D27A]/50 bg-[#F4D27A]/15 p-4 text-center backdrop-blur">
            <Landmark className="mx-auto h-7 w-7 text-[#F4D27A]" />
            <p className="mt-2 font-bold">PenCom</p>
            <p className="mt-1 text-xs text-white/70">Licenses, supervises and inspects every operator.</p>
          </motion.div>
          <div className="relative h-16">
            <motion.span initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} className="absolute left-1/2 top-0 h-8 origin-top border-l-2 border-dashed border-[#F4D27A]/60" />
            <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} className="absolute left-[16.666%] right-[16.666%] top-8 border-t-2 border-dashed border-[#F4D27A]/60" />
            {["16.666%", "50%", "83.333%"].map((l, i) => (
              <motion.span key={l} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }} className="absolute top-8 h-8 origin-top border-l-2 border-dashed border-[#F4D27A]/60" style={{ left: l }} />
            ))}
            <span className="absolute left-[calc(50%+12px)] top-1 text-xs font-semibold text-[#F4D27A]">Supervises</span>
          </div>
          <div className="relative grid grid-cols-3">
            {nodes.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease }} className="px-14">
                <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5 text-center backdrop-blur-md">
                  <n.icon className="mx-auto h-7 w-7 text-[#B9F0C2]" />
                  <p className="mt-2 font-bold">{n.title}</p>
                  <p className="mt-1 text-xs text-white/70">{n.body}</p>
                </div>
              </motion.div>
            ))}
            <Connector label="Contributions" dir="right" delay={0.6} playing={playing} />
            <Connector label="Investment instructions" dir="left" delay={0.8} playing={playing} />
          </div>
        </div>

        {/* Accessible / mobile version */}
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:sr-only">
          {[...nodes, { id: "pc", icon: Landmark, title: "PenCom", body: "Licenses, supervises and inspects the custodians and administrators." }].map((n, i) => (
            <li key={n.id} className="flex gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F4D27A]"><n.icon className="h-5 w-5" aria-hidden="true" /></span>
              <span>
                <span className="block font-bold"><span className="sr-only">{i + 1}. </span>{n.title}</span>
                <span className="mt-1 block text-sm text-white/70">{n.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────── Which RSA fund am I in? ─────────────────────────── */

export function Funds() {
  const [age, setAge] = useState(35);
  const [status, setStatus] = useState<"working" | "retired" | "ppp">("working");
  const [nonInterest, setNonInterest] = useState(false);
  const reduce = useReducedMotion();

  const yours = nonInterest ? "VI" : status === "retired" ? "IV" : status === "ppp" ? "V" : age >= 50 ? "III" : "II";
  const options = !nonInterest && status === "working" && age < 50 ? ["I"] : [];

  return (
    <section id="funds" aria-labelledby="funds-title" className="scroll-mt-40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="funds-title" eyebrow="RSA funds" title="Which fund is your money in?" highlight="your money" intro="Every PFA runs the same set of RSA funds. Which one you’re in depends on your age and situation. Try it." />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-5">
            <fieldset>
              <legend className="font-bold text-[#0A2E10]">I am…</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {([["working", "Working"], ["retired", "Retired"], ["ppp", "Self-employed (PPP)"]] as const).map(([v, l]) => (
                  <label key={v} className={cn("flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-sm font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", status === v ? "border-[#117F21] bg-[#117F21] text-white" : "border-gray-200 text-gray-700 hover:border-[#117F21]")}>
                    <input type="radio" name="fund-status" value={v} checked={status === v} onChange={() => setStatus(v)} className="sr-only" />
                    {l}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={cn("mt-7 transition-opacity", status !== "working" && "pointer-events-none opacity-40")}>
              <label htmlFor="fund-age" className="flex items-baseline justify-between font-bold text-[#0A2E10]">
                My age
                <span className="text-3xl font-black text-[#117F21]">{age}</span>
              </label>
              <input
                id="fund-age"
                type="range"
                min={18}
                max={70}
                value={age}
                disabled={status !== "working"}
                onChange={(e) => setAge(Number(e.target.value))}
                className="mt-3 w-full accent-[#117F21]"
              />
              <div className="mt-1 flex justify-between font-mono text-xs text-gray-400"><span>18</span><span>50</span><span>70</span></div>
            </div>

            <label className="mt-7 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]">
              <input type="checkbox" checked={nonInterest} onChange={(e) => setNonInterest(e.target.checked)} className="peer sr-only" />
              <span aria-hidden="true" className={cn("relative h-6 w-11 shrink-0 rounded-full transition", nonInterest ? "bg-[#117F21]" : "bg-gray-300")}>
                <motion.span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" animate={{ left: nonInterest ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              </span>
              <span className="text-sm font-semibold text-gray-700">I want non-interest (ethical) investments</span>
            </label>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
              {funds.map((f) => {
                const on = f.key === yours;
                const opt = options.includes(f.key);
                return (
                  <motion.li
                    key={f.key}
                    layout={!reduce}
                    animate={{ scale: on && !reduce ? 1.04 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border p-5 transition-colors duration-300",
                      on ? "border-transparent bg-gradient-to-br from-[#04240A] to-[#117F21] text-white shadow-[0_24px_50px_-20px_rgba(4,36,10,0.8)]" : opt ? "border-[#CB9615] bg-[#FFF8E1]" : "border-gray-200 bg-white",
                    )}
                  >
                    {on && <GridBackdrop className="opacity-40" />}
                    <p className={cn("relative text-xs font-bold uppercase tracking-[0.16em]", on ? "text-[#F4D27A]" : "text-gray-400")}>RSA Fund</p>
                    <p className="relative text-5xl font-black leading-none">{f.key}</p>
                    <p className={cn("relative mt-3 text-sm font-semibold", on ? "text-white" : "text-[#0A2E10]")}>{f.who}</p>
                    <AnimatePresence>
                      {(on || opt) && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={cn("relative mt-2 text-xs", on ? "text-white/75" : "text-[#5C4300]")}>
                          {on ? `Your fund. ${f.note}` : `You can choose this instead. ${f.note}`}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-gray-500">A simplified guide. Your PFA can confirm which fund you are in and help you move between funds where the rules allow.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Performance + report ─────────────────────────── */

export function PerformanceCta() {
  return (
    <section id="performance" aria-label="Performance and reporting" className="scroll-mt-40 px-4 pb-20 sm:pb-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div {...reveal} className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04240A] via-[#0A4A13] to-[#117F21] p-8 text-white sm:p-10 lg:col-span-2">
          <GridBackdrop className="-z-10 opacity-50" />
          <BarChart3 className="h-10 w-10 text-[#F4D27A]" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold">Compare PFA performance and fees</h2>
          <p className="mt-2 max-w-xl text-white/75">Returns by fund, assets under management and published fees, with the data to download. Past returns don’t guarantee future returns.</p>
          <Link to="/performance" className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-5 font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
            See industry performance <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
          <Link to="/connect#report" className="group flex h-full flex-col rounded-[2rem] border border-[#B52026]/25 bg-[#FDF3F3] p-8 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(181,32,38,0.4)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
            <ShieldAlert className="h-10 w-10 text-[#B52026]" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-[#0A2E10]">Problem with an operator?</h2>
            <p className="mt-2 text-gray-600">Complain to the operator first. If it isn’t resolved, or someone unlicensed approaches you, tell PenCom.</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-[#B52026]">
              Report to PenCom <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </div>
      <p className="mx-auto mt-4 flex max-w-7xl items-center gap-2 text-xs text-gray-500">
        <Building2 className="h-4 w-4" aria-hidden="true" /> Operator details as published on PenCom’s register of licensed operators.
      </p>
    </section>
  );
}
