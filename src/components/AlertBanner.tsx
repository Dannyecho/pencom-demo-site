import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Bell, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Info, ShieldAlert, X } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { siteNotices, type NoticeType } from "@/lib/alerts";
import { cn } from "@/lib/utils";

const look: Record<NoticeType, { icon: typeof Info; label: string; badge: string; text: string; glow: string; bar: string }> = {
  critical: { icon: ShieldAlert, label: "Critical", badge: "from-[#E53935] to-[#8E1A1E]", text: "text-[#B52026]", glow: "shadow-[0_0_0_5px_rgba(229,57,53,0.15)]", bar: "from-[#E53935] via-[#F59E0B] to-[#E53935]" },
  warning: { icon: AlertTriangle, label: "Warning", badge: "from-[#F59E0B] to-[#B45309]", text: "text-[#92400E]", glow: "shadow-[0_0_0_5px_rgba(245,158,11,0.18)]", bar: "from-[#F59E0B] via-[#FCD34D] to-[#F59E0B]" },
  info: { icon: Info, label: "Information", badge: "from-[#1E88E5] to-[#0D47A1]", text: "text-[#0B4F8A]", glow: "shadow-[0_0_0_5px_rgba(30,136,229,0.15)]", bar: "from-[#1E88E5] via-[#64B5F6] to-[#1E88E5]" },
  success: { icon: CheckCircle2, label: "Update", badge: "from-[#2E913D] to-[#0A4A13]", text: "text-[#117F21]", glow: "shadow-[0_0_0_5px_rgba(46,145,61,0.15)]", bar: "from-[#117F21] via-[#CB9615] to-[#117F21]" },
};

// Its own key: closing an alert here does not remove it from the header bell.
const KEY = "pencom:home-alerts-closed";
const readClosed = (): string[] => {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
};

const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

/**
 * Home-page alerts: a frosted card floating over the slider. Same notices as the header bell
 * (lib/alerts.ts). Alerts never close or change on their own; readers step through them and close
 * each with × (or all at once). Closed alerts are remembered on this device and stay in the bell.
 * Below 1024px it folds into a one-line bar (type, title, count); "details" opens the message, link
 * and alert controls. From 1024px everything sits in one slim row.
 * Position it with `className` (it is absolutely positioned inside the slider); size the card with `cardClassName`.
 */
