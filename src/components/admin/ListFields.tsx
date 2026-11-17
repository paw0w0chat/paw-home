"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/uploadClient";
import type { GalleryImage, Song } from "@/lib/types";
import { ImageField } from "./ImageField";

/** 폼은 문자열(JSON)로 값을 들고 있으므로 여기서 풀고 다시 묶는다 */
function useJsonList<T>(value: string, onChange: (v: string) => void) {
  let list: T[] = [];
  try {
    const v = JSON.parse(value || "[]");
    if (Array.isArray(v)) list = v;
  } catch {
    list = [];
  }
  const set = (next: T[]) => onChange(JSON.stringify(next));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = list.slice();
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };
  const patch = (i: number, p: Partial<T>) => set(list.map((x, k) => (k === i ? { ...x, ...p } : x)));
  const remove = (i: number) => set(list.filter((_, k) => k !== i));
  return { list, set, move, patch, remove };
}

function RowTools({ i, n, move, remove }: { i: number; n: number; move: (i: number, d: -1 | 1) => void; remove: (i: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      <button type="button" className="btn-ghost btn-small" onClick={() => move(i, -1)} disabled={i === 0} aria-label="앞으로">↑</button>
      <button type="button" className="btn-ghost btn-small" onClick={() => move(i, 1)} disabled={i === n - 1} aria-label="뒤로">↓</button>
      <button type="button" className="btn-ghost btn-small" onClick={() => remove(i)}>삭제</button>
    </div>
  );
}

/** 갤러리: 여러 장 한 번에 올리기 + 설명 + 순서 */
export function GalleryField({ id, value, onChange, folder, token }: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  token: () => Promise<string>;
}) {
  const { list, set, move, patch, remove } = useJsonList<GalleryImage>(value, onChange);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    let next = list.slice();
    const arr = Array.from(files);
    for (let k = 0; k < arr.length; k++) {
      setStatus(`업로드 중 ${k + 1}/${arr.length}…`);
      try {
        const url = await uploadFile(arr[k], `${folder}/gallery`, token, (p) => setStatus(`업로드 중 ${k + 1}/${arr.length} · ${p}%`));
        next = [...next, { url, caption: "" }];
        set(next);
      } catch (e) {
        setStatus(`${arr[k].name} 업로드 실패: ${(e as Error).message}`);
        return;
      }
    }
    setStatus("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="list-field" id={id}>
      {list.length === 0 ? <p className="muted" style={{ margin: 0, fontSize: 13 }}>아직 이미지가 없어요.</p> : null}
      {list.map((g, i) => (
        <div key={g.url + i} className="list-row">
          <div className="admin-image-preview" style={{ width: 88, height: 88 }}>
            {g.url ? <img src={g.url} alt="" /> : null}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="mono muted" style={{ fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
            <input className="admin-input" value={g.caption ?? ""} onChange={(e) => patch(i, { caption: e.target.value })} placeholder="설명 (선택)" aria-label={`${i + 1}번 이미지 설명`} />
            <RowTools i={i} n={list.length} move={move} remove={remove} />
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        <button type="button" className="btn-outline btn-small" onClick={() => fileRef.current?.click()} disabled={!!status && status.startsWith("업로드 중")}>+ 이미지 추가 (여러 장 가능)</button>
        <button
          type="button"
          className="btn-ghost btn-small"
          onClick={() => {
            const url = window.prompt("이미지 주소를 붙여 넣어 주세요");
            if (url && /^https?:\/\//i.test(url.trim())) set([...list, { url: url.trim(), caption: "" }]);
          }}
        >
          주소로 추가
        </button>
        {status ? <span className="muted" style={{ fontSize: 12 }} aria-live="polite">{status}</span> : null}
      </div>
    </div>
  );
}

/** 테마곡: 곡마다 제목 · 음원 파일 · Suno 링크 · 메모 · 커버 */
export function SongsField({ id, value, onChange, folder, token }: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  token: () => Promise<string>;
}) {
  const { list, set, move, patch, remove } = useJsonList<Song>(value, onChange);
  return (
    <div className="list-field" id={id}>
      {list.length === 0 ? <p className="muted" style={{ margin: 0, fontSize: 13 }}>아직 테마곡이 없어요.</p> : null}
      {list.map((s, i) => (
        <fieldset key={i} className="admin-sec">
          <legend className="mono">TRACK {String(i + 1).padStart(2, "0")}</legend>
          <input className="admin-input" value={s.title ?? ""} onChange={(e) => patch(i, { title: e.target.value })} placeholder="곡 제목" aria-label={`${i + 1}번 곡 제목`} />
          <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>음원 파일</span>
          <ImageField id={`${id}-a${i}`} kind="audio" value={s.url ?? ""} onChange={(v) => patch(i, { url: v })} folder={`${folder}/audio`} token={token} />
          <input className="admin-input admin-input-links" value={s.link ?? ""} onChange={(e) => patch(i, { link: e.target.value })} placeholder="Suno 등 외부 링크 (선택)" aria-label={`${i + 1}번 곡 링크`} />
          <textarea className="admin-input" rows={2} value={s.note ?? ""} onChange={(e) => patch(i, { note: e.target.value })} placeholder="곡 소개 · 가사 한 줄 (선택)" aria-label={`${i + 1}번 곡 메모`} />
          <span className="mono" style={{ fontSize: 11, fontWeight: 700 }}>커버 이미지 (선택, 없으면 두상)</span>
          <ImageField id={`${id}-c${i}`} value={s.cover ?? ""} onChange={(v) => patch(i, { cover: v })} folder={folder} token={token} />
          <RowTools i={i} n={list.length} move={move} remove={remove} />
        </fieldset>
      ))}
      <button type="button" className="btn-outline btn-small" onClick={() => set([...list, { title: "", url: "", link: "", note: "", cover: "" }])}>+ 곡 추가</button>
    </div>
  );
}
