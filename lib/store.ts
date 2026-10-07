import type { Submission } from "@/types/submission";

type Store = {
  submissions: Map<string, Submission>;
  subscribers: Set<string>;
};

const globalStore = globalThis as unknown as { __northlineStore?: Store };

export const memoryStore: Store =
  globalStore.__northlineStore ?? (globalStore.__northlineStore = { submissions: new Map(), subscribers: new Set() });
