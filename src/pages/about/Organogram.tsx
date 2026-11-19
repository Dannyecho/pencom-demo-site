import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Landmark, List, Maximize2, Minimize2, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { arms, commissioners, dg, dgOffices, secretary, type Exec } from "./data";
import { SectionHeading, ease } from "./primitives";

const byId = (id: string) => [dg, secretary, ...commissioners].find((e) => e.id === id) as Exec;

/** A connector that "draws" itself when it scrolls into view. */
function Line({ className, axis = "y", delay = 0, lit = false }: { className?: string; axis?: "x" | "y"; delay?: number; lit?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      initial={reduce ? false : axis === "y" ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={axis === "y" ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease }}
      className={cn(
        "block transition-colors duration-300",
        axis === "y" ? "w-0.5 origin-top" : "h-0.5 origin-center",
        lit ? "bg-[#CB9615]" : "bg-[#117F21]/25",
        className,
      )}
    />
  );
}

function Avatar({ exec, size = "md" }: { exec: Exec; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-[#E8F5E9] ring-2 ring-offset-2",
        size === "lg" ? "h-16 w-16 ring-[#F4D27A] ring-offset-[#0A4A13]" : "h-12 w-12 ring-[#CB9615]/60 ring-offset-white",
      )}
    >
      <img src={exec.image} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
    </span>
  );
}

