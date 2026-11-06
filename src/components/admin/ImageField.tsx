"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

/** 이미지 칸: 파일을 Vercel Blob에 올리거나, 이미 있는 이미지 주소를 붙여 넣는다 */
export function ImageField({ id, value, onChange, folder, token }: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  token: () => Promise<string>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const blob = await upload(`${folder}/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        headers: { authorization: `Bearer ${await token()}` },
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onChange(blob.url);
    } catch (e) {
      setError(`업로드 실패: ${(e as Error).message}`);
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="admin-image">
      <div className="admin-image-preview" aria-hidden={!value}>
        {value ? <img src={value} alt="미리보기" /> : null}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <input id={id} className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="업로드하거나 이미지 주소를 붙여 넣기" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" className="btn-outline btn-small" onClick={() => fileRef.current?.click()} disabled={progress !== null}>
            {progress !== null ? `업로드 중 ${progress}%` : "파일 업로드"}
          </button>
          {value ? <button type="button" className="btn-ghost btn-small" onClick={() => onChange("")}>지우기</button> : null}
          <span className="muted" style={{ fontSize: 12 }}>PNG · JPG · WEBP · GIF, 10MB까지</span>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
      </div>
    </div>
  );
}
