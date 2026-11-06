// 관리자 이미지 업로드: 브라우저가 Vercel Blob에 직접 올리도록 업로드 토큰만 발급한다.
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { AuthError, verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // 토큰 발급 요청일 때만 관리자 확인 (업로드 완료 알림은 Vercel이 서명해서 보낸다)
        await verifyAdmin(request.headers.get("authorization"));
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AuthError ? 401 : 400;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
