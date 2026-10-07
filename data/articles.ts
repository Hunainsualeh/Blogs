import type { Article } from "@/types/article";
import type { ArticleSeed } from "./seeds/types";
import { buildArticle } from "@/lib/content-builder";
import { techSeeds } from "./seeds/tech";
import { showcaseSeeds } from "./seeds/showcase";
import { businessSeeds } from "./seeds/business";
import { fashionSeeds } from "./seeds/fashion";
import { healthSeeds } from "./seeds/health";
import { marketingSeeds } from "./seeds/marketing";
import { lifestyleSeeds } from "./seeds/lifestyle";
import { travelSeeds } from "./seeds/travel";
import { educationSeeds } from "./seeds/education";
import { realEstateSeeds } from "./seeds/real-estate";
import { foodSeeds } from "./seeds/food";
import { sportsSeeds } from "./seeds/sports";

const seeds: ArticleSeed[] = [
  ...techSeeds,
  ...showcaseSeeds,
  ...businessSeeds,
  ...fashionSeeds,
  ...healthSeeds,
  ...marketingSeeds,
  ...lifestyleSeeds,
  ...travelSeeds,
  ...educationSeeds,
  ...realEstateSeeds,
  ...foodSeeds,
  ...sportsSeeds,
];

export const articles: Article[] = seeds
  .map((seed, index) => buildArticle(seed, index))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
