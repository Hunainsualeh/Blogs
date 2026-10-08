import type { ReactNode } from "react";
import { AdSlot } from "./AdSlot";

export async function withInContentAds(items: ReactNode[], afterEvery: number, max: number, minItems = 8): Promise<ReactNode[]> {
  if (max <= 0 || items.length < minItems) return items;
  const result: ReactNode[] = [];
  let inserted = 0;
  items.forEach((item, index) => {
    result.push(item);
    const position = index + 1;
    const isLast = position === items.length;
    const roomAfter = items.length - position >= 3;
    if (!isLast && roomAfter && inserted < max && position % afterEvery === 0) {
      inserted += 1;
      result.push(<AdSlot key={`ad-${position}`} placement="article-in-content" />);
    }
  });
  return result;
}
