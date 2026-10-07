import { Inter_Tight, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

export const sansFont = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

export const serifFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-family",
  display: "swap",
  style: ["normal", "italic"],
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-family",
  display: "swap",
  weight: ["400", "500"],
});
