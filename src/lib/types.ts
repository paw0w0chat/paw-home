// Firestore 컬렉션과 1:1로 대응하는 타입들.
// 모든 항목은 isPublic(공개 여부)과 order(정렬 순서)를 가진다.

export type Visibility = {
  isPublic: boolean;
  order: number;
};

/** 세계관 · 작품 분류 (groups 컬렉션) */
export type Group = Visibility & {
  id: string;
  type: "world" | "work";
  title: string;
  sub: string;
};

export type StatRow = {
  label: string;
  value: string;
};

/** 페르소나 (personas 컬렉션) */
export type Persona = Visibility & {
  id: string;
  nameKo: string;
  codename: string;
  /** 한자 이름, 별칭 등 */
  nameAlt?: string;
  worldId: string;
  workId: string;
  /** 카드에 보이는 한 줄 정보 */
  cardMeta: StatRow;
  /** 상세 화면 스펙표 */
  stats: StatRow[];
  ability?: string;
  personality?: string;
  background?: string;
  appearance?: string;
  voice?: string;
  headImage?: string;
  bodyImage?: string;
  /** 채팅 플랫폼에 붙여 넣을 프로필 전문 */
  profileText?: string;
  /** 이미지 생성용 외형 프롬프트 */
  appearancePrompt?: string;
};

export type DreamStatus = "dating" | "chasing" | "ongoing" | "open";

/** 드림 (dreams 컬렉션) */
export type Dream = Visibility & {
  id: string;
  characterKo: string;
  characterEn: string;
  personaId: string;
  /** groups 컬렉션의 id (세계관 또는 작품) */
  groupId: string;
  status: DreamStatus;
  note: string;
  /** 더 이상 쓰지 않음 (예전 데이터 호환용) */
  tags?: string[];
  characterImage?: string;
};

export type WorkLink = { label: string; url: string };

/** 출시 작품 (works 컬렉션) */
export type Work = Visibility & {
  id: string;
  title: string;
  /** 캐릭터 한 줄 소개 */
  tagline?: string;
  /** 여러 개 가능 (예전 데이터는 문자열 하나) */
  genre: string[] | string;
  platform: string[] | string;
  releasedAt: string;
  /** 캐릭터를 올린 사이트들 (여러 개) */
  links?: WorkLink[];
  /** 예전 단일 링크 (links가 없을 때만 사용) */
  url?: string;
  thumbnail?: string;
};

export type PromptCategory = "CHARACTER" | "IMAGE" | "SYSTEM";

/** 프롬프트 (prompts 컬렉션) */
export type Prompt = Visibility & {
  id: string;
  title: string;
  category: PromptCategory;
  personaId?: string;
  body: string;
};

/** 툴 · 템플릿 (tools 컬렉션) — 트친소표 같은 배포물 */
export type Tool = Visibility & {
  id: string;
  title: string;
  /** 카드에 보이는 짧은 설명 */
  summary?: string;
  /** 분류 태그 (예: 트친소표, 템플릿) */
  category?: string[] | string;
  /** 미리보기 이미지 */
  cover?: string;
  /** 첨부 파일 (PNG · PDF · ZIP) */
  file?: string;
  /** 배포 트윗, 사용하기 등 */
  links?: WorkLink[];
  /** 사용법 · 이용 규칙 · 크레딧 */
  body?: string;
};

/**
 * 프로필 INFO 섹션.
 * items는 한 줄에 하나. "태그 | 본문 | 뱃지1, 뱃지2" 형식 (태그·뱃지는 생략 가능)
 * kind: pills(알약) · list(줄 목록) · grid(2열 상자) · statement(첫 줄 크게 + 목록) · warn(어두운 경고 상자)
 */
export type ProfileSection = {
  title: string;
  en: string;
  kind: "pills" | "list" | "grid" | "statement" | "warn";
  items: string[];
  note?: string;
};

/** 프로필 (profile 문서 1개) */
export type Profile = {
  intro: string;
  /** 큰 닉네임 */
  nickname?: string;
  /** 닉네임 옆 영문 표기 */
  handle?: string;
  /** 닉네임 아래 작은 설명 */
  subline?: string;
  /** 강조 띠 문구 */
  tagline?: string;
  sections?: ProfileSection[];
  careers: { title: string; body: string }[];
  links: { label: string; url: string }[];
};
