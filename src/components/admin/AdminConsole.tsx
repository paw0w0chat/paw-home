"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { COLLECTIONS, getDb, PROFILE_DOC, type CollectionName } from "@/lib/firebase";
import { fromForm, SECTIONS, toForm, toSlug, type Field, type Section } from "@/lib/adminSchema";
import * as seed from "@/data/seed";
import type { Profile } from "@/lib/types";
import { ImageField } from "./ImageField";

type Row = { id: string; isPublic: boolean; order: number; [key: string]: unknown };
type Store = Record<CollectionName, Row[]>;
type SectionId = CollectionName | "profile";

const EMPTY: Store = { groups: [], personas: [], dreams: [], works: [], prompts: [] };
const byOrder = (rows: Row[]) => rows.slice().sort((a, b) => a.order - b.order);

export function AdminConsole({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [store, setStore] = useState<Store>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [sectionId, setSectionId] = useState<SectionId>("personas");
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState<{ text: string; kind: "ok" | "error"; key: number } | null>(null);

  /** 화면 아래 알림 (2.5초 뒤 사라짐) */
  const notify = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    const key = Date.now();
    setToast({ text, kind, key });
    window.setTimeout(() => setToast((t) => (t?.key === key ? null : t)), 2500);
  }, []);

  const token = useCallback(() => user.getIdToken(), [user]);

  const load = useCallback(async () => {
    const db = getDb();
    const entries = await Promise.all(
      COLLECTIONS.map(async (name) => {
        const snap = await getDocs(collection(db, name));
        return [name, byOrder(snap.docs.map((d) => ({ ...(d.data() as Omit<Row, "id">), id: d.id }) as Row))] as const;
      }),
    );
    setStore(Object.fromEntries(entries) as Store);
    setLoaded(true);
  }, []);

  useEffect(() => {
    load().catch((e) => setStatus(`불러오기 실패: ${e.message}`));
  }, [load]);

  /** 저장 후 사이트 캐시 갱신 */
  const publish = useCallback(async (message: string) => {
    notify(message);
    setStatus(`${message} · 사이트 반영 중…`);
    const res = await fetch("/api/revalidate", { method: "POST", headers: { authorization: `Bearer ${await token()}` } });
    setStatus(res.ok ? `${message} · 사이트에 반영됐어요` : `${message} · 사이트 반영 실패(잠시 후 자동 반영)`);
  }, [token, notify]);

  const isEmpty = loaded && COLLECTIONS.every((c) => store[c].length === 0);

  const importSeed = async () => {
    if (!window.confirm("기본 데이터(페르소나 14명, 드림 8쌍 등)를 데이터베이스에 넣을까요?")) return;
    setStatus("기본 데이터 넣는 중…");
    const db = getDb();
    const batch = writeBatch(db);
    const sets: [CollectionName, { id: string }[]][] = [
      ["groups", seed.groups], ["personas", seed.personas], ["dreams", seed.dreams], ["works", seed.works], ["prompts", seed.prompts],
    ];
    for (const [name, rows] of sets) {
      for (const { id, ...data } of rows) batch.set(doc(db, name, id), data);
    }
    batch.set(doc(db, ...PROFILE_DOC), seed.profile);
    await batch.commit();
    await load();
    await publish("기본 데이터를 가져왔습니다");
  };

  const section = SECTIONS.find((s) => s.id === sectionId);

  return (
    <div className="admin">
      <div className="admin-bar">
        <span className="mono" style={{ fontSize: 12 }}><b>ADMIN</b> · {user.email}</span>
        <span className="mono admin-status" aria-live="polite">{status}</span>
        <button type="button" className="btn-ghost" onClick={onLogout}>로그아웃</button>
      </div>

      <div className="admin-body">
        <nav className="admin-nav" aria-label="관리 메뉴">
          <span className="label" style={{ padding: "0 0 8px" }}>CONTENT</span>
          <NavButton active={sectionId === "profile"} en="PROFILE" ko="프로필" count={1} onClick={() => setSectionId("profile")} />
          {SECTIONS.map((s) => (
            <NavButton key={s.id} active={sectionId === s.id} en={s.en} ko={s.ko} count={store[s.id].length} onClick={() => setSectionId(s.id)} />
          ))}
        </nav>

        <div className="admin-main">
          {isEmpty ? (
            <div className="admin-callout">
              <p style={{ margin: 0 }}>데이터베이스가 비어 있어요. 지금 사이트에 보이는 기본 데이터를 가져와서 시작할 수 있어요.</p>
              <button type="button" className="btn-primary" onClick={importSeed}>기본 데이터 가져오기</button>
            </div>
          ) : null}

          {!loaded ? <p className="empty">불러오는 중…</p> : sectionId === "profile" ? (
            <ProfileEditor onSaved={publish} notify={notify} />
          ) : section ? (
            <CollectionEditor key={section.id} section={section} store={store} reload={load} publish={publish} notify={notify} token={token} />
          ) : null}
        </div>
      </div>

      {toast ? (
        <div key={toast.key} className={`admin-toast${toast.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      ) : null}
    </div>
  );
}

function NavButton({ active, en, ko, count, onClick }: { active: boolean; en: string; ko: string; count: number; onClick: () => void }) {
  return (
    <button type="button" className="admin-nav-btn" aria-pressed={active} onClick={onClick}>
      <span style={{ display: "flex", flexDirection: "column" }}>
        <span className="display" style={{ fontSize: 15, fontStretch: "112%", fontWeight: 800 }}>{en}</span>
        <span style={{ fontSize: 12 }}>{ko}</span>
      </span>
      <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{String(count).padStart(2, "0")}</span>
    </button>
  );
}

// ───────────────── 컬렉션 편집 ─────────────────

type Draft = { id: string; isNew: boolean; isPublic: boolean; order: string; values: Record<string, string> };

/**
 * 순서 끼워넣기: target 번호에 이미 항목이 있으면 그 항목을 +1,
 * 밀려난 자리에 또 항목이 있으면 그것도 +1 … 빈 번호를 만날 때까지만 민다.
 * (중간에 빈 번호가 있으면 그 뒤 항목은 건드리지 않는다)
 */
function shiftOrders(others: Row[], target: number): { id: string; order: number }[] {
  const sorted = others.filter((r) => r.order >= target).sort((a, b) => a.order - b.order);
  const changes: { id: string; order: number }[] = [];
  let next = target + 1;
  for (const r of sorted) {
    if (r.order >= next) break;
    changes.push({ id: r.id, order: next });
    next += 1;
  }
  return changes;
}

function emptyDraft(section: Section, rows: Row[]): Draft {
  const values: Record<string, string> = {};
  for (const f of section.fields) {
    values[f.key] = Array.isArray(f.options) ? f.options[0].value : "";
  }
  const nextOrder = rows.reduce((m, r) => Math.max(m, r.order), 0) + 1;
  return { id: "", isNew: true, isPublic: false, order: String(nextOrder), values };
}

function rowToDraft(section: Section, row: Row): Draft {
  const values: Record<string, string> = {};
  for (const f of section.fields) {
    let v = row[f.key];
    // 예전 단일 링크(url)를 새 링크 목록으로 옮겨서 보여준다
    if (f.type === "links" && v === undefined && typeof row.url === "string" && row.url) v = [{ label: "링크", url: row.url }];
    values[f.key] = toForm(f, v);
  }
  return { id: row.id, isNew: false, isPublic: row.isPublic, order: String(row.order), values };
}

function CollectionEditor({ section, store, reload, publish, notify, token }: {
  section: Section;
  store: Store;
  reload: () => Promise<void>;
  publish: (m: string) => Promise<void>;
  notify: (m: string, kind?: "ok" | "error") => void;
  token: () => Promise<string>;
}) {
  const rows = store[section.id];
  const [draft, setDraft] = useState<Draft>(() => (rows[0] ? rowToDraft(section, rows[0]) : emptyDraft(section, rows)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const optionsFor = useMemo(() => (f: Field) => {
    if (Array.isArray(f.options)) return f.options;
    const groups = store.groups;
    switch (f.options) {
      case "groups": return groups.map((g) => ({ value: g.id, label: `${g.type === "world" ? "세계관" : "작품"} · ${g.title}` }));
      case "groups:world": return groups.filter((g) => g.type === "world").map((g) => ({ value: g.id, label: String(g.title) }));
      case "groups:work": return groups.filter((g) => g.type === "work").map((g) => ({ value: g.id, label: String(g.title) }));
      case "personas": return store.personas.map((p) => ({ value: p.id, label: `${p.nameKo} (${p.codename})` }));
      default: return [];
    }
  }, [store]);

  const label = (row: Row, keys: string[]) => keys.map((k) => row[k]).filter(Boolean).join(" · ");

  const set = (key: string, value: string) => setDraft((d) => ({ ...d, values: { ...d.values, [key]: value } }));

  const save = async () => {
    setError("");
    const missing = section.fields.filter((f) => f.required && !draft.values[f.key]?.trim());
    if (missing.length) {
      notify("필수 항목을 채워주세요", "error");
      return setError(`필수 항목을 채워주세요: ${missing.map((f) => f.label).join(", ")}`);
    }

    let id = draft.id;
    if (draft.isNew) {
      id = section.customId ? toSlug(draft.id) : doc(collection(getDb(), section.id)).id;
      if (!id) return setError("주소용 ID(영문)를 입력해 주세요.");
      if (rows.some((r) => r.id === id)) return setError(`'${id}'는 이미 있는 ID예요.`);
    }

    const data: Record<string, unknown> = { isPublic: draft.isPublic, order: Number(draft.order) || 0 };
    for (const f of section.fields) data[f.key] = fromForm(f, draft.values[f.key] ?? "");

    setBusy(true);
    try {
      // 같은 순서 번호가 이미 있으면, 그 번호부터 이어진 항목들을 1씩 뒤로 민다
      const shifts = shiftOrders(rows.filter((r) => r.id !== id), data.order as number);
      const db = getDb();
      const batch = writeBatch(db);
      batch.set(doc(db, section.id, id), data);
      for (const sh of shifts) batch.update(doc(db, section.id, sh.id), { order: sh.order });
      await batch.commit();
      await reload();
      setDraft((d) => ({ ...d, id, isNew: false }));
      await publish(shifts.length ? `저장되었습니다 · ${shifts.length}개 항목 순서가 1씩 밀렸어요` : "저장되었습니다");
    } catch (e) {
      notify("저장하지 못했어요", "error");
      setError(`저장 실패: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (draft.isNew) return setDraft(emptyDraft(section, rows));
    if (!window.confirm("정말 삭제할까요? 되돌릴 수 없어요.")) return;
    setBusy(true);
    try {
      await deleteDoc(doc(getDb(), section.id, draft.id));
      await reload();
      setDraft(emptyDraft(section, rows.filter((r) => r.id !== draft.id)));
      await publish("삭제되었습니다");
    } finally {
      setBusy(false);
    }
  };

  const togglePublic = async (row: Row) => {
    await updateDoc(doc(getDb(), section.id, row.id), { isPublic: !row.isPublic });
    await reload();
    if (row.id === draft.id) setDraft((d) => ({ ...d, isPublic: !row.isPublic }));
    await publish(`${label(row, section.titleKeys)} — ${row.isPublic ? "비공개" : "공개"}로 바뀌었습니다`);
  };

  return (
    <>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="label">{section.code} — {section.ko} 관리</span>
          <h1 className="display" style={{ margin: 0, fontSize: "clamp(36px, 4vw, 56px)" }}>{section.en}</h1>
        </div>
        <button type="button" className="btn-outline" onClick={() => { setError(""); setDraft(emptyDraft(section, rows)); }}>+ 새로 추가</button>
      </div>

      <div className="admin-split">
        <div className="admin-list">
          <div className="card-top"><span>ENTRY</span><span>VISIBILITY</span></div>
          {rows.length === 0 ? <p className="empty" style={{ padding: 14 }}>아직 항목이 없어요.</p> : null}
          {rows.map((row) => (
            <div key={row.id} className="admin-row" data-selected={row.id === draft.id && !draft.isNew}>
              <button type="button" className="admin-row-main" onClick={() => { setError(""); setDraft(rowToDraft(section, row)); }}>
                <span className="mono muted" style={{ fontSize: 11, width: 36, flex: "none" }}>{String(row.order).padStart(3, "0")}</span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{label(row, section.titleKeys) || "(제목 없음)"}</span>
                  <span className="muted" style={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label(row, section.subKeys)}</span>
                </span>
              </button>
              <button type="button" className="admin-pill" aria-pressed={row.isPublic} aria-label={`${label(row, section.titleKeys)} 공개 여부`} onClick={() => togglePublic(row)}>
                {row.isPublic ? "공개" : "비공개"}
              </button>
            </div>
          ))}
        </div>

        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <div className="card-top dark"><span>{draft.isNew ? "NEW" : "EDIT"}</span><span>{draft.isNew ? "새 항목" : draft.id}</span></div>
          <div className="admin-fields">
            {draft.isNew && section.customId ? (
              <FormRow id="f-id" label="주소용 ID (영문 소문자)" hint={section.id === "personas" ? `사이트 주소가 /personas/${toSlug(draft.id) || "id"} 가 돼요` : "다른 항목에서 이 분류를 가리킬 때 쓰여요"}>
                <input id="f-id" className="admin-input" value={draft.id} onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))} placeholder="danjam" />
              </FormRow>
            ) : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <FormRow id="f-order" label="정렬 순서" hint="숫자가 클수록 최신 · 이미 있는 번호를 넣으면 기존 항목이 1씩 뒤로 밀려요">
                <input id="f-order" className="admin-input" type="number" value={draft.order} onChange={(e) => setDraft((d) => ({ ...d, order: e.target.value }))} style={{ width: 120 }} />
              </FormRow>
              <FormRow id="f-public" label="공개 여부">
                <label style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 44 }}>
                  <input id="f-public" type="checkbox" checked={draft.isPublic} onChange={(e) => setDraft((d) => ({ ...d, isPublic: e.target.checked }))} style={{ width: 20, height: 20 }} />
                  사이트에 공개
                </label>
              </FormRow>
            </div>

            {section.fields.map((f) => (
              <FormRow key={f.key} id={`f-${f.key}`} label={`${f.label}${f.required ? " *" : ""}`} hint={f.hint}>
                {f.type === "select" ? (
                  <select id={`f-${f.key}`} className="admin-input" value={draft.values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                    {!f.required || !Array.isArray(f.options) ? <option value="">— 선택 —</option> : null}
                    {optionsFor(f).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === "image" ? (
                  <ImageField id={`f-${f.key}`} value={draft.values[f.key] ?? ""} onChange={(v) => set(f.key, v)} folder={section.id} token={token} />
                ) : f.type === "textarea" || f.type === "stats" || f.type === "links" ? (
                  <textarea
                    id={`f-${f.key}`}
                    className={`admin-input${f.type === "links" ? " admin-input-links" : ""}`}
                    rows={f.type === "textarea" ? 4 : 5}
                    value={draft.values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    spellCheck={f.type === "links" ? false : undefined}
                  />
                ) : (
                  <input id={`f-${f.key}`} className="admin-input" value={draft.values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
                )}
              </FormRow>
            ))}
            {error ? <p className="admin-error">{error}</p> : null}
          </div>
          <div className="admin-actions">
            <button type="button" className="btn-ghost" onClick={remove} disabled={busy}>{draft.isNew ? "비우기" : "삭제"}</button>
            <button type="submit" className="btn-primary" disabled={busy}>{busy ? "저장 중…" : "저장"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

function FormRow({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} className="mono" style={{ fontSize: 11, fontWeight: 700 }}>{label}</label>
      {children}
      {hint ? <span className="muted" style={{ fontSize: 12 }}>{hint}</span> : null}
    </div>
  );
}

// ───────────────── 프로필 편집 ─────────────────

function ProfileEditor({ onSaved, notify }: { onSaved: (m: string) => Promise<void>; notify: (m: string, kind?: "ok" | "error") => void }) {
  const [intro, setIntro] = useState("");
  const [careers, setCareers] = useState("");
  const [links, setLinks] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(getDb(), ...PROFILE_DOC)).then((snap) => {
      const p = (snap.data() ?? seed.profile) as Profile;
      setIntro(p.intro ?? "");
      setCareers((p.careers ?? []).map((c) => `${c.title}: ${c.body}`).join("\n"));
      setLinks((p.links ?? []).map((l) => `${l.label} | ${l.url}`).join("\n"));
    });
  }, []);

  const save = async () => {
    setBusy(true);
    const profile: Profile = {
      intro: intro.trim(),
      careers: careers.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const i = l.indexOf(":");
        return i < 0 ? { title: l, body: "" } : { title: l.slice(0, i).trim(), body: l.slice(i + 1).trim() };
      }),
      links: links.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const [label, url] = l.split("|").map((s) => s.trim());
        return { label, url: url ?? "" };
      }),
    };
    try {
      await setDoc(doc(getDb(), ...PROFILE_DOC), profile);
      await onSaved("저장되었습니다");
    } catch (e) {
      notify(`저장하지 못했어요: ${(e as Error).message}`, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="section-head" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="label">C-01 — 프로필 관리</span>
          <h1 className="display" style={{ margin: 0, fontSize: "clamp(36px, 4vw, 56px)" }}>PROFILE</h1>
        </div>
      </div>
      <form className="admin-form" style={{ maxWidth: 760 }} onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="admin-fields">
          <FormRow id="p-intro" label="소개 문구" hint="홈 검은 띠와 프로필 페이지에 나와요">
            <textarea id="p-intro" className="admin-input" rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} />
          </FormRow>
          <FormRow id="p-careers" label="경력" hint="한 줄에 하나씩 `제목: 내용`">
            <textarea id="p-careers" className="admin-input" rows={6} value={careers} onChange={(e) => setCareers(e.target.value)} placeholder="게임 내러티브: 시나리오 기획 · 집필" />
          </FormRow>
          <FormRow id="p-links" label="연락처 · SNS" hint="한 줄에 하나씩 `이름 | 주소`">
            <textarea id="p-links" className="admin-input" rows={4} value={links} onChange={(e) => setLinks(e.target.value)} placeholder="X | https://x.com/..." />
          </FormRow>
        </div>
        <div className="admin-actions">
          <span />
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "저장 중…" : "저장"}</button>
        </div>
      </form>
    </>
  );
}
