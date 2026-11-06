// 페이지가 데이터를 가져오는 단일 창구.
// 지금은 시드 데이터를 읽고, Firebase 연결 단계에서 이 파일만 Firestore 조회로 바꾼다.

import * as seed from "@/data/seed";
import type { Dream, DreamStatus, Group, Persona, Work } from "@/lib/types";

const visible = <T extends { isPublic: boolean; order: number }>(items: T[]) =>
  items.filter((i) => i.isPublic).sort((a, b) => a.order - b.order);

export const DREAM_STATUS_LABEL: Record<DreamStatus, string> = {
  dating: "연애 중",
  chasing: "공략 중",
  ongoing: "진행 중",
  open: "OPEN",
};

export async function getProfile() {
  return seed.profile;
}

export async function getGroups(type?: Group["type"]) {
  const all = visible(seed.groups);
  return type ? all.filter((g) => g.type === type) : all;
}

export async function getGroup(id: string) {
  return seed.groups.find((g) => g.id === id && g.isPublic);
}

export async function getPersonas() {
  return visible(seed.personas);
}

/** 최근 추가된 순 (order가 큰 것부터) */
export async function getRecentPersonas(limit: number) {
  return (await getPersonas()).slice().reverse().slice(0, limit);
}

export async function getPersona(id: string): Promise<Persona | undefined> {
  return seed.personas.find((p) => p.id === id && p.isPublic);
}

export async function getDreams() {
  return visible(seed.dreams);
}

export async function getDreamsByPersona(personaId: string): Promise<Dream[]> {
  return (await getDreams()).filter((d) => d.personaId === personaId);
}

export async function getWorks() {
  return visible(seed.works).reverse();
}

export async function getRecentWorks(limit: number): Promise<Work[]> {
  return (await getWorks()).slice(0, limit);
}

/** 화면에 보이는 번호 (P-001, D-001 …) */
export const serial = (prefix: string, n: number) => `${prefix}-${String(n).padStart(3, "0")}`;
