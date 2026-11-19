import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Clock, Download, HeartHandshake, MessageSquareWarning, Phone, Printer, Search, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, SectionHeading, Spotlight, Tilt, ease, reveal } from "./about/primitives";
import { DocHero, DocTools, GhostBtn, Loading, Mark, PdfCard, PrimaryBtn, ReadingBar, Toc, VerifyNote, ring, sizes, useDocJson, useTitle } from "./docs/kit";

/**
 * Service Charter / Service Level Agreement as a web page with the signed PDF attached (DES-22; brief §6.2 About:
 * "Service Charter (HTML + signed PDF)"). Text extracted from the revised charter, May 2026.
 */

type Block = { m?: string; x: string; sub?: boolean };
type Std = { division: string; dept: string; sn: number; service: string; time: string; req: string };
type Charter = { foreword: string; forewordList: string[]; sections: { n: number; title: string; blocks: Block[] }[]; standards: Std[] };

const PDF = "/documents/service-charter-2026.pdf";
const VALUES_ICON = ["◆", "◇", "◈", "◉", "◎", "❖"];

/** Split a requirements cell into list items where the charter numbers them. */
export function splitReq(req: string) {
  const parts = req
    .split(/\s+•\s+|\s(?=(?:\d{1,2}\)|[a-h]\)|[ivx]{1,4}\.|\d{1,2}\.)\s+[A-Z(])/)
    .map((s) => s.trim().replace(/^(?:\d{1,2}\)|[a-h]\)|[ivx]{1,4}\.|\d{1,2}\.)\s+/, ""))
    .filter((s) => s.length > 1);
  return parts.length ? parts : [req];
}
const days = (t: string) => {
  const m = t.match(/(\d+)\s*(?:to\s*(\d+))?\s*(working days|days|hours)/i);
  if (!m) return null;
  const v = Number(m[2] ?? m[1]);
  return /hour/i.test(m[3]) ? v / 8 : v;
};

function printChecklist(s: Std) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  const items = splitReq(s.req).map((r) => `<li><span class="box"></span>${r.replace(/</g, "&lt;")}</li>`).join("");
  w.document.write(`<!doctype html><title>${s.service} – checklist</title><style>body{font:16px/1.6 Arial;margin:40px;color:#111}h1{font:bold 22px Verdana;color:#0A4A13;margin:0 0 4px}p{margin:0 0 16px;color:#444}ul{list-style:none;padding:0}li{display:flex;gap:12px;margin:0 0 12px}.box{flex:none;width:18px;height:18px;border:2px solid #117F21;border-radius:4px;margin-top:3px}footer{margin-top:32px;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:8px}</style><h1>${s.service}</h1><p>${s.dept} · Service standard: ${s.time || "see charter"}</p><ul>${items}</ul><footer>National Pension Commission · Service Charter (revised May 2026) · pencom.gov.ng</footer>`);
  w.document.close();
  w.focus();
  w.print();
}

