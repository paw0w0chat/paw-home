import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 검색엔진 수집 안 함 — 모든 응답(이미지 포함)에 헤더를 붙인다
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noimageindex" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
