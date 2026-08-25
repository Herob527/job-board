/// <reference types="astro/client" />

import type { drizzle } from "drizzle-orm/node-postgres";
import type { users } from "./db/schema";

declare global {
  namespace App {
    interface Locals {
      db: ReturnType<typeof drizzle>;
      user: Omit<typeof users.$inferSelect, "password"> | null;
    }
  }
}
