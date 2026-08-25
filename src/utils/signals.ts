import { signal } from "@preact/signals";
import type { actions } from "astro:actions";

export const loginSignal = signal<ReturnType<typeof actions.login> | null>(
  null,
);
