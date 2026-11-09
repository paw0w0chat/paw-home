import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/content";
import type { ProfileSection } from "@/lib/types";
import { Barcode, Star } from "@/components/Ornaments";

// 관리자 저장 시 즉시 갱신되고, 그 외에는 5분마다 다시 읽는다
export const revalidate = 300;

export const metadata: Metadata = { title: "PROFILE" };

/** "태그 | 본문 | 뱃지1, 뱃지2" 한 줄을 나눈다 */
function parse(line: string) {
  const parts = line.split("|").map((p) => p.trim());
  if (parts.length === 1) return { tag: "", text: parts[0], badges: [] as string[] };
  return {
    tag: parts[0],
    text: parts[1] ?? "",
    badges: (parts[2] ?? "").split(",").map((b) => b.trim()).filter(Boolean),
  };
}

const isHttp = (u: string) => /^https?:\/\//i.test(u);

function Badge({ text }: { text: string }) {
  const strong = /OPEN|오픈/i.test(text);
  return <span className={`info-badge${strong ? " is-strong" : ""}`}>{text}</span>;
}

function SectionBody({ s }: { s: ProfileSection }) {
  const rows = s.items.filter((i) => i.trim()).map(parse);

  if (s.kind === "pills") {
    return (
      <div className="info-pills">
        {rows.map((r) => {
          const soft = /^가끔\s/.test(r.text);
          return (
            <span key={r.text} className={`info-pill${soft ? " is-soft" : ""}`}>
              {soft ? <><small>가끔</small>{r.text.replace(/^가끔\s/, "")}</> : r.text}
            </span>
          );
        })}
      </div>
    );
  }

  if (s.kind === "grid") {
    return (
      <div className="info-grid">
        {rows.map((r, i) => (
          <div key={r.text + i} className="info-grid-item">
            <span><b aria-hidden="true">+</b> {r.text}</span>
            <small>L{i + 1}</small>
          </div>
        ))}
      </div>
    );
  }

  if (s.kind === "statement") {
    const [first, ...rest] = rows;
    return (
      <div className="info-statement">
        {first ? (
          <p className="info-lead">
            {first.tag || first.text}
            {first.badges.map((b) => <Badge key={b} text={b} />)}
          </p>
        ) : null}
        <ul className="info-rows plain">
          {rest.map((r, i) => (
            <li key={i}>
              {r.tag ? <span className="info-tag outline">{r.tag}</span> : null}
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (s.kind === "warn") {
    return (
      <ul className="info-rows warn">
        {rows.map((r, i) => (
          <li key={i}>
            <span className="info-mark">[{r.tag || "X"}]</span>
            <span>{r.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  // list
  return (
    <ul className="info-rows">
      {rows.map((r, i) => (
        <li key={i}>
          {r.tag ? <span className="info-tag">{r.tag}</span> : null}
          <span className="info-text">{r.text}</span>
          {r.badges.map((b) => <Badge key={b} text={b} />)}
        </li>
      ))}
    </ul>
  );
}

export default async function ProfilePage() {
  const p = await getProfile();
  const sections = (p.sections ?? []).filter((s) => s.title || s.items?.length);
  const links = (p.links ?? []).filter((l) => isHttp(l.url));

  return (
    <div className="container">
      {/* 닉네임 */}
      <section className="info-hero">
        <div className="info-hero-main">
          <span className="info-no"><b>/01</b> 닉네임 <small>NICKNAME</small></span>
          <div className="info-name">
            <span className="info-nick">{p.nickname || "PAWCAT"}</span>
            {p.handle ? (
              <span className="info-handle">
                <span aria-hidden="true">»»»</span> {p.handle}
                {p.subline ? <small>{p.subline}</small> : null}
              </span>
            ) : null}
          </div>
          {p.tagline ? <p className="info-tagline">{p.tagline}</p> : null}
          {p.intro ? <p className="info-intro">{p.intro}</p> : null}
        </div>
        <aside className="info-card" aria-label="요약">
          <div className="card-top dark"><span>ID CARD</span><span>VOL.01</span></div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <Barcode width="100%" height={40} />
            <dl className="info-dl">
              <div><dt>ID</dt><dd>{p.nickname || "PAWCAT"}</dd></div>
              {p.subline ? <div><dt>FIELD</dt><dd>{p.subline}</dd></div> : null}
              <div><dt>NODE</dt><dd>AI_CHAT</dd></div>
            </dl>
            {links.length ? (
              <div className="info-links">
                {links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="work-link">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
      </section>

      {/* 섹션들 */}
      <div className="info-sections">
        {sections.map((s, i) => (
          <section key={s.title + i} className={`info-sec kind-${s.kind}`}>
            <div className="info-sec-head">
              <span className="info-no">
                <b>/{String(i + 2).padStart(2, "0")}</b> {s.title} <small>{s.en}</small>
              </span>
              {s.kind === "warn" ? <Star size={16} /> : <span className="info-rule" />}
            </div>
            <SectionBody s={s} />
            {s.note ? <p className="info-note"><span aria-hidden="true">&gt;&gt;</span> {s.note}</p> : null}
            {s.en === "DREAM" ? (
              <Link href="/dreams" className="more-link" style={{ alignSelf: "flex-end" }}>DREAM 전체 보기 →</Link>
            ) : null}
          </section>
        ))}
      </div>

      {p.careers?.length ? (
        <section className="section">
          <div className="section-head">
            <h2 className="display">CAREER<span className="slash">//</span>경력</h2>
          </div>
          <ul className="info-rows">
            {p.careers.map((c) => (
              <li key={c.title}>
                <span className="info-tag">{c.title}</span>
                <span className="info-text">{c.body}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
