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
  // public/apps/<이름>/index.html 을 /apps/<이름> 주소로 연다 (트친소표 같은 단독 페이지)
  async rewrites() {
    return [{ source: "/apps/:name", destination: "/apps/:name/index.html" }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
