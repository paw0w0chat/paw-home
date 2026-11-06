import type { Metadata } from "next";
import { getWorks } from "@/lib/content";
import { WorksTable } from "@/components/Blocks";

// 관리자 저장 시 즉시 갱신되고, 그 외에는 5분마다 다시 읽는다
export const revalidate = 300;

export const metadata: Metadata = { title: "WORKS" };

export default async function WorksPage() {
  const works = await getWorks();
  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>AI CHAT — RELEASED</span>
          <h1 className="display">WORKS</h1>
        </div>
        <div className="page-count">TITLES<span className="display">{String(works.length).padStart(2, "0")}</span></div>
      </section>
      <div style={{ paddingTop: 24 }}>
        <WorksTable works={works} highlightFirst />
      </div>
    </div>
  );
}
