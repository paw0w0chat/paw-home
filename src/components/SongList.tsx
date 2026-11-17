"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "@/lib/types";

const fmt = (t: number) => {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

/** 테마곡 하나: 재생 · 일시정지 · 구간 이동. 다른 곡을 틀면 이 곡은 멈춘다 */
function Track({ song, index, fallbackCover }: { song: Song; index: number; fallbackCover?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const id = `track-${index}`;

  // 하이드레이션 전에 메타데이터가 이미 읽혔을 수 있어 한 번 확인
  useEffect(() => {
    const a = audio.current;
    if (a && a.readyState >= 1 && Number.isFinite(a.duration)) setDur(a.duration);
  }, []);

  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) audio.current?.pause();
    };
    window.addEventListener("paw-audio-play", onOther);
    return () => window.removeEventListener("paw-audio-play", onOther);
  }, [id]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      window.dispatchEvent(new CustomEvent("paw-audio-play", { detail: id }));
      a.play().catch(() => setPlaying(false));
    } else a.pause();
  };

  const cover = song.cover || fallbackCover;

  return (
    <article className={`song${playing ? " is-playing" : ""}`}>
      <div className="song-cover">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <span aria-hidden="true">♪</span>}
      </div>
      <div className="song-body">
        <div className="song-head">
          <span className="mono muted" style={{ fontSize: 11 }}>TRACK {String(index + 1).padStart(2, "0")}</span>
          {song.link ? (
            <a href={song.link} target="_blank" rel="noreferrer" className="song-link">
              {/suno\./i.test(song.link) ? "Suno" : "링크"} ↗
            </a>
          ) : null}
        </div>
        <h3 className="song-title">{song.title}</h3>
        {song.note ? <p className="song-note">{song.note}</p> : null}

        {song.url ? (
          <div className="song-player">
            <button type="button" className="song-play" onClick={toggle} aria-label={playing ? `${song.title} 일시정지` : `${song.title} 재생`}>
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2L14 8L4 14Z" fill="currentColor" /></svg>
              )}
            </button>
            <input
              type="range"
              className="song-seek"
              min={0}
              max={dur || 0}
              step={0.1}
              value={Math.min(time, dur || 0)}
              onChange={(e) => {
                const a = audio.current;
                if (a) a.currentTime = Number(e.target.value);
              }}
              aria-label={`${song.title} 재생 위치`}
              style={{ "--pct": `${dur ? (time / dur) * 100 : 0}%` } as React.CSSProperties}
            />
            <span className="mono song-time">{fmt(time)} / {fmt(dur)}</span>
            <audio
              ref={audio}
              src={song.url}
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => { setPlaying(false); setTime(0); }}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
              onDurationChange={(e) => setDur(e.currentTarget.duration)}
            />
          </div>
        ) : song.link ? (
          <a href={song.link} target="_blank" rel="noreferrer" className="work-link" style={{ alignSelf: "flex-start", minHeight: 44 }}>
            ▶ {/suno\./i.test(song.link) ? "Suno에서 듣기" : "들으러 가기"} ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function SongList({ songs, fallbackCover }: { songs: Song[]; fallbackCover?: string }) {
  return (
    <div className="songs">
      {songs.map((s, i) => <Track key={(s.url || s.link || "") + i} song={s} index={i} fallbackCover={fallbackCover} />)}
    </div>
  );
}
