import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { siteNotices, type NoticeType } from "@/lib/alerts";
import { cn } from "@/lib/utils";
import { CountUp } from "@/pages/about/primitives";
import { headOffice } from "@/pages/connect/data";
import { externalPortals, faqs, figures } from "@/pages/home/data";
import { openChat } from "@/pages/home/SiteSearch";
import { news, newsPath } from "@/pages/news/data";
import { library } from "@/pages/regulations/library";
import Title from "./Title";

const ease = [0.22, 1, 0.36, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
const TOTAL = 6;
const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const more = cn("group inline-flex min-h-11 items-center gap-2 text-[#111A13] underline decoration-[#111A13]/25 underline-offset-[6px] transition hover:text-[#117F21] hover:decoration-[#117F21]", focus);

function Fade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: reduce ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.7, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
}

const Section = ({ id, children, className }: { id: string; children: ReactNode; className?: string }) => (
  <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-32 px-4 py-20 sm:py-28", className)}>
    <div className="mx-auto max-w-7xl">{children}</div>
  </section>
);

/* ─────────────────────────── 1 Alerts ─────────────────────────── */

const dot: Record<NoticeType, { c: string; label: string }> = {
  critical: { c: "bg-[#D32F2F]", label: "Critical" },
  warning: { c: "bg-[#D97706]", label: "Warning" },
  info: { c: "bg-[#1E88E5]", label: "Information" },
  success: { c: "bg-[#2E913D]", label: "Update" },
};

