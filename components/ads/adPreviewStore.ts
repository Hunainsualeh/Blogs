export const AD_PREVIEW_KEY = "gid:adpreview";
const EVENT = "gid-adpreview";

export function subscribeAdPreview(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function readAdPreview() {
  try {
    return window.localStorage.getItem(AD_PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeAdPreview(enabled: boolean) {
  try {
    if (enabled) window.localStorage.setItem(AD_PREVIEW_KEY, "1");
    else window.localStorage.removeItem(AD_PREVIEW_KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}
