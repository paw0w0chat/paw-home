import type { Metadata } from "next";
import Link from "next/link";
import { getTools, serial } from "@/lib/content";
import { asList } from "@/components/Blocks";
import { Barcode, Star } from "@/components/Ornaments";

export const metadata: Metadata = { title: "TOOLS" };
export const revalidate = 300;

export default async function ToolsPage() {
  const tools = await getTools();
  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>TEMPLATES · SHEETS · UTILITIES</span>
          <h1 className="display">TOOLS</h1>
        </div>
        <div className="page-count">ENTRIES<span className="display">{String(tools.length).padStart(2, "0")}</span></div>
      </section>

      {tools.length === 0 ? <p className="empty">아직 공개된 툴이 없어요.</p> : null}

      <div className="tool-grid" style={{ paddingTop: 32 }}>
        {tools.map((t) => (
          <Link key={t.id} href={`/tools/${t.id}`} className="persona-card tool-card">
            <div className="card-top">
              <span>{serial("T", t.order)}</span>
              <span>{asList(t.category)[0] ?? "TOOL"}</span>
            </div>
            <div className="tool-cover">
              {t.cover ? <img src={t.cover} alt="" loading="lazy" /> : <span aria-hidden="true">[미리보기]</span>}
            </div>
            <div className="card-name" style={{ gap: 8 }}>
              <span className="ko" style={{ fontSize: 20 }}>{t.title}</span>
              {t.summary ? <p className="work-tagline">{t.summary}</p> : null}
            </div>
            {asList(t.category).length > 1 ? (
              <div className="card-meta" style={{ alignItems: "flex-start" }}>
                <span className="pill-row">{asList(t.category).map((c) => <span key={c} className="pill">{c}</span>)}</span>
              </div>
            ) : null}
            <div className="card-foot">
              <Barcode width={84} height={20} />
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{t.file ? "DOWNLOAD" : "VIEW"} <Star size={14} /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
