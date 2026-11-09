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

/** 프로필 (profile 문서 1개) */
export type Profile = {
  intro: string;
  careers: { title: string; body: string }[];
  links: { label: string; url: string }[];
};
