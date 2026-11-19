import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import SectionNav from "./about/SectionNav";
import { scrollToId } from "./about/primitives";
import RegHero from "./regulations/RegHero";
import Library, { type Filters } from "./regulations/Library";
import DocDrawer from "./regulations/DocDrawer";
import { ActSpotlight, Compliance, LatestRail, Policies } from "./regulations/Sections";

const sections = [
  { id: "latest", label: "Latest" },
  { id: "library", label: "Library" },
  { id: "act", label: "Pension Reform Act" },
  { id: "compliance", label: "Compliance" },
  { id: "policies", label: "Our policies" },
];

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

/**
 * Regulations and compliance — regulatory library (brief §7 "Regulatory library" + "Regulatory item"),
 * plain-language Act summary, employer compliance and PenCom's own policies.
 * Filters and the open document live in the URL, so any view can be shared or bookmarked.
 * Previous version: Regulations.backup.tsx.txt
 */
export default function RegulationsPage() {
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  const f: Filters = useMemo(
    () => ({
      q: params.get("q") ?? "",
      types: list(params.get("type")),
      years: list(params.get("year")).map(Number),
      who: list(params.get("who")),
      subjects: list(params.get("subject")),
      status: params.get("status") ?? "",
      sort: (params.get("sort") as Filters["sort"]) || "new",
    }),
    [params],
  );

  const set = useCallback(
    (p: Partial<Filters>) => {
      const n = { ...f, ...p };
      const next = new URLSearchParams();
      if (n.q) next.set("q", n.q);
      if (n.types.length) next.set("type", n.types.join(","));
      if (n.years.length) next.set("year", n.years.join(","));
      if (n.who.length) next.set("who", n.who.join(","));
      if (n.subjects.length) next.set("subject", n.subjects.join(","));
      if (n.status) next.set("status", n.status);
      if (n.sort !== "new") next.set("sort", n.sort);
      const doc = params.get("doc");
      if (doc) next.set("doc", doc);
      setParams(next, { replace: true, preventScrollReset: true });
    },
    [f, params, setParams],
  );

  const openDoc = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("doc", id);
    else next.delete("doc");
    setParams(next, { preventScrollReset: true });
  };

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <RegHero
        onSearch={(q) => {
          set({ q });
          document.getElementById("library")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        }}
        onOpen={openDoc}
      />
      <SectionNav sections={sections} pillId="reg-nav-pill" />
      <LatestRail onOpen={openDoc} />
      <Library f={f} set={set} onOpen={openDoc} />
      <ActSpotlight set={set} />
      <Compliance set={set} />
      <Policies />
      <DocDrawer id={params.get("doc")} onClose={() => openDoc(null)} onOpen={openDoc} />
    </MotionConfig>
  );
}
