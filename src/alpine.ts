import Alpine from "alpinejs";

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

export function initAlpine() {
  if (window.Alpine) {
    return;
  }

  window.Alpine = Alpine;

  Alpine.start();
}
