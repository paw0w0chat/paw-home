"use client";

import { useState } from "react";
import type { Group, Persona } from "@/lib/types";
import { GroupHead, PersonaCard } from "./Blocks";

type View = "world" | "work";

export function PersonaBrowser({ personas, worlds, works }: { personas: Persona[]; worlds: Group[]; works: Group[] }) {
  const [view, setView] = useState<View>("world");
  const defs = view === "world" ? worlds : works;
  const key = view === "world" ? "worldId" : "workId";
  const worldOf = (id: string) => worlds.find((w) => w.id === id);

  const groups = defs
    .map((g) => ({ group: g, items: personas.filter((p) => p[key] === g.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="보기 방식">
          <button type="button" aria-pressed={view === "world"} onClick={() => setView("world")}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 500 }}>A</span>세계관별
          </button>
          <button type="button" aria-pressed={view === "work"} onClick={() => setView("work")}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 500 }}>B</span>작품별
          </button>
        </div>
        <span className="mono muted" style={{ fontSize: 12 }}>
          SORTED BY {view === "world" ? "WORLD" : "WORK"} — {groups.length} GROUPS
        </span>
      </div>

      {groups.map(({ group, items }, i) => (
        <section className="group" key={group.id}>
          <GroupHead
            code={`${view === "world" ? "W" : "S"}-${String(i + 1).padStart(2, "0")}`}
            group={group}
            count={items.length}
            unit="ENTRIES"
          />
          <div className="card-grid">
            {items.map((p) => (
              <PersonaCard key={p.id} persona={p} world={worldOf(p.worldId)} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
