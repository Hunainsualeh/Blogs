import type { ContentBlock, TocItem } from "@/types/article";
import { headingId } from "./utils";

export function buildTableOfContents(blocks: ContentBlock[]): TocItem[] {
  return blocks.flatMap((block) =>
    block.type === "heading" && block.content.trim() ? [{ id: headingId(block.content), text: block.content, level: block.level }] : [],
  );
}
