import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, LayoutGrid, Minimize, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWidth } from "@/pages/performance/charts";

/**
 * 3D flip book. Two-page spreads on wide screens, one page on phones.
 * Turn pages with the arrows, the keyboard, a click on either page, or a swipe.
 * Pages are either HTML (designed at 420 × 594) or images rendered from the issue PDF.
 */

export type BookPage = { title: string; node?: ReactNode; img?: string | null };

const BASE_W = 420;
const BASE_H = 594;
const RATIO = BASE_H / BASE_W;
const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";

function Face({ page, w, side, k }: { page?: BookPage; w: number; side: "left" | "right" | "single"; k: number }) {
  if (!page) return null;
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FFFDF8]">
      {page.img ? (
        <img src={page.img} alt={page.title} className="h-full w-full object-cover" draggable={false} />
      ) : page.node ? (
        <div style={{ width: BASE_W, height: BASE_H, transform: `scale(${k})`, transformOrigin: "top left" }} className="pointer-events-none select-none">
          {page.node}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center" style={{ width: w }}>
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#117F21]/20 border-t-[#117F21]" aria-hidden="true" />
        </div>
      )}
      {/* gutter shading */}
      {side !== "single" && (
        <span aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 w-12", side === "left" ? "right-0 bg-gradient-to-l from-black/25 via-black/5 to-transparent" : "left-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent")} />
      )}
      {side === "single" && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/20 to-transparent" />}
    </div>
  );
}

