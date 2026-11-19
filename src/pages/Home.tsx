import { useEffect } from "react";
import { useLocation } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import CookieConsent from "@/components/CookieConsent";
import PromoPopup from "@/components/PromoPopup";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import HomeHero from "./home/HomeHero";
import AudienceTasks from "./home/AudienceTasks";
import { IndustryFigures, Updates } from "./home/Figures";
import { Portals, ServicesGrid } from "./home/Services";
import { HelpFaq, NewsMedia, PrototypeLinks } from "./home/Stories";

const homeSections = [
  { id: "start", label: "I am a…" },
  { id: "notices", label: "Notices" },
  { id: "services", label: "Services" },
  { id: "portals", label: "Online services" },
  { id: "news", label: "News" },
  { id: "figures", label: "Figures" },
  { id: "help", label: "Help" },
];

/**
 * Home — redesigned. Order follows the stakeholder answer to DES-19:
 * search + featured slider → "I am a…" tasks → notices & latest regulations → services →
 * online portals → news & media → industry figures → FAQs & help.
 * Previous version: Home.backup.tsx.txt
 */
export default function Home() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  // In-page links (/#services, /#help …) from the section bar.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <CookieConsent />
      <PromoPopup />
      <HomeHero />
      <SectionNav sections={homeSections} pillId="home-nav-pill" />
      <AudienceTasks />
      <Updates />
      <ServicesGrid />
      <Portals />
      <NewsMedia />
      <IndustryFigures />
      <HelpFaq />
      <PrototypeLinks />
    </MotionConfig>
  );
}
