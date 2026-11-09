// 관리자 페이지 편집 폼 정의. 사이트에 보이는 모든 값이 여기서 편집된다.
// 폼은 모든 값을 문자열로 다루고, 저장할 때 타입에 맞게 변환한다.

import type { CollectionName } from "@/lib/firebase";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "image"
  | "stats" // "LABEL: 값" 한 줄에 하나 → StatRow[]
  | "meta" // "LABEL: 값" 한 줄 → StatRow
  | "tags" // 쉼표로 구분 → string[]
  | "links"; // "이름 | 주소" 한 줄에 하나 → { label, url }[]

export type OptionSource = "groups" | "groups:world" | "groups:work" | "personas";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: OptionSource | { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
};

export type Section = {
  id: CollectionName;
  code: string;
  en: string;
  ko: string;
  /** 목록에 보이는 제목/부제를 만드는 키 */
  titleKeys: string[];
  subKeys: string[];
  /** true면 문서 id를 직접 입력 (페르소나 주소에 쓰임) */
  customId?: boolean;
  fields: Field[];
};

export const SECTIONS: Section[] = [
  {
    id: "works", code: "C-02", en: "WORKS", ko: "작품",
    titleKeys: ["title"], subKeys: ["platform", "releasedAt"],
    fields: [
      { key: "title", label: "작품명", type: "text", required: true },
      { key: "tagline", label: "한 줄 소개", type: "textarea", hint: "카드에 작품명 아래로 보여요", placeholder: "철거 직전 고시원, 마지막 세입자와 남겨진 관리인" },
      { key: "genre", label: "장르", type: "tags", hint: "여러 개면 쉼표로 구분", placeholder: "로맨스, 현대판타지" },
      { key: "platform", label: "플랫폼", type: "tags", hint: "여러 개면 쉼표로 구분", placeholder: "제타, 크랙" },
      { key: "releasedAt", label: "출시일", type: "text", placeholder: "2026-11-06" },
      { key: "links", label: "캐릭터 링크", type: "links", hint: "한 줄에 하나씩 `사이트 이름 | 주소`. 여러 사이트면 여러 줄로", placeholder: "크랙 | https://crack.wrtn.ai/...\n케이브덕 | https://caveduck.io/..." },
      { key: "thumbnail", label: "썸네일 (1:1)", type: "image", hint: "작품 목록에 정사각형으로 잘려서 보여요" },
    ],
  },
  {
    id: "personas", code: "C-03", en: "PERSONAS", ko: "페르소나",
    titleKeys: ["nameKo"], subKeys: ["codename"], customId: true,
    fields: [
      { key: "nameKo", label: "이름", type: "text", required: true },
      { key: "codename", label: "코드네임 (영문, 크게 표시)", type: "text", required: true },
      { key: "nameAlt", label: "부가 표기 (한자 · 별칭)", type: "text", placeholder: "夏善祐 · 단잠" },
      { key: "worldId", label: "세계관", type: "select", options: "groups:world", required: true },
      { key: "workId", label: "작품", type: "select", options: "groups:work", required: true },
      { key: "cardMeta", label: "카드 한 줄 정보", type: "meta", hint: "`항목: 값` 또는 문장만 써도 돼요", placeholder: "IMPRINT: 올림포스 · 헤베" },
      { key: "stats", label: "스펙표", type: "stats", hint: "한 줄에 하나씩 `항목: 값`", placeholder: "GENDER / AGE: 여성 · 29세\nHEIGHT: 158cm" },
      { key: "ability", label: "능력", type: "textarea" },
      { key: "personality", label: "성격", type: "textarea" },
      { key: "background", label: "배경", type: "textarea" },
      { key: "appearance", label: "외형 메모", type: "textarea" },
      { key: "voice", label: "말투 · 대표 대사", type: "textarea" },
      { key: "headImage", label: "두상 이미지 (1:1)", type: "image", hint: "목록 카드의 대표 이미지로도 쓰여요 (없으면 전신 이미지)" },
      { key: "bodyImage", label: "전신 이미지 (2:3)", type: "image" },
      { key: "profileText", label: "프로필 전문", type: "textarea", hint: "채팅 플랫폼에 붙여 넣을 프로필" },
      { key: "appearancePrompt", label: "외형 프롬프트", type: "textarea", hint: "이미지 생성용" },
    ],
  },
  {
    id: "dreams", code: "C-04", en: "DREAM", ko: "드림",
    titleKeys: ["characterKo"], subKeys: ["status"],
    fields: [
      { key: "characterKo", label: "캐릭터 이름", type: "text", required: true },
      { key: "characterEn", label: "캐릭터 영문 표기 (크게 표시)", type: "text", required: true },
      { key: "personaId", label: "연결 페르소나", type: "select", options: "personas", required: true },
      { key: "groupId", label: "묶일 분류 (세계관 또는 작품)", type: "select", options: "groups", required: true },
      {
        key: "status", label: "상태", type: "select", required: true,
        options: [
          { value: "dating", label: "연애 중" },
          { value: "chasing", label: "공략 중" },
          { value: "ongoing", label: "진행 중" },
          { value: "open", label: "OPEN" },
        ],
      },
      { key: "note", label: "드림 노트", type: "textarea" },
      { key: "characterImage", label: "캐릭터 이미지", type: "image" },
    ],
  },
  {
    id: "prompts", code: "C-05", en: "PROMPTS", ko: "프롬프트",
    titleKeys: ["title"], subKeys: ["category"],
    fields: [
      { key: "title", label: "제목", type: "text", required: true },
      {
        key: "category", label: "카테고리", type: "select", required: true,
        options: [
          { value: "CHARACTER", label: "CHARACTER" },
          { value: "IMAGE", label: "IMAGE" },
          { value: "SYSTEM", label: "SYSTEM" },
        ],
      },
      { key: "personaId", label: "연결 페르소나 (선택)", type: "select", options: "personas" },
      { key: "body", label: "본문", type: "textarea", required: true },
    ],
  },
  {
    id: "groups", code: "C-06", en: "GROUPS", ko: "세계관 · 작품 분류",
    titleKeys: ["title"], subKeys: ["type", "sub"], customId: true,
    fields: [
      {
        key: "type", label: "분류 종류", type: "select", required: true,
        options: [
          { value: "world", label: "세계관" },
          { value: "work", label: "작품" },
        ],
      },
      { key: "title", label: "이름 (목록 제목)", type: "text", required: true },
      { key: "sub", label: "부제", type: "text" },
    ],
  },
];

