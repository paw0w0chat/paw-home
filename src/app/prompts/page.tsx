import type { Metadata } from "next";
import { getPersonas, getPrompts } from "@/lib/content";
import { CopyButton } from "@/components/CopyButton";
import type { PromptCategory } from "@/lib/types";

export const metadata: Metadata = { title: "PROMPTS" };
export const revalidate = 300;

const CATEGORIES: PromptCategory[] = ["CHARACTER", "IMAGE", "SYSTEM"];

export default async function PromptsPage() {
  const [prompts, personas] = await Promise.all([getPrompts(), getPersonas()]);
  const personaName = (id?: string) => personas.find((p) => p.id === id)?.nameKo;

  return (
    <div className="container">
      <section className="page-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label" style={{ fontSize: 12 }}>CHARACTER · IMAGE · SYSTEM</span>
          <h1 className="display">PROMPTS</h1>
        </div>
        <div className="page-count">ENTRIES<span className="display">{String(prompts.length).padStart(2, "0")}</span></div>
      </section>

      {prompts.length === 0 ? <p className="empty">아직 공개된 프롬프트가 없어요.</p> : null}

      {CATEGORIES.map((cat) => {
        const items = prompts.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        return (
          <section className="group" key={cat}>
            <div className="section-head" style={{ marginBottom: 16 }}>
              <h2 className="display" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>{cat}</h2>
              <span className="mono muted" style={{ fontSize: 12 }}>{String(items.length).padStart(2, "0")} ENTRIES</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((p) => (
                <article className="sheet" key={p.id} style={{ flex: "none" }}>
                  <div className="sheet-head">
                    <span style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 15 }}>{p.title}</span>
                      {personaName(p.personaId) ? <span className="pill">{personaName(p.personaId)}</span> : null}
                    </span>
                    <CopyButton text={p.body} />
                  </div>
                  <pre style={{ minHeight: 0 }}>{p.body}</pre>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
