import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import ConnectHero from "./connect/ConnectHero";
import CaseForm from "./connect/CaseForm";
import { Newsroom, Offices, Tracker } from "./connect/Sections";
import type { TopicId } from "./connect/data";

const sections = [
  { id: "contact", label: "Contact us" },
  { id: "track", label: "Track a case" },
  { id: "zonal-offices", label: "Offices" },
  { id: "news", label: "Newsroom" },
];

/**
 * Connect (brief §6.2 Connect; templates "Complaint, enquiry and employer report forms", "Case status tracker",
 * "Utility pages: contact and zonal offices", "News and events"; questionnaire "Anything else": news and media centre).
 * Previous version: Connect.backup.tsx.txt
 */
export default function Connect() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState<TopicId>("enquiry");
  const [lastRef, setLastRef] = useState<string | null>(null);

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    if (id === "report") setTopic("employer");
    if (id === "complaint") setTopic("pfa");
    const target = id === "report" || id === "complaint" ? "contact" : id;
    const t = window.setTimeout(() => scrollToId(target, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  const go = (id: string, t?: string) => {
    if (t) setTopic(t as TopicId);
    navigate({ hash: id }, { replace: true });
    scrollToId(id, !reduce);
  };

  return (
    <MotionConfig reducedMotion="user">
      <ConnectHero go={go} />
      <SectionNav sections={sections} pillId="connect-nav-pill" />
      <CaseForm topic={topic} setTopic={setTopic} onSubmitted={setLastRef} />
      <Tracker prefill={lastRef} />
      <Offices />
      <Newsroom />
    </MotionConfig>
  );
}
