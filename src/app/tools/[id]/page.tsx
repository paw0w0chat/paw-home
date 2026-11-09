import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTool, getTools, serial } from "@/lib/content";
import { asList, Pills } from "@/components/Blocks";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await getTools()).map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTool((await params).id);
  return { title: t ? t.title : "TOOL" };
}

const isHttp = (u?: string) => !!u && /^https?:\/\//i.test(u);

export default async function ToolDetailPage({ params }: Props) {
  const tool = await getTool((await params).id);
  if (!tool) notFound();

  const links = (tool.links ?? []).filter((l) => isHttp(l.url));
  const fileName = tool.file ? decodeURIComponent(tool.file.split("?")[0].split("/").pop() ?? "") : "";
  const fileExt = fileName.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <div className="container">
      <nav className="crumbs" aria-label="경로">
        <Link href="/tools">← TOOLS</Link>
        <span className="muted">/ {tool.title}</span>
      </nav>

      <section className="detail">
        <figure className="img-frame" style={{ flex: "1.4 1 480px" }}>
          <div className="card-top"><span>PREVIEW</span><span>{serial("T", tool.order)}</span></div>
          <div className="tool-preview">
            {tool.cover ? <img src={tool.cover} alt={`${tool.title} 미리보기`} /> : <span>[미리보기 이미지]</span>}
          </div>
        </figure>

        <div className="detail-info" style={{ flex: "1 1 360px" }}>
          <div className="detail-name">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="tag tag-solid">{serial("T", tool.order)}</span>
            </div>
            <h1 style={{ margin: "8px 0 0", fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.15 }}>{tool.title}</h1>
            {tool.summary ? <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>{tool.summary}</p> : null}
          </div>

          {asList(tool.category).length ? (
            <div className="card-meta" style={{ padding: 0, borderTop: 0, alignItems: "center" }}>
              <span className="label">CATEGORY</span>
              <Pills items={asList(tool.category)} />
            </div>
          ) : null}

          {isHttp(tool.file) || links.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {isHttp(tool.file) ? (
                <a href={tool.file} download className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  ↓ 다운로드 <span style={{ fontWeight: 500 }}>({fileExt})</span>
                </a>
              ) : null}
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="work-link" style={{ minHeight: 48, padding: "0 16px" }}>
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : null}

          {tool.body ? (
            <div className="note-box" style={{ background: "var(--offwhite)", flex: "none" }}>
              <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>HOW TO USE · RULES</span>
              <p style={{ whiteSpace: "pre-line" }}>{tool.body}</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
