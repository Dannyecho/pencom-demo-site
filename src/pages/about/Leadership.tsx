import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { allExecs, commissioners, dg, secretary, type Exec } from "./data";
import { SectionHeading, Spotlight, ease, reveal } from "./primitives";

export function ExecDialog({ execId, onClose }: { execId: string | null; onClose: () => void }) {
  const exec = allExecs.find((e) => e.id === execId) ?? null;
  return (
    <Dialog open={!!exec} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-3xl border-0 p-0 sm:max-w-md [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-white/20 [&>button]:text-white [&>button]:opacity-100 [&>button]:backdrop-blur">
        {exec && (
          <>
            <div className="relative h-80 overflow-hidden bg-gradient-to-b from-[#0A4A13] to-[#117F21]">
              <motion.img
                src={exec.image}
                alt=""
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease }}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04240A] via-[#04240A]/30 to-transparent" />
              <div className="absolute inset-x-6 bottom-6">
                <span className="inline-block rounded-full bg-[#CB9615] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A1206]">
                  {exec.title}
                </span>
                <DialogTitle className="mt-3 text-2xl font-bold leading-tight text-white">{exec.name}</DialogTitle>
              </div>
            </div>
            <div className="p-6">
              <DialogDescription className="text-base leading-relaxed text-gray-600">{exec.bio}</DialogDescription>
              <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-400">
                National Pension Commission · Federal Republic of Nigeria
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ExecCard({ exec, i, onSelect }: { exec: Exec; i: number; onSelect: (id: string) => void }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease }}
    >
      <button
        type="button"
        onClick={() => onSelect(exec.id)}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200 text-left shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(10,74,19,0.55)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
      >
        <img
          src={exec.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04240A] via-[#04240A]/25 to-transparent" />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0A4A13] via-[#0A4A13]/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="absolute inset-x-0 bottom-0 p-4">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#F4D27A]">{exec.title}</span>
          <span className="mt-1 block text-[0.95rem] font-bold leading-snug text-white">{exec.name}</span>
          <span className="grid grid-cols-1 grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
            <span className="overflow-hidden">
              <span className="mt-2 line-clamp-3 block text-xs leading-relaxed text-white/80">{exec.bio}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white">
                View profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </span>
          </span>
        </span>
      </button>
    </motion.li>
  );
}

export default function Leadership({ onSelect }: { onSelect: (id: string) => void }) {
  const team = [...commissioners, secretary];
  return (
    <section
      id="executive"
      aria-labelledby="executive-title"
      className="relative scroll-mt-40 overflow-hidden bg-gradient-to-b from-white via-[#F4F7F2] to-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="executive-title"
          eyebrow="Our leadership"
          title="Meet the team steering the Commission."
          highlight="steering the Commission."
          intro="The Director General leads the Commission with four Commissioners and the Commission Secretary."
        />

        {/* DG feature */}
        <motion.div {...reveal} className="mt-14">
          <Spotlight
            color="rgba(244,210,122,0.18)"
            size={600}
            className="rounded-[2rem] bg-gradient-to-br from-[#04240A] via-[#0A4A13] to-[#117F21] text-white shadow-[0_50px_100px_-50px_rgba(4,36,10,0.9)]"
          >
            <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
              <div className="relative md:col-span-5">
                <div className="relative h-80 md:h-full md:min-h-[420px]">
                  <img src={dg.image} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04240A]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0A4A13]" />
                </div>
              </div>
              <div className="relative flex flex-col justify-center p-8 sm:p-12 md:col-span-7">
                <Quote aria-hidden="true" className="h-12 w-12 text-[#F4D27A]/30" />
                <span className="mt-4 inline-flex w-fit rounded-full bg-[#CB9615] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A1206]">
                  Director General
                </span>
                <h3 className="mt-4 text-3xl font-bold sm:text-4xl">{dg.name}</h3>
                <p className="mt-4 max-w-lg font-serif text-xl leading-relaxed text-white/80">{dg.bio}</p>
                <button
                  type="button"
                  onClick={() => onSelect(dg.id)}
                  className="group mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#0A4A13] transition hover:bg-[#F4D27A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
                >
                  View profile
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Spotlight>
        </motion.div>

        <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {team.map((e, i) => (
            <ExecCard key={e.id} exec={e} i={i} onSelect={onSelect} />
          ))}
        </ul>
      </div>
    </section>
  );
}
