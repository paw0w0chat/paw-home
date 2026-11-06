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

## 다음 단계

1. Vercel에 이 저장소 연결
2. Firebase 프로젝트 생성 → Firestore · Storage · Authentication(Google)
3. `src/lib/content.ts`를 Firestore 조회로 교체, 시드 데이터 이관
4. `/admin` 관리자 페이지 (본인 Google 계정만 접근)
