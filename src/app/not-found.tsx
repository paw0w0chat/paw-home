import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>ERROR</span>
          <h1 className="display">404</h1>
        </div>
      </section>
      <p className="empty">찾는 페이지가 없어요. <Link href="/">홈으로 →</Link></p>
    </div>
  );
}
