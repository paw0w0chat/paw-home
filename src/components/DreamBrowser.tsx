"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dream, DreamStatus, Group, Persona } from "@/lib/types";
import { GroupHead } from "./Blocks";
import { Star } from "./Ornaments";

const LABEL: Record<DreamStatus, string> = { dating: "연애 중", chasing: "공략 중", ongoing: "진행 중", open: "OPEN" };
const FILTERS: (DreamStatus | "all")[] = ["all", "dating", "chasing", "ongoing", "open"];

export function DreamBrowser({ dreams, groups, personas }: { dreams: Dream[]; groups: Group[]; personas: Persona[] }) {
  const [filter, setFilter] = useState<DreamStatus | "all">("all");
  const personaOf = (id: string) => personas.find((p) => p.id === id);
  const shown = dreams.filter((d) => filter === "all" || d.status === filter);

  // 드림이 연결된 분류만, groups 순서대로
  const grouped = groups
    .map((g) => ({ group: g, items: shown.filter((d) => d.groupId === g.id) }))
    .filter((g) => g.items.length > 0);

  let n = 0;
  return (
    <>
      <div className="chips" role="group" aria-label="상태 필터" style={{ padding: "20px 0 8px" }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "전체" : LABEL[f]}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? <p className="empty">해당하는 드림이 없어요.</p> : null}

      {grouped.map(({ group, items }, gi) => (
        <section className="group" key={group.id} style={{ paddingTop: 44 }}>
          <GroupHead code={`S-${String(gi + 1).padStart(2, "0")}`} group={group} count={items.length} unit="PAIRS" />
          <div className="dream-grid">
            {items.map((d) => {
              n += 1;
              const persona = personaOf(d.personaId);
              return (
                <article className="dream-card" key={d.id}>
                  <div className="card-top" style={{ alignItems: "center" }}>
                    <span>{`D-${String(n).padStart(3, "0")}`}</span>
                    <span className={`tag${d.status === "dating" ? " tag-signal" : ""}`}>{LABEL[d.status]}</span>
                  </div>
                  <div className="dream-pair">
                    <div className="dream-thumb">
                      {d.characterImage ? <img src={d.characterImage} alt={d.characterKo} /> : "CHAR"}
                    </div>
                    <Star size={22} />
                    <div className="dream-thumb" style={{ background: "repeating-linear-gradient(45deg, var(--paper) 0 8px, var(--offwhite) 8px 16px)" }}>
                      {persona?.headImage ? <img src={persona.headImage} alt={persona.nameKo} /> : "ME"}
                    </div>
                  </div>
                  <div className="card-name" style={{ paddingTop: 0 }}>
                    <span className="display" style={{ fontSize: 28 }}>{d.characterEn}</span>
                    <span className="ko" style={{ fontSize: 17 }}>{d.characterKo} × {persona?.nameKo ?? ""}</span>
                  </div>
                  <div className="card-meta" style={{ fontSize: 14, lineHeight: 1.6, padding: "10px 14px" }}>
                    <span className="label" style={{ width: 48 }}>NOTE</span>
                    <span>{d.note}</span>
                  </div>
                  <div className="card-foot" style={{ padding: "8px 8px 8px 14px", flexWrap: "wrap", gap: 8 }}>
                    <span />
                    {persona ? (
                      <Link href={`/personas/${persona.id}`} style={{ minHeight: 44, display: "flex", alignItems: "center", padding: "0 10px" }}>PERSONA →</Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
