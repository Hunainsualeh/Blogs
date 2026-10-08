import type { CalloutVariant, ContentBlock, ContentBlockType, EmbedBlock } from "@/types/article";
import type { SubmissionDraft } from "@/types/submission";
import { createId } from "./utils";

export type BlockKind =
  | "paragraph"
  | "heading2"
  | "heading3"
  | "image"
  | "quote"
  | "ordered"
  | "unordered"
  | "code"
  | "callout"
  | "divider"
  | "link"
  | "embed";

export type BlockCatalogEntry = {
  kind: BlockKind;
  label: string;
  description: string;
};

export const blockCatalog: BlockCatalogEntry[] = [
  { kind: "paragraph", label: "Paragraph", description: "Body text with bold, italic and links" },
  { kind: "heading2", label: "Heading", description: "Section heading (H2)" },
  { kind: "heading3", label: "Subheading", description: "Smaller heading (H3)" },
  { kind: "image", label: "Image", description: "Upload a photo with caption" },
  { kind: "quote", label: "Quote", description: "Pull quote with attribution" },
  { kind: "unordered", label: "Bulleted list", description: "Unordered list of points" },
  { kind: "ordered", label: "Numbered list", description: "Steps or ranked items" },
  { kind: "callout", label: "Callout", description: "Highlighted note or tip" },
  { kind: "code", label: "Code", description: "Formatted code snippet" },
  { kind: "link", label: "Link card", description: "Highlighted link to a resource" },
  { kind: "embed", label: "Embed", description: "Video or media placeholder" },
  { kind: "divider", label: "Divider", description: "Visual section break" },
];

export function createBlock(kind: BlockKind, fixedId?: string): ContentBlock {
  const id = fixedId ?? createId("blk");
  switch (kind) {
    case "paragraph":
      return { id, type: "paragraph", content: "" };
    case "heading2":
      return { id, type: "heading", level: 2, content: "" };
    case "heading3":
      return { id, type: "heading", level: 3, content: "" };
    case "image":
      return { id, type: "image", src: "", alt: "", caption: "" };
    case "quote":
      return { id, type: "quote", content: "", attribution: "" };
    case "ordered":
      return { id, type: "list", style: "ordered", items: [""] };
    case "unordered":
      return { id, type: "list", style: "unordered", items: [""] };
    case "code":
      return { id, type: "code", language: "", content: "" };
    case "callout":
      return { id, type: "callout", variant: "info" as CalloutVariant, title: "", content: "" };
    case "divider":
      return { id, type: "divider" };
    case "link":
      return { id, type: "link", href: "", label: "", description: "" };
    case "embed":
      return { id, type: "embed", url: "", provider: "other", title: "" };
  }
}

export function detectEmbedProvider(url: string): EmbedBlock["provider"] {
  if (/youtu\.?be/i.test(url)) return "youtube";
  if (/vimeo\.com/i.test(url)) return "vimeo";
  if (/(twitter|x)\.com/i.test(url)) return "x";
  return "other";
}

export const blockTypeLabels: Record<ContentBlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  image: "Image",
  quote: "Quote",
  list: "List",
  code: "Code",
  callout: "Callout",
  divider: "Divider",
  link: "Link card",
  embed: "Embed",
};

export type TemplateKey = "starter" | "feature" | "guide" | "blank";

export const templates: { key: TemplateKey; label: string; description: string; kinds: BlockKind[] }[] = [
  {
    key: "starter",
    label: "Simple article",
    description: "Introduction, one section and a conclusion",
    kinds: ["paragraph", "heading2", "paragraph", "heading2", "paragraph"],
  },
  {
    key: "feature",
    label: "Feature article",
    description: "Intro, image, sections, quote and closing",
    kinds: ["paragraph", "image", "paragraph", "heading2", "paragraph", "image", "quote", "paragraph", "heading2", "paragraph", "image", "paragraph"],
  },
  {
    key: "guide",
    label: "How-to guide",
    description: "Intro, numbered steps, tips and summary",
    kinds: ["paragraph", "image", "heading2", "ordered", "callout", "heading2", "paragraph", "heading3", "unordered", "divider", "heading2", "paragraph"],
  },
  { key: "blank", label: "Blank page", description: "Start with a single paragraph", kinds: ["paragraph"] },
];

export function templateBlocks(key: TemplateKey, stableIds = false) {
  const template = templates.find((item) => item.key === key) ?? templates[0];
  return template.kinds.map((kind, index) => createBlock(kind, stableIds ? `tpl-${key}-${index}` : undefined));
}

export function emptyDraft(): SubmissionDraft {
  return {
    title: "",
    excerpt: "",
    category: "",
    tags: [],
    featuredImage: null,
    content: templateBlocks("starter", true),
    author: { name: "", email: "", bio: "", profileUrl: "" },
  };
}

export type EditorAction =
  | { type: "set"; field: "title" | "excerpt" | "category"; value: string }
  | { type: "setTags"; tags: string[] }
  | { type: "setAuthor"; field: keyof SubmissionDraft["author"]; value: string }
  | { type: "setFeaturedImage"; image: SubmissionDraft["featuredImage"] }
  | { type: "insertBlock"; index: number; block: ContentBlock }
  | { type: "updateBlock"; id: string; patch: Partial<ContentBlock> }
  | { type: "removeBlock"; id: string }
  | { type: "moveBlock"; id: string; direction: -1 | 1 }
  | { type: "replaceContent"; blocks: ContentBlock[] }
  | { type: "load"; draft: SubmissionDraft };

export function editorReducer(state: SubmissionDraft, action: EditorAction): SubmissionDraft {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "setTags":
      return { ...state, tags: action.tags };
    case "setAuthor":
      return { ...state, author: { ...state.author, [action.field]: action.value } };
    case "setFeaturedImage":
      return { ...state, featuredImage: action.image };
    case "insertBlock": {
      const content = [...state.content];
      content.splice(Math.max(0, Math.min(action.index, content.length)), 0, action.block);
      return { ...state, content };
    }
    case "updateBlock":
      return {
        ...state,
        content: state.content.map((block) => (block.id === action.id ? ({ ...block, ...action.patch } as ContentBlock) : block)),
      };
    case "removeBlock":
      return { ...state, content: state.content.filter((block) => block.id !== action.id) };
    case "moveBlock": {
      const index = state.content.findIndex((block) => block.id === action.id);
      const target = index + action.direction;
      if (index < 0 || target < 0 || target >= state.content.length) return state;
      const content = [...state.content];
      [content[index], content[target]] = [content[target], content[index]];
      return { ...state, content };
    }
    case "replaceContent":
      return { ...state, content: action.blocks };
    case "load":
      return action.draft;
  }
}
