import { useEffect } from "react";
import { useLocation } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import CookieConsent from "@/components/CookieConsent";
import { scrollToId } from "./about/primitives";
import Hero from "./homeminimal/Hero";
import { Alerts, Circulars, Figures, Help, News, Portals } from "./homeminimal/Sections";

/**
 * Home, minimal design (/home-minimal). Same DES-19 order as the main homepage, told with less:
 * white space, one accent colour, hairlines instead of cards, large regular-weight type with one bold
 * key phrase, a photo-only slider with its caption underneath, and quiet motion that settles once.
 */
export default function HomeMinimal() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id || id === "chat") return;
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <CookieConsent />
      <div className="bg-white text-[#111A13]">
        <Hero />
        <Alerts />
        <Circulars />
        <Portals />
        <News />
        <Figures />
        <Help />
      </div>
    </MotionConfig>
  );
}