function StandardCard({ s, q, open, onToggle, i }: { s: Std; q: string; open: boolean; onToggle: () => void; i: number }) {
  const d = days(s.time);
  const reqs = splitReq(s.req);
  return (
    <motion.li layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.03, ease }} className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
      <button type="button" onClick={onToggle} aria-expanded={open} className={cn("group flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#F7FAF6] sm:p-6", ring)}>
        <span className="relative flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#04240A] text-white">
          <Clock className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
          <span className="mt-0.5 text-[11px] font-bold leading-none">{d !== null ? (d < 1 ? `${Math.round(d * 8)}h` : `${d}d`) : "—"}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#117F21]">{s.dept}</span>
          <span className="mt-1 block font-bold leading-snug text-[#0A2E10]"><Mark text={s.service} q={q} /></span>
          {s.time && <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E1] px-2.5 py-1 text-xs font-semibold text-[#7A5600]"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{s.time}</span>}
        </span>
        <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform", open && "rotate-180 text-[#117F21]")} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <div className="border-t border-gray-100 bg-[#FBFCFA] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">What you need</p>
              <ul className="mt-3 space-y-2.5">
                {reqs.map((r, k) => (
                  <li key={k} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#117F21]/40 text-[#117F21]"><Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /></span>
                    <span><Mark text={r} q={q} /></span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => printChecklist(s)} className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white hover:bg-[#0A4A13]", ring)}><Printer className="h-4 w-4" aria-hidden="true" /> Print this checklist</button>
                <Link to="/connect#contact" className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:border-[#117F21]", ring)}>Ask about this service</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function ServiceCharter() {
  useTitle("Service Charter");
  const reduce = useReducedMotion();
  const { status, data } = useDocJson<Charter>("/documents/text/service-charter-2026.json");
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [size, setSize] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const depts = useMemo(() => (data ? ["All", ...Array.from(new Set(data.standards.map((s) => s.dept)))] : ["All"]), [data]);
  const list = useMemo(() => {
    if (!data) return [];
    const t = dq.trim().toLowerCase();
    return data.standards.map((s, i) => ({ s, i })).filter(({ s }) => (dept === "All" || s.dept === dept) && (!t || `${s.service} ${s.req} ${s.dept}`.toLowerCase().includes(t)));
  }, [data, dq, dept]);
  const visible = showAll || dq || dept !== "All" ? list : list.slice(0, 8);

  const values = data?.sections.find((s) => s.n === 4)?.blocks.filter((b) => b.sub) ?? [];
  const mission = data?.sections.find((s) => s.n === 3)?.blocks[0]?.x;
  const narrative = data?.sections.filter((s) => ![3, 4].includes(s.n)) ?? [];
  const toc = [{ id: "standards", label: "Service standards" }, { id: "complaints", label: "Complaints and disputes" }, ...narrative.map((s) => ({ id: `c-${s.n}`, label: `${s.n}. ${s.title}` }))];

  return (
    <MotionConfig reducedMotion="user">
      <ReadingBar />
      <DocHero
        crumbs={[{ label: "Home", to: "/" }, { label: "About", to: "/about" }, { label: "Service Charter" }]}
        kind="Service Charter · Service Level Agreement"
        icon={<HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />}
        title="Our Service Charter"
        badge={<span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">Revised May 2026</span>}
        lead="What you can expect from the Commission: how quickly we deliver each service, the documents you need, how to complain and what we expect from you."
        meta={[
          { label: "Version", value: "Revised, May 2026" },
          { label: "Services covered", value: data ? data.standards.length : "49" },
          { label: "Departments", value: data ? depts.length - 1 : "8" },
          { label: "Signed by", value: "Director-General" },
        ]}
        actions={<>
          <PrimaryBtn href={PDF} external><Download className="h-4 w-4" aria-hidden="true" /> Signed PDF</PrimaryBtn>
          <GhostBtn href="#/connect#contact"><MessageSquareWarning className="h-4 w-4" aria-hidden="true" /> Make a complaint</GhostBtn>
        </>}
      />

      {status === "loading" && <Loading />}
      {status === "error" && <p className="mx-auto max-w-3xl p-10 text-center">The web version could not be loaded. <a href={PDF} className="font-semibold text-[#117F21] underline">Open the signed PDF</a>.</p>}

      {data && (
        <>
          {/* Promise band */}
          <section aria-labelledby="promise-title" className="relative overflow-hidden bg-white py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-12">
              <motion.div {...reveal} className="lg:col-span-5">
                <SectionHeading id="promise-title" eyebrow="Our promise" title="Service you can measure" highlight="measure" />
                {mission && <p className="mt-6 font-serif text-xl leading-relaxed text-gray-700">“{mission}”</p>}
                <p className="mt-3 text-sm text-gray-500">The Commission’s mission, from the Charter</p>
                <dl className="mt-8 grid grid-cols-3 gap-3">
                  {[["2", "working days for most benefit approvals"], ["3–5", "working days to resolve a complaint"], ["72", "hours to issue a PCC"]].map(([v, l]) => (
                    <div key={l} className="rounded-2xl bg-[#F4FAF3] p-4">
                      <dt className="sr-only">{l}</dt>
                      <dd><CountUp value={v} className="block font-display text-3xl font-bold text-[#117F21]" /><span className="mt-1 block text-xs leading-snug text-gray-600">{l}</span></dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
                {values.map((v, i) => {
                  const [k, ...rest] = v.x.split(":");
                  return (
                    <motion.li key={k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, ease }}>
                      <Tilt className="h-full">
                        <Spotlight color="rgba(203,150,21,0.16)" className="group h-full rounded-3xl border border-gray-200 bg-white p-5 transition hover:border-[#CB9615]/50">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#04240A] text-lg text-[#F4D27A] transition group-hover:rotate-12" aria-hidden="true">{VALUES_ICON[i]}</span>
                          <p className="mt-3 text-lg font-bold text-[#0A2E10]">{k}</p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-600">{rest.join(":").trim()}</p>
                        </Spotlight>
                      </Tilt>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </section>

          <div className="bg-[#F7FAF6]">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="hidden lg:block print:hidden"><div className="sticky top-[150px]"><Toc items={toc} /></div></aside>
              <div className="min-w-0 space-y-16">
                {/* Standards finder */}
                <section id="standards" aria-labelledby="std-title" className="scroll-mt-40">
                  <SectionHeading id="std-title" eyebrow="Measurable service standards" title="How long each service takes" highlight="each service" intro="Find a service to see its timeline and the documents you need. Print the list and take it with you." />
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                      <span className="sr-only">Find a service</span>
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “death benefits”, “25%”, “mortgage”, “PCC”" className="min-h-12 w-full rounded-2xl border border-gray-300 bg-white pl-12 pr-12 focus:border-[#117F21] focus:outline-none focus:ring-4 focus:ring-[#117F21]/15" />
                      {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-100", ring)}><X className="h-4 w-4" aria-hidden="true" /></button>}
                    </label>
                    <label className="sm:w-72">
                      <span className="sr-only">Department</span>
                      <select value={dept} onChange={(e) => setDept(e.target.value)} className="min-h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 font-semibold focus:border-[#117F21] focus:outline-none focus:ring-4 focus:ring-[#117F21]/15">
                        {depts.map((d) => <option key={d} value={d}>{d === "All" ? "All departments" : d}</option>)}
                      </select>
                    </label>
                  </div>
                  <p className="mt-3 text-sm text-gray-600" aria-live="polite">{list.length} service{list.length === 1 ? "" : "s"}</p>
                  <ul className="mt-4 space-y-3">
                    <AnimatePresence initial={false}>
                      {visible.map(({ s, i }, k) => <StandardCard key={i} s={s} q={dq} i={k} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
                    </AnimatePresence>
                  </ul>
                  {!showAll && !dq && dept === "All" && list.length > 8 && (
                    <button type="button" onClick={() => setShowAll(true)} className={cn("mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 font-semibold text-gray-700 hover:border-[#117F21]", ring)}>
                      Show all {list.length} services <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </section>

                {/* Complaints flow */}
                <section id="complaints" aria-labelledby="cmp-title" className="scroll-mt-40">
                  <SectionHeading id="cmp-title" eyebrow="If something goes wrong" title="Complaints and disputes" highlight="disputes" />
                  <ol className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                    {[
                      ["Day 1", "We acknowledge your complaint", "By email, phone, letter, walk-in or social media."],
                      ["Days 2–3", "We resolve it and reply", "Most complaints are closed within 3 to 5 working days."],
                      ["Fair hearing", "We hear both sides", "We get the response of the party you complained about before we decide."],
                      ["Still unhappy?", "Take it further", "You can refer the Commission’s decision to arbitration or the National Industrial Court."],
                    ].map(([k, t, b], i) => (
                      <motion.li key={k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ease }} className="relative rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#117F21] to-[#CB9615] font-bold text-white">{i + 1}</span>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9A6F06]">{k}</p>
                        <p className="mt-1 font-bold text-[#0A2E10]">{t}</p>
                        <p className="mt-1 text-sm text-gray-600">{b}</p>
                        {i < 3 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-[#F7FAF6] text-[#117F21] md:block" aria-hidden="true" />}
                      </motion.li>
                    ))}
                  </ol>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a href="tel:+2342094603955" className={cn("flex items-center gap-4 rounded-3xl bg-[#04240A] p-5 text-white", ring)}><Phone className="h-6 w-6 text-[#F4D27A]" aria-hidden="true" /><span><span className="block text-sm text-white/60">0700 CALL PENCOM</span><span className="block text-lg font-bold">02094603955</span></span></a>
                    <Link to="/connect#contact" className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-[#CB9615] p-5 font-semibold text-[#1A1206]", ring)}><span className="flex items-center gap-4"><ShieldCheck className="h-6 w-6" aria-hidden="true" />Complain online and track your case</span><ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
                  </div>
                </section>

                {/* Full text */}
                <section aria-labelledby="full-title">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <SectionHeading id="full-title" eyebrow="Read the charter" title="The full charter" highlight="full charter" />
                    <DocTools size={size} setSize={setSize} />
                  </div>
                  <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10" style={{ fontSize: sizes[size] }}>
                    <div className="border-l-4 border-[#CB9615] pl-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A6F06]">Foreword</p>
                      <p className="mt-2 font-serif leading-[1.75] text-gray-800">{data.foreword.split(" the provision")[0]}</p>
                      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {data.forewordList.map((f) => <li key={f} className="flex gap-2 text-gray-700"><Check className="mt-1 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />{f}</li>)}
                      </ul>
                      <p className="mt-3 text-sm font-semibold text-gray-600">Omolola Bridget Oloworaran, Director-General</p>
                    </div>
                    <div className="mt-10 space-y-10">
                      {narrative.map((s) => (
                        <section key={s.n} id={`c-${s.n}`} className="scroll-mt-40">
                          <h3 className="flex items-baseline gap-3 text-xl font-bold text-[#0A2E10]"><span className="font-display text-sm text-[#CB9615]">{s.n}.0</span>{s.title}</h3>
                          {s.n === 10 ? null : (
                            <div className="mt-3 space-y-2.5">
                              {s.blocks.map((b, i) => (
                                <p key={i} className={cn("font-serif leading-[1.75] text-gray-800", b.sub ? "pl-14" : b.m ? "pl-12" : "")}>
                                  {b.m && <span className={cn("-ml-12 inline-block w-12 font-sans text-sm font-bold", b.sub ? "-ml-8 w-8 text-gray-400" : "text-[#117F21]")}>{b.m}</span>}
                                  {b.x}
                                </p>
                              ))}
                            </div>
                          )}
                        </section>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="space-y-4">
                  <VerifyNote />
                  <PdfCard href={PDF} title="Revised Commission’s Service Charter / Service Level Agreement" meta="PDF · 46 pages · May 2026" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {reduce && null}
    </MotionConfig>
  );
}
