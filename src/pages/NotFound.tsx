import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ClipboardList, Home, MessageSquareWarning, Scale, Users } from "lucide-react";
import { GridBackdrop, Tilt, ease } from "@/pages/about/primitives";

/** Page not found (brief §7 utility pages; sitemap: 404). Catch-all route. */
const routes = [
  { to: "/", icon: Home, title: "Home", body: "Start from the homepage" },
  { to: "/services", icon: ClipboardList, title: "Services", body: "Transfers, PPP, PCC and more" },
  { to: "/regulations#library", icon: Scale, title: "Regulations", body: "Circulars and guidelines" },
  { to: "/resources", icon: BookOpen, title: "Resources", body: "Reports, forms and FAQ" },
  { to: "/operators", icon: Users, title: "Operators", body: "Find a licensed PFA or PFC" },
  { to: "/connect#contact", icon: MessageSquareWarning, title: "Contact us", body: "Tell us about the broken link" },
];

export default function NotFound() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => {
    document.title = "Page not found | PenCom";
    return () => {
      document.title = "PenCom Nigeria";
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="nf-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
        <GridBackdrop className="-z-10" />
        <motion.div aria-hidden="true" animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-[#117F21]/50 blur-[130px]" />
        <motion.div aria-hidden="true" animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#CB9615]/25 blur-[110px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:py-28">
          <motion.p initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease }} aria-hidden="true" className="bg-gradient-to-b from-[#F4D27A] to-[#CB9615]/20 bg-clip-text font-display text-[7rem] font-black leading-none text-transparent sm:text-[11rem]">
            404
          </motion.p>
          <motion.h1 id="nf-title" initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }} className="mt-2 text-3xl font-bold sm:text-4xl">
            We can’t find that page
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mx-auto mt-4 max-w-xl text-white/70">
            The address <code className="break-all rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/90">{pathname}</code> may be mistyped, or the page may have moved. Try one of these instead.
          </motion.p>
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((r, i) => (
              <motion.li key={r.to} initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 + i * 0.06, ease }}>
                <Tilt className="h-full">
                  <Link to={r.to} className="group flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur transition hover:border-[#F4D27A]/50 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4D27A]/15 text-[#F4D27A] transition group-hover:bg-[#F4D27A] group-hover:text-[#04240A]"><r.icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-bold">{r.title}</span><span className="block text-sm text-white/60">{r.body}</span></span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-[#F4D27A]" aria-hidden="true" />
                  </Link>
                </Tilt>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}
