import { Link } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Mail, MapPin, MessageCircle, MessageSquareWarning, Phone, Search, Send, Building2 } from "lucide-react";
import { GridBackdrop, Tilt, ease } from "@/pages/about/primitives";
import { headOffice, social } from "./data";

export default function ConnectHero({ go }: { go: (id: string, topic?: string) => void }) {
  const reduce = useReducedMotion();
  const actions = [
    { id: "contact", topic: "enquiry", icon: Send, title: "Ask a question", body: "Send us an enquiry" },
    { id: "contact", topic: "pfa", icon: MessageSquareWarning, title: "Make a complaint", body: "About a PFA or PenCom" },
    { id: "contact", topic: "employer", icon: Building2, title: "Report an employer", body: "Pension not remitted" },
    { id: "track", icon: Search, title: "Track a case", body: "Use your case reference" },
  ];
  return (
    <section aria-labelledby="connect-title" className="relative isolate overflow-hidden bg-[#04240A] text-white">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-[#117F21]/50 blur-[150px]" />
      <div aria-hidden="true" className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#CB9615]/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-white/60">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-medium text-white">Connect</li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.h1 id="connect-title" initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              How can we <span className="bg-gradient-to-r from-[#F4D27A] to-[#CB9615] bg-clip-text text-transparent">help you?</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }} className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Ask a question, make a complaint, report an employer or track a case. Or visit us at our head office or one of six zonal offices.
            </motion.p>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
              {actions.map((a, i) => (
                <motion.li key={a.title} initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease }}>
                  <Tilt className="h-full">
                    <button type="button" onClick={() => go(a.id, a.topic)} className="group flex h-full w-full flex-col items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4 sm:flex-row sm:gap-4 sm:p-5 text-left backdrop-blur transition hover:border-[#F4D27A]/50 hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F4D27A]/15 text-[#F4D27A] transition group-hover:bg-[#F4D27A] group-hover:text-[#04240A]">
                        <a.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold leading-snug">{a.title}</span>
                        <span className="mt-0.5 block text-sm text-white/60">{a.body}</span>
                      </span>
                      <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-[#F4D27A] sm:block" aria-hidden="true" />
                    </button>
                  </Tilt>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.aside initial={{ opacity: 0, y: reduce ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease }} aria-label="Contact details" className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-7 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <span aria-hidden="true" className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#F4D27A]/70 to-transparent" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">National Pension Commission</p>
              <ul className="mt-5 space-y-4">
                <li><a href={`tel:${headOffice.phone.replace(/\s/g, "")}`} className="group flex items-center gap-4 rounded-2xl p-2 -m-2 transition hover:bg-white/5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><Phone className="h-5 w-5" aria-hidden="true" /></span><span><span className="block text-xs text-white/55">Call</span><span className="block text-lg font-bold">{headOffice.phone}</span></span></a></li>
                <li><a href={`mailto:${headOffice.email}`} className="group flex items-center gap-4 rounded-2xl p-2 -m-2 transition hover:bg-white/5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><Mail className="h-5 w-5" aria-hidden="true" /></span><span><span className="block text-xs text-white/55">Email</span><span className="block text-lg font-bold">{headOffice.email}</span></span></a></li>
                <li className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10"><MapPin className="h-5 w-5" aria-hidden="true" /></span><span><span className="block text-xs text-white/55">Head office</span><span className="block font-semibold">{headOffice.address}</span></span></li>
              </ul>
              <button type="button" onClick={() => document.getElementById("chat-trigger")?.click()} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#CB9615] font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat with PenCom Assistant
              </button>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs text-white/55">Follow our verified accounts</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <li key={s.name}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center rounded-full border border-white/15 px-3 text-xs font-semibold text-white/85 transition hover:border-[#F4D27A] hover:text-[#F4D27A]">
                        {s.name}<span className="sr-only"> {s.handle} (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
