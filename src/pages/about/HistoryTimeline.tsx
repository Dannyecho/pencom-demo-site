import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapters } from "./data";
import { CountUp, GridBackdrop, SectionHeading, ease } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Scroll-driven history (inspired by ndic.gov.ng/about#history):
 * a sticky panel shows the current chapter's year while the chapters scroll past,
 * a gold line fills as you read, and a year rail lets you jump to any milestone.
 */
export default function HistoryTimeline() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.chapter));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = chapters[active];

  return (
    <section
      id="history"
      aria-labelledby="history-title"
      className="relative isolate scroll-mt-40 overflow-clip bg-[#04240A] py-24 text-white sm:py-32"
    >
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-[#117F21]/30 blur-[160px]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-[#CB9615]/15 blur-[160px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 select-none text-center text-[22vw] font-black leading-none tracking-tighter text-white/[0.025]"
      >
        PENCOM
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="history-title"
          dark
          center
          eyebrow="Our history"
          title="How the Commission has evolved over the years"
          highlight="evolved over the years"
          intro="From Nigeria’s first pension law in 1951 to a ₦31.8 trillion industry: the milestones that shaped how Nigerians save for retirement."
        />

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* ── Sticky year panel (desktop) ── */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[190px]">
              <p className="font-mono text-sm tracking-[0.3em] text-[#F4D27A]" aria-hidden="true">
                {pad(active + 1)} <span className="text-white/30">/ {pad(chapters.length)}</span>
              </p>

              <div className="relative mt-4 h-[9.5rem] overflow-hidden" aria-hidden="true">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.year}
                    initial={{ y: reduce ? 0 : "60%", opacity: 0, filter: reduce ? "none" : "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: reduce ? 0 : "-60%", opacity: 0, filter: reduce ? "none" : "blur(8px)" }}
                    transition={{ duration: 0.55, ease }}
                    className="absolute inset-0 block bg-gradient-to-b from-[#F8E3A6] via-[#E9B949] to-[#CB9615]/40 bg-clip-text text-[9.5rem] font-black leading-none tracking-tighter text-transparent"
                  >
                    {current.year}
                  </motion.span>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/50"
                  aria-hidden="true"
                >
                  {current.period}
                </motion.p>
              </AnimatePresence>

              {/* Year rail */}
              <nav aria-label="Jump to a year" className="mt-10">
                <ol className="relative space-y-1 border-l border-white/10">
                  {chapters.map((c, i) => {
                    const on = i === active;
                    return (
                      <li key={c.id}>
                        <Link
                          to={{ hash: c.id }}
                          replace
                          aria-current={on ? "step" : undefined}
                          className={cn(
                            "group relative -ml-px flex min-h-10 items-center gap-4 border-l-2 py-1.5 pl-5 text-sm transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
                            on
                              ? "border-[#F4D27A] text-white"
                              : i < active
                                ? "border-[#F4D27A]/30 text-white/60 hover:text-white"
                                : "border-transparent text-white/40 hover:text-white",
                          )}
                        >
                          <span className="w-20 shrink-0 font-mono font-semibold">{c.rail}</span>
                          <span className={cn("truncate transition-opacity", on ? "opacity-100" : "opacity-0 group-hover:opacity-70")}>
                            {c.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>

          {/* ── Chapters ── */}
          <div className="lg:col-span-7">
            <ol ref={listRef} className="relative space-y-8 pl-10 sm:pl-14 lg:space-y-28 lg:py-[6vh]">
              {/* Track + scroll fill */}
              <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10 sm:left-[15px]" />
              <motion.span
                aria-hidden="true"
                style={{ scaleY: fill }}
                className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-[#F4D27A] via-[#E9B949] to-[#117F21] shadow-[0_0_12px_rgba(244,210,122,0.8)] sm:left-[15px]"
              />

              {chapters.map((c, i) => {
                const on = i === active;
                const past = i < active;
                return (
                  <li key={c.id} id={c.id} data-chapter={i} className="relative scroll-mt-[220px]">
                    {/* Node */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-10 top-8 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-500 sm:-left-14 sm:h-8 sm:w-8",
                        on
                          ? "border-[#F4D27A] bg-[#F4D27A] shadow-[0_0_0_8px_rgba(244,210,122,0.15),0_0_30px_rgba(244,210,122,0.6)]"
                          : past
                            ? "border-[#F4D27A]/60 bg-[#04240A]"
                            : "border-white/20 bg-[#04240A]",
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full transition-colors duration-500",
                          on ? "bg-[#04240A]" : past ? "bg-[#F4D27A]" : "bg-white/30",
                        )}
                      />
                    </span>

                    <div className={cn("transition-opacity duration-500", !on && "lg:opacity-50")}>
                    <motion.article
                      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.7, ease }}
                      aria-labelledby={`${c.id}-title`}
                      className={cn(
                        "relative overflow-hidden rounded-3xl border p-7 backdrop-blur-sm transition-all duration-500 sm:p-9",
                        on
                          ? "border-[#F4D27A]/30 bg-white/[0.07] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
                          : "border-white/10 bg-white/[0.03]",
                      )}
                    >
                      {on && (
                        <span
                          aria-hidden="true"
                          className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#F4D27A]/10 blur-3xl"
                        />
                      )}
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                        <span className="text-[#F4D27A]">
                          {pad(i + 1)} / {pad(chapters.length)}
                        </span>
                        <span aria-hidden="true" className="h-px w-6 bg-white/20" />
                        <span>{c.period}</span>
                      </p>
                      <p className="mt-3 text-5xl font-black tracking-tight text-[#F4D27A] lg:hidden" aria-hidden="true">
                        {c.year}
                      </p>
                      <h3 id={`${c.id}-title`} className="mt-3 text-2xl font-bold leading-tight sm:text-[1.7rem]">
                        <span className="sr-only">{c.rail}: </span>
                        {c.title}
                      </h3>
                      <p className="mt-4 leading-relaxed text-white/75">{c.body}</p>

                      {c.points && (
                        <ul className="mt-5 space-y-3">
                          {c.points.map((p) => (
                            <li key={p} className="flex gap-3 text-sm leading-relaxed text-white/80">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#117F21]/40 ring-1 ring-[#2E913D]">
                                <Check className="h-3 w-3 text-[#B9F0C2]" aria-hidden="true" />
                              </span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}

                      {c.figure && (
                        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-[#117F21]/30 to-transparent p-4">
                          <CountUp value={c.figure.value} className="text-3xl font-black text-[#F4D27A]" />
                          <span className="text-sm leading-snug text-white/70">{c.figure.label}</span>
                        </div>
                      )}
                    </motion.article>
                    </div>
                  </li>
                );
              })}
            </ol>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="mt-12 flex flex-wrap items-center gap-4 pl-10 sm:pl-14"
            >
              <p className="text-white/60">The story continues in our annual reports.</p>
              <Link
                to="/resources#publications"
                className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#F4D27A] hover:text-[#F4D27A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                Read the annual reports
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