function PersonButton({
  exec,
  onSelect,
  className,
  children,
}: {
  exec: Exec;
  onSelect: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exec.id)}
      aria-label={`${exec.title}: ${exec.name}. View profile`}
      className={cn(
        "group text-left transition duration-300 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────── Chart view ─────────────────────────── */

function Chart({ onSelect, showAll }: { onSelect: (id: string) => void; showAll: boolean }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* Level 1 — Board */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#0F1A10] to-[#1F2E20] px-6 py-4 text-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Landmark className="h-5 w-5 text-[#F4D27A]" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-bold">The Board</span>
            <span className="block text-xs text-white/60">National Pension Commission</span>
          </span>
        </motion.div>
        <Line className="h-10" delay={0.2} lit={!!focus} />
      </div>

      {/* Level 2 — DG with offices that report to the DG */}
      <div className="relative grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
        <span
          aria-hidden="true"
          className="absolute left-[12%] right-[12%] top-1/2 hidden border-t-2 border-dashed border-[#117F21]/20 lg:block"
        />
        {/* Left: Commission Secretary */}
        <div className="order-2 flex justify-center lg:order-1 lg:justify-end">
          <PersonButton
            exec={secretary}
            onSelect={onSelect}
            className="relative flex w-full max-w-xs items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 pr-5 shadow-sm hover:-translate-y-0.5 hover:border-[#117F21]/40 hover:shadow-lg"
          >
            <Avatar exec={secretary} />
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight text-[#0A2E10]">{dgOffices[0].name}</span>
              <span className="mt-0.5 block truncate text-xs text-gray-500">{secretary.name}</span>
            </span>
          </PersonButton>
        </div>

        {/* Centre: DG */}
        <div className="order-1 flex justify-center lg:order-2">
          <PersonButton
            exec={dg}
            onSelect={onSelect}
            className="relative flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-4 pr-7 text-white shadow-[0_24px_50px_-20px_rgba(10,74,19,0.7)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(10,74,19,0.8)]"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-1 -z-10 rounded-[1.75rem] bg-gradient-to-r from-[#F4D27A] via-[#117F21] to-[#F4D27A] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60"
            />
            <Avatar exec={dg} size="lg" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A]">Director General</span>
              <span className="mt-1 block text-lg font-bold leading-tight">{dg.name}</span>
              <span className="mt-0.5 block text-xs text-white/70">Chief Executive Officer</span>
            </span>
          </PersonButton>
        </div>

        {/* Right: Internal Audit, Corporate Communications */}
        <div className="order-3 flex flex-col items-center gap-3 lg:items-start">
          {dgOffices.slice(1).map((o) => (
            <div
              key={o.name}
              className="relative flex w-full max-w-xs items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#CB9615]" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#0A2E10]">{o.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DG → bus */}
      <div className="flex justify-center">
        <Line className="h-12" delay={0.35} lit={!!focus} />
      </div>

      {/* Level 3 — Commissioners and their departments */}
      <div className="relative">
        {/* Horizontal bus between the column centres (desktop) */}
        <div className="absolute left-[12.5%] right-[12.5%] top-0 hidden lg:block">
          <Line axis="x" className="w-full" delay={0.5} lit={!!focus} />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {arms.map((arm, ai) => {
            const exec = byId(arm.execId);
            const lit = focus === arm.execId;
            const dim = focus !== null && !lit;
            return (
              <motion.div
                key={arm.execId}
                initial={{ opacity: 0, y: reduce ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.55 + ai * 0.1, ease }}
                onPointerEnter={() => setFocus(arm.execId)}
                onPointerLeave={() => setFocus(null)}
                onFocus={() => setFocus(arm.execId)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(null);
                }}
                className={cn(
                  "flex flex-col items-center [&>*]:transition-opacity [&>*]:duration-300",
                  dim && "[&>*]:opacity-40",
                )}
              >
                <Line className="hidden h-8 lg:block" delay={0.6 + ai * 0.1} lit={lit} />

                <PersonButton
                  exec={exec}
                  onSelect={onSelect}
                  className={cn(
                    "relative w-full rounded-2xl border bg-white p-4 shadow-sm",
                    lit ? "border-[#CB9615] shadow-[0_20px_40px_-20px_rgba(203,150,21,0.6)]" : "border-gray-200",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Avatar exec={exec} />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A6F06]">
                        Commissioner
                      </span>
                      <span className="block text-lg font-bold leading-tight text-[#0A2E10]">{arm.short}</span>
                    </span>
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs">
                    <span className="truncate text-gray-600">{exec.name}</span>
                    <span className="shrink-0 rounded-full bg-[#E8F5E9] px-2 py-0.5 font-semibold text-[#117F21]">
                      {arm.departments.length} depts
                    </span>
                  </span>
                </PersonButton>

                {/* Departments on a spine */}
                <ul className="relative mt-4 w-full space-y-3 pl-6">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-6 left-2 top-0 w-0.5 rounded-full transition-colors duration-300",
                      lit ? "bg-[#CB9615]" : "bg-[#117F21]/20",
                    )}
                  />
                  {arm.departments.map((d, di) => {
                    const key = `${arm.execId}-${di}`;
                    const isOpen = showAll || !!open[key];
                    const hasUnits = !!d.units?.length;
                    return (
                      <motion.li
                        key={key}
                        initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.7 + ai * 0.1 + di * 0.07, ease }}
                        className="relative"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -left-4 top-6 h-0.5 w-4 transition-colors duration-300",
                            lit ? "bg-[#CB9615]" : "bg-[#117F21]/20",
                          )}
                        />
                        <div
                          className={cn(
                            "overflow-hidden rounded-xl border bg-white transition duration-300",
                            isOpen ? "border-[#117F21]/40 shadow-md" : "border-gray-200 hover:border-[#117F21]/40 hover:shadow-md",
                          )}
                        >
                          {hasUnits ? (
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
                              disabled={showAll}
                              className="flex min-h-12 w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-[#0A2E10] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D] disabled:cursor-default"
                            >
                              <span>{d.name}</span>
                              <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-gray-500">
                                {d.units!.length}
                                <ChevronDown
                                  aria-hidden="true"
                                  className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180 text-[#117F21]")}
                                />
                              </span>
                            </button>
                          ) : (
                            <p className="flex min-h-12 items-center px-4 py-3 text-sm font-semibold text-[#0A2E10]">{d.name}</p>
                          )}
                          <AnimatePresence initial={false}>
                            {hasUnits && isOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease }}
                                className="border-t border-gray-100 bg-[#F7FAF6]"
                              >
                                {d.units!.map((u) => (
                                  <li key={u} className="flex items-start gap-2 px-4 py-2 text-xs leading-snug text-gray-600 first:pt-3 last:pb-3">
                                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#117F21]" />
                                    {u}
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── List view (text alternative) ─────────────────────────── */

function ListView({ onSelect }: { onSelect: (id: string) => void }) {
  const person = (e: Exec) => (
    <button
      type="button"
      onClick={() => onSelect(e.id)}
      className="rounded font-medium text-[#117F21] underline decoration-[#117F21]/30 underline-offset-4 hover:decoration-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
    >
      {e.name}
    </button>
  );
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10">
      <h3 className="text-lg font-bold text-[#0A2E10]">Reporting lines</h3>
      <ul className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
        <li>
          <strong className="text-[#0A2E10]">The Board</strong> of the National Pension Commission oversees the Commission.
          <ul className="mt-4 space-y-4 border-l-2 border-[#117F21]/15 pl-5">
            <li>
              <strong className="text-[#0A2E10]">Director General</strong> ({person(dg)}) reports to the Board.
              <ul className="mt-3 space-y-2 border-l-2 border-[#117F21]/15 pl-5">
                <li>
                  {dgOffices[0].name} ({person(secretary)}) reports to the Director General.
                </li>
                {dgOffices.slice(1).map((o) => (
                  <li key={o.name}>{o.name} reports to the Director General.</li>
                ))}
                {arms.map((arm) => {
                  const e = byId(arm.execId);
                  return (
                    <li key={arm.execId}>
                      <strong className="text-[#0A2E10]">{e.title}</strong> ({person(e)}) reports to the Director General
                      and oversees:
                      <ul className="mt-2 space-y-1.5 border-l-2 border-[#CB9615]/30 pl-5">
                        {arm.departments.map((d) => (
                          <li key={d.name}>
                            {d.name}
                            {d.units && <span className="text-gray-500"> ({d.units.join(", ")})</span>}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

/* ─────────────────────────── Section ─────────────────────────── */

export default function Organogram({ onSelect }: { onSelect: (id: string) => void }) {
  const [view, setView] = useState<"chart" | "list">("chart");
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="structure" aria-labelledby="structure-title" className="relative scroll-mt-40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="structure-title"
            eyebrow="Organisational structure"
            title="Built for effective regulation and accountability."
            highlight="regulation and accountability."
            intro="A clear line of reporting runs from the Board through the Director General and four Commissioners to every department. Select a person to read their profile, or a department to see its units."
          />

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <div role="group" aria-label="View" className="inline-flex rounded-xl bg-gray-100 p-1">
              {(
                [
                  { v: "chart", label: "Chart", Icon: Network },
                  { v: "list", label: "List", Icon: List },
                ] as const
              ).map(({ v, label, Icon }) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "relative isolate inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
                    view === v ? "text-[#0A4A13]" : "text-gray-500 hover:text-gray-800",
                  )}
                >
                  {view === v && (
                    <motion.span
                      layoutId="org-view-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
            {view === "chart" && (
              <button
                type="button"
                aria-pressed={showAll}
                onClick={() => setShowAll((s) => !s)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:border-[#117F21]/40 hover:text-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                {showAll ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
                {showAll ? "Collapse units" : "Show all units"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease }}
            >
              {view === "chart" ? (
                <div
                  className="relative overflow-hidden rounded-[2rem] border border-gray-200/80 bg-gradient-to-b from-[#F7FAF6] to-white p-5 sm:p-8 lg:p-12"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(17,127,33,0.10) 1px, transparent 1px), linear-gradient(to bottom, #F7FAF6, #ffffff)",
                    backgroundSize: "22px 22px, 100% 100%",
                  }}
                >
                  <Chart onSelect={onSelect} showAll={showAll} />
                </div>
              ) : (
                <ListView onSelect={onSelect} />
              )}
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-xs text-gray-500">
            Based on the Commission’s published organisational chart. Department names are to be confirmed with Human
            Resources before launch.
          </p>
        </div>
      </div>
    </section>
  );
}
