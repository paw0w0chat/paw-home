"use client";

import { useRef, useState } from "react";
import type { GalleryImage } from "@/lib/types";

/** 페르소나 갤러리: 한 장씩 넘겨 보는 슬라이드 (버튼 · 썸네일 · 키보드 ←→ · 스와이프) */
export function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const n = images.length;
  const go = (k: number) => setI(((k % n) + n) % n);
  const cur = images[i];

  return (
    <div
      className="gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} 갤러리`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      }}
    >
      <div className="card-top dark">
        <span>GALLERY</span>
        <span aria-live="polite">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
      </div>

      <div
        className="gallery-view"
        onPointerDown={(e) => { startX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
        }}
      >
        <div className="gallery-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {images.map((g, k) => (
            <figure key={g.url + k} className="gallery-slide" role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${n}`} aria-hidden={k !== i}>
              <img src={g.url} alt={g.caption || `${name} 이미지 ${k + 1}`} loading={k === 0 ? "eager" : "lazy"} draggable={false} />
            </figure>
          ))}
        </div>
        {n > 1 ? (
          <>
            <button type="button" className="gallery-nav prev" onClick={() => go(i - 1)} aria-label="이전 이미지">←</button>
            <button type="button" className="gallery-nav next" onClick={() => go(i + 1)} aria-label="다음 이미지">→</button>
          </>
        ) : null}
      </div>

      <div className="gallery-foot">
        <p className="gallery-caption">{cur?.caption || " "}</p>
        <a href={cur?.url} target="_blank" rel="noreferrer" className="more-link" style={{ minHeight: 40 }}>원본 보기 ↗</a>
      </div>

      {n > 1 ? (
        <div className="gallery-thumbs" role="tablist" aria-label="이미지 고르기">
          {images.map((g, k) => (
            <button
              key={g.url + k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`${k + 1}번 이미지 보기`}
              className="gallery-thumb"
              onClick={() => go(k)}
            >
              <img src={g.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
