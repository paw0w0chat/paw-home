"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowMark } from "./Ornaments";

const NAV = [
  { href: "/profile", label: "PROFILE" },
  { href: "/works", label: "WORKS" },
  { href: "/personas", label: "PERSONAS" },
  { href: "/dreams", label: "DREAM" },
  { href: "/prompts", label: "PROMPTS" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <ArrowMark />
        <span className="display brand-name">PAWCAT</span>
        <span className="mono muted" style={{ fontSize: 12 }}>//ARCHIVE</span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname.startsWith(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <span className="mono muted" style={{ fontSize: 12 }}>VOL.01 — 2026</span>
    </header>
  );
}
