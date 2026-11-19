import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, MapPin, MessageSquareWarning } from "lucide-react";
import { charter, zonalOffices } from "./data";
import { CountUp, GridBackdrop, SectionHeading, Spotlight, ease, reveal } from "./primitives";

export default function Charter() {
  return (
    <>
      <section id="charter" aria-labelledby="charter-title" className="scroll-mt-40 py-20 sm:py-28">
        <div className="mx-auto grid grid-cols-1 max-w-7xl gap-12 px-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[180px]">
              <SectionHeading
                id="charter-title"
                eyebrow="Our promise"
                title="Service Charter"
                intro="We are committed to efficient, transparent and courteous service. These are the standards you can expect from us."
              />
              <motion.div {...reveal} className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/about/service-charter"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#117F21] px-5 py-3 font-semibold text-white transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
                >
                  Read the full charter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div
                {...reveal}
                className="mt-8 flex gap-3 rounded-2xl border border-[#CB9615]/30 bg-[#FFF8E1] p-4 text-sm text-[#5C4300]"
              >
                <MessageSquareWarning className="mt-0.5 h-5 w-5 shrink-0 text-[#9A6F06]" aria-hidden="true" />
                <p>
                  Not getting the service we promise?{" "}
                  <Link to="/connect" className="font-semibold underline underline-offset-4 hover:text-[#117F21]">
                    Tell us
                  </Link>
                  .
                </p>
              </motion.div>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {charter.map((c, i) => (
              <motion.li
                key={c.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease }}
              >
                <Spotlight
                  color="rgba(17,127,33,0.10)"
                  className="h-full rounded-2xl border border-gray-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#117F21]/30 hover:shadow-[0_24px_50px_-24px_rgba(10,74,19,0.35)]"
                >
                  <div className="flex items-start justify-between">
                    <p className="flex items-baseline gap-2">
                      <CountUp
                        value={c.value}
                        className="bg-gradient-to-br from-[#0A4A13] to-[#117F21] bg-clip-text text-5xl font-black tracking-tight text-transparent"
                      />
                      <span className="text-sm font-semibold text-[#9A6F06]">{c.unit}</span>
                    </p>
                    <Award className="h-5 w-5 text-gray-200 transition-colors group-hover/spot:text-[#CB9615]" aria-hidden="true" />
                  </div>
                  <span aria-hidden="true" className="mt-4 block h-0.5 w-10 origin-left rounded-full bg-[#CB9615] transition-transform duration-500 group-hover/spot:scale-x-[3]" />
                  <p className="mt-4 text-gray-600">{c.label}</p>
                </Spotlight>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Visit us */}
      <section aria-labelledby="visit-title" className="px-4 pb-20 sm:pb-28">
        <motion.div
          {...reveal}
          className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#04240A] px-6 py-12 text-white sm:px-12 sm:py-16"
        >
          <GridBackdrop className="-z-10" />
          <div aria-hidden="true" className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-[#117F21]/50 blur-[100px]" />
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="visit-title" className="text-3xl font-bold sm:text-4xl">
                Visit us in Abuja or at a zonal office
              </h2>
              <p className="mt-4 flex gap-2 text-white/75">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#F4D27A]" aria-hidden="true" />
                Head office: 174 Adetokunbo Ademola Crescent, Wuse II, Abuja.
              </p>
              <Link
                to="/connect#zonal-offices"
                className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-5 py-3 font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
              >
                Find a zonal office
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {zonalOffices.map((z, i) => (
                <motion.li
                  key={z}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium backdrop-blur transition hover:border-[#F4D27A]/40 hover:bg-white/10"
                >
                  <span className="h-2 w-2 rounded-full bg-[#F4D27A]" aria-hidden="true" />
                  {z}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>
    </>
  );
}
