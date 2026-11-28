"use client";

// 확장자 → 형식 (브라우저가 형식을 비워 보내는 파일 대비)
const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

/**
 * 이미지를 올리기 전에 줄인다: 긴 변을 maxSide 이하로, WebP(안 되면 JPEG)로.
 * 움직이는 GIF와 이미 충분히 작은 파일은 그대로 둔다.
 */
async function shrinkImage(file: File, maxSide: number): Promise<File> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return file;
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    return file;
  }
  const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * k);
  const h = Math.round(bmp.height * k);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const toBlob = (type: string, q: number) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));
  let out = await toBlob("image/webp", 0.86);
  // WebP로 못 만드는 브라우저는 PNG를 돌려준다 → 투명 배경이 없는 사진이면 JPEG로
  if (!out || out.type !== "image/webp") out = file.type === "image/png" ? file : await toBlob("image/jpeg", 0.88);
  if (!out || (out.size >= file.size && k === 1)) return file;

  const ext = out.type === "image/webp" ? ".webp" : out.type === "image/jpeg" ? ".jpg" : ".png";
  return new File([out], file.name.replace(/\.[^.]+$/, "") + ext, { type: out.type });
}

/** 관리자 업로드: 추측할 수 없는 파일 이름으로 Cloudflare R2에 올리고 공개 주소를 돌려준다 */
export async function uploadFile(
  original: File,
  folder: string,
  token: () => Promise<string>,
  onProgress?: (pct: number) => void,
): Promise<string> {
  // 갤러리는 크게 보는 용도라 조금 더 크게 남긴다
  const file = await shrinkImage(original, folder.endsWith("/gallery") ? 2048 : 1600);

  const dot = file.name.lastIndexOf(".");
  const base = (dot > 0 ? file.name.slice(0, dot) : file.name).replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "file";
  const ext = dot > 0 ? file.name.slice(dot).toLowerCase() : "";
  const contentType = file.type || TYPES[ext] || "";
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const pathname = `${folder}/${base}-${rand}${ext}`;

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${await token()}` },
    body: JSON.stringify({ pathname, contentType, size: file.size }),
  });
  const data = (await res.json().catch(() => ({}))) as { uploadUrl?: string; url?: string; error?: string };
  if (!res.ok || !data.uploadUrl || !data.url) throw new Error(data.error || "업로드 주소를 받지 못했어요.");

  // 진행률을 보여주려고 fetch 대신 XHR로 올린다
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl!);
    xhr.setRequestHeader("content-type", contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`업로드 실패 (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("업로드 중 연결이 끊겼어요. R2 CORS 설정을 확인해 주세요."));
    xhr.send(file);
  });
  onProgress?.(100);
  return data.url;
}
