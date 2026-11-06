// 관리자 이미지 업로드: 브라우저가 Vercel Blob에 직접 올릴 수 있도록
// 관리자 확인 후 "이 경로 하나에만 쓸 수 있는" 짧은 서명 URL을 발급한다.
// 인증은 Vercel OIDC(BLOB_STORE_ID)로 하므로 별도 비밀 토큰이 필요 없다.
import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { AuthError, verifyAdmin } from "@/lib/verifyAdmin";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadPresignedBody;
  try {
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        await verifyAdmin(request.headers.get("authorization"));
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_BYTES,
          validUntil: Date.now() + 10 * 60 * 1000,
        });
        return { token, urlOptions: { allowedContentTypes: ALLOWED, maximumSizeInBytes: MAX_BYTES } };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AuthError ? 401 : 400;
    console.error("[upload]", err);
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
