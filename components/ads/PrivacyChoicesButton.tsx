"use client";

export function PrivacyChoicesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.googlefc = window.googlefc || {};
        window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
        if (typeof window.googlefc.showRevocationMessage === "function") {
          window.googlefc.callbackQueue.push(window.googlefc.showRevocationMessage);
        }
      }}
    >
      Privacy and ad choices
    </button>
  );
}