export default function FlipBook({ pages, onPlain, label }: { pages: BookPage[]; onPlain?: () => void; label: string }) {
  const reduce = useReducedMotion();
  const shell = useRef<HTMLDivElement>(null);
  const [wrap, cw] = useWidth<HTMLDivElement>();
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const [full, setFull] = useState(false);
  const [thumbs, setThumbs] = useState(false);
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState<null | { dir: 1 | -1; key: number; to: number }>(null);
  const startX = useRef<number | null>(null);

  const wide = cw >= 720;
  const n = pages.length;
  const views = wide ? Math.floor(n / 2) + 1 : n;
  const maxH = (full ? vh - 150 : Math.min(vh * 0.74, 760));
  const pw = Math.max(140, Math.floor(wide ? Math.min(cw / 2 - 8, maxH / RATIO) : Math.min(cw - 8, maxH / RATIO, 460)));
  const ph = Math.round(pw * RATIO);
  const k = pw / BASE_W;

  useEffect(() => {
    const r = () => setVh(window.innerHeight);
    const f = () => setFull(document.fullscreenElement === shell.current);
    window.addEventListener("resize", r);
    document.addEventListener("fullscreenchange", f);
    return () => {
      window.removeEventListener("resize", r);
      document.removeEventListener("fullscreenchange", f);
    };
  }, []);

  // Keep the position valid when switching between one- and two-page layouts.
  const prevWide = useRef(wide);
  useEffect(() => {
    if (prevWide.current === wide) return;
    setPos((p) => (wide ? Math.ceil(p / 2) : Math.max(0, p * 2 - 1)));
    prevWide.current = wide;
  }, [wide]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (flip) return;
      const next = pos + dir;
      if (next < 0 || next >= views) return;
      if (reduce) setPos(next);
      else setFlip({ dir, key: Date.now(), to: next });
    },
    [flip, pos, views, reduce],
  );

  const jump = (view: number) => {
    setFlip(null);
    setPos(Math.max(0, Math.min(views - 1, view)));
    setThumbs(false);
  };

  // Idempotent: the animation can report completion more than once.
  const done = () => {
    if (!flip) return;
    setPos(flip.to);
    setFlip(null);
  };

  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.current?.requestFullscreen();
    } catch {
      /* fullscreen not allowed */
    }
  };

  const at = (i: number) => (i >= 0 && i < n ? pages[i] : undefined);
  const L = (s: number) => at(2 * s - 1);
  const R = (s: number) => at(2 * s);

  // What sits underneath while a leaf is turning.
  const leftUnder = wide ? (flip?.dir === -1 ? L(pos - 1) : L(pos)) : undefined;
  const rightUnder = wide ? (flip?.dir === 1 ? R(pos + 1) : R(pos)) : flip?.dir === 1 ? at(pos + 1) : at(pos);
  const shift = wide ? (pos === 0 && !(flip?.dir === 1) ? -pw / 2 : pos === views - 1 && !R(pos) && !(flip?.dir === -1) ? pw / 2 : 0) : 0;
  const visible = wide ? [2 * pos - 1, 2 * pos].filter((i) => i >= 0 && i < n) : [pos];
  const remainingRight = wide ? Math.max(0, n - 1 - 2 * pos) : n - 1 - pos;
  const doneLeft = wide ? Math.max(0, 2 * pos - 1) : pos;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "Home") jump(0);
    if (e.key === "End") jump(views - 1);
  };

  const btn = cn("flex h-11 w-11 items-center justify-center rounded-full border transition disabled:opacity-30", ring, full ? "border-white/20 text-white hover:bg-white/10" : "border-gray-200 bg-white text-gray-700 hover:border-[#117F21] hover:text-[#117F21]");

  return (
    <div ref={shell} className={cn("relative", full && "flex flex-col justify-center bg-[#04240A] p-6")}>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className={cn("text-sm font-semibold", full ? "text-white" : "text-[#0A2E10]")} aria-live="polite">
          {visible.length === 2 ? `Pages ${visible[0] + 1}–${visible[1] + 1}` : `Page ${visible[0] + 1}`} <span className={full ? "text-white/50" : "text-gray-400"}>of {n}</span>
          <span className="sr-only">: {visible.map((i) => pages[i].title).join(" and ")}</span>
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setThumbs((t) => !t)} aria-pressed={thumbs} className={btn} aria-label="All pages"><LayoutGrid className="h-4 w-4" aria-hidden="true" /></button>
          {onPlain && <button type="button" onClick={onPlain} className={btn} aria-label="Read as text"><Type className="h-4 w-4" aria-hidden="true" /></button>}
          <button type="button" onClick={toggleFull} className={btn} aria-label={full ? "Exit full screen" : "Full screen"}>{full ? <Minimize className="h-4 w-4" aria-hidden="true" /> : <Expand className="h-4 w-4" aria-hidden="true" />}</button>
        </div>
      </div>

      <AnimatePresence>
        {thumbs && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 flex gap-3 overflow-x-auto pb-2" aria-label="Jump to a page">
            {pages.map((p, i) => (
              <li key={i} className="shrink-0">
                <button type="button" onClick={() => jump(wide ? Math.ceil(i / 2) : i)} className={cn("group block w-20 text-left", ring)} aria-current={visible.includes(i) ? "page" : undefined}>
                  <span className={cn("relative block h-[113px] w-20 overflow-hidden rounded-md bg-white shadow ring-2 transition group-hover:-translate-y-1", visible.includes(i) ? "ring-[#CB9615]" : "ring-transparent")}>
                    {p.img ? <img src={p.img} alt="" className="h-full w-full object-cover" /> : p.node ? <span className="pointer-events-none absolute left-0 top-0 block" style={{ width: BASE_W, height: BASE_H, transform: `scale(${80 / BASE_W})`, transformOrigin: "top left" }}>{p.node}</span> : null}
                  </span>
                  <span className={cn("mt-1 block truncate text-[11px]", full ? "text-white/70" : "text-gray-500")}>{i + 1}. {p.title}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div ref={wrap} className="relative">
        <div className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => go(-1)} disabled={pos === 0 || !!flip} className={cn(btn, "hidden h-14 w-14 shrink-0 sm:flex")} aria-label="Previous page"><ChevronLeft className="h-6 w-6" aria-hidden="true" /></button>

          <div
            role="region" aria-roledescription="flip book" aria-label={`${label}. Use the left and right arrow keys to turn pages.`} tabIndex={0} onKeyDown={onKey}
            onPointerDown={(e) => { startX.current = e.clientX; }}
            onPointerUp={(e) => {
              if (startX.current === null) return;
              const dx = e.clientX - startX.current;
              startX.current = null;
              if (Math.abs(dx) > 50) return go(dx < 0 ? 1 : -1);
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              go(e.clientX - r.left > r.width / 2 ? 1 : -1);
            }}
            className={cn("relative cursor-pointer touch-pan-y select-none rounded-sm", ring)}
            style={{ width: wide ? pw * 2 : pw, height: ph, perspective: 2400 }}
          >
            {/* floor shadow */}
            <motion.span aria-hidden="true" animate={{ x: shift }} transition={{ duration: reduce ? 0 : 0.9, ease: [0.45, 0, 0.2, 1] }} className="absolute -bottom-6 left-[6%] h-10 w-[88%] rounded-[50%] bg-black/35 blur-xl" />

            <motion.div className="relative h-full w-full" animate={{ x: shift }} transition={{ duration: reduce ? 0 : 0.9, ease: [0.45, 0, 0.2, 1] }} style={{ transformStyle: "preserve-3d" }}>
              {/* page-edge stacks */}
              {remainingRight > 0 && <span aria-hidden="true" className="absolute inset-y-1 right-0 translate-x-full rounded-r-sm bg-[repeating-linear-gradient(90deg,#fff,#fff_1px,#d9d4c5_1px,#d9d4c5_2px)]" style={{ width: Math.min(8, remainingRight * 0.7) }} />}
              {wide && doneLeft > 0 && <span aria-hidden="true" className="absolute inset-y-1 left-0 -translate-x-full rounded-l-sm bg-[repeating-linear-gradient(90deg,#d9d4c5,#d9d4c5_1px,#fff_1px,#fff_2px)]" style={{ width: Math.min(8, doneLeft * 0.7) }} />}

              {wide ? (
                <>
                  <div className="absolute left-0 top-0 h-full" style={{ width: pw }}>{leftUnder && <div className="h-full shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"><Face page={leftUnder} w={pw} side="left" k={k} /></div>}</div>
                  <div className="group absolute right-0 top-0 h-full" style={{ width: pw }}>
                    {rightUnder && <div className="h-full shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"><Face page={rightUnder} w={pw} side="right" k={k} /></div>}
                    {!flip && pos < views - 1 && <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 bg-gradient-to-tl from-[#e8e2d0] via-[#f6f2e6] to-transparent shadow-[-4px_-4px_10px_rgba(0,0,0,0.15)] transition-all duration-300 [clip-path:polygon(100%_0,0_100%,100%_100%)] group-hover:h-14 group-hover:w-14" />}
                  </div>
                  {/* spine */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/20" />
                  {flip && (
                    <motion.div
                      key={flip.key}
                      className="absolute top-0 h-full"
                      style={{ width: pw, left: flip.dir === 1 ? pw : 0, transformOrigin: flip.dir === 1 ? "left center" : "right center", transformStyle: "preserve-3d", zIndex: 20 }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: flip.dir === 1 ? -180 : 180 }}
                      transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
                      onAnimationComplete={done}
                    >
                      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                        <Face page={flip.dir === 1 ? R(pos) : L(pos)} w={pw} side={flip.dir === 1 ? "right" : "left"} k={k} />
                        <motion.span aria-hidden="true" className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.35, 0.35] }} transition={{ duration: 0.9, times: [0, 0.5, 1] }} />
                      </div>
                      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <Face page={flip.dir === 1 ? L(pos + 1) : R(pos - 1)} w={pw} side={flip.dir === 1 ? "left" : "right"} k={k} />
                        <motion.span aria-hidden="true" className="absolute inset-0 bg-black" initial={{ opacity: 0.35 }} animate={{ opacity: [0.35, 0.35, 0] }} transition={{ duration: 0.9, times: [0, 0.5, 1] }} />
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <div className="absolute inset-0 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"><Face page={rightUnder} w={pw} side="single" k={k} /></div>
                  {flip && (
                    <motion.div
                      key={flip.key}
                      className="absolute inset-0"
                      style={{ transformOrigin: "left center", transformStyle: "preserve-3d", zIndex: 20 }}
                      initial={{ rotateY: flip.dir === 1 ? 0 : -180 }}
                      animate={{ rotateY: flip.dir === 1 ? -180 : 0 }}
                      transition={{ duration: 0.75, ease: [0.45, 0, 0.2, 1] }}
                      onAnimationComplete={done}
                    >
                      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}><Face page={flip.dir === 1 ? at(pos) : at(pos - 1)} w={pw} side="single" k={k} /></div>
                      <div className="absolute inset-0 bg-[#F1ECDD]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>

          <button type="button" onClick={() => go(1)} disabled={pos >= views - 1 || !!flip} className={cn(btn, "hidden h-14 w-14 shrink-0 sm:flex")} aria-label="Next page"><ChevronRight className="h-6 w-6" aria-hidden="true" /></button>
        </div>

        {/* Mobile controls + progress */}
        <div className="mt-8 flex items-center gap-4">
          <button type="button" onClick={() => go(-1)} disabled={pos === 0 || !!flip} className={cn(btn, "sm:hidden")} aria-label="Previous page"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
          <div className={cn("relative h-1.5 flex-1 overflow-hidden rounded-full", full ? "bg-white/15" : "bg-gray-200")} aria-hidden="true">
            <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615]" animate={{ width: `${((pos + (flip?.dir ?? 0)) / Math.max(1, views - 1)) * 100}%` }} transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1] }} />
          </div>
          <button type="button" onClick={() => go(1)} disabled={pos >= views - 1 || !!flip} className={cn(btn, "sm:hidden")} aria-label="Next page"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
