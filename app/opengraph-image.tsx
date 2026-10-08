import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", "logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", padding: 80, background: "#ffffff", color: "#1b1c20" }}>
        <img src={logoSrc} width={240} height={240} alt="" />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 56 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, display: "flex" }}>
            <span style={{ color: "#0069e8" }}>Global Insights</span>
            <span style={{ marginLeft: 20 }}>Daily</span>
          </div>
          <div style={{ fontSize: 32, marginTop: 24, color: "#4b505b", maxWidth: 700 }}>{siteConfig.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
