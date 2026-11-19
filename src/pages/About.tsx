import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import AboutHero from "./about/AboutHero";
import SectionNav from "./about/SectionNav";
import { MissionValues, Overview } from "./about/Purpose";
import HistoryTimeline from "./about/HistoryTimeline";
import Organogram from "./about/Organogram";
import Leadership, { ExecDialog } from "./about/Leadership";
import Charter from "./about/Charter";
import { scrollToId } from "./about/primitives";

/**
 * About PenCom — redesigned.
 * Sections: hero · sticky "On this page" nav · overview & mandate · mission, vision & values ·
 * scroll-driven history · interactive organogram · leadership · Service Charter · visit us.
 * Previous version: About.backup.tsx.txt
 */
export default function About() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const [execId, setExecId] = useState<string | null>(null);

  // Deep links from the mega menu, footer and in-page nav (/about#history, /about#structure …).
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) {
      window.scrollTo({ top: 0 });
      return;
    }
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    // Arriving from another page, the layout is still settling (images, reveals); correct once more.
    const t2 = window.setTimeout(() => scrollToId(id, false), 900);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white">
        <AboutHero />
        <SectionNav />
        <Overview />
        <MissionValues />
        <HistoryTimeline />
        <Organogram onSelect={setExecId} />
        <Leadership onSelect={setExecId} />
        <Charter />
        <ExecDialog execId={execId} onClose={() => setExecId(null)} />
      </div>
    </MotionConfig>
  );
}
