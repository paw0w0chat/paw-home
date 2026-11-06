// Firebase 클라이언트 SDK 초기화. 서버(페이지 렌더링)와 브라우저(관리자 페이지) 양쪽에서 쓴다.
// 이 값들은 브라우저에 공개되는 값이라 NEXT_PUBLIC_ 으로 둔다. 실제 보호는 firestore.rules가 한다.

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

/** Firestore 컬렉션 이름 */
export const COLLECTIONS = ["groups", "personas", "dreams", "works", "prompts"] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
/** 프로필은 site/profile 문서 하나 */
export const PROFILE_DOC = ["site", "profile"] as const;
