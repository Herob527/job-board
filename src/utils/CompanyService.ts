import z from "zod";
import {
  company,
  corporateMembership,
  users,
  type corporateRoleEnum,
} from "#/db/schema";
import { registerSchema } from "#/features/auth/schema";
import { OPSTATUS } from "./errorCodes";
import { getDatabaseError } from "./isDatabaseError";
import { eq } from "drizzle-orm";

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
      "companyName" | "registrationLocation"
    >,
    ownerId: string,
  ) {
    try {
      const companyData = await this.#db
        .insert(company)
        .values({
          registrationLocation: input.registrationLocation,
          name: input.companyName,
          ownerId,
        })
        .returning();
      return {
        company: companyData[0],
        isDuplicate: false,
        isUnknownError: false,
      } as const;
    } catch (error) {
      const dbError = getDatabaseError(error);
      if (dbError && dbError.code === OPSTATUS.UNIQUE_VIOLATION.toString()) {
        return {
          company: null,
          isDuplicate: true,
          isUnknownError: false,
        } as const;
      }

      return {
        company: null,
        isDuplicate: false,
        isUnknownError: true,
      } as const;
    }
  }

  async createJobOffer() {}

  async getCompanyById(id: string) {
    const companyData = await this.#db
      .select({ company, owner: users })
      .from(company)
      .innerJoin(users, eq(users.id, company.ownerId))
      .where(eq(company.id, id))
      .limit(1);
    if (companyData.length === 0) return null;
    return companyData[0];
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
      const dbError = getDatabaseError(error);
      if (dbError && dbError.code === OPSTATUS.UNIQUE_VIOLATION.toString()) {
        return {
          isSuccess: false,
          isUnknownError: false,
          isDuplicate: true,
        } as const;
      }
      return {
        isSuccess: false,
        isUnknownError: true,
        isDuplicate: false,
      } as const;
    }
  }
}
