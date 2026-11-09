// 페이지가 데이터를 가져오는 단일 창구.
// Firebase 환경변수가 있으면 Firestore에서 공개 항목만 읽고, 없으면 시드 데이터를 쓴다.

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import * as seed from "@/data/seed";
import { getDb, isFirebaseConfigured, PROFILE_DOC, type CollectionName } from "@/lib/firebase";
import type { Dream, DreamStatus, Group, Persona, Profile, Prompt, Tool, Work } from "@/lib/types";

type Visible = { id: string; isPublic: boolean; order: number };

const byOrder = <T extends { order: number }>(items: T[]) => items.slice().sort((a, b) => a.order - b.order);

const SEED: Record<CollectionName, Visible[]> = {
  groups: seed.groups,
  personas: seed.personas,
  dreams: seed.dreams,
  works: seed.works,
  prompts: seed.prompts,
  tools: seed.tools,
};

/** 공개 항목 전체 (order 오름차순) */
async function list<T extends Visible>(name: CollectionName): Promise<T[]> {
  if (!isFirebaseConfigured) {
    return byOrder((SEED[name] as T[]).filter((i) => i.isPublic));
  }
  try {
    const snap = await getDocs(query(collection(getDb(), name), where("isPublic", "==", true)));
    return byOrder(snap.docs.map((d) => ({ ...(d.data() as Omit<T, "id">), id: d.id }) as T));
  } catch (err) {
    console.error(`[content] ${name} 읽기 실패`, err);
    return [];
  }
}

/** 공개 항목 하나. 비공개거나 없으면 undefined */
async function one<T extends Visible>(name: CollectionName, id: string): Promise<T | undefined> {
  if (!isFirebaseConfigured) {
    return (SEED[name] as T[]).find((i) => i.id === id && i.isPublic);
  }
  try {
    const snap = await getDoc(doc(getDb(), name, id));
    if (!snap.exists()) return undefined;
    const data = { ...(snap.data() as Omit<T, "id">), id: snap.id } as T;
    return data.isPublic ? data : undefined;
  } catch {
    // 비공개 문서는 보안 규칙에 막혀 permission-denied가 난다
    return undefined;
  }
}

export const DREAM_STATUS_LABEL: Record<DreamStatus, string> = {
  dating: "연애 중",
  chasing: "공략 중",
  ongoing: "진행 중",
  open: "OPEN",
};

export async function getProfile(): Promise<Profile> {
  if (!isFirebaseConfigured) return seed.profile;
  try {
    const snap = await getDoc(doc(getDb(), ...PROFILE_DOC));
    return snap.exists() ? { ...seed.profile, ...(snap.data() as Partial<Profile>) } : seed.profile;
  } catch {
    return seed.profile;
  }
}

export async function getGroups(type?: Group["type"]) {
  const all = await list<Group>("groups");
  return type ? all.filter((g) => g.type === type) : all;
}

export const getGroup = (id: string) => one<Group>("groups", id);

export const getPersonas = () => list<Persona>("personas");

/** 최근 추가된 순 (order가 큰 것부터) */
export async function getRecentPersonas(limit: number) {
  return (await getPersonas()).reverse().slice(0, limit);
}

export const getPersona = (id: string) => one<Persona>("personas", id);

export const getDreams = () => list<Dream>("dreams");

export async function getDreamsByPersona(personaId: string): Promise<Dream[]> {
  return (await getDreams()).filter((d) => d.personaId === personaId);
}

/** 최신 작품부터 */
export async function getWorks(): Promise<Work[]> {
  return (await list<Work>("works")).reverse();
}

export async function getRecentWorks(limit: number): Promise<Work[]> {
  return (await getWorks()).slice(0, limit);
}

export const getPrompts = () => list<Prompt>("prompts");

/** 최신 툴부터 */
export async function getTools(): Promise<Tool[]> {
  return (await list<Tool>("tools")).reverse();
}

export const getTool = (id: string) => one<Tool>("tools", id);

/** 화면에 보이는 번호 (P-001, D-001 …) */
export const serial = (prefix: string, n: number) => `${prefix}-${String(n).padStart(3, "0")}`;
