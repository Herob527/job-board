import { DatabaseError } from "pg";
import z from "zod";
import {
  company,
  corporateMembership,
  type corporateRoleEnum,
} from "#/db/schema";
import { registerSchema } from "#/features/auth/schema";
import { OPSTATUS } from "./errorCodes";

type Drizzle = ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;

type CorporateRole = (typeof corporateRoleEnum.enumValues)[number];

interface AssignUserToCompany {
  userId: string;
  companyId: string;
  roles: CorporateRole[];
}

export default class CompanyService {
  #db;
  constructor(db: Drizzle) {
    this.#db = db;
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
