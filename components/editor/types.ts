import type { ContentBlock } from "@/types/article";

export type BlockEditorProps<T extends ContentBlock> = {
  block: T;
  onChange: (patch: Partial<T>) => void;
  error?: string;
};
