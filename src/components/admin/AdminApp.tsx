"use client";

import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";
import { AdminConsole } from "./AdminConsole";

type Gate = "loading" | "signed-out" | "checking" | "denied" | "ok";

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [gate, setGate] = useState<Gate>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const auth = getAuth(getFirebaseApp());
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return setGate("signed-out");
      setGate("checking");
      const res = await fetch("/api/admin-check", {
        method: "POST",
        headers: { authorization: `Bearer ${await u.getIdToken()}` },
      }).catch(() => null);
      const body = res ? await res.json().catch(() => ({})) : {};
      if (res?.ok) setGate("ok");
      else {
        setError(body.error ?? "확인에 실패했어요.");
        setGate("denied");
      }
    });
  }, []);

  if (!isFirebaseConfigured) {
    return <Notice title="SETUP">Firebase 환경변수가 아직 없어요. Vercel 프로젝트 설정에 값을 넣은 뒤 다시 배포해 주세요.</Notice>;
  }

  const login = () => signInWithPopup(getAuth(getFirebaseApp()), new GoogleAuthProvider()).catch((e) => setError(e.message));
  const logout = () => signOut(getAuth(getFirebaseApp()));

  if (gate === "loading" || gate === "checking") return <Notice title="ADMIN">확인 중…</Notice>;

  if (gate === "signed-out") {
    return (
      <Notice title="ADMIN">
        <p style={{ margin: "0 0 20px" }}>관리자 Google 계정으로 로그인해 주세요.</p>
        <button type="button" className="btn-primary" onClick={login}>Google로 로그인</button>
        {error ? <p className="admin-error">{error}</p> : null}
      </Notice>
    );
  }

  if (gate === "denied") {
    return (
      <Notice title="ADMIN">
        <p style={{ margin: "0 0 8px" }}>{user?.email} 계정은 들어갈 수 없어요.</p>
        <p className="muted" style={{ margin: "0 0 20px", fontSize: 13 }}>{error}</p>
        <button type="button" className="btn-outline" onClick={logout}>다른 계정으로 로그인</button>
      </Notice>
    );
  }

  return <AdminConsole user={user!} onLogout={logout} />;
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container">
      <section className="page-title">
        <h1 className="display">{title}</h1>
      </section>
      <div style={{ padding: "32px 0", fontSize: 15, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
