export const siteConfig = {
  name: "Northline",
  shortName: "Northline",
  tagline: "Smart stories on technology, business, health, travel and the way we live.",
  description:
    "Northline is an independent digital magazine covering tech, business, health, fashion, travel, food, sports, education, real estate and modern living with clear reporting and practical guides.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://northline.example.com",
  locale: "en_US",
  language: "en",
  foundingYear: 2019,
  copyrightYear: 2026,
  ogImage: "/opengraph-image",
  twitterHandle: "@northlinemedia",
  contact: {
    editorial: "editors@northline.example.com",
    contributors: "contributors@northline.example.com",
    press: "press@northline.example.com",
    address: "120 Market Street, San Francisco, CA",
  },
  social: [
    { label: "X", handle: "@northlinemedia", href: "https://x.com/northlinemedia" },
    { label: "LinkedIn", handle: "Northline Media", href: "https://www.linkedin.com/company/northlinemedia" },
    { label: "YouTube", handle: "Northline", href: "https://www.youtube.com/@northlinemedia" },
    { label: "Instagram", handle: "@northline", href: "https://www.instagram.com/northline" },
  ],
} as const;

export type SocialLink = (typeof siteConfig.social)[number];
