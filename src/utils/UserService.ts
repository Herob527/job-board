import { company, corporateMembership, users } from "#/db/schema";
import { registerSchema } from "#/features/auth/schema";
import { eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import z from "zod";

type Drizzle = ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;

interface AssignUserToCompany {
  userId: string;
  companyId: string;
  roles: ("company_admin" | "recruiter")[];
}

export enum OPSTATUS {
  SUCCESS,
  // integrity violations
  FOREIGN_KEY_VIOLATION = 23503,
  UNIQUE_VIOLATION = 23505,
  CHECK_VIOLATION = 23514,
  NOT_NULL_VIOLATION = 23502,

  // transaction failure
  INVALID_TRANSACTION_STATE = 25000,

  // connection failure
  CONNECTION_DOES_NOT_EXIST = 8006,

  // other
  UNKNOWN_FAILURE = -1,
}

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
      if (error instanceof DatabaseError) {
        if (error.code === OPSTATUS.UNIQUE_VIOLATION.toString()) {
          return {
            user: null,
            isDuplicate: true,
            isUnknownError: false,
          } as const;
        }
      }

      return { user: null, isDuplicate: false, isUnknownError: true } as const;
    }
  }

  private corporateSchema = registerSchema.and(
    z.object({ registerAs: z.literal("company") }),
  );

  async createCompany(
    input: Pick<
      z.infer<typeof this.corporateSchema>,
      "companyName" | "locations"
    >,
  ) {
    try {
      const companyData = await this.#db
        .insert(company)
        .values({
          location: input.locations,
          name: input.companyName,
        })
        .returning();
      return {
        company: companyData[0],
        isDuplicate: false,
        isUnknownError: false,
      } as const;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === OPSTATUS.UNIQUE_VIOLATION.toString()) {
          return {
            company: null,
            isDuplicate: true,
            isUnknownError: false,
          } as const;
        }
      }

      return {
        company: null,
        isDuplicate: false,
        isUnknownError: true,
      } as const;
    }
  }

  async assignUserToCompany({ userId, companyId, roles }: AssignUserToCompany) {
    try {
      await this.#db.insert(corporateMembership).values({
        userId: userId,
        companyId: companyId,
        subRoles: roles,
      });
      return {
        isSuccess: true,
        isUnknownError: false,
        isDuplicate: false,
      } as const;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === OPSTATUS.UNIQUE_VIOLATION.toString()) {
          return {
            isSuccess: false,
            isUnknownError: false,
            isDuplicate: true,
          } as const;
        }
      }
      return {
        isSuccess: false,
        isUnknownError: true,
        isDuplicate: false,
      } as const;
    }
  }
}
