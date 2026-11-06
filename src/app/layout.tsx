import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PAWCAT // ARCHIVE", template: "%s — PAWCAT" },
  description: "PAWCAT의 페르소나 · 프롬프트 · 작품 아카이브.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400;500;700&family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <div className="container">
          <SiteHeader />
        </div>
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