export default function AlertBanner({ className, cardClassName }: { className?: string; cardClassName?: string }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [closed, setClosed] = useState<string[]>(readClosed);
  const open = siteNotices.filter((a) => !closed.includes(a.id));
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [more, setMore] = useState(false); // phones and tablets: details open
  const idx = Math.min(i, Math.max(open.length - 1, 0));
  const current = open[idx];

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(closed));
    } catch {
      /* storage unavailable: lasts for this visit */
    }
  }, [closed]);

  const step = (d: number) => {
    setDir(d);
    setI((idx + d + open.length) % open.length);
  };
  const dismiss = () => {
    if (!current) return;
    setDir(1);
    setClosed((c) => [...c, current.id]);
    setI(Math.min(idx, open.length - 2));
  };
  const dismissAll = () => setClosed((c) => [...c, ...open.map((a) => a.id)]);

  const pager = (
    <div className="flex items-center rounded-full bg-gray-100 p-0.5">
      <button type="button" onClick={() => step(-1)} aria-label={t("Previous alert")} className={cn("flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-white hover:text-gray-900", focus)}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="min-w-10 text-center text-xs font-bold tabular-nums text-gray-700">
        <span className="sr-only" data-i18n-done>{t("Alert {n} of {total}", { n: idx + 1, total: open.length })}</span>
        <span aria-hidden="true">{idx + 1}/{open.length}</span>
      </span>
      <button type="button" onClick={() => step(1)} aria-label={t("Next alert")} className={cn("flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-white hover:text-gray-900", focus)}>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  const s = current ? look[current.type] : look.info;
  const Icon = s.icon;
  const behind = Math.min(open.length - 1, 2);

  return (
    <div className={cn("pointer-events-none absolute z-20", className)}>
      <AnimatePresence>
        {current && (
          <motion.section
            key="alerts"
            aria-label={t("Site alerts")}
            initial={{ opacity: 0, y: reduce ? 0 : -20, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -20, scale: reduce ? 1 : 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, delay: reduce ? 0 : 0.6 }}
            className={cn("pointer-events-auto relative", cardClassName)}
          >
            {/* Stacked cards behind hint that more alerts are waiting */}
            {Array.from({ length: behind }).map((_, k) => (
              <div
                key={k}
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-full rounded-2xl bg-white/55 ring-1 ring-white/40 backdrop-blur-md"
                style={{ transform: `translateY(${(k + 1) * 7}px) scale(${1 - (k + 1) * 0.04})`, zIndex: -1 - k }}
              />
            ))}

            <div className="relative overflow-hidden rounded-2xl bg-white/[0.94] text-gray-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/5 backdrop-blur-xl">
              {/* Top accent in the alert's colour */}
              <div aria-hidden="true" className={cn("h-1 bg-gradient-to-r", s.bar)} />

              <div className={cn("flex gap-2.5 px-2.5 py-2 sm:gap-3 sm:px-3.5 lg:items-center lg:gap-4 lg:px-4 lg:py-2.5", more ? "items-start" : "items-center")}>
                <span className={cn("relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg lg:h-9 lg:w-9 lg:rounded-xl bg-gradient-to-br text-white", s.badge, s.glow)}>
                  {current.type === "critical" && !reduce && (
                    <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-xl bg-[#E53935]/40 [animation-duration:2s] [animation-iteration-count:3]" />
                  )}
                  <Icon className="relative h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, x: reduce ? 0 : 16 * dir }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: reduce ? 0 : -16 * dir }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className={cn("flex min-w-0 items-center gap-x-2 gap-y-0.5 pr-1 lg:flex-wrap", more && "flex-wrap")}>
                        <span className={cn("shrink-0 text-[11px] font-black uppercase tracking-[0.14em]", s.text)}>{t(s.label)}</span>
                        <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                        <span className={cn("min-w-0 text-sm font-bold text-[#0A2E10]", !more && "truncate lg:overflow-visible lg:whitespace-normal")}>{t(current.title)}</span>
                      </p>
                      <p id="alert-details" className={cn("mt-1 text-sm leading-snug text-gray-700 lg:mt-0.5 lg:block", !more && "hidden")}>
                        {t(current.message)}
                        {current.link && (
                          <Link to={current.link.to} className={cn("group ml-1.5 inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline", s.text, focus)}>
                            {t(current.link.label)}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </Link>
                        )}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => setMore((m) => !m)}
                  aria-expanded={more}
                  aria-controls="alert-details"
                  aria-label={more ? t("Hide alert details") : t("Show alert details")}
                  title={more ? t("Hide alert details") : t("Show alert details")}
                  className={cn("flex h-9 shrink-0 items-center gap-1 rounded-full bg-gray-100 pl-2.5 pr-1.5 text-xs font-bold tabular-nums text-gray-700 transition hover:bg-gray-200 lg:hidden", focus)}
                >
                  {open.length > 1 && !more && <span aria-hidden="true">{idx + 1}/{open.length}</span>}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", more && "rotate-180")} aria-hidden="true" />
                </button>
                {open.length > 1 && (
                  <div className="hidden shrink-0 items-center gap-3 lg:flex">
                    {pager}
                    <button type="button" onClick={dismissAll} data-i18n-done className={cn("whitespace-nowrap rounded text-xs font-semibold text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline", focus)}>
                      {t("Dismiss all {n} alerts", { n: open.length })}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label={t("Close this alert")}
                  title={t("Close this alert")}
                  className={cn("-mr-1 flex h-9 w-9 shrink-0 items-center lg:h-10 lg:w-10 justify-center rounded-full text-gray-500 transition hover:rotate-90 hover:bg-gray-100 hover:text-gray-900", focus)}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {open.length > 1 ? (
                <div className={cn("flex items-center justify-between gap-3 border-t border-gray-100 px-3.5 py-1.5 sm:px-4 lg:hidden", !more && "hidden")}>
                  {pager}
                  <button type="button" onClick={dismissAll} data-i18n-done className={cn("rounded text-xs font-semibold text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline", focus)}>
                    {t("Dismiss all {n} alerts", { n: open.length })}
                  </button>
                </div>
              ) : (
                <p className={cn("flex items-center gap-1.5 border-t border-gray-100 px-4 py-2 text-xs text-gray-500 lg:hidden", !more && "hidden")}>
                  <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("Closed alerts stay in the bell at the top of the page.")}
                </p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
