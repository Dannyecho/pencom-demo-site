import { motion } from "framer-motion";
import { Eye, Quote, Target } from "lucide-react";
import { mandate, values } from "./data";
import { SectionHeading, Spotlight, Tilt, ease, icons, reveal } from "./primitives";

/* ─────────────────────────── Overview + mandate ─────────────────────────── */

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className="scroll-mt-40 py-20 sm:py-28">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-14 px-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="overview-title"
            eyebrow="Who we are"
            title="One regulator for every pension in Nigeria."
            highlight="every pension"
          />
          <motion.div {...reveal} className="mt-6 space-y-4 text-gray-600 leading-relaxed">
            <p>
              Before 2004, pensions in Nigeria were paid from yearly budgets, and many retirees waited years for what
              they were owed. The Pension Reform Act 2004 replaced that system with the Contributory Pension Scheme and
              created the Commission to regulate it.
            </p>
            <p>
              Today we license and supervise the operators who invest and keep your savings, set the rules they follow,
              and step in when employers or operators fall short.
            </p>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <h3 className="sr-only">What we do</h3>
          <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mandate.map((m, i) => {
              const Icon = icons[m.icon];
              return (
                <motion.li
                  key={m.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease }}
                >
                  <Spotlight
                    color="rgba(17,127,33,0.12)"
                    className="h-full rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#117F21]/30 hover:shadow-[0_24px_50px_-24px_rgba(10,74,19,0.35)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white text-[#117F21] ring-1 ring-[#117F21]/10 transition-transform duration-500 group-hover/spot:scale-110 group-hover/spot:rotate-[-6deg]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs font-semibold text-gray-300 transition-colors group-hover/spot:text-[#CB9615]">
                        0{i + 1}
                      </span>
                    </div>
                    <h4 className="mt-5 text-lg font-semibold text-[#0A2E10]">{m.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{m.body}</p>
                  </Spotlight>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Mission, vision & values ─────────────────────────── */

export function MissionValues() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className="relative scroll-mt-40 overflow-hidden bg-gradient-to-b from-[#F4F7F2] to-white py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#CB9615]/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading
          id="mission-title"
          eyebrow="What drives us"
          title="The purpose behind every decision."
          highlight="every decision"
          center
        />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Mission */}
          <motion.article {...reveal} className="lg:col-span-7">
            <Spotlight
              color="rgba(244,210,122,0.22)"
              size={520}
              className="h-full rounded-3xl bg-gradient-to-br from-[#06300C] via-[#0A4A13] to-[#117F21] p-8 text-white shadow-[0_40px_80px_-40px_rgba(6,48,12,0.8)] sm:p-12"
            >
              <Quote aria-hidden="true" className="absolute right-8 top-8 h-24 w-24 text-white/[0.06]" />
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Target className="h-5 w-5 text-[#F4D27A]" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#F4D27A]">Our mission</h3>
              </div>
              <p className="mt-8 font-serif text-2xl leading-snug sm:text-[1.9rem]">
                To regulate, supervise and ensure the effective administration of pension matters in Nigeria, while
                promoting a sustainable pension system that guarantees retirement benefits for all Nigerian workers.
              </p>
            </Spotlight>
          </motion.article>

          {/* Vision */}
          <motion.article {...reveal} transition={{ ...reveal.transition, delay: 0.12 }} className="lg:col-span-5">
            <Spotlight
              color="rgba(17,127,33,0.12)"
              className="h-full rounded-3xl border border-[#CB9615]/25 bg-gradient-to-br from-[#FFF8E1] via-white to-white p-8 sm:p-12"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CB9615]/15 ring-1 ring-[#CB9615]/25">
                  <Eye className="h-5 w-5 text-[#9A6F06]" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8A6305]">Our vision</h3>
              </div>
              <p className="mt-8 font-serif text-xl leading-snug text-[#0A2E10] sm:text-[1.65rem]">
                To be a model pension regulatory authority in Africa, ensuring that every Nigerian worker receives their
                retirement benefits as and when due, through a well-regulated and supervised pension industry.
              </p>
            </Spotlight>
          </motion.article>
        </div>

        {/* Values */}
        <div className="mt-16">
          <motion.h3 {...reveal} className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Our core values
          </motion.h3>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = icons[v.icon];
              return (
                <motion.li
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                >
                  <Tilt className="h-full">
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-7 text-center transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(10,74,19,0.45)]">
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100"
                      />
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#117F21] transition duration-500 group-hover:bg-[#117F21] group-hover:text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <h4 className="mt-5 text-lg font-semibold text-[#0A2E10]">{v.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.desc}</p>
                    </div>
                  </Tilt>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
