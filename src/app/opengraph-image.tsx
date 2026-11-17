import { ImageResponse } from "next/og";

export const alt = "AstroHub - Astronomy Hub for Astrophiles and Amateur Astronomers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #020617 0%, #0b1a3a 100%)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700 }}>AstroHub</div>
        <div style={{ fontSize: 44, marginTop: 24, color: "#93c5fd" }}>
          Astronomy tools, sky charts and live space data
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "#94a3b8" }}>
          www.astrohub.live
        </div>
      </div>
    ),
    size,
  );
}