// ── 값 ↔ 폼 문자열 변환 ──

type StatRow = { label: string; value: string };

function parseLine(line: string): StatRow {
  const i = line.indexOf(":");
  return i < 0 ? { label: line.trim(), value: "" } : { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
}

export function toForm(field: Field, value: unknown): string {
  if (value === undefined || value === null) return "";
  switch (field.type) {
    case "stats":
      return (value as StatRow[]).map((r) => `${r.label}: ${r.value}`).join("\n");
    case "meta": {
      const r = value as StatRow;
      return r.label || r.value ? `${r.label}: ${r.value}` : "";
    }
    case "tags":
      return Array.isArray(value) ? value.join(", ") : String(value);
    case "links":
      return (value as { label: string; url: string }[]).map((l) => `${l.label} | ${l.url}`).join("\n");
    default:
      return String(value);
  }
}

export function fromForm(field: Field, text: string): unknown {
  switch (field.type) {
    case "stats":
      return text.split("\n").map((l) => l.trim()).filter(Boolean).map(parseLine);
    case "meta":
      return text.trim() ? parseLine(text) : { label: "", value: "" };
    case "tags":
      return text.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
    case "links":
      return parseLinks(text);
    case "number":
      return Number(text) || 0;
    default:
      return text.trim();
  }
}

/**
 * "이름 | 주소" 줄들을 링크 목록으로. 주소만 있으면 사이트 주소에서 이름을 만든다.
 * 보안: http(s) 주소만 받는다 (javascript: 같은 주소는 버림)
 */
export function parseLinks(text: string): { label: string; url: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const bar = line.lastIndexOf("|");
      const label = bar >= 0 ? line.slice(0, bar).trim() : "";
      const url = (bar >= 0 ? line.slice(bar + 1) : line).trim();
      return { label, url };
    })
    .filter((l) => /^https?:\/\//i.test(l.url))
    .map((l) => ({ label: l.label || hostLabel(l.url), url: l.url }));
}

function hostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "링크";
  }
}

/** 문서 id로 쓸 수 있게 다듬기 (영문 소문자 · 숫자 · 하이픈) */
export const toSlug = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
