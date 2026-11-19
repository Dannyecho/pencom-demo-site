import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n/context";

/**
 * Minimal section title: a full-width hairline that draws across, a small label on the left and a
 * section counter on the right, then a large regular-weight title with its key phrase in bold green.
 */
export default function Title({ id, label, index, total, title, mark }: { id: string; label: string; index: number; total: number; title: string; mark?: string }) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const T = t(title);
  const M = mark ? t(mark) : undefined;
  const hl = M && T.includes(M) ? M : undefined;
  const [before, after] = hl ? T.split(hl) : [T, ""];
  const view = { once: true, margin: "-60px" } as const;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <header>
      <motion.div
        aria-hidden="true"
        className="h-px origin-left bg-[#111A13]/20"
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={view}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
      <div className="mt-4 flex items-center justify-between text-sm text-[#111A13]/[0.62]">
        <span>{label}</span>
        <span className="font-mono tabular-nums" aria-hidden="true">
          {pad(index)} / {pad(total)}
        </span>
      </div>
      <motion.h2
        id={id}
        data-i18n-done={lang !== "en" && T !== title ? "" : undefined}
        initial={{ opacity: 0, y: reduce ? 0 : 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-4xl text-[2.1rem] font-normal leading-[1.1] tracking-tight text-[#111A13] sm:text-5xl lg:text-[3.5rem]"
      >
        {before}
        {hl && <strong className="font-bold text-[#117F21]">{hl}</strong>}
        {after}
      </motion.h2>
    </header>
  );
}