export function Alerts() {
  const { t } = useI18n();
  return (
    <Section id="m-alerts">
      <Title id="m-alerts-title" label={t("Alerts")} index={1} total={TOTAL} title="Important alerts" mark="alerts" />
      <ul className="mt-12 border-t border-[#111A13]/10">
        {siteNotices.map((n, i) => (
          <li key={n.id} className="border-b border-[#111A13]/10">
            <Fade delay={i * 0.06} className="grid grid-cols-1 gap-3 py-7 md:grid-cols-12 md:gap-8">
              <p className="flex items-center gap-3 self-start text-sm text-[#111A13]/[0.62] md:col-span-3 md:pt-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", dot[n.type].c)} aria-hidden="true" />
                {t(dot[n.type].label)}
              </p>
              <div className="md:col-span-7">
                <h3 className="text-xl text-[#111A13]">{t(n.title)}</h3>
                <p className="mt-2 leading-relaxed text-[#111A13]/70">{t(n.message)}</p>
              </div>
              {n.link && (
                <div className="md:col-span-2 md:text-right">
                  <Link to={n.link.to} className={more}>
                    {t(n.link.label)}
                  </Link>
                </div>
              )}
            </Fade>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ─────────────────────────── 2 Circulars ─────────────────────────── */

export function Circulars() {
  const { t } = useI18n();
  const latest = [...library].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <Section id="m-circulars" className="bg-[#F6F6F2]">
      <Title id="m-circulars-title" label={t("Regulatory updates")} index={2} total={TOTAL} title="Latest circulars and guidelines" mark="circulars" />
      <ol className="mt-12 border-t border-[#111A13]/10">
        {latest.map((d, i) => (
          <li key={d.id} className="border-b border-[#111A13]/10">
            <Fade delay={i * 0.05}>
              <Link to={`/regulations/doc/${d.id}`} className={cn("group relative isolate grid grid-cols-1 gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-8", focus)}>
                <span aria-hidden="true" className="absolute inset-y-0 -left-4 -right-4 -z-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative font-mono text-sm tabular-nums text-[#111A13]/[0.62] md:col-span-2">{fmt(d.date)}</span>
                <span className="relative text-sm text-[#117F21] md:col-span-2">{d.type}</span>
                <span className="relative text-lg leading-snug text-[#111A13] md:col-span-7">{d.title}</span>
                <ArrowRight className="relative hidden h-5 w-5 justify-self-end text-[#111A13]/30 transition group-hover:translate-x-1 group-hover:text-[#117F21] md:block" aria-hidden="true" />
              </Link>
            </Fade>
          </li>
        ))}
      </ol>
      <p className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
        <Link to="/regulations#library" className={more}>{t("Open the library")}</Link>
        <Link to="/regulations/pension-reform-act" className={more}>Pension Reform Act 2014</Link>
      </p>
    </Section>
  );
}

/* ─────────────────────────── 3 Online services ─────────────────────────── */

export function Portals() {
  const { t } = useI18n();
  return (
    <Section id="m-online">
      <Title id="m-online-title" label={t("Online services")} index={3} total={TOTAL} title="Go straight to the right portal" mark="right portal" />
      <ul className="mt-12 grid grid-cols-1 border-l border-t border-[#111A13]/10 sm:grid-cols-2 lg:grid-cols-4">
        {externalPortals.map((p, i) => (
          <li key={p.name} className="border-b border-r border-[#111A13]/10">
            <Fade delay={i * 0.06} className="h-full">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className={cn("group flex h-full min-h-[13rem] flex-col p-7 transition-colors duration-300 hover:bg-[#111A13] hover:text-white", focus)}>
                <span className="flex items-start justify-between">
                  <span className="text-3xl font-bold tracking-tight">{p.name}</span>
                  <ArrowUpRight className="h-6 w-6 opacity-40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#F4D27A] group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="mt-auto pt-8 text-[#111A13]/70 transition group-hover:text-white/80">{t(p.description)}</span>
                <span className="mt-1 text-sm text-[#111A13]/[0.62] transition group-hover:text-white/55">{p.url.replace("https://", "")}</span>
                <span className="sr-only">{t("(opens in a new tab)")}</span>
              </a>
            </Fade>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ─────────────────────────── 4 News ─────────────────────────── */

export function News() {
  const { t } = useI18n();
  return (
    <Section id="m-news" className="bg-[#F6F6F2]">
      <Title id="m-news-title" label={t("News and events")} index={4} total={TOTAL} title="What’s happening at PenCom" mark="PenCom" />
      <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {news.slice(0, 3).map((a, i) => (
          <li key={a.id}>
            <Fade delay={i * 0.08}>
              <Link to={newsPath(a)} className={cn("group block", focus)}>
                <span className="block aspect-[4/3] overflow-hidden bg-[#EDEEEA]">
                  <img src={a.image} alt={t(a.imageAlt)} loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                </span>
                <span className="mt-5 block font-mono text-sm text-[#111A13]/[0.62]">{fmt(a.date)}</span>
                <span className="mt-2 block text-xl leading-snug text-[#111A13] decoration-[#117F21] underline-offset-[6px] group-hover:underline">{a.title}</span>
              </Link>
            </Fade>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <Link to="/news" className={more}>
          {t("All news")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </p>
    </Section>
  );
}

/* ─────────────────────────── 5 Figures ─────────────────────────── */

export function Figures() {
  const { t } = useI18n();
  return (
    <Section id="m-figures">
      <Title id="m-figures-title" label={t("Industry figures")} index={5} total={TOTAL} title="The pension industry at a glance" mark="at a glance" />
      <dl className="mt-12 grid grid-cols-1 gap-px border-y border-[#111A13]/10 bg-[#111A13]/10 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f, i) => (
          <Fade key={f.label} delay={i * 0.07} className="bg-white px-1 py-8 sm:px-6">
            <dt className="text-sm text-[#111A13]/[0.62]">{t(f.label)}</dt>
            <dd className="mt-3 text-5xl font-normal tracking-tight text-[#111A13] lg:text-6xl">
              <CountUp value={f.value} />
            </dd>
            <dd className="mt-3 text-sm text-[#117F21]">{t(f.note)}</dd>
          </Fade>
        ))}
      </dl>
      <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <span className="text-[#111A13]/[0.62]">{t("Source: PenCom industry reports")}</span>
        <Link to="/resources/reports/q1-2026" className={more}>{t("Read the Q1 2026 report")}</Link>
      </p>
    </Section>
  );
}

/* ─────────────────────────── 6 Questions and contact ─────────────────────────── */

export function Help() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const tel = headOffice.phone.replace(/\s/g, "");
  return (
    <Section id="m-help" className="bg-[#F6F6F2]">
      <Title id="m-help-title" label={t("Help")} index={6} total={TOTAL} title="Questions and how to reach us" mark="reach us" />
      <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-12">
        <ul className="border-t border-[#111A13]/10 lg:col-span-7">
          {faqs.slice(0, 5).map((f, i) => {
            const on = open === i;
            return (
              <li key={f.question} className="border-b border-[#111A13]/10">
                <h3>
                  <button type="button" id={`mq-${i}`} aria-expanded={on} aria-controls={`ma-${i}`} onClick={() => setOpen(on ? null : i)} className={cn("flex min-h-16 w-full items-center gap-4 py-5 text-left text-lg text-[#111A13]", focus)}>
                    <span className="flex-1">{t(f.question)}</span>
                    {on ? <Minus className="h-5 w-5 text-[#117F21]" aria-hidden="true" /> : <Plus className="h-5 w-5 text-[#111A13]/[0.62]" aria-hidden="true" />}
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`ma-${i}`} role="region" aria-labelledby={`mq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease }}>
                      <p className="max-w-2xl pb-6 leading-relaxed text-[#111A13]/70">{t(f.answer)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
          <li className="pt-6">
            <Link to="/resources/faq" className={more}>{t("See all questions")}</Link>
          </li>
        </ul>

        <dl className="space-y-8 lg:col-span-5">
          <div>
            <dt className="text-sm text-[#111A13]/[0.62]">{t("Call us")}</dt>
            <dd className="mt-1 text-2xl"><a href={`tel:${tel}`} className={cn("hover:text-[#117F21]", focus)}>{headOffice.phone}</a></dd>
          </div>
          <div>
            <dt className="text-sm text-[#111A13]/[0.62]">{t("Email us")}</dt>
            <dd className="mt-1 text-2xl"><a href={`mailto:${headOffice.email}`} className={cn("break-all hover:text-[#117F21]", focus)}>{headOffice.email}</a></dd>
          </div>
          <div>
            <dt className="text-sm text-[#111A13]/[0.62]">{t("Visit an office")}</dt>
            <dd className="mt-1">
              <Link to="/connect#zonal-offices" className={more}>{t("Head office in Abuja and offices in every zone")}</Link>
            </dd>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={openChat} className={cn("inline-flex min-h-12 items-center gap-2 rounded-full bg-[#111A13] px-6 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
              {t("Ask PenCom Assistant")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link to="/connect" className={cn("inline-flex min-h-12 items-center rounded-full border border-[#111A13]/20 px-6 font-semibold text-[#111A13] transition hover:border-[#111A13]", focus)}>
              {t("Make a complaint")}
            </Link>
          </div>
        </dl>
      </div>
    </Section>
  );
}
