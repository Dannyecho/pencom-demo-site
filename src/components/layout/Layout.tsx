import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "@/components/chat/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import QuickLinks from "@/components/QuickLinks";
import LanguageNotice from "@/components/LanguageNotice";

export default function Layout() {
  const location = useLocation();
  const isHome = ["/", "/home-retirees", "/home-minimal", "/home-showcase", "/home-showcase2", "/home-classic"].includes(location.pathname);
  const navigate = useNavigate();
  const { pathname, hash, search } = location;

  // New page without an anchor: start at the top (pages with an anchor scroll themselves).
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Any link ending in #chat (menus, slides, quick links) opens the PenCom Assistant.
  useEffect(() => {
    if (hash !== "#chat") return;
    const t = window.setTimeout(() => document.getElementById("chat-trigger")?.click(), 150);
    navigate({ pathname, search }, { replace: true, preventScrollReset: true });
    return () => window.clearTimeout(t);
  }, [hash, pathname, search, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to content link - first focusable element for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#117F21] focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header - includes top bar + main navigation */}
      <Header />

      {/* Main content - pt for header height */}
      <main id="main-content" className="flex-1 pt-[92px]" tabIndex={-1}>
        <LanguageNotice />
        <Outlet />
      </main>

      <Footer />
      <Chatbot />
      <QuickLinks />

      {/* Floating Accessibility Widget - Home page only */}
      {isHome && <AccessibilityWidget />}

    </div>
  );
}
