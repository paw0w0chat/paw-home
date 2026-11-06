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
  tags: string[];
  characterImage?: string;
};

/** 출시 작품 (works 컬렉션) */
export type Work = Visibility & {
  id: string;
  title: string;
  genre: string;
  platform: string;
  releasedAt: string;
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

/** 프로필 (profile 문서 1개) */
export type Profile = {
  intro: string;
  careers: { title: string; body: string }[];
  links: { label: string; url: string }[];
};
