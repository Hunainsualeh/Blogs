import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { CalloutBlock, ContentBlock } from "@/types/article";
import { cn, headingId } from "@/lib/utils";
import { AlertIcon, ArrowRightIcon, ArrowUpRightIcon, InfoIcon, LightbulbIcon } from "@/components/ui/Icons";
import { InlineText } from "./blocks/InlineText";
import { CodeBlockView } from "./blocks/CodeBlockView";
import { EmbedBlockView } from "./blocks/EmbedBlockView";

const calloutStyles: Record<CalloutBlock["variant"], { className: string; icon: typeof InfoIcon; label: string }> = {
  info: { className: "border-brand bg-brand-soft/60", icon: InfoIcon, label: "Note" },
  tip: { className: "border-success bg-[#EEF8F3]", icon: LightbulbIcon, label: "Tip" },
  warning: { className: "border-warning bg-[#FDF6E9]", icon: AlertIcon, label: "Important" },
};

function isRenderable(block: ContentBlock) {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "quote":
    case "code":
    case "callout":
      return block.content.trim().length > 0;
    case "list":
      return block.items.some((item) => item.trim());
    case "image":
      return Boolean(block.src);
    case "link":
      return Boolean(block.href && block.label);
    case "embed":
      return Boolean(block.url);
    default:
      return true;
  }
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="font-serif text-[18px] leading-[1.75] text-[#1c2636] sm:text-[19.5px]">
          <InlineText text={block.content} />
        </p>
      );
    case "heading": {
      const id = headingId(block.content);
      return block.level === 2 ? (
        <h2 id={id} className="!mt-14 scroll-mt-32 text-[26px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[30px]">
          {block.content}
        </h2>
      ) : (
        <h3 id={id} className="!mt-10 scroll-mt-32 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-[22px]">
          {block.content}
        </h3>
      );
    }
    case "image":
      return (
        <figure className="!my-8">
          <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-surface-muted">
            <Image src={block.src} alt={block.alt} fill sizes="(min-width: 1320px) 760px, (min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
          {block.caption || block.credit ? (
            <figcaption className="mt-3 flex flex-wrap gap-x-2 text-[13px] leading-relaxed text-ink-subtle ">
              {block.caption ? <span>{block.caption}</span> : null}
              {block.credit ? <span className="kicker !text-[10px] text-ink-subtle/80">Photo: {block.credit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="!my-10 border-l-[3px] border-brand pl-6 sm:pl-8">
          <p className="font-serif text-[23px] italic leading-[1.45] text-ink sm:text-[27px]">&ldquo;{block.content}&rdquo;</p>
          {block.attribution ? <footer className="mt-4 text-sm text-ink-muted">{block.attribution}</footer> : null}
        </blockquote>
      );
    case "list": {
      const items = block.items.filter((item) => item.trim());
      const ListTag = block.style === "ordered" ? "ol" : "ul";
      return (
        <ListTag className={cn("space-y-3 pl-1 font-serif text-[18px] leading-[1.7] text-[#1c2636] sm:text-[19px]", block.style === "ordered" ? "[counter-reset:item]" : "")}>
          {items.map((item, index) => (
            <li key={index} className="flex gap-4">
              {block.style === "ordered" ? (
                <span className="mt-[3px] font-mono text-[14px] font-medium text-brand">{String(index + 1).padStart(2, "0")}</span>
              ) : (
                <span aria-hidden className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              )}
              <span>
                <InlineText text={item} />
              </span>
            </li>
          ))}
        </ListTag>
      );
    }
    case "code":
      return (
        <div className="!my-8">
          <CodeBlockView language={block.language} content={block.content} />
        </div>
      );
    case "callout": {
      const style = calloutStyles[block.variant];
      const Icon = style.icon;
      return (
        <aside className={cn("!my-8 rounded-sm border-l-[3px] px-5 py-4 sm:px-6 sm:py-5", style.className)}>
          <p className="kicker mb-2 flex items-center gap-2 text-ink">
            <Icon size={16} />
            {block.title || style.label}
          </p>
          <p className="text-[16px] leading-relaxed text-ink-muted">
            <InlineText text={block.content} />
          </p>
        </aside>
      );
    }
    case "divider":
      return (
        <div className="!my-12 flex justify-center gap-3" role="separator">
          <span className="h-1 w-1 rounded-full bg-ink-subtle" />
          <span className="h-1 w-1 rounded-full bg-ink-subtle" />
          <span className="h-1 w-1 rounded-full bg-ink-subtle" />
        </div>
      );
    case "link": {
      const external = /^https?:\/\//i.test(block.href);
      const content = (
        <>
          <span className="min-w-0">
            <span className="block text-[17px] font-semibold tracking-tight text-ink group-hover:text-brand">{block.label}</span>
            {block.description ? <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{block.description}</span> : null}
            <span className="mt-2 block truncate font-mono text-xs text-ink-subtle">{block.href}</span>
          </span>
          {external ? <ArrowUpRightIcon className="shrink-0 text-brand" /> : <ArrowRightIcon className="shrink-0 text-brand transition-transform group-hover:translate-x-1" />}
        </>
      );
      const classes = "group !my-8 flex items-center justify-between gap-6 rounded-md border border-line p-5 transition-colors hover:border-brand";
      return external ? (
        <a href={block.href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
        </a>
      ) : (
        <Link href={block.href} className={classes}>
          {content}
        </Link>
      );
    }
    case "embed":
      return (
        <div className="!my-10">
          <EmbedBlockView block={block} />
        </div>
      );
    default:
      return null;
  }
}

type InContentAds = { node: ReactNode; afterParagraphs: number; max: number };

export function ArticleBody({ blocks, className, ads }: { blocks: ContentBlock[]; className?: string; ads?: InContentAds }) {
  const renderable = blocks.filter(isRenderable);
  const totalParagraphs = renderable.filter((block) => block.type === "paragraph").length;
  const nodes: ReactNode[] = [];
  let paragraphs = 0;
  let inserted = 0;
  renderable.forEach((block, index) => {
    nodes.push(<Block key={block.id} block={block} />);
    if (block.type !== "paragraph") return;
    paragraphs += 1;
    if (!ads || ads.max <= 0 || inserted >= ads.max) return;
    const next = renderable[index + 1];
    const atThreshold = paragraphs >= ads.afterParagraphs * (inserted + 1);
    const hasRoomAfter = totalParagraphs - paragraphs >= 3;
    if (atThreshold && hasRoomAfter && next && (next.type === "heading" || next.type === "paragraph")) {
      inserted += 1;
      nodes.push(<Fragment key={`ad-${inserted}`}>{ads.node}</Fragment>);
    }
  });
  return <div className={cn("space-y-6", className)}>{nodes}</div>;
}
