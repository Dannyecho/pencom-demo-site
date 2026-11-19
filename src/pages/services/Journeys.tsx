import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight, ArrowRight, Award, BadgeCheck, Check, CircleHelp, Clock, ExternalLink, Headphones, MapPin,
  MessageSquareWarning, Store, UserPlus, UserRoundCheck, X, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading, ease } from "@/pages/about/primitives";
import { journeys, portals, type Journey } from "./data";

const icons: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  transfer: ArrowLeftRight,
  retiree: UserRoundCheck,
  certificate: Award,
  store: Store,
  complaint: MessageSquareWarning,
};

function Eligibility({ j }: { j: Journey }) {
  const [ans, setAns] = useState<(boolean | null)[]>(j.eligibility!.questions.map(() => null));
  const done = ans.every((a) => a !== null);
  const ok = done && ans.every(Boolean);
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#F7FAF6] p-5 sm:p-6">
      <p className="flex items-center gap-2 font-bold text-[#0A2E10]"><CircleHelp className="h-5 w-5 text-[#117F21]" aria-hidden="true" /> {j.eligibility!.intro}</p>
      <ol className="mt-4 space-y-3">
        {j.eligibility!.questions.map((q, i) => (
          <li key={q}>
            <fieldset className="flex flex-col gap-2 rounded-2xl bg-white p-4 ring-1 ring-gray-200 sm:flex-row sm:items-center">
              <legend className="sr-only">{q}</legend>
              <span aria-hidden="true" className="flex-1 text-sm font-medium text-gray-800">{q}</span>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <label key={String(v)} className={cn("flex min-h-10 min-w-16 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", ans[i] === v ? (v ? "border-[#117F21] bg-[#117F21] text-white" : "border-[#B52026] bg-[#B52026] text-white") : "border-gray-200 text-gray-700 hover:border-gray-400")}>
                    <input type="radio" name={`${j.anchor}-q${i}`} className="sr-only" checked={ans[i] === v} onChange={() => setAns((a) => a.map((x, k) => (k === i ? v : x)))} />
                    {v ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {done && (
            <motion.p key={String(ok)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("mt-4 flex gap-3 rounded-2xl p-4 text-sm font-medium", ok ? "bg-[#117F21] text-white" : "bg-[#FDE8E8] text-[#5C1013]")}>
              {ok ? <BadgeCheck className="h-5 w-5 shrink-0" aria-hidden="true" /> : <X className="h-5 w-5 shrink-0" aria-hidden="true" />}
              {ok ? j.eligibility!.yes : j.eligibility!.no}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({ j, onHandoff }: { j: Journey; onHandoff: (key: string) => void }) {
  const Icon = icons[j.icon] ?? UserPlus;
  const portal = portals.find((p) => p.key === j.portal);
  const reduce = useReducedMotion();
  return (
    <motion.article
      key={j.anchor}
      initial={{ opacity: 0, x: reduce ? 0 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduce ? 0 : -30 }}
      transition={{ duration: 0.35, ease }}
      aria-labelledby={`${j.anchor}-title`}
      className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_40px_80px_-50px_rgba(10,74,19,0.5)]"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#04240A] via-[#0A4A13] to-[#117F21] p-7 text-white sm:p-9">
        <Icon aria-hidden="true" className="absolute -right-6 -top-6 h-44 w-44 text-white/[0.06]" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">For {j.audience.toLowerCase()}</p>
        <h3 id={`${j.anchor}-title`} className="mt-2 max-w-xl text-2xl font-bold leading-tight sm:text-3xl">{j.title}</h3>
        <p className="mt-3 max-w-2xl text-white/75">{j.intro}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{j.where}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{j.standard ?? j.time}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 p-7 sm:p-9 xl:grid-cols-[1fr_1.15fr]">
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Who it’s for</h4>
            <p className="mt-2 text-gray-700">{j.forWho}</p>
          </div>
          {j.eligibility && <Eligibility j={j} />}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">What you need</h4>
            <ul className="mt-3 space-y-2">
              {j.needs.map((n, i) => (
                <motion.li key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#E8F5E9] text-[#117F21]"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>
                  {n}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Steps</h4>
          <ol className="relative mt-4 space-y-5 pl-12">
            <motion.span aria-hidden="true" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.2, ease }} className="absolute bottom-3 left-[19px] top-3 w-0.5 origin-top bg-gradient-to-b from-[#117F21] to-[#CB9615]" />
            {j.steps.map((s, i) => (
              <motion.li key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 + i * 0.1, ease }} className="relative">
                <span className="absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-[#117F21] ring-2 ring-[#117F21]">{i + 1}</span>
                <p className="pt-1.5 font-bold text-[#0A2E10]">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.body}</p>
              </motion.li>
            ))}
          </ol>

          {/* Hand-off */}
          <div className="mt-8 rounded-3xl border border-[#CB9615]/30 bg-[#FFF8E1] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7A5604]">Where to go next</p>
            {portal ? (
              <>
                <p className="mt-2 font-semibold text-[#0A2E10]">{portal.full}</p>
                <p className="text-sm text-gray-700">{portal.use}</p>
                <button type="button" onClick={() => onHandoff(portal.key)} className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  Go to {portal.name} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <Link to={j.link.href} className="group mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                {j.link.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            )}
            <Link to={`/resources?guide=${j.id}`} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#7A5604] hover:underline">
              <Headphones className="h-4 w-4" aria-hidden="true" /> Listen to or print this guide
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Journeys({ active, setActive, onHandoff }: { active: string; setActive: (a: string) => void; onHandoff: (key: string) => void }) {
  const j = journeys.find((x) => x.anchor === active) ?? journeys[0];
  return (
    <section id="journeys" aria-labelledby="journeys-title" className="scroll-mt-40 bg-[#F7FAF6] py-20 sm:py-24">
      {/* Anchors kept for old links: /services#pcc, #ppp, #rsa-transfer … */}
      {journeys.map((x) => <span key={x.anchor} id={x.anchor} className="block scroll-mt-40" aria-hidden="true" />)}
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="journeys-title" eyebrow="Step-by-step services" title="Choose a service and we’ll guide you through it" highlight="guide you through it" />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <LayoutGroup id="svc-rail">
            <nav aria-label="Services" className="lg:col-span-3">
              <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-[170px] lg:flex-col lg:overflow-visible">
                {journeys.map((x) => {
                  const I = icons[x.icon] ?? UserPlus;
                  const on = x.anchor === j.anchor;
                  return (
                    <li key={x.anchor} className="shrink-0">
                      <button type="button" aria-current={on ? "true" : undefined} onClick={() => setActive(x.anchor)} className={cn("relative isolate flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]", on ? "text-white" : "text-gray-700 hover:bg-white")}>
                        {on && <motion.span layoutId="svc-rail-pill" className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#0A4A13] to-[#117F21] shadow-[0_14px_30px_-14px_rgba(10,74,19,0.9)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                        <I className={cn("h-5 w-5 shrink-0", on ? "text-[#F4D27A]" : "text-[#117F21]")} aria-hidden="true" />
                        <span className="whitespace-nowrap lg:whitespace-normal">{x.short}</span>
                        <span className={cn("ml-auto hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider lg:inline", on ? "bg-white/15 text-white/80" : "bg-gray-100 text-gray-500")}>{x.audience}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </LayoutGroup>
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait" initial={false}>
              <Panel key={j.anchor} j={j} onHandoff={onHandoff} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
