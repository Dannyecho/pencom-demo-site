import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { audiences, popularTasks, slides } from "@/pages/home/data";
import SiteSearch, { go } from "@/pages/home/SiteSearch";

const ease = [0.22, 1, 0.36, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Minimal opening (DES-19 items 1 and 2): one statement, "I am a…" as plain text tabs with a sliding
 * underline, the chosen audience's tasks as a quiet list, a single-line search, and a photo-only slider
 * whose caption, counter and hairline progress sit underneath it.
 */
export default function Hero() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const H = t("Everything about your pension, in one place.");
  const M = t("your pension");
  const has = H.includes(M);
  const [b, a] = has ? H.split(M) : [H, ""];

  return (
    <section aria-labelledby="hero-title" className="px-4 pb-20 pt-12 sm:pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-sm text-[#111A13]/[0.62]">
            National Pension Commission
          </motion.p>
          <motion.h1
            id="hero-title"
            data-i18n-done={lang !== "en" ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="mt-4 text-[2.6rem] font-normal leading-[1.04] tracking-tight text-[#111A13] sm:text-6xl lg:text-[4.4rem]"
          >
            {b}
            {has && <strong className="font-bold text-[#117F21]">{M}</strong>}
            {a}
          </motion.h1>

          <Audience />

          <div className="mt-12">
            <SiteSearch />
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem]">
              <span className="text-[#111A13]/[0.62]">{t("Popular")}:</span>
              {popularTasks.map((tk) => (
                <Link key={tk.label} to={tk.href} className={cn("text-[#111A13] underline decoration-[#111A13]/25 underline-offset-[6px] transition hover:text-[#117F21] hover:decoration-[#117F21]", focus)}>
                  {tk.label}
                </Link>
              ))}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Slider />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── "I am a…" as text tabs ─────────────────────────── */

function Audience() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [active, setActive] = useState(audiences[0].id);
  const a = audiences.find((x) => x.id === active) ?? audiences[0];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + audiences.length) % audiences.length;
    setActive(audiences[j].id);
    refs.current[j]?.focus();
  };

  return (
    <div className="mt-12">
      <p id="m-iam" className="text-sm text-[#111A13]/[0.62]">{t("I am a…")}</p>
      <div role="tablist" aria-labelledby="m-iam" className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {audiences.map((x, i) => {
          const on = x.id === active;
          return (
            <button
              key={x.id}
              ref={(el) => void (refs.current[i] = el)}
              id={`m-tab-${x.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="m-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(x.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn("relative pb-2 text-xl transition-colors sm:text-2xl", on ? "text-[#111A13]" : "text-[#111A13]/[0.62] hover:text-[#111A13]/70", focus)}
            >
              {x.label}
              {on && <motion.span layoutId="m-underline" className="absolute inset-x-0 bottom-0 h-[2px] bg-[#117F21]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            </button>
          );
        })}
      </div>
      <div id="m-panel" role="tabpanel" aria-labelledby={`m-tab-${a.id}`} className="mt-5 border-t border-[#111A13]/10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }}>
            {a.tasks.slice(0, 4).map((tk) => (
              <li key={tk.label} className="border-b border-[#111A13]/10">
                <button type="button" onClick={() => go(tk, navigate)} className={cn("group flex min-h-14 w-full items-center gap-4 py-3 text-left text-lg text-[#111A13]", focus)}>
                  <span className="flex-1 transition-transform duration-300 group-hover:translate-x-2">{tk.label}</span>
                  {tk.external ? (
                    <ArrowUpRight className="h-5 w-5 text-[#111A13]/[0.62] transition group-hover:text-[#117F21]" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-[#111A13]/[0.62] transition group-hover:translate-x-1 group-hover:text-[#117F21]" aria-hidden="true" />
                  )}
                  {tk.external && <span className="sr-only">{t("(opens in a new tab)")}</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────── Photo-only slider ─────────────────────────── */

const SLIDE_MS = 8000;

function Slider() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [announce, setAnnounce] = useState("");
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);
  useEffect(() => {
    const next = slides[(index + 1) % slides.length];
    if (!next) return;
    const img = new Image();
    img.srcset = next.srcSet;
    img.sizes = "(min-width: 1024px) 40vw, 100vw";
    img.src = next.image;
  }, [index]);

  const goTo = (i: number, user = true) => {
    const n = (i + slides.length) % slides.length;
    setIndex(n);
    if (user) setAnnounce(t("Slide {n} of {total}: {title}", { n: n + 1, total: slides.length, title: t(slides[n].title) }));
  };
  const s = slides[index];
  if (!s) return null;
  const running = playing && !hold && !reduce;
  const txtBtn = cn("min-h-11 px-1 text-sm text-[#111A13]/[0.62] transition hover:text-[#111A13]", focus);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured announcements"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEEEA]">
        <AnimatePresence initial={false}>
          <motion.img
            key={s.id}
            src={s.image}
            srcSet={s.srcSet}
            sizes="(min-width: 1024px) 40vw, 100vw"
            alt={t(s.alt)}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: reduce ? 0 : 1.1, ease }, scale: { duration: reduce ? 0 : 2.4, ease } }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: s.position }}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </AnimatePresence>
      </div>

      {/* hairline progress */}
      <div className="relative mt-5 h-px bg-[#111A13]/15" aria-hidden="true">
        <motion.span
          key={`${index}-${running}`}
          className="absolute inset-y-0 left-0 bg-[#117F21]"
          style={{ height: 2, top: -0.5 }}
          initial={{ width: running ? "0%" : "100%" }}
          animate={{ width: "100%" }}
          transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: "linear" }}
          onAnimationComplete={() => running && goTo(index + 1, false)}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} / ${slides.length}`}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mt-5 min-h-[11rem]"
        >
          <p className="text-sm text-[#111A13]/[0.62]">{s.eyebrow}</p>
          <h2 className="mt-2 text-2xl leading-snug text-[#111A13]">{s.title}</h2>
          <button type="button" onClick={() => go(s.cta, navigate)} className={cn("group mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-[#117F21]", focus)}>
            {s.cta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-sm tabular-nums text-[#111A13]">
          <span className="sr-only">Slide </span>
          {pad(index + 1)}
          <span className="sr-only"> of </span>
          <span aria-hidden="true" className="text-[#111A13]/[0.62]"> / </span>
          <span className="text-[#111A13]/[0.62]">{pad(slides.length)}</span>
        </span>
        <span className="flex items-center gap-4">
          <button type="button" onClick={() => goTo(index - 1)} className={txtBtn}>
            {t("Previous")}
          </button>
          <button type="button" onClick={() => goTo(index + 1)} className={txtBtn}>
            {t("Next")}
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slides" : "Play slides"} className={cn("flex h-11 w-11 items-center justify-center rounded-full border border-[#111A13]/15 text-[#111A13] transition hover:border-[#111A13]", focus)}>
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
