// 관리자가 저장하면 호출: 사이트 전체 캐시를 지워 바로 반영되게 한다.
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { AuthError, verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: Request) {
  try {
    await verifyAdmin(request.headers.get("authorization"));
  } catch (err) {
    const status = err instanceof AuthError ? 401 : 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
