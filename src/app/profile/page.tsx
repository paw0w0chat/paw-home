import type { Metadata } from "next";
import { getProfile } from "@/lib/content";

// 관리자 저장 시 즉시 갱신되고, 그 외에는 5분마다 다시 읽는다
export const revalidate = 300;

export const metadata: Metadata = { title: "PROFILE" };

export default async function ProfilePage() {
  const profile = await getProfile();
  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>ABOUT</span>
          <h1 className="display">PROFILE</h1>
        </div>
      </section>
      <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 720, paddingTop: 24 }}>{profile.intro}</p>
      {profile.careers.length === 0 && profile.links.length === 0 ? (
        <p className="empty">경력과 연락처는 관리자 페이지에서 채울 예정이에요.</p>
      ) : null}
      {profile.careers.map((c) => (
        <div key={c.title} className="card-meta" style={{ padding: "16px 0" }}>
          <span className="label" style={{ width: 200 }}>{c.title}</span>
          <span>{c.body}</span>
        </div>
      ))}
    </div>
  );
}
