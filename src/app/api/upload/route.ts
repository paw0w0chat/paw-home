// 관리자 파일 업로드: 브라우저가 Cloudflare R2에 직접 올릴 수 있도록
// 관리자 확인 후 "이 경로 하나에, 이 형식으로만, 10분 동안" 쓸 수 있는 서명 URL을 발급한다.
// R2 열쇠(R2_SECRET_ACCESS_KEY)는 서버에만 있고 브라우저로는 나가지 않는다.
import { AwsV4Signer } from "aws4fetch";
import { NextResponse } from "next/server";
import { AuthError, verifyAdmin } from "@/lib/verifyAdmin";

const IMAGES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
// 툴 · 템플릿 첨부 파일은 PDF · ZIP도 허용
const FILES = [...IMAGES, "application/pdf", "application/zip", "application/x-zip-compressed"];
// 페르소나 테마곡
const AUDIO = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/x-wav", "audio/ogg"];

const MB = 1024 * 1024;
function rulesFor(pathname: string) {
  if (pathname.includes("/audio/")) return { types: AUDIO, maxBytes: 30 * MB };
  return pathname.startsWith("tools/") ? { types: FILES, maxBytes: 30 * MB } : { types: IMAGES, maxBytes: 10 * MB };
}

// 폴더/이름-무작위.확장자 모양만 허용 (경로 조작 방지)
const SAFE_PATH = /^[a-z0-9][a-z0-9_-]*(\/[a-z0-9][a-z0-9_-]*){0,3}\/[A-Za-z0-9_-]{1,80}\.[a-z0-9]{2,5}$/;

export async function POST(request: Request) {
  try {
    await verifyAdmin(request.headers.get("authorization"));

    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
      return NextResponse.json({ error: "R2 환경변수가 설정되지 않았어요." }, { status: 500 });
    }

    const { pathname, contentType, size } = (await request.json()) as { pathname?: string; contentType?: string; size?: number };
    if (typeof pathname !== "string" || !SAFE_PATH.test(pathname)) {
      return NextResponse.json({ error: "파일 경로가 올바르지 않아요." }, { status: 400 });
    }
    const { types, maxBytes } = rulesFor(pathname);
    if (typeof contentType !== "string" || !types.includes(contentType)) {
      return NextResponse.json({ error: "올릴 수 없는 파일 형식이에요." }, { status: 400 });
    }
    if (typeof size !== "number" || size <= 0 || size > maxBytes) {
      return NextResponse.json({ error: `파일이 너무 커요. 최대 ${Math.round(maxBytes / MB)}MB까지 올릴 수 있어요.` }, { status: 400 });
    }

    const target = new URL(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${pathname}`);
    target.searchParams.set("X-Amz-Expires", "600");
    const signed = await new AwsV4Signer({
      method: "PUT",
      url: target.toString(),
      headers: { "content-type": contentType },
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
      service: "s3",
      region: "auto",
      signQuery: true,
      allHeaders: true,
    }).sign();

    return NextResponse.json({
      uploadUrl: signed.url.toString(),
      url: `${R2_PUBLIC_URL.replace(/\/+$/, "")}/${pathname}`,
    });
  } catch (err) {
    const status = err instanceof AuthError ? 401 : 400;
    console.error("[upload]", err);
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
