import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const pageSections = [
  { id: "overview", label: "Overview" },
  { id: "mission", label: "Mission & values" },
  { id: "history", label: "Our history" },
  { id: "structure", label: "Structure" },
  { id: "executive", label: "Leadership" },
  { id: "charter", label: "Service Charter" },
];

/** Sticky "On this page" bar with scroll-spy, a sliding active pill and a reading-progress line. */
export default function SectionNav({
  sections = pageSections,
  pillId = "about-nav-pill",
}: {
  sections?: { id: string; label: string }[];
  pillId?: string;
}) {
  const [active, setActive] = useState(sections[0].id);
  const { search } = useLocation(); // keep query-string state (e.g. library filters) when jumping
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Keep the active pill in view on narrow screens (horizontal scroll only).
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !item) return;
    const target = item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2;
    list.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[92px] z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 md:block">
          On this page
        </span>
        <ul
          ref={listRef}
          className="flex flex-1 gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} data-id={s.id} className="shrink-0">
                <Link
                  to={{ search, hash: s.id }}
                  replace
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative isolate inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
                    isActive ? "text-white" : "text-gray-600 hover:text-[#117F21]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={pillId}
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#0A4A13] to-[#117F21] shadow-[0_6px_20px_-8px_rgba(17,127,33,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]"
      />
    </nav>
  );
}
