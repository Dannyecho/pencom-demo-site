import { useEffect } from "react";
import { useLocation } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import { AllocationSection, AssetsSection, CompareSection, CoverageSection, FeesSection, FundsSection, MethodSection, PerfHero } from "./performance/Sections";

const sections = [
  { id: "assets", label: "Assets" },
  { id: "allocation", label: "Investments" },
  { id: "funds", label: "Fund types" },
  { id: "coverage", label: "Coverage" },
  { id: "compare", label: "Compare PFAs" },
  { id: "fees", label: "Fees" },
  { id: "method", label: "Methodology" },
];

/**
 * Industry performance (brief §7 "Data page (PFA performance and fees)": accessible tables and charts, period selector,
 * CSV/JSON download, methodology note; questionnaire DES-29). Previous version: Performance.backup.tsx.txt
 */
export default function Performance() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id === "rsa-summary" ? "coverage" : id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <PerfHero />
      <SectionNav sections={sections} pillId="perf-nav-pill" />
      <AssetsSection />
      <AllocationSection />
      <FundsSection />
      <CoverageSection />
      <CompareSection />
      <FeesSection />
      <MethodSection />
    </MotionConfig>
  );
}
