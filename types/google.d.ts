export {};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    googlefc?: {
      callbackQueue?: unknown[];
      showRevocationMessage?: () => void;
    };
  }
}
