import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, Check, ExternalLink, FileCheck, HeartPulse, LogOut, MessageCircle, MessageSquareWarning, RefreshCw, ShieldCheck, Store, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { GridBackdrop, SectionHeading, Spotlight, ease } from "@/pages/about/primitives";
import { portals } from "./data";

const icons = { ehub: FileCheck, pcrs: Banknote, cobra: UserCheck, pencap: RefreshCw, pencare: HeartPulse, ppp: Store };

export function Portals({ onHandoff }: { onHandoff: (key: string) => void }) {
  return (
    <section id="portals" aria-labelledby="portals-title" className="relative isolate scroll-mt-40 overflow-hidden bg-[#04240A] py-20 text-white sm:py-28">
      <GridBackdrop className="-z-10" />
      <div aria-hidden="true" className="absolute -left-32 bottom-0 -z-10 h-[480px] w-[480px] rounded-full bg-[#117F21]/40 blur-[150px]" />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="portals-title" dark eyebrow="Online services" title="Which portal do you need?" highlight="Which portal" intro="Some PenCom services run on their own websites. Each card says what it’s for, and we’ll tell you what to prepare before you leave." />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((p, i) => {
            const I = icons[p.key as keyof typeof icons] ?? ExternalLink;
            return (
              <motion.li key={p.key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }}>
                <Spotlight color="rgba(244,210,122,0.18)" className="h-full rounded-3xl border border-white/10 bg-white/[0.05] transition duration-300 hover:-translate-y-1 hover:border-[#F4D27A]/40 has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-[#FFD84D]">
                  <button type="button" onClick={() => onHandoff(p.key)} className="group flex h-full w-full flex-col p-6 text-left focus-visible:outline-none">
                    <span className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4D27A]/15 text-[#F4D27A] transition duration-500 group-hover:rotate-6 group-hover:bg-[#F4D27A] group-hover:text-[#04240A]">
                        <I className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <ExternalLink className="h-5 w-5 text-white/30 transition group-hover:text-[#F4D27A]" aria-hidden="true" />
                    </span>
                    <span className="mt-5 block text-xl font-bold">{p.name}</span>
                    <span className="block text-xs text-white/50">{p.full}</span>
                    <span className="mt-3 block leading-relaxed text-white/80">{p.use}</span>
                    <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#F4D27A]">
                      Before you go <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </button>
                </Spotlight>
              </motion.li>
            );
          })}
        </ul>
        <p className="mt-6 text-xs text-white/50">Descriptions to be confirmed by each portal’s owner before launch.</p>
      </div>
    </section>
  );
}

/** Hand-off screen (DES-26): what the portal is for, what to prepare and what happens next, before leaving the site. */
export function Handoff({ portalKey, onClose }: { portalKey: string | null; onClose: () => void }) {
  const p = portals.find((x) => x.key === portalKey);
  const I = p ? icons[p.key as keyof typeof icons] ?? ExternalLink : ExternalLink;
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden rounded-3xl border-0 p-0 sm:max-w-lg [&>button:last-child]:right-4 [&>button:last-child]:top-4 [&>button:last-child]:flex [&>button:last-child]:h-10 [&>button:last-child]:w-10 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-white/15 [&>button:last-child]:text-white [&>button:last-child]:opacity-100">
        {p && (
          <>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#04240A] to-[#117F21] p-7 text-white">
              <I aria-hidden="true" className="absolute -right-4 -top-4 h-36 w-36 text-white/[0.07]" />
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]"><LogOut className="h-4 w-4" aria-hidden="true" /> You’re about to leave this site</p>
              <DialogTitle className="mt-3 text-2xl font-bold text-white">{p.full}</DialogTitle>
              <DialogDescription className="mt-2 text-white/80">{p.use}</DialogDescription>
            </div>
            <div className="space-y-5 p-7">
              {p.prepare ? (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Have these ready</h3>
                  <ul className="mt-3 space-y-2">
                    {p.prepare.map((x) => (
                      <li key={x} className="flex gap-3 text-sm text-gray-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />{x}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="rounded-xl bg-[#F7FAF6] p-3 text-sm text-gray-600">A checklist for this portal will be added by its owner.</p>
              )}
              {p.next && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">What happens next</h3>
                  <p className="mt-2 text-sm text-gray-700">{p.next}</p>
                </div>
              )}
              <p className="flex gap-2 rounded-xl bg-[#FFF8E1] p-3 text-xs text-[#5C4300]">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                Check the address bar shows a pencom.gov.ng address before you sign in. PenCom will never ask for your password by phone or SMS.
              </p>
              <div className="flex flex-wrap gap-3">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={onClose} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#117F21] px-5 font-semibold text-white transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                    Continue to {p.name} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center rounded-xl bg-gray-100 px-5 text-sm font-semibold text-gray-500">Portal link to be confirmed</span>
                )}
                <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-gray-200 px-5 font-semibold text-gray-700 hover:border-gray-400">Stay here</button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function HelpBand() {
  return (
    <section aria-label="Get help" className="px-4 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: MessageCircle, title: "Ask PenCom Assistant", body: "Quick answers from our published guidance.", chat: true, tone: "green" },
          { icon: MessageSquareWarning, title: "Report an employer", body: "Deducting pension but not remitting it? Tell us.", to: "/connect#report", tone: "red" },
          { icon: UserCheck, title: "Find a PFA", body: "Contacts for every licensed Pension Fund Administrator.", to: "/operators#directory", tone: "gold" },
        ].map((c, i) => {
          const cls = cn(
            "group flex h-full flex-col rounded-3xl border p-7 text-left transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
            c.tone === "green" ? "border-transparent bg-gradient-to-br from-[#04240A] to-[#117F21] text-white" : c.tone === "red" ? "border-[#B52026]/20 bg-[#FDF3F3]" : "border-[#CB9615]/25 bg-[#FFF8E1]",
          );
          const inner = (
            <>
              <c.icon className={cn("h-9 w-9", c.tone === "green" ? "text-[#F4D27A]" : c.tone === "red" ? "text-[#B52026]" : "text-[#9A6F06]")} aria-hidden="true" />
              <span className={cn("mt-4 block text-xl font-bold", c.tone !== "green" && "text-[#0A2E10]")}>{c.title}</span>
              <span className={cn("mt-1 block", c.tone === "green" ? "text-white/75" : "text-gray-600")}>{c.body}</span>
              <span className="mt-auto block pt-6"><ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </>
          );
          return (
            <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08, ease }}>
              {c.chat ? (
                <button type="button" onClick={() => document.getElementById("chat-trigger")?.click()} className={cn(cls, "w-full")}>{inner}</button>
              ) : (
                <Link to={c.to!} className={cls}>{inner}</Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
