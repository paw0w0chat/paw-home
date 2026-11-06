// 서버 전용: 관리자 페이지가 보낸 Firebase ID 토큰을 검증한다.
// 서비스 계정 키 없이 Google 공개키로 서명만 확인하므로 저장소에 비밀값이 필요 없다.

import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { firebaseConfig } from "@/lib/firebase";

// 관리자 이메일은 서버 전용 환경변수 — 브라우저 코드와 저장소에 남지 않는다
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

export class AuthError extends Error {}

export async function verifyAdmin(authorization: string | null): Promise<void> {
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  const projectId = firebaseConfig.projectId;
  if (!token) throw new AuthError("로그인 토큰이 없어요.");
  if (!projectId || !ADMIN_EMAIL) throw new AuthError("서버에 Firebase 설정이 없어요.");

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  }).catch(() => {
    throw new AuthError("로그인 토큰이 올바르지 않아요.");
  });

  const email = String(payload.email ?? "").toLowerCase();
  if (payload.email_verified !== true || email !== ADMIN_EMAIL) {
    throw new AuthError("관리자 계정이 아니에요.");
  }
}
