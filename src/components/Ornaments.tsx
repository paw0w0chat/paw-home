export function Star({ size = 20, outline = false }: { size?: number; outline?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <path
        d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
        fill={outline ? "none" : "currentColor"}
        stroke={outline ? "currentColor" : "none"}
        strokeWidth={outline ? 0.6 : 0}
      />
    </svg>
  );
}

export function Barcode({ width = 96, height = 22 }: { width?: number | string; height?: number }) {
  return <span className="barcode" aria-hidden="true" style={{ width, height }} />;
}

export function ArrowMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M3 3 L19 19 M3 3 L3 13 M3 3 L13 3" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}
