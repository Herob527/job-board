import { ActionError, defineAction } from "astro:actions";
import bcrypt from "bcrypt";
import { company, corporateMembership, users } from "#/db/schema";
import { registerSchema } from "#/features/auth/schema";
import safeExecute from "#/utils/safeExecute";
import { DatabaseError } from "pg";

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
export default defineAction({
  input: registerSchema,
  handler: async (input, context) => {
    const { db } = context.locals;

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const [user, error] = await safeExecute(
      db
        .insert(users)
        .values({
          email: input.email,
          name: input.name,
          surname: input.surname,
          password: hashedPassword,
          roles:
            input.registerAs === "candidate"
              ? ["candidate"]
              : ["candidate", "corporate"],
        })
        .returning(),
    );

    if (error && error instanceof DatabaseError) {
      switch (error.code) {
        case OPSTATUS.UNIQUE_VIOLATION.toString(): {
          throw new ActionError({
            code: "CONFLICT",
            message: "Given user already exists",
          });
        }
      }
      console.error(error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong when creating user",
      });
    }
    if (!user) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went really wrong when creating user",
      });
    }

    if (input.registerAs === "company") {
      const [companyData, error] = await safeExecute(
        db
          .insert(company)
          .values({
            location: input.locations,
            name: input.companyName,
          })
          .returning(),
      );

      if (error && error instanceof DatabaseError) {
        switch (error.code) {
          case OPSTATUS.UNIQUE_VIOLATION.toString(): {
            throw new ActionError({
              code: "CONFLICT",
              message: "Given company already exists",
            });
          }
        }
      }
      if (!companyData) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went really wrong when creating company",
        });
      }
      await db.insert(corporateMembership).values({
        userId: user[0].id,
        companyId: companyData[0].id,
        subRoles: ["company_admin"],
      });
    }
  },
});
