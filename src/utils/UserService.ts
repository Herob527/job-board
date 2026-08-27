import { DrizzleQueryError, eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import type z from "zod";
import { users } from "#/db/schema";
import type { registerSchema } from "#/features/auth/schema";
import { OPSTATUS } from "./errorCodes";

type Drizzle = ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;

export default class UserService {
  #db;
  constructor(db: Drizzle) {
    this.#db = db;
  }

  async getUserByEmail(email: string) {
    const user = await this.#db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user?.[0];
  }

  async createUser(input: z.infer<typeof registerSchema>, password: string) {
    try {
      const user = await this.#db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
          surname: input.surname,
          password: password,
          roles:
            input.registerAs === "candidate"
              ? ["candidate"]
              : ["candidate", "corporate"],
        })
        .returning();
      return {
        user: user[0],
        isDuplicate: false,
        isUnknownError: false,
      } as const;
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        if (error.cause instanceof DatabaseError) {
          if (error.cause.code === OPSTATUS.UNIQUE_VIOLATION.toString()) {
            return {
              user: null,
              isDuplicate: true,
              isUnknownError: false,
            } as const;
          }
        }
      }

      return { user: null, isDuplicate: false, isUnknownError: true } as const;
    }
  }
}
