import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation, useSearchParams } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import OpsHero from "./operators/OpsHero";
import Directory, { OperatorDrawer } from "./operators/Directory";
import { Funds, HowItWorks, PerformanceCta } from "./operators/Sections";

const sections = [
  { id: "directory", label: "Directory" },
  { id: "how", label: "How it works" },
  { id: "funds", label: "RSA funds" },
  { id: "performance", label: "Performance" },
];

/**
 * Pension operators (brief §6.2 Operators + "Operator directory and details" template; DES-28, DES-29, DES-30).
 * ?op=<id> opens an operator's details, so every operator has a shareable link.
 * Previous version: Operators.backup.tsx.txt
 */
const tabFor: Record<string, "PFA" | "PFC" | "CPFA" | "Related"> = { pfas: "PFA", "pfa-addresses": "PFA", pfcs: "PFC", cpfas: "CPFA", penop: "Related", ptad: "Related", related: "Related" };

export default function Operators() {
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const tabHint = tabFor[hash.replace(/^#/, "")] ?? null;

  const open = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("op", id);
    else next.delete("op");
    setParams(next, { preventScrollReset: true });
  };

  // Old links (#pfas, #pfcs …) land on the directory.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    if (id === "pfa-downloads" || id === "pfc-downloads") return void navigate("/resources#downloads", { replace: true });
    if (id === "rsa-summary") return void navigate("/performance", { replace: true });
    const target = id in tabFor ? "directory" : id;
    const t = window.setTimeout(() => scrollToId(target, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce, navigate]);

  return (
    <MotionConfig reducedMotion="user">
      <OpsHero onOpen={open} />
      <SectionNav sections={sections} pillId="ops-nav-pill" />
      <Directory onOpen={open} tabHint={tabHint} />
      <HowItWorks />
      <Funds />
      <PerformanceCta />
      <OperatorDrawer id={params.get("op")} onClose={() => open(null)} />
    </MotionConfig>
  );
}
