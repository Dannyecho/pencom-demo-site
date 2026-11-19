"""Light-grey slider overlay + new section-title design. Usage: python3 apply.py <app/src>"""
import pathlib, sys

src = pathlib.Path(sys.argv[1])


def edit(rel, pairs):
    p = src / rel
    s = p.read_text()
    for old, new in pairs:
        assert s.count(old) == 1, f"{rel}: {s.count(old)} matches for {old[:70]!r}"
        s = s.replace(old, new)
    p.write_text(s)
    print("ok", rel)


# ── 1. Slider: light grey shading, dark text ──
edit("pages/home/HomeHero.tsx", [
    ('className="relative isolate overflow-hidden bg-[#04240A] text-white"', 'className="relative isolate overflow-hidden bg-[#EEF0EE] text-[#0A2E10]"'),
    ('h-40 bg-gradient-to-b from-black/45 to-transparent', 'h-40 bg-gradient-to-b from-[#F1F2F0]/70 to-transparent'),
    ('bg-gradient-to-t from-[#021a07]/90 via-[#021a07]/25 to-transparent lg:hidden', 'bg-gradient-to-t from-[#F1F2F0]/95 via-[#F1F2F0]/60 to-[#F1F2F0]/10 lg:hidden'),
    ('bg-gradient-to-r from-[#021a07]/85 via-[#021a07]/35 to-transparent lg:block lg:w-[68%]', 'bg-gradient-to-r from-[#F1F2F0]/[0.93] via-[#F1F2F0]/60 to-transparent lg:block lg:w-[68%]'),
    ('h-48 bg-gradient-to-t from-black/50 to-transparent lg:block', 'h-48 bg-gradient-to-t from-[#F1F2F0]/80 to-transparent lg:block'),
    ('"border border-white/25 bg-black/30 text-[#F4D27A]"', '"border border-[#117F21]/20 bg-white/85 text-[#117F21]"'),
    ('[text-shadow:0_2px_24px_rgba(0,0,0,0.45)]', 'text-[#0A2E10] [text-shadow:0_1px_20px_rgba(255,255,255,0.7)]'),
    ('text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]', 'font-medium text-gray-800'),
    ('"flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-md transition hover:bg-white/25',
     '"flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white/85 text-[#0A2E10] shadow-sm backdrop-blur-md transition hover:border-[#117F21] hover:bg-white hover:text-[#117F21]'),
    ('font-mono text-sm text-white/75 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]', 'font-mono text-sm text-gray-600'),
    ('<span className="text-lg font-bold text-white">{pad(index + 1)}</span>', '<span className="text-lg font-bold text-[#0A2E10]">{pad(index + 1)}</span>'),
    ('on ? "h-14 w-24 ring-[#F4D27A] sm:h-16 sm:w-28" : "h-10 w-14 opacity-75 ring-white/30 hover:opacity-100 sm:h-12 sm:w-20"',
     'on ? "h-14 w-24 ring-[#CB9615] shadow-lg sm:h-16 sm:w-28" : "h-10 w-14 opacity-80 ring-white hover:opacity-100 sm:h-12 sm:w-20"'),
])

