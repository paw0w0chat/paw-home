import type { Metadata } from "next";

export const metadata: Metadata = { title: "PROMPTS" };

export default function PromptsPage() {
  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>CHARACTER · IMAGE · SYSTEM</span>
          <h1 className="display">PROMPTS</h1>
        </div>
      </section>
      <p className="empty">프롬프트 라이브러리는 관리자 페이지와 함께 열려요.</p>
    </div>
  );
}
