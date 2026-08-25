import { signal } from "@preact/signals";
import type { actions } from "astro:actions";

export const loginSignal = (() => {
  if (import.meta.env.SSR) {
    console.log("SSR", sessionStorage);
    return signal<typeof actions.login | null>(null);
  }
  const storage = sessionStorage.getItem("user");
  if (!storage) {
    return signal<typeof actions.login | null>(null);
  }
  return signal<typeof actions.login | null>(JSON.parse(storage));
})();
