import { Barcode } from "./Ornaments";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container" style={{ paddingTop: 24 }}>
        <div className="display outline footer-word" aria-hidden="true">PAWCAT</div>
        <div className="footer-row">
          <span>© 2026 PAWCAT / 냥발</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Barcode width={120} height={24} />
            <b>TYPE A-45</b>
          </span>
        </div>
      </div>
    </footer>
  );
}
