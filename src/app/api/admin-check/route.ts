// 로그인한 계정이 관리자인지 확인
import { NextResponse } from "next/server";
import { AuthError, verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: Request) {
  try {
    await verifyAdmin(request.headers.get("authorization"));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof AuthError ? 401 : 500;
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status });
  }
}
