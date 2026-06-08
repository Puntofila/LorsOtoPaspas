import Link from "next/link";

// Root-level not-found renders outside the locale providers, so it can't use
// useT(). It defaults to Turkish (the default locale) and links into /tr.
export default function RootNotFound() {
  return (
    <html lang="tr">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f5f3ee",
          color: "#1a1814",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "4.5rem", fontWeight: 800, color: "#a87c26" }}>404</div>
        <h1 style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 700 }}>Sayfa bulunamadı</h1>
        <p style={{ marginTop: "0.75rem", color: "#43434a" }}>
          Aradığın sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/tr"
          style={{
            marginTop: "1.5rem",
            display: "inline-block",
            borderRadius: "9999px",
            background: "#2563eb",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Anasayfaya dön
        </Link>
      </body>
    </html>
  );
}
