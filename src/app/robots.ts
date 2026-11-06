import type { MetadataRoute } from "next";

// 검색엔진 수집 안 함
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
