import type { BlockKind } from "@/lib/editor";
import { CodeIcon, DividerIcon, HeadingIcon, ImageIcon, InfoIcon, LinkIcon, ListIcon, OrderedListIcon, ParagraphIcon, PlayIcon, QuoteIcon } from "@/components/ui/Icons";

export function BlockIcon({ kind, size = 18 }: { kind: BlockKind; size?: number }) {
  const map = {
    paragraph: ParagraphIcon,
    heading2: HeadingIcon,
    heading3: HeadingIcon,
    image: ImageIcon,
    quote: QuoteIcon,
    ordered: OrderedListIcon,
    unordered: ListIcon,
    code: CodeIcon,
    callout: InfoIcon,
    divider: DividerIcon,
    link: LinkIcon,
    embed: PlayIcon,
  } as const;
  const Icon = map[kind];
  return <Icon size={size} />;
}
