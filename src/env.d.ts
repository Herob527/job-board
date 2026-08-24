/// <reference types="astro/client" />

import type { drizzle } from "drizzle-orm/node-postgres";

declare global {
  declare namespace App {
    interface Locals {
      db: ReturnType<typeof drizzle>;
    }
  }
}
