import { motion } from "framer-motion";

export default function ReportGovBadge() {
  return (
    <motion.a
      href="https://reportgov.ng"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center bg-gradient-to-r from-[#B52026] to-[#D32F2F] text-white rounded-md px-3 py-1.5 shadow-lg hover:shadow-xl transition-all"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      title="ReportGov.ng - Report Government Activities"
    >
      <span className="text-xs font-bold tracking-wide">reportgov</span>
      <span className="ml-0.5 bg-[#117F21] text-white text-[9px] font-bold px-1 py-0.5 rounded-sm">
        .ng
      </span>
    </motion.a>
  );
}
