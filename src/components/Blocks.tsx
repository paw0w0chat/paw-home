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

function WorkThumb({ work }: { work: Work }) {
  const img = work.thumbnail ? (
    <img src={work.thumbnail} alt="" loading="lazy" />
  ) : (
    <span aria-hidden="true">NO IMG</span>
  );
  return work.url ? (
    <a href={work.url} target="_blank" rel="noreferrer" className="work-thumb" aria-label={`${work.title} 열기`}>{img}</a>
  ) : (
    <span className="work-thumb">{img}</span>
  );
}

export function WorksTable({ works, highlightFirst = false }: { works: Work[]; highlightFirst?: boolean }) {
  if (works.length === 0) return <p className="empty">아직 등록된 작품이 없어요.</p>;
  return (
    <div className="table-wrap">
      <table className="spec-table">
        <thead>
          <tr>
            <th style={{ width: 64 }}>NO.</th>
            <th style={{ width: 88 }}><span className="sr-only">썸네일</span></th>
            <th>TITLE</th>
            <th>GENRE</th>
            <th>PLATFORM</th>
            <th className="right">RELEASED</th>
          </tr>
        </thead>
        <tbody>
          {works.map((w, i) => (
            <tr key={w.id}>
              <td className="num">{`W-${String(w.order).padStart(2, "0")}`}</td>
              <td style={{ paddingTop: 12, paddingBottom: 12 }}>
                <WorkThumb work={w} />
              </td>
              <td className="title">
                <span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {w.url ? <a href={w.url} target="_blank" rel="noreferrer">{w.title}</a> : w.title}
                  {highlightFirst && i === 0 ? <span className="tag tag-signal" style={{ border: 0 }}>NEW</span> : null}
                </span>
              </td>
              <td>{w.genre}</td>
              <td>{w.platform}</td>
              <td className="right num">{w.releasedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
