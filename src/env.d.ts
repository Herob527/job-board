/// <reference types="astro/client" />

import type { drizzle } from "drizzle-orm/node-postgres";
import type { users } from "./db/schema";
import type CompanyService from "./utils/CompanyService";
import type jwtService from "./utils/JwtService";
import type UserService from "./utils/UserService";

declare global {
  interface Deps {
    db: ReturnType<typeof drizzle>;
    user: Omit<typeof users.$inferSelect, "password"> | null;
    jwtService: typeof jwtService;
    userService: InstanceType<typeof UserService>;
    companyService: InstanceType<typeof CompanyService>;
  }
  namespace App {
    interface Locals extends Deps {}
  }
}
