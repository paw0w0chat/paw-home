import Link from "next/link";
import type { Group, Persona, Work, WorkLink } from "@/lib/types";
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
  // 대표 이미지: 두상, 없으면 전신
  const cover = persona.headImage || persona.bodyImage;
  const meta = persona.cardMeta ?? { label: "", value: "" };
  // "항목: 값" 대신 문장만 적었으면 왼쪽 라벨 없이 한 줄로
  const metaText = meta.value ? meta.value : meta.label;
  const metaLabel = meta.value ? meta.label : "";
  return (
    <Link href={`/personas/${persona.id}`} className="persona-card">
      <div className={`card-top${dark ? " dark" : ""}`}>
        <span>{serial("P", persona.order)}</span>
        <span>{world ? world.title : ""}</span>
      </div>
      <div className="persona-cover">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <span aria-hidden="true">[대표 이미지]</span>}
      </div>
      <div className="card-name">
        <span className="display">{persona.codename}</span>
        <span className="ko">{persona.nameKo}</span>
      </div>
      {metaText ? (
        <div className="card-meta">
          {metaLabel ? <span className="label">{metaLabel}</span> : null}
          <span>{metaText}</span>
        </div>
      ) : null}
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

/** 예전 데이터(문자열)와 새 데이터(배열)를 모두 목록으로 */
export const asList = (v: string[] | string | undefined) =>
  (Array.isArray(v) ? v : (v ?? "").split(",")).map((s) => s.trim()).filter(Boolean);

export function Pills({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="muted">—</span>;
  return (
    <span className="pill-row">
      {items.map((t) => <span key={t} className="pill">{t}</span>)}
    </span>
  );
}

/** 새 links 목록, 없으면 예전 url 하나. http(s)만 */
function workLinks(work: Work): WorkLink[] {
  const list = work.links?.length ? work.links : work.url ? [{ label: "바로가기", url: work.url }] : [];
  return list.filter((l) => /^https?:\/\//i.test(l.url));
}

export function WorkCard({ work, isNew = false }: { work: Work; isNew?: boolean }) {
  const links = workLinks(work);
  const body = (
    <>
      <div className="card-top" style={{ alignItems: "center" }}>
        <span>{`W-${String(work.order).padStart(2, "0")}`}</span>
        {isNew ? <span className="tag tag-signal" style={{ border: 0, padding: "1px 8px" }}>NEW</span> : <span>AI CHAT</span>}
      </div>
      <div className="work-cover">
        {work.thumbnail ? <img src={work.thumbnail} alt="" loading="lazy" /> : <span aria-hidden="true">[썸네일]</span>}
      </div>
      <div className="card-name" style={{ paddingBottom: 12, gap: 8 }}>
        <span className="ko" style={{ fontSize: 20 }}>{work.title}</span>
        {work.tagline ? <p className="work-tagline">{work.tagline}</p> : null}
      </div>
      <div className="card-meta" style={{ alignItems: "flex-start" }}><span className="label" style={{ paddingTop: 5 }}>GENRE</span><Pills items={asList(work.genre)} /></div>
      <div className="card-meta" style={{ alignItems: "flex-start" }}><span className="label" style={{ paddingTop: 5 }}>PLATFORM</span><Pills items={asList(work.platform)} /></div>
      <div className="card-meta"><span className="label">RELEASED</span><span className="mono" style={{ fontSize: 12 }}>{work.releasedAt}</span></div>
      {links.length > 0 ? (
        <div className="work-links">
          <span className="label">PLAY</span>
          <span className="work-links-row">
            {links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="work-link" aria-label={`${work.title} — ${l.label}에서 열기`}>
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </span>
        </div>
      ) : null}
      <div className="card-foot">
        <Barcode width={84} height={20} />
        <Star size={14} />
      </div>
    </>
  );
  return <article className="persona-card work-card">{body}</article>;
}

export function WorksGrid({ works, highlightFirst = false }: { works: Work[]; highlightFirst?: boolean }) {
  if (works.length === 0) return <p className="empty">아직 등록된 작품이 없어요.</p>;
  return (
    <div className="work-grid">
      {works.map((w, i) => <WorkCard key={w.id} work={w} isNew={highlightFirst && i === 0} />)}
    </div>
  );
}
