import Link from "next/link";
import type { Group, Persona, Work } from "@/lib/types";
import { serial } from "@/lib/content";
import { Barcode, Star } from "./Ornaments";

export function SectionHead({ title, sub, href, linkLabel = "전체 보기 →" }: {
  title: [string, string];
  sub?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-head">
      <h2 className="display">
        {title[0]}<span className="slash">//</span>{title[1]}
      </h2>
      {href ? (
        <Link href={href} className="more-link">{linkLabel}</Link>
      ) : sub ? (
        <span className="mono muted" style={{ fontSize: 12 }}>{sub}</span>
      ) : null}
    </div>
  );
}

export function PersonaCard({ persona, world, dark = false }: { persona: Persona; world?: Group; dark?: boolean }) {
  return (
    <Link href={`/personas/${persona.id}`} className="persona-card">
      <div className={`card-top${dark ? " dark" : ""}`}>
        <span>{serial("P", persona.order)}</span>
        <span>{world ? world.title : ""}</span>
      </div>
      <div className="card-name">
        <span className="display">{persona.codename}</span>
        <span className="ko">{persona.nameKo}</span>
      </div>
      <div className="card-meta">
        <span className="label">{persona.cardMeta.label}</span>
        <span>{persona.cardMeta.value}</span>
      </div>
      <div className="card-foot">
        <Barcode width={84} height={20} />
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>VIEW <Star size={14} /></span>
      </div>
    </Link>
  );
}

export function GroupHead({ code, group, count, unit }: { code: string; group: Group; count: number; unit: string }) {
  return (
    <div className="group-head">
      <div className="group-code">{code}</div>
      <div className="group-title">
        <span className="display">{group.title}</span>
        <span>{group.sub}</span>
      </div>
      <div className="group-count">{String(count).padStart(2, "0")} {unit}</div>
    </div>
  );
}

export function WorkCard({ work, isNew = false }: { work: Work; isNew?: boolean }) {
  const body = (
    <>
      <div className="card-top" style={{ alignItems: "center" }}>
        <span>{`W-${String(work.order).padStart(2, "0")}`}</span>
        {isNew ? <span className="tag tag-signal" style={{ border: 0, padding: "1px 8px" }}>NEW</span> : <span>AI CHAT</span>}
      </div>
      <div className="work-cover">
        {work.thumbnail ? <img src={work.thumbnail} alt="" loading="lazy" /> : <span aria-hidden="true">[썸네일]</span>}
      </div>
      <div className="card-name" style={{ paddingBottom: 10 }}>
        <span className="ko" style={{ fontSize: 20 }}>{work.title}</span>
      </div>
      <div className="card-meta"><span className="label">GENRE</span><span>{work.genre}</span></div>
      <div className="card-meta"><span className="label">PLATFORM</span><span>{work.platform}</span></div>
      <div className="card-meta"><span className="label">RELEASED</span><span className="mono" style={{ fontSize: 12 }}>{work.releasedAt}</span></div>
      <div className="card-foot">
        <Barcode width={84} height={20} />
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{work.url ? "PLAY →" : ""} <Star size={14} /></span>
      </div>
    </>
  );
  return work.url ? (
    <a href={work.url} target="_blank" rel="noreferrer" className="persona-card work-card">{body}</a>
  ) : (
    <article className="persona-card work-card">{body}</article>
  );
}

export function WorksGrid({ works, highlightFirst = false }: { works: Work[]; highlightFirst?: boolean }) {
  if (works.length === 0) return <p className="empty">아직 등록된 작품이 없어요.</p>;
  return (
    <div className="work-grid">
      {works.map((w, i) => <WorkCard key={w.id} work={w} isNew={highlightFirst && i === 0} />)}
    </div>
  );
}
