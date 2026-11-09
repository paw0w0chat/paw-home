"use client";

import { useRef, useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";

const ACCEPT = {
  image: "image/png,image/jpeg,image/webp,image/gif",
  file: "image/png,image/jpeg,image/webp,image/gif,application/pdf,application/zip,application/x-zip-compressed,.zip",
};

/** 이미지(또는 첨부 파일) 칸: Vercel Blob에 올리거나, 이미 있는 주소를 붙여 넣는다 */
export function ImageField({ id, value, onChange, folder, token, kind = "image" }: {
  id: string;
  kind?: "image" | "file";
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
      // 추측할 수 없는 파일 이름: 원래 이름 + 무작위 문자열
      const dot = file.name.lastIndexOf(".");
      const base = (dot > 0 ? file.name.slice(0, dot) : file.name).replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 40) || "image";
      const ext = dot > 0 ? file.name.slice(dot).toLowerCase() : "";
      const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const blob = await uploadPresigned(`${folder}/${base}-${rand}${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        headers: { authorization: `Bearer ${await token()}` },
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
        // .zip은 브라우저가 형식을 비워 보내는 경우가 있어 직접 지정
        ...(ext === ".zip" && !file.type ? { contentType: "application/zip" } : {}),
      });
      onChange(blob.url);
    } catch (e) {
      setError(`업로드 실패: ${(e as Error).message}`);
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const isImageUrl = /\.(png|jpe?g|webp|gif)(\?|$)/i.test(value) || kind === "image";
  const ext = value.split("?")[0].split(".").pop()?.toUpperCase() ?? "";

  return (
    <div className="admin-image">
      <div className="admin-image-preview" aria-hidden={!value}>
        {value && isImageUrl ? <img src={value} alt="미리보기" /> : null}
        {value && !isImageUrl ? <span className="mono" style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{ext || "FILE"}</span> : null}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <input id={id} className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "file" ? "업로드하거나 파일 주소를 붙여 넣기" : "업로드하거나 이미지 주소를 붙여 넣기"} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input ref={fileRef} type="file" accept={ACCEPT[kind]} hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" className="btn-outline btn-small" onClick={() => fileRef.current?.click()} disabled={progress !== null}>
            {progress !== null ? `업로드 중 ${progress}%` : "파일 업로드"}
          </button>
          {value ? <button type="button" className="btn-ghost btn-small" onClick={() => onChange("")}>지우기</button> : null}
          <span className="muted" style={{ fontSize: 12 }}>{kind === "file" ? "PNG · JPG · PDF · ZIP, 30MB까지" : "PNG · JPG · WEBP · GIF, 10MB까지"}</span>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
      </div>
    </div>
  );
}
