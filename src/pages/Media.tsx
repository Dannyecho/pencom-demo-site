import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Camera, ChevronLeft, ChevronRight, Clapperboard, Expand, Images, Pause, Play, Youtube, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import SectionNav from "./about/SectionNav";
import { GridBackdrop, SectionHeading, Tilt, ease, reveal, scrollToId } from "./about/primitives";
import { social } from "./connect/data";
import { albums, channelUrl, photoSrc, photos, thumb, topics, videos, type Topic } from "./media/data";

/**
 * Photos and videos (questionnaire "Anything else": news and media centre with photographs and videos;
 * brief §7 "News and events": gallery with alt text). Deep links: /media?album=people, /media?photo=<id>, /media?video=<id>.
 */

const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";
const nav = [
  { id: "videos", label: "Videos" },
  { id: "photos", label: "Photos" },
  { id: "follow", label: "Follow us" },
];

/* ─────────────────────────── Hero: moving photo wall ─────────────────────────── */

function PhotoColumn({ items, dir, paused, speed }: { items: typeof photos; dir: 1 | -1; paused: boolean; speed: number }) {
  const reduce = useReducedMotion();
  const loop = [...items, ...items];
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3"
        animate={reduce || paused ? undefined : { y: dir === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((ph, i) => (
          <img key={`${ph.id}-${i}`} src={photoSrc(ph)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        ))}
      </motion.div>
    </div>
  );
}

function Hero({ onVideos, onPhotos }: { onVideos: () => void; onPhotos: () => void }) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const cols = [photos.filter((_, i) => i % 3 === 0), photos.filter((_, i) => i % 3 === 1), photos.filter((_, i) => i % 3 === 2)];
  return (
    <section aria-labelledby="media-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21]/50 blur-[150px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-10 sm:pt-14 lg:grid-cols-12">
        <div className="pb-14 lg:col-span-6 lg:pb-24">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-1.5 text-sm text-white/60">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li><Link to="/connect" className="hover:text-white">Connect</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li aria-current="page" className="font-medium text-white">Photos and videos</li>
            </ol>
          </nav>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">
            <Camera className="h-3.5 w-3.5" aria-hidden="true" /> Media centre
          </motion.p>
          <motion.h1 id="media-title" initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
            PenCom in <span className="bg-gradient-to-r from-[#F4D27A] to-[#CB9615] bg-clip-text text-transparent">pictures and video</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Events, campaigns and visits from across the country, and the Commission’s work as reported on national television.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onVideos} className={cn("group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#CB9615] px-6 font-semibold text-[#1A1206] transition hover:bg-[#E0AA22]", ring)}>
              <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch videos
            </button>
            <button type="button" onClick={onPhotos} className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 px-6 font-semibold transition hover:bg-white/10", ring)}>
              <Images className="h-4 w-4" aria-hidden="true" /> Browse photos
            </button>
          </div>
          <dl className="mt-10 flex gap-10">
            {[[photos.length, "Photos"], [albums.length, "Albums"], [videos.length, "Videos"]].map(([v, l]) => (
              <div key={l}><dt className="text-sm text-white/55">{l}</dt><dd className="font-display text-3xl font-bold text-[#F4D27A]">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="relative hidden h-[560px] lg:col-span-6 lg:block" aria-hidden="true">
          <div className="absolute inset-0 grid grid-cols-3 gap-3 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
            <PhotoColumn items={cols[0]} dir={1} paused={paused} speed={60} />
            <PhotoColumn items={cols[1]} dir={-1} paused={paused} speed={70} />
            <PhotoColumn items={cols[2]} dir={1} paused={paused} speed={55} />
          </div>
        </div>
        {!reduce && (
          <button type="button" onClick={() => setPaused((p) => !p)} className={cn("absolute bottom-4 right-4 hidden h-11 items-center gap-2 rounded-full bg-black/40 px-4 text-xs font-semibold text-white backdrop-blur hover:bg-black/60 lg:inline-flex", ring)}>
            {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            {paused ? "Play photo wall" : "Pause photo wall"}
          </button>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── Videos ─────────────────────────── */

function Videos({ initial }: { initial: string | null }) {
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState<Topic>("All");
  const [current, setCurrent] = useState(() => videos.find((v) => v.id === initial)?.id ?? videos[0].id);
  const [playing, setPlaying] = useState(!!initial);
  const [hiOk, setHiOk] = useState(true);
  const list = useMemo(() => videos.filter((v) => topic === "All" || v.topic === topic), [topic]);
  const v = videos.find((x) => x.id === current)!;
  const railRef = useRef<HTMLUListElement>(null);

  const choose = (id: string) => {
    setCurrent(id);
    setHiOk(true);
    setPlaying(true);
    if (window.innerWidth < 1024) document.getElementById("player")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <section id="videos" aria-labelledby="vid-title" className="relative isolate scroll-mt-40 overflow-hidden bg-[#020F04] py-20 text-white sm:py-24">
      {/* ambient glow from the current thumbnail */}
      <AnimatePresence>
        <motion.img key={v.id} src={thumb(v.id)} alt="" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover blur-[90px]" />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020F04]/60 via-[#020F04]/80 to-[#020F04]" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading id="vid-title" dark eyebrow="Videos" title="PenCom on TV" highlight="on TV" intro="How national broadcasters have covered the Commission’s work. Videos play from YouTube." />
          <div role="radiogroup" aria-label="Filter videos by topic" className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button key={t} type="button" role="radio" aria-checked={topic === t} onClick={() => setTopic(t)} className={cn("relative min-h-10 rounded-full px-4 text-sm font-semibold transition", ring, topic === t ? "text-[#04240A]" : "text-white/70 ring-1 ring-white/15 hover:text-white")}>
                {topic === t && <motion.span layoutId="vid-topic" className="absolute inset-0 rounded-full bg-[#F4D27A]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div id="player" className="lg:col-span-8">
            <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.iframe
                    key={`play-${v.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${v.title} (${v.channel})`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <motion.button
                    key={`poster-${v.id}`} type="button" onClick={() => setPlaying(true)} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}
                    className={cn("group absolute inset-0 text-left", ring)} aria-label={`Play: ${v.title}`}
                  >
                    <img src={thumb(v.id, hiOk)} onError={() => setHiOk(false)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-white/25 [animation-iteration-count:3]" />}
                      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#CB9615] text-[#1A1206] shadow-2xl transition group-hover:scale-110"><Play className="ml-1 h-8 w-8 fill-current" /></span>
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">{v.channel} · {v.month}</span>
                      <span className="mt-2 block text-xl font-bold leading-snug sm:text-3xl">{v.title}</span>
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="mt-1 max-w-2xl text-white/70">{v.blurb}</p>
                <p className="mt-2 text-xs text-white/50">Video by {v.channel}. Published {v.month}.</p>
              </div>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold hover:bg-white/10", ring)}>
                <Youtube className="h-4 w-4" aria-hidden="true" /> Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-3 flex items-center justify-between text-sm text-white/60"><span>Playlist</span><span aria-live="polite">{list.length} videos</span></p>
            <ul ref={railRef} className="max-h-[560px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              <AnimatePresence initial={false}>
                {list.map((x, i) => {
                  const on = x.id === current;
                  return (
                    <motion.li key={x.id} layout={!reduce} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, delay: i * 0.02 }}>
                      <button type="button" onClick={() => choose(x.id)} aria-current={on ? "true" : undefined} className={cn("group flex w-full gap-3 rounded-2xl p-2 text-left transition", ring, on ? "bg-white/15 ring-1 ring-[#F4D27A]/50" : "hover:bg-white/[0.07]")}>
                        <span className="relative block aspect-video w-36 shrink-0 overflow-hidden rounded-xl bg-white/5">
                          <img src={thumb(x.id)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                          <span className={cn("absolute inset-0 flex items-center justify-center transition", on ? "bg-black/50" : "bg-black/0 group-hover:bg-black/40")}>
                            {on && playing ? (
                              <span className="flex h-4 items-end gap-0.5" aria-hidden="true">{[0, 1, 2].map((k) => <motion.span key={k} className="w-1 rounded-full bg-[#F4D27A]" animate={reduce ? undefined : { height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: k * 0.15 }} style={{ height: "60%" }} />)}</span>
                            ) : <Play className={cn("h-6 w-6 fill-white text-white transition", on ? "opacity-100" : "opacity-0 group-hover:opacity-100")} aria-hidden="true" />}
                          </span>
                        </span>
                        <span className="min-w-0 py-1">
                          <span className={cn("line-clamp-2 text-sm font-semibold leading-snug", on ? "text-[#F4D27A]" : "text-white")}>{x.title}</span>
                          <span className="mt-1 block text-xs text-white/50">{x.channel} · {x.month}</span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={cn("group mt-4 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#B52026] to-[#D93035] p-4 font-semibold transition hover:brightness-110", ring)}>
              <span className="flex items-center gap-3"><Youtube className="h-6 w-6" aria-hidden="true" /> PenCom’s official YouTube channel</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Photos ─────────────────────────── */

function Photos({ album, setAlbum, open }: { album: string; setAlbum: (a: string) => void; open: (id: string) => void }) {
  const reduce = useReducedMotion();
  const shown = photos.filter((p) => album === "all" || p.album === album);
  const a = albums.find((x) => x.id === album);
  const cards = [{ id: "all", title: "All photos", blurb: "Every album", cover: photos[12], n: photos.length }, ...albums.map((al) => ({ ...al, cover: photos.find((p) => p.album === al.id)!, n: photos.filter((p) => p.album === al.id).length }))];
  return (
    <section id="photos" aria-labelledby="ph-title" className="scroll-mt-40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading id="ph-title" eyebrow="Photo gallery" title="Moments from the Commission" highlight="the Commission" intro="Photos from PenCom Chronicles, Issue 1. Select a photo to see it full screen." />
          <Link to="/chronicles" className="inline-flex items-center gap-1 text-sm font-semibold text-[#117F21] hover:underline">From PenCom Chronicles <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>

        {/* Albums */}
        <ul className="mt-10 flex snap-x gap-3 overflow-x-auto pb-3" aria-label="Albums">
          {cards.map((c) => {
            const on = album === c.id;
            return (
              <li key={c.id} className="snap-start">
                <button type="button" onClick={() => setAlbum(c.id)} aria-pressed={on} className={cn("group relative block h-32 w-52 overflow-hidden rounded-2xl text-left text-white transition", ring, on ? "ring-4 ring-[#CB9615]" : "ring-1 ring-black/5")}>
                  <img src={photoSrc(c.cover)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <span className={cn("absolute inset-0 transition", on ? "bg-gradient-to-t from-[#04240A] via-[#04240A]/60 to-[#04240A]/20" : "bg-gradient-to-t from-black/80 via-black/30 to-transparent")} />
                  <span className="absolute inset-x-0 bottom-0 p-3">
                    <span className="block text-sm font-bold leading-tight">{c.title}</span>
                    <span className="block text-xs text-white/70">{c.n} photos</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <AnimatePresence mode="wait">
          <motion.p key={album} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-gray-600" aria-live="polite">
            {a ? <><strong className="text-[#0A2E10]">{a.title}.</strong> {a.blurb} </> : <strong className="text-[#0A2E10]">All albums. </strong>}{shown.length} photos.
          </motion.p>
        </AnimatePresence>

        {/* Masonry */}
        <AnimatePresence mode="wait">
          <motion.ul key={album} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {shown.map((ph, i) => (
              <motion.li key={ph.id} initial={{ opacity: 0, y: reduce ? 0 : 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }} className="mb-4 break-inside-avoid">
                <Tilt max={4}>
                  <button type="button" onClick={() => open(ph.id)} className={cn("group relative block w-full overflow-hidden rounded-2xl bg-gray-100 text-left", ring)}>
                    <img src={photoSrc(ph)} alt={ph.alt} loading="lazy" className={cn("w-full object-cover transition duration-700 group-hover:scale-105", ph.tall ? "aspect-[4/5]" : i % 5 === 0 ? "aspect-[4/3]" : "aspect-[3/2]")} />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#04240A]/95 via-[#04240A]/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <span className="absolute inset-x-0 bottom-0 translate-y-4 p-4 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#F4D27A]">{albums.find((x) => x.id === ph.album)?.title}</span>
                      <span className="mt-1 block text-sm font-semibold leading-snug">{ph.caption}</span>
                    </span>
                    <span className="absolute right-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-white/90 text-[#0A4A13] opacity-0 transition group-hover:scale-100 group-hover:opacity-100"><Expand className="h-4 w-4" aria-hidden="true" /></span>
                  </button>
                </Tilt>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────────── Lightbox ─────────────────────────── */

function Lightbox({ id, list, onChange, onClose }: { id: string | null; list: typeof photos; onChange: (id: string) => void; onClose: () => void }) {
  const reduce = useReducedMotion();
  const idx = list.findIndex((p) => p.id === id);
  const ph = idx >= 0 ? list[idx] : null;
  const [dir, setDir] = useState(1);
  const startX = useRef<number | null>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const go = (d: number) => {
    if (idx < 0) return;
    setDir(d);
    onChange(list[(idx + d + list.length) % list.length].id);
  };
  useEffect(() => {
    stripRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [id, reduce]);

  return (
    <Dialog open={!!ph} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="flex h-[100dvh] max-h-none w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-[#020F04]/[0.97] p-0 text-white sm:max-w-none [&>button:last-child]:hidden"
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
      >
        {ph && (
          <>
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <p className="text-sm text-white/60" aria-live="polite">{idx + 1} / {list.length}</p>
              <button type="button" onClick={onClose} className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20", ring)} aria-label="Close"><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
              onPointerDown={(e) => { startX.current = e.clientX; }}
              onPointerUp={(e) => { if (startX.current === null) return; const dx = e.clientX - startX.current; startX.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.img
                  key={ph.id} src={photoSrc(ph)} alt={ph.alt} custom={dir}
                  initial={{ opacity: 0, x: reduce ? 0 : dir * 80, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: reduce ? 0 : -dir * 80, scale: 0.96 }}
                  transition={{ duration: 0.35, ease }} draggable={false}
                  className="max-h-full max-w-full select-none rounded-xl object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]"
                />
              </AnimatePresence>
              <button type="button" onClick={() => go(-1)} className={cn("absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 sm:left-6", ring)} aria-label="Previous photo"><ChevronLeft className="h-6 w-6" aria-hidden="true" /></button>
              <button type="button" onClick={() => go(1)} className={cn("absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 sm:right-6", ring)} aria-label="Next photo"><ChevronRight className="h-6 w-6" aria-hidden="true" /></button>
            </div>
            <div className="px-4 pb-4 pt-4 text-center sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">{albums.find((x) => x.id === ph.album)?.title}</p>
              <DialogTitle className="mx-auto mt-1 max-w-3xl text-base font-semibold leading-snug sm:text-lg">{ph.caption}</DialogTitle>
              <DialogDescription className="sr-only">{ph.alt}. Use the left and right arrow keys to move between photos.</DialogDescription>
              <p className="mt-1 text-xs text-white/45">Photo: National Pension Commission · PenCom Chronicles, Issue 1</p>
              <ul ref={stripRef} className="mx-auto mt-4 flex max-w-5xl gap-2 overflow-x-auto pb-1" aria-label="All photos">
                {list.map((p) => (
                  <li key={p.id} data-id={p.id} className="shrink-0">
                    <button type="button" onClick={() => { setDir(list.indexOf(p) > idx ? 1 : -1); onChange(p.id); }} aria-current={p.id === ph.id ? "true" : undefined} className={cn("block h-12 w-16 overflow-hidden rounded-md transition", ring, p.id === ph.id ? "opacity-100 ring-2 ring-[#F4D27A]" : "opacity-40 hover:opacity-80")}>
                      <img src={photoSrc(p)} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────── Follow ─────────────────────────── */

function Follow() {
  return (
    <section id="follow" aria-labelledby="follow-title" className="scroll-mt-40 bg-[#F7FAF6] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="follow-title" eyebrow="Follow us" title="Get PenCom news where you already are" highlight="where you already are" intro="These are the Commission’s only official accounts. Be wary of pages that copy PenCom’s name or logo." />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {social.map((s, i) => (
            <motion.li key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, ease }}>
              <Tilt className="h-full">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={cn("group flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#117F21] hover:shadow-[0_24px_50px_-28px_rgba(10,74,19,0.45)]", ring)}>
                  <span className="text-lg font-bold text-[#0A2E10] group-hover:text-[#117F21]">{s.name}</span>
                  <span className="mt-6 flex items-center justify-between text-sm text-gray-500">{s.handle}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Tilt>
            </motion.li>
          ))}
        </ul>
        <motion.div {...reveal} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link to="/news" className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-[#04240A] p-6 text-white", ring)}>
            <span className="flex items-center gap-4"><Clapperboard className="h-8 w-8 text-[#F4D27A]" aria-hidden="true" /><span><span className="block font-bold">Newsroom</span><span className="block text-sm text-white/65">Press releases and statements</span></span></span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link to="/chronicles" className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#CB9615] to-[#E0AA22] p-6 text-[#1A1206]", ring)}>
            <span className="flex items-center gap-4"><Images className="h-8 w-8" aria-hidden="true" /><span><span className="block font-bold">PenCom Chronicles</span><span className="block text-sm text-[#1A1206]/70">Read the magazine</span></span></span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
        <p className="mt-6 text-sm text-gray-500">Journalists: for interviews, photos or footage, contact Corporate Communications at <a href="mailto:info@pencom.gov.ng" className="font-semibold text-[#117F21] underline">info@pencom.gov.ng</a>.</p>
      </div>
    </section>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function Media() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const album = params.get("album") ?? "all";
  const photo = params.get("photo");
  const list = photos.filter((p) => album === "all" || p.album === album);

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v && !(k === "album" && v === "all")) next.set(k, v);
    else next.delete(k);
    setParams(next, { preventScrollReset: true, replace: k === "photo" && !!params.get("photo") && !!v });
  };

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <Hero onVideos={() => scrollToId("videos", !reduce)} onPhotos={() => scrollToId("photos", !reduce)} />
      <SectionNav sections={nav} pillId="media-nav-pill" />
      <Videos initial={params.get("video")} />
      <Photos album={album} setAlbum={(a) => setParam("album", a)} open={(id) => setParam("photo", id)} />
      <Follow />
      <Lightbox id={photo} list={list.some((p) => p.id === photo) ? list : photos} onChange={(id) => setParam("photo", id)} onClose={() => setParam("photo", null)} />
    </MotionConfig>
  );
}