# ── 2. Section titles ──
p = src / "pages/about/primitives.tsx"
s = p.read_text()
a = s.index("/* ─────────────────────────── Eyebrow + heading ─────────────────────────── */")
b = s.index("export function", s.index("export function SectionHeading") + 10)
new = '''/* ─────────────────────────── Eyebrow + heading ─────────────────────────── */

/**
 * Section title used across the site: a pill eyebrow with a glowing dot and a one-time shine,
 * the heading with its key words in a brand gradient and a hand-drawn underline that draws
 * itself in, and an accent bar when there is no highlight. Motion runs once and is skipped
 * for readers who prefer reduced motion.
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  intro,
  center = false,
  dark = false,
  id,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: ReactNode;
  center?: boolean;
  dark?: boolean;
  id?: string;
}) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const gid = useId().replace(/:/g, "");
  // Translate the whole heading, then find the translated highlight inside it.
  const T = t(title);
  const H = highlight ? t(highlight) : undefined;
  const hl = H && T.includes(H) ? H : undefined;
  const [before, after] = hl ? T.split(hl) : [T, ""];
  const done = lang !== "en" && T !== title ? "" : undefined;
  const view = { once: true, margin: "-60px" } as const;

  return (
    <motion.div {...reveal} className={cn("relative max-w-3xl", center && "mx-auto text-center")}>
      {/* Eyebrow pill */}
      <span
        className={cn(
          "relative inline-flex items-center gap-2.5 overflow-hidden rounded-full py-1 pl-1 pr-4 text-[11px] font-bold uppercase tracking-[0.18em] ring-1 backdrop-blur",
          dark ? "bg-white/[0.08] text-[#F4D27A] ring-white/15" : "bg-[#E8F5E9]/80 text-[#0A4A13] ring-[#117F21]/15",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative flex h-6 w-6 items-center justify-center rounded-full",
            dark ? "bg-gradient-to-br from-[#F4D27A] to-[#CB9615]" : "bg-gradient-to-br from-[#2E913D] to-[#0A4A13]",
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", dark ? "bg-[#04240A]" : "bg-[#F4D27A]")} />
          {!reduce && (
            <motion.span
              className={cn("absolute inset-0 rounded-full", dark ? "bg-[#F4D27A]" : "bg-[#2E913D]")}
              initial={{ scale: 1, opacity: 0.5 }}
              whileInView={{ scale: 1.9, opacity: 0 }}
              viewport={view}
              transition={{ duration: 1.4, repeat: 2, ease: "easeOut" }}
            />
          )}
        </span>
        <span className="relative">{eyebrow}</span>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-y-0 w-10 -skew-x-12", dark ? "bg-white/20" : "bg-white/70")}
            initial={{ left: "-20%" }}
            whileInView={{ left: "120%" }}
            viewport={view}
            transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
          />
        )}
      </span>

      <h2
        id={id}
        data-i18n-done={done}
        className={cn(
          "mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-white" : "text-[#0A2E10]",
        )}
      >
        {before}
        {hl && (
          <span className="relative inline-block">
            <span
              className={cn(
                "relative z-10 bg-clip-text text-transparent",
                dark
                  ? "bg-gradient-to-r from-[#F4D27A] via-[#E9B949] to-[#CB9615]"
                  : "bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]",
              )}
            >
              {hl}
            </span>
            {/* Hand-drawn underline */}
            <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-2.5 left-0 h-3.5 w-full overflow-visible">
              <defs>
                <linearGradient id={`ul-${gid}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={dark ? "#F4D27A" : "#2E913D"} />
                  <stop offset="100%" stopColor="#CB9615" />
                </linearGradient>
              </defs>
              <motion.path
                d="M3 10 C 45 3, 95 2, 140 5 S 190 9, 197 6"
                fill="none"
                stroke={`url(#ul-${gid})`}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.9 : 0 }}
                whileInView={{ pathLength: 1, opacity: 0.9 }}
                viewport={view}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          </span>
        )}
        {after}
      </h2>

      {!hl && (
        <motion.span
          aria-hidden="true"
          className={cn(
            "mt-5 block h-1.5 w-16 rounded-full bg-gradient-to-r",
            dark ? "from-[#F4D27A] to-[#CB9615]" : "from-[#117F21] to-[#CB9615]",
            center ? "mx-auto origin-center" : "origin-left",
          )}
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        />
      )}

      {intro && (
        <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-gray-600")}>
          {intro}
        </p>
      )}
    </motion.div>
  );
}

'''
s = s[:a] + new + s[b:]
# imports
first = s.split("\n", 1)[0]
assert first.startswith("import {") and "from \"react\"" in first, first
if "useId" not in first:
    s = s.replace(first, first.replace("useEffect,", "useEffect, useId,"), 1)
p.write_text(s)
print("ok primitives.tsx")
