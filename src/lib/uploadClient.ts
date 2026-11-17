"use client";

import { uploadPresigned } from "@vercel/blob/client";

// 확장자 → 형식 (브라우저가 형식을 비워 보내는 파일 대비)
const TYPES: Record<string, string> = {
  ".zip": "application/zip",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

/** 관리자 업로드: 추측할 수 없는 파일 이름으로 Vercel Blob에 올리고 주소를 돌려준다 */
export async function uploadFile(
  file: File,
  folder: string,
  token: () => Promise<string>,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const dot = file.name.lastIndexOf(".");
  const base = (dot > 0 ? file.name.slice(0, dot) : file.name).replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 40) || "file";
  const ext = dot > 0 ? file.name.slice(dot).toLowerCase() : "";
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const blob = await uploadPresigned(`${folder}/${base}-${rand}${ext}`, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    headers: { authorization: `Bearer ${await token()}` },
    onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
    ...(!file.type && TYPES[ext] ? { contentType: TYPES[ext] } : {}),
  });
  return blob.url;
}
