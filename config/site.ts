export const siteConfig = {
  name: "Global Insights Daily",
  shortName: "Global Insights",
  tagline: "Clear, useful reading on technology, business, health, travel and everyday life.",
  description:
    "Global Insights Daily is an online magazine publishing original articles on technology, business, fashion, health, digital marketing, lifestyle, travel, education, real estate, food and sports, written by our editors and contributors.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalinsightsdaily.com",
  locale: "en_US",
  language: "en",
  copyrightYear: 2026,
  ogImage: "/opengraph-image",
  contact: {
    general: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@globalinsightsdaily.com",
    contributors: process.env.NEXT_PUBLIC_CONTRIBUTOR_EMAIL ?? "contact@globalinsightsdaily.com",
  },
} as const;
