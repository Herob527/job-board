/// <reference types="astro/client" />

import type { drizzle } from "drizzle-orm/node-postgres";
import type { users } from "./db/schema";
import type jwtService from "./utils/JwtHandler";

declare global {
  interface Deps {
    db: ReturnType<typeof drizzle>;
    user: Omit<typeof users.$inferSelect, "password"> | null;
    jwtService: typeof jwtService;
  }
  namespace App {
    interface Locals extends Deps {}
  }
}
