import type { Metadata } from "next";
import { getDreams, getGroups, getPersonas } from "@/lib/content";
import { DreamBrowser } from "@/components/DreamBrowser";

export const metadata: Metadata = { title: "DREAM" };

export default async function DreamsPage() {
  const [dreams, worlds, works, personas] = await Promise.all([
    getDreams(), getGroups("world"), getGroups("work"), getPersonas(),
  ]);
  return (
    <div className="container">
      <section className="page-title" style={{ position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
          <span className="label" style={{ fontSize: 12 }}>CHARACTER × PERSONA — BY WORK</span>
          <h1 className="display">DREAM</h1>
          <svg viewBox="0 0 600 160" aria-hidden="true" style={{ position: "absolute", left: -20, top: 10, width: "120%", height: "100%", pointerEvents: "none" }}>
            <ellipse cx="300" cy="100" rx="290" ry="50" transform="rotate(-6 300 100)" fill="none" stroke="#111" strokeWidth="1.5" />
            <path d="M560 40 C562 52 566 56 578 58 C566 60 562 64 560 76 C558 64 554 60 542 58 C554 56 558 52 560 40 Z" fill="#111" />
          </svg>
        </div>
        <div className="page-count">PAIRS<span className="display">{String(dreams.length).padStart(2, "0")}</span></div>
      </section>
      <DreamBrowser dreams={dreams} groups={[...worlds, ...works]} personas={personas} />
    </div>
  );
}
