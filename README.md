# PAWCAT // ARCHIVE

PAWCAT의 페르소나 · 드림 · 작품 · 프롬프트 아카이브.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 배포용 빌드 확인
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/app/page.tsx` | 홈 (최근 페르소나 4개, 최근 작품 3개) |
| `src/app/personas` | 페르소나 목록(세계관별 / 작품별)과 상세 |
| `src/app/dreams` | 작품별 드림, 상태 필터 |
| `src/app/works` | 출시 작품 전체 |
| `src/app/profile`, `src/app/prompts` | 프로필, 프롬프트 (관리자 페이지와 함께 채울 예정) |
| `src/lib/types.ts` | 데이터 타입 — Firestore 컬렉션과 1:1 |
| `src/lib/content.ts` | 페이지가 데이터를 가져오는 유일한 창구 |
| `src/data/seed.ts` | 초기 데이터 (Firebase 연결 전까지 사용) |
| `src/app/globals.css` | 색 · 서체 · 컴포넌트 스타일 |

| `src/app/admin` | 관리자 페이지 (Google 로그인, 관리자 이메일만 통과) |
| `src/app/api` | 업로드 토큰 발급, 관리자 확인, 저장 후 캐시 갱신 |
| `firestore.rules` | Firestore 보안 규칙 원본 (관리자 이메일은 콘솔에서 채움) |

## 데이터 흐름

- Firebase 환경변수가 있으면 Firestore에서 **공개 항목만** 읽고, 없으면 `seed.ts`를 쓴다.
- 관리자 페이지에서 저장하면 `/api/revalidate`가 캐시를 지워 바로 반영된다. 그 외에는 5분마다 갱신.
- 이미지는 브라우저에서 Vercel Blob으로 바로 올라간다. 업로드 토큰은 관리자 ID 토큰을 확인한 뒤에만 발급.

## 환경변수

`.env.example` 참고. Vercel 프로젝트 → Settings → Environment Variables에 넣는다.
