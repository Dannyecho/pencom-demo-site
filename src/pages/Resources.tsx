import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import ResHero from "./resources/ResHero";
import Guides from "./resources/Guides";
import { FaqSection, Glossary } from "./resources/FaqGlossary";
import { Downloads, Learning, Publications } from "./resources/Library";

const sections = [
  { id: "guides", label: "Guides" },
  { id: "faq", label: "FAQs" },
  { id: "glossary", label: "Glossary" },
  { id: "publications", label: "Publications" },
  { id: "downloads", label: "Forms" },
  { id: "learning", label: "Learning" },
];

/**
 * Resources and knowledge base (brief §6.2 Resources; DES-06, DES-22, DES-24, DES-39, DES-41).
 * Guides open in a dialog that can be read aloud, enlarged or printed; ?guide=<id> makes each shareable.
 * Previous version: Resources.backup.tsx.txt
 */
export default function Resources() {
  const { pathname, hash } = useLocation();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [focusTerm, setFocusTerm] = useState<string | null>(null);
  const [pubHint, setPubHint] = useState<string | null>(null);

  const go = useCallback((id: string) => window.setTimeout(() => scrollToId(id, !reduce), 60), [reduce]);

  const setGuide = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("guide", id);
    else next.delete("guide");
    setParams(next, { preventScrollReset: true });
  };

  // /resources/faq and in-page anchors. Circulars now live in the regulatory library.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (id === "circulars") {
      navigate("/regulations?type=Circular#library", { replace: true });
      return;
    }
    const pubTab: Record<string, string> = { "annual-reports": "annual report", "monthly-reports": "monthly", "quarterly-reports": "quarterly", general: "other" };
    if (id in pubTab) {
      setPubHint(pubTab[id]);
      const t = go("publications");
      return () => window.clearTimeout(t);
    }
    if (id === "presentations" || id === "seminars") {
      const t = go("learning");
      return () => window.clearTimeout(t);
    }
    if (id) {
      const t = go(id);
      return () => window.clearTimeout(t);
    }
    if (pathname.endsWith("/faq")) {
      const t = go("faq");
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [hash, pathname, go, navigate]);

  return (
    <MotionConfig reducedMotion="user">
      <ResHero
        openGuide={(id) => setGuide(id)}
        openFaq={(q) => {
          setOpenQ(q);
          go("faq");
        }}
        openTerm={(t) => {
          setFocusTerm(t);
          go("glossary");
        }}
        findPublication={(t) => {
          setPubHint(t);
          go("publications");
        }}
      />
      <SectionNav sections={sections} pillId="res-nav-pill" />
      <Guides openId={params.get("guide")} setOpenId={setGuide} />
      <FaqSection openQ={openQ} setOpenQ={setOpenQ} />
      <Glossary focusTerm={focusTerm} />
      <Publications key={pubHint ?? "pubs"} highlight={pubHint} />
      <Downloads />
      <Learning openGuides={() => go("guides")} />
    </MotionConfig>
  );
}
