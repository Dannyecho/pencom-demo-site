import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import SvcHero from "./services/SvcHero";
import Journeys from "./services/Journeys";
import Calculator from "./services/Calculator";
import { Handoff, HelpBand, Portals } from "./services/Portals";
import { anchorAlias, journeys } from "./services/data";

const sections = [
  { id: "journeys", label: "Services" },
  { id: "calculator", label: "Pension calculator" },
  { id: "portals", label: "Online portals" },
];

/**
 * Services (brief §6.2 Services; templates "Guided service journey" and "Online services hub"; DES-25, DES-26).
 * /services#pcc, #ppp, #rsa-transfer … open that journey; portals open a hand-off screen before leaving the site.
 * Previous version: Services.backup.tsx.txt
 */
export default function Services() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(journeys[1].anchor);
  const [handoff, setHandoff] = useState<string | null>(null);

  useEffect(() => {
    const raw = hash.replace(/^#/, "");
    if (!raw) return;
    const id = anchorAlias[raw] ?? raw;
    const isJourney = journeys.some((j) => j.anchor === id);
    if (isJourney) setActive(id);
    const t = window.setTimeout(() => scrollToId(isJourney ? "journeys" : id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  const pick = (anchor: string) => navigate({ hash: anchor }, { replace: true });

  return (
    <MotionConfig reducedMotion="user">
      <SvcHero onPick={pick} />
      <SectionNav sections={sections} pillId="svc-nav-pill" />
      <Journeys active={active} setActive={(a) => { setActive(a); navigate({ hash: a }, { replace: true, preventScrollReset: true }); }} onHandoff={setHandoff} />
      <Calculator />
      <Portals onHandoff={setHandoff} />
      <HelpBand />
      <Handoff portalKey={handoff} onClose={() => setHandoff(null)} />
    </MotionConfig>
  );
}
