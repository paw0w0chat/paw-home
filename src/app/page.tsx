import Link from "next/link";
import { getGroups, getProfile, getRecentPersonas, getRecentWorks } from "@/lib/content";
import { PersonaCard, SectionHead, WorksTable } from "@/components/Blocks";
import { Barcode, Star } from "@/components/Ornaments";

export default async function HomePage() {
  const [profile, personas, works, worlds] = await Promise.all([
    getProfile(),
    getRecentPersonas(4),
    getRecentWorks(3),
    getGroups("world"),
  ]);
  const worldOf = (id: string) => worlds.find((w) => w.id === id);

  return (
    <div className="container">
      {/* HERO */}
      <section className="hero">
        <div className="hero-stack">
          <div className="hero-words" aria-label="PAWCAT">
            <div className="outline" style={{ fontWeight: 200 }} aria-hidden="true">PAWCAT</div>
            <div className="outline" style={{ fontWeight: 400 }} aria-hidden="true">PAWCAT</div>
            <div style={{ fontWeight: 500 }} aria-hidden="true">//PAWCAT</div>
            <div style={{ fontWeight: 900 }}>PAWCAT</div>
            <div style={{ fontWeight: 900, height: "0.48em", overflow: "hidden" }} aria-hidden="true">PAWCAT</div>
          </div>
          <svg className="hero-orbit" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="420" cy="250" rx="380" ry="120" transform="rotate(-14 420 250)" fill="none" stroke="#111" strokeWidth="1.5" />
            <ellipse cx="420" cy="250" rx="360" ry="100" transform="rotate(-14 420 250)" fill="none" stroke="#111" strokeWidth="0.75" />
            <path d="M62 300 C64 316 70 322 86 324 C70 326 64 332 62 348 C60 332 54 326 38 324 C54 322 60 316 62 300 Z" fill="#111" />
            <path d="M770 140 C772 152 776 156 788 158 C776 160 772 164 770 176 C768 164 764 160 752 158 C764 156 768 152 770 140 Z" fill="#111" />
          </svg>
        </div>

        <aside className="spec-box">
          <div className="spec-box-top">
            <span style={{ flex: 1, margin: 12, display: "flex" }}><Barcode width="100%" height={44} /></span>
            <div className="spec-box-num">001</div>
          </div>
          <div className="spec-box-body">
            <div className="spec-box-vertical">pawcat;</div>
            <div className="spec-box-main">
              <div className="label" style={{ lineHeight: 1.6 }}>TYPE: CREATOR ARCHIVE<br />X-IV / F19 PWC<br />SEOUL, KR</div>
              <div className="display spec-box-letter">P</div>
            </div>
          </div>
        </aside>
      </section>

      {/* BAND */}
      <section className="band">
        <div className="band-words">
          <div>PERSONAS,</div>
          <div style={{ paddingLeft: "1.2em" }}>PROMPTS</div>
          <div className="display" style={{ fontWeight: 800, lineHeight: 1.02, letterSpacing: 0 }}>&amp; STORIES</div>
        </div>
        <div className="band-side">
          <p>{profile.intro}</p>
          <div className="signal-bar" />
          <p className="mono" style={{ fontSize: 11, color: "var(--steel)" }}>(first) install ment / 2026</p>
        </div>
      </section>

      {/* RECENT PERSONAS */}
      <section className="section">
        <SectionHead title={["RECENT", "PERSONAS"]} href="/personas" />
        <div className="card-grid">
          {personas.map((p) => (
            <PersonaCard key={p.id} persona={p} world={worldOf(p.worldId)} dark />
          ))}
        </div>
      </section>

      {/* WORKS */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <SectionHead title={["WORKS", "RELEASED"]} sub="AI CHAT — LATEST 03" />
        <WorksTable works={works} highlightFirst />
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}>
          <Link href="/works" className="btn-outline"><Star size={14} /> 더보기 / ALL WORKS →</Link>
        </div>
      </section>
    </div>
  );
}
