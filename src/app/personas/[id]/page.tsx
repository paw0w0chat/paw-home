import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DREAM_STATUS_LABEL, getDreamsByPersona, getGroup, getPersona, getPersonas, serial } from "@/lib/content";
import { CopyButton } from "@/components/CopyButton";
import { SectionHead } from "@/components/Blocks";
import { Star } from "@/components/Ornaments";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getPersonas()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPersona((await params).id);
  return { title: p ? `${p.codename} · ${p.nameKo}` : "PERSONA" };
}

function ImageFrame({ code, ratio, label, src, tall }: { code: string; ratio: string; label: string; src?: string; tall?: boolean }) {
  return (
    <figure className={`img-frame${tall ? " tall" : ""}`}>
      <div className="card-top"><span>{code}</span><span>{ratio}</span></div>
      <div className="img-slot" style={{ aspectRatio: ratio.split(" / ")[1]?.replace(":", " / ") }}>
        {src ? <img src={src} alt={label} /> : <span>[{label} 이미지]</span>}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

export default async function PersonaDetailPage({ params }: Props) {
  const { id } = await params;
  const persona = await getPersona(id);
  if (!persona) notFound();

  const [world, work, dreams] = await Promise.all([
    getGroup(persona.worldId),
    getGroup(persona.workId),
    getDreamsByPersona(persona.id),
  ]);

  const notes = [
    { label: "ABILITY", text: persona.ability },
    { label: "PERSONALITY", text: persona.personality },
    { label: "BACKGROUND", text: persona.background },
    { label: "APPEARANCE", text: persona.appearance },
  ].filter((n) => n.text);

  return (
    <div className="container">
      <nav className="crumbs" aria-label="경로">
        <Link href="/personas">← PERSONAS</Link>
        <span className="muted">/ {world?.title} / {persona.codename}</span>
      </nav>

      <section className="detail">
        <div className="detail-images">
          <ImageFrame code="IMG-01" ratio="HEAD / 1:1" label="두상" src={persona.headImage} />
          <ImageFrame code="IMG-02" ratio="FULL BODY / 2:3" label="전신" src={persona.bodyImage} tall />
        </div>

        <div className="detail-info">
          <div className="detail-name">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="tag tag-solid">{serial("P", persona.order)}</span>
              {world ? <span className="tag">WORLD / {world.title}</span> : null}
            </div>
            <h1 className="display">{persona.codename}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12 }}>
              <span className="ko">{persona.nameKo}</span>
              {persona.nameAlt ? <span className="mono muted" style={{ fontSize: 14 }}>{persona.nameAlt}</span> : null}
            </div>
          </div>

          <dl className="stat-grid">
            {persona.stats.map((s) => (
              <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
            ))}
            {work ? <div><dt>WORK</dt><dd>{work.title}</dd></div> : null}
          </dl>

          {notes.length > 0 ? (
            <div className="note-row">
              {notes.map((n) => (
                <div className="note-box" key={n.label}>
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{n.label}</span>
                  <p>{n.text}</p>
                </div>
              ))}
            </div>
          ) : null}

          {persona.voice ? (
            <div className="note-box">
              <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>VOICE</span>
              <p style={{ fontSize: 17, fontWeight: 500 }}>{persona.voice}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        <SectionHead title={["PROMPT", "SHEET"]} sub="COPY READY" />
        <div className="note-row" style={{ gap: 20 }}>
          <div className="sheet dark">
            <div className="sheet-head"><span>APPEARANCE PROMPT — 외형</span><CopyButton text={persona.appearancePrompt ?? ""} /></div>
            <pre>{persona.appearancePrompt || "[외형 프롬프트 — 이미지 생성용]"}</pre>
          </div>
          <div className="sheet">
            <div className="sheet-head"><span>PROFILE — 프로필 전문</span><CopyButton text={persona.profileText ?? ""} /></div>
            <pre style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>{persona.profileText || "[채팅 플랫폼에 붙여 넣을 프로필 전문]"}</pre>
          </div>
        </div>
      </section>

      {dreams.length > 0 ? (
        <section className="section" style={{ paddingTop: 32 }}>
          <SectionHead title={["LINKED", "DREAM"]} href="/dreams" linkLabel="DREAM 전체 →" />
          <div className="note-row">
            {dreams.map((d) => (
              <Link key={d.id} href="/dreams" className="note-box" style={{ flexDirection: "row", alignItems: "center", gap: 16, background: "var(--offwhite)", textDecoration: "none", flex: "1 1 280px" }}>
                <span className="display" style={{ fontSize: 28, lineHeight: 1 }}>{d.characterEn}</span>
                <Star size={18} />
                <span style={{ fontSize: 15, fontWeight: 700 }}>{d.characterKo} × {persona.nameKo}</span>
                <span className="tag" style={{ marginLeft: "auto" }}>{DREAM_STATUS_LABEL[d.status]}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
