import type { Metadata } from "next";
import { getGroups, getPersonas } from "@/lib/content";
import { PersonaBrowser } from "@/components/PersonaBrowser";
import { Star } from "@/components/Ornaments";

export const metadata: Metadata = { title: "PERSONAS" };

export default async function PersonasPage() {
  const [personas, worlds, works] = await Promise.all([getPersonas(), getGroups("world"), getGroups("work")]);
  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>INDEX OF PERSONAS</span>
          <h1 className="display">PERSONAS</h1>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div className="page-count">ENTRIES<span className="display">{personas.length}</span></div>
          <Star size={56} />
        </div>
      </section>
      <PersonaBrowser personas={personas} worlds={worlds} works={works} />
    </div>
  );
}
