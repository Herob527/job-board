/// <reference types="astro/client" />

import type { drizzle } from "drizzle-orm/node-postgres";
import type { users } from "./db/schema";
import type UserService from "./services/UserService";
import type CompanyService from "./services/CompanyService";
import type JobOfferService from "./services/JobOfferService";

declare global {
  interface Deps {
    db: ReturnType<typeof drizzle>;
    user: Omit<typeof users.$inferSelect, "password"> | null;
    jwtService: typeof jwtService;
    userService: InstanceType<typeof UserService>;
    companyService: InstanceType<typeof CompanyService>;
    jobOfferService: InstanceType<typeof JobOfferService>;
  }
  namespace App {
    interface Locals extends Deps {}
  }
}
