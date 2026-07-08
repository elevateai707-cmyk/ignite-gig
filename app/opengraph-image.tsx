import { ImageResponse } from "next/og";

export const alt = "Ignite GIG — Gig-Worker Tax Tracker (Canada + USA)";
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 96,
              borderRadius: 20,
              backgroundColor: "#0A0A0A",
              border: "3px solid #CCFF00",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 512 512">
              <path
                d="M296 64 L152 288 L240 288 L216 448 L360 224 L272 224 Z"
                fill="#CCFF00"
              />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#FFFFFF" }}>
            Ignite<span style={{ color: "#CCFF00" }}>GIG</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 34,
            color: "#B0B0B0",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Know what to set aside for taxes — every payout, every trip
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#CCFF00",
          }}
        >
          Canada + USA &middot; Free &middot; Private &middot; Offline
        </div>
      </div>
    ),
    { ...size }
  );
}
