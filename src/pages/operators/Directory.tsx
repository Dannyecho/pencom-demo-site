import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, BarChart3, ExternalLink, Globe, LayoutGrid, List, Mail, MapPin, Phone, Search, UserRound, X,
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SectionHeading, Spotlight, ease } from "@/pages/about/primitives";
import { operators, relatedBodies, typeInfo, type Operator, type OperatorType } from "./data";

const tel = (p: string) => `tel:${p.split(/[,(]/)[0].replace(/-\d+$/, "").replace(/[^\d+]/g, "")}`;
const mapUrl = (o: Operator) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.name}, ${o.address}`)}`;
const initials = (n: string) =>
  n
    .replace(/\(.*?\)|limited|ltd\.?|nig\.?|pfa|pension(s)?|fund|managers|administrators?|custodian|closed/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
const hue = (id: string) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 4;
const tones = ["from-[#0A4A13] to-[#117F21]", "from-[#04240A] to-[#2E913D]", "from-[#9A6F06] to-[#CB9615]", "from-[#1F2E20] to-[#0A4A13]"];

function Monogram({ o, size = "md" }: { o: Operator; size?: "md" | "lg" }) {
  return (
    <span aria-hidden="true" className={cn("flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-black text-white shadow-inner", tones[hue(o.id)], size === "lg" ? "h-16 w-16 text-xl" : "h-12 w-12 text-sm")}>
      {initials(o.name) || o.name[0]}
    </span>
  );
}

function ContactActions({ o, compact = false }: { o: Operator; compact?: boolean }) {
  const items = [
    o.phones[0] && { href: tel(o.phones[0]), icon: Phone, label: `Call ${o.name}`, text: "Call" },
    o.emails[0] && { href: `mailto:${o.emails[0]}`, icon: Mail, label: `Email ${o.name}`, text: "Email" },
    { href: `https://${o.website}`, icon: Globe, label: `${o.name} website (opens in a new tab)`, text: "Website", ext: true },
    { href: mapUrl(o), icon: MapPin, label: `${o.name} on a map (opens in a new tab)`, text: "Map", ext: true },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string; text: string; ext?: boolean }[];
  return (
    <div className={cn("relative z-10 flex flex-wrap gap-2", compact && "gap-1.5")}>
      {items.map((it) => (
        <a
          key={it.text}
          href={it.href}
          aria-label={it.label}
          {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 font-semibold text-gray-700 transition hover:border-[#117F21] hover:bg-[#E8F5E9] hover:text-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
            compact ? "h-10 w-10 justify-center" : "min-h-10 px-3 text-sm",
          )}
        >
          <it.icon className="h-4 w-4" aria-hidden="true" />
          {!compact && it.text}
        </a>
      ))}
    </div>
  );
}

/* ─────────────────────────── Detail drawer (operator details template) ─────────────────────────── */

export function OperatorDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const o = operators.find((x) => x.id === id);
  return (
    <Sheet open={!!o} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg [&>button:last-child]:right-4 [&>button:last-child]:top-4 [&>button:last-child]:flex [&>button:last-child]:h-10 [&>button:last-child]:w-10 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-white/15 [&>button:last-child]:text-white [&>button:last-child]:opacity-100">
        {o && (
          <motion.div key={o.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease }}>
            <div className="relative overflow-hidden bg-[#04240A] px-6 pb-7 pt-8 text-white sm:px-8">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#117F21]/50 blur-3xl" />
              <div className="relative flex items-center gap-4 pr-10">
                <Monogram o={o} size="lg" />
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#117F21] px-2.5 py-0.5 text-xs font-bold">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Licensed
                  </span>
                  <p className="mt-1 text-xs text-white/60">{typeInfo[o.type].label}</p>
                </div>
              </div>
              <SheetTitle className="relative mt-5 text-2xl font-bold leading-snug text-white">{o.name}</SheetTitle>
              <SheetDescription className="relative mt-2 text-sm text-white/70">{typeInfo[o.type].role}</SheetDescription>
            </div>
            <div className="space-y-6 px-6 py-7 sm:px-8">
              <dl className="space-y-4 text-sm">
                {[
                  { icon: UserRound, k: "Managing director", v: o.md },
                  { icon: MapPin, k: "Head office", v: o.address },
                  { icon: Phone, k: "Phone", v: o.phones.length ? o.phones.join(" · ") : "Not published" },
                  { icon: Mail, k: "Email", v: o.emails.join(" · ") },
                  { icon: Globe, k: "Website", v: o.website },
                ].map((r) => (
                  <div key={r.k} className="flex gap-3">
                    <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{r.k}</dt>
                      <dd className="mt-0.5 font-medium text-[#0A2E10]">{r.v}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <ContactActions o={o} />
              {o.type === "PFA" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link to="/performance" onClick={onClose} className="group flex items-center gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-[#117F21]/40 hover:bg-[#F7FAF6]">
                    <BarChart3 className="h-5 w-5 text-[#117F21]" aria-hidden="true" />
                    <span className="flex-1 text-sm font-semibold text-[#0A2E10]">Compare performance</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link to="/resources?guide=transfer-rsa" onClick={onClose} className="group flex items-center gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-[#117F21]/40 hover:bg-[#F7FAF6]">
                    <ArrowRight className="h-5 w-5 text-[#117F21]" aria-hidden="true" />
                    <span className="flex-1 text-sm font-semibold text-[#0A2E10]">How to transfer to this PFA</span>
                  </Link>
                </div>
              )}
              <p className="rounded-xl bg-[#F7FAF6] p-3 text-xs text-gray-600">Details as published on PenCom’s register. Branch offices and licence dates will be added from the licensing department’s records.</p>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────── Directory ─────────────────────────── */

type Tab = OperatorType | "Related";

export default function Directory({ onOpen, tabHint }: { onOpen: (id: string) => void; tabHint?: Tab | null }) {
  const [tab, setTab] = useState<Tab>(tabHint ?? "PFA");
  useEffect(() => {
    if (tabHint) setTab(tabHint);
  }, [tabHint]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState<"All" | "Lagos" | "Abuja">("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const reduce = useReducedMotion();

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return operators
      .filter((o) => o.type === tab && (city === "All" || o.city === city) && (!t || `${o.name} ${o.md} ${o.address}`.toLowerCase().includes(t)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tab, q, city]);

  const tabs: { id: Tab; label: string; n: number }[] = [
    ...(["PFA", "PFC", "CPFA"] as const).map((t) => ({ id: t, label: typeInfo[t].plural, n: operators.filter((o) => o.type === t).length })),
    { id: "Related", label: "Related bodies", n: relatedBodies.length },
  ];

  return (
    <section id="directory" aria-labelledby="dir-title" className="scroll-mt-40 bg-[#F7FAF6] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="dir-title" eyebrow="Operator directory" title="Find a licensed operator" highlight="licensed operator" intro="Search by name, filter by city and contact any operator in one tap. Open a card for full details." />

        <LayoutGroup id="op-tabs">
          <div role="tablist" aria-label="Operator types" className="mt-10 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-gray-200">
            {tabs.map((t) => (
              <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn("relative isolate flex min-h-12 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]", tab === t.id ? "text-white" : "text-gray-600 hover:text-[#117F21]")}>
                {tab === t.id && <motion.span layoutId="op-tab-pill" className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[#0A4A13] to-[#117F21]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                {t.label}
                <span className={cn("rounded-full px-2 py-0.5 font-mono text-xs", tab === t.id ? "bg-white/20" : "bg-gray-100")}>{t.n}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        {tab !== "Related" && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#117F21]/40">
              <Search className="h-5 w-5 text-[#117F21]" aria-hidden="true" />
              <span className="sr-only">Search {typeInfo[tab].plural}</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${typeInfo[tab].short} by name, MD or address`} className="min-h-12 w-full bg-transparent focus:outline-none" />
              {q && (
                <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <div role="group" aria-label="City" className="flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-200">
                {(["All", "Lagos", "Abuja"] as const).map((c) => (
                  <button key={c} type="button" aria-pressed={city === c} onClick={() => setCity(c)} className={cn("min-h-10 rounded-xl px-3.5 text-sm font-semibold transition", city === c ? "bg-[#04240A] text-[#F4D27A]" : "text-gray-600 hover:text-[#117F21]")}>
                    {c === "All" ? "All cities" : c}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Layout" className="hidden rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-200 sm:flex">
                {([{ v: "grid", I: LayoutGrid, l: "Cards" }, { v: "list", I: List, l: "List" }] as const).map(({ v, I, l }) => (
                  <button key={v} type="button" aria-pressed={view === v} aria-label={l} onClick={() => setView(v)} className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition", view === v ? "bg-[#E8F5E9] text-[#117F21]" : "text-gray-500 hover:text-[#117F21]")}>
                    <I className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div role="tabpanel" aria-label={tabs.find((t) => t.id === tab)?.label} className="mt-6">
          {tab !== "Related" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-gray-600" aria-live="polite">
                  <strong className="text-[#0A2E10]">{list.length}</strong> {list.length === 1 ? typeInfo[tab].label : typeInfo[tab].plural}
                  {city !== "All" && ` with head offices in ${city}`}
                </p>
                <p className="max-w-xl text-sm text-gray-500">{typeInfo[tab].role}</p>
              </div>

              {list.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
                  <p className="font-semibold text-[#0A2E10]">No licensed {typeInfo[tab].short} match “{q}”.</p>
                  <p className="mt-1 text-sm text-gray-600">If a company says it manages pensions but isn’t listed, <Link to="/connect#report" className="font-semibold text-[#117F21] underline">report it to PenCom</Link>.</p>
                </div>
              ) : view === "grid" ? (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {list.map((o, i) => (
                      <motion.li key={o.id} layout={!reduce} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, delay: Math.min(i, 9) * 0.03, ease }}>
                        <Spotlight color="rgba(17,127,33,0.10)" className="group h-full rounded-3xl border border-gray-200 bg-white transition duration-300 has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-[#FFD84D] hover:-translate-y-1 hover:border-[#117F21]/30 hover:shadow-[0_24px_50px_-26px_rgba(10,74,19,0.45)]">
                          <div className="flex h-full flex-col p-6">
                            <div className="flex items-start gap-4">
                              <Monogram o={o} />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold leading-snug text-[#0A2E10]">
                                  <button type="button" onClick={() => onOpen(o.id)} className="text-left after:absolute after:inset-0 after:content-[''] hover:text-[#117F21] focus-visible:outline-none">
                                    {o.name}
                                  </button>
                                </h3>
                                <p className="mt-1 flex items-center gap-2 text-xs">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2 py-0.5 font-semibold text-[#0A4A13]"><BadgeCheck className="h-3 w-3" aria-hidden="true" /> Licensed</span>
                                  <span className="inline-flex items-center gap-1 text-gray-500"><MapPin className="h-3 w-3" aria-hidden="true" /> {o.city}</span>
                                </p>
                              </div>
                            </div>
                            <p className="mt-4 line-clamp-2 text-sm text-gray-600">{o.address}</p>
                            <p className="mt-2 text-xs text-gray-500">MD: {o.md}</p>
                            <div className="mt-auto flex items-center justify-between pt-5">
                              <ContactActions o={o} compact />
                              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#117F21]">Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                            </div>
                          </div>
                        </Spotlight>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">{typeInfo[tab].plural}</caption>
                    <thead className="bg-[#04240A] text-xs uppercase tracking-wider text-white/80">
                      <tr>
                        <th scope="col" className="px-5 py-3">Name</th>
                        <th scope="col" className="hidden px-5 py-3 md:table-cell">Managing director</th>
                        <th scope="col" className="hidden px-5 py-3 lg:table-cell">Head office</th>
                        <th scope="col" className="px-5 py-3">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {list.map((o) => (
                        <tr key={o.id} className="transition hover:bg-[#F7FAF6]">
                          <th scope="row" className="px-5 py-4 font-semibold text-[#0A2E10]">
                            <button type="button" onClick={() => onOpen(o.id)} className="text-left hover:text-[#117F21] hover:underline">{o.name}</button>
                          </th>
                          <td className="hidden px-5 py-4 text-gray-600 md:table-cell">{o.md}</td>
                          <td className="hidden px-5 py-4 text-gray-600 lg:table-cell">{o.address}</td>
                          <td className="px-5 py-4"><ContactActions o={o} compact /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === "Related" && (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {relatedBodies.map((r, i) => (
                <motion.li key={r.short} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08, ease }}>
                  <Spotlight color="rgba(203,150,21,0.14)" className="h-full rounded-3xl border border-gray-200 bg-white p-7">
                    <span className="inline-flex rounded-2xl bg-[#04240A] px-4 py-2 text-xl font-black text-[#F4D27A]">{r.short}</span>
                    <h3 className="mt-4 text-xl font-bold text-[#0A2E10]">{r.name}</h3>
                    <p className="mt-2 leading-relaxed text-gray-600">{r.body}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Contact details to be added</p>
                  </Spotlight>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
