import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { theme, themeCssVariables } from "@/config/theme";
import { monoFont, sansFont, serifFont } from "@/lib/fonts";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: theme.colors.brand,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.language}
      className={`${sansFont.variable} ${serifFont.variable} ${monoFont.variable} antialiased`}
      style={themeCssVariables() as CSSProperties}
    >
      <body className="flex min-h-screen flex-col">
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
