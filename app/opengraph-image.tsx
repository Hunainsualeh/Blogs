import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#002B5A", color: "#fff" }}>
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.7 }}>Online magazine</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 34, marginTop: 28, opacity: 0.85, maxWidth: 900 }}>{siteConfig.tagline}</div>
      </div>
    ),
    size,
  );
}
