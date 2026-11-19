import { useRef } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight, Landmark } from "lucide-react";
import { heroStats } from "./data";
import { CountUp, GridBackdrop, ease } from "./primitives";

const headline = ["Securing", "the", "retirement", "of", "every", "Nigerian", "worker."];

export default function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section
      ref={ref}
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-[#04240A] text-white"
    >
      {/* Photo, parallax + one-time settle */}
      <motion.div style={{ y: imgY }} className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[62%]">
        <motion.img
          src="/images/site/abuja-dusk-1920.webp"
          srcSet="/images/site/abuja-dusk-960.webp 960w, /images/site/abuja-dusk-1920.webp 1920w"
          sizes="(min-width: 1024px) 62vw, 100vw"
          alt=""
          initial={{ scale: reduce ? 1 : 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
          className="h-[115%] w-full object-cover object-[50%_60%] [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        />
      </motion.div>
      {/* Shades */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04240A] via-[#04240A]/92 to-[#04240A]/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#04240A] via-transparent to-[#04240A]/40" />
      <GridBackdrop className="-z-10 opacity-60" />
      {/* Ambient glows */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21] opacity-40 blur-[140px]"
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 4.5, ease: "easeInOut" }}
      />
      <div aria-hidden="true" className="absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#CB9615] opacity-25 blur-[120px]" />

      <motion.div style={{ y: contentY, opacity: fade }} className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 sm:pt-14 lg:pb-28">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-white/60">
            <li>
              <Link to="/" className="rounded hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFD84D]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-white">
              About PenCom
            </li>
          </ol>
        </nav>

        <div>
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A] backdrop-blur"
            >
              <Landmark className="h-3.5 w-3.5" />
              About the Commission
            </motion.span>

            <h1
              id="about-title"
              className="mt-6 text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.25rem]"
            >
              {headline.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className={
                      word === "Nigerian" || word === "worker."
                        ? "inline-block bg-gradient-to-r from-[#F4D27A] to-[#CB9615] bg-clip-text text-transparent"
                        : "inline-block"
                    }
                    initial={{ y: reduce ? 0 : "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease }}
                  >
                    {word}
                  </motion.span>
                  {i < headline.length - 1 && " "}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/75"
            >
              The National Pension Commission licenses and supervises every pension operator in Nigeria, so that what
              workers save is invested safely and paid when they retire. Established in 2004, we now work under the
              Pension Reform Act 2014.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to={{ hash: "history" }}
                replace
                className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-5 py-3 font-semibold text-[#1A1206] shadow-[0_10px_30px_-10px_rgba(203,150,21,0.8)] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
              >
                Explore our history
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={{ hash: "structure" }}
                replace
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
              >
                How we are organised
              </Link>
            </motion.div>
          </div>

          {/* Glass stat strip */}
          <div className="mt-14">
            <ul className="grid grid-cols-1 max-w-3xl gap-3 sm:grid-cols-3">
              {heroStats.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: reduce ? 0 : 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.95 + i * 0.12, ease }}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#04240A]/40 p-5 backdrop-blur-md transition hover:border-[#F4D27A]/50 hover:bg-white/[0.12]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F4D27A] to-[#117F21] opacity-70"
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <CountUp value={s.value} className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]" />
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">{s.note}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/70">{s.label}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
        <div className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
          <motion.span
            className="block h-2 w-1 rounded-full bg-white/80"
            animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
